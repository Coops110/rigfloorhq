// Facebook Pages + Instagram (Business/Creator) via the Meta Graph API.
// One connection covers every Page you administer and every Instagram
// professional account linked to one of those Pages. Page tokens derived from
// a long-lived user token do not expire, so this rarely needs reconnecting.
import { fetchJson, form, now, seconds, num } from '../lib/util.js';
import { kvGet, kvPut } from '../lib/kv.js';
import { POSTS_PER_ACCOUNT } from '../config.js';

const V = 'v23.0';
const G = `https://graph.facebook.com/${V}`;
const KEY = 'tokens:meta';

// Page-only scopes. This connection only ever covers one Facebook login at a
// time (see the "one Meta login at a time" limitation logged 2026-10-07), and
// the brands reachable from the main login (RigFloorHQ, AirProHQ,
// GarageDoorProHQ, Calm Brain Co) have no Instagram accounts configured.
// Hot Daily Diaries' Instagram needs its own separate login/app connection
// regardless of scopes requested here, since it can't share this token slot
// anyway -- so there's no config-driven way to "need" Instagram from this
// single connection today. Add instagram_basic/instagram_manage_insights
// back (and get them approved on the Meta app) once multi-connection
// support is built.
//
// business_management is required here even though this code never calls
// the Business Manager API directly: Meta's me/accounts endpoint silently
// omits any Page owned by a Business Portfolio (as opposed to a page sitting
// directly on the personal profile) unless the login explicitly grants
// business_management. Confirmed 2026-10-07 -- RigFloorHQ and Calm Brain
// Co's Pages are both Business Portfolio assets, and me/accounts returned
// zero Pages on every attempt until this scope was added to the request.
function scopesForConfig() {
  return ['pages_show_list', 'pages_read_engagement', 'read_insights', 'business_management'];
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

function accountsFrom(rec) {
  const out = [];
  for (const p of Object.values(rec.pages || {})) {
    out.push({ network: 'facebook', id: p.id, handle: p.id, name: p.name, connected_at: rec.connected_at });
    if (p.ig) out.push({ network: 'instagram', id: p.ig.id, handle: p.ig.username, name: `@${p.ig.username} (via ${p.name})`, connected_at: rec.connected_at });
  }
  return out;
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
    const pages = await fetchAll(`${G}/me/accounts?${form({ fields: 'id,name,access_token,instagram_business_account{id,username}', limit: 100, access_token: userToken })}`);
    const rec = {
      user_token: userToken,
      user_expires_at: now() + seconds(long.expires_in || 60 * 86400),
      connected_at: now(),
      pages: {},
    };
    for (const p of pages) {
      rec.pages[p.id] = {
        id: p.id,
        name: p.name,
        token: p.access_token,
        ig: p.instagram_business_account ? { id: p.instagram_business_account.id, username: p.instagram_business_account.username } : null,
      };
    }
    await kvPut(env, KEY, rec);
    return accountsFrom(rec);
  },

  async accounts(env) {
    const rec = await kvGet(env, KEY);
    return rec ? accountsFrom(rec) : [];
  },

  async collect(env, network, cfg) {
    const rec = await kvGet(env, KEY);
    if (!rec) throw new Error('Facebook/Instagram not connected yet');
    return network === 'facebook' ? collectFacebook(rec, cfg) : collectInstagram(rec, cfg);
  },

  // Page tokens do not expire. Nothing to refresh; report the user token age so
  // the page can show it.
  async maintain(env) {
    const rec = await kvGet(env, KEY);
    if (!rec) return { skipped: true };
    return { pages: Object.keys(rec.pages || {}).length, user_token_expires_at: rec.user_expires_at };
  },
};

async function collectFacebook(rec, cfg) {
  const page = rec.pages?.[cfg.pageId];
  if (!page) throw new Error(`Page ${cfg.pageId} is not among the connected Pages (${Object.keys(rec.pages || {}).join(', ') || 'none'})`);
  const t = page.token;
  const prof = await fetchJson(`${G}/${page.id}?${form({ fields: 'name,fan_count,followers_count,link,picture{url}', access_token: t })}`);
  const base = 'id,message,created_time,permalink_url,full_picture,reactions.summary(total_count).limit(0),comments.summary(total_count).limit(0),shares';
  let posts;
  let viewsAvailable = true;
  try {
    posts = (await fetchJson(`${G}/${page.id}/posts?${form({ fields: `${base},insights.metric(post_media_views)`, limit: POSTS_PER_ACCOUNT, access_token: t })}`)).data || [];
  } catch {
    // Meta renames post insight metrics every year or so; fall back to counts only.
    viewsAvailable = false;
    posts = (await fetchJson(`${G}/${page.id}/posts?${form({ fields: base, limit: POSTS_PER_ACCOUNT, access_token: t })}`)).data || [];
  }
  return {
    handle: prof.name,
    link: prof.link || `https://www.facebook.com/${page.id}`,
    profile: { followers: num(prof.followers_count ?? prof.fan_count), avatar: prof.picture?.data?.url || null },
    notes: viewsAvailable ? [] : ['Post views metric unavailable from Meta; showing reactions, comments and shares only.'],
    posts: posts.map((p) => ({
      id: p.id,
      title: p.message || '',
      url: p.permalink_url,
      date: p.created_time,
      thumb: p.full_picture || null,
      views: viewsAvailable ? insightValue(p.insights, 'post_media_views') : null,
      likes: num(p.reactions?.summary?.total_count),
      comments: num(p.comments?.summary?.total_count),
      shares: num(p.shares?.count) ?? 0,
    })),
  };
}

async function collectInstagram(rec, cfg) {
  const want = String(cfg.username || '').replace(/^@/, '').toLowerCase();
  const page = Object.values(rec.pages || {}).find((p) => p.ig && p.ig.username.toLowerCase() === want);
  if (!page) throw new Error(`Instagram @${want} is not linked to any connected Facebook Page`);
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
    profile: { followers: num(prof.followers_count), avatar: prof.profile_picture_url || null, posts: num(prof.media_count) },
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
