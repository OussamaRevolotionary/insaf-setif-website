export function dateFmt(d, locale = 'ar-DZ') {
  try { return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(d)); }
  catch { return d?.slice(0, 10) || ''; }
}

export function localeFor(lang) {
  return lang === 'fr' ? 'fr-FR' : lang === 'en' ? 'en-GB' : 'ar-DZ';
}

// Algeria writes amounts with Western digits and space grouping ("5 000 DA");
// fr-FR grouping gives exactly that for every UI language.
const daNumber = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

export function formatDA(amount, lang = 'fr') {
  const n = daNumber.format(Math.round(Number(amount) || 0));
  return lang === 'ar' ? `${n} دج` : `${n} DA`;
}
