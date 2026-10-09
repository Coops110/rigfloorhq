// Facebook Pages + Instagram (Business/Creator) via the Meta Graph API.
// Supports multiple simultaneous Meta logins -- each connection is keyed by
// the real Facebook user id of whoever authorized, discovered via /me at
// callback time, so connecting a second login (e.g. Hot Daily Diaries'
// deliberately separate account) adds a new connection instead of
// overwriting the first. Every Page across every connection is searched when
// collecting, so config.js never needs to say which login owns a Page.
// Page tokens derived from a long-lived user token do not expire, so this
// rarely needs reconnecting.
import { fetchJson, form, now, seconds, num } from '../lib/util.js';
import { loadMap, saveMap } from '../lib/store.js';
import { POSTS_PER_ACCOUNT } from '../config.js';

const V = 'v23.0';
const G = `https://graph.facebook.com/${V}`;
const KEY = 'tokens:meta';

// business_management is required here even though this code never calls
// the Business Manager API directly: Meta's me/accounts endpoint silently
// omits any Page owned by a Business Portfolio (as opposed to a page sitting
// directly on the personal profile) unless the login explicitly grants
// business_management. Confirmed 2026-10-07 -- RigFloorHQ and Calm Brain
// Co's Pages are both Business Portfolio assets, and me/accounts returned
// zero Pages on every attempt until this scope was added to the request.
// pages_read_user_content is required separately from pages_read_engagement
// for the /posts endpoint itself (confirmed 2026-10-07 via a real HTTP 400:
// "(#10) This endpoint requires the 'pages_read_user_content' permission").
//
// instagram_basic/instagram_manage_insights added 2026-10-08 so Hot Daily
// Diaries' Instagram (linked to its Page, now reachable from the main login
// via the same Page-admin access used for its Facebook connection) shows up
// on the hub too. Re-authorizing the main Meta connection is required once
// this scope widens -- Meta does not retroactively grant a new scope to an
// already-issued token, Chris has to go through /auth/meta again.
function scopesForConfig() {
  return ['pages_show_list', 'pages_read_engagement', 'pages_read_user_content', 'read_insights', 'business_management', 'instagram_basic', 'instagram_manage_insights'];
}

async function fetchAll(url, max = 200) {
  const out = [];
  let next = url;
  while (next && out.length < max) {
    const page = await fetchJson(next);
    out.push(...(page.data || []));
    next = page.paging?.next || null;
  }
  return out;
}

function insightValue(insights, name) {
  const row = insights?.data?.find((d) => d.name === name);
  const v = row?.values?.[0]?.value;
  return typeof v === 'object' && v !== null ? null : num(v);
}

function accountsFrom(conn) {
  const out = [];
  for (const p of Object.values(conn.pages || {})) {
    out.push({ network: 'facebook', id: p.id, handle: p.id, name: p.name, connected_at: conn.connected_at });
    if (p.ig) out.push({ network: 'instagram', id: p.ig.id, handle: p.ig.username, name: `@${p.ig.username} (via ${p.name})`, connected_at: conn.connected_at });
  }
  return out;
}

/** Find a Page by id across every connected login. */
function findPageById(map, pageId) {
  for (const conn of Object.values(map)) {
    const page = conn.pages?.[pageId];
    if (page) return page;
  }
  return null;
}

/** Find a Page by its linked Instagram username across every connected login. */
function findPageByIgUsername(map, username) {
  const want = String(username || '').replace(/^@/, '').toLowerCase();
  for (const conn of Object.values(map)) {
    const page = Object.values(conn.pages || {}).find((p) => p.ig && p.ig.username.toLowerCase() === want);
    if (page) return page;
  }
  return null;
}

