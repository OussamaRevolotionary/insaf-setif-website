// Verified association facts. Every entry here has a source; anything pending stays
// out (see IMPLEMENTATION_PLAN.md · Phase 0 · "Data still needed from the association").
import news from './news.json';

export const CONTACT = {
  email: 'insafsetif@hotmail.com',
  phone: '+213661048401',
  phoneDisplay: '0661 04 84 01',
  facebook: 'https://www.facebook.com/insaf.association.setif/',
  facebookHandle: '/insaf.association.setif',
  city: { ar: 'سطيف، الجزائر', fr: 'Sétif, Algérie', en: 'Sétif, Algeria' },
};

export const FOUNDED = { year: 2014, month: 6 }; // association's own "about" copy

/** Facebook audience at the time of the July 2026 page export. */
export const FACEBOOK_FOLLOWERS = news.pageInfo.followers;
export const FACEBOOK_SNAPSHOT = '2026-07';

/** Partners and institutions named in INSAF's own posts (or a signed agreement). */
export const PARTNERS = [
  { id: 'onppe', ar: 'الهيئة الوطنية لحماية وترقية الطفولة', fr: 'Organe national de la protection et de la promotion de l’enfance (ONPPE)', en: 'National Body for the Protection and Promotion of Childhood (ONPPE)', short: 'ONPPE' },
  { id: 'nada', ar: 'الشبكة الجزائرية للدفاع عن حقوق الطفل «ندى»', fr: 'Réseau NADA pour la défense des droits de l’enfant', en: 'NADA network for children’s rights', short: 'NADA' },
  { id: 'jil-tech', ar: 'جمعية جيل التكنولوجيا سطيف', fr: 'Association Jil Technologie Sétif', en: 'Jil Technology Association, Sétif', short: 'Jil Tech' },
  { id: 'al-anis', ar: 'جمعية الأنيس لتنشيط الشباب', fr: 'Association El Anis pour l’animation de la jeunesse', en: 'Al-Anis Youth Activities Association', short: 'Al-Anis', since: '2026-03-28' },
  { id: 'djs', ar: 'مديرية الشباب والرياضة لولاية سطيف', fr: 'Direction de la jeunesse et des sports de Sétif', en: 'Sétif Directorate of Youth and Sports', short: 'DJS Sétif' },
  { id: 'odej', ar: 'ديوان مؤسسات الشباب لولاية سطيف', fr: 'Office des établissements de jeunes de Sétif', en: 'Sétif Office of Youth Establishments', short: 'ODEJ Sétif' },
  { id: 'wilaya', ar: 'ولاية سطيف', fr: 'Wilaya de Sétif', en: 'Sétif Province', short: 'Wilaya' },
] as const;

/** Child-protection helplines (verified 2026-09-19). */
export const HELPLINES = [
  { id: 'onppe', number: '1111' },
  { id: 'nada', number: '3033' },
] as const;

/** n8n webhook behind the contact form (same endpoint as the legacy site). */
export const CONTACT_WEBHOOK = 'https://oussama19.app.n8n.cloud/webhook/insaf-contact';
