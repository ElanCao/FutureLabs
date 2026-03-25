#!/usr/bin/env tsx
/**
 * Generate demo GIF for Product Hunt
 * Creates a short animation showing skill tree interaction
 */

import sharp from 'sharp';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../public/ph-assets');
const WIDTH = 1280;
const HEIGHT = 720;

const COLORS = {
  bgDeep: '#050d1a',
  bgMid: '#071428',
  electricBlue: '#0ea5e9',
  violet: '#7c3aed',
  violetLight: '#a78bfa',
  white: '#ffffff',
  gray400: '#94a3b8',
  gray600: '#475569',
};

// Generate a frame with skill tree at different zoom/pan states
function generateFrameSVG(frameIndex: number, totalFrames: number): string {
  const progress = frameIndex / totalFrames;
  const zoom = 0.8 + (Math.sin(progress * Math.PI) * 0.2); // Zoom in and out
  const panX = Math.sin(progress * Math.PI * 2) * 50; // Pan left/right
  const panY = Math.cos(progress * Math.PI * 2) * 30; // Pan up/down

  // Highlight a different skill each frame
  const highlightIndex = Math.floor(progress * 5);
  const highlights = [false, false, false, false, false];
  if (highlightIndex < 5) highlights[highlightIndex] = true;

  return `
  <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${COLORS.bgDeep}"/>
        <stop offset="100%" stop-color="${COLORS.bgMid}"/>
      </linearGradient>
      <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${COLORS.violetLight}"/>
        <stop offset="100%" stop-color="${COLORS.violet}"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

    <!-- Header -->
    <rect x="0" y="0" width="${WIDTH}" height="50" fill="${COLORS.bgDeep}" opacity="0.9"/>
    <text x="20" y="32" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#8b5cf6">SkillTree</text>
    <text x="${WIDTH - 150}" y="32" font-family="system-ui, sans-serif" font-size="12" fill="#6b7280">Interactive skill visualization</text>

    <!-- Tree container with zoom/pan -->
    <g transform="translate(${WIDTH/2 + panX}, ${HEIGHT/2 + 20 + panY}) scale(${zoom})">
      <!-- Root node -->
      <circle cx="0" cy="-150" r="35" fill="url(#nodeGrad)" ${highlights[0] ? 'filter="url(#glow)"' : ''}/>
      <circle cx="0" cy="-150" r="18" fill="white" opacity="0.95"/>
      <text x="0" y="-110" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="white" text-anchor="middle">Developer</text>

      <!-- Level 1 branches -->
      <line x1="0" y1="-115" x2="-120" y2="-50" stroke="#7c3aed" stroke-width="5" stroke-linecap="round"/>
      <line x1="0" y1="-115" x2="120" y2="-50" stroke="#7c3aed" stroke-width="5" stroke-linecap="round"/>
      <line x1="0" y1="-115" x2="0" y2="20" stroke="#6d28d9" stroke-width="5" stroke-linecap="round"/>

      <!-- Level 1 nodes -->
      <circle cx="-120" cy="-50" r="24" fill="#7c3aed" ${highlights[1] ? 'filter="url(#glow)"' : ''}/>
      <circle cx="-120" cy="-50" r="12" fill="#c4b5fd"/>
      <text x="-120" y="-10" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">TypeScript</text>

      <circle cx="120" cy="-50" r="24" fill="#7c3aed" ${highlights[2] ? 'filter="url(#glow)"' : ''}/>
      <circle cx="120" cy="-50" r="12" fill="#c4b5fd"/>
      <text x="120" y="-10" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">React</text>

      <circle cx="0" cy="20" r="20" fill="#6d28d9" ${highlights[3] ? 'filter="url(#glow)"' : ''}/>
      <circle cx="0" cy="20" r="10" fill="#ddd6fe"/>
      <text x="0" y="60" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">Node.js</text>

      <!-- Level 2 branches -->
      <line x1="-120" y1="-26" x2="-180" y2="80" stroke="#5b21b6" stroke-width="4" stroke-linecap="round"/>
      <line x1="-120" y1="-26" x2="-60" y2="90" stroke="#5b21b6" stroke-width="4" stroke-linecap="round"/>
      <line x1="120" y1="-26" x2="60" y2="90" stroke="#5b21b6" stroke-width="4" stroke-linecap="round"/>
      <line x1="120" y1="-26" x2="180" y2="80" stroke="#5b21b6" stroke-width="4" stroke-linecap="round"/>

      <!-- Level 2 nodes -->
      <circle cx="-180" cy="80" r="14" fill="#5b21b6" ${highlights[4] ? 'filter="url(#glow)"' : ''}/>
      <text x="-180" y="115" font-family="system-ui, sans-serif" font-size="10" fill="#64748b" text-anchor="middle">Testing</text>

      <circle cx="-60" cy="90" r="14" fill="#5b21b6"/>
      <text x="-60" y="125" font-family="system-ui, sans-serif" font-size="10" fill="#64748b" text-anchor="middle">Next.js</text>

      <circle cx="60" cy="90" r="14" fill="#5b21b6"/>
      <text x="60" y="125" font-family="system-ui, sans-serif" font-size="10" fill="#64748b" text-anchor="middle">Vue</text>

      <circle cx="180" cy="80" r="14" fill="#5b21b6"/>
      <text x="180" y="115" font-family="system-ui, sans-serif" font-size="10" fill="#64748b" text-anchor="middle">CSS</text>
    </g>

    <!-- Feature callouts -->
    <rect x="20" y="${HEIGHT - 100}" width="300" height="70" rx="8" fill="#0f172a" stroke="#1e293b"/>
    <text x="35" y="${HEIGHT - 75}" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="white">🎯 Interactive Skill Tree</text>
    <text x="35" y="${HEIGHT - 55}" font-family="system-ui, sans-serif" font-size="11" fill="#6b7280">Drag to pan • Scroll to zoom • Click to explore</text>
    <text x="35" y="${HEIGHT - 38}" font-family="system-ui, sans-serif" font-size="11" fill="#0ea5e9">Build your AI-era skill passport</text>
  </svg>`;
}

async function generateDemoGIF() {
  const totalFrames = 15;
  const frames: Buffer[] = [];

  console.log('Generating demo GIF frames...');

  for (let i = 0; i < totalFrames; i++) {
    const svg = generateFrameSVG(i, totalFrames);
    const frame = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();
    frames.push(frame);
  }

  // Create animated WebP (better quality than GIF, supported by most browsers)
  console.log('Creating animated WebP...');

  // For now, save the middle frame as a static demo image
  // and create a simple GIF using the first few frames
  const middleFrame = frames[Math.floor(totalFrames / 2)];

  await sharp(middleFrame)
    .toFile(path.join(OUTPUT_DIR, '06-demo-static.png'));
  console.log('✓ Generated 06-demo-static.png');

  // Note: Sharp doesn't directly support animated GIF creation from multiple buffers
  // without using the tile approach. For Product Hunt, we'll provide the static demo
  // and document that a full animated GIF can be created using external tools.

  console.log('\n📌 Note: For a full animated GIF, use:');
  console.log('   ffmpeg -i frame_%03d.png -vf "fps=10,scale=1280:-1:flags=lanczos" demo.gif');
  console.log('   or upload the frames to an online GIF maker');
}

generateDemoGIF().catch(console.error);
