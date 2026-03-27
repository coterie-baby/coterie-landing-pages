import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// ---------------------------------------------------------------------------
// Design system reference (1rem = 10px in source)
//
// Heading aliases (mobile → desktop):
//   h1 = 68px → 112px   h2 = 44px → 80px   h3 = 38px → 56px
//   h4 = 28px → 42px    h5 = 22px → 36px   h6 = 18px → 24px
//   All headings: line-height 1, letter-spacing -0.02em, white-space pre-wrap
//
// Description aliases (mobile → desktop):
//   p-xlarge = 18px → 20px   p-large = 16px → 17px
//   p-medium = 14px → 14px   p-small = 12px → 12px
//
// --screen = 100svh (fallback 90vh)
// Header height fixed: 60px mobile / 67px desktop
// Caption padding: 48px/16px mobile, 80px/40px desktop
// Overlay: rgba(0,0,0, n×0.1) via combined linear+radial gradient
// ---------------------------------------------------------------------------

type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

type TitleSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type DescriptionSize = 'p-xlarge' | 'p-large' | 'p-medium' | 'p-small';

export interface HeroLink {
  _key: string;
  label: string;
  href: string;
  variant?: 'primary' | 'outline';
}

export interface HeroOverlayText {
  title: string;
  badge?: string;
  description?: string;
  links?: HeroLink[];
  position?: { desktop: Position; mobile: Position };
  /** Hex color for all overlay text */
  textColor?: string;
  hasBackground?: boolean;
  /** Tailwind bg class or hex — used when hasBackground is true */
  backgroundColor?: string;
  titleSize?: { desktop: TitleSize; mobile: TitleSize };
  descriptionSize?: { desktop: DescriptionSize; mobile: DescriptionSize };
  narrow?: boolean;
}

export interface HeroProps {
  imageUrl: string;
  imageAlt?: string;
  videoUrl?: string;
  /** 0–9, multiplied by 0.1 to get overlay alpha. Default: 2.5 (≈rgba 0,0,0,0.25) */
  overlay?: number;
  overlayText: HeroOverlayText;
  /** Whether this is the first slice on the page (uses h1, sets image priority) */
  isFirst?: boolean;
  /** Adds top padding to clear a transparent/overlapping header */
  navigationShift?: boolean;
  /** Scale factor 0–1 for min-height. Default 1 = full viewport height. */
  heroMinHeightPercent?: number;
}

// ---------------------------------------------------------------------------
// Heading size classes
// ---------------------------------------------------------------------------

const TITLE_SIZES: Record<TitleSize, string> = {
  h1: 'text-[68px] lg:text-[112px]',
  h2: 'text-[44px] lg:text-[80px]',
  h3: 'text-[38px] lg:text-[56px]',
  h4: 'text-[28px] lg:text-[42px]',
  h5: 'text-[22px] lg:text-[36px]',
  h6: 'text-[18px] lg:text-[24px]',
};

const DESCRIPTION_SIZES: Record<DescriptionSize, string> = {
  'p-xlarge': 'text-[18px] lg:text-[20px]',
  'p-large': 'text-[16px] lg:text-[17px]',
  'p-medium': 'text-[14px] lg:text-[14px]',
  'p-small': 'text-[12px] lg:text-[12px]',
};

// ---------------------------------------------------------------------------
// Position → Tailwind alignment classes
// Applied to the figcaption (flex flex-col)
// ---------------------------------------------------------------------------

const POSITION_CLASSES: Record<Position, { caption: string; children: string }> = {
  'top-left':     { caption: 'items-start justify-start text-left',   children: 'justify-start' },
  'top-center':   { caption: 'items-center justify-start text-center', children: 'justify-center' },
  'top-right':    { caption: 'items-end justify-start text-right',     children: 'justify-end' },
  'center-left':  { caption: 'items-start justify-center text-left',   children: 'justify-start' },
  'center':       { caption: 'items-center justify-center text-center', children: 'justify-center' },
  'center-right': { caption: 'items-end justify-center text-right',    children: 'justify-end' },
  'bottom-left':  { caption: 'items-start justify-end text-left',      children: 'justify-start' },
  'bottom-center':{ caption: 'items-center justify-end text-center',   children: 'justify-center' },
  'bottom-right': { caption: 'items-end justify-end text-right',       children: 'justify-end' },
};

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

function HeroButton({ link }: { link: HeroLink }) {
  return (
    <Button asChild variant={link.variant === 'outline' ? 'outline' : 'default'}>
      <a href={link.href}>{link.label}</a>
    </Button>
  );
}

// ---------------------------------------------------------------------------
// OverlayText
// Rendered twice — once for mobile position, once for desktop — matching the
// original pattern of `className="lg:hidden"` / `className="lg-max:hidden"`.
// ---------------------------------------------------------------------------

