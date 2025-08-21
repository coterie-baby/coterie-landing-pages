'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ProductCardProps {
  image: string;
  headline: string;
  bodyCopy?: string;
}

interface USP2Props {
  headline: string;
  cards?: number; // 2 or 3 cards
  productCards?: ProductCardProps[];
}

export default function USP2({ headline, cards = 3, productCards }: USP2Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<number>(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const cardElements = container.querySelectorAll('[data-card]');
      let closestCard = 0;
      let closestDistance = Infinity;

      cardElements.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardLeft = cardRect.left;
        const containerLeft = containerRect.left;
        const distance = Math.abs(cardLeft - containerLeft);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestCard = index;
        }
      });

      setActiveCard(closestCard);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const getCardOpacity = (index: number) => {
    // Active card is always full opacity, previous and next cards are 30% opacity
    if (index === activeCard) return 'opacity-100';
    if (index === activeCard - 1 || index === activeCard + 1)
      return 'opacity-30 md:opacity-100';
    return 'opacity-0 md:opacity-100'; // Cards not visible on mobile, visible on desktop
  };

  return (
    <section className="py-15 px-2.5 md:py-20 md:px-10">
      <div className="flex flex-col gap-10">
        <h3 className="text-[44px] leading-[110%] tracking-[-0.44px] md:text-center md:text-[56px] md:leading-[111%] md:tracking-[-1.12px]">
          {headline}
        </h3>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto md:overflow-x-visible gap-5 md:gap-10 scroll-smooth snap-x snap-mandatory md:snap-none [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {Array.from({ length: cards }, (_, index) => {
            console.log(productCards);
            const cardData = productCards?.[index] || {
              image:
                'https://cdn.sanity.io/images/e4q6bkl9/production/5da7c8766e7d65c99fd249291e84f0faaef4adb8-1000x1000.png?w=960&h=960&q=100&fit=crop&auto=format',
              headline: 'The Diaper',
              bodyCopy:
                'Designed to be highly absorbent and fast-wicking to minimize leaks',
            };

            return (
              <div
                key={index}
                data-card={index}
                className={`flex-shrink-0 w-[280px] md:flex-1 md:w-full snap-start md:snap-align-none transition-opacity duration-300 ${getCardOpacity(
                  index
                )}`}
              >
                <ProductCard {...cardData} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ image, headline, bodyCopy }: ProductCardProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="aspect-[5/4] md:h-[310px] relative rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={headline}
          className="h-full w-full object-cover"
          fill
        />
      </div>
      <div className="flex flex-col gap-2 border-t border-[#E7E7E7] pt-5">
        <p className="text-[18px] leading-[140%] md:text-[24px] md:leading-[110%] md:tracking-[-0.24px]">
          {headline}
        </p>
        <p className="leading-[140%] text-[#525252] md:tracking-[0.28px]">
          {bodyCopy || ''} 
        </p>
      </div>
    </div>
  );
}
