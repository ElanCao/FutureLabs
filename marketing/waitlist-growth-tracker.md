# Waitlist Growth Tracker

**Issue:** [FUT-204](/FUT/issues/FUT-204)
**Goal:** ≥100 contacts within 4 weeks of launch
**Updated:** 2026-04-30

---

## Current State

| Metric | Value | Date |
|--------|-------|------|
| Waitlist size | ~0 | 2026-04-30 |
| Resend "General" audience | ~0 | 2026-04-30 |
| Cost per lead (organic) | N/A | — |
| Cost per lead (paid) | N/A | — |

**Infra status:** ✅ Live — `/api/waitlist` deployed, DB persists, Resend syncs, welcome email sends.

---

## Weekly Log

### Week of 2026-04-27

| Source | Signups | Notes |
|--------|---------|-------|
| Direct / organic | 0 | Waitlist surfaces live on homepage + product page |
| Product Hunt | 0 | Blocked on [FUT-208](/FUT/issues/FUT-208) — PH account creation |
| Community seeding | 0 | Blocked on manual account creation (V2EX, Juejin, HN, Reddit) |
| Blog distribution | 0 | Blocked on platform accounts (HN, Reddit, LinkedIn) |
| Paid ads | 0 | Not yet activated |
| Partnerships | 0 | Not yet activated |

---

## Tactics Status

| Tactic | Status | Blocker | Owner |
|--------|--------|---------|-------|
| Product Hunt launch | Content ready | [FUT-208](/FUT/issues/FUT-208) — PH maker account | CEO |
| Community seeding (V2EX, Juejin) | Content ready | Manual account creation | Board/team |
| Community seeding (HN, Reddit) | Content ready | Launch day timing + accounts | Board/team |
| Blog post distribution | Content ready | Platform accounts (HN, Reddit, LinkedIn) | Board/team |
| Paid ads (Twitter/LinkedIn) | Not started | Budget approval + creative | CMO |
| Partnerships / cross-promo | Not started | Outreach list + pitch deck | CMO |

---

## Conversion Surfaces

| Page | CTA | Variant | UTM params |
|------|-----|---------|------------|
| Homepage hero | WaitlistSignup | hero | auto-captured |
| Homepage CTA | WaitlistSignup | inline | auto-captured |
| Product page CTA | WaitlistSignup | inline | auto-captured |
| Blog listing | WaitlistSignup | inline | auto-captured |
| Blog — Verified Skill Claims | WaitlistSignup | inline | auto-captured |
| Blog — Open SkillTree Schema Adoption | WaitlistSignup | inline | auto-captured |
| Blog — Skill Graphs vs Skill Lists | WaitlistSignup | inline | auto-captured |
| Blog — Shipping 520+ Skills | WaitlistSignup | inline | auto-captured |
| Blog — Open SkillTree Schema | WaitlistSignup | inline | auto-captured |
| Blog — Building Skill Taxonomy | WaitlistSignup | inline | auto-captured |
| Blog — Collaborative Future | WaitlistSignup | inline | auto-captured |
| About page | WaitlistSignup | inline | auto-captured |
| Research page | WaitlistSignup | inline | auto-captured |
| Research report — Human-AI Future | WaitlistSignup | inline | auto-captured |
| Contact form | Full contact form | multi-field | auto-captured |

---

## Analytics / Attribution

| Event | Source | Status | Notes |
|-------|--------|--------|-------|
| `waitlist_signup` | `WaitlistSignup` component | Live (2026-04-30) | Fires on success with `page`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` |
| `waitlist_signup_error` | `WaitlistSignup` component | Live (2026-04-30) | Fires on failure with `page`, `error_type` |
| `contact_submit` | Contact form | Live (2026-04-30) | Fires on success with `subject`, `utm_source`, `utm_medium`, `utm_campaign` |
| `contact_submit_error` | Contact form | Live (2026-04-30) | Fires on failure with `error_type` |
| Page view | GA4 | Live | All pages via `GoogleAnalytics` component in `layout.tsx` |

**Dashboard:** GA4 → Events → All events → filter by `waitlist_signup` or `contact_submit`

---

## SEO / Discoverability

| Improvement | Status | Notes |
|-------------|--------|-------|
| Sitemap completeness | Fixed (2026-04-30) | Added `verified-skill-claims-security-era` to `app/sitemap.ts` |
| RSS feed | Live (2026-04-30) | `/feed.xml` — 7 posts, auto-sorted by date, atom self-link |
| Blog page CTA | Live (2026-04-30) | WaitlistSignup mounted on `/blog` below post grid |
| Blog post CTAs (7/7) | Live (2026-04-30) | WaitlistSignup added to all 7 live blog posts |
| About page CTA | Live (2026-04-30) | WaitlistSignup mounted on `/about` below team section |
| Research page CTA | Live (2026-04-30) | WaitlistSignup mounted on `/research` below agenda |
| Research report CTA | Live (2026-04-30) | WaitlistSignup mounted on `/research/human-ai-future` below report content |
| RSS autodiscovery | Live (2026-04-30) | `<link rel="alternate" type="application/rss+xml" href="/feed.xml" />` in `app/layout.tsx` |

## Verification

- **Database:** Check `contactMessage` table for `source = 'waitlist'`
- **Resend:** Check "General" audience growth
- **Plausible:** Track "Signup Complete" events with `utm_campaign` values

---

## Next Actions

1. **Unblock FUT-208** — CEO creates Product Hunt maker account
2. **Create platform accounts** — V2EX, Juejin, HN, Reddit, LinkedIn
3. **Execute community seeding** — Post V2EX + Juejin immediately (no PH dependency)
4. **Execute blog distribution** — Start with HN "Show HN" for Open SkillTree Schema
5. **Evaluate paid ads** — If organic <20 signups by end of Week 2, activate Twitter/LinkedIn ads

---

*Tracker by CMO — FutureLabs*
