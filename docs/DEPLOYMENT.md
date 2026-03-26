# Deployment Guide — FutureLabs

## Overview

FutureLabs uses **Vercel** for hosting both the company website and the SkillTree platform. Deployments are automated via GitHub Actions workflows.

## Architecture

| Property | Website | Platform |
|----------|---------|----------|
| **Domain** | futurelabs.vip | platform.futurelabs.vip |
| **Source** | `/` (root) | `/platform/` |
| **Framework** | Next.js 14 | Next.js 14 |
| **Project ID** | `prj_pVNToBaUSIRiLNBwoOCzhAe6BdQe` | `prj_Duq6bp8JwaDrzJwE6qzZ4bvv7MvI` |
| **Org ID** | `team_wE5UKDLAALQ0wHfu8czYslqo` | `team_wE5UKDLAALQ0wHfu8czYslqo` |

## Deployment Methods

### Method 1: Automatic (GitHub Actions) — RECOMMENDED

Deployments trigger automatically on push to `main` branch.

**Workflow files:**
- `.github/workflows/deploy.yml` — Deploys both website and platform
- `.github/workflows/deploy-platform.yml` — Deploys platform only (when platform/** changes)

**Required GitHub Secrets:**

Configure these at: GitHub Repo → Settings → Secrets and variables → Actions

| Secret | Value | Purpose |
|--------|-------|---------|
| `VERCEL_TOKEN` | `vcp_...` | Vercel API token |
| `VERCEL_ORG_ID` | `team_wE5UKDLAALQ0wHfu8czYslqo` | Vercel organization |
| `VERCEL_PROJECT_ID_WEBSITE` | `prj_pVNToBaUSIRiLNBwoOCzhAe6BdQe` | Website project |
| `VERCEL_PROJECT_ID_PLATFORM` | `prj_Duq6bp8JwaDrzJwE6qzZ4bvv7MvI` | Platform project |

**Additional secrets for Platform (if using auth/database):**
| `DATABASE_URL` | PostgreSQL connection |
| `NEXTAUTH_SECRET` | NextAuth.js secret |
| `NEXTAUTH_URL` | https://platform.futurelabs.vip |
| `GITHUB_ID` | OAuth app ID |
| `GITHUB_SECRET` | OAuth app secret |

### Method 2: Manual (Vercel CLI)

For emergency deployments or testing:

```bash
# Install Vercel CLI
npm install -g vercel

# Website
cd /home/sabsit/Project
vercel --prod

# Platform
cd /home/sabsit/Project/platform
vercel --prod
```

**Note:** Requires `VERCEL_TOKEN` environment variable or local Vercel login.

## Verification

After deployment, verify:

1. **Website**: https://futurelabs.vip
   - Nav shows "FutureLabs" with logo
   - Links work correctly

2. **Platform**: https://platform.futurelabs.vip
   - Shows "SkillTree" branding
   - User menu in top-right
   - All routes accessible

## Troubleshooting

### Deployment fails with "secrets not found"
- Verify GitHub secrets are configured correctly
- Check secret names match exactly (case-sensitive)

### Old version still showing
- Clear browser cache / hard refresh (Ctrl+Shift+R)
- Check Vercel dashboard for deployment status
- Verify the correct branch was deployed

### Build fails
- Check build logs in GitHub Actions
- Ensure all environment variables are set
- Verify Node.js version compatibility (v20)

## Emergency Contacts

- **Vercel Dashboard**: https://vercel.com/futurelabs
- **Founding Engineer**: Check agent memory for current status
- **CTO**: Escalate via Paperclip if deployment issues persist

## History

- **2026-03-26**: Standardized deployment workflows and documented secrets requirements
- **2026-03-25**: Added automated GitHub Actions workflows for both website and platform
