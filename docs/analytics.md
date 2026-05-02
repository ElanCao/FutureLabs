# Analytics & Telemetry Baseline

Phase 2 funnel measurement for the Week 8 validation gate (CAC < $50,
sign-up-to-activation > 20%, organic traffic growth > 20% WoW).

## Tooling

| Surface | Tool | Reason |
|---|---|---|
| Marketing site (`futurelabs.vip`) | **Google Analytics 4** | Already integrated and live; broad blog/SEO support; free. |
| Product app (`platform.futurelabs.vip`) | **Plausible** | Privacy-first, cookie-less, lightweight script suited to the in-app skill-tree experience (FUT-153). |

The original FUT-136 plan was a single-tool rollout (Plausible site-wide).
The website later migrated to GA4 in FUT-204 (`0d05248`) when the waitlist
funnel was launched, since GA4 was already wired into the blog and the team
needed funnel data immediately. Plausible still owns the product-app surface.

## Event Taxonomy

| Event | Fired On | Where (file) | Tool |
|---|---|---|---|
| `waitlist_signup_submit` | `WaitlistSignup` form submit (intent) | `app/components/WaitlistSignup.tsx` | GA4 |
| `signup_complete` | `WaitlistSignup` form success (post-API) | `app/components/WaitlistSignup.tsx` | GA4 |
| `waitlist_signup_error` | `WaitlistSignup` API error | `app/components/WaitlistSignup.tsx` | GA4 |
| `contact_submit` | Contact form success (`/contact`) | `app/contact/page.tsx` | GA4 |
| `contact_submit_error` | Contact form error (`/contact`) | `app/contact/page.tsx` | GA4 |
| `skill_search` | Search submit on `/explore` | `platform/app/explore/page.tsx` | Plausible |
| `skill_explore` | ReactFlow node click | `platform/app/components/SkillTreeGraph.tsx` | Plausible |
| `skill_complete` | Skill marked complete on dashboard | `platform/app/dashboard/page.tsx` | Plausible |
| `share_card_generated` | Share card render success | `platform/app/components/ShareCard.tsx` | Plausible |

### Event props (common)

| Prop | Type | Purpose |
|---|---|---|
| `page` | string | Page where the event fired (`homepage`, `blog`, `pricing`, …) |
| `utm_source` / `utm_medium` / `utm_campaign` / `utm_content` | string | Attribution from URL (see UTM Convention) |
| `query` | string | Search query (skill_search only) |
| `skill_id` | string | Skill identifier (skill_explore / skill_complete / share_card_generated) |
| `error_type` | string | Error classification (`*_error` events only) |

## UTM Convention

All marketing links must carry these query params so attribution survives
landing-page navigation. The waitlist component reads `utm_*` from the URL
and forwards them on the GA event and the API call (which also stores them
on the welcome email tags via Resend).

| Param | Convention | Examples |
|---|---|---|
| `utm_source` | Platform / referrer | `twitter`, `linkedin`, `producthunt`, `newsletter`, `kol_{slug}` |
| `utm_medium` | Channel type | `social`, `email`, `organic`, `paid`, `referral` |
| `utm_campaign` | Campaign name | `phase2_launch`, `ph_launch_week`, `blog_{slug}`, `waitlist_v2` |
| `utm_content` | (optional) Creative variant | `variant_a`, `variant_b`, `carousel_1` |
| `utm_term` | (optional) Keyword | `ai_skill_tree`, `resume_alternative` |

## Funnel Definitions (Week 8 Validation Gate)

| Stage | Metric | Source |
|---|---|---|
| Awareness | Organic traffic growth > 20% WoW | GA4 → Reports → Acquisition → Traffic acquisition |
| Acquisition | CAC < $50 | GA4 UTM-attributed sessions ÷ campaign spend (CMO tracker) |
| Activation | Sign-up-to-activation > 20% | `signup_complete` events ÷ `waitlist_signup_submit` events (GA4 Explore) |
| Engagement | Skill explore rate | `skill_explore` events per active session (Plausible) |
| Sharing | Share card rate | `share_card_generated` events ÷ `skill_complete` events (Plausible) |

## Dashboard Access

### GA4 (marketing site)

- Property: `futurelabs.vip` (measurement ID set as `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel).
- To grant CMO/CEO read access:
  1. Sign in as the GA4 property admin (Google account that owns the property).
  2. Admin → Property access management → Add user.
  3. Enter CMO and CEO Google emails, role = **Viewer**, send invitation.
- Direct link once provisioned: `https://analytics.google.com/analytics/web/#/p<PROPERTY_ID>`

### Plausible (platform sub-app)

- Domain: `platform.futurelabs.vip` (hardcoded as `data-domain` on the
  Plausible `<Script>` in `platform/app/layout.tsx`; fixed in FUT-212).
- Account creation pending CMO operating email — see
  [FUT-210](/FUT/issues/FUT-210) and the unblock options on
  [FUT-136](/FUT/issues/FUT-136).
- To grant CMO/CEO read access once the account exists:
  1. Sign in to Plausible as the account owner.
  2. Site settings → Visibility → **Add shared link** → tick "anyone with the
     link", no password.
  3. Paste the generated URL below.
- Plausible shared link: _TBD — pending [FUT-210](/FUT/issues/FUT-210)._

## Adding a New Event

1. Pick the right surface:
   - Marketing site → GA4 via `sendGaEvent(name, params)` (see `WaitlistSignup.tsx`).
   - Product app → Plausible via `trackEvent(name, props)` (`platform/lib/analytics.ts`).
2. Update the **Event Taxonomy** table above with name, file, tool.
3. Use lowercase snake_case names. Keep prop keys consistent across events.
4. Verify in GA4 DebugView (`?_dbg=1`) or Plausible's live event log.

## Notes

- GA4 auto-collects `page_view` and `session_start` — no manual code needed.
- All custom events should ride along with UTM params so funnels can be
  segmented by campaign in GA4 Explore.
- Server-side events (e.g. `signup_persisted` on the API) are **not** wired
  yet; current activation funnel is client-side only. Add server-side GA
  Measurement Protocol calls if/when ad-blocker drop-off becomes material.
