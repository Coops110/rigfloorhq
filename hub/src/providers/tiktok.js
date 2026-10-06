// TikTok Display API. Access tokens last 24 h, refresh tokens 365 days, so the
// cron refresh keeps an account alive for a year without touching it.
// Each TikTok account is connected separately (one OAuth run per account).
import { fetchJson, form, now, seconds } from '../lib/util.js';
import { loadMap, saveMap } from '../lib/store.js';
import { POSTS_PER_ACCOUNT } from '../config.js';

const AUTH = 'https://www.tiktok.com/v2/auth/authorize/';
const TOKEN = 'https://open.tiktokapis.com/v2/oauth/token/';
const API = 'https://open.tiktokapis.com/v2';
const KEY = 'tokens:tiktok';
const SCOPES = 'user.info.basic,user.info.profile,user.info.stats,video.list';
const USER_FIELDS = 'open_id,display_name,username,avatar_url,follower_count,likes_count,video_count';
const VIDEO_FIELDS = 'id,title,create_time,cover_image_url,share_url,view_count,like_count,comment_count,share_count';

const norm = (u) => String(u || '').replace(/^@/, '').toLowerCase();

async function tokenRequest(env, body) {
  const res = await fetchJson(TOKEN, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form({ client_key: env.TIKTOK_CLIENT_KEY, client_secret: env.TIKTOK_CLIENT_SECRET, ...body }),
  });
  if (res.error) throw new Error(`TikTok token error: ${res.error} ${res.error_description || ''}`);
  return res;
}

function applyTokens(rec, res) {
  rec.access_token = res.access_token;
  rec.expires_at = now() + seconds(res.expires_in || 86400);
  if (res.refresh_token) rec.refresh_token = res.refresh_token;
  if (res.refresh_expires_in) rec.refresh_expires_at = now() + seconds(res.refresh_expires_in);
  rec.open_id = res.open_id || rec.open_id;
  return rec;
}

async function userInfo(accessToken) {
  const res = await fetchJson(`${API}/user/info/?fields=${USER_FIELDS}`, { headers: { authorization: `Bearer ${accessToken}` } });
  if (res.error && res.error.code && res.error.code !== 'ok') throw new Error(`TikTok user.info: ${res.error.code} ${res.error.message || ''}`);
  return res.data?.user || {};
}

/** Returns true when the record changed and needs saving. */
async function ensureFresh(env, rec) {
  if (rec.expires_at - now() > 5 * 60 * 1000) return false;
  if (rec.refresh_expires_at && rec.refresh_expires_at < now()) throw new Error('TikTok refresh token expired; reconnect the account');
  applyTokens(rec, await tokenRequest(env, { grant_type: 'refresh_token', refresh_token: rec.refresh_token }));
  rec.refreshed_at = now();
  return true;
}

const summary = (r) => ({
  network: 'tiktok', id: r.open_id, handle: r.username, name: `@${r.username}`,
  connected_at: r.connected_at, expires_at: r.expires_at, refresh_expires_at: r.refresh_expires_at,
});

export const tiktok = {
  id: 'tiktok',
  label: 'TikTok',
  networks: ['tiktok'],
  configured: (env) => !!(env.TIKTOK_CLIENT_KEY && env.TIKTOK_CLIENT_SECRET),

  authUrl(env, origin, state) {
    const p = form({
      client_key: env.TIKTOK_CLIENT_KEY,
      scope: SCOPES,
      response_type: 'code',
      redirect_uri: `${origin}/auth/tiktok/callback`,
      state,
    });
    return `${AUTH}?${p}`;
  },

  async callback(env, origin, url) {
    const code = url.searchParams.get('code');
    if (!code) throw new Error(url.searchParams.get('error_description') || url.searchParams.get('error') || 'TikTok returned no code');
    const res = await tokenRequest(env, { code, grant_type: 'authorization_code', redirect_uri: `${origin}/auth/tiktok/callback` });
    const rec = applyTokens({ connected_at: now() }, res);
    const u = await userInfo(rec.access_token);
    if (!u.username) throw new Error('TikTok did not return a username (is the user.info.profile scope enabled on the app?)');
    rec.username = u.username;
    rec.display_name = u.display_name;
    const map = await loadMap(env, KEY);
    map[norm(rec.username)] = rec;
    await saveMap(env, KEY, map);
    return [summary(rec)];
  },

  async accounts(env) {
    return Object.values(await loadMap(env, KEY)).map(summary);
  },

  async collect(env, _network, cfg) {
    const map = await loadMap(env, KEY);
    const rec = map[norm(cfg.username)];
    if (!rec) throw new Error(`TikTok @${norm(cfg.username)} not connected yet`);
    if (await ensureFresh(env, rec)) await saveMap(env, KEY, map);
    const auth = { authorization: `Bearer ${rec.access_token}` };
    const u = await userInfo(rec.access_token);
    const list = await fetchJson(`${API}/video/list/?fields=${VIDEO_FIELDS}`, {
      method: 'POST',
      headers: { ...auth, 'content-type': 'application/json' },
      body: JSON.stringify({ max_count: Math.min(20, POSTS_PER_ACCOUNT) }),
    });
    if (list.error && list.error.code && list.error.code !== 'ok') throw new Error(`TikTok video.list: ${list.error.code} ${list.error.message || ''}`);
    const videos = list.data?.videos || [];
    const username = u.username || rec.username;
    return {
      handle: `@${username}`,
      link: `https://www.tiktok.com/@${username}`,
      profile: { followers: u.follower_count ?? null, likes: u.likes_count ?? null, posts: u.video_count ?? null, avatar: u.avatar_url || null },
      notes: [],
      posts: videos.map((v) => ({
        id: v.id,
        title: v.title || '',
        url: v.share_url,
        date: v.create_time ? new Date(v.create_time * 1000).toISOString() : null,
        thumb: v.cover_image_url || null,
        views: v.view_count ?? null,
        likes: v.like_count ?? null,
        comments: v.comment_count ?? null,
        shares: v.share_count ?? null,
      })),
    };
  },

  async maintain(env) {
    const map = await loadMap(env, KEY);
    const out = { refreshed: [], errors: [], warnings: [] };
    let dirty = false;
    for (const rec of Object.values(map)) {
      try {
        if (await ensureFresh(env, rec)) { dirty = true; out.refreshed.push(rec.username); }
        if (rec.refresh_expires_at && rec.refresh_expires_at - now() < 30 * 86400 * 1000) {
          out.warnings.push(`TikTok @${rec.username}: refresh token expires ${new Date(rec.refresh_expires_at).toISOString().slice(0, 10)}; reconnect before then`);
        }
      } catch (e) {
        out.errors.push(`TikTok @${rec.username}: ${e.message}`);
      }
    }
    if (dirty) await saveMap(env, KEY, map);
    return out;
  },
};
