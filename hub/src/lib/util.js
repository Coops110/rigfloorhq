export class HttpError extends Error {
  constructor(status, body, url) {
    super(`HTTP ${status} from ${url}: ${typeof body === 'string' ? body.slice(0, 300) : JSON.stringify(body).slice(0, 300)}`);
    this.status = status;
    this.body = body;
    this.url = url;
  }
}

/**
 * fetch + JSON parse with a useful error. Forces cache: 'no-store' on every
 * outgoing subrequest -- every provider's API calls go through this one
 * function, and several hit the exact same URL repeatedly with only the
 * Authorization header differing (e.g. YouTube's channels.list with
 * mine=true never has a varying query string). Confirmed live 2026-10-08: a
 * YouTube 401 kept recurring on that exact URL even immediately after a
 * forced token refresh whose new access_token tested valid seconds later via
 * a plain curl outside the Worker -- consistent with something in the fetch
 * path serving back a cached error response keyed on the URL rather than
 * re-checking the (different) Authorization header each time.
 */
export async function fetchJson(url, init = {}) {
  const res = await fetch(url, { cache: 'no-store', ...init });
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : {}; } catch { body = text; }
  if (!res.ok) throw new HttpError(res.status, body, url.toString().split('?')[0]);
  return body;
}

export function form(obj) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) if (v !== undefined && v !== null) p.set(k, String(v));
  return p;
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });
}

export function html(body, status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });
}

export function redirect(location, status = 302, headers = {}) {
  return new Response(null, { status, headers: { location, ...headers } });
}

export const now = () => Date.now();
export const seconds = (n) => n * 1000;
export const days = (n) => n * 86400 * 1000;

export function randomId(bytes = 24) {
  const a = crypto.getRandomValues(new Uint8Array(bytes));
  return base64url(a);
}

export function base64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return base64url(new Uint8Array(buf));
}

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** ISO date (YYYY-MM-DD) in UTC for a timestamp. */
export function isoDay(ts = Date.now()) {
  return new Date(ts).toISOString().slice(0, 10);
}

export const num = (v) => (v === null || v === undefined || v === '' || Number.isNaN(Number(v)) ? null : Number(v));
