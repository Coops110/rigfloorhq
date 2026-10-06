// Builds the per-brand snapshot the page renders, and keeps a small daily
// history so the page can show "since 7 days ago" deltas.
import { BRANDS, NETWORKS } from './config.js';
import { PROVIDERS, providerForNetwork } from './providers/index.js';
import { kvGet, kvPut } from './lib/kv.js';
import { now, isoDay, days } from './lib/util.js';

export const SNAPSHOT_KEY = 'snapshot';
export const HISTORY_KEY = 'history';
const HISTORY_DAYS = 60;
const METRICS = ['views', 'likes', 'comments', 'shares'];

/** Sum a metric over posts; null when no post reported it. */
export function sumTotals(posts = []) {
  const out = { posts: posts.length };
  for (const m of METRICS) {
    let sum = 0;
    let seen = false;
    for (const p of posts) {
      if (typeof p[m] === 'number') { sum += p[m]; seen = true; }
    }
    out[m] = seen ? sum : null;
  }
  return out;
}

export function profileLink(network, id) {
  if (!id) return null;
  switch (network) {
    case 'facebook': return `https://www.facebook.com/${id}`;
    case 'instagram': return `https://www.instagram.com/${String(id).replace(/^@/, '')}/`;
    case 'tiktok': return `https://www.tiktok.com/@${String(id).replace(/^@/, '')}`;
    case 'youtube': return `https://www.youtube.com/channel/${id}`;
    case 'pinterest': return `https://www.pinterest.com/${String(id).replace(/^@/, '')}/`;
    default: return null;
  }
}

export const accountKey = (brandId, network) => `${brandId}/${network}`;

/** What we keep per day for every account: followers plus the post totals. */
export function dailyRecord(brands) {
  const rec = {};
  for (const b of brands) {
    for (const n of b.networks || []) {
      if (!n.ok) continue;
      rec[accountKey(b.id, n.network)] = {
        followers: n.profile?.followers ?? null,
        ...Object.fromEntries(METRICS.map((m) => [m, n.totals?.[m] ?? null])),
      };
    }
  }
  return rec;
}

/** Oldest record within the last `window` days, or null. */
export function pickComparison(history, today, window = 7) {
  const t = Date.parse(`${today}T00:00:00Z`);
  for (let d = window; d >= 1; d--) {
    const date = isoDay(t - days(d));
    if (history[date]) return { date, days: d, data: history[date] };
  }
  return null;
}

export function applyDeltas(brands, cmp) {
  for (const b of brands) {
    for (const n of b.networks || []) {
      const prev = cmp?.data?.[accountKey(b.id, n.network)];
      if (!n.ok || !prev) { delete n.delta; continue; }
      const delta = { days: cmp.days, since: cmp.date };
      if (typeof n.profile?.followers === 'number' && typeof prev.followers === 'number') delta.followers = n.profile.followers - prev.followers;
      for (const m of METRICS) {
        if (typeof n.totals?.[m] === 'number' && typeof prev[m] === 'number') delta[m] = n.totals[m] - prev[m];
      }
      n.delta = delta;
    }
  }
}

export function trimHistory(history, keep = HISTORY_DAYS) {
  const dates = Object.keys(history).sort();
  for (const d of dates.slice(0, Math.max(0, dates.length - keep))) delete history[d];
  return history;
}

async function collectBrand(env, brand) {
  const networks = [];
  for (const [network, def] of Object.entries(NETWORKS)) {
    const cfg = brand[network];
    if (!cfg) continue;
    const idValue = Object.values(cfg)[0];
    const entry = { network, label: def.label, configured: !!idValue, configId: idValue || '', handle: idValue || '', link: profileLink(network, idValue) };
    if (!idValue) {
      entry.error = 'No account set in config.js yet';
      networks.push(entry);
      continue;
    }
    const prov = providerForNetwork(network);
    if (!prov || !prov.configured(env)) {
      entry.error = `${prov ? prov.label : network} app credentials are not set`;
      networks.push(entry);
      continue;
    }
    try {
      const r = await prov.collect(env, network, cfg);
      Object.assign(entry, r);
      entry.totals = sumTotals(r.posts);
      entry.ok = true;
    } catch (e) {
      entry.error = e.message;
    }
    networks.push(entry);
  }
  return { id: brand.id, name: brand.name, site: brand.site || '', generated_at: now(), networks };
}

async function unassignedAccounts(env, brands) {
  const assigned = new Set();
  for (const b of brands) for (const n of b.networks || []) if (n.configId) assigned.add(`${n.network}:${String(n.configId).replace(/^@/, '').toLowerCase()}`);
  const out = [];
  for (const p of Object.values(PROVIDERS)) {
    if (!p.configured(env)) continue;
    try {
      for (const a of await p.accounts(env)) {
        if (!assigned.has(`${a.network}:${String(a.handle).replace(/^@/, '').toLowerCase()}`)) out.push(a);
      }
    } catch (e) {
      out.push({ network: p.id, handle: '', name: `Could not list ${p.label} accounts: ${e.message}` });
    }
  }
  return out;
}

export function emptySnapshot() {
  return {
    generated_at: null,
    brands: BRANDS.map((b) => ({ id: b.id, name: b.name, site: b.site || '', generated_at: null, networks: [] })),
    unassigned: [],
    providers: {},
  };
}

/**
 * Refresh the given brand ids (default: all) and merge into the stored
 * snapshot. Brands not in the list keep their previous data.
 */
export async function refreshBrands(env, brandIds = null) {
  const wanted = BRANDS.filter((b) => !brandIds || brandIds.includes(b.id));
  const fresh = [];
  for (const b of wanted) fresh.push(await collectBrand(env, b));

  const existing = (await kvGet(env, SNAPSHOT_KEY)) || emptySnapshot();
  const byId = new Map((existing.brands || []).map((b) => [b.id, b]));
  for (const b of fresh) byId.set(b.id, b);
  const brands = BRANDS.map((b) => byId.get(b.id) || { id: b.id, name: b.name, site: b.site || '', generated_at: null, networks: [] });

  const history = trimHistory((await kvGet(env, HISTORY_KEY)) || {});
  const today = isoDay();
  history[today] = { ...(history[today] || {}), ...dailyRecord(fresh) };
  await kvPut(env, HISTORY_KEY, history);
  applyDeltas(brands, pickComparison(history, today));

  const snapshot = {
    generated_at: now(),
    brands,
    unassigned: await unassignedAccounts(env, brands),
    providers: Object.fromEntries(Object.values(PROVIDERS).map((p) => [p.id, { label: p.label, configured: p.configured(env), networks: p.networks }])),
    maintenance: existing.maintenance || null,
  };
  await kvPut(env, SNAPSHOT_KEY, snapshot);
  return snapshot;
}

/** Cron: refresh tokens for every provider, then half the brands (alternating). */
export async function scheduledRun(env, scheduledTime) {
  const maintenance = { ran_at: now(), providers: {} };
  for (const p of Object.values(PROVIDERS)) {
    if (!p.configured(env)) continue;
    try { maintenance.providers[p.id] = await p.maintain(env); }
    catch (e) { maintenance.providers[p.id] = { errors: [e.message] }; }
  }
  const slot = Math.floor(new Date(scheduledTime || now()).getUTCHours() / 4) % 2;
  const ids = BRANDS.filter((_, i) => i % 2 === slot).map((b) => b.id);
  const snapshot = await refreshBrands(env, ids);
  snapshot.maintenance = maintenance;
  await kvPut(env, SNAPSHOT_KEY, snapshot);
  return { maintenance, refreshed: ids };
}
