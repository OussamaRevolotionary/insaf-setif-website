import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, NavLink, Route, Routes, Link, useLocation } from 'react-router-dom';
import {
  ArrowRight, ArrowUp, ArrowUpRight, Award, Building2,
  CalendarDays, CheckCircle2, HandHeart, HeartHandshake,
  Home, Mail, MapPin, Menu, Newspaper, Phone,
  Search, ShieldCheck, Sparkles, Target, UsersRound, X,
  Users, BookOpen, Star, Globe, ChevronLeft, ChevronRight,
  Heart, Share2, MessageSquare, CheckCheck, AlertCircle,
  Send, Bot, User, RefreshCw, Maximize2, ExternalLink
} from 'lucide-react';
import { achievementPosts, newsPosts, pageInfo } from './data/newsPosts';
import './styles.css';

/* ============================================================
   CONSTANTS & HELPERS
   ============================================================ */
const contact = { ...pageInfo.contact, address: 'Sétif, Algérie' };

/* n8n automation endpoints (see IMPLEMENTATION_PLAN.md · Phase C) */
const N8N_BASE = 'https://oussama19.app.n8n.cloud/webhook';
const CHAT_WEBHOOK = `${N8N_BASE}/insaf-chat`;
const CONTACT_WEBHOOK = `${N8N_BASE}/insaf-contact`;

