// Records the ECD calculator screen-recording segment for video 12, timed to
// land on the same beats as the pre-generated body narration
// (social/tiktok/12-ecd-cues.json). Copy-adapted from
// record-09-mud-weight-converter.mjs -- same mechanism, different calculator.
// Note the hook line is NOT part of this recording -- it now plays as its
// own audio clip under the static frame1 bookend (see
// make-tiktok-recordings.py, fixed 2026-09-24), so this recording's
// narration timeline starts at t=0 with the body script only.
//
// Run: node scripts/record-12-ecd.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec12');
const CUES_PATH = path.join(REPO, 'social', 'tiktok', '12-ecd-cues.json');
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

  await page.goto(`${BASE_URL}/calculators/ecd`, { waitUntil: 'load' });
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

  // ---- line 1: "enter mud weight, depth, flow rate, hole size, and pipe
  // size" -- re-type each of the five inputs in the order they're named, so
  // the viewer sees the exact fields the narration is naming, in order. ----
  await waitUntil(line1End - 12);
  await page.locator('#ecd-mw').fill('');
  await page.locator('#ecd-mw').pressSequentially('12.0', { delay: 90 });
  console.log('typed mud weight @', elapsed().toFixed(2));

  await waitUntil(line1End - 9);
  await page.locator('#ecd-tvd').fill('');
  await page.locator('#ecd-tvd').pressSequentially('10000', { delay: 70 });
  console.log('typed TVD @', elapsed().toFixed(2));

  await waitUntil(line1End - 6);
  await page.locator('#ecd-q').fill('');
  await page.locator('#ecd-q').pressSequentially('400', { delay: 90 });
  console.log('typed flow rate @', elapsed().toFixed(2));

  await waitUntil(line1End - 3);
  await page.locator('#ecd-dh').fill('');
  await page.locator('#ecd-dh').pressSequentially('8.5', { delay: 110 });
  console.log('typed hole ID @', elapsed().toFixed(2));

  await waitUntil(line1End - 1);
  await page.locator('#ecd-dp').fill('');
  await page.locator('#ecd-dp').pressSequentially('5.0', { delay: 110 });
  console.log('typed pipe OD @', elapsed().toFixed(2));

  // ---- line 2: "ECD is always higher than static mud weight, never lower"
  // -- hold on the settled 12.00 -> 12.41 output so the viewer can read both
  // numbers while it's being said. No interaction, just a hold. ----
  await waitUntil(line2End - 0.3);
  console.log('holding on ecd output @', elapsed().toFixed(2));

  // ---- line 3: "a smaller annulus... pushes that number up even faster"
  // -- shrink hole ID from 8.5 to 7.0 right as the line starts, so ECD
  // visibly climbs from 12.41 toward ~14.8 while it's being spoken. ----
  await waitUntil(line2End + 0.4);
  await page.locator('#ecd-dh').fill('');
  await page.locator('#ecd-dh').pressSequentially('7.0', { delay: 110 });
  console.log('shrank hole ID @', elapsed().toFixed(2));

  // Hold on the final climbed ECD value through the end of narration plus a
  // short silent tail so the payoff has time to register.
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
