import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, Heart, HeartPulse, Quote, ShieldCheck, Snowflake } from 'lucide-react';
import { useLang } from '../lib/lang.js';
import { formatDA } from '../lib/format.js';
import { usePrefersReducedMotion } from '../lib/hooks.js';
import styles from './ChildrenHelpHub.module.css';

const TIERS = [
  { id: 'school', amount: 5000, Icon: BookOpen,   color: 'var(--green)' },
  { id: 'health', amount: 8000, Icon: HeartPulse, color: 'var(--blue)' },
  { id: 'winter', amount: 3500, Icon: Snowflake,  color: 'var(--orange)' },
];

const AUTOPLAY_MS = 7000;

export default function ChildrenHelpHub({ photo }) {
  const { t, lang } = useLang();
  const reducedMotion = usePrefersReducedMotion();
  const stories = t.childStories || [];
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const rtl = lang === 'ar';

  React.useEffect(() => {
    if (paused || reducedMotion || stories.length < 2) return undefined;
    const id = setTimeout(() => setIndex((i) => (i + 1) % stories.length), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, reducedMotion, stories.length]);

  const go = (delta) => setIndex((i) => (i + delta + stories.length) % stories.length);
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  return (
    <section id="children-help" className={`${styles.hub} pageSection`}>
      <header className={`${styles.intro} reveal`}>
        <span className={styles.badge}><Heart size={14} /> {t.childrenHubBadge}</span>
        <h2>{t.childrenHubTitle}</h2>
        <p>{t.childrenHubSub}</p>
      </header>

      <div className={styles.tiers}>
        {TIERS.map(({ id, amount, Icon, color }, i) => {
          const copy = t.childTiers?.[id];
          if (!copy) return null;
          const amountLabel = formatDA(amount, lang);
          return (
            <article key={id} className={`${styles.tier} reveal stagger-${i + 1}`} style={{ '--tier': color }}>
              <div className={styles.tierIcon} aria-hidden="true"><Icon size={26} /></div>
              <h3>{copy.title}</h3>
              <p className={styles.tierDesc}>{copy.desc}</p>
              <div className={styles.amount}>{amountLabel}</div>
              <p className={styles.impact}>{copy.impact}</p>
              <Link className={styles.tierBtn} to={`/donate?campaign=${id}&amount=${amount}`}>
                {t.giveAmount.replace('{amount}', amountLabel)}
              </Link>
            </article>
          );
        })}
      </div>

      <div className={styles.storyRow}>
        {photo && (
          <figure className={`${styles.photo} reveal-left`}>
            <img src={photo.src} alt={t.childPhotoAlt} loading="lazy" decoding="async" />
            <figcaption>{t.childPhotoCaption}</figcaption>
          </figure>
        )}

        {stories.length > 0 && (
          <div
            className={`${styles.carousel} reveal-right`}
            role="region"
            aria-roledescription="carousel"
            aria-label={t.childStoriesTitle}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
          >
            <h3 className={styles.carouselTitle}><Quote size={18} aria-hidden="true" /> {t.childStoriesTitle}</h3>

            <div className={styles.slides} aria-live={paused ? 'polite' : 'off'}>
              {stories.map((story, i) => (
                <blockquote
                  key={i}
                  className={`${styles.slide} ${i === index ? styles.active : ''}`}
                  aria-hidden={i !== index}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} / ${stories.length}`}
                >
                  <p>{story.text}</p>
                  <footer>{story.who}</footer>
                </blockquote>
              ))}
            </div>

            <div className={styles.controls}>
              <button type="button" className={styles.navBtn} onClick={() => go(-1)} aria-label={t.carouselPrev}>
                <PrevIcon size={18} />
              </button>
              <div className={styles.dots}>
                {stories.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                    onClick={() => setIndex(i)}
                    aria-label={`${t.carouselGoTo} ${i + 1}`}
                    aria-current={i === index ? 'true' : undefined}
                  />
                ))}
              </div>
              <button type="button" className={styles.navBtn} onClick={() => go(1)} aria-label={t.carouselNext}>
                <NextIcon size={18} />
              </button>
            </div>

            <p className={styles.disclosure}><ShieldCheck size={14} aria-hidden="true" /> {t.childStoriesDisclosure}</p>
          </div>
        )}
      </div>

      <div className={`${styles.cta} reveal`}>
        <Link className="btn primary" to="/donate?campaign=general">
          {t.helpChildNow} <Heart size={18} />
        </Link>
      </div>
    </section>
  );
}
