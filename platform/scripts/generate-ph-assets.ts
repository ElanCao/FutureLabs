#!/usr/bin/env tsx
/**
 * Generate Product Hunt screenshot assets using SVG + Sharp
 * Creates placeholder images that match the SkillTree UI design
 */

import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../public/ph-assets');

// Color palette matching SkillTree design
const COLORS = {
  bgDeep: '#050d1a',
  bgMid: '#071428',
  bgLight: '#0c1628',
  electricBlue: '#0ea5e9',
  violet: '#7c3aed',
  violetLight: '#a78bfa',
  white: '#ffffff',
  gray400: '#94a3b8',
  gray600: '#475569',
  gray800: '#1e293b',
  gray900: '#0f172a',
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateHeroScreenshot() {
  const svg = `
  <svg width="1440" height="900" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${COLORS.bgDeep}"/>
        <stop offset="100%" stop-color="${COLORS.bgMid}"/>
      </linearGradient>
      <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${COLORS.violetLight}"/>
        <stop offset="100%" stop-color="${COLORS.violet}"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1440" height="900" fill="url(#bg)"/>

    <!-- Header -->
    <rect x="0" y="0" width="1440" height="56" fill="${COLORS.bgDeep}" opacity="0.9"/>
    <text x="20" y="36" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#8b5cf6">🌳 SkillTree</text>
    <text x="140" y="36" font-family="system-ui, sans-serif" font-size="14" fill="#9ca3af">/ Alex Chen / Skill Tree</text>
    <text x="1300" y="36" font-family="system-ui, sans-serif" font-size="12" fill="#6b7280">12 skills</text>

    <!-- Profile strip -->
    <rect x="0" y="56" width="1440" height="80" fill="${COLORS.bgLight}" opacity="0.5"/>
    <circle cx="40" cy="96" r="24" fill="#374151"/>
    <text x="40" y="102" font-size="24" text-anchor="middle">👩‍💻</text>
    <text x="80" y="90" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="white">Alex Chen</text>
    <text x="80" y="110" font-family="system-ui, sans-serif" font-size="12" fill="#6b7280">@alex</text>

    <!-- Branch stats -->
    <text x="1100" y="85" font-size="20" text-anchor="middle">💻</text>
    <text x="1100" y="105" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#0ea5e9" text-anchor="middle">8</text>
    <text x="1100" y="120" font-family="system-ui, sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">Code</text>

    <text x="1180" y="85" font-size="20" text-anchor="middle">🎨</text>
    <text x="1180" y="105" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#a855f7" text-anchor="middle">3</text>
    <text x="1180" y="120" font-family="system-ui, sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">Design</text>

    <text x="1260" y="85" font-size="20" text-anchor="middle">⚡</text>
    <text x="1260" y="105" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#f59e0b" text-anchor="middle">1</text>
    <text x="1260" y="120" font-family="system-ui, sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">System</text>

    <!-- Skill Tree Visualization (center) -->
    <g transform="translate(720, 500)">
      <!-- Root node -->
      <circle cx="0" cy="-150" r="30" fill="url(#nodeGrad)" opacity="0.9"/>
      <circle cx="0" cy="-150" r="15" fill="white" opacity="0.9"/>

      <!-- Level 1 branches -->
      <line x1="0" y1="-120" x2="-100" y2="-50" stroke="#7c3aed" stroke-width="4" stroke-linecap="round"/>
      <line x1="0" y1="-120" x2="100" y2="-50" stroke="#7c3aed" stroke-width="4" stroke-linecap="round"/>
      <line x1="0" y1="-120" x2="0" y2="0" stroke="#6d28d9" stroke-width="4" stroke-linecap="round"/>

      <!-- Level 1 nodes -->
      <circle cx="-100" cy="-50" r="20" fill="#7c3aed"/>
      <circle cx="-100" cy="-50" r="10" fill="#c4b5fd"/>
      <text x="-100" y="-20" font-family="system-ui, sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">TypeScript</text>

      <circle cx="100" cy="-50" r="20" fill="#7c3aed"/>
      <circle cx="100" cy="-50" r="10" fill="#c4b5fd"/>
      <text x="100" y="-20" font-family="system-ui, sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">React</text>

      <circle cx="0" cy="0" r="16" fill="#6d28d9"/>
      <circle cx="0" cy="0" r="8" fill="#ddd6fe"/>
      <text x="0" y="30" font-family="system-ui, sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Node.js</text>

      <!-- Level 2 branches -->
      <line x1="-100" y1="-30" x2="-150" y2="50" stroke="#5b21b6" stroke-width="3" stroke-linecap="round"/>
      <line x1="-100" y1="-30" x2="-50" y2="60" stroke="#5b21b6" stroke-width="3" stroke-linecap="round"/>
      <line x1="100" y1="-30" x2="50" y2="60" stroke="#5b21b6" stroke-width="3" stroke-linecap="round"/>
      <line x1="100" y1="-30" x2="150" y2="50" stroke="#5b21b6" stroke-width="3" stroke-linecap="round"/>

      <!-- Level 2 nodes -->
      <circle cx="-150" cy="50" r="12" fill="#5b21b6"/>
      <text x="-150" y="75" font-family="system-ui, sans-serif" font-size="9" fill="#64748b" text-anchor="middle">Testing</text>

      <circle cx="-50" cy="60" r="12" fill="#5b21b6"/>
      <text x="-50" y="85" font-family="system-ui, sans-serif" font-size="9" fill="#64748b" text-anchor="middle">Next.js</text>

      <circle cx="50" cy="60" r="12" fill="#5b21b6"/>
      <text x="50" y="85" font-family="system-ui, sans-serif" font-size="9" fill="#64748b" text-anchor="middle">Vue</text>

      <circle cx="150" cy="50" r="12" fill="#5b21b6"/>
      <text x="150" y="75" font-family="system-ui, sans-serif" font-size="9" fill="#64748b" text-anchor="middle">CSS</text>

      <!-- Connection line -->
      <line x1="150" y1="50" x2="200" y2="-20" stroke="#0ea5e9" stroke-width="1" opacity="0.3" stroke-dasharray="4,4"/>
      <circle cx="200" cy="-20" r="8" fill="#0ea5e9" opacity="0.5"/>
    </g>

    <!-- Controls hint -->
    <text x="720" y="850" font-family="system-ui, sans-serif" font-size="12" fill="#475569" text-anchor="middle">
      Scroll to zoom • Drag to pan • Click nodes for details
    </text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(OUTPUT_DIR, '01-hero-skill-tree.png'));
  console.log('✓ Generated 01-hero-skill-tree.png');
}

async function generateProfileScreenshot() {
  const svg = `
  <svg width="1440" height="900" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${COLORS.bgDeep}"/>
        <stop offset="100%" stop-color="${COLORS.bgMid}"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1440" height="900" fill="url(#bg)"/>

    <!-- Nav -->
    <rect x="0" y="0" width="1440" height="56" fill="${COLORS.bgDeep}" opacity="0.9"/>
    <text x="20" y="36" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#8b5cf6">🌳 SkillTree</text>

    <!-- Main content container -->
    <g transform="translate(220, 80)">
      <!-- Profile header -->
      <text x="0" y="60" font-size="80">👩‍💻</text>
      <text x="100" y="50" font-family="system-ui, sans-serif" font-size="32" font-weight="bold" fill="white">Alex Chen</text>
      <text x="100" y="80" font-family="system-ui, sans-serif" font-size="14" fill="#6b7280">@alex</text>
      <text x="100" y="110" font-family="system-ui, sans-serif" font-size="14" fill="#d1d5db" max-width="400">
        Full-stack engineer. Building the future of human-AI collaboration. Previously Stripe.
      </text>

      <!-- Stats -->
      <text x="100" y="150" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="white">8,420</text>
      <text x="150" y="150" font-family="system-ui, sans-serif" font-size="14" fill="#6b7280">XP</text>

      <text x="220" y="150" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="white">12</text>
      <text x="250" y="150" font-family="system-ui, sans-serif" font-size="14" fill="#6b7280">skills</text>

      <text x="330" y="150" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="white">5.2</text>
      <text x="370" y="150" font-family="system-ui, sans-serif" font-size="14" fill="#6b7280">avg level</text>

      <!-- Skill Tree Section Header -->
      <text x="0" y="220" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#6b7280" letter-spacing="0.1em">SKILL TREE</text>

      <!-- Skill cards grid (2 columns) -->
      <!-- Card 1: TypeScript -->
      <rect x="0" y="240" width="480" height="140" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="20" y="275" font-size="24">📘</text>
      <text x="50" y="270" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="white">TypeScript</text>
      <text x="50" y="288" font-family="system-ui, sans-serif" font-size="11" fill="#475569">Code Language</text>
      <rect x="400" y="255" width="60" height="24" rx="12" fill="#7c3aed"/>
      <text x="430" y="272" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="white" text-anchor="middle">Lv.7</text>
      <!-- Progress bars -->
      <rect x="20" y="305" width="440" height="8" rx="4" fill="#1e293b"/>
      <rect x="20" y="305" width="350" height="8" rx="4" fill="#7c3aed"/>
      <text x="20" y="330" font-family="system-ui, sans-serif" font-size="12" font-weight="500" fill="#d1d5db">Type System Architect</text>
      <text x="20" y="348" font-family="system-ui, sans-serif" font-size="11" fill="#6b7280">Designs complex type systems for large applications</text>
      <text x="450" y="365" font-family="system-ui, sans-serif" font-size="11" fill="#475569" text-anchor="end">2,500 XP</text>

      <!-- Card 2: React -->
      <rect x="520" y="240" width="480" height="140" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="540" y="275" font-size="24">⚛️</text>
      <text x="570" y="270" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="white">React</text>
      <text x="570" y="288" font-family="system-ui, sans-serif" font-size="11" fill="#475569">Code Frontend</text>
      <rect x="920" y="255" width="60" height="24" rx="12" fill="#0ea5e9"/>
      <text x="950" y="272" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="white" text-anchor="middle">Lv.6</text>
      <rect x="540" y="305" width="440" height="8" rx="4" fill="#1e293b"/>
      <rect x="540" y="305" width="300" height="8" rx="4" fill="#0ea5e9"/>
      <text x="540" y="330" font-family="system-ui, sans-serif" font-size="12" font-weight="500" fill="#d1d5db">Component Architect</text>
      <text x="970" y="365" font-family="system-ui, sans-serif" font-size="11" fill="#475569" text-anchor="end">1,800 XP</text>

      <!-- Card 3: Node.js -->
      <rect x="0" y="400" width="480" height="120" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="20" y="435" font-size="24">🟢</text>
      <text x="50" y="430" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="white">Node.js</text>
      <text x="50" y="448" font-family="system-ui, sans-serif" font-size="11" fill="#475569">Code Runtime</text>
      <rect x="400" y="415" width="60" height="24" rx="12" fill="#0ea5e9"/>
      <text x="430" y="432" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="white" text-anchor="middle">Lv.5</text>
      <rect x="20" y="465" width="440" height="8" rx="4" fill="#1e293b"/>
      <rect x="20" y="465" width="250" height="8" rx="4" fill="#0ea5e9"/>
      <text x="450" y="505" font-family="system-ui, sans-serif" font-size="11" fill="#475569" text-anchor="end">1,500 XP</text>

      <!-- Card 4: PostgreSQL -->
      <rect x="520" y="400" width="480" height="120" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="540" y="435" font-size="24">🐘</text>
      <text x="570" y="430" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="white">PostgreSQL</text>
      <text x="570" y="448" font-family="system-ui, sans-serif" font-size="11" fill="#475569">Data Database</text>
      <rect x="920" y="415" width="60" height="24" rx="12" fill="#64748b"/>
      <text x="950" y="432" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="white" text-anchor="middle">Lv.4</text>
      <rect x="540" y="465" width="440" height="8" rx="4" fill="#1e293b"/>
      <rect x="540" y="465" width="200" height="8" rx="4" fill="#64748b"/>
      <text x="970" y="505" font-family="system-ui, sans-serif" font-size="11" fill="#475569" text-anchor="end">1,200 XP</text>

      <!-- Share CTA -->
      <rect x="0" y="560" width="1000" height="120" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <text x="500" y="610" font-size="32" text-anchor="middle">📤</text>
      <text x="500" y="640" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">Share your skill tree</text>
      <text x="500" y="660" font-family="system-ui, sans-serif" font-size="12" fill="#6b7280" text-anchor="middle">Generate a beautiful PNG card with your top skills and QR code</text>
    </g>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(OUTPUT_DIR, '02-profile-page.png'));
  console.log('✓ Generated 02-profile-page.png');
}

async function generateShareCardScreenshot() {
  const svg = `
  <svg width="1440" height="900" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${COLORS.bgDeep}"/>
        <stop offset="100%" stop-color="${COLORS.bgMid}"/>
      </linearGradient>
      <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a1a35"/>
        <stop offset="100%" stop-color="#071428"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1440" height="900" fill="url(#bg)"/>

    <!-- Nav -->
    <rect x="0" y="0" width="1440" height="56" fill="${COLORS.bgDeep}" opacity="0.9"/>
    <text x="20" y="36" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#8b5cf6">🌳 SkillTree</text>

    <!-- Page title -->
    <text x="720" y="120" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">Share Your Skill Tree</text>
    <text x="720" y="150" font-family="system-ui, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle">Generate a beautiful card to share on social media</text>

    <!-- Share Card Preview -->
    <g transform="translate(420, 200)">
      <!-- Card background -->
      <rect x="0" y="0" width="600" height="400" rx="16" fill="url(#cardBg)" stroke="#0e2040" stroke-width="2"/>

      <!-- Header -->
      <text x="300" y="50" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#0ea5e9" text-anchor="middle" letter-spacing="0.2em">SKILLTREE.APP</text>

      <!-- Avatar and name -->
      <text x="80" y="110" font-size="48">👩‍💻</text>
      <text x="150" y="105" font-family="system-ui, sans-serif" font-size="24" font-weight="bold" fill="white">Alex Chen</text>
      <text x="150" y="128" font-family="system-ui, sans-serif" font-size="14" fill="#64748b">@alex</text>

      <!-- Stats row -->
      <text x="80" y="170" font-family="system-ui, sans-serif" font-size="14" fill="#94a3b8">8,420 XP • 12 skills • 5.2 avg</text>

      <!-- Top skills -->
      <text x="80" y="210" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#64748b" letter-spacing="0.1em">TOP SKILLS</text>

      <!-- Skill tags -->
      <rect x="80" y="230" width="100" height="32" rx="16" fill="#1e3a5f"/>
      <text x="100" y="250" font-size="14">📘</text>
      <text x="125" y="251" font-family="system-ui, sans-serif" font-size="12" fill="white">TypeScript</text>

      <rect x="190" y="230" width="90" height="32" rx="16" fill="#1e3a5f"/>
      <text x="205" y="250" font-size="14">⚛️</text>
      <text x="225" y="251" font-family="system-ui, sans-serif" font-size="12" fill="white">React</text>

      <rect x="290" y="230" width="90" height="32" rx="16" fill="#1e3a5f"/>
      <text x="305" y="250" font-size="14">🟢</text>
      <text x="325" y="251" font-family="system-ui, sans-serif" font-size="12" fill="white">Node.js</text>

      <rect x="390" y="230" width="110" height="32" rx="16" fill="#1e3a5f"/>
      <text x="405" y="250" font-size="14">🐘</text>
      <text x="425" y="251" font-family="system-ui, sans-serif" font-size="12" fill="white">PostgreSQL</text>

      <!-- QR Code placeholder -->
      <rect x="450" y="290" width="100" height="100" rx="8" fill="white"/>
      <rect x="460" y="300" width="80" height="80" fill="#050d1a"/>
      <!-- QR pattern -->
      <rect x="470" y="310" width="20" height="20" fill="white"/>
      <rect x="510" y="310" width="20" height="20" fill="white"/>
      <rect x="470" y="350" width="20" height="20" fill="white"/>
      <rect x="490" y="330" width="10" height="10" fill="white"/>
      <rect x="510" y="340" width="10" height="10" fill="white"/>
      <rect x="525" y="355" width="5" height="5" fill="white"/>

      <!-- Tagline -->
      <text x="80" y="340" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="white">My AI-era skill map</text>
      <text x="80" y="365" font-family="system-ui, sans-serif" font-size="13" fill="#0ea5e9">Build yours at skilltree.app</text>
    </g>

    <!-- Action buttons -->
    <rect x="620" y="640" width="200" height="48" rx="8" fill="#7c3aed"/>
    <text x="720" y="670" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="white" text-anchor="middle">Download PNG</text>

    <rect x="620" y="700" width="200" height="48" rx="8" fill="transparent" stroke="#374151" stroke-width="1"/>
    <text x="720" y="730" font-family="system-ui, sans-serif" font-size="14" font-weight="500" fill="#d1d5db" text-anchor="middle">Copy Link</text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(OUTPUT_DIR, '03-share-card.png'));
  console.log('✓ Generated 03-share-card.png');
}

async function generateMobileScreenshot() {
  const svg = `
  <svg width="375" height="812" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${COLORS.bgDeep}"/>
        <stop offset="100%" stop-color="${COLORS.bgMid}"/>
      </linearGradient>
      <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${COLORS.violetLight}"/>
        <stop offset="100%" stop-color="${COLORS.violet}"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="375" height="812" fill="url(#bg)"/>

    <!-- iPhone notch area -->
    <rect x="0" y="0" width="375" height="44" fill="${COLORS.bgDeep}"/>
    <text x="187" y="28" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="white" text-anchor="middle">9:41</text>

    <!-- Header -->
    <rect x="0" y="44" width="375" height="48" fill="${COLORS.bgDeep}"/>
    <text x="16" y="75" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#8b5cf6">🌳 SkillTree</text>
    <text x="300" y="75" font-family="system-ui, sans-serif" font-size="12" fill="#6b7280">@alex</text>

    <!-- Profile strip -->
    <rect x="0" y="92" width="375" height="64" fill="${COLORS.bgLight}" opacity="0.5"/>
    <text x="16" y="130" font-size="32">👩‍💻</text>
    <text x="56" y="125" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="white">Alex Chen</text>
    <text x="56" y="142" font-family="system-ui, sans-serif" font-size="11" fill="#6b7280">8,420 XP • 12 skills</text>

    <!-- Skill Tree (mobile-optimized) -->
    <g transform="translate(187, 450)">
      <!-- Root node -->
      <circle cx="0" cy="-120" r="24" fill="url(#nodeGrad)"/>
      <circle cx="0" cy="-120" r="12" fill="white"/>

      <!-- Level 1 branches -->
      <line x1="0" y1="-96" x2="-70" y2="-40" stroke="#7c3aed" stroke-width="3" stroke-linecap="round"/>
      <line x1="0" y1="-96" x2="70" y2="-40" stroke="#7c3aed" stroke-width="3" stroke-linecap="round"/>
      <line x1="0" y1="-96" x2="0" y2="0" stroke="#6d28d9" stroke-width="3" stroke-linecap="round"/>

      <!-- Level 1 nodes -->
      <circle cx="-70" cy="-40" r="14" fill="#7c3aed"/>
      <circle cx="-70" cy="-40" r="7" fill="#c4b5fd"/>
      <text x="-70" y="-15" font-family="system-ui, sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">TS</text>

      <circle cx="70" cy="-40" r="14" fill="#7c3aed"/>
      <circle cx="70" cy="-40" r="7" fill="#c4b5fd"/>
      <text x="70" y="-15" font-family="system-ui, sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">React</text>

      <circle cx="0" cy="0" r="12" fill="#6d28d9"/>
      <circle cx="0" cy="0" r="6" fill="#ddd6fe"/>
      <text x="0" y="22" font-family="system-ui, sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">Node</text>

      <!-- Level 2 nodes -->
      <line x1="-70" y1="-26" x2="-100" y2="40" stroke="#5b21b6" stroke-width="2" stroke-linecap="round"/>
      <line x1="-70" y1="-26" x2="-40" y2="45" stroke="#5b21b6" stroke-width="2" stroke-linecap="round"/>
      <line x1="70" y1="-26" x2="40" y2="45" stroke="#5b21b6" stroke-width="2" stroke-linecap="round"/>

      <circle cx="-100" cy="40" r="8" fill="#5b21b6"/>
      <circle cx="-40" cy="45" r="8" fill="#5b21b6"/>
      <circle cx="40" cy="45" r="8" fill="#5b21b6"/>
    </g>

    <!-- Bottom nav -->
    <rect x="0" y="748" width="375" height="64" fill="${COLORS.bgDeep}"/>
    <text x="75" y="785" font-size="20" text-anchor="middle">🌳</text>
    <text x="75" y="802" font-family="system-ui, sans-serif" font-size="10" fill="#7c3aed" text-anchor="middle">Tree</text>

    <text x="187" y="785" font-size="20" text-anchor="middle">👤</text>
    <text x="187" y="802" font-family="system-ui, sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">Profile</text>

    <text x="300" y="785" font-size="20" text-anchor="middle">🏆</text>
    <text x="300" y="802" font-family="system-ui, sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">Leaderboard</text>

    <!-- Home indicator -->
    <rect x="120" y="800" width="135" height="5" rx="2.5" fill="white" opacity="0.3"/>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(OUTPUT_DIR, '04-mobile-view.png'));
  console.log('✓ Generated 04-mobile-view.png');
}

