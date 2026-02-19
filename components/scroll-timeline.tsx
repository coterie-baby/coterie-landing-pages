'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';

interface TimelineItem {
  subheading: string;
  description: string;
}

interface ScrollTimelineProps {
  imageUrl?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  items?: TimelineItem[];
}

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export default function ScrollTimeline({
  imageUrl,
  imageAlt,
  title,
  description,
  items = [],
}: ScrollTimelineProps) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const update = () => {
      const windowH = window.innerHeight;

      // Grow the line based on scroll progress through the timeline container
      if (timelineRef.current && lineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const raw = (windowH * 0.75 - rect.top) / rect.height;
        lineRef.current.style.height = `${Math.max(0, Math.min(1, raw)) * 100}%`;
      }

      // Reveal/hide each item based on its own position in the viewport
      itemRefs.current.forEach((ref) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        // Start revealing when item top crosses 90% of viewport, fully in at 65%
        const raw = 1 - (rect.top - windowH * 0.65) / (windowH * 0.25);
        const progress = easeOutQuad(Math.max(0, Math.min(1, raw)));
        ref.style.opacity = String(progress);
        ref.style.transform = `translateY(${(1 - progress) * 28}px)`;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [items]);

  return (
    <section className="bg-white">
      {/* Featured image */}
      <div className='px-4'>
        {imageUrl && (
        <div className="relative w-full aspect-[4/3] overflow-hidden min-h-[425px]">
          <Image src={imageUrl} alt={imageAlt ?? ''} fill className="object-cover" />
        </div>
        )}
      </div>

      {/* Title + description */}
      <div className="px-4 md:px-10 pt-8 pb-8">
        {title && (
          <span className="text-2xl md:text-5xl leading-tight mb-2">
            {title}
          </span>
        )}
        {description && (
          <p className="text-[#525252] text-base md:text-lg leading-relaxed">{description}</p>
        )}
      </div>

      {/* Timeline */}
      {items.length > 0 && (
        <div ref={timelineRef} className="relative px-4 md:px-10 pb-16">
          {/* Vertical line track */}
          <div className="absolute left-[22px] md:left-[46px] -translate-x-1/2 top-[10px] bottom-8 w-[1.5px] bg-gray-200">
            <div ref={lineRef} className="absolute top-0 left-0 w-full bg-[#0000C9] opacity-75" />
          </div>

          <div className="space-y-14">
            {items.map((item, i) => (
              <div
                key={i}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="flex gap-6 items-start"
                style={{ opacity: 0, transform: 'translateY(28px)' }}
              >
                {/* Dot */}
                <div className="flex-shrink-0 w-3 h-3 rounded-full bg-[#0000C9] mt-1 relative z-10" />
                {/* Content */}
                <div>
                  <span className="text-[#0000C9] text-lg mb-2">{item.subheading}</span>
                  <p className="text-[#525252] text-base leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
