// One entry per brand. Each network key names the account the hub should show.
// Leave a value empty ('') until you have connected the account; the hub lists
// every connected-but-unassigned account on the page so you can copy the exact
// handle or id in here.
//
//   facebook.pageId      numeric Facebook Page id (the number in the Page URL)
//   instagram.username   Instagram handle, no @ (must be a Business/Creator account)
//   tiktok.username      TikTok handle, no @
//   youtube.channelId    "UC..." channel id
//   pinterest.username   Pinterest handle
//
// gscSite and ga4PropertyId are optional and independent of the social
// networks above -- they drive the small search/analytics status line, read
// via the shared Google service account (see src/lib/google.js), not a
// per-platform "Connect" flow. Leave either blank to just omit that figure.
//   gscSite         exact Search Console property, e.g. "sc-domain:example.com"
//                    (run `gsc_sites` or check Search Console settings for the
//                    exact string -- domain vs url-prefix property matters)
//   ga4PropertyId   the numeric GA4 property id (no "properties/" prefix)

export const BRANDS = [
  {
    id: 'rigfloorhq',
    name: 'RigFloorHQ',
    site: 'https://rigfloorhq.com',
    gscSite: 'sc-domain:rigfloorhq.com',
    ga4PropertyId: '548204808',
    facebook: { pageId: '1215544864984509' },
    tiktok: { username: 'rigfloorhq' },
  },
  {
    id: 'airprohq',
    name: 'AirProHQ',
    site: 'https://airprohq.com',
    gscSite: 'sc-domain:airprohq.com',
    ga4PropertyId: '547810322',
    facebook: { pageId: '' },
    tiktok: { username: '' },
  },
  {
    id: 'garagedoorprohq',
    name: 'GarageDoorProHQ',
    site: 'https://garagedoorprohq.com',
    gscSite: 'sc-domain:garagedoorprohq.com',
    ga4PropertyId: '549939281',
    facebook: { pageId: '' },
    tiktok: { username: '' },
  },
  {
    id: 'hotdailydiaries',
    name: 'Hot Daily Diaries',
    site: '',
    facebook: { pageId: '1410342212153814' },
    instagram: { username: 'hotdailydiaries' },
    tiktok: { username: 'hotdailydiaries' },
    youtube: { channelId: 'UCeswO01SXN144ljQlMwANjQ' },
  },
  {
    id: 'calmbrainco',
    name: 'Calm Brain Co',
    site: 'https://calmbrainco.shop',
    gscSite: 'sc-domain:calmbrainco.shop',
    ga4PropertyId: '556473755',
    facebook: { pageId: '1414715711714173' },
  },
  {
    id: 'hypnoticbar',
    name: 'Hypnotic Bar',
    site: 'https://www.hypnoticbar.com',
    gscSite: 'sc-domain:hypnoticbar.com',
    // No GA4 property found under the connected Google account as of 2026-10-07,
    // and deliberately no social networks -- Chris does not want this one
    // monetized or pushed on social (see Active Priorities, 2026-09-09). Site
    // health and search are still worth knowing about; just those two here.
  },
];

// Deep-links only -- never store real credentials here or anywhere in this
// app. Each one just opens the real login page in a new tab.
export const QUICK_LINKS = [
  { label: 'Namecheap', url: 'https://www.namecheap.com/myaccount/login/' },
  { label: 'Cloudflare', url: 'https://dash.cloudflare.com/login' },
  { label: 'Vercel', url: 'https://vercel.com/login' },
  { label: 'GitHub', url: 'https://github.com/login' },
  { label: 'Zoho Mail', url: 'https://mail.zoho.com/' },
  { label: 'Google Search Console', url: 'https://search.google.com/search-console' },
  { label: 'Google Analytics', url: 'https://analytics.google.com/' },
  { label: 'Metricool', url: 'https://app.metricool.com/' },
];

// How many recent posts to pull per account. Keep it modest: every account is
// one or two API calls per refresh, and Pinterest trial access is 1,000/day.
export const POSTS_PER_ACCOUNT = 20;

export const NETWORKS = {
  facebook:  { label: 'Facebook',  provider: 'meta' },
  instagram: { label: 'Instagram', provider: 'meta' },
  tiktok:    { label: 'TikTok',    provider: 'tiktok' },
  youtube:   { label: 'YouTube',   provider: 'youtube' },
  pinterest: { label: 'Pinterest', provider: 'pinterest' },
};
