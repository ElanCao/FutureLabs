# SKILL.md Open Standard v1.0.0

> A human-readable, machine-parseable format for describing skills

## Quick Start

```bash
# Validate a SKILL.md file
npx skillmd validate ./my-skill.skill.md

# Parse a SKILL.md file
npx skillmd parse ./my-skill.skill.md
```

## What is SKILL.md?

SKILL.md is an open standard for describing skills in a format that both humans and machines can understand. It uses YAML frontmatter with Markdown body, making it:

- **Readable**: Plain text that renders nicely in GitHub, VS Code, etc.
- **Portable**: Works with any tool that reads YAML and Markdown
- **Extensible**: Optional fields allow domain-specific extensions
- **Versioned**: Semantic versioning for skill definitions

## File Structure

```markdown
---
id: my-skill
name: My Skill
version: 1.0.0
category: engineering
description: Brief description of what this skill covers.
created: 2024-01-15
---

# My Skill

Detailed description in Markdown...
```

## Specification

See [specification.md](./specification.md) for the complete specification.

## Schema

JSON Schema for validation: [schema.json](./schema.json)

Online: `https://futurelabs.vip/standards/skill.md/v1.0/schema.json`

## Reference Implementation

TypeScript parser and validator: [parser.ts](./parser.ts)

### Usage

```typescript
import { parseSkillFile, validateSkill, serializeSkill } from './parser';

// Parse a SKILL.md file
const skill = parseSkillFile('./python.skill.md');
console.log(skill.metadata.name);
console.log(skill.body);

// Validate metadata
const result = validateSkill(skill.metadata);
if (!result.valid) {
  console.log(result.errors);
}

// Serialize back to SKILL.md format
const output = serializeSkill(skill.metadata, skill.body);
```

## Examples

- [React Development](./examples/react-development.skill.md)
- [Data Analysis](./examples/data-analysis.skill.md)
- [UX Research](./examples/ux-research.skill.md)

## Integration with SkillTree

SKILL.md is the native format for SkillTree. Skills defined in SKILL.md can be:

- Imported into SkillTree systems
- Used for agent capability declarations
- Referenced in human skill profiles
- Validated against the official schema

## Contributing

This standard is maintained by FutureLabs. To propose changes:

1. Open an issue describing the change
2. Discuss with the community
3. Submit a PR with updated spec and tests

## License

This specification is released under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).

Reference implementation is released under [MIT License](./LICENSE).
