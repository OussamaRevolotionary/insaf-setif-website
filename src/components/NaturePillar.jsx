import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Droplets, Flame, Siren, Sprout, Trees } from 'lucide-react';
import { useLang } from '../lib/lang.js';
import styles from './NaturePillar.module.css';

const NATURE_CARDS = [
  { id: 'reforest',  Icon: Trees,    color: 'var(--green)' },
  { id: 'water',     Icon: Droplets, color: 'var(--blue)' },
  { id: 'education', Icon: Sprout,   color: '#c9a400' },
];

// Decorative: a charred ridge giving way to green regrowth and water.
function RegrowthScene() {
  return (
    <svg className={styles.scene} viewBox="0 0 480 360" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="np-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#150c18" />
          <stop offset="0.55" stopColor="#47190f" />
          <stop offset="1" stopColor="#c0521d" />
        </linearGradient>
        <radialGradient id="np-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd27a" />
          <stop offset="1" stopColor="#ff8a2a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="np-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2bbf7a" />
          <stop offset="1" stopColor="#157a4b" />
        </linearGradient>
      </defs>

      <rect width="480" height="360" fill="url(#np-sky)" />
      <circle cx="355" cy="160" r="70" fill="url(#np-sun)" />
      <path d="M0 230 L70 185 L130 210 L200 160 L270 205 L340 170 L410 200 L480 175 L480 360 L0 360 Z" fill="#2a130d" />

      <path d="M0 262 L90 232 L170 250 L250 226 L330 252 L480 238 L480 360 L0 360 Z" fill="#170b08" />
      {[40, 78, 118, 160, 205, 248, 292].map((x, i) => (
        <g key={x} fill="#0d0605">
          <rect x={x} y={222 - (i % 3) * 6} width="3" height={34 + (i % 3) * 6} />
          <rect x={x - 6} y={236 - (i % 3) * 4} width="15" height="2" transform={`rotate(-18 ${x} 236)`} />
        </g>
      ))}

      <path d="M200 360 C 250 290, 330 262, 480 250 L480 360 Z" fill="url(#np-green)" />
      {[[330, 270], [372, 262], [414, 256], [452, 252]].map(([x, y], i) => (
        <polygon key={x} points={`${x},${y - 34 - i * 2} ${x - 13},${y} ${x + 13},${y}`} fill={i % 2 ? '#1c9a5f' : '#23b06d'} />
      ))}

      <g transform="translate(262 316)">
        <path d="M0 0 C 0 -18, 0 -26, 0 -34" stroke="#0f5c37" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M0 -24 C -14 -30, -20 -40, -8 -44 C -2 -38, 0 -30, 0 -24 Z" fill="#3ddc8e" />
        <path d="M0 -30 C 14 -36, 22 -46, 10 -50 C 3 -44, 0 -36, 0 -30 Z" fill="#2bbf7a" />
      </g>
      <path d="M298 300 C 298 290, 306 282, 306 282 C 306 282, 314 290, 314 300 A 8 8 0 0 1 298 300 Z" fill="#5cc8e8" />

      {[[60, 200], [120, 176], [180, 214], [228, 190], [96, 150], [160, 140], [214, 160], [40, 160]].map(([x, y], i) => (
        <circle key={i} className={styles.ember} cx={x} cy={y} r={i % 3 === 0 ? 2.4 : 1.6} style={{ animationDelay: `${i * 0.45}s` }} />
      ))}
    </svg>
  );
}

export default function NaturePillar() {
  const { t } = useLang();

  return (
    <section id="green-life" className={styles.pillar}>
      <div className={styles.flagDivider} aria-hidden="true"><i /><i /><i /></div>

      <div className={styles.fire}>
        <div className={`${styles.fireText} reveal-left`}>
          <span className={styles.fireBadge}><Flame size={14} /> {t.fireBadge}</span>
          <h2>{t.fireTitle}</h2>
          <p className={styles.fireIntro}>{t.fireIntro}</p>

          <p className={styles.listLead}>{t.fireListLead}</p>
          <ul className={styles.fireList}>
            {(t.fireActions || []).map((action) => (
              <li key={action}><Check size={16} aria-hidden="true" /> {action}</li>
            ))}
          </ul>

          <p className={styles.honor}><Siren size={18} aria-hidden="true" /> {t.fireHonor}</p>

          <Link to="/donate?campaign=wildfire&amount=3500" className={styles.fireBtn}>
            <Flame size={18} /> {t.fireCta}
          </Link>
        </div>

        <div className={`${styles.art} reveal-right`}>
          <RegrowthScene />
        </div>
      </div>

      <div className={styles.nature}>
        <header className={`${styles.natureHead} reveal`}>
          <span className={styles.natureBadge}><Sprout size={14} /> {t.natureBadge}</span>
          <h2>{t.natureTitle}</h2>
          <p>{t.natureSub}</p>
        </header>

        <div className={styles.cards}>
          {NATURE_CARDS.map(({ id, Icon, color }, i) => {
            const copy = t.natureCards?.[id];
            if (!copy) return null;
            return (
              <article key={id} className={`${styles.card} reveal stagger-${i + 1}`} style={{ '--accent': color }}>
                <div className={styles.cardIcon} aria-hidden="true"><Icon size={26} /></div>
                <h3>{copy.title}</h3>
                <p>{copy.text}</p>
                <p className={styles.cardHelp}>{copy.help}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
