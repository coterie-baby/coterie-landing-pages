'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface PdpMarqueeItem {
  _key: string;
  title: string;
  subtitle?: string;
  label?: string;
  variant?: 'xsmall' | 'small' | 'medium';
}

export interface PdpMarqueeProps {
  title?: string;
  items: PdpMarqueeItem[];
  highlightFirst?: boolean;
  textColor?: string;
  backgroundColor?: string;
}

// Their system: 1rem = 10px, so h-22 = 22px, h-112 = 112px, etc.
// Gaps: 4rem = 40px mobile, 12rem = 120px desktop (medium), 7.45rem = 74.5px (small)
const VARIANTS = {
  xsmall: {
    title: 'text-[22px] lg:text-[36px]',
    subtitle: 'hidden',
    gap: 'mr-[40px] lg:mr-[40px]',
  },
  small: {
    title: 'text-[112px] lg:text-[112px]',
    subtitle: 'text-[42px] lg:text-[56px]',
    gap: 'mr-[40px] lg:mr-[74px]',
  },
  medium: {
    title: 'text-[112px] lg:text-[225px]',
    subtitle: 'text-[42px] lg:text-[112px]',
    gap: 'mr-[40px] lg:mr-[120px]',
  },
} as const;

function MarqueeItem({
  title,
  subtitle,
  label,
  variant = 'medium',
  isActive,
  highlightFirst,
  itemRef,
}: PdpMarqueeItem & {
  isActive: boolean;
  highlightFirst?: boolean;
  itemRef?: (el: HTMLDivElement | null) => void;
}) {
  const v = VARIANTS[variant];

  return (
    <div
      ref={itemRef}
      className={cn('flex flex-col items-center gap-2 shrink-0', v.gap)}
    >
      <p
        className={cn(
          v.title,
          'leading-none font-medium transition-colors duration-300',
          highlightFirst && isActive ? 'text-[#0000C9]' : 'inherit'
        )}
      >
        <span>{title}</span>
        {subtitle && (
          <span className={cn('block', v.subtitle)}>{subtitle}</span>
        )}
      </p>
      {label && <p className="text-[14px]">{label}</p>}
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous' : 'Next'}
      className="flex items-center justify-center w-12 h-12 rounded-full border border-current disabled:opacity-30 transition-opacity"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(direction === 'prev' && 'rotate-180')}
      >
        <path
          d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function PdpMarquee({
  title,
  items,
  highlightFirst,
  textColor,
  backgroundColor,
}: PdpMarqueeProps) {
  const _items = [...items, ...items];
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(_items.length - 1, index));
    itemRefs.current[clamped]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
    setActiveIndex(clamped);
  }, [_items.length]);

  return (
    <section
      className={cn(
        // py/gap: 4rem = 40px mobile, 6rem = 60px desktop
        'flex flex-col relative w-full overflow-clip gap-[40px] py-[40px] lg:gap-[60px] lg:py-[60px]',
        backgroundColor ?? 'bg-white'
      )}
    >
      {/* Header: title + nav buttons */}
      <div className="flex items-center justify-between px-4 lg:px-8">
        {title ? (
          <div className="text-[18px] lg:text-[24px] font-medium whitespace-pre-wrap max-w-[67%]">
            {title}
          </div>
        ) : (
          <div />
        )}
        <div className="flex gap-3">
          <ArrowButton
            direction="prev"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
          />
          <ArrowButton
            direction="next"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === _items.length - 1}
          />
        </div>
      </div>

      {/* Scrollable items */}
      <div
        className={cn(
          'flex overflow-x-scroll scrollbar-hide pl-4 lg:pl-8',
          textColor
        )}
      >
        {_items.map((item, index) => (
          <MarqueeItem
            key={`${index}-${item._key}`}
            {...item}
            isActive={index === activeIndex}
            highlightFirst={highlightFirst}
            itemRef={(el) => {
              itemRefs.current[index] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}
