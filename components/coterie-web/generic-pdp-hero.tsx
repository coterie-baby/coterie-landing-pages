'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Their design system: 1rem = 10px
// h-28 = 28px, h-42 = 42px, p-14 = 14px, p-12 = 12px, p-17 = 17px
// 0.8rem = 8px, 1.6rem = 16px, 2.4rem = 24px, 4rem = 40px, 6rem = 60px
// $black = #141414, $black7 = #515151, $grey = #E7E7E7, $blue = #0000C9, $blue-cgi = #D1E3FB
// @include lg = min-width: 1024px (matches Tailwind lg:)
// Header height fixed: 60px mobile / 67px desktop

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PdpHeroSlide {
  _key: string;
  image: string;
  imageAlt?: string;
  /** Optional thumbnail override. Falls back to `image`. */
  thumbnail?: string;
  caption?: string[];
  logos?: { src: string; alt: string }[];
  isLight?: boolean;
}

export interface PdpHeroReviews {
  score: number;
  reviewsCount: number;
}

export interface GenericPdpHeroProps {
  title: string;
  badge?: string;
  /** Short tagline shown beneath the title (bold, p-14) */
  soi?: string;
  description?: string;
  reviews?: PdpHeroReviews;
  /** Pill label shown next to the reviews row */
  reviewsPill?: string;
  pricePill?: string;
  priceText?: string;
  priceTextColor?: 'black' | 'muted' | 'blue';
  slides: PdpHeroSlide[];
  centered?: boolean;
  /** Slot for a purchase form or CTA — rendered below the text block */
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Stars  (1.3rem = 13px each, 0.4rem = 4px gap)
// ---------------------------------------------------------------------------

function Stars({ score }: { score: number }) {
  const rounded = Math.round(score);
  return (
    <span className="flex items-center gap-[4px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill={i < rounded ? '#0000C9' : 'none'}
          stroke="#0000C9"
          strokeWidth="1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6.5 1l1.545 3.13 3.455.503-2.5 2.437.59 3.44L6.5 8.885 3.91 10.51l.59-3.44L2 4.633l3.455-.503z" />
        </svg>
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Pill  (px-[8px] py-[4px] rounded-[2px], bg blue-cgi #D1E3FB, text 12px bold)
// ---------------------------------------------------------------------------

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-[8px] py-[4px] rounded-[2px] bg-[#D1E3FB] text-[#0000C9] text-[12px] font-bold leading-[90%] whitespace-nowrap">
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Slideshow caption  (p-12 = 12px, logos 65px wide, 16px bottom margin)
// ---------------------------------------------------------------------------

function SlideshowCaption({
  caption,
  logos,
  isLight,
}: Pick<PdpHeroSlide, 'caption' | 'logos' | 'isLight'>) {
  if (!caption?.length && !logos?.length) return null;

  return (
    <ul
      className={cn(
        'flex flex-col text-[12px]',
        isLight ? 'text-white' : 'text-[#141414]'
      )}
    >
      {logos?.length
        ? logos.map((logo, i) => (
            <li key={i} className="w-[65px] mb-[16px] last:mb-0">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={65}
                height={40}
                className="object-contain"
              />
            </li>
          ))
        : caption?.map((line, i) => <li key={i}>{line}</li>)}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Slideshow panel
// Thumbnails: 40px mobile, 60px desktop; gap 8px mobile, 16px desktop
// Main image: 375px tall mobile, full height desktop; rounded 8px desktop
// ---------------------------------------------------------------------------

function PdpSlideshow({ slides }: { slides: PdpHeroSlide[] }) {
  const [active, setActive] = useState(0);
  const current = slides[active];

  return (
    <div className="flex flex-col-reverse gap-[8px] lg:flex-row lg:gap-[16px] h-full">
      {/* Thumbnails */}
      <nav aria-label="Product images">
        <ul className="flex flex-row gap-[8px] lg:flex-col">
          {slides.map((slide, i) => (
            <li key={slide._key}>
              <button
                onClick={() => setActive(i)}
                aria-label={slide.imageAlt ?? `Slide ${i + 1}`}
                className={cn(
                  'relative block w-[40px] h-[40px] lg:w-[60px] lg:h-[60px]',
                  'rounded-[4px] lg:rounded-[8px] overflow-hidden',
                  'outline-none transition-all',
                  i === active
                    ? 'ring-2 ring-[#0000C9] ring-offset-1'
                    : 'ring-1 ring-transparent hover:ring-[#0000C9]/40'
                )}
              >
                <Image
                  src={slide.thumbnail ?? slide.image}
                  alt={slide.imageAlt ?? ''}
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main image */}
      <div className="relative flex-1 h-[375px] lg:h-full lg:rounded-[8px] overflow-hidden">
        <Image
          key={current._key}
          src={current.image}
          alt={current.imageAlt ?? ''}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {/* Caption — padding matches margin() = 16px mobile / 40px desktop */}
        <div className="absolute inset-0 p-[16px] lg:p-[8px] pointer-events-none">
          <SlideshowCaption
            caption={current.caption}
            logos={current.logos}
            isLight={current.isLight}
          />
        </div>
        {/* Dot indicators (mobile only) */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 lg:hidden">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  'h-[6px] rounded-full transition-all',
                  i === active ? 'bg-[#0000C9] w-[12px]' : 'bg-white/60 w-[6px]'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// Right column: row-gap 24px mobile / 40px desktop; margin 24px mobile
// Desktop layout: py-[40px], sticky top = header-fixed(67px) + padding(40px)
// ---------------------------------------------------------------------------

const priceColors = {
  black: 'text-[#141414]',
  muted: 'text-[#515151]',
  blue: 'text-[#0000C9]',
};

export default function GenericPdpHero({
  title,
  badge,
  soi,
  description,
  reviews,
  reviewsPill,
  pricePill,
  priceText,
  priceTextColor = 'muted',
  slides,
  centered,
  children,
}: GenericPdpHeroProps) {
  return (
    <section>
      <div className="lg:flex lg:w-full lg:max-w-[1680px] lg:mx-auto lg:py-[40px]">
        {/* Left: sticky slideshow */}
        <div className="lg:sticky lg:top-[107px] lg:w-1/2 lg:self-start lg:h-[calc(100vh-107px)]">
          <PdpSlideshow slides={slides} />
        </div>

        {/* Right: product info */}
        <div
          className={cn(
            'flex flex-col gap-[24px] w-[calc(100%-32px)] mx-auto my-[24px]',
            'lg:w-1/2 lg:gap-[40px] lg:my-0 lg:pl-[40px] lg:mb-[60px]',
            centered && 'lg:justify-center'
          )}
        >
          {/* Title block: gap 8px between rows */}
          <div className="flex flex-col gap-[8px]">
            {/* h-28 mobile / h-42 desktop, badge is p-12 / p-17 */}
            <div className="flex flex-row items-start gap-[2px] lg:gap-[4px]">
              <h1 className="text-[28px] lg:text-[42px] font-medium leading-tight">
                {title}
              </h1>
              {badge && (
                <sup className="text-[12px] lg:text-[17px] font-bold text-[#0000C9] mt-1">
                  {badge}
                </sup>
              )}
            </div>
            {/* soi: p-14 bold */}
            {soi && (
              <p className="text-[14px] font-bold">{soi}</p>
            )}
          </div>

          {/* Reviews row: gap 8px, text p-14 */}
          {reviews && (
            <a
              href="#user-reviews"
              className="flex flex-wrap items-center gap-[8px] group"
            >
              <Stars score={reviews.score} />
              <span className="text-[14px] text-[#515151] group-hover:underline">
                {reviews.score.toFixed(1)}/5 based on{' '}
                {reviews.reviewsCount.toLocaleString()} reviews
              </span>
              {reviewsPill && <Pill>{reviewsPill}</Pill>}
            </a>
          )}

          {/* Description: p-14 */}
          {description && (
            <p className="text-[14px] text-[#515151] leading-relaxed">
              {description}
            </p>
          )}

          {/* Price: p-14 bold, gap 8px */}
          {priceText && (
            <p
              className={cn(
                'flex items-center gap-[8px] text-[14px] font-bold',
                priceColors[priceTextColor]
              )}
            >
              {pricePill && <Pill>{pricePill}</Pill>}
              <span>{priceText}</span>
            </p>
          )}

          {/* Purchase form slot */}
          {children}
        </div>
      </div>
    </section>
  );
}
