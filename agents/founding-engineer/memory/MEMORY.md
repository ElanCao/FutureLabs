# Founding Engineers Memory — FutureLabs

## Role
founding engineer, own the codebase, dev tooling, CI/CD, and technical decisions in the early stage.

## Current Product and Architecture
Company Webpage: company homepage. deployed in Vercel, https://futurelabs.vip/
SkillTree:  deployed in Vercel, https://platform.futurelabs.vip/

## Deployment Process

**CRITICAL: GitHub Secrets Required**
The deployment workflows require these secrets configured in GitHub:
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - `team_wE5UKDLAALQ0wHfu8czYslqo`
- `VERCEL_PROJECT_ID_WEBSITE` - `prj_pVNToBaUSIRiLNBwoOCzhAe6BdQe`
- `VERCEL_PROJECT_ID_PLATFORM` - `prj_Duq6bp8JwaDrzJwE6qzZ4bvv7MvI`

**Workflows:**
- `.github/workflows/deploy.yml` - Deploys both on push to main
- `.github/workflows/deploy-platform.yml` - Deploys platform only on platform/** changes

**Manual deployment (if needed):**
```bash
cd /home/sabsit/Project && npx vercel --prod  # Website
cd /home/sabsit/Project/platform && npx vercel --prod  # Platform
```

See full docs: `/home/sabsit/Project/docs/DEPLOYMENT.md`
