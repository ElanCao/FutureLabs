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

---

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
