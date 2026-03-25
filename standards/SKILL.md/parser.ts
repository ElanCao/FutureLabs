/**
 * SKILL.md Parser and Validator
 * Reference implementation for the SKILL.md open standard
 * Version: 1.0.0
 */

import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

// Types based on SKILL.md specification
export interface LevelDefinition {
  level: number;
  title: string;
  description: string;
  xp_threshold?: number;
  evidence_types?: EvidenceType[];
}

export type EvidenceType =
  | 'completed_tutorial'
  | 'simple_script'
  | 'small_project'
  | 'code_review'
  | 'production_code'
  | 'open_source_contribution'
  | 'system_design'
  | 'technical_leadership'
  | 'conference_talk'
  | 'influential_project'
  | 'published_work'
  | 'certification'
  | 'peer_assessment'
  | 'portfolio'
  | 'client_work'
  | 'test_result';

export interface SkillMetadata {
  id: string;
  name: string;
  version: string;
  category: string;
  description: string;
  created: string;
  updated?: string;
  author?: string;
  license?: string;
  parent?: string | null;
  prerequisites?: string[];
  related?: string[];
  tags?: string[];
  level_count?: number;
  agent_compatible?: boolean;
  attestation_required?: boolean;
  levels?: LevelDefinition[];
}

export interface ParsedSkill {
  metadata: SkillMetadata;
  body: string;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Parse a SKILL.md file content into metadata and body
 */
export function parseSkill(content: string): ParsedSkill {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    throw new Error('Invalid SKILL.md format: missing YAML frontmatter');
  }

  const [, yamlContent, body] = match;
  const metadata = yaml.load(yamlContent) as SkillMetadata;

  return {
    metadata,
    body: body.trim()
  };
}

/**
 * Parse a SKILL.md file from disk
 */
export function parseSkillFile(filePath: string): ParsedSkill {
  const content = fs.readFileSync(filePath, 'utf-8');
  return parseSkill(content);
}

/**
 * Validate a skill ID (kebab-case, URL-safe)
 */
function validateSkillId(id: string): ValidationError | null {
  if (!id) {
    return { field: 'id', message: 'ID is required', severity: 'error' };
  }
  if (!/^[a-z0-9-]+$/.test(id)) {
    return {
      field: 'id',
      message: 'ID must be kebab-case (lowercase letters, numbers, hyphens only)',
      severity: 'error'
    };
  }
  if (id.length > 50) {
    return { field: 'id', message: 'ID must be 50 characters or less', severity: 'error' };
  }
  return null;
}

/**
 * Validate semantic version string
 */
function validateVersion(version: string): ValidationError | null {
  if (!version) {
    return { field: 'version', message: 'Version is required', severity: 'error' };
  }
  if (!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(version)) {
    return {
      field: 'version',
      message: 'Version must follow Semantic Versioning (e.g., 1.0.0)',
      severity: 'error'
    };
  }
  return null;
}

/**
 * Validate ISO date string
 */
function validateDate(date: string, field: string): ValidationError | null {
  if (!date) return null;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return {
      field,
      message: `${field} must be in ISO 8601 date format (YYYY-MM-DD)`,
      severity: 'error'
    };
  }
  return null;
}

/**
 * Validate a level definition
 */
function validateLevel(level: LevelDefinition, index: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!level.level || level.level < 1 || level.level > 10) {
    errors.push({
      field: `levels[${index}].level`,
      message: 'Level number must be between 1 and 10',
      severity: 'error'
    });
  }

  if (!level.title || level.title.length < 1) {
    errors.push({
      field: `levels[${index}].title`,
      message: 'Level title is required',
      severity: 'error'
    });
  }

  if (!level.description || level.description.length < 10) {
    errors.push({
      field: `levels[${index}].description`,
      message: 'Level description must be at least 10 characters',
      severity: 'error'
    });
  }

  if (level.xp_threshold !== undefined && level.xp_threshold < 0) {
    errors.push({
      field: `levels[${index}].xp_threshold`,
      message: 'XP threshold must be non-negative',
      severity: 'error'
    });
  }

  return errors;
}

/**
 * Validate SKILL.md metadata
 */
