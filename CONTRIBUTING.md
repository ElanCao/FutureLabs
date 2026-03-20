# Contributing to SkillTree Schema

Thanks for helping build the open skill vocabulary for humans and AI agents.

---

## Types of contributions

| Type | How |
|---|---|
| New skill | Add a YAML file to `schemas/examples/` + PR |
| New branch | Propose in an issue first; requires maintainer approval |
| Level correction | PR with updated behavioral description + evidence |
| Bug / schema error | Open an issue with the JSON Schema path and description |

---

## Adding a new skill

### 1. Pick a branch

Choose from the [existing branches](schemas/examples/branches.yaml):
`programming`, `engineering`, `product`, `soft-skills`, `creative`

If your skill doesn't fit any branch, open an issue first.

### 2. Create your YAML file

Use an existing example as a template (e.g., [`python.yaml`](schemas/examples/python.yaml)).

File naming: `schemas/examples/<skill-id>.yaml`

**Required fields:**

```yaml
id: your-skill-id          # URL-safe slug, e.g. "docker" or "rust"
name: Your Skill Name
branch: programming        # must match a branch id
parent_skill_id: null      # or a parent skill id for sub-skills
description: >
  One paragraph about what this skill covers.
icon: "🐳"
max_level: 10
agent_compatible: true     # false for skills that require human experience
community: true            # always true for community contributions
tags: [docker, containers, devops]
prerequisites: []          # list skill ids the learner should have first

levels:
  - level: 1
    title: Novice
    behavioral_description: >
      Concrete description of what someone at this level can DO.
      Use action verbs. No vague adjectives like "familiar with".
    example_evidence:
      - "Specific thing they built or did that demonstrates this level"
    xp_threshold: 0
  # ... continue for levels 2-10
```

**Level quality checklist:**

- [ ] Uses action verbs ("builds", "designs", "diagnoses")
- [ ] Evidence items are specific and verifiable
- [ ] No vague language: ~~"familiar with"~~, ~~"understands broadly"~~, ~~"good knowledge of"~~
- [ ] Levels are clearly differentiated from each other
- [ ] Level 10 is genuinely world-class (rare, not just "senior")

### 3. Validate your file

```bash
npm install -g ajv-cli
ajv validate -s schemas/skilltree.schema.json -d schemas/examples/your-skill.yaml
```

The YAML must parse cleanly and the skill/level objects must match the schema.

### 4. Open a pull request

- Title: `feat(skill): add <skill-name>`
- Body: brief description + which branch + any `parent_skill_id`

---

## Level xp_threshold guidelines

Use these as defaults unless your skill warrants different progression:

| Level | XP | Rough interpretation |
|---|---|---|
| 1 | 0 | Starting point |
| 2 | 100 | ~1 week of focused practice |
| 3 | 300 | ~1 month |
| 4 | 700 | ~3 months |
| 5 | 1400 | ~6–12 months |
| 6 | 2500 | ~2 years |
| 7 | 4000 | ~4 years |
| 8 | 6000 | ~6+ years, industry recognition |
| 9 | 9000 | Master / thought leader |
| 10 | 15000 | World-class |

---

## Code of conduct

Be constructive. Level definitions reflect capability, not worth. Contributions that disparage any skill area or learning path will not be merged.

---

## Maintainers

Maintained by the FutureLabs team. Questions? Open an issue or email `schema@skilltree.dev`.
