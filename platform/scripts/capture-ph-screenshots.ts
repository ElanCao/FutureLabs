#!/usr/bin/env ts-node
/**
 * Capture Product Hunt screenshot assets
 * Run: npx ts-node scripts/capture-ph-screenshots.ts
 */

import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3001';
const OUTPUT_DIR = path.join(__dirname, '../public/ph-assets');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Screenshot 1: Hero - Skill Tree visualization
  console.log('Capturing Hero screenshot (skill tree)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/tree/alex`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000)); // Wait for animations
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '01-hero-skill-tree.png'),
    fullPage: false,
  });

  // Screenshot 2: Profile page
  console.log('Capturing Profile screenshot...');
  await page.goto(`${BASE_URL}/profile/alex`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '02-profile-page.png'),
    fullPage: false,
  });

  // Screenshot 3: Share Card page
  console.log('Capturing Share Card screenshot...');
  await page.goto(`${BASE_URL}/share?username=alex`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000)); // Wait for QR code generation
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '03-share-card.png'),
    fullPage: false,
  });

  // Screenshot 4: Mobile view of skill tree
  console.log('Capturing Mobile screenshot...');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/tree/alex`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '04-mobile-view.png'),
    fullPage: false,
  });

  // Screenshot 5: Leaderboard page
  console.log('Capturing Leaderboard screenshot...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/leaderboard`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '05-leaderboard.png'),
    fullPage: false,
  });

  // Capture GIF demo frames (simplified - capture multiple frames)
  console.log('Capturing demo GIF frames...');
  await page.setViewport({ width: 1280, height: 720 });

  // Navigate to tree page for GIF
  await page.goto(`${BASE_URL}/tree/alex`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Take frames for GIF (would need external tool to compile)
  const gifFramesDir = path.join(OUTPUT_DIR, 'gif-frames');
  if (!fs.existsSync(gifFramesDir)) {
    fs.mkdirSync(gifFramesDir, { recursive: true });
  }

  // Simulate interaction - scroll and pan
  for (let i = 0; i < 10; i++) {
    await page.evaluate((offset) => {
      const el = document.querySelector('.react-flow__pane') as HTMLElement;
      if (el) {
        el.style.transform = `translate(${offset * 20}px, ${offset * 10}px)`;
      }
    }, i);
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({
      path: path.join(gifFramesDir, `frame-${String(i).padStart(3, '0')}.png`),
      fullPage: false,
    });
  }

  console.log('All screenshots captured!');
  console.log(`Output directory: ${OUTPUT_DIR}`);

  await browser.close();
}

// Check if server is running
async function checkServer(): Promise<boolean> {
  try {
    const response = await fetch(BASE_URL);
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  const isRunning = await checkServer();
  if (!isRunning) {
    console.error(`Server not running at ${BASE_URL}`);
    console.error('Please start the dev server first: npm run dev -- -p 3001');
    process.exit(1);
  }

  await captureScreenshots();
}

main().catch(console.error);
