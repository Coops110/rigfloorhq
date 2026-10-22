// One-off: rewrites the <picture> markup on /equipment and /es/equipment to
// point card thumbnails at the new 64/96px variants (generate-equipment-thumbs.mjs)
// instead of the full 800-1264px originals -- 2026-10-22 audit finding, ~331 KiB
// wasted per page load on a box displayed at 32x32 CSS px.
import { readFile, writeFile } from 'node:fs/promises';

const files = [
  'src/pages/equipment/index.astro',
  'src/pages/es/equipment/index.astro',
];

const avifRe = /<source type="image\/avif" srcset="\/images\/equipment\/([a-zA-Z0-9_-]+)\.avif" \/>/g;
const webpRe = /<source type="image\/webp" srcset="\/images\/equipment\/([a-zA-Z0-9_-]+)\.webp" \/>/g;
const imgRe = /<img class="card-thumb" src="\/images\/equipment\/([a-zA-Z0-9_-]+)\.jpg" width="\d+" height="\d+" alt="([^"]*)" loading="lazy" \/>/g;

for (const file of files) {
  let text = await readFile(file, 'utf8');
  let avifCount = 0, webpCount = 0, imgCount = 0;

  text = text.replace(avifRe, (_, name) => {
    avifCount++;
    return `<source type="image/avif" srcset="/images/equipment/${name}-64.avif 64w, /images/equipment/${name}-96.avif 96w" sizes="32px" />`;
  });
  text = text.replace(webpRe, (_, name) => {
    webpCount++;
    return `<source type="image/webp" srcset="/images/equipment/${name}-64.webp 64w, /images/equipment/${name}-96.webp 96w" sizes="32px" />`;
  });
  text = text.replace(imgRe, (_, name, alt) => {
    imgCount++;
    return `<img class="card-thumb" src="/images/equipment/${name}-96.jpg" width="32" height="32" alt="${alt}" loading="lazy" />`;
  });

  await writeFile(file, text, 'utf8');
  console.log(`${file}: avif=${avifCount} webp=${webpCount} img=${imgCount}`);
}
