# SkillTree — Open Skill Schema

**An open, machine-readable schema for human and AI agent skill trees.**

SkillTree is a platform where humans and AI agents share the same skill vocabulary. This repository defines the open schema that powers it — and that anyone can build on.

[![Schema version](https://img.shields.io/badge/schema-v1.0.0-blue)](schemas/skilltree.schema.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Why an open schema?

Most skill systems are proprietary, vague ("3 years of experience"), or siloed to one platform. SkillTree proposes a shared vocabulary:

- **Machine-readable** — JSON Schema + YAML files consumable by APIs, AI orchestration platforms, and HR tools
- **Hierarchical** — skills nest naturally (`Python` → `Pandas` → `Pandas Performance`)
- **Level-described** — each of 10 levels has a *concrete behavioral description*, not adjectives
- **Extensible** — community can propose new skills and levels via pull request
- **Agent-compatible** — the same schema applies to human users *and* AI agents (forward-looking)

---

## Schema Overview

### Core types

| Type | Description |
|---|---|
| `Branch` | Top-level category (e.g., Programming, Engineering, Soft Skills) |
| `Skill` | An individual skill within a branch; may have a `parent_skill_id` |
| `SkillLevel` | Level 1–10 descriptor with behavioral description, evidence examples, and XP threshold |
| `EvidenceRecord` | A piece of evidence supporting a skill claim (certificate, project, PR, etc.) |
| `UserSkillRecord` | A user's or agent's current state for a skill (level + XP + evidence) |
| `Profile` | A human or AI agent profile with their full skill tree |

### Formal JSON Schema

→ [`schemas/skilltree.schema.json`](schemas/skilltree.schema.json)

Compliant with JSON Schema Draft-07. Suitable for use with `ajv`, `jsonschema`, or any Draft-07 validator.

---

## Skill Branches

| Branch | ID | Description |
|---|---|---|
| Programming Languages | `programming` | Python, JavaScript, Java, C#, Go, Rust, etc. |
| Engineering Practices | `engineering` | System Design, Testing, DevOps, Security |
| Product | `product` | PM, UX Research, Data Analysis |
| Soft Skills | `soft-skills` | Communication, Leadership, Project Management |
| Creative | `creative` | UI/UX Design, Copywriting, Brand Design |

---

## Level System

Each skill defines 10 proficiency levels. Levels use **action verbs and observable outcomes**, not vague adjectives.

| Level | Label | Meaning |
|---|---|---|
| 1 | Novice | Can perform basics with guidance |
| 2 | Beginner | Can perform independently on simple tasks |
| 3 | Apprentice | Handles common scenarios; understands core concepts |
| 4 | Practitioner | Applies skill in production; recognizes trade-offs |
| 5 | Competent | Leads work in this area; handles edge cases |
| 6 | Skilled | Deep expertise; fixes others' hard problems |
| 7 | Advanced | Org-level impact; mentors others |
| 8 | Expert | Industry recognition; shapes community practice |
| 9 | Master | Defines field standards; teaches at scale |
| 10 | World-Class | Global authority; work impacts millions |

---

## Example Skill Files

Human-readable YAML examples in [`schemas/examples/`](schemas/examples/):

- [`python.yaml`](schemas/examples/python.yaml) — Python (with Pandas child skill)
- [`system-design.yaml`](schemas/examples/system-design.yaml) — System Design
- [`communication.yaml`](schemas/examples/communication.yaml) — Communication
- [`ux-design.yaml`](schemas/examples/ux-design.yaml) — UX Design
- [`branches.yaml`](schemas/examples/branches.yaml) — All branch definitions

---

## Quick Start

### Validate a skill file

```bash
npm install -g ajv-cli
ajv validate -s schemas/skilltree.schema.json -d schemas/examples/python.yaml
```

### Minimal skill definition

```yaml
id: typescript
name: TypeScript
branch: programming
parent_skill_id: null
description: Typed superset of JavaScript.
icon: "🔷"
max_level: 10
agent_compatible: true
community: false
tags: [typescript, javascript, frontend, backend]
prerequisites: []

levels:
  - level: 1
    title: Novice
    behavioral_description: Can add type annotations to existing JS code and fix basic type errors.
    example_evidence:
      - "Added types to a JavaScript module without breaking build"
    xp_threshold: 0
  # ... levels 2-10
```

---

## AI Agent Compatibility

Skills with `agent_compatible: true` can be assigned to AI agents, not just humans. The `entity_type` field on a `Profile` is either `"human"` or `"ai_agent"`.

This means the same skill tree can describe:
- A human engineer with Python level 7
- An AI coding agent with Python level 5

Same schema. Same vocabulary. Interoperable profiles.

---

## Contributing

We welcome new skills, level corrections, and branch proposals. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT — free to use, modify, and redistribute. See [LICENSE](LICENSE).
