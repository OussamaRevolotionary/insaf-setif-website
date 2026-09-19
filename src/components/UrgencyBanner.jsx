import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Flame, Heart, Moon, Snowflake, X } from 'lucide-react';
import { useLang } from '../lib/lang.js';
import { safeStorageGet, safeStorageSet } from '../lib/hooks.js';
import { getSeasonalAppeal } from '../config/campaigns.js';
import styles from './UrgencyBanner.module.css';

const ICONS = { school: BookOpen, wildfire: Flame, winter: Snowflake, ramadan: Moon, orphans: Heart };

export default function UrgencyBanner() {
  const { t, lang } = useLang();
  const appeal = React.useMemo(() => getSeasonalAppeal(new Date()), []);
  // Dismissal is remembered per appeal and season, so the next campaign still gets seen.
  const storageKey = `insaf-appeal-dismissed:${appeal.id}:${new Date().getFullYear()}`;
  const [visible, setVisible] = React.useState(() => safeStorageGet(storageKey) !== '1');

  const copy = t.appeals?.[appeal.id];
  if (!visible || !copy) return null;

  const Icon = ICONS[appeal.id] || Heart;
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const dismiss = () => {
    safeStorageSet(storageKey, '1');
    setVisible(false);
  };

  return (
    <aside className={styles.banner} data-appeal={appeal.id} aria-label={t.appealRegionLabel}>
      <div className={styles.flag} aria-hidden="true"><i /><i /><i /></div>
      <div className={styles.inner}>
        <span className={styles.icon} aria-hidden="true"><Icon size={16} strokeWidth={2.4} /></span>
        <p className={styles.text}>
          <strong>{copy.title}</strong>
          <span className={styles.sub}>{copy.text}</span>
        </p>
        <Link to={`/donate?campaign=${appeal.campaign}&amount=${appeal.amount}`} className={styles.cta}>
          {copy.cta} <Arrow size={14} strokeWidth={2.6} />
        </Link>
        <button type="button" className={styles.close} onClick={dismiss} aria-label={t.appealDismiss}>
          <X size={16} />
        </button>
      </div>
    </aside>
  );
}
