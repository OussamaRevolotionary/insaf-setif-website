import React from 'react';
import styles from './HeaderFlag.module.css';

// Flag of Algeria, 3:2. Standard construction: crescent from a r=150 circle at the centre
// minus a r=120 circle shifted toward the fly; the star points to the fly.
const FLAG_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 600'>" +
  "<path fill='#fff' d='M0 0h900v600H0z'/>" +
  "<path fill='#006233' d='M0 0h450v600H0z'/>" +
  "<path fill='#d21034' d='m579.904 225a150 150 0 1 0 0 150 120 120 0 1 1 0-150m1.212 75-135.62-44.069 83.819 115.367v-142.596l-83.819 115.367z'/>" +
  '</svg>';
const FLAG_URL = `url("data:image/svg+xml,${encodeURIComponent(FLAG_SVG)}")`;

// The cloth is cut into vertical strips that bob with a staggered delay, which reads as a
// ripple travelling from the pole to the fly. With reduced motion it is a still flag.
const STRIPS = 12;

// Decorative: it sits inside the brand link, whose name already comes from the logo and title.
export function FlagPennant() {
  return (
    <span className={styles.pennant} dir="ltr" aria-hidden="true">
      <span className={styles.pole} />
      <span className={styles.cloth} style={{ '--flag': FLAG_URL, '--strips': STRIPS }}>
        {Array.from({ length: STRIPS }, (_, i) => (
          <span key={i} className={styles.strip} style={{ '--i': i }} />
        ))}
      </span>
    </span>
  );
}

// Full-width green | white | red band on the header's bottom edge. The colours run in the
// flag's own order in every language, since a national flag is never mirrored.
export function TricolorEdge() {
  return <span className={styles.edge} aria-hidden="true" />;
}
