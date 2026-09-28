// Records the lag & volume calculator screen-recording segment for video
// 19, timed to land on the same beats as the pre-generated body narration
// (social/tiktok/19-lag-and-volume-cues.json). This calculator has 12
// input fields -- far more than any prior recorded video -- so rather than
// retyping every one (which wouldn't fit the narration's own pace), this
// retypes the specific fields each line actually names, same selective
// approach as record-14-buoyancy.mjs, and lets the rest sit at their
// already-loaded defaults. Hook line plays as its own audio clip under the
// static frame1 bookend, so this recording's narration timeline starts at
// t=0 with the body script only.
//
// Run: node scripts/record-19-lag-and-volume.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec19');
const CUES_PATH = path.join(REPO, 'social', 'tiktok', '19-lag-and-volume-cues.json');
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

  await page.goto(`${BASE_URL}/calculators/lag-and-volume`, { waitUntil: 'load' });
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

  // ---- line 1: "how long fluid or gas at the bit takes to reach
  // surface, tied to pump output and your own string volumes" -- retype
  // the pump fields (type stays triplex, the default). ----
  await waitUntil(line1End - 5);
  await page.locator('#liner').fill('');
  await page.locator('#liner').pressSequentially('6', { delay: 100 });
  console.log('typed liner diameter @', elapsed().toFixed(2));

  await waitUntil(line1End - 2.5);
  await page.locator('#spm').fill('');
  await page.locator('#spm').pressSequentially('50', { delay: 100 });
  console.log('typed pump speed @', elapsed().toFixed(2));

  // ---- line 2: "enter pump type, liner and stroke, drill string and BHA
  // dimensions, and hole size, and it solves pump output, then string and
  // annular volume" -- retype the string/hole dimensions this line names. ----
  await waitUntil(line1End + 0.4);
  await page.locator('#dp-len').scrollIntoViewIfNeeded();
  await page.locator('#dp-len').fill('');
  await page.locator('#dp-len').pressSequentially('9500', { delay: 60 });
  console.log('typed pipe length @', elapsed().toFixed(2));

  await waitUntil(line2End - 5);
  await page.locator('#bha-len').fill('');
  await page.locator('#bha-len').pressSequentially('500', { delay: 90 });
  console.log('typed BHA length @', elapsed().toFixed(2));

  await waitUntil(line2End - 2.5);
  await page.locator('#hole1').scrollIntoViewIfNeeded();
  await page.locator('#hole1').fill('');
  await page.locator('#hole1').pressSequentially('8.5', { delay: 100 });
  console.log('typed hole ID @', elapsed().toFixed(2));

  // ---- line 3: "that's thirty-seven minutes down to the bit, and
  // ninety-six point six minutes back up" -- hold on the two lag-time
  // outputs as the payoff numbers land. ----
  await waitUntil(line2End + 0.4);
  await page.locator('#out-timeup').scrollIntoViewIfNeeded();
  console.log('holding on lag time outputs @', elapsed().toFixed(2));

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
