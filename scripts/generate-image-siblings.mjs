// One-off conversion script: generates AVIF + WebP siblings for every raster
// image under public/images/, at the same pixel dimensions as the source.
// Originals are never touched, moved, or deleted — this only ADDS new files
// next to them. Safe to re-run: skips any sibling that already exists unless
// --force is passed.
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..', 'public', 'images');
const force = process.argv.includes('--force');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await walk(full));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

const sources = (await walk(root)).sort();
console.log(`Found ${sources.length} source JPG/PNG files under ${root}`);

let webpMade = 0, webpSkipped = 0, avifMade = 0, avifSkipped = 0, failed = 0;

for (const src of sources) {
  const ext = path.extname(src);
  const base = src.slice(0, -ext.length);
  const webpPath = `${base}.webp`;
  const avifPath = `${base}.avif`;

  try {
    if (force || !(await exists(webpPath))) {
      await sharp(src).webp({ quality: 82 }).toFile(webpPath);
      webpMade++;
    } else {
      webpSkipped++;
    }
  } catch (e) {
    console.error(`WEBP FAIL: ${src} -> ${e.message}`);
    failed++;
  }

  try {
    if (force || !(await exists(avifPath))) {
      await sharp(src).avif({ quality: 65, effort: 4 }).toFile(avifPath);
      avifMade++;
    } else {
      avifSkipped++;
    }
  } catch (e) {
    console.error(`AVIF FAIL: ${src} -> ${e.message}`);
    failed++;
  }
}

console.log('--- Summary ---');
console.log(`Sources: ${sources.length}`);
console.log(`WebP created: ${webpMade}, skipped (already existed): ${webpSkipped}`);
console.log(`AVIF created: ${avifMade}, skipped (already existed): ${avifSkipped}`);
console.log(`Failures: ${failed}`);
