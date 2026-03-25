# SKILL.md Specification v1.0

## Overview

SKILL.md is an open standard for describing skills in a machine-readable format. It uses YAML frontmatter with Markdown body to create a human-readable, machine-parseable skill definition.

## File Format

A SKILL.md file consists of:
1. **YAML Frontmatter** — structured metadata between `---` delimiters
2. **Markdown Body** — human-readable skill description

## Schema

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | URL-safe unique identifier (kebab-case) |
| `name` | string | Human-readable skill name |
| `version` | string | Semantic version of this skill definition |
| `category` | string | Broad category (e.g., "engineering", "design", "data") |
| `description` | string | One-line description of what this skill covers |
| `created` | date | ISO 8601 date when skill was first defined |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `updated` | date | ISO 8601 date of last modification |
| `author` | string | Author or organization that defined the skill |
| `license` | string | SPDX license identifier |
| `parent` | string | ID of parent skill (for hierarchical relationships) |
| `prerequisites` | array | List of skill IDs required before learning this |
| `related` | array | List of related skill IDs |
| `tags` | array | Free-form tags for discovery |
| `level_count` | integer | Number of levels (1-10, default: 5) |
| `agent_compatible` | boolean | Whether AI agents can hold this skill (default: true) |
| `attestation_required` | boolean | Whether skill claims require verification (default: false) |

### Level Definitions (Optional)

If levels are defined, they go in a `levels` array:

| Field | Type | Description |
|-------|------|-------------|
| `level` | integer | Level number (1 to level_count) |
| `title` | string | Display title (e.g., "Beginner", "Expert") |
| `description` | string | What someone at this level can demonstrably DO |
| `xp_threshold` | integer | XP required to reach this level |
| `evidence_types` | array | Acceptable evidence types |

## Example SKILL.md

```markdown
---
id: python-programming
name: Python Programming
version: 1.0.0
category: engineering
description: Write, debug, and maintain Python code for applications and automation.
created: 2024-01-15
updated: 2024-03-20
author: FutureLabs
license: CC-BY-4.0
parent: software-development
prerequisites:
  - programming-fundamentals
related:
  - data-science
  - machine-learning
  - web-development
tags:
  - programming
  - backend
  - scripting
level_count: 5
agent_compatible: true
attestation_required: false
levels:
  - level: 1
    title: Novice
    description: Can write simple scripts using basic syntax, variables, and control flow.
    xp_threshold: 0
    evidence_types:
      - completed_tutorial
      - simple_script
  - level: 2
    title: Beginner
    description: Can build small applications with functions, modules, and basic error handling.
    xp_threshold: 100
    evidence_types:
      - small_project
      - code_review
  - level: 3
    title: Competent
    description: Can develop production-ready code with testing, documentation, and package management.
    xp_threshold: 500
    evidence_types:
      - production_code
      - open_source_contribution
  - level: 4
    title: Advanced
    description: Can architect complex systems, optimize performance, and mentor others.
    xp_threshold: 2000
    evidence_types:
      - system_design
      - technical_leadership
  - level: 5
    title: Expert
    description: Recognized authority who shapes best practices and advances the ecosystem.
    xp_threshold: 10000
    evidence_types:
      - conference_talk
      - influential_project
      - published_work
---

# Python Programming

Python is a high-level, interpreted programming language known for its readability and versatility.

## Why This Skill Matters

Python powers everything from web applications to data science pipelines to AI/ML systems.

## Learning Path

1. Start with basic syntax and data types
2. Learn control flow and functions
3. Master object-oriented programming
4. Explore domain-specific libraries
5. Contribute to open source

## Assessment Criteria

- Code follows PEP 8 style guidelines
- Proper use of Python idioms and patterns
- Understanding of the standard library
- Ability to debug and optimize code
```

## File Naming Conventions

- Individual skills: `{skill-id}.skill.md` (e.g., `python-programming.skill.md`)
- Skill collections: `SKILL.md` (in a directory of related skills)

## Validation

SKILL.md files can be validated against the JSON Schema at:
`https://futurelabs.vip/standards/skill.md/v1.0/schema.json`

## Relationship to Other Standards

- **SKILL.md** — Individual skill definitions (this spec)
- **SkillTree Schema** — Runtime data model for skill tracking systems
- **Open Badges** — Digital credential format compatible with SKILL.md evidence

## Versioning

This specification follows Semantic Versioning (SemVer):
- MAJOR: Breaking changes to schema structure
- MINOR: New optional fields, backward compatible
- PATCH: Clarifications, examples, documentation

## License

This specification is released under CC-BY-4.0.
