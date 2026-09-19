import React from 'react';
import {
  BadgeCheck, Check, CircleAlert, CircleCheck, Clock, Copy, CreditCard, Globe,
  HandHeart, Landmark, LoaderCircle, Lock, QrCode, ShieldCheck, Smartphone,
} from 'lucide-react';
import { useLang } from '../lib/lang.js';
import { formatDA } from '../lib/format.js';
import { withBase } from '../lib/assets.js';
import {
  CHARGILY_CHECKOUT_WEBHOOK, CHARGILY_HOST_PATTERN, CHARGILY_TEST_MODE, DESIGNATIONS,
  DONATION_LIMITS, INTERNATIONAL_BANK, LOCAL_RAILS, PRESET_AMOUNTS,
} from '../config/donation.js';
import styles from './LocalDonationBox.module.css';

const TABS = [
  { id: 'card', Icon: CreditCard },
  { id: 'baridimob', Icon: Smartphone },
  { id: 'ccp', Icon: Landmark },
  { id: 'international', Icon: Globe },
];

const CARD_METHODS = ['edahabia', 'cib'];
const DEFAULT_AMOUNT = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function toValidAmount(value) {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n >= DONATION_LIMITS.min && n <= DONATION_LIMITS.max ? n : null;
}

function impactLine(t, lang, amount, designationId) {
  const unit = DESIGNATIONS.find((d) => d.id === designationId)?.unit;
  const item = t.designations?.[designationId]?.unitLabel;
  if (!unit || !item) return t.impactGeneral;
  if (amount >= unit) {
    return t.impactCovers.replace('{n}', Math.floor(amount / unit)).replace('{item}', item);
  }
  return t.impactTopUp
    .replace('{pct}', Math.round((amount / unit) * 100))
    .replace('{item}', item)
    .replace('{missing}', formatDA(unit - amount, lang));
}

function useClipboard() {
  const [copied, setCopied] = React.useState(null);
  const timer = React.useRef();
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const copy = React.useCallback(async (value, key) => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      // Clipboard API is unavailable on some older mobile browsers / insecure contexts.
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
    }
    if (!ok) return;
    setCopied(key);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 2200);
  }, []);

  return [copied, copy];
}

function CopyRow({ label, value, copyKey, copied, onCopy, t }) {
  const isCopied = copied === copyKey;
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue} dir="ltr">{value}</span>
      <button
        type="button"
        className={`${styles.copyBtn} ${isCopied ? styles.copied : ''}`}
        onClick={() => onCopy(value, copyKey)}
        aria-label={`${t.donateCopy}: ${label}`}
      >
        {isCopied ? <Check size={15} /> : <Copy size={15} />}
        <span>{isCopied ? t.donateCopied : t.donateCopy}</span>
      </button>
    </div>
  );
}

function PendingRow({ label, t }) {
  return (
    <div className={`${styles.row} ${styles.pendingRow}`}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue} dir="ltr" aria-hidden="true">•••• •••• •••• ••••</span>
      <span className={styles.pendingBadge}><Clock size={13} /> {t.donatePending}</span>
    </div>
  );
}