export const meta = {
  id: 'meta',
  label: 'Facebook Pages + Instagram',
  networks: ['facebook', 'instagram'],
  configured: (env) => !!(env.META_APP_ID && env.META_APP_SECRET),

  authUrl(env, origin, state) {
    const p = form({
      client_id: env.META_APP_ID,
      redirect_uri: `${origin}/auth/meta/callback`,
      scope: scopesForConfig().join(','),
      response_type: 'code',
      state,
    });
    return `https://www.facebook.com/${V}/dialog/oauth?${p}`;
  },

  async callback(env, origin, url) {
    const code = url.searchParams.get('code');
    if (!code) throw new Error(url.searchParams.get('error_description') || url.searchParams.get('error') || 'Meta returned no code');
    const redirect_uri = `${origin}/auth/meta/callback`;
    const short = await fetchJson(`${G}/oauth/access_token?${form({ client_id: env.META_APP_ID, client_secret: env.META_APP_SECRET, redirect_uri, code })}`);
    const long = await fetchJson(`${G}/oauth/access_token?${form({ grant_type: 'fb_exchange_token', client_id: env.META_APP_ID, client_secret: env.META_APP_SECRET, fb_exchange_token: short.access_token })}`);
    const userToken = long.access_token;
    const me = await fetchJson(`${G}/me?${form({ fields: 'id,name', access_token: userToken })}`);
    const pages = await fetchAll(`${G}/me/accounts?${form({ fields: 'id,name,access_token,instagram_business_account{id,username}', limit: 100, access_token: userToken })}`);
    const conn = {
      user_id: me.id,
      user_name: me.name,
      user_token: userToken,
      user_expires_at: now() + seconds(long.expires_in || 60 * 86400),
      connected_at: now(),
      pages: {},
    };
    for (const p of pages) {
      conn.pages[p.id] = {
        id: p.id,
        name: p.name,
        token: p.access_token,
        ig: p.instagram_business_account ? { id: p.instagram_business_account.id, username: p.instagram_business_account.username } : null,
      };
    }
    const map = await loadMap(env, KEY);
    map[me.id] = conn;
    await saveMap(env, KEY, map);
    return accountsFrom(conn);
  },

  async accounts(env) {
    const map = await loadMap(env, KEY);
    return Object.values(map).flatMap(accountsFrom);
  },

  async collect(env, network, cfg) {
    const map = await loadMap(env, KEY);
    if (network === 'facebook') {
      const page = findPageById(map, cfg.pageId);
      if (!page) throw new Error(`Page ${cfg.pageId} is not among any connected Meta login`);
      return collectFacebook(page);
    }
    const page = findPageByIgUsername(map, cfg.username);
    if (!page) throw new Error(`Instagram @${cfg.username} is not linked to any connected Meta login`);
    return collectInstagram(page);
  },

  // Page tokens do not expire. Nothing to refresh; report connection/page
  // counts so the page can show them.
  async maintain(env) {
    const map = await loadMap(env, KEY);
    const conns = Object.values(map);
    if (!conns.length) return { skipped: true };
    return { connections: conns.length, pages: conns.reduce((n, c) => n + Object.keys(c.pages || {}).length, 0) };
  },
};

async function pageViews28d(pageId, t) {
  // page_views_total is real page-profile visits (confirmed live 2026-10-09),
  // a different, smaller number than the "Views" Facebook's own Professional
  // Dashboard shows per post (that figure blends photo+video content views
  // and is not exposed anywhere in the public Graph API -- page_impressions,
  // page_impressions_unique and page_content_activity were all tried live the
  // same day and every one came back "(#100) The value must be a valid
  // insights metric"). Still worth surfacing: it's the one real views-shaped
  // number this API can give us.
  try {
    const res = await fetchJson(`${G}/${pageId}/insights?${form({ metric: 'page_views_total', period: 'days_28', access_token: t })}`);
    const vals = res.data?.[0]?.values || [];
    return vals.length ? num(vals[vals.length - 1].value) : null;
  } catch {
    return null;
  }
}

