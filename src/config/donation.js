// n8n bridge that holds the Chargily secret key server-side. The browser only ever
// sends amount / designation / language and receives a hosted checkout_url back.
export const CHARGILY_CHECKOUT_WEBHOOK = 'https://oussama19.app.n8n.cloud/webhook/chargily-checkout';

// True while the n8n bridge uses Chargily TEST keys: the donate box then tells visitors
// that no real money is charged. Flip to false when switching the bridge to live keys.
export const CHARGILY_TEST_MODE = true;

// Only redirect to Chargily-hosted checkout pages.
export const CHARGILY_HOST_PATTERN = /(^|\.)chargily\.(dz|com|net|com\.dz)$/;

// Mirrored by the validation node in the n8n workflow — keep both in sync.
// (Chargily itself rejects anything under 50 DA.)
export const DONATION_LIMITS = { min: 100, max: 500000 };

export const PRESET_AMOUNTS = [1000, 3500, 5000, 8000, 15000];

// Designations a donor can direct a gift to. `unit` is the cost of one tangible item,
// used to show "what your gift buys" next to the amount picker.
export const DESIGNATIONS = [
  { id: 'general',  unit: null },
  { id: 'school',   unit: 5000 },
  { id: 'health',   unit: 8000 },
  { id: 'winter',   unit: 3500 },
  { id: 'wildfire', unit: null },
  { id: 'ramadan',  unit: null },
];

// Official coordinates must come from the association. While a value is empty the
// UI shows a "coming soon" state instead of a copyable number, so a donor can never
// copy a placeholder and send money to the wrong account.
export const LOCAL_RAILS = {
  baridimob: {
    rip: '',      // 20-digit RIP, e.g. '00799999xxxxxxxxxxxx'
    qrImage: '',  // e.g. '/baridipay-qr.png' placed in /public
  },
  ccp: {
    account: '',  // CCP account number
    key: '',      // Clé
  },
};

// Moved here unchanged from main.jsx. This is a personal account (not the association's)
// and should be replaced with Insaf's official account before public fundraising.
export const INTERNATIONAL_BANK = {
  holder:   'Oussama Abdi',
  account:  '42649160',
  bank:     'Clear Junction Limited',
  iban:     'GB16CLJU04130742649160',
  sortCode: '041307',
  swift:    'CLJUGB21XXX',
  address:  '4th Floor Imperial House, 15 Kingsway, London, UK, WC2B 6UN',
};