export default function LocalDonationBox({ id, initialAmount, initialDesignation, returnStatus, embedded = false }) {
  const { t, lang } = useLang();
  const uid = React.useId();
  const rtl = lang === 'ar';

  const startAmount = toValidAmount(initialAmount) ?? DEFAULT_AMOUNT;
  const [tab, setTab] = React.useState('card');
  const [amount, setAmount] = React.useState(startAmount);
  const [customText, setCustomText] = React.useState(PRESET_AMOUNTS.includes(startAmount) ? '' : String(startAmount));
  const [designation, setDesignation] = React.useState(
    DESIGNATIONS.some((d) => d.id === initialDesignation) ? initialDesignation : 'general'
  );
  const [method, setMethod] = React.useState('edahabia');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [copied, copy] = useClipboard();
  const tabRefs = React.useRef({});

  // Returning with the Back button restores this page from bfcache still "submitting".
  React.useEffect(() => {
    const onPageShow = (e) => { if (e.persisted) setSubmitting(false); };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  const valid = toValidAmount(amount) !== null;
  const amountLabel = valid ? formatDA(amount, lang) : '';

  const onTabKeyDown = (e, index) => {
    const nextKey = rtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = rtl ? 'ArrowRight' : 'ArrowLeft';
    let target = null;
    if (e.key === nextKey) target = (index + 1) % TABS.length;
    else if (e.key === prevKey) target = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') target = 0;
    else if (e.key === 'End') target = TABS.length - 1;
    if (target === null) return;
    e.preventDefault();
    const nextId = TABS[target].id;
    setTab(nextId);
    tabRefs.current[nextId]?.focus();
  };

  const choosePreset = (value) => {
    setAmount(value);
    setCustomText('');
    setError('');
  };

  const onCustomChange = (e) => {
    const digits = e.target.value.replace(/[^\d]/g, '').slice(0, 7);
    setCustomText(digits);
    setAmount(digits ? Number(digits) : 0);
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (honeypot) return;
    if (!valid) {
      setError(t.donateErrAmount
        .replace('{min}', formatDA(DONATION_LIMITS.min, lang))
        .replace('{max}', formatDA(DONATION_LIMITS.max, lang)));
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
        body: JSON.stringify({
          amount,
          method,
          campaign: designation,
          lang,
          name: name.trim(),
          email: email.trim(),
          website: honeypot,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.checkout_url) throw new Error(data.error || `HTTP ${res.status}`);

      const url = new URL(data.checkout_url);
      if (url.protocol !== 'https:' || !CHARGILY_HOST_PATTERN.test(url.hostname)) {
        throw new Error('unexpected_checkout_host');
      }
      window.location.assign(url.href);
    } catch {
      setSubmitting(false);
      setError(t.donateErrGeneric);
    }
  };

  const tabId = (key) => `${uid}-tab-${key}`;
  const panelId = (key) => `${uid}-panel-${key}`;
  const { baridimob, ccp } = LOCAL_RAILS;

  return (
    <section id={id} className={`${styles.wrap} ${embedded ? styles.embedded : ''}`} aria-labelledby={`${uid}-title`}>
      <div className={styles.box}>
        <header className={styles.head}>
          <span className={styles.headIcon} aria-hidden="true"><HandHeart size={26} /></span>
          <div className={styles.headText}>
            <h2 id={`${uid}-title`}>{t.donateBoxTitle}</h2>
            <p>{t.donateBoxSub}</p>
          </div>
          {CHARGILY_TEST_MODE && <span className={styles.testBadge}>{t.donateTestMode}</span>}
        </header>

        {returnStatus && t.donateStatus?.[returnStatus] && (
          <div className={`${styles.status} ${returnStatus === 'success' ? styles.statusOk : styles.statusFail}`} role="status">
            {returnStatus === 'success' ? <CircleCheck size={22} /> : <CircleAlert size={22} />}
            <div>
              <strong>{t.donateStatus[returnStatus].title}</strong>
              <p>{t.donateStatus[returnStatus].text}</p>
            </div>
          </div>
        )}

        <div className={styles.tabs} role="tablist" aria-label={t.donateMethodsLabel}>
          {TABS.map(({ id: key, Icon }, i) => (
            <button
              key={key}
              ref={(el) => { tabRefs.current[key] = el; }}
              type="button"
              role="tab"
              id={tabId(key)}
              aria-selected={tab === key}
              aria-controls={panelId(key)}
              tabIndex={tab === key ? 0 : -1}
              className={`${styles.tab} ${tab === key ? styles.tabActive : ''}`}
              onClick={() => setTab(key)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
            >
              <Icon size={20} aria-hidden="true" />
              <span className={styles.tabLabel}>{t.donateTabs[key].label}</span>
              <span className={styles.tabHint}>{t.donateTabs[key].hint}</span>
            </button>
          ))}
        </div>

        {/* ---------- Edahabia / CIB via Chargily ---------- */}
        <div role="tabpanel" id={panelId('card')} aria-labelledby={tabId('card')} hidden={tab !== 'card'} className={styles.panel}>
          <form className={styles.cardGrid} onSubmit={submit} noValidate>
            <div className={styles.choose}>
              <fieldset className={styles.fieldset}>
                <legend>{t.donateAmountLegend}</legend>
                <div className={styles.chips} role="radiogroup" aria-label={t.donateAmountLegend}>
                  {PRESET_AMOUNTS.map((value) => {
                    const selected = amount === value && !customText;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        className={`${styles.chip} ${selected ? styles.chipActive : ''}`}
                        onClick={() => choosePreset(value)}
                      >
                        {formatDA(value, lang)}
                      </button>
                    );
                  })}
                </div>
                <label className={styles.label} htmlFor={`${uid}-custom`}>{t.donateCustomLabel}</label>
                <div className={styles.customWrap}>
                  <input
                    id={`${uid}-custom`}
                    className={styles.input}
                    inputMode="numeric"
                    autoComplete="off"
                    value={customText}
                    onChange={onCustomChange}
                    placeholder={t.donateCustomPlaceholder}
                    dir="ltr"
                  />
                  <span className={styles.currency} aria-hidden="true">{rtl ? 'دج' : 'DA'}</span>
                </div>
              </fieldset>

              <label className={styles.label} htmlFor={`${uid}-designation`}>{t.donateDesignationLabel}</label>
              <select
                id={`${uid}-designation`}
                className={styles.select}
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              >
                {DESIGNATIONS.map((d) => (
                  <option key={d.id} value={d.id}>{t.designations[d.id].label}</option>
                ))}
              </select>

              <fieldset className={styles.fieldset}>
                <legend>{t.donateCardLegend}</legend>
                <div className={styles.methods} role="radiogroup" aria-label={t.donateCardLegend}>
                  {CARD_METHODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      role="radio"
                      aria-checked={method === m}
                      className={`${styles.method} ${method === m ? styles.methodActive : ''}`}
                      onClick={() => setMethod(m)}
                    >
                      <span className={`${styles.methodMark} ${styles[m]}`} aria-hidden="true">
                        {m === 'cib' ? 'CIB' : 'EDAHABIA'}
                      </span>
                      <span>{t.donateMethods[m]}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className={styles.summary}>
              <p className={styles.summaryLabel}>{t.donateYourGift}</p>
              <p className={styles.summaryAmount}>{valid ? amountLabel : '—'}</p>
              <p className={styles.impact}>{valid ? impactLine(t, lang, amount, designation) : t.donateEnterAmount}</p>

              <div className={styles.donor}>
                <label className={styles.label} htmlFor={`${uid}-name`}>
                  {t.donateNameLabel} <span className={styles.optional}>({t.optional})</span>
                </label>
                <input id={`${uid}-name`} className={styles.input} value={name} maxLength={80}
                  autoComplete="name" onChange={(e) => setName(e.target.value)} />

                <label className={styles.label} htmlFor={`${uid}-email`}>
                  {t.donateEmailLabel} <span className={styles.optional}>({t.optional})</span>
                </label>
                <input id={`${uid}-email`} className={styles.input} type="email" value={email} maxLength={120}
                  autoComplete="email" dir="ltr" onChange={(e) => { setEmail(e.target.value); setError(''); }} />

                {/* Honeypot — invisible to people, filled by bots */}
                <input className={styles.hp} tabIndex={-1} autoComplete="off" aria-hidden="true"
                  name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>

              <button type="submit" className={styles.payBtn} disabled={submitting}>
                {submitting
                  ? <LoaderCircle size={18} className={styles.spin} aria-hidden="true" />
                  : <Lock size={18} aria-hidden="true" />}
                {submitting ? t.donateRedirecting : t.donatePay.replace('{amount}', amountLabel)}
              </button>

              <p className={styles.error} aria-live="polite">{error}</p>
              <p className={styles.secure}><ShieldCheck size={14} aria-hidden="true" /> {t.donateSecureNote}</p>
            </div>
          </form>
        </div>

        {/* ---------- BaridiMob / BaridiPay ---------- */}
        <div role="tabpanel" id={panelId('baridimob')} aria-labelledby={tabId('baridimob')} hidden={tab !== 'baridimob'} className={styles.panel}>
          <div className={styles.railGrid}>
            <div className={styles.qr}>
              {baridimob.qrImage
                ? <img src={withBase(baridimob.qrImage)} alt={t.donateQrAlt} width="208" height="208" />
                : <div className={styles.qrPending}><QrCode size={60} aria-hidden="true" /><span>{t.donateQrPending}</span></div>}
            </div>
            <div className={styles.railText}>
              <h3>{t.donateTabs.baridimob.title}</h3>
              <ol className={styles.steps}>
                {t.baridiSteps.map((step) => <li key={step}>{step}</li>)}
              </ol>
              {baridimob.rip
                ? <CopyRow label="RIP" value={baridimob.rip} copyKey="rip" copied={copied} onCopy={copy} t={t} />
                : <PendingRow label="RIP" t={t} />}
            </div>
          </div>
        </div>

        {/* ---------- CCP ---------- */}
        <div role="tabpanel" id={panelId('ccp')} aria-labelledby={tabId('ccp')} hidden={tab !== 'ccp'} className={styles.panel}>
          <div className={styles.railText}>
            <h3>{t.donateTabs.ccp.title}</h3>
            <ol className={styles.steps}>
              {t.ccpSteps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <div className={styles.rows}>
              {ccp.account
                ? <CopyRow label={t.ccpAccountLabel} value={ccp.account} copyKey="ccp" copied={copied} onCopy={copy} t={t} />
                : <PendingRow label={t.ccpAccountLabel} t={t} />}
              {ccp.key
                ? <CopyRow label={t.ccpKeyLabel} value={ccp.key} copyKey="ccpKey" copied={copied} onCopy={copy} t={t} />
                : <PendingRow label={t.ccpKeyLabel} t={t} />}
            </div>
          </div>
        </div>

        {/* ---------- International transfer ---------- */}
        <div role="tabpanel" id={panelId('international')} aria-labelledby={tabId('international')} hidden={tab !== 'international'} className={styles.panel}>
          <div className={styles.railText}>
            <h3>{t.donateTabs.international.title}</h3>
            <div className={styles.rows}>
              <CopyRow label={t.intlHolder} value={INTERNATIONAL_BANK.holder} copyKey="holder" copied={copied} onCopy={copy} t={t} />
              <CopyRow label="IBAN" value={INTERNATIONAL_BANK.iban} copyKey="iban" copied={copied} onCopy={copy} t={t} />
              <CopyRow label="SWIFT / BIC" value={INTERNATIONAL_BANK.swift} copyKey="swift" copied={copied} onCopy={copy} t={t} />
              <CopyRow label={t.intlBank} value={INTERNATIONAL_BANK.bank} copyKey="bank" copied={copied} onCopy={copy} t={t} />
              <CopyRow label={t.intlSortCode} value={INTERNATIONAL_BANK.sortCode} copyKey="sort" copied={copied} onCopy={copy} t={t} />
            </div>
            <p className={styles.note}>{t.donateNote}</p>
          </div>
        </div>

        <footer className={styles.trust}>
          <span><BadgeCheck size={16} aria-hidden="true" /> {t.donateTrustRegistered}</span>
          <span><Lock size={16} aria-hidden="true" /> {t.donateTrustSecure}</span>
          <span><HandHeart size={16} aria-hidden="true" /> {t.donateTrustReceipt}</span>
        </footer>
      </div>
    </section>
  );
}
