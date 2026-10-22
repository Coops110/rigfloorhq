// One-off migration: give every calculator page a real, linked WebPage node
// (audit findings: "calculator WebPage nodes are thin" / "not linked to
// their WebApplication"). Two groups, handled differently:
//
// Group A (30 files): only had webAppLd, no WebPage node at all. Adds one
// via calculatorWebPage(webAppLd, {lang}).
//
// Group B (5 EN + 5 ES, Jabin-reviewed): already had a hand-written thin
// webPageLd with reviewedBy/lastReviewed. Replaced with the same helper so
// it's no longer a one-off, keeping the real reviewedBy/lastReviewed values.
//
// Run with: node scripts/add-calculator-webpage.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();

function isEs(file) {
  return file.includes(`${path.sep}es${path.sep}`);
}

function importLine(file) {
  const libPath = isEs(file) ? '../../../lib/techarticle.js' : '../../lib/techarticle.js';
  return `import { calculatorWebPage } from '${libPath}';`;
}

function insertAfterLastImport(src, newImportLine) {
  if (src.includes(newImportLine)) return src; // idempotent
  const importRe = /^import .+;\r?\n/gm;
  let lastMatch = null;
  let m;
  while ((m = importRe.exec(src))) lastMatch = m;
  if (!lastMatch) throw new Error('No import lines found');
  const insertAt = lastMatch.index + lastMatch[0].length;
  return src.slice(0, insertAt) + newImportLine + '\n' + src.slice(insertAt);
}

function insertWebPageConst(src, constLine) {
  const idx = src.indexOf('const webAppLd = {');
  if (idx === -1) throw new Error('No webAppLd const found');
  const fenceIdx = src.search(/\r?\n---\r?\n/g);
  const fenceMatch = src.slice(idx).match(/\r?\n---\r?\n/);
  if (!fenceMatch) throw new Error('No frontmatter fence found after webAppLd');
  const absoluteFenceIdx = idx + fenceMatch.index;
  return src.slice(0, absoluteFenceIdx) + '\n\n' + constLine + src.slice(absoluteFenceIdx);
}

// Group B (10 files, hand-fixed already in this session): kill-sheet,
// hydrostatic, gas-migration, mud-weight-window (EN+ES), formulas-cheat-sheet
// (already fully correct, untouched). Skipped here — see git history.

// Group A: every other calculator file with extraJsonLd={[webAppLd]} and no
// WebPage node yet.
function listFiles(dir) {
  const out = execSync(`git -C "${root}" grep -l "extraJsonLd={\\[webAppLd\\]}" -- "${dir}"`, { encoding: 'utf8' });
  return out.split('\n').filter(Boolean).map((p) => path.join(root, p));
}

let groupACount = 0;
for (const dir of ['src/pages/calculators', 'src/pages/es/calculators']) {
  for (const file of listFiles(dir)) {
    let src = readFileSync(file, 'utf8');
    const lang = isEs(file) ? 'es' : 'en';
    src = insertAfterLastImport(src, importLine(file));
    src = insertWebPageConst(src, `const webPageLd = calculatorWebPage(webAppLd, { lang: '${lang}' });\n`);
    src = src.replace('extraJsonLd={[webAppLd]}', 'extraJsonLd={[webAppLd, webPageLd]}');
    writeFileSync(file, src);
    groupACount++;
  }
}
console.log(`Group A (new WebPage node): ${groupACount} files`);
