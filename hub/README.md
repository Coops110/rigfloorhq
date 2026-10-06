# Social hub

One page on your phone showing followers, views, likes, comments and shares
for every brand, pulled straight from each platform's own API. Runs on
Cloudflare Workers' free plan: no server, no subscription, nothing to pay.

Brands and the accounts behind them live in `src/config.js`. The page is a
PWA: open it once in Safari or Chrome, **Add to Home Screen**, and it opens
full-screen like an app. Tapping a profile name on any card opens that app.

```
hub/
  src/index.js          router, login gate, cron entry
  src/config.js         brands -> account handles (edit this)
  src/snapshot.js       collects every account, keeps a 60-day daily history
  src/providers/*.js    meta (Facebook + Instagram), tiktok, youtube, pinterest
  public/               the page, manifest and icons
  wrangler.toml         Worker config (cron every 4 h, KV binding)
```

## 1. Deploy the Worker (10 minutes)

You need a free Cloudflare account and Node 20+.

```bash
cd hub
npm install
npx wrangler login                          # opens the browser once
npx wrangler kv namespace create HUB_KV     # prints an id
```

Paste the printed id into `wrangler.toml` where it says
`REPLACE_WITH_KV_NAMESPACE_ID`, then:

```bash
npx wrangler secret put HUB_SECRET          # any password you like; this is the page's login
npx wrangler deploy
```

Wrangler prints the URL, something like `https://social-hub.<you>.workers.dev`.
Open `https://social-hub.<you>.workers.dev/?k=YOUR_SECRET` once on your phone.
That sets a one-year cookie, so after that the plain URL just opens. Then
**Share → Add to Home Screen** (iOS) or the **Install app** prompt (Android).

The page will load with every card saying "not connected yet". That is
expected until step 2.

## 2. Register the developer apps (one-off, your logins needed)

Each platform needs an "app" that owns the API access. They are all free and
none needs a public review for reading your own accounts. For every one, the
**redirect URI** is your Worker URL plus the callback path shown.

After creating each app, store its credentials as Worker secrets:

```bash
npx wrangler secret put META_APP_ID
npx wrangler secret put META_APP_SECRET
npx wrangler secret put TIKTOK_CLIENT_KEY
npx wrangler secret put TIKTOK_CLIENT_SECRET
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put PINTEREST_APP_ID
npx wrangler secret put PINTEREST_APP_SECRET
```

Then open the hub, scroll to **Connections**, tap **Connect** for each
provider and log in. One Meta connection covers every Facebook Page you
administer plus the Instagram professional accounts linked to them. TikTok,
YouTube and Pinterest are one connection per account.

### Meta (Facebook Pages + Instagram)

1. https://developers.facebook.com/apps → **Create app** → type **Business**.
2. Add the **Facebook Login for Business** product. Under its settings, add
   `https://<worker-url>/auth/meta/callback` to **Valid OAuth Redirect URIs**.
3. App Dashboard → **App settings → Basic**: copy the App ID and App Secret.
4. Keep the app in **Development** mode. Your own Pages work at Standard
   Access without review; only other people's would need App Review.
5. Instagram accounts must be **Business or Creator** and linked to one of
   your Facebook Pages (Instagram app → Settings → Business tools → Connect a
   Facebook Page). An Instagram account that is not linked to a Page will not
   appear.

Permissions used: `pages_show_list`, `pages_read_engagement`, `read_insights`,
`instagram_basic`, `instagram_manage_insights`. Page tokens never expire.

### TikTok

1. https://developers.tiktok.com → **Manage apps → Connect an app**.
2. Add the **Login Kit** product and the scopes `user.info.basic`,
   `user.info.profile`, `user.info.stats`, `video.list`.
3. Redirect URI: `https://<worker-url>/auth/tiktok/callback`.
4. Do **not** submit for review. Instead open the **Sandbox** tab, create a
   sandbox, and add each TikTok account you want to read as a **target user**
   (up to 10). Use the sandbox's client key and secret as the Worker secrets.
5. Connect each account from the hub's Connections section. Log out of
   TikTok in the browser between accounts.

Access tokens last a day and refresh tokens a year; the cron keeps them
fresh. The page warns 30 days before a refresh token expires.

### YouTube

1. https://console.cloud.google.com → new project → **APIs & Services →
   Library**: enable **YouTube Data API v3** and **YouTube Analytics API**.
2. **OAuth consent screen**: External, add yourself as a test user, add the
   scopes `youtube.readonly` and `yt-analytics.readonly`, then **Publish app**
   so its status is **In production**. This matters: in Testing status Google
   expires refresh tokens after 7 days. You will see an "unverified app"
   warning when connecting; click Advanced → continue. No verification is
   needed for a single user.
3. **Credentials → Create credentials → OAuth client ID → Web application**,
   redirect URI `https://<worker-url>/auth/youtube/callback`.

Shares come from the Analytics API; if it is not enabled the card still shows
views, likes and comments and notes that shares are unavailable.

### Pinterest

1. Convert the account to a **business account** if it is not one.
2. https://developers.pinterest.com/apps → **Create app**. Request **Trial
   access** (approval is by Pinterest, usually days, sometimes longer).
3. Redirect URI: `https://<worker-url>/auth/pinterest/callback`.
4. Scopes: `user_accounts:read`, `pins:read`, `boards:read`.

Pinterest has no likes or comments as such; the card maps reactions to likes,
comments to comments, saves to shares and impressions to views.

## 3. Put the handles in config

Any connected account that is not referenced in `src/config.js` shows under
**Connected but not in config.js yet** on the page, with the exact handle or
id to copy. Add it to the right brand, then:

```bash
npx wrangler deploy
```

and tap **Refresh** on that brand.

## How it works

- `GET /` is gated by a cookie derived from `HUB_SECRET`. `/?k=SECRET` sets
  it; `/logout` clears it. The manifest and icons are public so the
  home-screen install works.
- `POST /api/refresh?brand=<id>` collects one brand and merges it into the
  stored snapshot. The page fires one of these per brand, because Cloudflare's
  free plan allows 50 subrequests per invocation and KV reads count.
- The cron (`0 */4 * * *`) refreshes tokens for every provider and then half
  the brands, alternating each run, so every brand updates at least three
  times a day without any single run getting near the limit.
- `history` in KV keeps one record per day (60 days) so each card shows the
  change over the last 7 days.
- Tokens live in KV under `tokens:meta`, `tokens:tiktok`, `tokens:youtube`,
  `tokens:pinterest`. Nothing else stores them.

## Running locally

```bash
npm test                     # unit tests for the aggregation logic
printf 'HUB_SECRET=dev\n' > .dev.vars
npx wrangler kv key put --binding HUB_KV --local snapshot --path test/fixture-snapshot.json
npx wrangler dev             # http://127.0.0.1:8787/?k=dev
```

The fixture renders a realistic page without any platform credentials.
`.dev.vars` is git-ignored; never commit secrets.

## Limits worth knowing

- Workers free: 100,000 requests/day, 10 ms CPU per request, 50 subrequests
  per invocation. A refresh of one brand uses roughly 5 to 10.
- KV free: 100,000 reads and 1,000 writes per day. A refresh is 2 to 4 writes.
- Pinterest trial access: 1,000 API calls/day. The hub uses about 3 per
  refresh per account.
- YouTube Data API: 10,000 units/day. A refresh costs about 3 units.
- Meta changes its insight metric names roughly yearly. If post views stop
  appearing on Facebook or Instagram cards, the note on the card says so and
  the counts still load; update the metric name in `src/providers/meta.js`.
