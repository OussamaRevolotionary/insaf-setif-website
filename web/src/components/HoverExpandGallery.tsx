// Adapted from 21st.dev "Hover Expand Gallery" by kedhareswer (pure CSS, no animation library):
// RTL-safe logical properties, INSAF palette, optimised images and a link per panel.
import { useState, type CSSProperties } from 'react';

export type HoverExpandItem = {
  title: string;
  meta?: string;
  src: string;
  srcSet?: string;
  href?: string;
  linkLabel?: string;
};

type Props = {
  items: HoverExpandItem[];
  /** Height of the desktop row. Ignored below 1024px, where the accordion sizes itself. */
  height?: string;
  /** Width of a closed panel (and the label rail) on desktop, in px. */
  railWidth?: number;
  /** Cap on the open panel's width on desktop, in px. */
  maxOpenWidth?: number;
  /** Height of the open panel's image below 1024px, in px. */
  mobileImageHeight?: number;
  duration?: number;
};

export default function HoverExpandGallery({
  items,
  height = '34rem',
  railWidth = 72,
  maxOpenWidth = 820,
  mobileImageHeight = 300,
  duration = 620,
}: Props) {
  const [active, setActive] = useState(0);

  const rootVars = {
    '--hx-h': height,
    '--hx-rail': `${railWidth}px`,
    '--hx-max': `${maxOpenWidth}px`,
    '--hx-t': `${duration}ms`,
  } as CSSProperties;

  return (
    <div style={rootVars} className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-emerald-950 text-white lg:h-[var(--hx-h)]">
      <ul className="flex w-full flex-col lg:h-full lg:flex-row lg:justify-center">
        {items.map((item, index) => {
          const isActive = index === active;
          const panelVars = {
            // Desktop: flex-basis animates from rail width to open width.
            // Mobile: the image block's height animates instead.
            '--hx-basis': isActive ? 'var(--hx-max)' : 'var(--hx-rail)',
            '--hx-img-h': isActive ? `${mobileImageHeight}px` : '0px',
            '--hx-img-o': isActive ? 1 : 0,
          } as CSSProperties;

          return (
            <li
              key={item.title}
              style={panelVars}
              className="relative border-b border-white/10 last:border-b-0 lg:h-full lg:min-w-0 lg:border-b-0 lg:border-s lg:first:border-s-0 lg:[flex-basis:var(--hx-basis)] lg:[flex-grow:0] lg:[flex-shrink:1] lg:transition-[flex-basis] lg:duration-[var(--hx-t)] lg:ease-[cubic-bezier(0.32,0.72,0,1)] lg:motion-reduce:transition-none"
            >
              <button
                type="button"
                aria-expanded={isActive}
                aria-label={item.title}
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') setActive(index); }}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                className="group relative block w-full cursor-pointer border-0 bg-transparent p-0 text-start outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-accent lg:h-full lg:overflow-hidden"
              >
                <span
                  aria-hidden={!isActive}
                  style={{ opacity: 'var(--hx-img-o)' }}
                  className="relative block h-[var(--hx-img-h)] w-full overflow-hidden bg-emerald-900 transition-[height,opacity] duration-[var(--hx-t)] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none lg:absolute lg:inset-y-3 lg:start-[var(--hx-rail)] lg:end-3 lg:h-auto lg:w-auto lg:rounded-xl lg:transition-opacity"
                >
                  <img
                    src={item.src}
                    srcSet={item.srcSet}
                    sizes="(min-width: 1024px) 820px, 100vw"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="block h-full w-full max-w-none object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/10 to-transparent" />
                  <span className="absolute inset-x-4 bottom-4 text-lg font-bold leading-tight text-white sm:text-xl">{item.title}</span>
                </span>

                {/* Label: a row below 1024px; a rotated rail above it. */}
                <span
                  className={`flex h-14 w-full items-center justify-between gap-3 overflow-hidden px-5 text-sm font-semibold transition-colors duration-[var(--hx-t)] motion-reduce:transition-none lg:absolute lg:inset-y-0 lg:start-0 lg:h-full lg:w-[var(--hx-rail)] lg:flex-col-reverse lg:justify-between lg:px-0 lg:py-6 ${
                    isActive ? 'text-amber-accent' : 'text-white/60 group-hover:text-white'
                  }`}
                >
                  <span className="truncate lg:rotate-180 lg:overflow-hidden lg:whitespace-nowrap lg:[writing-mode:vertical-rl]">{item.title}</span>
                  <span
                    style={{ opacity: isActive && item.meta ? 1 : 0 }}
                    className="tabular shrink-0 text-xs transition-opacity duration-[var(--hx-t)] motion-reduce:transition-none lg:rotate-180 lg:whitespace-nowrap lg:[writing-mode:vertical-rl]"
                  >
                    {item.meta}
                  </span>
                </span>
              </button>
              {isActive && item.href && (
                <a
                  href={item.href}
                  className="absolute end-6 top-6 z-10 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-float hover:bg-white max-lg:top-auto max-lg:bottom-[4.25rem]"
                >
                  {item.linkLabel}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
