# Phase 2 Metrics Tracker

**Issue:** [FUT-143](/FUT/issues/FUT-143) (Week 8 validation gate) / [FUT-144](/FUT/issues/FUT-144) (Week 12 retrospective)
**Phase:** 2 (2026-04-27 to 2026-07-19)
**Updated:** 2026-05-01

---

## Validation Gates (Week 8 — ~2026-06-22)

| Gate | Target | Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Week 6 | Week 7 | Week 8 | Pass? |
|------|--------|--------|--------|--------|--------|--------|--------|--------|--------|-------|
| KOL pilot CAC | < $50 | — | — | — | — | — | — | — | — | — |
| Signup-to-activation | > 20% | — | — | — | — | — | — | — | — | — |
| Organic traffic growth | > 20% WoW x3 | — | — | — | — | — | — | — | — | — |

---

## Weekly Funnel Snapshot

### Week of 2026-04-27 (Week 1)

| Metric | Value | Source |
|--------|-------|--------|
| Homepage visits | — | GA4 |
| Product page visits | — | GA4 |
| Blog page visits | — | GA4 |
| Waitlist signups | — | `contactMessage` table (`source = 'waitlist'`) |
| Contact form submissions | — | `contactMessage` table |
| Resend "General" audience | ~0 | Resend dashboard |
| Activation events (first skill complete) | — | Plausible / DB |

**Channel attribution (Week 1):**

| Channel | Visits | Signups | Notes |
|---------|--------|---------|-------|
| Direct / organic | — | — | — |
| Product Hunt | — | — | Blocked on [FUT-208](/FUT/issues/FUT-208) |
| Community seeding | — | — | Blocked on account creation |
| Blog distribution | — | — | Blocked on platform accounts |
| Paid ads | — | — | Not activated |
| Partnerships | — | — | Not activated |

---

## KOL Pipeline Tracker

| Round | Candidate | Status | Rate | Posts | Clicks | Signups | CAC | Notes |
|-------|-----------|--------|------|-------|--------|---------|-----|-------|
| 1 | Jacob Evans | — | $2K | — | — | — | — | CEO ownership ([FUT-151](/FUT/issues/FUT-151)) |
| 1 | 苏剑林 | — | ~$2K | — | — | — | — | CEO ownership |
| 1 | Misha Laskin | — | $2K | — | — | — | — | CEO ownership |
| 1 | 程序员鱼皮 | — | ~$2K | — | — | — | — | CEO ownership |

---

## Channel Performance Summary

| Channel | Phase 2 Investment | Signups | CAC | Activation Rate | Decision |
|---------|-------------------|---------|-----|-----------------|----------|
| Product Hunt | — | — | — | — | TBD |
| Community seeding (V2EX, Juejin) | — | — | — | — | TBD |
| Community seeding (HN, Reddit) | — | — | — | — | TBD |
| Blog distribution (HN, Reddit, LinkedIn) | — | — | — | — | TBD |
| Paid ads (Twitter/LinkedIn) | — | — | — | — | TBD |
| Partnerships / cross-promo | — | — | — | — | TBD |
| KOL pilots | — | — | — | — | TBD |

---

## Audience Hypothesis Check (A2: AI-curious mid-career engineers)

| Check | Method | Result |
|-------|--------|--------|
| Are signups coming from technical communities? | UTM source analysis | — |
| Is the skill graph feature resonating? | Activation rate | — |
| Are blog posts driving organic discovery? | Referral traffic | — |
| Is the SKILL.md standard gaining traction? | GitHub stars, schema adoptions | — |

---

## What Worked / What Didn't / What to Retire

| Category | Item | Evidence | Decision |
|----------|------|----------|----------|
| **Worked** | — | — | Keep |
| **Worked** | — | — | Keep |
| **Mixed** | — | — | Iterate |
| **Didn't work** | — | — | Retire |

---

## Data Collection Sources

| Data | Source | URL / Path |
|------|--------|------------|
| Website traffic | GA4 | GA4 → Reports → Engagement → Pages and screens |
| Waitlist signups | PostgreSQL | `SELECT COUNT(*) FROM "contactMessage" WHERE source = 'waitlist';` |
| Activation events | Plausible | Plausible dashboard → Custom events → `skill_complete` |
| Email audience | Resend | Resend dashboard → Audiences → General |
| KOL spend | Financial records | — |
| UTM attribution | GA4 + DB | `utmSource`, `utmMedium`, `utmCampaign` on user records |

---

*Tracker by CMO — FutureLabs*
