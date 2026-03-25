# "My Skill Map" Viral Sharing Campaign

## Overview

**Campaign Name:** My Skill Map
**Tagline:** "Light up your tree. Share your skills."
**Goal:** Drive organic growth through social sharing of SkillTree profiles
**Target:** 500 shares in first month, 2000 shares by Month 3
**Status:** Planning (requires P0 dev work for share cards)

---

## The Core Mechanic

Users can generate and share beautiful, branded images of their skill tree that are optimized for social media. Think GitHub contribution graphs, but for skills — and much more visual.

### Why This Works

1. **Identity expression** — People love sharing things that reflect who they are
2. **Progress visualization** — Seeing skills as a "tree that grows" is intrinsically motivating
3. **Social proof** — Shared skill trees drive FOMO and curiosity
4. **Low friction** — One-click generation, one-click share
5. **Cross-platform** — Works on Twitter/X, LinkedIn, Instagram, personal blogs

---

## Share Card Variants

### 1. Profile Overview Card
**Dimensions:** 1200 x 630 (Open Graph standard)
**Content:**
- User's skill tree visualization (simplified)
- Total skills count
- Top 3 skill branches
- "Powered by SkillTree" branding
- User's custom tagline (optional)

**Use case:** "This is my skill tree"

### 2. Milestone Achievement Card
**Dimensions:** 1200 x 630
**Content:**
- Large milestone badge (e.g., "100 Skills", "Level 10", "First Collaboration")
- Skill tree highlighting the achievement
- Date achieved
- Shareable quote: "I just reached [milestone] on my SkillTree journey"

**Use case:** Celebrating progress

### 3. Skill Branch Deep-Dive
**Dimensions:** 1080 x 1920 (Stories format)
**Content:**
- Vertical skill branch visualization
- Skills in that branch
- Time invested / progress bar
- "Growing my [Branch Name] skills"

**Use case:** LinkedIn/Twitter threads about specific expertise

### 4. Collaboration Badge
**Dimensions:** 1200 x 630
**Content:**
- "I've collaborated with AI agents on SkillTree"
- Number of collaborations
- Skills enhanced through AI collaboration
- Trust score (if public)

**Use case:** Positioning as AI-forward professional

### 5. Year in Review
**Dimensions:** 1200 x 2400 (long-form)
**Content:**
- Skills added this year
- Collaborations completed
- New branches unlocked
- Top skill growth areas
- Comparison to previous year

**Use case:** Annual recap (December/January)

---

## Technical Requirements (P0 - Needs Dev)

### Backend
- [ ] Dynamic image generation API (Puppeteer/Satori/Playwright)
- [ ] OG image endpoint: `/api/og/[username]`
- [ ] Caching layer for generated images (Redis/CDN)
- [ ] Analytics tracking for share events

### Frontend
- [ ] Share button component with platform selection
- [ ] Preview modal showing how card will look
- [ ] Customization options (background, layout, quote)
- [ ] Download as PNG + Copy link options

### Design
- [ ] 5 share card templates (Figma)
- [ ] Color themes (light/dark, plus brand colors)
- [ ] Mobile-optimized story formats
- [ ] Accessibility compliance (alt text generation)

---

## User Journey

### First-Time Share Flow
1. User completes skill tree setup (onboarding trigger)
2. "Share your tree" CTA appears
3. User clicks → sees preview modal
4. User customizes (optional: tagline, theme)
5. User selects platform → pre-composed post
6. Post goes live with generated image
7. "Thanks for sharing!" + incentive (badge/points)

### Recurring Share Flow
1. User hits milestone (progress trigger)
2. Push notification/email: "You unlocked a new achievement!"
3. One-click share from notification
4. Or: User visits profile → "Share" button always available

---

## Platform-Specific Strategies

### Twitter/X
- **Format:** Profile cards + milestone cards
- **Copy template:** "Just hit [milestone] on my @SkillTree profile 🌳 [link]"
- **Hashtags:** #SkillTree #Skills #AI #CareerGrowth
- **Timing:** Peak hours (9am, 12pm, 5pm local)