async function generateLeaderboardScreenshot() {
  const svg = `
  <svg width="1440" height="900" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${COLORS.bgDeep}"/>
        <stop offset="100%" stop-color="${COLORS.bgMid}"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1440" height="900" fill="url(#bg)"/>

    <!-- Nav -->
    <rect x="0" y="0" width="1440" height="56" fill="${COLORS.bgDeep}" opacity="0.9"/>
    <text x="20" y="36" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#8b5cf6">🌳 SkillTree</text>

    <!-- Page title -->
    <text x="720" y="120" font-family="system-ui, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">Leaderboard</text>
    <text x="720" y="150" font-family="system-ui, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle">Top skill builders in the community</text>

    <!-- Branch filter tabs -->
    <rect x="520" y="180" width="100" height="36" rx="18" fill="#7c3aed"/>
    <text x="570" y="203" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="white" text-anchor="middle">All</text>

    <rect x="630" y="180" width="100" height="36" rx="18" fill="${COLORS.bgLight}" stroke="#1e293b"/>
    <text x="680" y="203" font-family="system-ui, sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">💻 Code</text>

    <rect x="740" y="180" width="100" height="36" rx="18" fill="${COLORS.bgLight}" stroke="#1e293b"/>
    <text x="790" y="203" font-family="system-ui, sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">🎨 Design</text>

    <rect x="850" y="180" width="100" height="36" rx="18" fill="${COLORS.bgLight}" stroke="#1e293b"/>
    <text x="900" y="203" font-family="system-ui, sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">⚡ System</text>

    <!-- Leaderboard entries -->
    <!-- Entry 1 -->
    <rect x="320" y="240" width="800" height="80" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
    <text x="360" y="290" font-family="system-ui, sans-serif" font-size="24" font-weight="bold" fill="#fbbf24">1</text>
    <text x="400" y="285" font-size="40">👨‍💻</text>
    <text x="460" y="275" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="white">Marcus Johnson</text>
    <text x="460" y="295" font-family="system-ui, sans-serif" font-size="12" fill="#6b7280">@marcus</text>
    <text x="720" y="285" font-family="system-ui, sans-serif" font-size="14" fill="#d1d5db">15,420 XP</text>
    <text x="820" y="285" font-family="system-ui, sans-serif" font-size="14" fill="#d1d5db">24 skills</text>
    <text x="920" y="285" font-family="system-ui, sans-serif" font-size="14" fill="#fbbf24">👑 128</text>
    <text x="980" y="285" font-family="system-ui, sans-serif" font-size="12" fill="#6b7280">endorsements</text>

    <!-- Entry 2 -->
    <rect x="320" y="330" width="800" height="80" rx="12" fill="#0f172a" border="#1e293b"/>
    <text x="360" y="380" font-family="system-ui, sans-serif" font-size="24" font-weight="bold" fill="#9ca3af">2</text>
    <text x="400" y="375" font-size="40">👩‍🎨</text>
    <text x="460" y="365" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="white">Sarah Kim</text>
    <text x="460" y="385" font-family="system-ui, sans-serif" font-size="12" fill="#6b7280">@sarah</text>
    <text x="720" y="375" font-family="system-ui, sans-serif" font-size="14" fill="#d1d5db">12,890 XP</text>
    <text x="820" y="375" font-family="system-ui, sans-serif" font-size="14" fill="#d1d5db">18 skills</text>
    <text x="920" y="375" font-family="system-ui, sans-serif" font-size="14" fill="#9ca3af">👍 96</text>

    <!-- Entry 3 -->
    <rect x="320" y="420" width="800" height="80" rx="12" fill="#0f172a"/>
    <text x="360" y="470" font-family="system-ui, sans-serif" font-size="24" font-weight="bold" fill="#b45309">3</text>
    <text x="400" y="465" font-size="40">🤖</text>
    <text x="460" y="455" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="white">DevBot</text>
    <text x="510" y="455" font-family="system-ui, sans-serif" font-size="11" fill="#8b5cf6" fill-opacity="0.8">AI agent</text>
    <text x="460" y="475" font-family="system-ui, sans-serif" font-size="12" fill="#6b7280">@devbot</text>
    <text x="720" y="465" font-family="system-ui, sans-serif" font-size="14" fill="#d1d5db">11,200 XP</text>
    <text x="820" y="465" font-family="system-ui, sans-serif" font-size="14" fill="#d1d5db">15 skills</text>
    <text x="920" y="465" font-family="system-ui, sans-serif" font-size="14" fill="#b45309">👍 84</text>

    <!-- Entry 4 -->
    <rect x="320" y="510" width="800" height="80" rx="12" fill="#0f172a"/>
    <text x="365" y="560" font-family="system-ui, sans-serif" font-size="18" fill="#6b7280">4</text>
    <text x="400" y="555" font-size="40">👩‍💻</text>
    <text x="460" y="545" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="white">Alex Chen</text>
    <text x="460" y="565" font-family="system-ui, sans-serif" font-size="12" fill="#6b7280">@alex</text>
    <text x="720" y="555" font-family="system-ui, sans-serif" font-size="14" fill="#d1d5db">8,420 XP</text>
    <text x="820" y="555" font-family="system-ui, sans-serif" font-size="14" fill="#d1d5db">12 skills</text>
    <text x="920" y="555" font-family="system-ui, sans-serif" font-size="14" fill="#6b7280">👍 52</text>

    <!-- Entry 5 -->
    <rect x="320" y="600" width="800" height="80" rx="12" fill="#0f172a"/>
    <text x="365" y="650" font-family="system-ui, sans-serif" font-size="18" fill="#6b7280">5</text>
    <text x="400" y="645" font-size="40">👨‍🔬</text>
    <text x="460" y="635" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="white">David Park</text>
    <text x="460" y="655" font-family="system-ui, sans-serif" font-size="12" fill="#6b7280">@david</text>
    <text x="720" y="645" font-family="system-ui, sans-serif" font-size="14" fill="#d1d5db">7,100 XP</text>
    <text x="820" y="645" font-family="system-ui, sans-serif" font-size="14" fill="#d1d5db">10 skills</text>
    <text x="920" y="645" font-family="system-ui, sans-serif" font-size="14" fill="#6b7280">👍 38</text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(OUTPUT_DIR, '05-leaderboard.png'));
  console.log('✓ Generated 05-leaderboard.png');
}

async function main() {
  console.log('Generating Product Hunt screenshot assets...\n');

  await generateHeroScreenshot();
  await generateProfileScreenshot();
  await generateShareCardScreenshot();
  await generateMobileScreenshot();
  await generateLeaderboardScreenshot();

  console.log(`\n✅ All assets generated in: ${OUTPUT_DIR}`);
  console.log('\nFiles created:');
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png'));
  files.forEach(f => {
    const stats = fs.statSync(path.join(OUTPUT_DIR, f));
    console.log(`  • ${f} (${(stats.size / 1024).toFixed(1)} KB)`);
  });
}

main().catch(console.error);
