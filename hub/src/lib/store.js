// One KV record per provider holding a map of accounts, so a refresh costs a
// single read and at most one write per provider. Cloudflare's free plan caps a
// Worker invocation at 50 subrequests and KV operations count toward it.
import { kvGet, kvPut } from './kv.js';

export async function loadMap(env, key) {
  return (await kvGet(env, key)) || {};
}

export async function saveMap(env, key, map) {
  await kvPut(env, key, map);
}
