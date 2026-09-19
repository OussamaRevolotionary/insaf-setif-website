import React from 'react';
import Marquee from '../lib/marquee.js';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLang } from '../lib/lang.js';
import { dateFmt, localeFor } from '../lib/format.js';
import { usePrefersReducedMotion } from '../lib/hooks.js';
import styles from './ActivityTicker.module.css';

function headline(post) {
  const text = (post.title || post.text || '').replace(/[#_]/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > 90 ? `${text.slice(0, 88)}…` : text;
}

export default function ActivityTicker({ posts }) {
  const { t, lang } = useLang();
  const reducedMotion = usePrefersReducedMotion();
  const rtl = lang === 'ar';
  const locale = localeFor(lang);
  const Arrow = rtl ? ArrowLeft : ArrowRight;

  const items = React.useMemo(
    () => posts.map((p) => ({ id: p.id, text: headline(p), date: dateFmt(p.date, locale) })).filter((p) => p.text),
    [posts, locale]
  );
  if (!items.length) return null;

  return (
    <section className={styles.ticker} aria-label={t.tickerLabel}>
      <span className={styles.label}>
        <span className={styles.liveDot} aria-hidden="true" />
        <span className={styles.labelText}>{t.tickerLabel}</span>
      </span>

      {/* Marquee's flex layout inverts under dir="rtl"; run it in an LTR box and let each
          item keep its own direction. Moving right shows Arabic headlines start-first.
          The duplicated marquee copies are hidden from assistive tech; the News link
          below is the accessible path to the same content. */}
      <div className={styles.viewport} dir="ltr" aria-hidden="true">
        <Marquee
          direction={rtl ? 'right' : 'left'}
          speed={36}
          pauseOnHover
          play={!reducedMotion}
          gradient
          gradientColor="#0a1629"
          gradientWidth={48}
          autoFill
        >
          {items.map((item) => (
            <span key={item.id} className={styles.item} dir={rtl ? 'rtl' : 'ltr'}>
              <span className={styles.dot} />
              <span className={styles.headline}>{item.text}</span>
              <time className={styles.date}>{item.date}</time>
            </span>
          ))}
        </Marquee>
      </div>

      <Link to="/news" className={styles.all}>
        <span className={styles.allText}>{t.tickerAll}</span>
        <Arrow size={14} />
      </Link>
    </section>
  );
}
