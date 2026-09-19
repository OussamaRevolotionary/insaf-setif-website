import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CalendarHeart, CheckCircle2, ExternalLink, GraduationCap, HandHeart,
  Heart, HeartPulse, House, Megaphone, PhoneCall, Puzzle, Scale, ShieldCheck, Siren, Sprout,
} from 'lucide-react';
import { useLang, pickLang } from '../lib/lang.js';
import {
  childRights, RIGHT_IDS, HELPLINES, EMERGENCY_NUMBERS, RIGHTS_SOURCES,
} from '../content/childRights.js';
import styles from './ChildRights.module.css';

const RIGHT_META = {
  education:   { Icon: GraduationCap, color: '#20a66a' },
  health:      { Icon: HeartPulse,    color: '#1f9bb4' },
  protection:  { Icon: ShieldCheck,   color: '#2f3e9e' },
  living:      { Icon: House,         color: '#e07f0e' },
  family:      { Icon: HandHeart,     color: '#e63f4d' },
  play:        { Icon: Puzzle,        color: '#b88a00' },
  voice:       { Icon: Megaphone,     color: '#6b4fd1' },
  environment: { Icon: Sprout,        color: '#0f8a4f' },
};

const PRINCIPLE_COLORS = ['var(--blue)', 'var(--green)', 'var(--orange)', 'var(--red)'];

function useCopy() {
  const { lang } = useLang();
  return { c: pickLang(lang, childRights), lang };
}

