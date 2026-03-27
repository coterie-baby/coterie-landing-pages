'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Design system reference
//
// Title:       h-44 mobile (44px) → h-112 desktop (112px)
// Description: p-14 mobile (14px) → p-17 desktop (17px)
// Title mb:    2.4rem = 24px mobile / 4.8rem = 48px desktop
//
// Section height (--screen = 100svh, --gap = 25svh, N = image count):
//   Mobile:  100svh * (N+1) + 25svh * (N-1)
//   Desktop: 100svh * (N+1) + 25svh * N
// Section margin-top:
//   Mobile:  -10svh
//   Desktop: -25svh
//
// galleryWrapper: position absolute, top 100svh, padding 20svh top / 5% bottom
// galleryInner:   max-width ~70vw on desktop
// galleryItem:    216px × 283px mobile / 426px × 558px desktop
//
// Item alignment cycle (0-indexed, repeats every 4):
//   0 → left (default)
//   1 → right (ml-auto)
//   2 → center (mx-auto)
//   3 → left  (ml-0, overrides)
//
// Rotation:
//   ROTATIONS = [[2,-5],[2,5],[-10,2]] cycles per item
//   Scroll ratio (0→1) tracks the full gallery list through viewport
//   activeIndex = round(map(ratio, 0,1, 0, N-1))
//   r = lerp(rotStart, rotEnd, ratio*N - activeIndex)
// ---------------------------------------------------------------------------

const ROTATIONS: [number, number][] = [
  [2, -5],
  [2, 5],
  [-10, 2],
];

function lerp(a: number, b: number, t: number) {
  return a * (1 - t) + t * b;
}

function mapRange(n: number, start1: number, stop1: number, start2: number, stop2: number) {
  const mapped = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  return Math.min(Math.max(mapped, Math.min(start2, stop2)), Math.max(start2, stop2));
}

export interface StickyTextGalleryImage {
  src: string;
  alt?: string;
}

export interface StickyTextGalleryProps {
  title?: string;
  description?: string;
  images: StickyTextGalleryImage[];
}

export default function StickyTextGallery({
  title,
  description,
  images = [],
}: StickyTextGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const imagesRef = useRef<(HTMLLIElement | null)[]>([]);
  const count = images.length;

  // Set responsive section height + margin via JS (avoids inline-style + media query conflict)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || count === 0) return;

    const update = () => {
      const isDesktop = window.innerWidth >= 1024;
      // Mobile:  svh*(N+1) + 25svh*(N-1)  |  Desktop: svh*(N+1) + 25svh*N
      const gapCount = isDesktop ? count : count - 1;
      el.style.height = `calc(100svh * ${count + 1} + 25svh * ${gapCount})`;
      el.style.marginTop = isDesktop ? 'calc(100svh * -0.25)' : 'calc(100svh * -0.1)';
    };

    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, [count]);

  // Scroll-driven rotation
  useEffect(() => {
    const list = listRef.current;
    if (!list || count === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleScroll = () => {
      const rect = list.getBoundingClientRect();
      const vh = window.innerHeight;

      // ratio: 0 when list bottom enters viewport, 1 when list top exits viewport
      const raw = (vh - rect.top) / (rect.height + vh);
      const ratio = Math.max(0, Math.min(1, raw));

      const activeIndex = Math.round(mapRange(ratio, 0, 1, 0, count - 1));
      const el = imagesRef.current[activeIndex];
      if (el) {
        const [rotStart, rotEnd] = ROTATIONS[activeIndex % ROTATIONS.length];
        const localProgress = ratio * count - activeIndex;
        const r = lerp(rotStart, rotEnd, localProgress);
        el.style.transform = `translate3d(0,0,0) rotate(${r}deg)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [count]);

  return (
    <section
      ref={sectionRef}
      className="relative z-[-1]"
      // Initial mobile values — JS overrides on mount and resize
      style={{ height: `calc(100svh * ${count + 1} + 25svh * ${count - 1})`, marginTop: 'calc(100svh * -0.1)' }}
    >
      {/* Sticky centered text */}
      <div
        className="sticky top-0 grid place-items-center text-center text-[#141414]"
        style={{ height: '100svh' }}
      >
        <div className="grid place-items-center text-center">
          {title && (
            <h2 className="text-[44px] lg:text-[112px] leading-[1] tracking-[-0.02em] whitespace-pre-wrap mb-[24px] lg:mb-[48px] max-w-[82vw] lg:max-w-[60vw]">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-[14px] lg:text-[17px] leading-relaxed max-w-[82vw] lg:max-w-[50vw]">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Image gallery — absolutely positioned, starts at 100svh */}
      {count > 0 && (
        <div
          className="absolute w-full overflow-hidden grid place-items-start justify-items-center"
          style={{ top: '100svh', paddingTop: 'calc(100svh * 0.2)', paddingBottom: '5%' }}
        >
          <div className="relative w-full max-w-[var(--grid-width,calc(100%-32px))] lg:max-w-[58vw] mx-auto px-4 lg:px-0">
            <ul
              ref={listRef}
              className="flex flex-col relative w-full"
              style={{ gap: '25svh' }}
            >
              {images.map((item, idx) => (
                <li
                  key={idx}
                  ref={el => { imagesRef.current[idx] = el; }}
                  className={cn(
                    'relative w-[216px] h-[283px] lg:w-[426px] lg:h-[558px]',
                    // Alternating alignment — mirrors the nth-child SCSS pattern (0-indexed cycle of 4)
                    idx % 4 === 1 && 'ml-auto',   // 2nd → right
                    idx % 4 === 2 && 'mx-auto',   // 3rd → center
                    idx % 4 === 3 && 'ml-0',      // 4th → left (reset)
                  )}
                >
                  <Image
                    src={item.src}
                    alt={item.alt ?? ''}
                    fill
                    sizes="(max-width: 1024px) 216px, 426px"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