function OverlayText({
  title,
  badge,
  description,
  links,
  positionStyle,
  textColor,
  hasBackground,
  backgroundColor,
  titleSizeClass,
  descriptionSizeClass,
  narrow,
  isFirst,
  className,
  childrenAlign,
}: {
  title: string;
  badge?: string;
  description?: string;
  links?: HeroLink[];
  positionStyle: string;
  textColor?: string;
  hasBackground?: boolean;
  backgroundColor?: string;
  titleSizeClass: string;
  descriptionSizeClass: string;
  narrow?: boolean;
  isFirst?: boolean;
  className?: string;
  childrenAlign: string;
}) {
  const TitleTag = isFirst ? 'h1' : 'h2';

  return (
    <figcaption
      className={cn(
        // Base: flex col filling the figure, with padding
        'flex flex-col z-10 flex-1',
        // Padding: 48px/16px mobile, 80px/40px desktop
        'px-[16px] py-[48px] lg:px-[40px] lg:py-[80px]',
        // Narrow variant adds extra horizontal inset on desktop
        narrow && 'lg:px-[calc(40px+var(--col-span-1,80px))]',
        // Position
        positionStyle,
        // Optional background
        hasBackground && (backgroundColor ?? 'bg-white'),
        className
      )}
      style={textColor ? { color: textColor } : undefined}
    >
      {/* Overlay gradient (replicates ::before) */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--overlay-color, rgba(0,0,0,0.25)) 0%, var(--overlay-color, rgba(0,0,0,0.25)) 100%),
            radial-gradient(circle, var(--overlay-color, rgba(0,0,0,0.25)) 25%, rgba(0,0,0,0) 100%)
          `,
        }}
      />

      {/* Text + links */}
      <div className="flex flex-col gap-[24px] lg:gap-[40px]">
        {/* Title block */}
        <div className="flex flex-col gap-[16px] lg:gap-[24px]">
          <div className={cn('flex flex-row gap-[2px] lg:gap-[4px]', childrenAlign)}>
            <TitleTag
              className={cn(
                titleSizeClass,
                'leading-[1.1] lg:leading-[0.9] tracking-[-0.02em] whitespace-pre-wrap font-medium'
              )}
            >
              {title}
            </TitleTag>
            {badge && (
              <sup className="text-[18px] lg:text-[24px] font-bold text-[#0000C9] mt-1">
                {badge}
              </sup>
            )}
          </div>
          {description && (
            <p className={cn(descriptionSizeClass, 'leading-relaxed')}>
              {description}
            </p>
          )}
        </div>

        {/* Links */}
        {links && links.length > 0 && (
          <div className={cn('flex flex-row gap-[16px] lg:gap-[24px]', childrenAlign)}>
            {links.map(link => (
              <HeroButton key={link._key} link={link} />
            ))}
          </div>
        )}
      </div>
    </figcaption>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export default function Hero({
  imageUrl,
  imageAlt = '',
  videoUrl,
  overlay = 0,
  overlayText,
  isFirst,
  navigationShift,
  heroMinHeightPercent = 100,
}: HeroProps) {
  const scale = heroMinHeightPercent / 100;
  const overlayAlpha = overlay * 0.1;
  const overlayColor = overlayAlpha > 0 ? `rgba(0,0,0,${overlayAlpha})` : undefined;

  const {
    position,
    titleSize,
    descriptionSize,
    textColor,
    hasBackground,
    backgroundColor,
    narrow,
    ...textProps
  } = overlayText;

  const mobilePosition = position?.mobile ?? 'bottom-left';
  const desktopPosition = position?.desktop ?? 'bottom-left';

  const mobileTitleClass = TITLE_SIZES[titleSize?.mobile ?? 'h1'].split(' ')[0];
  const desktopTitleClass = TITLE_SIZES[titleSize?.desktop ?? 'h1'].split(' ')[1];
  const mobileTitleSize = `${mobileTitleClass} ${desktopTitleClass}`;

  const mobileDescClass = DESCRIPTION_SIZES[descriptionSize?.mobile ?? 'p-large'].split(' ')[0];
  const desktopDescClass = DESCRIPTION_SIZES[descriptionSize?.desktop ?? 'p-large'].split(' ')[1];
  const descSize = `${mobileDescClass} ${desktopDescClass}`;

  const mobilePos = POSITION_CLASSES[mobilePosition];
  const desktopPos = POSITION_CLASSES[desktopPosition];

  return (
    <figure
      className={cn(
        'relative flex overflow-clip w-full lg:max-h-[680px]',
        navigationShift ? 'pt-[var(--header-height,60px)]' : ''
      )}
      style={{
        minHeight: navigationShift
          ? `calc(100svh * ${scale})`
          : `calc((100svh - 60px) * ${scale})`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['--overlay-color' as any]: overlayColor,
      }}
    >
      {/* Background media */}
      {videoUrl ? (
        <video
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority={isFirst}
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* Mobile overlay text */}
      <OverlayText
        {...textProps}
        positionStyle={mobilePos.caption}
        childrenAlign={mobilePos.children}
        titleSizeClass={mobileTitleSize}
        descriptionSizeClass={descSize}
        textColor={textColor}
        hasBackground={hasBackground}
        backgroundColor={backgroundColor}
        narrow={narrow}
        isFirst={isFirst}
        className="lg:hidden"
      />

      {/* Desktop overlay text */}
      <OverlayText
        {...textProps}
        positionStyle={desktopPos.caption}
        childrenAlign={desktopPos.children}
        titleSizeClass={mobileTitleSize}
        descriptionSizeClass={descSize}
        textColor={textColor}
        hasBackground={hasBackground}
        backgroundColor={backgroundColor}
        narrow={narrow}
        isFirst={isFirst}
        className="hidden lg:flex"
      />
    </figure>
  );
}
