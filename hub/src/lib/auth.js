import { sha256, redirect, html, escapeHtml } from './util.js';

const COOKIE = 'hub';
const ONE_YEAR = 60 * 60 * 24 * 365;

async function expectedCookie(env) {
  return sha256(`hub-cookie:${env.HUB_SECRET}`);
}

function readCookie(request) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === COOKIE) return rest.join('=');
  }
  return null;
}

export async function isAuthed(request, env) {
  if (!env.HUB_SECRET) return false;
  const c = readCookie(request);
  return !!c && c === (await expectedCookie(env));
}

/** `/?k=<HUB_SECRET>` sets the cookie and redirects to a clean URL. */
export async function handleKeyLogin(request, env) {
  const url = new URL(request.url);
  const k = url.searchParams.get('k');
  if (k === null) return null;
  if (!env.HUB_SECRET || k !== env.HUB_SECRET) {
    return html(loginPage('Wrong key.'), 401);
  }
  const value = await expectedCookie(env);
  url.searchParams.delete('k');
  return redirect(url.pathname + (url.search || ''), 302, {
    'set-cookie': `${COOKIE}=${value}; Path=/; Max-Age=${ONE_YEAR}; HttpOnly; Secure; SameSite=Lax`,
  });
}

export function logoutResponse() {
  return redirect('/', 302, {
    'set-cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
  });
}

export function loginPage(message = '') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Hub</title>
<style>
  :root{color-scheme:dark}
  body{margin:0;min-height:100vh;display:grid;place-items:center;font:16px/1.4 system-ui,sans-serif;background:#111318;color:#e8eaf0}
  form{display:grid;gap:12px;width:min(90vw,320px)}
  input,button{font:inherit;padding:12px 14px;border-radius:10px;border:1px solid #3a3f4b}
  input{background:#1a1d24;color:inherit}
  button{background:#f07038;color:#111;border-color:#f07038;font-weight:600}
  p{margin:0;color:#ff9a7a}
</style></head><body>
<form method="get" action="/">
  <strong>Social hub</strong>
  ${message ? `<p>${escapeHtml(message)}</p>` : ''}
  <input name="k" type="password" placeholder="Key" autocomplete="current-password" autofocus>
  <button type="submit">Open</button>
</form></body></html>`;
}
