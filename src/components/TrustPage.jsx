import React from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck, Ban, ChevronDown, CreditCard, FileText, Flame, Gift, Globe, GraduationCap, Heart,
  HeartPulse, Info, Landmark, Mail, MessageCircleWarning, PackageOpen, Phone, ShieldCheck,
  ShoppingBasket, Snowflake,
} from 'lucide-react';
import { useLang, pickLang } from '../lib/lang.js';
import { dateFmt, localeFor } from '../lib/format.js';
import { BASE_URL, withBase } from '../lib/assets.js';
import { DESIGNATIONS } from '../config/donation.js';
import { FIGURES_ARE_ILLUSTRATIVE } from '../config/campaigns.js';
import { ASSOCIATION, TRUST_DOCUMENTS, TRUST_UPDATED } from '../config/trust.js';
import { trust } from '../content/trust.js';
import styles from './TrustPage.module.css';

const PROMISE_ICONS = { choose: Gift, prove: BadgeCheck, children: ShieldCheck, candid: MessageCircleWarning };

const FUND_META = {
  general:  { Icon: Heart,          color: 'var(--red)' },
  school:   { Icon: GraduationCap,  color: 'var(--green)' },
  health:   { Icon: HeartPulse,     color: 'var(--blue)' },
  winter:   { Icon: Snowflake,      color: '#3f7fd6' },
  wildfire: { Icon: Flame,          color: 'var(--orange)' },
  ramadan:  { Icon: ShoppingBasket, color: 'var(--navy)' },
};

