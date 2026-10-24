import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildGitLastmodMap, sourceCandidates } from './scripts/git-lastmod.mjs';
import { generateLlmsTxt, generateLlmsFullTxt } from './scripts/generate-llms-txt.mjs';
import { fingerprintScripts } from './scripts/fingerprint-scripts.mjs';

// Blog slugs carrying `noindex: true` in their frontmatter. Must be kept in
// sync by hand — see the filter comment below for why.
const NOINDEX_SLUGS = ['welcome-to-rigfloorhq'];

// Whole paths that are noindexed for reasons other than blog frontmatter.
// /links is the social bio landing page: a navigation utility, not content.
const NOINDEX_PATHS = ['/links'];

// The 8 well-control-quiz topic pages are the one place on the site where
// the ES slug is a real translation rather than the same string as the EN
// one (every other page keeps an identical slug across languages). Needed
// here because counterpartPathname() below assumes identical slugs; without
// this map it builds a /es/well-control-quiz/<english-slug> URL that 404s.
// kill-sheet-practice and the quiz hub itself use the same slug both
// languages, so they're deliberately not in this map.
const QUIZ_SLUG_EN_TO_ES = {
  'basic-knowledge': 'conocimientos-basicos',
  'basic-pressure': 'presion-basica',
  'kill-methods': 'metodos-de-matanza',
  'shut-in-conditions': 'condiciones-de-cierre',
  'some-tricky-stuff': 'preguntas-dificiles',
  'subsea-questions': 'preguntas-submarinas',
  'volumes-and-maasp': 'volumenes-y-maasp',
  'warning-signs-and-shut-in': 'senales-de-advertencia-y-cierre',
};
const QUIZ_SLUG_ES_TO_EN = Object.fromEntries(
  Object.entries(QUIZ_SLUG_EN_TO_ES).map(([en, es]) => [es, en])
);

// Read git history once at config load rather than per URL.
const lastmodMap = buildGitLastmodMap();

// The EN/ES counterpart path for a given pathname, or null if that
// counterpart page genuinely doesn't exist (e.g. /links has no ES version).
// Mirrors BaseLayout's own alternateHref per page, so the sitemap's
// xhtml:link hreflang alternates agree with what's actually in <head>.
function counterpartPathname(pathname) {
  const p = pathname.replace(/^\/+|\/+$/g, '');

  // Quiz topic pages: translate the slug itself, not just the /es/ prefix.
  const quizEnMatch = p.match(/^well-control-quiz\/([^/]+)$/);
  if (quizEnMatch && QUIZ_SLUG_EN_TO_ES[quizEnMatch[1]]) {
    return `/es/well-control-quiz/${QUIZ_SLUG_EN_TO_ES[quizEnMatch[1]]}`;
  }
  const quizEsMatch = p.match(/^es\/well-control-quiz\/([^/]+)$/);
  if (quizEsMatch && QUIZ_SLUG_ES_TO_EN[quizEsMatch[1]]) {
    return `/well-control-quiz/${QUIZ_SLUG_ES_TO_EN[quizEsMatch[1]]}`;
  }

  const counterpart = p === 'es' || p.startsWith('es/')
    ? p === 'es' ? '' : p.slice(3)
    : p === ''
      ? 'es'
      : `es/${p}`;
  const exists = sourceCandidates(`/${counterpart}`).some(
    (candidate) => existsSync(candidate)
  );
  return exists ? `/${counterpart}`.replace(/\/$/, '') || '/' : null;
}

export default defineConfig({
  site: 'https://rigfloorhq.com',
  trailingSlash: 'never',
  build: {
    format: 'directory',
    // The sitewide global.css+fonts.css bundle is small (~7KB) and used on
    // every page, so forcing it inline avoids a render-blocking external
    // stylesheet request without the staleness cost it'd have on a large,
    // page-specific bundle.
    inlineStylesheets: 'always'
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
        const { pathname } = new URL(item.url);

        // trailingSlash: 'never' strips the slash from every path, but the
        // root URL has no path segment to strip it from — it collapses to
        // the bare origin, which doesn't match the homepage's own canonical
        // tag (https://rigfloorhq.com/). Restore it here, just for root.
        if (pathname === '/' && !item.url.endsWith('/')) {
          item.url = `${item.url}/`;
        }

        if (lastmodMap) {
          for (const candidate of sourceCandidates(pathname)) {
            const date = lastmodMap.get(candidate);
            if (date) {
              item.lastmod = date;
              break;
            }
          }
        }

        // xhtml:link hreflang alternates, same EN/ES pairing already declared
        // in each page's own <head> (see BaseLayout's alternateHref). Only
        // added when the counterpart page actually exists on disk.
        const isEs = pathname.replace(/^\/+|\/+$/g, '').split('/')[0] === 'es';
        const counterpart = counterpartPathname(pathname);
        if (counterpart) {
          const site = 'https://rigfloorhq.com';
          const selfLang = isEs ? 'es' : 'en';
          const otherLang = isEs ? 'en' : 'es';
          const enUrl = isEs ? `${site}${counterpart}` : item.url;
          item.links = [
            { url: item.url, lang: selfLang },
            { url: `${site}${counterpart}`, lang: otherLang },
            { url: enUrl, lang: 'x-default' },
          ];
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

    // llms.txt, generated from the real build output rather than hand-kept.
    // Runs after every page HTML file exists, so it reads real titles,
    // descriptions, canonicals and robots meta rather than guessing. See
    // scripts/generate-llms-txt.mjs for why: the hand-written version this
    // replaced listed 25 of 279 URLs and was wrong the moment a page moved.
    // ?v=<content hash> on every /scripts/*.js reference in the built HTML,
    // so vercel.json can cache them immutably. See the script for why this
    // rewrites dist/ rather than page sources.
    {
      name: 'fingerprint-scripts',
      hooks: {
        'astro:build:done': ({ dir, logger }) => {
          fingerprintScripts(fileURLToPath(dir), logger);
        },
      },
    },

    {
      name: 'llms-txt-generator',
      hooks: {
        'astro:build:done': ({ dir, logger }) => {
          const outDir = fileURLToPath(dir);
          generateLlmsTxt(outDir, logger);
          generateLlmsFullTxt(outDir, logger);
        },
      },
    },
  ],
});
