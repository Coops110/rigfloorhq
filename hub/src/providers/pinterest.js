// Pinterest API v5. Access tokens last 30 days; refresh tokens 60 days and
// rotate on every refresh, so the cron must keep using them. Pinterest has no
// likes/comments in the usual sense: we map reactions -> likes, comments ->
// comments, saves -> shares, impressions -> views.
import { fetchJson, form, now, seconds, isoDay, days, num } from '../lib/util.js';
import { loadMap, saveMap } from '../lib/store.js';
import { POSTS_PER_ACCOUNT } from '../config.js';

const AUTH = 'https://www.pinterest.com/oauth/';
const TOKEN = 'https://api.pinterest.com/v5/oauth/token';
const API = 'https://api.pinterest.com/v5';
const KEY = 'tokens:pinterest';
const SCOPES = 'user_accounts:read,pins:read,boards:read';
const METRICS = 'IMPRESSION,SAVE,PIN_CLICK,OUTBOUND_CLICK,TOTAL_REACTIONS,TOTAL_COMMENTS';
const PER_PIN_FALLBACK_LIMIT = 3; // keeps the invocation well under the 50-subrequest cap

const norm = (u) => String(u || '').replace(/^@/, '').toLowerCase();

async function tokenRequest(env, body) {
  return fetchJson(TOKEN, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      authorization: `Basic ${btoa(`${env.PINTEREST_APP_ID}:${env.PINTEREST_APP_SECRET}`)}`,
    },
    body: form({ continuous_refresh: 'true', ...body }),
  });
}

function applyTokens(rec, res) {
  rec.access_token = res.access_token;
  rec.expires_at = now() + seconds(res.expires_in || 30 * 86400);
  if (res.refresh_token) rec.refresh_token = res.refresh_token;
  if (res.refresh_token_expires_in) rec.refresh_expires_at = now() + seconds(res.refresh_token_expires_in);
  return rec;
}

/** Returns true when the record changed and needs saving. */
async function ensureFresh(env, rec) {
  // Refresh a week early: the refresh token itself only lives 60 days.
  if (rec.expires_at - now() > 7 * 86400 * 1000) return false;
  if (rec.refresh_expires_at && rec.refresh_expires_at < now()) throw new Error('Pinterest refresh token expired; reconnect the account');
  applyTokens(rec, await tokenRequest(env, { grant_type: 'refresh_token', refresh_token: rec.refresh_token }));
  rec.refreshed_at = now();
  return true;
}

const ci = (obj, key) => {
  if (!obj) return null;
  const k = Object.keys(obj).find((x) => x.toLowerCase() === key.toLowerCase());
  return k ? num(obj[k]) : null;
};

function lifetime(pin) {
  const pm = pin.pin_metrics;
  if (!pm) return null;
  return pm.all_time || pm.lifetime_metrics || pm.ALL_TIME || pm.lifetime || null;
}

const summary = (r) => ({ network: 'pinterest', id: r.username, handle: r.username, name: `@${r.username}`, connected_at: r.connected_at, expires_at: r.expires_at, refresh_expires_at: r.refresh_expires_at });

export const pinterest = {
  id: 'pinterest',
  label: 'Pinterest',
  networks: ['pinterest'],
  configured: (env) => !!(env.PINTEREST_APP_ID && env.PINTEREST_APP_SECRET),

  authUrl(env, origin, state) {
    const p = form({
      client_id: env.PINTEREST_APP_ID,
      redirect_uri: `${origin}/auth/pinterest/callback`,
      response_type: 'code',
      scope: SCOPES,
      state,
    });
    return `${AUTH}?${p}`;
  },

  async callback(env, origin, url) {
    const code = url.searchParams.get('code');
    if (!code) throw new Error(url.searchParams.get('error') || 'Pinterest returned no code');
    const res = await tokenRequest(env, { grant_type: 'authorization_code', code, redirect_uri: `${origin}/auth/pinterest/callback` });
    const rec = applyTokens({ connected_at: now() }, res);
    const u = await fetchJson(`${API}/user_account`, { headers: { authorization: `Bearer ${rec.access_token}` } });
    rec.username = u.username;
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
    if (!rec) throw new Error(`Pinterest @${norm(cfg.username)} not connected yet`);
    if (await ensureFresh(env, rec)) await saveMap(env, KEY, map);
    const headers = { authorization: `Bearer ${rec.access_token}` };
    const u = await fetchJson(`${API}/user_account`, { headers });
    const list = await fetchJson(`${API}/pins?${form({ page_size: Math.min(25, POSTS_PER_ACCOUNT), pin_metrics: 'true' })}`, { headers });
    const pins = list.items || [];
    const notes = [];
    let perPinCalls = 0;
    const posts = [];
    for (const p of pins) {
      let m = lifetime(p);
      if (!m && perPinCalls < PER_PIN_FALLBACK_LIMIT) {
        perPinCalls += 1;
        try {
          const a = await fetchJson(`${API}/pins/${p.id}/analytics?${form({ start_date: isoDay(now() - days(89)), end_date: isoDay(), metric_types: METRICS })}`, { headers });
          m = a.all?.lifetime_metrics || a.ALL?.lifetime_metrics || null;
        } catch (e) {
          if (!notes.length) notes.push(`Pin analytics unavailable: ${e.body?.message || e.message}`);
        }
      }
      posts.push({
        id: p.id,
        title: p.title || p.description || '',
        url: `https://www.pinterest.com/pin/${p.id}/`,
        date: p.created_at || null,
        thumb: p.media?.images?.['150x150']?.url || p.media?.images?.['400x300']?.url || null,
        views: ci(m, 'IMPRESSION'),
        likes: ci(m, 'TOTAL_REACTIONS') ?? ci(m, 'REACTION'),
        comments: ci(m, 'TOTAL_COMMENTS') ?? ci(m, 'COMMENT'),
        shares: ci(m, 'SAVE'),
        clicks: ci(m, 'OUTBOUND_CLICK'),
      });
    }
    return {
      handle: `@${u.username}`,
      link: `https://www.pinterest.com/${u.username}/`,
      profile: { followers: num(u.follower_count), views: num(u.monthly_views), avatar: u.profile_image || null },
      notes,
      posts,
    };
  },

  async maintain(env) {
    const map = await loadMap(env, KEY);
    const out = { refreshed: [], errors: [] };
    let dirty = false;
    for (const rec of Object.values(map)) {
      try {
        if (await ensureFresh(env, rec)) { dirty = true; out.refreshed.push(rec.username); }
      } catch (e) {
        out.errors.push(`Pinterest @${rec.username}: ${e.message}`);
      }
    }
    if (dirty) await saveMap(env, KEY, map);
    return out;
  },
};
