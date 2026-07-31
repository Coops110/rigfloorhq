// ─────────────────────────────────────────────────────────────
//  SITE + LEGAL CONFIG
//  These values appear verbatim on /about, /privacy, /terms and
//  /cookies. The policy names you as data controller, so they
//  must match reality — check them before relying on the pages.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: 'RigFloorHQ',
  domain: 'https://rigfloorhq.com',
  description:
    'The complete oil and gas field reference — drilling, welding, well control, and career guidance for every level of the industry.',
  // Published contact address. This is a Namecheap forwarding alias that
  // delivers to the operator's mailbox, so the destination can be changed
  // without editing any page. Must be a mailbox that is actually monitored:
  // there is a one month deadline to answer data subject requests sent here.
  email: 'contact@rigfloorhq.com',
};

// ── Legal identity ──────────────────────────────────────────
// TODO(confirm): these are carried over from the sister site AirProHQ on the
// assumption RigFloorHQ is run by the same operator. If the entity, address or
// governing law differ, change them here — every legal page reads from this
// object, so one edit updates all of them.
export const LEGAL = {
  // 'company' → registered company; 'sole-trader' → operated by an individual.
  entityType: 'sole-trader',
  legalName: 'RigFloorHQ',
  // Set to '' to omit the postal address from the published pages. Naming a
  // controller is required; publishing a street address is not, though it does
  // strengthen the compliance position.
  address:
    '483 Chaiyaphruek 3 Alley, Muang Pattaya, Bang Lamung District, Chon Buri 20150, Thailand',
  // Derived from SITE.email so the address in the privacy policy can never
  // drift from the one published elsewhere on the site.
  contactEmail: SITE.email,
  // Operator is based in Thailand, so Thai law governs the terms. UK/EU data
  // protection duties still apply to UK/EEA visitors regardless.
  governingLaw: 'Thailand',
  lastUpdated: '31 July 2026',
};

// ── What the site actually does with data ───────────────────
// Verified against src/ on 31 July 2026: no analytics, no cookies, no
// localStorage, no consent banner, no forms. The only third parties that
// receive anything are the host and the font CDN. If any of that changes,
// update the privacy and cookie pages at the same time.
export const PROCESSORS = [
  [
    'Vercel Inc.',
    'Website hosting and content delivery. Server logs may include IP addresses.',
    'United States',
  ],
  [
    'Google LLC',
    'Serves the web fonts used across the site. Receives your IP address when a font loads.',
    'United States',
  ],
  [
    'Namecheap, Inc.',
    'Domain registration and email forwarding for our contact address.',
    'United States',
  ],
  [
    'Proton AG',
    'Hosts the mailbox that receives correspondence sent to our contact address.',
    'Switzerland',
  ],
];
