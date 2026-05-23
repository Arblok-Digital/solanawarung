// record-promo.mjs
// Jalur B - Full CLI Render (bypass broken Motion Canvas editor)
// Opens the dev server in headless browser, captures frames, encodes to MP4 using ffmpeg

import puppeteer from 'puppeteer';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = 'dist/frames';
const FINAL_MP4 = 'dist/SolanaWarung-Promo.mp4';
const FPS = 30;
const TOTAL_SECONDS = 90; // adjust if your total video is longer/shorter

async function main() {
  console.log('🎥 Starting Jalur B - Headless Recording...');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Opening Motion Canvas editor...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 60000 });

  console.log('Waiting for project to load (30s)...');
  await new Promise(r => setTimeout(r, 30000));

  // Try to click Play if there's a play button (best effort)
  try {
    await page.click('button[aria-label="Play"]');
    console.log('Play button clicked');
  } catch (e) {
    console.log('No play button found, will just record the canvas area');
  }

  console.log(`Capturing ${TOTAL_SECONDS} seconds @ ${FPS} fps...`);

  const totalFrames = TOTAL_SECONDS * FPS;
  for (let i = 0; i < totalFrames; i++) {
    const framePath = path.join(OUTPUT_DIR, `${String(i).padStart(6, '0')}.png`);

    // Capture the main canvas area (Motion Canvas uses a canvas element)
    const canvas = await page.$('canvas');
    if (canvas) {
      await canvas.screenshot({ path: framePath });
    } else {
      await page.screenshot({ path: framePath });
    }

    if (i % 30 === 0) {
      console.log(`  Captured frame ${i}/${totalFrames}`);
    }

    await new Promise(r => setTimeout(r, 1000 / FPS));
  }

  await browser.close();

  console.log('Encoding to MP4 with ffmpeg...');

  const ffmpegCmd = `ffmpeg -y -framerate ${FPS} -i "${OUTPUT_DIR}/%06d.png" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p "${FINAL_MP4}"`;

  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log(`\n✅ Done! MP4 created: ${FINAL_MP4}`);
  } catch (err) {
    console.error('ffmpeg failed. Make sure ffmpeg is in PATH.');
    console.log('You can run this command manually:');
    console.log(ffmpegCmd);
  }
}

main().catch(console.error);
