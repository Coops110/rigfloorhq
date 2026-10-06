// One entry per brand. Each network key names the account the hub should show.
// Leave a value empty ('') until you have connected the account; the hub lists
// every connected-but-unassigned account on the page so you can copy the exact
// handle or id in here.
//
//   facebook.pageId      numeric Facebook Page id (the number in the Page URL)
//   instagram.username   Instagram handle, no @ (must be a Business/Creator account)
//   tiktok.username      TikTok handle, no @
//   youtube.channelId    "UC..." channel id
//   pinterest.username   Pinterest handle

export const BRANDS = [
  {
    id: 'rigfloorhq',
    name: 'RigFloorHQ',
    site: 'https://rigfloorhq.com',
    facebook: { pageId: '1215544864984509' },
    tiktok: { username: 'rigfloorhq' },
  },
  {
    id: 'airprohq',
    name: 'AirProHQ',
    site: 'https://airprohq.com',
    facebook: { pageId: '' },
    tiktok: { username: '' },
  },
  {
    id: 'garagedoorprohq',
    name: 'GarageDoorProHQ',
    site: 'https://garagedoorprohq.com',
    facebook: { pageId: '' },
    tiktok: { username: '' },
  },
  {
    id: 'hotdailydiaries',
    name: 'Hot Daily Diaries',
    site: '',
    facebook: { pageId: '1410342212153814' },
    instagram: { username: 'hotdailydiaries' },
    tiktok: { username: 'hotdailydiaries' },
    youtube: { channelId: 'UCeswO01SXN144ljQlMwANjQ' },
  },
  {
    id: 'calmbrainco',
    name: 'Calm Brain Co',
    site: '',
    facebook: { pageId: '1414715711714173' },
  },
];

// How many recent posts to pull per account. Keep it modest: every account is
// one or two API calls per refresh, and Pinterest trial access is 1,000/day.
export const POSTS_PER_ACCOUNT = 20;

export const NETWORKS = {
  facebook:  { label: 'Facebook',  provider: 'meta' },
  instagram: { label: 'Instagram', provider: 'meta' },
  tiktok:    { label: 'TikTok',    provider: 'tiktok' },
  youtube:   { label: 'YouTube',   provider: 'youtube' },
  pinterest: { label: 'Pinterest', provider: 'pinterest' },
};
