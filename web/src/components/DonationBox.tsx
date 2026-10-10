import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Check, CircleAlert, CircleCheck, Copy, CreditCard, Globe, HandHeart, LoaderCircle, Lock, ShieldCheck } from 'lucide-react';
import {
  CHARGILY_CHECKOUT_WEBHOOK, CHARGILY_HOST_PATTERN, CHARGILY_TEST_MODE, DESIGNATIONS, DONATION_LIMITS,
  INTERNATIONAL_BANK, PRESET_AMOUNTS, type DesignationId,
} from '@/data/donation';
import { cn } from '@/lib/utils';

// All Algerian payments go through Chargily (it settles to the association's RIP), so the
// manual BaridiMob / CCP transfer tabs of the legacy site are not offered.
const TABS = [
  { id: 'card', Icon: CreditCard },
  { id: 'international', Icon: Globe },
] as const;
type TabId = (typeof TABS)[number]['id'];

const CARD_METHODS = ['edahabia', 'cib'] as const;
type Method = (typeof CARD_METHODS)[number];
const DEFAULT_AMOUNT = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface DonationCopy {
  donateBoxTitle: string;
  donateBoxSub: string;
  donateTestMode: string;
  donateMethodsLabel: string;
  donateTabs: Record<TabId, { label: string; hint: string; title: string }>;
  donateAmountLegend: string;
  donateCustomLabel: string;
  donateCustomPlaceholder: string;
  donateDesignationLabel: string;
  designations: Record<DesignationId, { label: string; unitLabel?: string }>;
  donateCardLegend: string;
  donateMethods: Record<Method, string>;
  donateYourGift: string;
  donateEnterAmount: string;
  impactGeneral: string;
  impactCovers: string;
  impactTopUp: string;
  donateNameLabel: string;
  donateEmailLabel: string;
  optional: string;
  donatePay: string;
  donateRedirecting: string;
  donateErrAmount: string;
  donateErrEmail: string;
  donateErrGeneric: string;
  donateSecureNote: string;
  donateCopy: string;
  donateCopied: string;
  intlHolder: string;
  intlBank: string;
  intlSortCode: string;
  donateNote: string;
  donateStatus: Record<'success' | 'failure', { title: string; text: string }>;
  receiptHint: string;
}

interface Props {
  lang: 'ar' | 'fr' | 'en';
  t: DonationCopy;
}

function formatDA(amount: number, lang: Props['lang']) {
  const n = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(amount)).replace(/ | /g, ' ');
  return lang === 'ar' ? `${n} دج` : `${n} DA`;
}

function toValidAmount(value: unknown) {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n >= DONATION_LIMITS.min && n <= DONATION_LIMITS.max ? n : null;
}

function impactLine(t: DonationCopy, lang: Props['lang'], amount: number, id: DesignationId) {
  const unit = DESIGNATIONS.find((d) => d.id === id)?.unit;
  const item = t.designations[id]?.unitLabel;
  if (!unit || !item) return t.impactGeneral;
  if (amount >= unit) return t.impactCovers.replace('{n}', String(Math.floor(amount / unit))).replace('{item}', item);
  return t.impactTopUp
    .replace('{pct}', String(Math.round((amount / unit) * 100)))
    .replace('{item}', item)
    .replace('{missing}', formatDA(unit - amount, lang));
}

function useClipboard() {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async (value: string, key: string) => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      // Clipboard API is unavailable on some older mobile browsers / insecure contexts.
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
    }
    if (!ok) return;
    setCopied(key);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 2200);
  };
  return [copied, copy] as const;
}

const inputCls = 'w-full rounded-lg border border-sand bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-900';
const labelCls = 'mt-4 block text-sm font-semibold text-ink';

