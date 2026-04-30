# Product Hunt Gallery Assets

**Status:** Mockups Complete — Pending Real Screenshots
**Task:** [FUT-121](/FUT/issues/FUT-121)

---

## Overview

This directory contains HTML-based mockups for the 5 Product Hunt gallery images. These mockups can be:

1. **Rendered to PNG** using a headless browser (Puppeteer, Playwright)
2. **Refined with real screenshots** once [FUT-109](/FUT/issues/FUT-109) infrastructure is resolved
3. **Sent to a contract designer** as exact specifications

---

## Assets

### Asset 1: Hero Image — "Your Skills, Visualized"
**File:** `asset-01-hero.html`

| Spec | Value |
|------|-------|
| Dimensions | 2400×1600px |
| Background | Gradient (Deep Purple #6366F1 → Teal #14B8A6) |
| Elements | Profile card, skill tree visualization, stats panel |

**Content:**
- Left: User profile card with avatar, name, stats (47 skills, 12 collaborations, 94 trust score)
- Center: Interactive skill tree with 20+ nodes in domain-coded colors
- Right: Stats panel showing Level 7, skills count, collaborations
- Bottom: Headline "The skill passport for humans and AI agents"

---

### Asset 2: Skill Tree Visualization
**File:** `asset-02-visualization.html`

| Spec | Value |
|------|-------|
| Dimensions | 2400×1600px |
| Background | White with light UI chrome |
| Theme | Light mode |

**Content:**
- App-like interface with sidebar showing domain filters
- Central skill tree showing JavaScript → TypeScript → React → Advanced Patterns learning path
- Animated connection lines (dashed, flowing)
- 3 callout bubbles: "520+ Skills", "Prerequisites Mapped", "Your Unique Path"

---

### Asset 3: Human-AI Collaboration
**File:** `asset-03-collaboration.html`

| Spec | Value |
|------|-------|
| Dimensions | 2400×1600px |
| Background | Light gradient (slate → indigo tint) |
| Layout | Split screen with flow diagram |

**Content:**
- Left: Human profile card (Jane Developer, 94 trust score, React expertise)
- Center: Collaboration flow showing skill match
- Right: AI Agent profile card (DevBot Pro, 96 trust score, requesting Frontend Dev)
- Bottom: 3 feature callouts with icons

---

### Asset 4: Gamification & Progress
**File:** `asset-04-gamification.html`

| Spec | Value |
|------|-------|
| Dimensions | 2400×1600px |
| Background | Dark mode (slate-900) with purple/teal glows |
| Theme | Dark mode with vibrant accents |

**Content:**
- Left: Badge collection (4 unlocked: First Skill, 10 Collabs, Domain Expert, AI Collab)
- Center: Large level ring showing "5 → 6" progression with XP bar
- Right: Skill progress rings (React 85%, Node.js 62%, AI/ML 45%)
- Animation: Shimmering XP bar, floating level-up notification

---

### Asset 5: Open Schema & Portability
**File:** `asset-05-openschema.html`

| Spec | Value |
|------|-------|
| Dimensions | 2400×1600px |
| Background | Dark with grid pattern |
| Theme | Developer-focused, technical |

**Content:**
- Left: Code editor showing SKILL.md YAML export
- Right: Export options (SKILL.md, GitHub integration, Public URL)
- Floating cards: "Synced to GitHub", "Open Schema Verified"
- Badge: "Open Source" prominently displayed

---

## Technical Specs

### Static Images
- **Format:** JPEG (rendered), PNG preferred by PH but JPEG accepted
- **Dimensions:** 2400×1600px (2:3 ratio, Product Hunt optimal)
- **Color space:** sRGB
- **File size target:** < 500KB each

### Rendering Instructions

Assets were rendered from HTML mockups using a headless browser. If re-rendering is needed:

```javascript
const puppeteer = require('puppeteer');

async function capture(url, output) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 2400, height: 1600 });
  await page.goto(`file://${url}`);
  await page.screenshot({ path: output, type: 'jpeg', quality: 90 });
  await browser.close();
}

// Capture all assets
capture('asset-01-hero.html', 'asset-01-hero.jpg');
capture('asset-02-visualization.html', 'asset-02-visualization.jpg');
// ... etc
```

---

## Next Steps

### Option A: Render Mockups — ATTEMPTED, BLOCKED
- [x] Created render.js script with Playwright
- [x] Installed Playwright Chromium
- [ ] ~~Render HTML to PNG~~ — **BLOCKED**: Missing system dependencies (libatk-1.0.so.0)

**To complete:** Install system deps: `sudo apt-get install libatk-bridge2.0 libgtk-3-0`

### Option B: Capture Real Screenshots (NOW UNBLOCKED ✅)
1. ~~Wait for [FUT-109](/FUT/issues/FUT-109) infrastructure resolution~~ ✅ **RESOLVED**
2. Navigate to skilltree.futurelabs.vip and capture actual product screenshots
3. Annotate/edit if needed for gallery format
4. Export final 2400×1600px PNG assets

**Status:** Platform is live and accessible. Screenshots can be captured now.

### Option C: Hire Designer
1. Use these HTML files as interactive specs
2. Send to contract designer ($500-1,000 budget approved)
3. Designer creates polished assets based on exact layout
4. Designer handles rendering with proper tools
5. CMO reviews and approves

**Current Status:** 5 HTML mockups complete and ready for use as designer specs or direct rendering if deps are installed.

---

## Blocker Status

| Blocker | Status | Impact |
|---------|--------|--------|
| [FUT-109](/FUT/issues/FUT-109) — GitHub connectivity | ✅ **RESOLVED** | Platform is live — real screenshots now possible |

**Recommendation:** Proceed with **Option B** — capture real screenshots from the live platform at skilltree.futurelabs.vip. This produces more authentic gallery assets than mockups.

---

## Related Documents

- [Design Brief](/marketing/producthunt-gallery-assets.md)
- [Contractor Spec](/marketing/producthunt-assets-design-spec.md)
- [Product Hunt Launch Plan](/marketing/producthunt-launch.md)
- [MASTER_INDEX](/marketing/MASTER_INDEX.md)

---

*Created by CMO, FutureLabs — 2026-04-08*