export default function TrustPage({ contact, FacebookIcon }) {
  const { lang } = useLang();
  const c = pickLang(lang, trust);
  const siteHost = typeof window !== 'undefined' ? `${window.location.host}${BASE_URL}`.replace(/\/$/, '') : '';

  return (
    <div className={styles.page}>
      {/* Promises */}
      <section className={styles.block} aria-labelledby="trust-promises">
        <h2 id="trust-promises" className={`${styles.title} reveal`}>{c.promisesTitle}</h2>
        <div className={styles.promises}>
          {c.promises.map((p, i) => {
            const Icon = PROMISE_ICONS[p.id];
            return (
              <article key={p.id} className={`${styles.promise} reveal stagger-${i + 1}`}>
                <span className={styles.promiseIcon} aria-hidden="true"><Icon size={24} /></span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Where the money goes */}
      <section className={styles.block} aria-labelledby="trust-funds">
        <header className="reveal">
          <h2 id="trust-funds" className={styles.title}>{c.fundsTitle}</h2>
          <p className={styles.lead}>{c.fundsLead}</p>
        </header>
        <div className={styles.funds}>
          {DESIGNATIONS.map(({ id, unit }, i) => {
            const { Icon, color } = FUND_META[id];
            const fund = c.funds[id];
            const href = `/donate?campaign=${id}${unit ? `&amount=${unit}` : ''}`;
            return (
              <article key={id} className={`${styles.fund} reveal stagger-${(i % 3) + 1}`} style={{ '--c': color }}>
                <span className={styles.fundIcon} aria-hidden="true"><Icon size={22} /></span>
                <div className={styles.fundBody}>
                  <h3>{fund.title}</h3>
                  <p>{fund.text}</p>
                  <Link to={href} className={styles.fundLink}>{c.giveTo}</Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.notes}>
          <div className={styles.note}>
            <h3><CreditCard size={18} aria-hidden="true" /> {c.feesTitle}</h3>
            <p>{c.feesText}</p>
          </div>
          <div className={styles.note}>
            <h3><PackageOpen size={18} aria-hidden="true" /> {c.inKindTitle}</h3>
            <p>{c.inKindText}</p>
          </div>
          <div className={`${styles.note} ${FIGURES_ARE_ILLUSTRATIVE ? styles.noteWarn : ''}`}>
            <h3><Info size={18} aria-hidden="true" /> {c.figuresTitle}</h3>
            <p>{FIGURES_ARE_ILLUSTRATIVE ? c.figuresIllustrative : c.figuresVerified}</p>
          </div>
        </div>
      </section>

      {/* Governance + documents */}
      <section className={`${styles.block} ${styles.split}`} aria-labelledby="trust-governance">
        <div className={styles.card}>
          <h2 id="trust-governance" className={styles.cardTitle}><Landmark size={22} aria-hidden="true" /> {c.governanceTitle}</h2>
          <p>{c.governanceLead}</p>
          <dl className={styles.facts}>
            <div><dt>{c.facts.founded}</dt><dd>{c.foundedValue}</dd></div>
            <div><dt>{c.facts.seat}</dt><dd>{ASSOCIATION.seat}</dd></div>
            <div>
              <dt>{c.facts.registration}</dt>
              <dd>{ASSOCIATION.registration || <span className={styles.pending}>{c.pending}</span>}</dd>
            </div>
            <div>
              <dt>{c.facts.board}</dt>
              <dd>{ASSOCIATION.boardPublished ? '—' : <span className={styles.pending}>{c.pending}</span>}</dd>
            </div>
          </dl>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}><FileText size={22} aria-hidden="true" /> {c.documentsTitle}</h2>
          <ul className={styles.docs}>
            {TRUST_DOCUMENTS.map(({ id, url }) => (
              <li key={id}>
                <span>{c.documents[id]}</span>
                {url ? (
                  <a href={withBase(url)} target="_blank" rel="noopener noreferrer">{c.open}</a>
                ) : (
                  <span className={styles.pending}>{c.pending}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Safeguarding */}
      <section className={styles.safeguard} aria-labelledby="trust-safeguarding">
        <span className={styles.safeguardIcon} aria-hidden="true"><ShieldCheck size={28} /></span>
        <div>
          <h2 id="trust-safeguarding">{c.safeguardingTitle}</h2>
          <p>{c.safeguardingText}</p>
          <p className={styles.concern}><a href="tel:1111">{c.concern}</a></p>
          <Link to="/children-rights" className={styles.textLink}>{c.safeguardingLink}</Link>
        </div>
      </section>

      {/* Official channels + fraud warning */}
      <section className={`${styles.block} ${styles.split}`} aria-labelledby="trust-channels">
        <div className={styles.card}>
          <h2 id="trust-channels" className={styles.cardTitle}><BadgeCheck size={22} aria-hidden="true" /> {c.channelsTitle}</h2>
          <p>{c.channelsLead}</p>
          <ul className={styles.channels}>
            <li><Globe size={18} aria-hidden="true" /> <span>{c.channels.site}</span> <b dir="ltr">{siteHost}</b></li>
            <li>
              {FacebookIcon ? <FacebookIcon size={18} /> : <Globe size={18} aria-hidden="true" />}
              <span>{c.channels.facebook}</span>
              <a href={contact.facebook} target="_blank" rel="noopener noreferrer" dir="ltr">/insaf.association.setif</a>
            </li>
            <li><Phone size={18} aria-hidden="true" /> <span>{c.channels.phone}</span> <a href={`tel:${contact.phone}`} dir="ltr">{contact.telDisplay || contact.phone}</a></li>
            <li><Mail size={18} aria-hidden="true" /> <span>{c.channels.email}</span> <a href={`mailto:${contact.email}`} dir="ltr">{contact.email}</a></li>
          </ul>
        </div>

        <div className={`${styles.card} ${styles.warnCard}`}>
          <h2 className={styles.cardTitle}><Ban size={22} aria-hidden="true" /> {c.warningsTitle}</h2>
          <ul className={styles.warnings}>
            {c.warnings.map((w) => <li key={w}>{w}</li>)}
          </ul>
          <p className={styles.verify}>{c.verifyText}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.block} aria-labelledby="trust-faq">
        <h2 id="trust-faq" className={`${styles.title} reveal`}>{c.faqTitle}</h2>
        <div className={styles.faq}>
          {c.faqs.map(({ q, a }) => (
            <details key={q} className={styles.faqItem}>
              <summary>
                <span>{q}</span>
                <ChevronDown size={18} aria-hidden="true" className={styles.chev} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Candor */}
      <section className={styles.candor} aria-labelledby="trust-candor">
        <h2 id="trust-candor">{c.candorTitle}</h2>
        <p>{c.candorText}</p>
        <div className={styles.candorFoot}>
          <span>{c.updated}: <time dateTime={TRUST_UPDATED}>{dateFmt(TRUST_UPDATED, localeFor(lang))}</time></span>
          <Link to="/contact" className="btn primary">{c.contactCta}</Link>
        </div>
      </section>
    </div>
  );
}
