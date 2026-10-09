// YouTube via the Data API v3 (views, likes, comments) with shares from the
// YouTube Analytics API when available. Uses an OAuth refresh token; publish
// the Google consent screen ("In production") or refresh tokens die in 7 days.
import { fetchJson, form, now, seconds, isoDay, num, HttpError } from '../lib/util.js';
import { loadMap, saveMap } from '../lib/store.js';
import { POSTS_PER_ACCOUNT } from '../config.js';

const AUTH = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN = 'https://oauth2.googleapis.com/token';
const API = 'https://www.googleapis.com/youtube/v3';
const ANALYTICS = 'https://youtubeanalytics.googleapis.com/v2/reports';
const KEY = 'tokens:youtube';
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/yt-analytics.readonly',
];

async function tokenRequest(env, body) {
  return fetchJson(TOKEN, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form({ client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET, ...body }),
  });
}

/** Returns true when the record changed and needs saving. */
async function ensureFresh(env, rec, force = false) {
  if (!force && rec.expires_at - now() > 5 * 60 * 1000) return false;
  const res = await tokenRequest(env, { grant_type: 'refresh_token', refresh_token: rec.refresh_token });
  rec.access_token = res.access_token;
  rec.expires_at = now() + seconds(res.expires_in || 3600);
  rec.refreshed_at = now();
  return true;
}

async function myChannel(accessToken) {
  const res = await fetchJson(`${API}/channels?${form({ part: 'snippet,statistics,contentDetails', mine: 'true' })}`, { headers: { authorization: `Bearer ${accessToken}` } });
  const c = res.items?.[0];
  if (!c) throw new Error('Google account has no YouTube channel');
  return c;
}

const summary = (r) => ({ network: 'youtube', id: r.channel_id, handle: r.channel_id, name: r.title, connected_at: r.connected_at, expires_at: r.expires_at });

async function fetchChannelData(rec) {
  const headers = { authorization: `Bearer ${rec.access_token}` };
  const c = await myChannel(rec.access_token);
  const uploads = c.contentDetails?.relatedPlaylists?.uploads;
  let ids = [];
  if (uploads) {
    const pl = await fetchJson(`${API}/playlistItems?${form({ part: 'contentDetails', playlistId: uploads, maxResults: Math.min(50, POSTS_PER_ACCOUNT) })}`, { headers });
    ids = (pl.items || []).map((i) => i.contentDetails?.videoId).filter(Boolean);
  }
  let videos = [];
  if (ids.length) {
    const v = await fetchJson(`${API}/videos?${form({ part: 'snippet,statistics', id: ids.join(',') })}`, { headers });
    videos = v.items || [];
  }
  const notes = [];
  const shares = new Map();
  if (ids.length) {
    try {
      const rep = await fetchJson(`${ANALYTICS}?${form({ ids: 'channel==MINE', startDate: '2005-01-01', endDate: isoDay(), metrics: 'shares', dimensions: 'video', filters: `video==${ids.join(',')}` })}`, { headers });
      for (const row of rep.rows || []) shares.set(row[0], num(row[1]));
    } catch (e) {
      notes.push(`Shares unavailable (YouTube Analytics API: ${e.body?.error?.message || e.message})`);
    }
  }
  const st = c.statistics || {};
  return {
    handle: c.snippet?.title || rec.title,
    link: c.snippet?.customUrl ? `https://www.youtube.com/${c.snippet.customUrl}` : `https://www.youtube.com/channel/${c.id}`,
    profile: {
      followers: num(st.subscriberCount), views: num(st.viewCount), posts: num(st.videoCount), avatar: c.snippet?.thumbnails?.default?.url || null,
      extra: [
        ...(st.viewCount != null ? [{ label: 'Lifetime views', value: num(st.viewCount) }] : []),
        ...(st.videoCount != null ? [{ label: 'Total videos', value: num(st.videoCount) }] : []),
      ],
    },
    notes,
    posts: videos.map((v) => ({
      id: v.id,
      title: v.snippet?.title || '',
      url: `https://www.youtube.com/watch?v=${v.id}`,
      date: v.snippet?.publishedAt || null,
      thumb: v.snippet?.thumbnails?.medium?.url || v.snippet?.thumbnails?.default?.url || null,
      views: num(v.statistics?.viewCount),
      likes: num(v.statistics?.likeCount),
      comments: num(v.statistics?.commentCount),
      shares: shares.has(v.id) ? shares.get(v.id) : null,
    })),
  };
}

