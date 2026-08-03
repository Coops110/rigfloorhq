import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Blog slugs carrying `noindex: true` in their frontmatter. Must be kept in
// sync by hand — see the filter comment below for why.
const NOINDEX_SLUGS = ['welcome-to-rigfloorhq'];

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
      filter: (page) => !NOINDEX_SLUGS.some((slug) => page.includes(`/blog/${slug}`)),
    }),
  ],
});
