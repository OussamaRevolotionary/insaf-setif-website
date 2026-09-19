import React from 'react';

/**
 * One-shot visibility trigger. The observer disconnects the moment the element
 * first intersects, so it never keeps firing (and never re-renders) while scrolling.
 */
export function useInViewOnce({ threshold = 0.25, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || inView) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return undefined; }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        setInView(true);
      }
    }, { threshold, rootMargin });

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, inView]);

  return [ref, inView];
}

export function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia?.(query).matches
  );

  React.useEffect(() => {
    const mql = window.matchMedia?.(query);
    if (!mql) return undefined;
    const onChange = (e) => setReduced(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

// localStorage can throw (private mode, blocked storage) — never let that break rendering.
export function safeStorageGet(key) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

export function safeStorageSet(key, value) {
  try { window.localStorage.setItem(key, value); } catch { /* storage unavailable */ }
}
