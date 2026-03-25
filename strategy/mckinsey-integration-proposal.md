# SkillTree + McKinsey Skill Change Index: Integration Proposal

**Date:** March 25, 2026
**Proposal Owner:** Chief Research Officer
**Status:** Draft for Board Review

---

## Proposal Summary

Integrate McKinsey's Skill Change Index (SCI) into SkillTree to create the **definitive enterprise skill platform** for the AI transition era. This positions SkillTree as the operational layer for McKinsey's research—translating their macro insights into actionable workforce intelligence.

---

## The Opportunity

### McKinsey's Challenge
McKinsey has published groundbreaking research but lacks a practical platform for enterprises to:
- Assess current workforce skills against SCI
- Plan reskilling investments
- Track human-AI skill partnerships
- Measure transition progress

### SkillTree's Advantage
We have the most comprehensive unified skill taxonomy (544 skills, 20 domains) covering both human and AI capabilities. No competitor bridges this gap.

| Competitor | Human Skills | AI Skills | Unified Graph | SCI Integration |
|------------|--------------|-----------|---------------|-----------------|
| LinkedIn |  |  |  |  |
| Workday |  |  |  |  |
| LangSmith |  |  |  |  |
| MLflow |  |  |  |  |
| **SkillTree** |  |  |  | **Proposed** |

---

## Integration Architecture

### 1. SCI Data Layer

```typescript
interface SkillChangeIndex {
  skillId: string;
  sciScore: number;        // 0-100
  confidence: 'high' | 'medium' | 'low';
  scenario: 'midpoint' | 'fast' | 'slow';
  source: 'mckinsey_2025' | 'skilltree_model';
  lastUpdated: Date;
}
```

### 2. New API Endpoints

```
GET /api/v1/skills/:id/sci              # Get SCI score for skill
GET /api/v1/profiles/:id/sci-assessment # Get portfolio SCI exposure
GET /api/v1/teams/:id/skill-gap-analysis # Team-level SCI insights
```

### 3. UI Enhancements

#### Skill Profile View
- Display SCI badge on each skill (Low/Medium/High automation risk)
- Show "Reskilling pathway" suggestions for high-SCI skills
- Highlight AI partnership opportunities

#### Dashboard Widget
```
┌─────────────────────────────────────────┐
│  Team Skill Change Exposure             │
│  ─────────────────────────────────────  │
│  🔴 High Risk (SCI 50+):    12 skills   │
│  🟡 Medium Risk (SCI 30-50): 8 skills   │
│  🟢 Low Risk (SCI <30):     24 skills   │
│                                         │
│  [View Reskilling Recommendations]      │
└─────────────────────────────────────────┘
```

---

## Product Features

### Phase 1: SCI Display (Q2 2026)
- Import McKinsey SCI scores for top 200 work skills
- Display SCI badges on skill profiles
- Add "Automation Risk" filter to skill browser

### Phase 2: Workforce Intelligence (Q3 2026)
- Team-level SCI aggregation
- Reskilling pathway recommendations
- Human-AI skill pairing suggestions

### Phase 3: Predictive Analytics (Q4 2026)
- Custom SCI modeling for organization-specific roles
- Investment ROI calculator for reskilling programs
- Trend forecasting based on job posting analysis

---

## Go-to-Market Positioning

### Primary Message
> "SkillTree: The Operational Platform for the Skill Change Index"

### Target Audience
- **Primary:** Chief Learning Officers, HR Strategy leaders
- **Secondary:** AI workflow architects, operations executives
- **Tertiary:** Consulting firms (McKinsey alumni network)

### Key Value Propositions

1. **"Know Your Risk"**
   Understand which skills in your workforce face automation exposure

2. **"Plan Your Transition"**
   Data-driven reskilling pathways based on McKinsey research

3. **"Partner with AI"**
   Identify human-AI skill partnerships for competitive advantage

---

## Partnership Considerations

### McKinsey Collaboration Options

**Option A: Data Licensing**
- License official SCI scores from McKinsey
- Co-branded "Powered by McKinsey Skill Change Index" badge
- Joint thought leadership content

**Option B: Independent Implementation**
- Create SkillTree SCI scores based on public research
- Cite McKinsey as source
- Maintain independence, avoid licensing fees

**Recommendation:** Start with Option B; pursue Option A after proving market demand.

---

## Technical Implementation

### Schema Updates

```prisma
model SkillSCI {
  id        String   @id @default(uuid())
  skillId   String
  sciScore  Int      // 0-100
  scenario  String   // midpoint, fast, slow
  source    String   // mckinsey_2025
  year      Int      // 2025

  skill     Skill    @relation(fields: [skillId], references: [id])
}

model ProfileSCIAssessment {
  id              String   @id @default(uuid())
  profileId       String
  overallRisk     String   // low, medium, high
  highRiskCount   Int
  mediumRiskCount Int
  lowRiskCount    Int

  profile         Profile  @relation(fields: [profileId], references: [id])
}
```

### Migration Plan
1. Create new tables (non-breaking)
2. Import McKinsey SCI mapping for 200 core skills
3. Backfill assessments for existing profiles
4. Enable UI features via feature flag

---

## Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Skills with SCI scores | 300+ | End of Q2 |
| Profiles with SCI assessment | 1,000+ | End of Q3 |
| Enterprise pilot customers | 3 | End of Q3 |
| SCI-related feature usage | 25% of active users | End of Q4 |

---

## Investment Required

| Resource | Effort | Notes |
|----------|--------|-------|
| Backend engineering | 2 weeks | Schema, API, data import |
| Frontend engineering | 2 weeks | UI components, dashboards |
| Data science | 1 week | SCI mapping, validation |
| Research/Content | 2 weeks | Documentation, positioning |
| **Total** | **7 weeks** | Parallelizable to 4 weeks |

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| McKinsey releases competing product | Low | High | Move fast, establish market position |
| SCI scores become outdated | Medium | Medium | Build update process; version SCI data |
| Enterprise customers uninterested | Medium | High | Validate with 3 pilot customers before build |
| Technical complexity | Low | Low | Phased rollout; start with read-only display |

---

## Recommendation

**Approve Phase 1 implementation.** The McKinsey Skill Change Index integration:

1. **Validates** our unified human-AI skill graph thesis
2. **Differentiates** us from HR tech and MLOps competitors
3. **Opens** enterprise market with credible, research-backed positioning
4. **Aligns** with FutureLabs mission: humans and AI agents living and working together

---

## Next Steps

1. **Board review** of this proposal
2. **CTO feasibility** confirmation
3. **Customer validation** with 2-3 enterprise prospects
4. **Create implementation** issue (FUT-96) upon approval

---

*This proposal is a living document. Feedback and revisions welcome.*
