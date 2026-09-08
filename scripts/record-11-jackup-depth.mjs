// Records the animated jackup-depth-limit diagram for video 11. Same
// self-driving-GSAP-timeline mechanism as record-10-bop-ram-size.mjs --
// see that file's header for the full explanation. Only the target page,
// output directory, and total duration differ.
//
// Run: node scripts/record-11-jackup-depth.mjs

import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec11');
const DIAGRAM = path.join(REPO, 'social', 'diagrams', '11-jackup-depth.html');

// Must match TOTAL in the HTML file's own GSAP timeline.
const TOTAL = 27.0;
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
