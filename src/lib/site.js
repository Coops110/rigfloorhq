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

// ── Analytics ───────────────────────────────────────────────
// Google Analytics 4 measurement ID. Find it in GA: Admin → Data streams →
// your web stream → "MEASUREMENT ID". Format is G-XXXXXXXXXX.
//
// LEAVE EMPTY TO DISABLE. Everything downstream is gated on this value: no
// gtag, no consent banner, no "Cookie settings" footer link, and the privacy
// and cookie pages render their no-cookies wording. Paste an ID in and all of
// that flips together, in both languages. That coupling is deliberate — it is
// what stops the published policy from describing a site you no longer run.
//
// Only injected in production builds, so `npm run dev` never reaches the
// property.
export const GA_ID = '';

// ── Cookie consent (GDPR / UK PECR) ─────────────────────────
// Where opt-in consent is legally required before analytics storage. Google
// resolves the visitor's region server-side from IP, so this drives Consent
// Mode v2 reliably rather than guessing in the browser.
// UK + all 27 EU states + the 3 remaining EEA states + Switzerland.
export const CONSENT_REQUIRED_REGIONS = [
  'GB',
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE',
  'IS', 'LI', 'NO',
  'CH',
];

// Bump the version suffix to re-prompt everyone (e.g. if a new vendor is added
// that the old consent did not cover).
export const CONSENT_STORAGE_KEY = 'rigfloorhq_consent_v1';

// 'all' shows the banner to every visitor; 'eu' only where consent is legally
// required. 'all' is the safer default and gives non-EU visitors an opt-out
// too, which US state privacy laws increasingly expect.
export const CONSENT_BANNER_SCOPE = 'all';

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
  governingLawEs: 'Tailandia',
  lastUpdated: '31 July 2026',
  lastUpdatedEs: '31 de julio de 2026',
};

// ── What the site actually does with data ───────────────────
// The privacy and cookie pages branch on GA_ID above, so they describe the
// site as configured. This table is the fixed part: the providers involved
// regardless of whether analytics is on. If you add one, add it to
// PROCESSORS_ES too.
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

// Spanish rendering of the table above. Kept as a parallel array rather than
// translated inline so the two versions cannot drift apart unnoticed — if you
// add a processor, add it in both places.
export const PROCESSORS_ES = [
  [
    'Vercel Inc.',
    'Alojamiento del sitio y entrega de contenido. Los registros del servidor pueden incluir direcciones IP.',
    'Estados Unidos',
  ],
  [
    'Google LLC',
    'Sirve las tipografías web utilizadas en el sitio. Recibe su dirección IP al cargarse una fuente.',
    'Estados Unidos',
  ],
  [
    'Namecheap, Inc.',
    'Registro del dominio y reenvío de correo de nuestra dirección de contacto.',
    'Estados Unidos',
  ],
  [
    'Proton AG',
    'Aloja el buzón que recibe la correspondencia enviada a nuestra dirección de contacto.',
    'Suiza',
  ],
];
