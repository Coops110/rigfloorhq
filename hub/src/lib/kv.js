export async function kvGet(env, key) {
  const v = await env.HUB_KV.get(key, 'json');
  return v ?? null;
}

export async function kvPut(env, key, value, opts = {}) {
  await env.HUB_KV.put(key, JSON.stringify(value), opts);
}

export async function kvDelete(env, key) {
  await env.HUB_KV.delete(key);
}

/** All records under a prefix, e.g. tokens:tiktok: */
export async function kvListPrefix(env, prefix) {
  const out = [];
  let cursor;
  do {
    const page = await env.HUB_KV.list({ prefix, cursor });
    for (const k of page.keys) {
      const v = await kvGet(env, k.name);
      if (v) out.push({ key: k.name, value: v });
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return out;
}
