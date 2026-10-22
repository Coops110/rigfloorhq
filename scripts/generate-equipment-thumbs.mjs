// One-off: generates small 64px/96px AVIF+WebP+JPG thumbnail variants for the
// 44 images used as 32x32 CSS card thumbnails on /equipment (and /es/equipment)
// -- those pages were serving full 800-1264px originals for a box displayed
// at 32px, wasting ~331 KiB per load (2026-10-22 audit finding). Originals
// are untouched; this only adds new "<name>-64.*" / "<name>-96.*" siblings
// next to them. Safe to re-run: skips files that already exist unless
// --force is passed.
import sharp from 'sharp';
import { readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, '..', 'public', 'images', 'equipment');
const force = process.argv.includes('--force');

const names = [
  'blast-joint-1', 'bridge-plug-1', 'bull-nose-plug-1', 'bumper-sub-1', 'burr-mill-1',
  'casing-cutter-1', 'casing-patch-1', 'casing-roller-dressing-tool-1', 'casing-shoe-1',
  'cement-retainer-1', 'centralizer-1', 'crossover-sub-1', 'expandable-sand-screen-1',
  'fishing-swivel-1', 'float-sub-1', 'gas-lift-mandrel-1', 'hydraulic-jar-1',
  'hydraulic-set-retainer-packer-1', 'jetting-tool-1', 'landing-nipple-1', 'lifting-sub-1',
  'liner-hanger-1', 'mule-shoe-1', 'mwd-tool-1', 'nmdc-pony-nmdc-1', 'on-off-tool-1',
  'packer-1', 'positive-displacement-mud-motor-1', 'power-swivel-1', 'pup-joint-1',
  'reversing-tool-1', 'sabs-dabs-1', 'safety-joint-1', 'scssv-1', 'section-mill-1',
  'sliding-sleeve-1', 'stabilizer-1', 'tcp-gun-1', 'tubing-plug-1', 'under-reamer-1',
  'wash-pipe-1', 'well-protector-1', 'whipstock-1', 'window-mill-1',
];

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

let made = 0, skipped = 0, failed = 0;

for (const name of names) {
  const src = path.join(dir, `${name}.jpg`);
  if (!(await exists(src))) {
    console.error(`MISSING source: ${name}.jpg`);
    failed++;
    continue;
  }
  const buf = await readFile(src);
  for (const size of [64, 96]) {
    for (const [ext, fn] of [
      ['avif', (img) => img.avif({ quality: 60 })],
      ['webp', (img) => img.webp({ quality: 70 })],
      ['jpg', (img) => img.jpeg({ quality: 75 })],
    ]) {
      const outPath = path.join(dir, `${name}-${size}.${ext}`);
      if (!force && (await exists(outPath))) { skipped++; continue; }
      try {
        const img = fn(sharp(buf).resize(size, size, { fit: 'cover', position: 'centre' }));
        await img.toFile(outPath);
        made++;
      } catch (e) {
        console.error(`FAILED ${name} ${size} ${ext}:`, e.message);
        failed++;
      }
    }
  }
}

console.log(`Done. Made ${made}, skipped ${skipped} (already existed), failed ${failed}.`);