/* ------------------------------------------------------------------ */
/* Helpline panel — shared by the home teaser (compact) and the page   */
/* ------------------------------------------------------------------ */
function HelpPanel({ compact = false }) {
  const { c } = useCopy();
  return (
    <aside className={`${styles.help} ${compact ? styles.helpCompact : ''}`} aria-labelledby={compact ? undefined : 'rights-help-title'}>
      <div className={styles.helpHead}>
        <span className={styles.helpIcon} aria-hidden="true"><Siren size={compact ? 20 : 26} /></span>
        <div>
          <h3 id={compact ? undefined : 'rights-help-title'}>{c.helpTitle}</h3>
          <p>{c.helpLead}</p>
        </div>
      </div>

      <div className={styles.lines}>
        {HELPLINES.map(({ id, number, tel }) => (
          <a key={id} className={styles.line} href={`tel:${tel}`} aria-label={`${c.callLabel} ${number} — ${c.helplines[id].name}`}>
            <span className={styles.lineNumber} dir="ltr">{number}</span>
            <span className={styles.lineBody}>
              <b>{c.helplines[id].name}</b>
              {!compact && <small>{c.helplines[id].detail}</small>}
            </span>
            <PhoneCall size={18} className={styles.lineCall} aria-hidden="true" />
          </a>
        ))}
      </div>

      <p className={styles.emergency}>
        <strong>{c.emergencyLabel}</strong>
        {EMERGENCY_NUMBERS.map(({ id, number, tel }) => (
          <a key={id} href={`tel:${tel}`}>
            {c.emergency[id]} <span dir="ltr">{number}</span>
          </a>
        ))}
      </p>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Home-page section                                                   */
/* ------------------------------------------------------------------ */
export function ChildRightsTeaser() {
  const { c, lang } = useCopy();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section id="children-rights" className={`${styles.teaser} pageSection`} aria-labelledby="rights-teaser-title">
      <header className={`${styles.intro} reveal`}>
        <span className={styles.badge}><Scale size={14} aria-hidden="true" /> {c.badge}</span>
        <h2 id="rights-teaser-title">{c.title}</h2>
        <p>{c.lead}</p>
      </header>

      <ul className={styles.chips}>
        {RIGHT_IDS.map((id, i) => {
          const { Icon, color } = RIGHT_META[id];
          const r = c.rights[id];
          return (
            <li key={id} className={`reveal stagger-${(i % 4) + 1}`}>
              <Link to={`/children-rights?right=${id}`} className={styles.chip} style={{ '--c': color }}>
                <span className={styles.chipIcon} aria-hidden="true"><Icon size={22} /></span>
                <span className={styles.chipTitle}>{r.title}</span>
                <span className={styles.chipArticle}>{c.articleLabel} {r.articles.split(' · ')[0]}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={styles.teaserFoot}>
        <HelpPanel compact />
        <Link to="/children-rights" className={`btn primary ${styles.teaserCta}`}>
          {c.teaserCta} <Arrow size={18} />
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Rights explorer (tabs)                                              */
/* ------------------------------------------------------------------ */
function RightsExplorer({ initial }) {
  const { c, lang } = useCopy();
  const [active, setActive] = React.useState(RIGHT_IDS.includes(initial) ? initial : RIGHT_IDS[0]);
  const tabRefs = React.useRef({});
  const rtl = lang === 'ar';

  const onKeyDown = (e) => {
    const i = RIGHT_IDS.indexOf(active);
    // Up/Down move one row: 2 columns on wide screens, 1 on phones.
    const cols = getComputedStyle(e.currentTarget).gridTemplateColumns.split(' ').length || 1;
    const step = { ArrowDown: cols, ArrowUp: -cols, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
    let next = null;
    if (step !== undefined) next = RIGHT_IDS[(i + step + RIGHT_IDS.length) % RIGHT_IDS.length];
    if (e.key === 'Home') next = RIGHT_IDS[0];
    if (e.key === 'End') next = RIGHT_IDS[RIGHT_IDS.length - 1];
    if (!next) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const { Icon, color } = RIGHT_META[active];
  const r = c.rights[active];

  return (
    <section className={styles.block} aria-labelledby="rights-explorer-title">
      <header className={`${styles.blockHead} reveal`}>
        <h2 id="rights-explorer-title">{c.rightsTitle}</h2>
        <p>{c.rightsLead}</p>
      </header>

      <div className={styles.explorer}>
        <div className={styles.tabs} role="tablist" aria-label={c.rightsTitle} onKeyDown={onKeyDown}>
          {RIGHT_IDS.map((id) => {
            const meta = RIGHT_META[id];
            const selected = id === active;
            return (
              <button
                key={id}
                ref={(el) => { tabRefs.current[id] = el; }}
                type="button"
                role="tab"
                id={`right-tab-${id}`}
                aria-selected={selected}
                aria-controls="right-panel"
                tabIndex={selected ? 0 : -1}
                className={`${styles.tab} ${selected ? styles.tabActive : ''}`}
                style={{ '--c': meta.color }}
                onClick={() => setActive(id)}
              >
                <meta.Icon size={20} aria-hidden="true" />
                <span>{c.rights[id].title}</span>
              </button>
            );
          })}
        </div>

        <div
          id="right-panel"
          role="tabpanel"
          aria-labelledby={`right-tab-${active}`}
          className={styles.panel}
          style={{ '--c': color }}
          key={active}
        >
          <div className={styles.panelTop}>
            <span className={styles.panelIcon} aria-hidden="true"><Icon size={30} /></span>
            <div>
              <h3>{r.title}</h3>
              <span className={styles.articles}>{c.articleLabel} {r.articles}</span>
            </div>
          </div>
          <figure className={styles.childQuote}>
            <figcaption>{c.childVoice}</figcaption>
            <blockquote>{r.child}</blockquote>
          </figure>
          <div className={styles.insaf}>
            <b><HandHeart size={16} aria-hidden="true" /> {c.insafDoes}</b>
            <p>{r.insaf}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Full page body (inside <Page>)                                      */
/* ------------------------------------------------------------------ */
export default function ChildRightsPage() {
  const { c } = useCopy();
  const location = useLocation();
  const initial = new URLSearchParams(location.search).get('right');

  return (
    <div className={styles.page}>
      {/* Four principles */}
      <section className={styles.block} aria-labelledby="rights-principles-title">
        <header className={`${styles.blockHead} reveal`}>
          <h2 id="rights-principles-title">{c.principlesTitle}</h2>
          <p>{c.principlesLead}</p>
        </header>
        <div className={styles.principles}>
          {c.principles.map((p, i) => (
            <article key={p.id} className={`${styles.principle} reveal stagger-${i + 1}`} style={{ '--c': PRINCIPLE_COLORS[i] }}>
              <span className={styles.principleArticle}>
                <small>{c.articleLabel}</small>
                <b dir="ltr">{p.article}</b>
              </span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <RightsExplorer initial={initial} />

      <HelpPanel />

      {/* Algeria's legal framework */}
      <section className={styles.block} aria-labelledby="rights-law-title">
        <header className={`${styles.blockHead} reveal`}>
          <h2 id="rights-law-title">{c.lawTitle}</h2>
          <p>{c.lawLead}</p>
        </header>
        <ol className={styles.timeline}>
          {c.timeline.map((step, i) => (
            <li key={step.date} className={`${styles.step} reveal stagger-${(i % 4) + 1}`}>
              <time className={styles.stepDate}>{step.date}</time>
              <div className={styles.stepBody}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Dates */}
      <section className={styles.block} aria-labelledby="rights-dates-title">
        <header className={`${styles.blockHead} reveal`}>
          <h2 id="rights-dates-title"><CalendarHeart size={26} aria-hidden="true" /> {c.datesTitle}</h2>
        </header>
        <div className={styles.dates}>
          {c.dates.map((d, i) => (
            <article key={d.title} className={`${styles.date} reveal stagger-${i + 1}`}>
              <div className={styles.calendar} aria-hidden="true">
                <span>{d.month}</span>
                <b>{d.day}</b>
              </div>
              <div>
                <h3>{d.title} <span className={styles.srOnly}>— {d.day} {d.month}</span></h3>
                <p>{d.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Insaf's own club */}
      <section className={`${styles.ambassadors} reveal`} aria-labelledby="rights-club-title">
        <span className={styles.badge}><Heart size={14} aria-hidden="true" /> {c.ambassadorsBadge}</span>
        <h2 id="rights-club-title">{c.ambassadorsTitle}</h2>
        <p>{c.ambassadorsText}</p>
        <div className={styles.clubCtas}>
          <Link to="/contact" className="btn primary">{c.ctaJoin}</Link>
          <Link to="/donate?campaign=general" className={styles.ghostBtn}>{c.ctaSupport} <Heart size={16} /></Link>
        </div>
      </section>

      {/* Safeguarding promise + sources */}
      <div className={styles.closing}>
        <section className={styles.promise} aria-labelledby="rights-promise-title">
          <h2 id="rights-promise-title"><ShieldCheck size={22} aria-hidden="true" /> {c.promiseTitle}</h2>
          <ul>
            {c.promises.map((line) => (
              <li key={line}><CheckCircle2 size={18} aria-hidden="true" /> {line}</li>
            ))}
          </ul>
          <Link to="/contact" className={styles.textLink}>{c.promiseCta}</Link>
        </section>

        <section className={styles.sources} aria-labelledby="rights-sources-title">
          <h2 id="rights-sources-title">{c.sourcesTitle}</h2>
          <ul>
            {RIGHTS_SOURCES.map(({ id, org, url }) => (
              <li key={id}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <span className={styles.org}>{org}</span>
                  <span>{c.sources[id]}</span>
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p className={styles.sourcesNote}>{c.sourcesNote}</p>
        </section>
      </div>
    </div>
  );
}
