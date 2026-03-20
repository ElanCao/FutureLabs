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

The site is deployed to **Vercel** on every push to `main` (production) or `staging` (preview).

### Branches

| Branch    | Environment | URL                                    |
|-----------|-------------|----------------------------------------|
| `main`    | Production  | `https://example.com` (custom domain)  |
| `staging` | Preview     | `https://staging.example.com` (Vercel) |

### First-time Vercel Setup

1. Create a Vercel project linked to this repository.
2. Set the following **GitHub repository secrets**:
   - `VERCEL_TOKEN` — your Vercel API token
   - `VERCEL_ORG_ID` — found in Vercel project settings
   - `VERCEL_PROJECT_ID` — found in Vercel project settings
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SITE_URL` — canonical URL (e.g. `https://example.com`)
4. Push to `main` — the GitHub Actions deploy workflow runs automatically.

### Custom Domain

1. In Vercel project → Settings → Domains, add your domain.
2. Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars and in `vercel.json`.
3. Vercel auto-provisions HTTPS via Let's Encrypt.

### CI/CD Workflows

- **`.github/workflows/ci.yml`** — runs lint + build on every push and PR.
- **`.github/workflows/deploy.yml`** — deploys to Vercel on push to `main` (prod) or `staging` (preview).

### Environment Variables

See `.env.example` for all configuration variables with descriptions.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (CDN/edge delivery, auto HTTPS, global regions)
- **CI/CD**: GitHub Actions

## Monitoring

Vercel provides built-in analytics, real user monitoring, and deployment health checks. For uptime alerting, integrate a third-party service (e.g. Better Uptime, Checkly) pointed at your production domain.
