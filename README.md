# Company Website

The official company website built with [Next.js 14](https://nextjs.org) + [Tailwind CSS](https://tailwindcss.com).

## Local Development

```bash
# Install dependencies
npm install

# Copy env config
cp .env.example .env.local
# Edit .env.local with your values

# Start dev server at http://localhost:3000
npm run dev
```

## Deployment

This repository contains two deployments:

### Company Website (Root)
- **Framework**: Next.js 14 (static export)
- **Hosting**: GitHub Pages
- **URL**: `https://elancao.github.io/FutureLabs`
- **Trigger**: Push to `main`
- **Workflow**: `.github/workflows/pages.yml`

### SkillTree Platform (`platform/`)
- **Framework**: Next.js 14 + Prisma + NextAuth
- **Hosting**: Vercel
- **URL**: `https://futurelabs.vip`
- **Trigger**: Push to `main` with changes in `platform/`
- **Workflow**: `.github/workflows/deploy-platform.yml`

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PLATFORM_PROJECT_ID` | Vercel project ID for platform |
| `DATABASE_URL` | PostgreSQL connection string |
| `DIRECT_URL` | PostgreSQL direct URL (for migrations) |
| `NEXTAUTH_SECRET` | NextAuth.js secret |
| `NEXTAUTH_URL` | NextAuth.js URL |
| `GITHUB_ID` | GitHub OAuth app ID |
| `GITHUB_SECRET` | GitHub OAuth app secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

### CI/CD Workflows

- **`.github/workflows/ci.yml`** — runs lint + build on both website and platform for every push/PR
- **`.github/workflows/pages.yml`** — deploys company website to GitHub Pages on push to `main`
- **`.github/workflows/deploy-platform.yml`** — deploys SkillTree platform to Vercel on push to `main`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Hosting**:
  - Website: GitHub Pages
  - Platform: Vercel
- **CI/CD**: GitHub Actions

## Monitoring

- **Website (GitHub Pages)**: Monitor via GitHub's deployment status and external uptime services
- **Platform (Vercel)**: Built-in analytics, real user monitoring, and deployment health checks available in the Vercel dashboard