export const youtube = {
  id: 'youtube',
  label: 'YouTube',
  networks: ['youtube'],
  configured: (env) => !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),

  authUrl(env, origin, state) {
    const p = form({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: `${origin}/auth/youtube/callback`,
      response_type: 'code',
      scope: SCOPES.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true',
      state,
    });
    return `${AUTH}?${p}`;
  },

  async callback(env, origin, url) {
    const code = url.searchParams.get('code');
    if (!code) throw new Error(url.searchParams.get('error') || 'Google returned no code');
    const res = await tokenRequest(env, { code, grant_type: 'authorization_code', redirect_uri: `${origin}/auth/youtube/callback` });
    if (!res.refresh_token) throw new Error('Google returned no refresh token. Remove the app at myaccount.google.com/permissions and connect again.');
    const c = await myChannel(res.access_token);
    const rec = {
      channel_id: c.id,
      title: c.snippet?.title,
      uploads: c.contentDetails?.relatedPlaylists?.uploads || null,
      refresh_token: res.refresh_token,
      access_token: res.access_token,
      expires_at: now() + seconds(res.expires_in || 3600),
      connected_at: now(),
    };
    const map = await loadMap(env, KEY);
    map[c.id] = rec;
    await saveMap(env, KEY, map);
    return [summary(rec)];
  },

  async accounts(env) {
    return Object.values(await loadMap(env, KEY)).map(summary);
  },

  async collect(env, _network, cfg) {
    const map = await loadMap(env, KEY);
    const rec = map[cfg.channelId];
    if (!rec) throw new Error(`YouTube channel ${cfg.channelId} not connected yet`);
    // No proactive refresh here on purpose -- maintain() already
    // force-refreshes this same record every cron tick. Letting collect()
    // ALSO proactively refresh on its own 5-minute-buffer check was one real
    // bug (confirmed live 2026-10-08, a race against maintain()'s own
    // refresh). Fixed by making this reactive-only.
    //
    // That alone didn't fully hold either: also confirmed live the same day,
    // with maintain()'s last real run ~4 hours earlier (so no cron race in
    // play), a single collect() call got a 401 on playlistItems moments
    // after channels.list succeeded with the exact same token and headers --
    // and that same token tested perfectly fine via a plain curl run
    // immediately afterwards. Whatever is causing Google to intermittently
    // reject a token it accepts a moment later isn't fully pinned down from
    // this side. Rather than keep chasing the exact mechanism, retry up to
    // 3 times with a fresh forced token and a short backoff each time --
    // this self-heals regardless of the precise cause, and gives up loudly
    // (a real thrown error, visible on the hub) only if it's still failing
    // after 3 genuinely fresh tokens, at which point it's worth treating as
    // a real outage rather than a transient hiccup.
    let lastErr;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await ensureFresh(env, rec, true);
        await saveMap(env, KEY, map);
        await new Promise((r) => setTimeout(r, 400 * attempt));
      }
      try {
        return await fetchChannelData(rec);
      } catch (e) {
        if (!(e instanceof HttpError) || e.status !== 401) throw e;
        lastErr = e;
      }
    }
    throw lastErr;
  },

  async maintain(env) {
    const map = await loadMap(env, KEY);
    const out = { refreshed: [], errors: [] };
    let dirty = false;
    for (const rec of Object.values(map)) {
      try {
        // Force a refresh so an unused refresh token never idles past Google's 6-month limit.
        if (await ensureFresh(env, rec, true)) { dirty = true; out.refreshed.push(rec.title || rec.channel_id); }
      } catch (e) {
        out.errors.push(`YouTube ${rec.title || rec.channel_id}: ${e.message}`);
      }
    }
    if (dirty) await saveMap(env, KEY, map);
    return out;
  },
};
