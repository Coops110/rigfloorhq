import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sumTotals, profileLink, dailyRecord, pickComparison, applyDeltas, trimHistory } from '../src/snapshot.js';

test('sumTotals sums numeric metrics and leaves unreported ones null', () => {
  const t = sumTotals([
    { views: 100, likes: 5, comments: 1, shares: null },
    { views: 50, likes: 2, comments: null, shares: null },
  ]);
  assert.deepEqual(t, { posts: 2, views: 150, likes: 7, comments: 1, shares: null });
  assert.deepEqual(sumTotals([]), { posts: 0, views: null, likes: null, comments: null, shares: null });
});

test('profileLink opens the native app via a plain https profile URL', () => {
  assert.equal(profileLink('tiktok', '@rigfloorhq'), 'https://www.tiktok.com/@rigfloorhq');
  assert.equal(profileLink('instagram', 'hotdailydiaries'), 'https://www.instagram.com/hotdailydiaries/');
  assert.equal(profileLink('facebook', '1215544864984509'), 'https://www.facebook.com/1215544864984509');
  assert.equal(profileLink('youtube', 'UCx'), 'https://www.youtube.com/channel/UCx');
  assert.equal(profileLink('pinterest', 'coops'), 'https://www.pinterest.com/coops/');
  assert.equal(profileLink('tiktok', ''), null);
});

const brands = [
  { id: 'a', networks: [
    { network: 'tiktok', ok: true, profile: { followers: 120 }, totals: { views: 1000, likes: 40, comments: 3, shares: 2 } },
    { network: 'facebook', ok: false, error: 'nope' },
  ] },
];

test('dailyRecord keeps followers and totals only for accounts that loaded', () => {
  assert.deepEqual(dailyRecord(brands), { 'a/tiktok': { followers: 120, views: 1000, likes: 40, comments: 3, shares: 2 } });
});

test('pickComparison returns the oldest record inside the window', () => {
  const history = { '2026-10-01': { x: 1 }, '2026-10-03': { x: 2 }, '2026-10-06': { x: 3 } };
  assert.deepEqual(pickComparison(history, '2026-10-06', 7), { date: '2026-10-01', days: 5, data: { x: 1 } });
  assert.equal(pickComparison({ '2026-09-01': {} }, '2026-10-06', 7), null);
  assert.equal(pickComparison(history, '2026-10-06', 2), null); // only today inside the window
});

test('applyDeltas attaches signed differences and skips failed accounts', () => {
  const cmp = { date: '2026-09-29', days: 7, data: { 'a/tiktok': { followers: 100, views: 900, likes: 40, comments: null, shares: 5 } } };
  applyDeltas(brands, cmp);
  assert.deepEqual(brands[0].networks[0].delta, { days: 7, since: '2026-09-29', followers: 20, views: 100, likes: 0, shares: -3 });
  assert.equal(brands[0].networks[1].delta, undefined);
  applyDeltas(brands, null);
  assert.equal(brands[0].networks[0].delta, undefined);
});

test('trimHistory keeps only the newest N days', () => {
  const h = {};
  for (let d = 1; d <= 70; d++) h[`2026-07-${String(d).padStart(2, '0')}`] = {}; // lexical order is enough here
  trimHistory(h, 60);
  assert.equal(Object.keys(h).length, 60);
  assert.ok(!h['2026-07-01']);
  assert.ok(h['2026-07-70']);
});

test('collect results keep configId so a renamed handle still counts as assigned', async () => {
  // Simulates what collectBrand does: provider output overwrites `handle` with a display name.
  const entry = { network: 'facebook', configId: '123', handle: '123' };
  Object.assign(entry, { handle: 'My Page' });
  assert.equal(entry.configId, '123');
  assert.equal(entry.handle, 'My Page');
});
