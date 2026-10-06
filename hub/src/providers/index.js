import { meta } from './meta.js';
import { tiktok } from './tiktok.js';
import { youtube } from './youtube.js';
import { pinterest } from './pinterest.js';

export const PROVIDERS = { meta, tiktok, youtube, pinterest };

export function providerForNetwork(network) {
  return Object.values(PROVIDERS).find((p) => p.networks.includes(network)) || null;
}
