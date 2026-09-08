// Records the animated BOP ram-sizing diagram for video 10. Unlike the
// calculator recordings (06-09), this page has no live interaction to
// drive -- the GSAP timeline inside social/diagrams/10-bop-ram-size.html is
// self-driving, keyed to the same narration cue timestamps baked into that
// file's own <script> block. This script's only job is to load the page
// and record for the full narration length plus a short tail.
//
// Loads Playwright from its npx cache location, same as the calculator
// recording scripts -- see record-08-mud-weight-window.mjs for why.
//
// Run: node scripts/record-10-bop-ram-size.mjs

import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec10');
const DIAGRAM = path.join(REPO, 'social', 'diagrams', '10-bop-ram-size.html');

// Must match TOTAL in the HTML file's own GSAP timeline.
const TOTAL = 26.025;
const TAIL_S = 2.5;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    recordVideo: { dir: OUT_DIR, size: { width: 1080, height: 1920 } },
  });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error('PAGE ERROR:', msg.text());
  });
  page.on('pageerror', (err) => console.error('PAGE EXCEPTION:', err));

  await page.goto(pathToFileURL(DIAGRAM).href, { waitUntil: 'load' });

  // Confirm GSAP actually loaded and the timeline is real before recording
  // the full duration -- fail loudly here rather than silently recording a
  // blank/unanimated page, which is exactly how the caption bug found
  // earlier today slipped through undetected.
  const gsapOk = await page.evaluate(() => typeof window.gsap !== 'undefined');
  if (!gsapOk) {
    throw new Error('GSAP did not load on the page -- aborting before recording a broken video.');
  }
  console.log('GSAP loaded OK, recording for', (TOTAL + TAIL_S).toFixed(1), 's');

  await sleep((TOTAL + TAIL_S) * 1000);

  await context.close();
  await browser.close();
  console.log('done -- video written to', OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
