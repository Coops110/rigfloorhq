// Records the gas migration calculator screen-recording segment for video
// 13, timed to land on the same beats as the pre-generated body narration
// (social/tiktok/13-gas-migration-cues.json). Copy-adapted from
// record-12-ecd.mjs -- hook line plays as its own audio clip under the
// static frame1 bookend, so this recording's narration timeline starts at
// t=0 with the body script only.
//
// Run: node scripts/record-13-gas-migration.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec13');
const CUES_PATH = path.join(REPO, 'social', 'tiktok', '13-gas-migration-cues.json');
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

  await page.goto(`${BASE_URL}/calculators/gas-migration`, { waitUntil: 'load' });
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

  // ---- line 1: "gas is buoyant... pushes shut-in pressure up on its own"
  // -- re-type the two rate inputs (pressure increase, mud weight) so the
  // viewer sees the exact numbers the hook already named. ----
  await waitUntil(line1End - 4);
  await page.locator('#pinc').fill('');
  await page.locator('#pinc').pressSequentially('50', { delay: 100 });
  console.log('typed pressure increase @', elapsed().toFixed(2));

  await waitUntil(line1End - 2);
  await page.locator('#mw').fill('');
  await page.locator('#mw').pressSequentially('10', { delay: 100 });
  console.log('typed mud weight @', elapsed().toFixed(2));

  // ---- line 2: "the calculator turns that into a migration rate of
  // ninety-six feet an hour" -- hold on the settled rate output so the
  // viewer can read it while it's being said. ----
  await waitUntil(line2End - 0.3);
  console.log('holding on migration rate @', elapsed().toFixed(2));

  // ---- line 3: "the volumetric method bleeds a calculated mud volume off
  // the annulus in steps" -- scroll to and populate the bleed-volume inputs,
  // showing the second half of the page's own calculator. ----
  await waitUntil(line2End + 0.4);
  await page.locator('#pbleed').scrollIntoViewIfNeeded();
  await page.locator('#pbleed').fill('');
  await page.locator('#pbleed').pressSequentially('100', { delay: 100 });
  console.log('typed bleed pressure step @', elapsed().toFixed(2));

  await waitUntil(line2End + 2.0);
  await page.locator('#acap').fill('');
  await page.locator('#acap').pressSequentially('0.0775', { delay: 90 });
  console.log('typed annular capacity @', elapsed().toFixed(2));

  // Hold on the bleed-volume output through the end of narration plus a
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
