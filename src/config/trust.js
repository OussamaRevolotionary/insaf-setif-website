// Trust & transparency data. Same rule as LOCAL_RAILS in donation.js: anything the
// association has not supplied stays empty and the page shows a "coming soon" state,
// so nothing on the page is a placeholder dressed up as a fact.

// Bump whenever the Trust page content changes; it is shown on the page.
export const TRUST_UPDATED = '2026-09-19';

export const ASSOCIATION = {
  founded: '2014-06',   // from the association's own "about" copy
  seat: 'Sétif',
  registration: '',     // registration / agrément number
  boardPublished: false, // flip when the executive board list is added to the page
};

// Public documents. Put the file in /public/docs and set its path, e.g. '/docs/statuts.pdf'.
export const TRUST_DOCUMENTS = [
  { id: 'statutes', url: '' },
  { id: 'registration', url: '' },
  { id: 'activityReport', url: '' },
  { id: 'financials', url: '' },
  { id: 'safeguarding', url: '' },
];
