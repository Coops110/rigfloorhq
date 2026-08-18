import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildGitLastmodMap, sourceCandidates } from './scripts/git-lastmod.mjs';

// Blog slugs carrying `noindex: true` in their frontmatter. Must be kept in
// sync by hand — see the filter comment below for why.
const NOINDEX_SLUGS = ['welcome-to-rigfloorhq'];

// Whole paths that are noindexed for reasons other than blog frontmatter.
// /links is the social bio landing page: a navigation utility, not content.
const NOINDEX_PATHS = ['/links'];

// Read git history once at config load rather than per URL.
const lastmodMap = buildGitLastmodMap();

export default defineConfig({
  site: 'https://rigfloorhq.com',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  },
  compressHTML: true,
  integrations: [
    sitemap({
      // Keep noindexed URLs out of the sitemap. Listing a page as a crawl
      // priority while its robots meta says noindex is a contradictory signal.
      //
      // The sitemap filter only sees the URL, not the frontmatter, so slugs
      // marked `noindex: true` in src/content have to be repeated here. Both
      // language versions share a slug, so one entry covers /blog/<slug> and
      // /es/blog/<slug>.
      filter: (page) =>
        !NOINDEX_SLUGS.some((slug) => page.includes(`/blog/${slug}`)) &&
        !NOINDEX_PATHS.some((path) => page.replace(/\/$/, '').endsWith(path)),

      // <lastmod> from the last git commit touching each page's own source
      // file. See scripts/git-lastmod.mjs for why mtime is not usable here and
      // why layout changes deliberately do not bump every page.
      //
      // A URL with no resolvable source gets no lastmod rather than a guessed
      // one. Omitting the field is a missing signal; a wrong one is a false
      // claim that Google learns to discount across the whole sitemap.
      serialize(item) {
        if (!lastmodMap) return item;
        const { pathname } = new URL(item.url);
        for (const candidate of sourceCandidates(pathname)) {
          const date = lastmodMap.get(candidate);
          if (date) {
            item.lastmod = date;
            return item;
          }
        }
        return item;
      },
    }),

    // Reports lastmod coverage on every build. Runs after the sitemap
    // integration because integrations fire in array order, so the files it
    // reads already exist. This exists because a silently empty git map would
    // otherwise produce a valid-looking sitemap with no dates in it at all.
    {
      name: 'sitemap-lastmod-report',
      hooks: {
        'astro:build:done': ({ dir, logger }) => {
          const outDir = fileURLToPath(dir);
          const files = readdirSync(outDir).filter(
            (f) => f.startsWith('sitemap-') && f.endsWith('.xml') && f !== 'sitemap-index.xml'
          );
          let urls = 0;
          let dated = 0;
          for (const file of files) {
            const xml = readFileSync(`${outDir}/${file}`, 'utf8');
            urls += (xml.match(/<loc>/g) || []).length;
            dated += (xml.match(/<lastmod>/g) || []).length;
          }
          if (!urls) return;
          const pct = Math.round((dated / urls) * 100);
          const line = `${dated}/${urls} sitemap URLs have lastmod (${pct}%)`;
          if (dated === urls) logger.info(line);
          else logger.warn(`${line} — URLs without one had no resolvable source file`);
        },
      },
    },
  ],
});
