// Records the riser margin calculator screen-recording segment for video 15,
// timed to land on the same beats as the pre-generated body narration
// (social/tiktok/15-riser-margin-cues.json). Copy-adapted from
// record-12-ecd.mjs -- hook line plays as its own audio clip under the
// static frame1 bookend, so this recording's narration timeline starts at
// t=0 with the body script only.
//
// Run: node scripts/record-15-riser-margin.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec15');
const CUES_PATH = path.join(REPO, 'social', 'tiktok', '15-riser-margin-cues.json');
const BASE_URL = 'http://localhost:4321';

const cues = JSON.parse(readFileSync(CUES_PATH, 'utf8'));
const [line1End, line2End, line3End] = cues.lines.map((l) => l.end);
console.log('Narration cues (s):', line1End, line2End, line3End);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    recordVideo: { dir: OUT_DIR, size: { width: 1080, height: 1920 } },
  });
  const page = await context.newPage();

  const t0 = Date.now();
  const elapsed = () => (Date.now() - t0) / 1000;
  const waitUntil = async (targetS) => {
    const remain = targetS * 1000 - (Date.now() - t0);
    if (remain > 0) await sleep(remain);
  };

  await page.goto(`${BASE_URL}/calculators/riser-margin`, { waitUntil: 'load' });
  await sleep(600);

  try {
    const acceptBtn = page.locator('#consent-accept');
    if (await acceptBtn.isVisible({ timeout: 1500 })) {
      await acceptBtn.click();
    }
  } catch { /* banner didn't show -- fine */ }

  const LEAD_IN = 1.5;
  await waitUntil(LEAD_IN);
  console.log('start @', elapsed().toFixed(2));

  // ---- line 1: "riser normally full of mud, heavier than seawater...
  // riser margin is how much extra mud weight the well can lose" -- re-type
  // mud weight and seawater gradient. ----
  await waitUntil(line1End - 8);
  await page.locator('#mw').fill('');
  await page.locator('#mw').pressSequentially('12', { delay: 100 });
  console.log('typed mud weight @', elapsed().toFixed(2));

  await waitUntil(line1End - 5);
  await page.locator('#swg').fill('');
  await page.locator('#swg').pressSequentially('0.442', { delay: 90 });
  console.log('typed seawater gradient @', elapsed().toFixed(2));

  // ---- line 2: "plug in mud weight, seawater gradient, water depth, and
  // air gap... margin comes back at one point eight five ppg" -- finish the
  // remaining inputs named in this exact order. ----
  await waitUntil(line1End + 0.4);
  await page.locator('#wd').fill('');
  await page.locator('#wd').pressSequentially('5000', { delay: 70 });
  console.log('typed water depth @', elapsed().toFixed(2));

  await waitUntil(line1End + 2.5);
  await page.locator('#ag').fill('');
  await page.locator('#ag').pressSequentially('75', { delay: 100 });
  console.log('typed air gap @', elapsed().toFixed(2));

  await waitUntil(line2End - 2);
  await page.locator('#tvd').scrollIntoViewIfNeeded();
  await page.locator('#tvd').fill('');
  await page.locator('#tvd').pressSequentially('15000', { delay: 70 });
  console.log('typed TVD @', elapsed().toFixed(2));

  // ---- line 3: "that's the cushion protecting the BOP stack below" -- hold
  // on the settled margin output as the payoff line lands. ----
  await waitUntil(line2End + 0.4);
  console.log('holding on margin output @', elapsed().toFixed(2));

  await waitUntil(line3End + 2.0);
  console.log('stop @', elapsed().toFixed(2));

  await context.close();
  await browser.close();
  console.log('done -- video written to', OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