export function validateSkill(metadata: SkillMetadata): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Required fields
  const idError = validateSkillId(metadata.id);
  if (idError) errors.push(idError);

  if (!metadata.name) {
    errors.push({ field: 'name', message: 'Name is required', severity: 'error' });
  }

  const versionError = validateVersion(metadata.version);
  if (versionError) errors.push(versionError);

  if (!metadata.category) {
    errors.push({ field: 'category', message: 'Category is required', severity: 'error' });
  }

  if (!metadata.description) {
    errors.push({ field: 'description', message: 'Description is required', severity: 'error' });
  } else if (metadata.description.length < 10) {
    warnings.push({
      field: 'description',
      message: 'Description should be at least 10 characters for clarity',
      severity: 'warning'
    });
  }

  const createdError = validateDate(metadata.created, 'created');
  if (createdError) errors.push(createdError);

  const updatedError = validateDate(metadata.updated!, 'updated');
  if (updatedError) errors.push(updatedError);

  // Validate skill references
  if (metadata.parent && !/^[a-z0-9-]+$/.test(metadata.parent)) {
    errors.push({
      field: 'parent',
      message: 'Parent skill ID must be kebab-case',
      severity: 'error'
    });
  }

  if (metadata.prerequisites) {
    metadata.prerequisites.forEach((prereq, i) => {
      if (!/^[a-z0-9-]+$/.test(prereq)) {
        errors.push({
          field: `prerequisites[${i}]`,
          message: `Prerequisite "${prereq}" must be kebab-case`,
          severity: 'error'
        });
      }
    });
  }

  if (metadata.related) {
    metadata.related.forEach((rel, i) => {
      if (!/^[a-z0-9-]+$/.test(rel)) {
        errors.push({
          field: `related[${i}]`,
          message: `Related skill "${rel}" must be kebab-case`,
          severity: 'error'
        });
      }
    });
  }

  // Validate level_count
  const levelCount = metadata.level_count ?? 5;
  if (levelCount < 1 || levelCount > 10) {
    errors.push({
      field: 'level_count',
      message: 'Level count must be between 1 and 10',
      severity: 'error'
    });
  }

  // Validate levels array
  if (metadata.levels) {
    if (metadata.levels.length > levelCount) {
      warnings.push({
        field: 'levels',
        message: `More levels defined (${metadata.levels.length}) than level_count (${levelCount})`,
        severity: 'warning'
      });
    }

    metadata.levels.forEach((level, i) => {
      errors.push(...validateLevel(level, i));
    });

    // Check for duplicate level numbers
    const levelNumbers = metadata.levels.map(l => l.level);
    const duplicates = levelNumbers.filter((item, index) => levelNumbers.indexOf(item) !== index);
    if (duplicates.length > 0) {
      errors.push({
        field: 'levels',
        message: `Duplicate level numbers found: ${[...new Set(duplicates)].join(', ')}`,
        severity: 'error'
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate a complete SKILL.md file
 */
export function validateSkillFile(filePath: string): ValidationResult & { parsed?: ParsedSkill } {
  try {
    const parsed = parseSkillFile(filePath);
    const result = validateSkill(parsed.metadata);
    return { ...result, parsed };
  } catch (error) {
    return {
      valid: false,
      errors: [{
        field: 'file',
        message: error instanceof Error ? error.message : 'Unknown error',
        severity: 'error'
      }],
      warnings: []
    };
  }
}

/**
 * Serialize skill metadata to SKILL.md format
 */
export function serializeSkill(metadata: SkillMetadata, body: string): string {
  const yamlContent = yaml.dump(metadata, {
    sortKeys: false,
    lineWidth: -1,
    noRefs: true
  });

  return `---\n${yamlContent}---\n\n${body}`;
}

/**
 * CLI entry point for validation
 */
export function runCLI(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
SKILL.md Validator v1.0.0

Usage:
  skillmd validate <file>     Validate a SKILL.md file
  skillmd parse <file>        Parse and display SKILL.md content
  skillmd --help              Show this help message

Examples:
  skillmd validate ./python-programming.skill.md
  skillmd parse ./data-science.skill.md
`);
    process.exit(0);
  }

  const command = args[0];
  const filePath = args[1];

  if (!filePath) {
    console.error('Error: File path required');
    process.exit(1);
  }

  const fullPath = path.resolve(filePath);

  if (command === 'validate') {
    const result = validateSkillFile(fullPath);

    if (result.valid) {
      console.log('✅ Valid SKILL.md file');
      if (result.warnings.length > 0) {
        console.log('\nWarnings:');
        result.warnings.forEach(w => console.log(`  ⚠️  ${w.field}: ${w.message}`));
      }
      process.exit(0);
    } else {
      console.log('❌ Invalid SKILL.md file');
      result.errors.forEach(e => console.log(`  ❌ ${e.field}: ${e.message}`));
      if (result.warnings.length > 0) {
        console.log('\nWarnings:');
        result.warnings.forEach(w => console.log(`  ⚠️  ${w.field}: ${w.message}`));
      }
      process.exit(1);
    }
  } else if (command === 'parse') {
    try {
      const parsed = parseSkillFile(fullPath);
      console.log(JSON.stringify(parsed, null, 2));
      process.exit(0);
    } catch (error) {
      console.error('Error parsing file:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  } else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }
}

// Run CLI if executed directly
if (require.main === module) {
  runCLI();
}
