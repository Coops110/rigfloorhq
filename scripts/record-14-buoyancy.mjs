// Records the buoyancy calculator screen-recording segment for video 14,
// timed to land on the same beats as the pre-generated body narration
// (social/tiktok/14-buoyancy-cues.json). Copy-adapted from
// record-12-ecd.mjs -- hook line plays as its own audio clip under the
// static frame1 bookend, so this recording's narration timeline starts at
// t=0 with the body script only.
//
// Run: node scripts/record-14-buoyancy.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec14');
const CUES_PATH = path.join(REPO, 'social', 'tiktok', '14-buoyancy-cues.json');
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

  await page.goto(`${BASE_URL}/calculators/buoyancy`, { waitUntil: 'load' });
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

  // ---- line 1: "air weight nineteen and a half... open-ended drops to
  // sixteen point five two" -- re-type air weight and OD/ID so the viewer
  // sees the exact inputs behind the hook's own numbers. ----
  await waitUntil(line1End - 4);
  await page.locator('#wair').fill('');
  await page.locator('#wair').pressSequentially('19.5', { delay: 100 });
  console.log('typed air weight @', elapsed().toFixed(2));

  await waitUntil(line1End - 2);
  await page.locator('#od').fill('');
  await page.locator('#od').pressSequentially('5.0', { delay: 100 });
  console.log('typed OD @', elapsed().toFixed(2));

  // ---- line 2: "closed-ended... drops further, to nine point three" --
  // scroll to and hold on the closed-ended output line. ----
  await waitUntil(line1End + 0.4);
  await page.locator('#id').scrollIntoViewIfNeeded();
  await page.locator('#id').fill('');
  await page.locator('#id').pressSequentially('4.276', { delay: 100 });
  console.log('typed ID @', elapsed().toFixed(2));

  await waitUntil(line2End - 0.3);
  console.log('holding on closed-ended output @', elapsed().toFixed(2));

  // ---- line 3: "same steel, same mud... both numbers come straight from
  // the calculator" -- confirm the fluid weight fields (same mud inside and
  // out) as the narration makes that exact point. ----
  await waitUntil(line2End + 0.4);
  await page.locator('#fwa').fill('');
  await page.locator('#fwa').pressSequentially('10', { delay: 100 });
  console.log('typed annulus fluid weight @', elapsed().toFixed(2));

  await waitUntil(line2End + 2.0);
  await page.locator('#fwi').fill('');
  await page.locator('#fwi').pressSequentially('10', { delay: 100 });
  console.log('typed inside fluid weight @', elapsed().toFixed(2));

  // Hold on the final output through the end of narration plus a short
  // silent tail so the payoff has time to register.
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
