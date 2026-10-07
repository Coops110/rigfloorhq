// Non-social per-brand signals: is the site up, recent Search Console
// clicks, recent GA4 sessions. Each is independent and fails quietly (the
// page just omits that figure) so one bad credential or a down site never
// blocks the social cards next to it.
import { fetchJson } from './lib/util.js';
import { googleAccessToken, googleConfigured } from './lib/google.js';

export async function checkHealth(site) {
  if (!site) return null;
  const started = Date.now();
  try {
    const res = await fetch(site, { method: 'GET', redirect: 'follow' });
    return { ok: res.status < 400, status: res.status, ms: Date.now() - started, checked_at: Date.now() };
  } catch (e) {
    return { ok: false, status: null, ms: Date.now() - started, checked_at: Date.now(), error: e.message };
  }
}

const isoDate = (d) => d.toISOString().slice(0, 10);

export async function fetchSearchStats(env, gscSite) {
  if (!gscSite || !googleConfigured(env)) return null;
  try {
    const token = await googleAccessToken(env);
    // Search Console data usually lags 1-2 days; look at the 7 days ending 2 days ago.
    const end = new Date();
    end.setUTCDate(end.getUTCDate() - 2);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 6);
    const body = await fetchJson(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(gscSite)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify({ startDate: isoDate(start), endDate: isoDate(end), dimensions: [] }),
      }
    );
    const row = body.rows?.[0];
    return { clicks: row ? Math.round(row.clicks) : 0, impressions: row ? Math.round(row.impressions) : 0, days: 7 };
  } catch (e) {
    return { error: e.message };
  }
}

export async function fetchAnalyticsStats(env, propertyId) {
  if (!propertyId || !googleConfigured(env)) return null;
  try {
    const token = await googleAccessToken(env);
    const body = await fetchJson(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
      }),
    });
    const row = body.rows?.[0];
    return {
      sessions: row ? Number(row.metricValues?.[0]?.value || 0) : 0,
      users: row ? Number(row.metricValues?.[1]?.value || 0) : 0,
      days: 7,
    };
  } catch (e) {
    return { error: e.message };
  }
}