// GitHub Pages serves the built site under /insaf-setif-website/ rather than the
// domain root. Vite exposes the configured base as BASE_URL; local `/public` assets
// referenced by a literal leading slash need this prefix, remote URLs must not.
const BASE_URL = import.meta.env.BASE_URL;
function withBase(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  return BASE_URL + path.replace(/^\//, '');
}

// Resolve local `/photos/...` paths once against BASE_URL; remote Facebook CDN URLs pass through unchanged.
const resolvedNewsPosts = newsPosts.map(p => ({
  ...p,
  image: withBase(p.image),
  images: p.images ? p.images.map(withBase) : p.images,
}));
const resolvedAchievementPosts = achievementPosts.map(p => ({ ...p, image: withBase(p.image) }));

/* Stable per-browser id so the chatbot's memory keeps each visitor's thread separate */
function getChatSessionId() {
  try {
    let id = localStorage.getItem('insaf-chat-session');
    if (!id) {
      id = 'web-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      localStorage.setItem('insaf-chat-session', id);
    }
    return id;
  } catch {
    return 'insaf-web';
  }
}

// Official Facebook brand glyph (lucide dropped brand icons; inline SVG keeps correct branding)
function FacebookIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

// Phone Display Helper to guarantee LTR direction anywhere in RTL/LTR layouts
function PhoneDisplay({ number, className = '' }) {
  const cleanNumber = number || contact.telDisplay || contact.phone;
  return (
    <span className={`phone-ltr ${className}`} dir="ltr">
      {cleanNumber}
    </span>
  );
}

const navItems = [
  { href: '/', ar: 'الرئيسية', fr: 'Accueil',      en: 'Home' },
  { href: '/about',        ar: 'من نحن',      fr: 'À propos',    en: 'About' },
  { href: '/goals',        ar: 'الأهداف والبيئة', fr: 'Objectifs & 3D', en: 'Goals & 3D' },
  { href: '/programs',     ar: 'البرامج',     fr: 'Programmes',  en: 'Programs' },
  { href: '/achievements', ar: 'الإنجازات',   fr: 'Réalisations',en: 'Achievements' },
  { href: '/news',         ar: 'الأخبار',     fr: 'Actualités',  en: 'News' },
  { href: '/contact',      ar: 'اتصل بنا',    fr: 'Contact',     en: 'Contact' },
];

const programs = [
  {
    ar: 'حقوق الطفل والحماية',
    fr: 'Droits et protection de l\'enfant',
    en: 'Child Rights & Protection',
    text: 'Advocacy, awareness, legal seminars, prevention culture, and coordination dedicated to children\'s dignity and safety.',
    Icon: ShieldCheck, color: 'blue'
  },
  {
    ar: 'إدماج الشباب والفئات الهشة',
    fr: 'Insertion des jeunes et publics vulnérables',
    en: 'Youth & Vulnerable Group Reintegration',
    text: 'Accompaniment toward social and professional reintegration, labor-market bridges, and institutional forums.',
    Icon: UsersRound, color: 'green'
  },
  {
    ar: 'التضامن المجتمعي',
    fr: 'Solidarité communautaire',
    en: 'Community Solidarity',
    text: 'Support for orphans and vulnerable groups, response to crises, and mobilization of volunteers around practical action.',
    Icon: HandHeart, color: 'orange'
  },
  {
    ar: 'الشراكة والإعلام المدني',
    fr: 'Partenariat et communication civile',
    en: 'Civic Partnership & Media',
    text: 'A public-facing bridge with universities, elected officials, wilaya services, and associations through open communication.',
    Icon: HeartHandshake, color: 'red'
  }
];

const goals = [
  { ar: 'الدفاع عن حقوق الطفل',        fr: 'Défendre les droits de l\'enfant',       en: 'Defend children\'s rights',       text: 'Promote children\'s rights through awareness, advocacy and civic mobilization.', Icon: ShieldCheck },
  { ar: 'مرافقة الشباب',               fr: 'Accompagner les jeunes',                  en: 'Accompany youth',                  text: 'Support young people and vulnerable groups with orientation and pathways to real inclusion.', Icon: UsersRound },
  { ar: 'تعزيز الإدماج الاجتماعي',     fr: 'Renforcer la réinsertion sociale',        en: 'Strengthen social reintegration',  text: 'Contribute to initiatives that connect civil society, institutions and economic actors.', Icon: HeartHandshake },
  { ar: 'ترسيخ التضامن',               fr: 'Animer la solidarité',                    en: 'Anchor solidarity',                text: 'Turn equity into practical solidarity through action, crisis response and social support.', Icon: HandHeart },
  { ar: 'بناء الشراكات',               fr: 'Consolider les partenariats',             en: 'Strengthen partnerships',          text: 'Work with ONPPE, DJS, universities, wilaya authorities and civic partners.', Icon: Globe },
];

const partners = [
  { name: 'ONPPE', nameAr: 'المرصد الوطني لحماية الطفل', Icon: ShieldCheck },
  { name: 'DJS Sétif', nameAr: 'مديرية الشباب والرياضة', Icon: UsersRound },
  { name: 'Wilaya de Sétif', nameAr: 'ولاية سطيف', Icon: Building2 },
  { name: 'Université Sétif 1', nameAr: 'جامعة سطيف 1', Icon: BookOpen },
  { name: 'Université Sétif 2', nameAr: 'جامعة سطيف 2', Icon: BookOpen },
  { name: 'Associations Civiles', nameAr: 'جمعيات مدنية', Icon: HeartHandshake },
  { name: 'Partenaires Institutionnels', nameAr: 'شركاء مؤسساتيون', Icon: Globe },
];

const translations = {
  ar: {
    brand: 'جمعية إنصاف سطيف', strap: 'حماية الطفولة، تمكين الشباب، خدمة المجتمع المدني',
    heroTitle: 'إنصافٌ يحمي الطفل، يرافق الشباب، ويصنع الأثر في سطيف.',
    heroSub: 'منصة رقمية كاملة تعرض رسالة الجمعية وبرامجها وإنجازاتها وبيئاتها التفاعلية ثلاثية الأبعاد.',
    ctaPartner: 'تعاون معنا', ctaNews: 'آخر الأخبار',
    statFounded: 'منذ 2014', statFoundedLabel: 'سنة التأسيس', statFollowers: 'متابع', statPosts: 'خبر', statPhotos: 'صورة', statPillars: 'محاور',
    impactBenef: 'مستفيد', impactPartners: 'شريك', impactYears: 'سنة من العطاء', impactPrograms: 'برنامج',
    navAbout: 'من نحن', navGoals: 'الأهداف والبيئة', navPrograms: 'البرامج', navAchievements: 'الإنجازات', navNews: 'الأخبار', navContact: 'اتصل بنا',
    labelAbout: 'الجمعية', labelGoals: 'الرؤية والبيئة', labelPrograms: 'البرامج', labelAchievements: 'الأثر', labelNews: 'الأخبار', labelContact: 'التواصل',
    leadAbout: 'جمعية إنصاف سطيف منظمة مجتمع مدني تأسست في جوان 2014، تعمل من أجل الدفاع عن حقوق الطفل، مرافقة الشباب، الإدماج الاجتماعي، والتضامن المجتمعي.',
    leadGoals: 'استكشف بيئة التمكين التفاعلية ثلاثية الأبعاد والأهداف الأساسية للجمعية.', leadPrograms: 'محاور العمل الرئيسية للجمعية.',
    leadAchievements: 'حضور ميداني ومؤسساتي موثق بصور وعناوين بارزة.',
    leadNews: 'أرشيف الأخبار والنشاطات بعناوين رئيسية وتفاعل ديناميكي.', leadContact: 'تواصل مع جمعية إنصاف سطيف عبر القنوات الرسمية.',
    footerBrand: 'جمعية إنصاف سطيف', footerTag: 'حماية الطفولة • تمكين الشباب • خدمة المجتمع المدني',
    footerNav: 'روابط سريعة', footerContactTitle: 'تواصل معنا',
    searchNews: 'ابحث في المنشورات...', all: 'الكل', readMore: 'فتح التفاصيل', showMore: 'عرض المزيد', noPosts: 'لا توجد أخبار مطابقة.',
    ctaVolunteerTitle: 'كن جزءاً من الأثر', ctaVolunteerText: 'انضم إلينا كمتطوع أو شريك وساهم في صنع مستقبل أفضل لأطفال ولشباب سطيف.',
    ctaVolunteerBtn: 'تعاون معنا', ctaVolunteerBtn2: 'اعرف أكثر',
    chatTitle: 'المساعد الذكي لجمعية إنصاف', chatWelcome: 'مرحباً بك! أنا المساعد الذكي لجمعية إنصاف. كيف يمكنني مساعدتك اليوم؟', chatName: 'الاسم', chatEmail: 'البريد الإلكتروني', chatMsg: 'اكتب سؤالك هنا...', chatSend: 'إرسال',
    formName: 'الاسم الكامل', formOrg: 'الهيئة / الصفة', formEmail: 'البريد الإلكتروني', formMsg: 'موضوع التعاون أو الرسالة', formSend: 'إرسال الطلب',
    formSuccess: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', formError: 'حدث خطأ، يرجى المحاولة مجدداً.',
    formErrName: 'الاسم مطلوب', formErrEmail: 'البريد الإلكتروني غير صحيح', formErrMsg: 'الرسالة مطلوبة',
    contactTitle: 'معلومات التواصل الرسمية',
    missionTitle: 'الرسالة الأصلية', missionText: 'حملت الجمعية اسم "إنصاف" لتجعل العدالة والكرامة والحماية قيماً عملية في خدمة الأطفال والشباب والفئات الهشة.',
    visionTitle: 'الرؤية', visionText: 'مجتمع محلي يحمي كرامة الطفل، يفتح للشباب مسارات إدماج حقيقية، ويجعل التضامن مسؤولية مشتركة.',
    valuesTitle: 'القيم', valuesItems: ['الإنصاف والكرامة', 'الحماية والوقاية', 'المرافقة والإدماج', 'التطوع والتضامن', 'الشراكة المؤسساتية', 'المسؤولية المدنية'],
    timelineTitle: 'مسيرة 10+ سنوات من التمكين والإنصاف', partnersTitle: 'شركاؤنا المؤسساتيون', partnersLead: 'نعمل بالتنسيق مع مؤسسات وطنية وجهات محلية لتحقيق أهداف الجمعية.',
    galleryTitle: 'صور من النشاطات', galleryLead: 'توثيق حقيقي لأنشطة الجمعية وتفاعلها مع الفئات المستهدفة على أرض الواقع.',
    overviewLabel: 'نظرة عامة', overviewTitle: 'الموقع يعبر عن الجمعية ككيان حقيقي',
    overviewText: 'جمعية إنصاف سطيف تعمل من أجل الدفاع عن حقوق الطفل، مرافقة الشباب، الإدماج الاجتماعي والتضامن المجتمعي في سطيف.',
    copyright: '© 2024 جمعية إنصاف سطيف. جميع الحقوق محفوظة.',
    notFoundTitle: '404', notFoundText: 'الصفحة غير موجودة', notFoundBtn: 'العودة للرئيسية',
  },
  fr: {
    brand: 'Association Insaf Sétif', strap: 'Protection, insertion, solidarité',
    heroTitle: 'L\'équité protège l\'enfant, accompagne les jeunes et crée de l\'impact à Sétif.',
    heroSub: 'Plateforme numérique pour la mission, les programmes, et les univers 3D interactifs.',
    ctaPartner: 'Collaborer', ctaNews: 'Actualités',
    statFounded: 'Depuis 2014', statFoundedLabel: 'Année de création', statFollowers: 'abonnés', statPosts: 'actualités', statPhotos: 'photos', statPillars: 'piliers',
    impactBenef: 'bénéficiaires', impactPartners: 'partenaires', impactYears: 'ans d\'engagement', impactPrograms: 'programmes',
    navAbout: 'À propos', navGoals: 'Objectifs & 3D', navPrograms: 'Programmes', navAchievements: 'Réalisations', navNews: 'Actualités', navContact: 'Contact',
    labelAbout: 'Association', labelGoals: 'Vision & 3D', labelPrograms: 'Programmes', labelAchievements: 'Impact', labelNews: 'Actualités', labelContact: 'Contact',
    leadAbout: 'Association Insaf Sétif est une association civile fondée en juin 2014, dédiée aux droits de l\'enfant, à l\'accompagnement des jeunes, à la réinsertion sociale et à la solidarité.',
    leadGoals: 'Découvrez l\'écosystème 3D interactif et les objectifs clés de l\'association.', leadPrograms: 'Les principaux piliers d\'action de l\'association.',
    leadAchievements: 'Présence de terrain et institutionnelle documentée par des images et titres impactants.',
    leadNews: 'Actualités et activités présentées sous forme de cartes dynamiques.', leadContact: 'Contactez l\'Association Insaf Sétif via les canaux officiels.',
    footerBrand: 'Association Insaf Sétif', footerTag: 'Protection de l\'enfance • Accompagnement des jeunes • Solidarité',
    footerNav: 'Navigation', footerContactTitle: 'Contact',
    searchNews: 'Rechercher...', all: 'Tout', readMore: 'Voir détails', showMore: 'Afficher plus', noPosts: 'Aucune actualité.',
    ctaVolunteerTitle: 'Rejoignez l\'impact', ctaVolunteerText: 'Devenez bénévole ou partenaire et contribuez à un avenir meilleur pour les enfants et jeunes de Sétif.',
    ctaVolunteerBtn: 'Collaborer', ctaVolunteerBtn2: 'En savoir plus',
    chatTitle: 'Assistant IA d\'Insaf', chatWelcome: 'Bonjour ! Je suis l\'Assistant IA d\'Insaf. Comment puis-je vous aider aujourd\'hui ?', chatName: 'Nom', chatEmail: 'Email', chatMsg: 'Posez votre question...', chatSend: 'Envoyer',
    formName: 'Nom complet', formOrg: 'Organisation', formEmail: 'Email', formMsg: 'Décrivez votre message', formSend: 'Envoyer',
    formSuccess: 'Message envoyé avec succès !', formError: 'Une erreur est survenue, réessayez.',
    formErrName: 'Le nom est requis', formErrEmail: 'Email invalide', formErrMsg: 'Le message est requis',
    contactTitle: 'Coordonnées officielles',
    missionTitle: 'Mission originelle', missionText: 'L\'association porte le nom "Insaf" pour faire de la justice, de la dignité et de la protection des valeurs au service des enfants, des jeunes et des publics vulnérables.',
    visionTitle: 'Vision', visionText: 'Une communauté locale qui protège la dignité de l\'enfant, ouvre des parcours d\'inclusion et fait de la solidarité une responsabilité partagée.',
    valuesTitle: 'Valeurs', valuesItems: ['Équité et dignité', 'Protection et prévention', 'Accompagnement et insertion', 'Bénévolat et solidarité', 'Partenariat institutionnel', 'Responsabilité civique'],
    timelineTitle: '10+ ans d\'impact et de progrès', partnersTitle: 'Nos partenaires institutionnels', partnersLead: 'Nous travaillons en coordination avec des institutions nationales et locales.',
    galleryTitle: 'Galerie d\'activités', galleryLead: 'Documentation réelle des activités de l\'association sur le terrain.',
    overviewLabel: 'Aperçu', overviewTitle: 'Le site parle au nom de l\'association',
    overviewText: 'Association Insaf Sétif œuvre pour les droits de l\'enfant, l\'accompagnement des jeunes, la réinsertion sociale et la solidarité.',
    copyright: '© 2024 Association Insaf Sétif. Tous droits réservés.',
    notFoundTitle: '404', notFoundText: 'Page introuvable', notFoundBtn: 'Retour à l\'accueil',
  },
  en: {
    brand: 'Association Insaf Sétif', strap: 'Child protection, inclusion, solidarity',
    heroTitle: 'Equity protects children, supports youth, and creates impact in Sétif.',
    heroSub: 'A complete digital platform featuring our mission, programs, and interactive 3D ecosystems.',
    ctaPartner: 'Partner with us', ctaNews: 'Latest news',
    statFounded: 'Since 2014', statFoundedLabel: 'Founded', statFollowers: 'followers', statPosts: 'posts', statPhotos: 'photos', statPillars: 'pillars',
    impactBenef: 'Beneficiaries', impactPartners: 'Partners', impactYears: 'Years of impact', impactPrograms: 'Programs',
    navAbout: 'About', navGoals: 'Goals & 3D', navPrograms: 'Programs', navAchievements: 'Achievements', navNews: 'News', navContact: 'Contact',
    labelAbout: 'Association', labelGoals: 'Vision & 3D', labelPrograms: 'Programs', labelAchievements: 'Impact', labelNews: 'News', labelContact: 'Contact',
    leadAbout: 'Association Insaf Sétif is a civil society organization founded in June 2014, dedicated to child rights, youth accompaniment, social reintegration and solidarity.',
    leadGoals: 'Explore our 3D interactive Ecosystem of Empowerment and core goals.', leadPrograms: 'The main programs and impact pillars.',
    leadAchievements: 'Field and institutional presence documented with image cards and clear headlines.',
    leadNews: 'News archive formatted into clean headline cards with dynamic zoom effects.', leadContact: 'Contact Association Insaf Sétif through the official channels.',
    footerBrand: 'Association Insaf Sétif', footerTag: 'Child protection • Youth empowerment • Community service',
    footerNav: 'Quick links', footerContactTitle: 'Get in touch',
    searchNews: 'Search posts...', all: 'All', readMore: 'View details', showMore: 'Show more', noPosts: 'No matching news posts.',
    ctaVolunteerTitle: 'Be part of the impact', ctaVolunteerText: 'Join us as a volunteer or partner and help build a better future for children and youth in Sétif.',
    ctaVolunteerBtn: 'Partner with us', ctaVolunteerBtn2: 'Learn more',
    chatTitle: 'Insaf AI Agent', chatWelcome: 'Hello! I am Insaf\'s AI Agent. How can I assist you today?', chatName: 'Name', chatEmail: 'Email', chatMsg: 'Type your message...', chatSend: 'Send',
    formName: 'Full name', formOrg: 'Organization', formEmail: 'Email address', formMsg: 'Describe your message or collaboration topic', formSend: 'Send request',
    formSuccess: 'Message sent successfully!', formError: 'An error occurred, please try again.',
    formErrName: 'Name is required', formErrEmail: 'Invalid email address', formErrMsg: 'Message is required',
    contactTitle: 'Official contact details',
    missionTitle: 'Original mission', missionText: 'The association carries the name "Insaf" to make justice, dignity and protection practical values in service of children, youth and vulnerable groups.',
    visionTitle: 'Vision', visionText: 'A local community that protects children\'s dignity, opens real inclusion pathways, and makes solidarity a shared responsibility.',
    valuesTitle: 'Values', valuesItems: ['Equity & Dignity', 'Protection & Prevention', 'Accompaniment & Inclusion', 'Volunteering & Solidarity', 'Institutional Partnership', 'Civic Responsibility'],
    timelineTitle: '10+ Years of Progress and Empowerment', partnersTitle: 'Institutional partners', partnersLead: 'We work in coordination with national institutions and local authorities.',
    galleryTitle: 'Activity gallery', galleryLead: 'Real documentation of the association\'s activities and engagement with target groups.',
    overviewLabel: 'Overview', overviewTitle: 'The website speaks for the association',
    overviewText: 'Association Insaf Sétif works for child rights, youth accompaniment, social reintegration and community solidarity in Sétif.',
    copyright: '© 2024 Association Insaf Sétif. All rights reserved.',
    notFoundTitle: '404', notFoundText: 'Page not found', notFoundBtn: 'Back to home',
  }
};

/* ============================================================
   CONTEXT & HOOKS
   ============================================================ */
const LangContext = React.createContext({ t: translations.ar, lang: 'ar', setLang: () => {} });

function LangProvider({ children }) {
  const [lang, setLangState] = React.useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('insaf-lang') || 'ar';
    return 'ar';
  });

  const setLang = React.useCallback((l) => {
    setLangState(l);
    localStorage.setItem('insaf-lang', l);
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = React.useMemo(() => translations[lang] || translations.ar, [lang]);

  return (
    <LangContext.Provider value={{ t, lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

function useLang() { return React.useContext(LangContext); }

function useScrollReveal() {
  React.useEffect(() => {
    // Only observe elements not yet revealed — cheap on re-render, still catches
    // dynamically added nodes (e.g. News "show more" / filtering).
    const els = document.querySelectorAll(
      '.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible)'
    );
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

function useScrollProgress() {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setPct(Math.min(pct, 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return pct;
}

function useHeaderScrolled() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
}

function useCountUp(target, active, duration = 1600) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, active, duration]);
  return val;
}

function useBackToTop() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return show;
}

function clean(s = '') { return (s || '').replace(/[#_]/g, ' ').replace(/\s+/g, ' ').trim(); }

function dateFmt(d, locale = 'ar-DZ') {
  try { return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(d)); }
  catch { return d?.slice(0, 10) || ''; }
}

function categories() { return ['All', ...Array.from(new Set(resolvedNewsPosts.map(p => p.category)))]; }

const photoCatalog = resolvedNewsPosts.flatMap(p => p.images?.filter(Boolean).map(img => ({ img, cat: p.category, title: p.title })) || []);
const aboutImage = photoCatalog.find(p => p.img)?.img || withBase('/LOGO.jpg');
const galleryImages = photoCatalog.slice(0, 24);
const featured = resolvedNewsPosts.filter(p => p.image).slice(0, 6);

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

/* ============================================================
   NATIVE 3D EMBED COMPONENTS
   ============================================================ */
function Ecosystem3DSection() {
  return (
    <div className="full-bleed-3d" style={{ height: '100vh', minHeight: '650px', background: '#0f172a' }}>
      <iframe
        src={withBase('/ecosystem_of_empowerment.html')}
        title="3D Ecosystem of Empowerment"
        style={{ display: 'block', width: '100%', height: '100%', border: 'none' }}
        allowFullScreen
      />
    </div>
  );
}

function Timeline3DSection() {
  return (
    <div className="full-bleed-3d" style={{ height: '100vh', minHeight: '650px', background: '#020617' }}>
      <iframe
        src={withBase('/timeline_of_progress.html')}
        title="3D Timeline of Progress"
        style={{ display: 'block', width: '100%', height: '100%', border: 'none' }}
        allowFullScreen
      />
    </div>
  );
}

/* ============================================================
   SITE SHELL
   ============================================================ */
function SiteShell({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const scrolled = useHeaderScrolled();
  const progress = useScrollProgress();
  const showTop = useBackToTop();
  const { t, lang, setLang } = useLang();
  const location = useLocation();

  React.useEffect(() => setMobileOpen(false), [location.pathname]);

  const navLabel = (item) => lang === 'fr' ? item.fr : lang === 'en' ? item.en : item.ar;

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <div className="scroll-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <header className={`siteHeader${scrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
          <img src={withBase('/LOGO.jpg')} alt="Insaf Sétif" />
          <div className="brand-text">
            <b>{t.brand}</b>
            <small>{t.strap}</small>
          </div>
        </Link>

        <nav>
          {navItems.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {navLabel(item)}
            </NavLink>
          ))}
        </nav>

        <div className="headerRight">
          <a href={contact.facebook} target="_blank" rel="noreferrer" className="header-fb" aria-label="Facebook" style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', marginRight: '1rem' }}>
            <FacebookIcon size={24} />
          </a>
          <div className="lang-controls" role="group" aria-label="Language / اللغة">
            {['ar', 'fr', 'en'].map(l => (
              <button
                key={l}
                className={lang === l ? 'active' : ''}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                aria-label={l === 'ar' ? 'العربية' : l === 'fr' ? 'Français' : 'English'}
              >
                {l === 'ar' ? 'ع' : l.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="menuBtn" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobileNavOverlay open" onClick={() => setMobileOpen(false)}>
          <nav className="mobileNav" onClick={e => e.stopPropagation()}>
            {navItems.map(item => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={() => setMobileOpen(false)}
              >
                {navLabel(item)}
                <ChevronRight size={16} />
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      <ScrollToTop />
      {children}

      <VolunteerCTA />
      <Footer />
      <AIAgentChatWidget />

      <button
        className={`backToTop${showTop ? ' visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  const { t, lang } = useLang();
  const navLabel = (item) => lang === 'fr' ? item.fr : lang === 'en' ? item.en : item.ar;

  return (
    <footer className="footer">
      <div className="footerMain">
        <div>
          <div className="footerBrand">
            <img src={withBase('/LOGO.jpg')} alt="Insaf Sétif" />
            <div>
              <b>{t.footerBrand}</b>
              <span>{t.footerTag}</span>
            </div>
          </div>
          <div className="footerSocials">
            <a className="footerSocialBtn" href={contact.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <FacebookIcon size={18} />
            </a>
            <a className="footerSocialBtn" href={`mailto:${contact.email}`} aria-label="Email">
              <Mail size={18} />
            </a>
            <a className="footerSocialBtn" href={`tel:${contact.phone}`} aria-label="Phone">
              <Phone size={18} />
            </a>
          </div>
        </div>

        <nav className="footerNav">
          <h4>{t.footerNav}</h4>
          {navItems.map(item => (
            <Link key={item.href} to={item.href}>{navLabel(item)}</Link>
          ))}
        </nav>

        <div className="footerContact">
          <h4>{t.footerContactTitle}</h4>
          <a className="footerContactItem" href={contact.facebook} target="_blank" rel="noreferrer">
            <FacebookIcon size={16} /> /insaf.association.setif
          </a>
          <a className="footerContactItem" href={`mailto:${contact.email}`}>
            <Mail size={16} /> {contact.email}
          </a>
          <a className="footerContactItem" href={`tel:${contact.phone}`}>
            <Phone size={16} /> <PhoneDisplay number={contact.telDisplay} />
          </a>
          <span className="footerContactItem">
            <MapPin size={16} /> {contact.address}
          </span>
        </div>
      </div>

      <div className="footerBottom">
        <p>{t.copyright.replace('2024', new Date().getFullYear())}</p>
        <p>Made with <Heart size={12} style={{ display: 'inline', color: '#e63f4d' }} /> for civil society</p>
      </div>
    </footer>
  );
}

function VolunteerCTA() {
  const { t } = useLang();
  return (
    <section className="volunteerCTA reveal">
      <span className="cta-label">
        <Sparkles size={14} style={{ display: 'inline', marginInlineEnd: 6 }} />
        {t.ctaVolunteerTitle}
      </span>
      <h2>{t.ctaVolunteerTitle}</h2>
      <p>{t.ctaVolunteerText}</p>
      <div className="volunteerActions">
        <Link to="/contact" className="btn primary">
          {t.ctaVolunteerBtn} <ArrowUpRight size={18} />
        </Link>
        <Link to="/about" className="btn glass">
          {t.ctaVolunteerBtn2} <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

/* ============================================================
   REAL AI AGENT CHATBOT (n8n Ready Conversational Widget)
   ============================================================ */
function AIAgentChatWidget() {
  const [open, setOpen] = React.useState(false);
  const { t, lang } = useLang();
  const [messages, setMessages] = React.useState([
    { sender: 'agent', text: t.chatWelcome, time: 'Now' }
  ]);
  const [inputMsg, setInputMsg] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const chatEndRef = React.useRef(null);

  const inputRef = React.useRef(null);
  const pick = (ar, fr, en) => (lang === 'ar' ? ar : lang === 'fr' ? fr : en);

  const quickPrompts = lang === 'ar' ? [
    'ما هي أهداف جمعية إنصاف؟',
    'كيف يمكنني التطوع أو الانضمام؟',
    'أين تقع جمعية إنصاف في سطيف؟'
  ] : lang === 'fr' ? [
    'Quels sont les objectifs d\'Insaf ?',
    'Comment devenir bénévole ?',
    'Où se trouve l\'association ?'
  ] : [
    'What are Insaf\'s core goals?',
    'How can I volunteer or partner?',
    'Where is Insaf located in Sétif?'
  ];

  const typingLabel = pick('المساعد يكتب…', 'L\'assistant écrit…', 'Assistant is typing…');
  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Keep the opening greeting in sync with the active language (only while the chat is untouched)
  React.useEffect(() => {
    setMessages(prev =>
      prev.length === 1 && prev[0].sender === 'agent'
        ? [{ sender: 'agent', text: t.chatWelcome, time: 'Now' }]
        : prev
    );
  }, [t.chatWelcome]);

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  const handleReset = () => {
    setMessages([{ sender: 'agent', text: t.chatWelcome, time: 'Now' }]);
    setInputMsg('');
  };

  // Instant on-device answers for the most common questions (works even before n8n is live)
  const localAnswer = (text) => {
    const s = text.toLowerCase();
    if (/(goals|objectif|أهداف|هدف)/.test(s))
      return pick(
        'أهدافنا الرئيسية: حماية حقوق الطفل، مرافقة الشباب، الإدماج الاجتماعي، وترسيخ التضامن المجتمعي.',
        'Nos objectifs : protéger les droits de l\'enfant, accompagner les jeunes, renforcer la réinsertion sociale et la solidarité.',
        'Our core goals: protect children\'s rights, accompany youth, strengthen social reintegration and community solidarity.'
      );
    if (/(volunteer|b[eé]n[eé]vole|تطوع|انضم)/.test(s))
      return pick(
        'نرحب دائماً بالمتطوعين والشركاء! تواصل معنا عبر صفحة "اتصل بنا" أو صفحتنا على فيسبوك للانضمام.',
        'Nous accueillons bénévoles et partenaires ! Contactez-nous via la page « Contact » ou notre page Facebook.',
        'We always welcome volunteers and partners! Reach us via the Contact page or our Facebook page to join.'
      );
    if (/(location|adresse|where|mac|مقر|عنوان|اين|أين)/.test(s))
      return pick(
        'يقع مقر جمعية إنصاف في مدينة سطيف، الجزائر.',
        'L\'association Insaf est basée à Sétif, en Algérie.',
        'Association Insaf is based in Sétif, Algeria.'
      );
    return null;
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputMsg).trim();
    if (!text) return;

    setMessages(prev => [...prev, { sender: 'user', text, time: now() }]);
    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    const local = localAnswer(text);
    if (local) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'agent', text: local, time: now() }]);
        setIsTyping(false);
      }, 650);
      return;
    }

    const fallbackReply = pick(
      'شكراً لتواصلك مع جمعية إنصاف! تم استلام رسالتك وسنجيبك في أقرب وقت.',
      'Merci d\'avoir contacté Insaf ! Votre message a bien été reçu, nous vous répondrons rapidement.',
      'Thank you for reaching out to Insaf! Your message was received and we\'ll reply shortly.'
    );

    try {
      const response = await fetch(CHAT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chatHistory: messages.slice(-8),
          language: lang,
          sessionId: getChatSessionId(),
          source: 'insaf_ai_agent_widget',
          timestamp: new Date().toISOString()
        }),
      });

      let replyText = fallbackReply;
      if (response.ok) {
        const data = await response.json().catch(() => null);
        replyText = data?.output || data?.text || data?.reply || data?.message || fallbackReply;
      }
      setMessages(prev => [...prev, { sender: 'agent', text: replyText, time: now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'agent', text: fallbackReply, time: now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const statusLabel = pick('مساعد ذكي متصل', 'Assistant IA en ligne', 'AI agent online');

  return (
    <div className="chatWidget">
      <button
        className={`chatBubble${open ? ' open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open AI Agent Chat'}
        aria-expanded={open}
      >
        {open ? <X size={24} /> : <Bot size={26} />}
      </button>

      {open && (
        <div className="chatPanel" role="dialog" aria-label={t.chatTitle}>
          <header className="chatPanel-header">
            <div className="chatPanel-id">
              <span className="chatPanel-avatar"><Bot size={20} /></span>
              <div className="chatPanel-titles">
                <b>{t.chatTitle}</b>
                <span className="chatPanel-status"><i className="statusDot" /> {statusLabel}</span>
              </div>
            </div>
            <div className="chatPanel-actions">
              <button type="button" onClick={handleReset} title="Reset" aria-label="Reset conversation">
                <RefreshCw size={16} />
              </button>
              <button type="button" onClick={() => setOpen(false)} title="Close" aria-label="Close chat">
                <X size={18} />
              </button>
            </div>
          </header>

          <div className="chatPanel-body">
            {messages.map((m, idx) => (
              <div key={idx} className={`chatRow ${m.sender}`}>
                {m.sender === 'agent' && <span className="chatRow-avatar"><Bot size={15} /></span>}
                <div className="chatBubbleMsg">
                  <p>{m.text}</p>
                  <span className="chatTime">{m.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chatRow agent">
                <span className="chatRow-avatar"><Bot size={15} /></span>
                <div className="chatBubbleMsg typing" aria-label={typingLabel}>
                  <span className="typingDots"><i /><i /><i /></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chatQuickRow">
            {quickPrompts.map((qp, i) => (
              <button key={i} className="chatQuickBtn" onClick={() => handleSend(qp)}>
                {qp}
              </button>
            ))}
          </div>

          <form className="chatInputBar" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <input
              ref={inputRef}
              className="chatInput"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              placeholder={t.chatMsg}
              aria-label={t.chatMsg}
            />
            <button type="submit" className="chatSendBtn" aria-label={t.chatSend} disabled={!inputMsg.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function Page({ titleKey, labelKey, leadKey, children }) {
  const { t } = useLang();
  useScrollReveal();
  return (
    <main>
      <section className="pageHero">
        <span className="reveal">{t[labelKey]}</span>
        <h1 className="reveal">{t[titleKey]}</h1>
        <p className="reveal">{t[leadKey]}</p>
      </section>
      <section className="pageSection">{children}</section>
    </main>
  );
}

function Toast({ msg, type, show }) {
  return (
    <div className={`toast ${type} ${show ? 'show' : ''}`} aria-live="polite">
      {type === 'success' ? <CheckCheck size={18} /> : <AlertCircle size={18} />}
      {msg}
    </div>
  );
}

function ImpactCard({ number, suffix = '', labelKey, icon: Icon, delay }) {
  const ref = React.useRef(null);
  const [active, setActive] = React.useState(false);
  const { t } = useLang();
  const count = useCountUp(number, active);

  React.useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`impactCard reveal stagger-${delay}`} ref={ref}>
      <div className="ic-icon"><Icon size={24} /></div>
      <span className="ic-number">{active ? count : 0}{suffix}</span>
      <span className="ic-label">{t[labelKey]}</span>
    </div>
  );
}

/* ============================================================
   HOME PAGE
   ============================================================ */
function HomePage() {
  const { t, lang } = useLang();
  useScrollReveal();

  return (
    <main>
      <section className="megaHero">
        <video className="heroVideo" src={withBase('/Looping_Video.mp4')} autoPlay loop muted playsInline preload="metadata" aria-hidden="true" />
        <div className="videoVeil" />

        <div className="megaContent">
          <div className="heroBadge">
            <Sparkles size={14} />
            {t.statFounded} — {t.brand}
          </div>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroSub}</p>
          <div className="heroActions">
            <Link className="btn primary" to="/contact">
              {t.ctaPartner} <ArrowUpRight size={18} />
            </Link>
            <Link className="btn glass" to="/news">
              {t.ctaNews} <Newspaper size={18} />
            </Link>
          </div>
          <div className="heroStats">
            <div><b>2014</b><span>{t.statFoundedLabel}</span></div>
            <div><b>{Math.floor(pageInfo.followers / 1000)}K+</b><span>{t.statFollowers}</span></div>
            <div><b>{newsPosts.length}+</b><span>{t.statPosts}</span></div>
            <div><b>4</b><span>{t.statPillars}</span></div>
          </div>
        </div>

        <div className="heroShowcase">
          <div className="photoOrbit">
            <div className="orbitRing">
              {featured.slice(0, 6).map((p, i) => (
                <span className="orbitItem" style={{ '--i': i }} key={p.id}>
                  <img
                    src={p.image}
                    alt=""
                    loading="lazy"
                    onError={(e) => { const it = e.currentTarget.closest('.orbitItem'); if (it) it.style.display = 'none'; }}
                  />
                </span>
              ))}
            </div>
          </div>
          <img className="logoPlate" src={withBase('/LOGO.jpg')} alt="Insaf Sétif" />
        </div>
      </section>

      <section className="impactCounters">
        <div className="impactGrid">
          <ImpactCard number={500}  suffix="+" labelKey="impactBenef"    icon={Users}        delay={1} />
          <ImpactCard number={12}             labelKey="impactPartners"   icon={HeartHandshake} delay={2} />
          <ImpactCard number={10}             labelKey="impactYears"      icon={CalendarDays} delay={3} />
          <ImpactCard number={4}              labelKey="impactPrograms"   icon={Target}       delay={4} />
        </div>
      </section>

      <section className="homeIntro pageSection">
        <div className="sectionIntro reveal">
          <span>{t.overviewLabel}</span>
          <h2>{t.overviewTitle}</h2>
          <p>{t.overviewText}</p>
        </div>
        <div className="quickCards">
          {[
            { to: '/about',        icon: <Home size={22} />,      titleKey: 'navAbout',        descAr: 'التاريخ، الرسالة، الرؤية والقيم والتسلسل الزمني 3D', descFr: 'Histoire, vision et chronologie 3D', descEn: 'History, vision and 3D timeline' },
            { to: '/goals',        icon: <Target size={22} />,    titleKey: 'navGoals',        descAr: 'البيئة التفاعلية ثلاثية الأبعاد والأهداف', descFr: 'Écosystème 3D et objectifs', descEn: '3D Ecosystem & core goals' },
            { to: '/achievements', icon: <Award size={22} />,     titleKey: 'navAchievements', descAr: 'أثر حقيقي مستند إلى النشاطات والصور', descFr: 'Impact réel à partir d\'activités et d\'images', descEn: 'Real impact from activities' },
            { to: '/news',         icon: <Newspaper size={22} />, titleKey: 'navNews',         descAr: 'أرشيف قابل للبحث بعناوين جذابة', descFr: 'Archive consultable avec titres percutants', descEn: 'Searchable archive with headline cards' },
          ].map(({ to, icon, titleKey, descAr, descFr, descEn }, i) => {
            const desc = lang === 'fr' ? descFr : lang === 'en' ? descEn : descAr;
            return (
              <Link key={to} to={to} className={`quickCard reveal stagger-${i + 1}`}>
                <div className="quickCard-icon">{icon}</div>
                <h3>{t[titleKey]}</h3>
                <p>{desc}</p>
                <ArrowRight className="quickArrow" size={20} />
              </Link>
            );
          })}
        </div>
      </section>

      <GalleryStrip />
      <PartnersRow />
    </main>
  );
}

function GalleryStrip() {
  const { t } = useLang();
  const [lightbox, setLightbox] = React.useState(null);

  const closeOnKey = React.useCallback((e) => {
    if (e.key === 'Escape') setLightbox(null);
    if (e.key === 'ArrowLeft')  setLightbox(i => i > 0 ? i - 1 : galleryImages.length - 1);
    if (e.key === 'ArrowRight') setLightbox(i => i < galleryImages.length - 1 ? i + 1 : 0);
  }, []);

  React.useEffect(() => {
    if (lightbox !== null) window.addEventListener('keydown', closeOnKey);
    return () => window.removeEventListener('keydown', closeOnKey);
  }, [lightbox, closeOnKey]);

  return (
    <>
      <section className="galleryStrip">
        <div className="sectionIntro reveal">
          <span>{t.galleryTitle}</span>
          <h2>{t.galleryTitle}</h2>
          <p>{t.galleryLead}</p>
        </div>
        <div className="galleryMasonry">
          {galleryImages.map((g, i) => (
            <img
              key={i}
              src={g.img}
              alt={g.title || ''}
              loading="lazy"
              decoding="async"
              onClick={() => setLightbox(i)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      </section>

      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img
            src={galleryImages[lightbox]?.img}
            alt={galleryImages[lightbox]?.title || ''}
            onClick={e => e.stopPropagation()}
          />
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close"><X size={20} /></button>
          <button className="lightbox-nav lightbox-prev" onClick={e => { e.stopPropagation(); setLightbox(i => i > 0 ? i - 1 : galleryImages.length - 1); }} aria-label="Previous"><ChevronLeft size={24} /></button>
          <button className="lightbox-nav lightbox-next" onClick={e => { e.stopPropagation(); setLightbox(i => i < galleryImages.length - 1 ? i + 1 : 0); }} aria-label="Next"><ChevronRight size={24} /></button>
        </div>
      )}
    </>
  );
}

function PartnersRow() {
  const { t, lang } = useLang();
  const doubled = [...partners, ...partners];
  return (
    <section className="partnersRow">
      <div className="sectionIntro reveal" style={{ marginBottom: '1.5rem' }}>
        <span>{t.partnersTitle}</span>
        <h2>{t.partnersTitle}</h2>
        <p>{t.partnersLead}</p>
      </div>
      <div className="partnersTicker">
        <div className="partnersTrack" aria-hidden="true">
          {doubled.map((p, i) => (
            <div key={i} className="partnerItem">
              <p.Icon size={16} />
              {lang === 'ar' ? p.nameAr : p.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ABOUT PAGE (With Native 3D Timeline Header)
   ============================================================ */
function AboutPage() {
  const { t } = useLang();
  useScrollReveal();
  return (
    <Page titleKey="navAbout" labelKey="labelAbout" leadKey="leadAbout">
      {/* 3D Native Timeline Canvas */}
      <Timeline3DSection />

      <div className="splitGrid mt-12">
        <div className="richText reveal-left">
          <h2>{t.missionTitle}</h2>
          <p>{t.missionText}</p>
          <h2>{t.visionTitle}</h2>
          <p>{t.visionText}</p>
        </div>
        <div className="portraitCard reveal-right">
          <img src={aboutImage} alt="" loading="lazy" />
          <div className="portraitMeta">
            <b>{t.brand}</b>
            <span>{t.statFounded}</span>
          </div>
        </div>
      </div>

      <div className="sectionIntro reveal" style={{ marginTop: '3rem' }}>
        <span>{t.valuesTitle}</span>
        <h2>{t.valuesTitle}</h2>
      </div>
      <div className="valuesGrid">
        {t.valuesItems.map((v, i) => (
          <div key={v} className={`reveal stagger-${(i % 6) + 1}`}>
            <CheckCircle2 size={22} />
            <span>{v}</span>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* ============================================================
   GOALS PAGE (With Native 3D Ecosystem Section)
   ============================================================ */
function GoalsPage() {
  const { t, lang } = useLang();
  useScrollReveal();
  return (
    <Page titleKey="navGoals" labelKey="labelGoals" leadKey="leadGoals">
      {/* Native 3D Ecosystem Canvas */}
      <Ecosystem3DSection />

      <div className="goalWall mt-12">
        {goals.map((g, i) => (
          <article key={g.ar} className={`goalCard card-hover-zoom reveal stagger-${(i % 5) + 1}`}>
            <div className="goalIcon"><g.Icon size={20} /></div>
            <span className="goalNum">0{i + 1}</span>
            <h2>{lang === 'fr' ? g.fr : lang === 'en' ? g.en : g.ar}</h2>
            <p>{g.text}</p>
          </article>
        ))}
      </div>
    </Page>
  );
}

function ProgramsPage() {
  const { t, lang } = useLang();
  useScrollReveal();
  return (
    <Page titleKey="navPrograms" labelKey="labelPrograms" leadKey="leadPrograms">
      <div className="programPageGrid">
        {programs.map(({ ar, fr, en, text, Icon, color }, i) => (
          <div key={ar} className={`programTile card-hover-zoom ${color} reveal stagger-${(i % 4) + 1}`}>
            <div className="programTile-icon"><Icon size={28} /></div>
            <h2>{lang === 'fr' ? fr : lang === 'en' ? en : ar}</h2>
            <p>{text}</p>
            <div className="programLearnMore">
              <Link to="/contact">{t.ctaPartner}</Link> <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>
      <GalleryStrip />
    </Page>
  );
}

/* ============================================================
   ACHIEVEMENTS PAGE (Headline First & Zoom-out Hover Effects)
   ============================================================ */
function AchievementsPage() {
  const { t } = useLang();
  useScrollReveal();
  return (
    <Page titleKey="navAchievements" labelKey="labelAchievements" leadKey="leadAchievements">
      <div className="achievementGrid">
        {resolvedAchievementPosts.map((p, i) => (
          <article key={p.id} className={`achievementCard card-hover-zoom reveal stagger-${(i % 3) + 1}`}>
            <div className="media">
              {p.image && <img src={p.image} alt="" loading="lazy" decoding="async" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />}
            </div>
            <div className="body">
              <span className="pill"><Award size={12} /> {p.category || 'إنجاز'}</span>
              <h3>{p.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </Page>
  );
}

/* ============================================================
   NEWS PAGE (Headline Focus & Dynamic Zoom Hover Cards)
   ============================================================ */
function NewsPage() {
  const { t, lang } = useLang();
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('All');
  const [count, setCount] = React.useState(18);
  const [loading, setLoading] = React.useState(false);
  useScrollReveal();

  const filtered = React.useMemo(() =>
    resolvedNewsPosts.filter(p =>
      (cat === 'All' || p.category === cat) &&
      (!q.trim() || clean(`${p.title || ''} ${p.text || ''}`).toLowerCase().includes(q.toLowerCase()))
    ), [q, cat]);

  const locale = lang === 'fr' ? 'fr-DZ' : lang === 'en' ? 'en-US' : 'ar-DZ';

  const handleShowMore = () => {
    setLoading(true);
    setTimeout(() => { setCount(c => c + 18); setLoading(false); }, 300);
  };

  return (
    <Page titleKey="navNews" labelKey="labelNews" leadKey="leadNews">
      <div className="newsToolbar">
        <div className="newsSearchWrap">
          <Search size={16} />
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setCount(18); }}
            placeholder={t.searchNews}
          />
          {q && (
            <button className="newsSearchClear" onClick={() => setQ('')} aria-label="Clear">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="newsFilterBtns">
          {categories().map(c => (
            <button
              key={c}
              className={cat === c ? 'active' : ''}
              onClick={() => { setCat(c); setCount(18); }}
            >
              {c === 'All' ? t.all : c}
            </button>
          ))}
        </div>
      </div>

      <div className="newsGrid">
        {filtered.slice(0, count).map((p, idx) => {
          const headline = clean(p.title || p.text).slice(0, 90) + (clean(p.title || p.text).length > 90 ? '...' : '');
          return (
            <article key={p.id} className={`newsCard card-hover-zoom reveal stagger-${(idx % 3) + 1}`}>
              <div className="newsImg-wrap">
                {p.image
                  ? <img className="newsImg" src={p.image} alt="" loading="lazy" decoding="async" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div class="imgFallback"></div>'; }} />
                  : <div className="imgFallback"><Newspaper size={32} /></div>
                }
              </div>
              <div className="newsCardBody">
                <div className="newsCardMeta">
                  <span className="pill">{p.category}</span>
                  <time>{dateFmt(p.date, locale)}</time>
                </div>
                <h3>{headline}</h3>
                <div className="engage">
                  <span className="engageBadge"><Heart size={11} /> {p.likes}</span>
                  <span className="engageBadge"><MessageSquare size={11} /> {p.comments}</span>
                  <span className="engageBadge"><Share2 size={11} /> {p.shares}</span>
                </div>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noreferrer" className="newsReadMore">
                    {t.readMore} <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem 0' }}>{t.noPosts}</p>
      )}

      {count < filtered.length && (
        <button
          className="btn secondary centered"
          onClick={handleShowMore}
          disabled={loading}
        >
          {loading ? '...' : t.showMore}
        </button>
      )}
    </Page>
  );
}

/* ============================================================
   CONTACT PAGE (Connected to Workflow Payload Schema)
   ============================================================ */
function ContactPage() {
  const { t, lang } = useLang();
  const [errors, setErrors] = React.useState({});
  const [toast, setToast] = React.useState({ show: false, type: 'success', msg: '' });
  const [sending, setSending] = React.useState(false);
  useScrollReveal();

  const showToast = (type, msg) => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast(v => ({ ...v, show: false })), 4000);
  };

  const validate = (data) => {
    const err = {};
    if (!data.name?.trim()) err.name = t.formErrName;
    if (!data.email?.match(/^[^@]+@[^@]+\.[^@]+$/)) err.email = t.formErrEmail;
    if (!data.message?.trim()) err.message = t.formErrMsg;
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd);

    // Honeypot: real users never fill this hidden field — treat as spam, fail silently
    if (data.company_website) { form.reset(); showToast('success', t.formSuccess); return; }
    delete data.company_website;

    const err = validate(data);
    if (Object.keys(err).length) { setErrors(err); return; }
    setErrors({});
    setSending(true);
    try {
      const res = await fetch(CONTACT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          language: lang,
          source: 'website_contact_form',
          submittedAt: new Date().toISOString()
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('success', t.formSuccess);
      form.reset();
    } catch {
      showToast('error', t.formError);
    } finally {
      setSending(false);
    }
  };

  return (
    <Page titleKey="navContact" labelKey="labelContact" leadKey="leadContact">
      <div className="contactPage">
        <div className="contactPanel reveal-left">
          <h2>{t.contactTitle}</h2>
          <div className="contactInfo">
            <a className="contactInfoItem" href={contact.facebook} target="_blank" rel="noreferrer">
              <span className="contactIconBox"><FacebookIcon size={18} /></span>
              /insaf.association.setif
            </a>
            <a className="contactInfoItem" href={`mailto:${contact.email}`}>
              <span className="contactIconBox"><Mail size={18} /></span>
              {contact.email}
            </a>
            <a className="contactInfoItem" href={`tel:${contact.phone}`}>
              <span className="contactIconBox"><Phone size={18} /></span>
              <PhoneDisplay number={contact.telDisplay} />
            </a>
            <div className="contactInfoItem">
              <span className="contactIconBox"><MapPin size={18} /></span>
              {contact.address}
            </div>
          </div>
        </div>

        <form className="contactForm reveal-right" onSubmit={handleSubmit} noValidate>
          {/* Honeypot — hidden from users, catches bots */}
          <input
            type="text"
            name="company_website"
            className="hp-field"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
          />
          <div className="formField">
            <label htmlFor="cf-name">{t.formName}</label>
            <input id="cf-name" name="name" className={errors.name ? 'error' : ''} placeholder={t.formName} />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>
          <div className="formField">
            <label htmlFor="cf-org">{t.formOrg}</label>
            <input id="cf-org" name="org" placeholder={t.formOrg} />
          </div>
          <div className="formField">
            <label htmlFor="cf-email">{t.formEmail}</label>
            <input id="cf-email" name="email" type="email" className={errors.email ? 'error' : ''} placeholder={t.formEmail} />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>
          <div className="formField">
            <label htmlFor="cf-msg">{t.formMsg}</label>
            <textarea id="cf-msg" name="message" rows="7" className={errors.message ? 'error' : ''} placeholder={t.formMsg} />
            {errors.message && <span className="error-msg">{errors.message}</span>}
          </div>
          <button className="btn primary" type="submit" disabled={sending}>
            {sending ? '...' : t.formSend}
          </button>
        </form>
      </div>
      <Toast msg={toast.msg} type={toast.type} show={toast.show} />
    </Page>
  );
}

function NotFound() {
  const { t } = useLang();
  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '70vh', textAlign: 'center', padding: '4rem 1rem' }}>
      <div>
        <div style={{ fontSize: '6rem', fontWeight: 900, lineHeight: 1, color: 'var(--blue)', opacity: 0.18 }}>404</div>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: '1rem' }}>{t.notFoundText}</h1>
        <Link to="/" className="btn primary">{t.notFoundBtn}</Link>
      </div>
    </main>
  );
}

function App() {
  return (
    <HashRouter>
      <LangProvider>
        <SiteShell>
          <Routes>
            <Route path="/"              element={<HomePage />} />
            <Route path="/about"         element={<AboutPage />} />
            <Route path="/goals"         element={<GoalsPage />} />
            <Route path="/programs"      element={<ProgramsPage />} />
            <Route path="/achievements"  element={<AchievementsPage />} />
            <Route path="/news"          element={<NewsPage />} />
            <Route path="/contact"       element={<ContactPage />} />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </SiteShell>
      </LangProvider>
    </HashRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
