import Image from 'next/image';
import { Button } from './ui/button';

export interface ProductPushProps {
  cards: [ProductPushCardProps, ProductPushCardProps];
}

export function ProductPush({ cards }: ProductPushProps) {
  return (
    <div className="flex flex-col gap-[20px] px-[16px] py-[20px] w-full lg:flex-row lg:justify-center lg:px-[40px] lg:py-[80px]">
      {cards.map((card, i) => (
        <ProductPushCard key={i} {...card} />
      ))}
    </div>
  );
}

export interface ProductPushCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  ctaText: string;
  ctaHref: string;
}

export default function ProductPushCard({
  title,
  description,
  image,
  imageAlt = '',
  ctaText,
  ctaHref,
}: ProductPushCardProps) {
  return (
    <div className="
      bg-[#D1E3FB] rounded-[8px] w-full
      flex flex-col gap-[24px] items-center py-[32px]
      lg:relative lg:block lg:overflow-hidden lg:h-[678px] lg:w-[610px] lg:shrink-0 lg:py-0
    ">
      {/* Text + CTA — stacked/centered on mobile, absolute top bar on desktop */}
      <div className="
        flex flex-col gap-[10px] items-center text-center
        lg:absolute lg:top-[40px] lg:left-0 lg:w-full lg:px-[40px]
        lg:flex-row lg:items-start lg:justify-between lg:text-left lg:gap-0
      ">
        <div className="flex flex-col gap-[10px] lg:gap-[12px]">
          <h3 className="
            text-[38px] leading-[1.2] tracking-[-0.76px] text-[#141414] w-[243px]
            lg:text-[42px] lg:leading-[1.1] lg:tracking-[-0.84px] lg:w-auto lg:whitespace-nowrap
          ">
            {title}
          </h3>
          <p className="
            text-[16px] leading-[1.4] text-[rgba(39,39,39,0.7)] w-[243px]
            lg:text-[14px] lg:tracking-[-0.28px] lg:opacity-90 lg:w-[315px]
          ">
            {description}
          </p>
        </div>

        {/* Desktop-only CTA */}
        <Button asChild className="hidden lg:flex">
          <a href={ctaHref}>{ctaText}</a>
        </Button>
      </div>

      {/* Mobile image — art-directed overflow, rendered at 343×314 */}
      <div className="relative h-[314px] w-[343px] overflow-hidden lg:hidden">
        <div style={{ position: 'absolute', left: '-21.74%', top: '-21.13%', width: '146.82%', height: '141.61%' }}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="343px"
            className="object-contain"
          />
        </div>
      </div>

      {/* Desktop image — 606×606 square pinned to bottom center */}
      <div className="hidden lg:block lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:size-[606px]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="606px"
          className="object-contain"
        />
      </div>

      {/* Mobile-only CTA */}
      <Button asChild className="lg:hidden">
        <a href={ctaHref}>{ctaText}</a>
      </Button>
    </div>
  );
}
