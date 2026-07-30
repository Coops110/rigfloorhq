# RigFloorHQ — Complete Astro Site

## Status: COMPLETE & DEPLOY-READY
24 pages across 7 content clusters, sitemap.xml auto-generation configured, robots.txt included.

## Deploy to Vercel (free, ~5 minutes)

1. Go to **vercel.com** and sign up free (GitHub login is easiest).
2. Click **Add New → Project**.
3. Choose **"Deploy without Git"** / **"Upload"** if offered — or push this folder to a new GitHub repo first and import it (either works; Git import auto-redeploys on future edits, direct upload is faster for a one-time deploy).
4. Vercel auto-detects Astro. Leave build settings as default:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Click **Deploy**. In under a minute you'll get a live URL like:
   `https://rigfloorhq-yourname.vercel.app`

## Before your first deploy: update the domain

Open `astro.config.mjs` and change:
```js
site: 'https://rigfloorhq.com'
```
to whatever your actual Vercel URL will be (or your real custom domain once you buy one), e.g.:
```js
site: 'https://rigfloorhq-yourname.vercel.app'
```
This matters because the sitemap and canonical URLs are generated from this value — if it's wrong, Harbor (and Google) will crawl broken links.

## Sitemap generation

Uses `@astrojs/sitemap`, pinned to **v3.7.3** exactly (not a caret range).

Version 3.7.1 had a bug that crashed the build with `Cannot read properties of undefined (reading 'reduce')` during the `astro:build:done` step — see [withastro/astro#15894](https://github.com/withastro/astro/issues/15894). That is fixed as of 3.7.3, which is what the build runs on now.

The exact pin is deliberate: sitemap breakage is silent from the site's point of view (pages still render, only `sitemap-index.xml` is affected), so it is worth upgrading on purpose rather than by caret drift. To move up a version, bump it here, run `npm install && npm run build`, and confirm `dist/sitemap-index.xml` exists before deploying.

## Getting your sitemap URL for Harbor

Once deployed, your sitemap will automatically be live at:
```
https://[your-deployed-domain]/sitemap-index.xml
```
That's the exact URL Harbor's "Add a New Site" form is asking for. Paste that in, not the bare domain.

## Run it locally first (recommended, to catch errors before deploying)
```
npm install
npm run dev
```
Then open http://localhost:4321 and click through all the nav tabs to confirm everything looks right.

## Build for production (what Vercel runs automatically)
```
npm run build
npm run preview
```

## SEO features included
- Full meta tags (title, description, canonical) on every page
- Open Graph + Twitter Card tags
- JSON-LD structured data (Organization, WebSite, BreadcrumbList, HowTo, TechArticle)
- Auto-generated sitemap.xml via @astrojs/sitemap
- robots.txt pointing to the sitemap
- Breadcrumb navigation on every sub-page
- Semantic internal linking between all related content clusters

