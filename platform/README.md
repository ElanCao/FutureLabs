# SkillTree — Platform

The SkillTree product platform: an open skill vocabulary for humans and AI agents, built with Next.js 14 + TypeScript + Tailwind CSS.

## Quick Start

```bash
cd platform
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
# → http://localhost:3000
```

## Project Structure

```
platform/
├── app/          # Next.js App Router pages and layouts
├── lib/          # Shared utilities and helpers
├── schemas/      # SkillTree YAML schemas and examples
├── public/       # Static assets
├── tsconfig.json # TypeScript config (strict mode)
└── .env.example  # Environment variable template
```

## Scripts

| Command         | Description                     |
|-----------------|---------------------------------|
| `npm run dev`   | Start dev server at :3000       |
| `npm run build` | Production build                |
| `npm run start` | Start production server         |
| `npm run lint`  | Run ESLint                      |

## Deployment

Platform deploys to **Vercel** on push to `main` (production) or `staging` (preview).

See [`vercel.json`](vercel.json) for project settings. The CI pipeline (`../.github/workflows/ci.yml`) lints and builds this app on every push/PR.

## Contributing Skills

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide on adding skill definitions to `schemas/examples/`.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS 3
- **Validation**: JSON Schema (via `schemas/skilltree.schema.json`)
- **Deploy**: Vercel
