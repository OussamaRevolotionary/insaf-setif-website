import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Flame, Info, Snowflake } from 'lucide-react';
import { useLang } from '../lib/lang.js';
import { formatDA } from '../lib/format.js';
import { useInViewOnce } from '../lib/hooks.js';
import { CAMPAIGNS, FIGURES_ARE_ILLUSTRATIVE } from '../config/campaigns.js';
import styles from './CampaignSection.module.css';

const ICONS = { school: BookOpen, wildfire: Flame, winter: Snowflake };

export default function CampaignSection() {
  const { t, lang } = useLang();
  // A single observer for the whole section (not one per card), disconnected on first hit.
  const [ref, inView] = useInViewOnce({ threshold: 0.2 });
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section ref={ref} className={`${styles.section} pageSection`} data-animate={inView ? 'in' : 'out'}>
      <header className={`${styles.intro} reveal`}>
        <h2>{t.campaignSectionTitle}</h2>
        <p>{t.campaignSectionSub}</p>
      </header>

      <div className={styles.grid}>
        {CAMPAIGNS.map((c, i) => {
          const copy = t.campaigns?.[c.id];
          if (!copy) return null;
          const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
          const Icon = ICONS[c.id] || BookOpen;
          return (
            <article
              key={c.id}
              className={`${styles.card} reveal stagger-${i + 1}`}
              style={{ '--c': c.color, '--p': pct / 100, '--delay': `${i * 140}ms` }}
            >
              <div className={styles.top}>
                <span className={styles.icon} aria-hidden="true"><Icon size={20} /></span>
                <h3 className={styles.title}>{copy.title}</h3>
                <span className={styles.pct}>{pct}%</span>
              </div>
              <p className={styles.desc}>{copy.desc}</p>

              <div
                className={styles.bar}
                role="progressbar"
                aria-label={copy.title}
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span className={styles.fill} />
              </div>

              <div className={styles.figures}>
                <span><b>{formatDA(c.raised, lang)}</b> {t.campaignRaised}</span>
                <span>{t.campaignGoal}: {formatDA(c.goal, lang)}</span>
              </div>

              {pct >= 80 && <p className={styles.almost}>{t.campaignAlmost}</p>}

              <Link to={`/donate?campaign=${c.id}&amount=${c.suggested}`} className={styles.cta}>
                {t.campaignDonate} <Arrow size={16} />
              </Link>
            </article>
          );
        })}
      </div>

      {FIGURES_ARE_ILLUSTRATIVE && (
        <p className={styles.disclosure}><Info size={15} aria-hidden="true" /> {t.campaignIllustrative}</p>
      )}
    </section>
  );
}
