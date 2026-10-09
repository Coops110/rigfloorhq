// Records the flange & ring gasket lookup screen-recording segment for
// video 20, timed to land on the same beats as the pre-generated body
// narration (social/tiktok/20-flange-ring-gasket-cues.json). This page is a
// filterable lookup table, not a live-compute calculator -- the two <select>
// filters get exercised to show the table narrowing to one real row, rather
// than retyping number inputs. Hook line plays as its own audio clip under
// the static frame1 bookend, so this recording's narration timeline starts
// at t=0 with the body script only.
//
// Run: node scripts/record-20-flange-ring-gasket.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec20');
const CUES_PATH = path.join(REPO, 'social', 'tiktok', '20-flange-ring-gasket-cues.json');
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

  await page.goto(`${BASE_URL}/calculators/flange-ring-gasket`, { waitUntil: 'load' });
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

  // ---- line 1: "every flange bore and pressure rating has exactly one
  // correct ring gasket number" -- filter to a real low-pressure, R-gasket
  // row first. ----
  await waitUntil(line1End - 6);
  await page.locator('#fl-bore').selectOption({ label: '2 1/16"' });
  console.log('filtered bore 2 1/16 @', elapsed().toFixed(2));

  await waitUntil(line1End - 3);
  await page.locator('#fl-press').selectOption({ label: '5M' });
  console.log('filtered rating 5M (R-24) @', elapsed().toFixed(2));

  await waitUntil(line1End + 0.3);
  await page.locator('#fl-table').scrollIntoViewIfNeeded();
  console.log('holding on R-24 row @', elapsed().toFixed(2));

  // ---- line 2: "R gaskets seal on bolt-up force alone... BX gaskets are
  // pressure-energized... used ten M and above, and on almost every BOP
  // stack connection" -- switch to a real BOP-stack-class BX row. ----
  await waitUntil(line2End - 6);
  await page.locator('#fl-bore').selectOption({ label: '7 1/16"' });
  console.log('switched bore to 7 1/16 @', elapsed().toFixed(2));

  await waitUntil(line2End - 3);
  await page.locator('#fl-press').selectOption({ label: '10M' });
  console.log('filtered rating 10M (BX-156) @', elapsed().toFixed(2));

  // ---- line 3: "get the number close but wrong... that's exactly why the
  // pressure test exists" -- clear the bore filter to show the full table
  // one more time, the full real reference. ----
  await waitUntil(line2End + 0.4);
  console.log('holding on BX-156 row @', elapsed().toFixed(2));

  await waitUntil(line3End - 3);
  await page.locator('#fl-bore').selectOption({ label: 'All bore sizes' });
  console.log('cleared bore filter @', elapsed().toFixed(2));

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
