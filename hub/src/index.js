import { BRANDS, QUICK_LINKS } from './config.js';
import { PROVIDERS } from './providers/index.js';
import { isAuthed, handleKeyLogin, logoutResponse, loginPage } from './lib/auth.js';
import { json, html, redirect, randomId, escapeHtml } from './lib/util.js';
import { kvGet, kvPut, kvDelete } from './lib/kv.js';
import { SNAPSHOT_KEY, emptySnapshot, refreshBrands, scheduledRun } from './snapshot.js';

const PUBLIC_PATHS = new Set(['/manifest.webmanifest', '/favicon.ico']);

function privacyPage() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Social Hub - Privacy</title>
<style>:root{color-scheme:dark}body{margin:0;padding:24px;font:16px/1.6 system-ui,sans-serif;background:#111318;color:#e8eaf0}
.box{max-width:640px;margin:0 auto}h1{font-size:22px}p{color:#c7cbd4}</style></head>
<body><div class="box">
<h1>Privacy Policy</h1>
<p>Social Hub is a single-user, private dashboard built and operated by Chris Cooper for his own personal use. It is not a public product and has no other users.</p>
<p>It connects to each platform's official API (Meta, TikTok, YouTube, Pinterest) using Chris's own authorization, and reads only his own connected accounts' publicly-visible statistics (followers, views, likes, comments, shares, recent posts). It never posts, modifies, or deletes anything on any connected account.</p>
<p>Data retrieved is cached in Cloudflare KV storage for up to 60 days, solely to compute week-over-week change figures, and is never shared, sold, or transmitted to any third party. Access to the dashboard itself is gated behind a private key known only to Chris.</p>
<p>Disconnecting an account from the dashboard removes its stored tokens. Questions: contact via the account that registered this application.</p>
</div></body></html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Manifest and icons must load without the cookie or "Add to Home Screen" breaks.
    if (PUBLIC_PATHS.has(path) || path.startsWith('/icons/')) return env.ASSETS.fetch(request);
    if (path === '/privacy') return html(privacyPage());

    const login = await handleKeyLogin(request, env);
    if (login) return login;
    if (path === '/logout') return logoutResponse();

    if (!(await isAuthed(request, env))) {
      if (path.startsWith('/api/')) return json({ error: 'unauthorised' }, 401);
      return html(loginPage(env.HUB_SECRET ? '' : 'HUB_SECRET is not set on the Worker.'), 401);
    }

    try {
      if (path === '/api/stats') return json((await kvGet(env, SNAPSHOT_KEY)) || emptySnapshot());

      if (path === '/api/refresh' && request.method === 'POST') {
        const brand = url.searchParams.get('brand');
        const ids = brand ? [brand] : null;
        if (brand && !BRANDS.some((b) => b.id === brand)) return json({ error: `unknown brand ${brand}` }, 404);
        const snapshot = await refreshBrands(env, ids);
        return json({ ok: true, generated_at: snapshot.generated_at, brands: ids || BRANDS.map((b) => b.id) });
      }

      if (path === '/api/brands') return json(BRANDS.map((b) => ({ id: b.id, name: b.name })));

      if (path === '/api/links') return json(QUICK_LINKS);

      if (path === '/api/cron' && request.method === 'POST') {
        // Manual trigger of the scheduled run, for testing.
        return json(await scheduledRun(env, Date.now()));
      }

      const m = path.match(/^\/auth\/(meta|tiktok|youtube|pinterest)(\/callback)?$/);
      if (m) return handleAuth(request, env, url, m[1], !!m[2]);
    } catch (e) {
      return json({ error: e.message }, 500);
    }

    return env.ASSETS.fetch(request);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(scheduledRun(env, event.scheduledTime));
  },
};

async function handleAuth(request, env, url, providerId, isCallback) {
  const provider = PROVIDERS[providerId];
  const origin = url.origin;
  if (!provider.configured(env)) return html(resultPage(`${provider.label}: app credentials are not set (see README).`, false), 400);

  if (!isCallback) {
    const state = randomId();
    await kvPut(env, `state:${state}`, { provider: providerId, created_at: Date.now() }, { expirationTtl: 600 });
    return redirect(provider.authUrl(env, origin, state));
  }

  const state = url.searchParams.get('state');
  const rec = state ? await kvGet(env, `state:${state}`) : null;
  if (!rec || rec.provider !== providerId) return html(resultPage('Login state did not match. Start the connection again from the hub.', false), 400);
  await kvDelete(env, `state:${state}`);
  try {
    const accounts = await provider.callback(env, origin, url);
    const list = accounts.map((a) => `<li><b>${escapeHtml(a.network)}</b> ${escapeHtml(a.name || '')} <code>${escapeHtml(a.handle)}</code></li>`).join('');
    return html(resultPage(`${provider.label} connected.<ul>${list}</ul>Put any handle or id that is not in config.js yet into the matching brand, redeploy, then refresh the hub.`, true));
  } catch (e) {
    return html(resultPage(`${provider.label} connection failed: ${escapeHtml(e.message)}`, false), 500);
  }
}

function resultPage(message, ok) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Hub</title>
<style>:root{color-scheme:dark}body{margin:0;padding:24px;font:16px/1.5 system-ui,sans-serif;background:#111318;color:#e8eaf0}
.box{max-width:560px;margin:0 auto;padding:20px;border-radius:14px;background:#1a1d24;border:1px solid ${ok ? '#2e7d4f' : '#8a3a2a'}}
code{background:#23272f;padding:2px 6px;border-radius:6px}a{color:#f07038}ul{padding-left:20px}</style></head>
<body><div class="box"><p>${message}</p><p><a href="/">Back to the hub</a></p></div></body></html>`;
}