export default function DonationBox({ lang, t }: Props) {
  const uid = useId();
  const rtl = lang === 'ar';
  const [tab, setTab] = useState<TabId>('card');
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [customText, setCustomText] = useState('');
  const [designation, setDesignation] = useState<DesignationId>('general');
  const [method, setMethod] = useState<Method>('edahabia');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [returnStatus, setReturnStatus] = useState<'success' | 'failure' | null>(null);
  const [copied, copy] = useClipboard();
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});

  // Read ?amount= &designation= (from CTAs) and ?donation= (the Chargily return) once.
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const start = toValidAmount(q.get('amount'));
    if (start) {
      setAmount(start);
      if (!(PRESET_AMOUNTS as readonly number[]).includes(start)) setCustomText(String(start));
    }
    const d = q.get('designation') ?? q.get('campaign');
    if (DESIGNATIONS.some((x) => x.id === d)) setDesignation(d as DesignationId);
    const status = q.get('donation');
    if (status === 'success' || status === 'failure') {
      setReturnStatus(status);
      // Drop it from the URL so a refresh or a shared link doesn't replay the banner.
      q.delete('donation');
      history.replaceState(history.state, '', location.pathname + (q.toString() ? `?${q}` : ''));
    }
    // Returning with the Back button restores this page from bfcache still "submitting".
    const onPageShow = (e: PageTransitionEvent) => { if (e.persisted) setSubmitting(false); };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  const valid = toValidAmount(amount) !== null;
  const amountLabel = valid ? formatDA(amount, lang) : '';

  const onTabKeyDown = (e: KeyboardEvent, index: number) => {
    const next = rtl ? 'ArrowLeft' : 'ArrowRight';
    const prev = rtl ? 'ArrowRight' : 'ArrowLeft';
    let target: number | null = null;
    if (e.key === next) target = (index + 1) % TABS.length;
    else if (e.key === prev) target = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') target = 0;
    else if (e.key === 'End') target = TABS.length - 1;
    if (target === null) return;
    e.preventDefault();
    const id = TABS[target].id;
    setTab(id);
    tabRefs.current[id]?.focus();
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!valid) {
      setError(t.donateErrAmount.replace('{min}', formatDA(DONATION_LIMITS.min, lang)).replace('{max}', formatDA(DONATION_LIMITS.max, lang)));
      return;
    }
    if (email && !EMAIL_RE.test(email.trim())) {
      setError(t.donateErrEmail);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(CHARGILY_CHECKOUT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, method, campaign: designation, lang, name: name.trim(), email: email.trim(), website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.checkout_url) throw new Error(data.error || `HTTP ${res.status}`);
      const url = new URL(data.checkout_url);
      if (url.protocol !== 'https:' || !CHARGILY_HOST_PATTERN.test(url.hostname)) throw new Error('unexpected_checkout_host');
      window.location.assign(url.href);
    } catch {
      setSubmitting(false);
      setError(t.donateErrGeneric);
    }
  };

  const tabId = (k: TabId) => `${uid}-tab-${k}`;
  const panelId = (k: TabId) => `${uid}-panel-${k}`;
  const bankRows: [string, string, string][] = [
    [t.intlHolder, INTERNATIONAL_BANK.holder, 'holder'],
    ['IBAN', INTERNATIONAL_BANK.iban, 'iban'],
    ['SWIFT / BIC', INTERNATIONAL_BANK.swift, 'swift'],
    [t.intlBank, INTERNATIONAL_BANK.bank, 'bank'],
    [t.intlSortCode, INTERNATIONAL_BANK.sortCode, 'sort'],
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-sand bg-white shadow-lift" aria-labelledby={`${uid}-title`}>
      <header className="bg-zellige-light flex items-center gap-4 bg-emerald-900 p-5 text-white sm:p-6">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-accent" aria-hidden="true">
          <HandHeart className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`${uid}-title`} className="text-xl text-white sm:text-2xl">{t.donateBoxTitle}</h2>
          <p className="text-sm text-emerald-50/85">{t.donateBoxSub}</p>
        </div>
        {CHARGILY_TEST_MODE && <span className="rounded-full bg-amber-accent px-3 py-1 text-xs font-bold text-ink">{t.donateTestMode}</span>}
      </header>

      {returnStatus && (
        <div
          role="status"
          className={cn(
            'm-5 flex items-start gap-3 rounded-xl p-4 sm:m-6',
            returnStatus === 'success' ? 'bg-emerald-50 text-emerald-900' : 'bg-flag-red/10 text-flag-red',
          )}
        >
          {returnStatus === 'success' ? <CircleCheck className="size-6 shrink-0" aria-hidden="true" /> : <CircleAlert className="size-6 shrink-0" aria-hidden="true" />}
          <div>
            <strong>{t.donateStatus[returnStatus].title}</strong>
            <p className="text-sm text-ink">{t.donateStatus[returnStatus].text}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 border-b border-sand p-3 sm:p-4" role="tablist" aria-label={t.donateMethodsLabel}>
        {TABS.map(({ id, Icon }, i) => (
          <button
            key={id}
            ref={(el) => { tabRefs.current[id] = el; }}
            type="button"
            role="tab"
            id={tabId(id)}
            aria-selected={tab === id}
            aria-controls={panelId(id)}
            tabIndex={tab === id ? 0 : -1}
            onClick={() => setTab(id)}
            onKeyDown={(e) => onTabKeyDown(e, i)}
            className={cn(
              'flex flex-col items-start gap-0.5 rounded-xl border p-3 text-start transition-colors',
              tab === id ? 'border-emerald-900 bg-emerald-50' : 'border-sand hover:bg-cream',
            )}
          >
            <span className="flex items-center gap-2 text-sm font-bold text-emerald-900">
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {t.donateTabs[id].label}
            </span>
            <span className="text-xs text-muted">{t.donateTabs[id].hint}</span>
          </button>
        ))}
      </div>

      {/* Edahabia / CIB via Chargily */}
      <div role="tabpanel" id={panelId('card')} aria-labelledby={tabId('card')} hidden={tab !== 'card'}>
        <form onSubmit={submit} noValidate className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <fieldset>
              <legend className="text-sm font-semibold text-ink">{t.donateAmountLegend}</legend>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5" role="radiogroup" aria-label={t.donateAmountLegend}>
                {PRESET_AMOUNTS.map((value) => {
                  const selected = amount === value && !customText;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => { setAmount(value); setCustomText(''); setError(''); }}
                      className={cn(
                        'tabular rounded-lg border px-2 py-2.5 text-sm font-bold transition-colors',
                        selected ? 'border-donate bg-donate text-white' : 'border-sand bg-white text-ink hover:border-donate',
                      )}
                    >
                      {formatDA(value, lang)}
                    </button>
                  );
                })}
              </div>
              <label className={labelCls} htmlFor={`${uid}-custom`}>{t.donateCustomLabel}</label>
              <div className="mt-1 flex items-center rounded-lg border border-sand bg-white focus-within:ring-2 focus-within:ring-emerald-900">
                <input
                  id={`${uid}-custom`}
                  className="tabular w-full min-w-0 bg-transparent px-3 py-2.5 outline-none"
                  inputMode="numeric"
                  autoComplete="off"
                  value={customText}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/[^\d]/g, '').slice(0, 7);
                    setCustomText(digits);
                    setAmount(digits ? Number(digits) : 0);
                    setError('');
                  }}
                  placeholder={t.donateCustomPlaceholder}
                  dir="ltr"
                />
                <span className="px-3 text-sm font-bold text-muted" aria-hidden="true">{rtl ? 'دج' : 'DA'}</span>
              </div>
            </fieldset>

            <label className={labelCls} htmlFor={`${uid}-designation`}>{t.donateDesignationLabel}</label>
            <select id={`${uid}-designation`} className={cn('mt-1', inputCls)} value={designation} onChange={(e) => setDesignation(e.target.value as DesignationId)}>
              {DESIGNATIONS.map((d) => <option key={d.id} value={d.id}>{t.designations[d.id].label}</option>)}
            </select>

            <fieldset className="mt-4">
              <legend className="text-sm font-semibold text-ink">{t.donateCardLegend}</legend>
              <div className="mt-2 grid gap-2" role="radiogroup" aria-label={t.donateCardLegend}>
                {CARD_METHODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={method === m}
                    onClick={() => setMethod(m)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-3 text-start text-sm transition-colors',
                      method === m ? 'border-emerald-900 bg-emerald-50 font-semibold' : 'border-sand hover:bg-cream',
                    )}
                  >
                    <span
                      className={cn('w-20 shrink-0 rounded px-1.5 py-1 text-center text-[10px] font-extrabold tracking-wide text-white', m === 'cib' ? 'bg-[#1d4f91]' : 'bg-[#b8860b]')}
                      aria-hidden="true"
                      dir="ltr"
                    >
                      {m === 'cib' ? 'CIB' : 'EDAHABIA'}
                    </span>
                    <span>{t.donateMethods[m]}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="rounded-xl bg-cream p-5">
            <p className="text-sm font-semibold text-muted">{t.donateYourGift}</p>
            <p className="tabular mt-1 font-sans text-4xl font-extrabold text-emerald-900">{valid ? amountLabel : '—'}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{valid ? impactLine(t, lang, amount, designation) : t.donateEnterAmount}</p>

            <label className={labelCls} htmlFor={`${uid}-name`}>
              {t.donateNameLabel} <span className="font-normal text-muted">({t.optional})</span>
            </label>
            <input id={`${uid}-name`} className={cn('mt-1', inputCls)} value={name} maxLength={80} autoComplete="name" onChange={(e) => setName(e.target.value)} />

            <label className={labelCls} htmlFor={`${uid}-email`}>
              {t.donateEmailLabel} <span className="font-normal text-muted">({t.optional})</span>
            </label>
            <input
              id={`${uid}-email`}
              className={cn('mt-1', inputCls)}
              type="email"
              value={email}
              maxLength={120}
              autoComplete="email"
              dir="ltr"
              aria-describedby={`${uid}-email-hint`}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
            />
            <p id={`${uid}-email-hint`} className="mt-1 text-xs text-muted">{t.receiptHint}</p>

            {/* Honeypot: invisible to people, filled by bots */}
            <input
              className="absolute -start-[9999px] size-px opacity-0"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-donate px-4 py-3.5 font-bold text-white shadow-float transition-colors hover:bg-donate-hover disabled:opacity-70"
            >
              {submitting ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <Lock className="size-5" aria-hidden="true" />}
              {submitting ? t.donateRedirecting : t.donatePay.replace('{amount}', amountLabel)}
            </button>
            <p className="mt-2 min-h-5 text-sm font-semibold text-flag-red" aria-live="polite">{error}</p>
            <p className="flex items-start gap-2 text-xs text-muted">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              {t.donateSecureNote}
            </p>
          </div>
        </form>
      </div>

      {/* International transfer */}
      <div role="tabpanel" id={panelId('international')} aria-labelledby={tabId('international')} hidden={tab !== 'international'} className="p-5 sm:p-6">
        <h3 className="text-lg">{t.donateTabs.international.title}</h3>
        <dl className="mt-4 divide-y divide-sand rounded-xl border border-sand">
          {bankRows.map(([label, value, key]) => (
            <div key={key} className="flex flex-wrap items-center gap-x-3 gap-y-1 p-3">
              <dt className="w-32 shrink-0 text-xs font-semibold text-muted">{label}</dt>
              <dd className="tabular min-w-0 flex-1 break-all font-semibold" dir="ltr">{value}</dd>
              <button
                type="button"
                onClick={() => copy(value, key)}
                aria-label={`${t.donateCopy}: ${label}`}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold transition-colors',
                  copied === key ? 'border-emerald-700 bg-emerald-50 text-emerald-900' : 'border-sand hover:bg-cream',
                )}
              >
                {copied === key ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
                {copied === key ? t.donateCopied : t.donateCopy}
              </button>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-muted">{t.donateNote}</p>
      </div>
    </section>
  );
}