async function collectFacebook(page) {
  const t = page.token;
  const prof = await fetchJson(`${G}/${page.id}?${form({ fields: 'name,fan_count,followers_count,link,picture{url}', access_token: t })}`);
  const views = await pageViews28d(page.id, t);
  const base = 'id,message,created_time,permalink_url,full_picture,reactions.summary(total_count).limit(0),comments.summary(total_count).limit(0),shares';
  let posts;
  let viewsAvailable = true;
  try {
    // post_media_views no longer exists on Meta's side (confirmed 2026-10-08:
    // every impressions/views metric Meta still recognizes for a Page post is
    // post_video_views, and it only returns a number for actual video/Reel
    // posts -- Photo posts have no view metric left in the public Graph API
    // at all, Meta Business Suite's own "Viewers"/"Views" export columns for
    // photos are not exposed here. post_impressions, post_impressions_unique,
    // post_engaged_users and post_photo_view were all tried live and every
    // one came back "(#100) The value must be a valid insights metric".
    posts = (await fetchJson(`${G}/${page.id}/posts?${form({ fields: `${base},insights.metric(post_video_views)`, limit: POSTS_PER_ACCOUNT, access_token: t })}`)).data || [];
  } catch {
    // Meta renames post insight metrics every year or so; fall back to counts only.
    viewsAvailable = false;
    posts = (await fetchJson(`${G}/${page.id}/posts?${form({ fields: base, limit: POSTS_PER_ACCOUNT, access_token: t })}`)).data || [];
  }
  return {
    handle: prof.name,
    link: prof.link || `https://www.facebook.com/${page.id}`,
    profile: { followers: num(prof.followers_count ?? prof.fan_count), views, avatar: prof.picture?.data?.url || null, extra: views == null ? [] : [{ label: 'Page views (28d)', value: views }] },
    notes: viewsAvailable ? [] : ['Post views metric unavailable from Meta; showing reactions, comments and shares only.'],
    posts: posts.map((p) => ({
      id: p.id,
      title: p.message || '',
      url: p.permalink_url,
      date: p.created_time,
      thumb: p.full_picture || null,
      views: viewsAvailable ? insightValue(p.insights, 'post_video_views') : null,
      likes: num(p.reactions?.summary?.total_count),
      comments: num(p.comments?.summary?.total_count),
      shares: num(p.shares?.count) ?? 0,
    })),
  };
}

async function collectInstagram(page) {
  const t = page.token;
  const ig = page.ig.id;
  const prof = await fetchJson(`${G}/${ig}?${form({ fields: 'username,followers_count,media_count,profile_picture_url', access_token: t })}`);
  const base = 'id,caption,media_type,media_product_type,permalink,thumbnail_url,media_url,timestamp,like_count,comments_count';
  let media;
  let insightsAvailable = true;
  try {
    media = (await fetchJson(`${G}/${ig}/media?${form({ fields: `${base},insights.metric(views,shares,saved)`, limit: POSTS_PER_ACCOUNT, access_token: t })}`)).data || [];
  } catch {
    insightsAvailable = false;
    media = (await fetchJson(`${G}/${ig}/media?${form({ fields: base, limit: POSTS_PER_ACCOUNT, access_token: t })}`)).data || [];
  }
  return {
    handle: `@${prof.username}`,
    link: `https://www.instagram.com/${prof.username}/`,
    profile: { followers: num(prof.followers_count), avatar: prof.profile_picture_url || null, posts: num(prof.media_count), extra: prof.media_count == null ? [] : [{ label: 'Total posts', value: num(prof.media_count) }] },
    notes: insightsAvailable ? [] : ['Instagram insights (views, shares) unavailable; showing likes and comments only.'],
    posts: media.map((m) => ({
      id: m.id,
      title: m.caption || '',
      url: m.permalink,
      date: m.timestamp,
      thumb: m.thumbnail_url || (m.media_type === 'VIDEO' ? null : m.media_url) || null,
      views: insightsAvailable ? insightValue(m.insights, 'views') : null,
      likes: num(m.like_count),
      comments: num(m.comments_count),
      shares: insightsAvailable ? insightValue(m.insights, 'shares') : null,
      saves: insightsAvailable ? insightValue(m.insights, 'saved') : null,
    })),
  };
}
