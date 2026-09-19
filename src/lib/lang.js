import React from 'react';

// Lives outside main.jsx so extracted components can read the active language
// without importing main.jsx (which would create a circular import).
export const LangContext = React.createContext({ t: {}, lang: 'ar', setLang: () => {} });

export function useLang() {
  return React.useContext(LangContext);
}

export function pickLang(lang, obj) {
  if (!obj) return '';
  return obj[lang] ?? obj.en ?? obj.ar ?? '';
}
