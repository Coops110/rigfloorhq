// Article / TechArticle JSON-LD builder.
//
// Dates come from git, through the same single `git log` pass the sitemap
// uses (scripts/git-lastmod.mjs):
//   dateModified  = the last commit touching the page's own source file,
//                   which is exactly the sitemap <lastmod> for that URL;
//   datePublished = the first commit touching it.
// There is no separate editorial date recorded anywhere for these pages, so
// git is the only honest per-page answer. A page whose file has no resolvable
// history gets neither field rather than a guessed date, and in a shallow
// clone datePublished is omitted (the oldest visible commit is only the
// fetch-depth cut-off, not the real first commit).
//
// Both values are normalised to UTC (toISOString) because that is the form
// @astrojs/sitemap writes <lastmod> in, so the two strings match exactly.
import fs from 'node:fs';
import path from 'node:path';
import { buildGitDatesMap } from '../../scripts/git-lastmod.mjs';
import { authorChrisCooper } from './person.js';

const siteUrl = 'https://rigfloorhq.com';
const ORG_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;

// Computed once per build process (cached inside git-lastmod.mjs), so
// `git log` runs once for the whole build rather than once per page.
const datesMap = buildGitDatesMap();

function utc(iso) {
  return iso ? new Date(iso).toISOString() : undefined;
}

/**
 * { datePublished, dateModified } for one repo-relative source file, either
 * field omitted when it cannot be resolved honestly.
 * @param {string} sourcePath e.g. 'src/pages/careers/roustabout.astro'
 */
export function gitDates(sourcePath) {
  const entry = datesMap ? datesMap.get(sourcePath) : undefined;
  if (!entry) return {};
  const out = {};
  if (entry.published) out.datePublished = utc(entry.published);
  if (entry.modified) out.dateModified = utc(entry.modified);
  return out;
}

/**
 * The same raster og:image BaseLayout resolves for a URL path: the per-page
 * card in public/og/ when one was generated, otherwise og-default.png. Never
 * names a file that is not on disk.
 * @param {string} urlPath e.g. '/careers/roustabout'
 */
export function ogImageFor(urlPath) {
  const trimmed = urlPath.replace(/^\/|\/$/g, '');
  const slug = trimmed === '' ? 'home' : trimmed.replace(/\//g, '-');
  const disk = path.join(process.cwd(), 'public', 'og', `${slug}.png`);
  return `${siteUrl}${fs.existsSync(disk) ? `/og/${slug}.png` : '/og-default.png'}`;
}

/**
 * @param {Object} opts
 * @param {string} opts.sourcePath repo-relative path to the page's own source
 *   file, e.g. 'src/pages/equipment/bop.astro'
 * @param {string} opts.path site-relative URL path, e.g. '/equipment/bop'
 * @param {string} opts.headline
 * @param {string} opts.description
 * @param {'en'|'es'} [opts.lang]
 * @param {'Article'|'TechArticle'} [opts.type]
 * @param {Object} [opts.extra] further properties merged in last
 *   (e.g. `about`, or `mainEntityOfPage` pointing at a page's own WebPage node)
 */
export function articleSchema({ sourcePath, path: urlPath, headline, description, lang = 'en', type = 'Article', extra = {} }) {
  const url = `${siteUrl}${urlPath}`;
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#article`,
    headline,
    description,
    url,
    // A full WebPage node, not a bare @id string — the audit's "equipment
    // mainEntityOfPage is a bare URL" finding. isPartOf/inLanguage/name let
    // this resolve as a real node in the page's own JSON-LD rather than a
    // dangling reference to one defined only elsewhere.
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: headline,
      inLanguage: lang,
      isPartOf: { '@id': WEBSITE_ID },
    },
    ...gitDates(sourcePath),
    inLanguage: lang,
    image: ogImageFor(urlPath),
    // Chris Cooper, not the Organization — he's RigFloorHQ's named author
    // (src/lib/person.js), and crediting the org itself as "author" on ~130
    // pages was the single largest driver of the audit's authorship finding.
    author: authorChrisCooper(),
    publisher: { '@id': ORG_ID },
    ...extra,
  };
}

/** TechArticle for equipment / reference pages. Same shape as articleSchema. */
export function techArticleSchema(opts) {
  return articleSchema({ ...opts, type: 'TechArticle' });
}

/**
 * The WebPage node for a calculator page, derived from its own WebApplication
 * object rather than re-typing the URL/name. Fixes two audit findings at
 * once: calculator WebPage nodes were thin (no name/isPartOf/inLanguage) and
 * not linked to their WebApplication — `mainEntity` here is that link.
 * `reviewedBy`/`lastReviewed` are only included when truly reviewed; most
 * calculators have neither and should not fabricate one.
 * @param {Object} webAppLd the page's own WebApplication object (must have
 *   @id ending in "#app", url, and name)
 * @param {Object} [opts]
 * @param {'en'|'es'} [opts.lang]
 * @param {Object} [opts.reviewedBy] from reviewedByJabin(), only if genuinely reviewed
 * @param {string} [opts.lastReviewed] ISO date, required alongside reviewedBy
 */
export function calculatorWebPage(webAppLd, { lang = 'en', reviewedBy, lastReviewed } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': webAppLd['@id'].replace(/#app$/, '#webpage'),
    url: webAppLd.url,
    name: webAppLd.name,
    inLanguage: lang,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: { '@id': webAppLd['@id'] },
    ...(reviewedBy ? { reviewedBy, lastReviewed } : {}),
  };
}
