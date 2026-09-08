// Records the mud-weight-converter calculator screen-recording segment for
// video 09, timed to land on the same beats as the pre-generated narration
// (social/tiktok/09-mud-weight-converter-cues.json). Copy-adapted from
// record-08-mud-weight-window.mjs -- same mechanism, different calculator
// and interaction script. See that file's header for why Playwright is
// loaded from the npx cache and why this always targets localhost, never
// the live site.
//
// Run: node scripts/record-09-mud-weight-converter.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec09');
const CUES_PATH = path.join(REPO, 'social', 'tiktok', '09-mud-weight-converter-cues.json');
const BASE_URL = 'http://localhost:4321';

const cues = JSON.parse(readFileSync(CUES_PATH, 'utf8'));
const [line1End, line2End, line3End, line4End] = cues.lines.map((l) => l.end);
console.log('Narration cues (s):', line1End, line2End, line3End, line4End);

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

  await page.goto(`${BASE_URL}/calculators/mud-weight-converter`, { waitUntil: 'load' });
  await sleep(600);

  try {
    const acceptBtn = page.locator('#consent-accept');
    if (await acceptBtn.isVisible({ timeout: 1500 })) {
      await acceptBtn.click();
    }
  } catch { /* banner didn't show -- fine */ }

  const LEAD_IN = 2.0;
  await waitUntil(LEAD_IN);
  console.log('start @', elapsed().toFixed(2));

  // ---- line 1: "quoted five different ways" -- type a round number into
  // ppg so the viewer sees every field populate together before any preset
  // gets touched. ----
  await waitUntil(line1End - 1.5);
  await page.locator('#u-ppg').pressSequentially('12', { delay: 90 });
  console.log('typed 12 ppg @', elapsed().toFixed(2));

  // ---- line 2: fresh water fact -- click the fresh water preset right as
  // the line starts so the 8.33/0.433/1.00 figures are on screen while
  // they're being spoken, not before or after. ----
  await waitUntil(line1End + 0.4);
  await page.locator('.preset-btn[data-ppg="8.33"]').click();
  console.log('fresh water preset @', elapsed().toFixed(2));

  // ---- line 3: sea water fact -- same timing logic against line 2's end. ----
  await waitUntil(line2End + 0.4);
  await page.locator('.preset-btn[data-ppg="8.55"]').click();
  console.log('sea water preset @', elapsed().toFixed(2));

  // ---- line 4: "type into any box" -- clear and type into a completely
  // different unit (pressure gradient, psi/ft) to demonstrate the live
  // two-way conversion, not just the presets. ----
  await waitUntil(line3End + 0.5);
  await page.locator('#u-psift').fill('');
  await page.locator('#u-psift').pressSequentially('0.6', { delay: 110 });
  console.log('typed into psi/ft @', elapsed().toFixed(2));

  // Hold on the final state through the end of narration plus a short
  // silent tail so the last conversion has time to register.
  await waitUntil(line4End + 2.5);
  console.log('stop @', elapsed().toFixed(2));

  await context.close();
  await browser.close();
  console.log('done -- video written to', OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