### LinkedIn
- **Format:** Profile cards + deep-dive cards
- **Copy template:** Longer-form post about skill development journey
- **Angle:** Professional development, future of work
- **Timing:** Tuesday-Thursday, 8am-10am

### Instagram
- **Format:** Story format (1080x1920)
- **Copy template:** Minimal text, visual focus
- **Stories:** Use poll stickers: "Which skill should I grow next?"
- **Timing:** Evenings (6pm-9pm)

### Hacker News / IndieHackers
- **Format:** "Show HN: My Skill Tree"
- **Angle:** Transparency, building in public
- **Timing:** Weekend mornings

---

## Incentives & Gamification

### Sharing Badges
- **First Share:** "Tree Planter" badge
- **10 Shares:** "Social Butterfly" badge
- **100 Profile Views from Shares:** "Influencer" badge
- **Viral Share (1000+ views):** "Trending" badge

### Profile Benefits
- Shared profiles get "Featured" section boost
- Share count displayed on profile (social proof)
- Exclusive themes unlocked by sharing milestones

### Non-Monetary Incentives
- Early access to new features for active sharers
- Recognition in community newsletter
- "Skill Tree of the Week" feature

---

## Content Calendar

### Week 1-2: Soft Launch
- Team/ambassador shares only
- Test all card variants
- Gather feedback on designs
- Fix any generation issues

### Week 3-4: Public Launch
- In-app announcement
- Email to existing users
- Blog post: "Share Your Skill Tree"
- Social media campaign

### Month 2: Milestone Campaign
- "30 Days of Skill Trees" social series
- Feature top shared profiles
- User testimonials
- Case studies

### Month 3: Integration
- Embed skill trees on personal websites
- GitHub profile integration
- Resume/CV plugins
- Notion widget

---

## Success Metrics

| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Total shares | 500 | 2,000 | 5,000 |
| Share rate (% of users) | 20% | 35% | 50% |
| Avg views per share | 50 | 75 | 100 |
| Click-through to signup | 5% | 8% | 10% |
| Viral coefficient (K) | 0.3 | 0.5 | 0.7 |

## Measurement

### Tracking
- UTM parameters on all share links
- Event tracking: `share_generated`, `share_clicked`, `profile_viewed_from_share`
- Referral attribution in signup flow
- Social listening for brand mentions

### Tools
- Google Analytics 4
- Plausible (privacy-focused alternative)
- Twitter/LinkedIn native analytics
- Custom dashboard for viral metrics

---

## Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Low share rate | A/B test card designs, add more incentives |
| Poor image quality | Invest in high-res generation, test across platforms |
| Spam/abuse | Rate limiting, content guidelines, report mechanism |
| Privacy concerns | Granular privacy controls, opt-in sharing only |
| Technical failures | Fallback to static images, robust error handling |

---

## Open Questions for CEO/Team

1. **Priority:** Is this P0 for launch, or can it come after Product Hunt?
2. **Resources:** Can we allocate dev resources for image generation API?
3. **Design:** Do we have design capacity for 5 card templates?
4. **Timeline:** Target launch date for share feature?
5. **Budget:** Any paid promotion budget for initial traction?

---

## Dependencies

### Blocks on Engineering
- Dynamic OG image generation
- Share event tracking
- Privacy controls for profiles

### Blocks on Design
- Final card templates
- Mobile story formats
- Brand-consistent visual language

### Blocks on Content
- User guide: "How to share your Skill Tree"
- FAQ for sharing features
- Social media templates for team

---

## Next Steps

1. **Get CEO approval** on priority and timeline
2. **Coordinate with Founding Engineer** on technical approach
3. **Brief Design** on card template requirements
4. **Draft user-facing documentation**
5. **Prepare launch campaign** assets

---

*This is a living document. Update as campaign evolves.*
