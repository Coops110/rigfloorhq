// Google service-account auth (JWT bearer flow) for Search Console and GA4.
// Both APIs support service-account read access once that account's email is
// added as a user on the property -- same pattern already used for Chris's
// GA4 reporting elsewhere, reused here rather than building a second OAuth
// "Connect" flow. One token covers both scopes; cached in KV until shortly
// before it expires so brands processed in the same run share it.
import { fetchJson, form } from './util.js';
import { kvGet, kvPut } from './kv.js';

const TOKEN_KEY = 'google-token';
const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly',
].join(' ');

function base64urlFromBuffer(buf) {
  let s = '';
  for (const b of new Uint8Array(buf)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const base64urlFromString = (str) => base64urlFromBuffer(new TextEncoder().encode(str));

function pemToDer(pem) {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

export const googleConfigured = (env) => !!env.GOOGLE_SERVICE_ACCOUNT_JSON;

export async function googleAccessToken(env) {
  const cached = await kvGet(env, TOKEN_KEY);
  if (cached && cached.expires_at > Date.now() + 60_000) return cached.access_token;

  const creds = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const iat = Math.floor(Date.now() / 1000);
  const claim = {
    iss: creds.client_email,
    scope: SCOPES,
    aud: 'https://oauth2.googleapis.com/token',
    iat,
    exp: iat + 3600,
  };
  const unsigned = `${base64urlFromString(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64urlFromString(JSON.stringify(claim))}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToDer(creds.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${base64urlFromBuffer(sig)}`;

  const body = await fetchJson('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  await kvPut(
    env,
    TOKEN_KEY,
    { access_token: body.access_token, expires_at: Date.now() + (body.expires_in || 3600) * 1000 },
    { expirationTtl: body.expires_in || 3600 }
  );
  return body.access_token;
}
