// The figures below are placeholders carried over for the demo. While this flag is true
// the Campaigns section discloses that they are illustrative; set it to false once the
// association publishes verified totals.
export const FIGURES_ARE_ILLUSTRATIVE = true;

export const CAMPAIGNS = [
  { id: 'school',   raised: 340000, goal: 500000, color: 'var(--green)',  suggested: 5000 },
  { id: 'wildfire', raised: 360000, goal: 800000, color: 'var(--orange)', suggested: 3500 },
  { id: 'winter',   raised: 204000, goal: 300000, color: 'var(--blue)',   suggested: 3500 },
];

function hijriDate(date) {
  for (const calendar of ['islamic-umalqura', 'islamic']) {
    try {
      const parts = new Intl.DateTimeFormat(`en-u-ca-${calendar}`, { month: 'numeric', day: 'numeric' })
        .formatToParts(date);
      const month = Number(parts.find((p) => p.type === 'month')?.value);
      const day = Number(parts.find((p) => p.type === 'day')?.value);
      if (month) return { month, day };
    } catch { /* calendar unsupported in this engine */ }
  }
  return null;
}

/**
 * Picks the appeal that matches the Algerian giving calendar: Ramadan (from mid-Sha'ban,
 * Hijri month 8, through Ramadan, month 9), winter in the Sétif highlands, wildfire season,
 * and the back-to-school rentrée. Falls back to year-round child support.
 */
export function getSeasonalAppeal(date = new Date()) {
  const hijri = hijriDate(date);
  if (hijri && (hijri.month === 9 || (hijri.month === 8 && hijri.day >= 15))) {
    return { id: 'ramadan', campaign: 'ramadan', amount: 5000 };
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month >= 11 || month <= 2) return { id: 'winter', campaign: 'winter', amount: 3500 };
  if (month === 7 || (month === 8 && day <= 20)) return { id: 'wildfire', campaign: 'wildfire', amount: 3500 };
  if ((month === 8 && day > 20) || month === 9 || (month === 10 && day <= 15)) {
    return { id: 'school', campaign: 'school', amount: 5000 };
  }
  return { id: 'orphans', campaign: 'general', amount: 5000 };
}
