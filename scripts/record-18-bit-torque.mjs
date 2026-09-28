// Records the bit torque reference-chart screen-recording segment for
// video 18, timed to land on the same beats as the pre-generated body
// narration (social/tiktok/18-bit-torque-cues.json). This page has no
// interactive calculator inputs -- it's a lookup chart (bit size -> thread
// connection -> make-up torque), so unlike record-16/17 this scrolls to and
// highlights the specific rows the narration is naming, instead of typing
// into input fields. Hook line plays as its own audio clip under the
// static frame1 bookend, so this recording's narration timeline starts at
// t=0 with the body script only.
//
// Run: node scripts/record-18-bit-torque.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec18');
const CUES_PATH = path.join(REPO, 'social', 'tiktok', '18-bit-torque-cues.json');
const BASE_URL = 'http://localhost:4321';

const cues = JSON.parse(readFileSync(CUES_PATH, 'utf8'));
const [line1End, line2End, line3End] = cues.lines.map((l) => l.end);
console.log('Narration cues (s):', line1End, line2End, line3End);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Draws a bold amber outline + tint on a row so it reads clearly at TikTok
// resolution, matching the hook frame's accent color (#f07038 ember).
async function highlightRow(locator) {
  await locator.evaluate((el) => {
    el.style.outline = '4px solid #f07038';
    el.style.background = 'rgba(240,112,56,0.18)';
    el.style.transition = 'background 0.2s ease';
  });
}
async function clearRow(locator) {
  await locator.evaluate((el) => {
    el.style.outline = '';
    el.style.background = '';
  });
}

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

  await page.goto(`${BASE_URL}/calculators/bit-torque`, { waitUntil: 'load' });
  await sleep(600);

  try {
    const acceptBtn = page.locator('#consent-accept');
    if (await acceptBtn.isVisible({ timeout: 1500 })) {
      await acceptBtn.click();
    }
  } catch { /* banner didn't show -- fine */ }

  // Three calc-box tables in page order: bit-size->thread, PDC torque, RC
  // torque. The fact anchor is the FAQ's own worked example: an 8 1/2 in
  // bit falls in the "7 1/2 - 9 3/8" row, which runs a 4 1/2 REG connection.
  const threadRow = page.locator('.calc-box').nth(0).locator('tr', { hasText: '7 1/2 - 9 3/8' });
  const pdcRow = page.locator('.calc-box').nth(1).locator('tr', { hasText: '4 1/2 REG' });

  const LEAD_IN = 1.5;
  await waitUntil(LEAD_IN);
  await threadRow.scrollIntoViewIfNeeded();
  await highlightRow(threadRow);
  console.log('start, highlighted thread-size row @', elapsed().toFixed(2));

  // ---- line 1: "an eight and a half inch bit runs a four and a half reg
  // connection -- bit size sets the thread, straight off this table" --
  // hold on the size->thread row while this is said. ----
  await waitUntil(line1End - 0.3);
  console.log('holding on thread row @', elapsed().toFixed(2));

  // ---- line 2: "that connection has three numbers: eighteen thousand
  // minimum, twenty thousand maximum, twenty-three five hundred severe" --
  // move down to the PDC torque table and highlight the matching row. ----
  await waitUntil(line1End + 0.3);
  await clearRow(threadRow);
  await pdcRow.scrollIntoViewIfNeeded();
  await highlightRow(pdcRow);
  console.log('highlighted PDC torque row @', elapsed().toFixed(2));

  await waitUntil(line2End - 0.3);
  console.log('holding on PDC torque row @', elapsed().toFixed(2));

  // ---- line 3: "below minimum... above maximum, you're galling the
  // threads" -- hold on the same row through the payoff/warning line. ----
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
