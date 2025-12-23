'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface SocialPost {
  id: string;
  username: string;
  imageUrl: string;
  imageAlt: string;
}

interface SocialPostsProps {
  title?: string;
  subtitle?: string;
  posts?: SocialPost[];
  backgroundColor?: string;
}

// Mobile-optimized: 280px cards × 2x retina = 560px, aspect ratio 3:4
const defaultPosts: SocialPost[] = [
  {
    id: '1',
    username: '@aileciajones',
    imageUrl:
      'https://cdn.sanity.io/images/e4q6bkl9/production/ea68440bf4fd21982bc70029fa437bdede6b0040-1080x1350.jpg?w=560&h=747&q=80&fit=crop&auto=format',
    imageAlt: 'Mother holding baby',
  },
  {
    id: '2',
    username: '@lismilice',
    imageUrl:
      'https://cdn.sanity.io/images/e4q6bkl9/production/3d0908ac274ce13ec0b7dc5904a38c5c3dc98b98-469x637.png?w=560&h=747&q=80&fit=crop&auto=format',
    imageAlt: 'Baby at the beach',
  },
  {
    id: '3',
    username: '@thesuncoastblonde',
    imageUrl:
      'https://cdn.sanity.io/images/e4q6bkl9/production/a491f5df1009b55bee0467f7109eaeb8ace4a2e1-1440x1800.jpg?w=560&h=747&q=80&fit=crop&auto=format',
    imageAlt: 'Baby with plants',
  },
  {
    id: '4',
    username: '@elyse.fox',
    imageUrl:
      'https://cdn.sanity.io/images/e4q6bkl9/production/4c14d3696ee3355ab40e7a8049c4aa034d400fa5-531x642.png?w=560&h=747&q=80&fit=crop&auto=format',
    imageAlt: 'Baby smiling',
  },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export default function SocialPosts({
  title = 'Diapers good enough to post',
  subtitle = '',
  posts = defaultPosts,
  backgroundColor = '#f9f4ec',
}: SocialPostsProps) {
  // Create extended array with clones for infinite loop
  const extendedPosts = [...posts, ...posts, ...posts];
  const startIndex = posts.length; // Start at the middle set

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const cardWidth = 280;
  const cardGap = 20;
  const totalCardWidth = cardWidth + cardGap;

  // Handle seamless loop reset
  useEffect(() => {
    if (!isTransitioning) return;

    const handleTransitionEnd = () => {
      // If we've gone past the middle set, reset to equivalent position
      if (currentIndex >= posts.length * 2) {
        setIsTransitioning(false);
        setCurrentIndex(currentIndex - posts.length);
      } else if (currentIndex < posts.length) {
        setIsTransitioning(false);
        setCurrentIndex(currentIndex + posts.length);
      }
    };

    const timeout = setTimeout(handleTransitionEnd, 400);
    return () => clearTimeout(timeout);
  }, [currentIndex, posts.length, isTransitioning]);

  // Re-enable transitions after instant reset
  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setTranslateX(0);
  }, []);

  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4000);
  }, []);

  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [resetAutoPlay]);

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = totalCardWidth / 3;
    if (translateX > threshold) {
      goToSlide(currentIndex - 1);
    } else if (translateX < -threshold) {
      goToSlide(currentIndex + 1);
    } else {
      setTranslateX(0);
    }

    resetAutoPlay();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Calculate real index for progress bar (modulo posts.length)
  // const realIndex =
  //   ((currentIndex % posts.length) + posts.length) % posts.length;
  // const progressWidth = ((realIndex + 1) / posts.length) * 100;

  return (
    <section
      className="py-16 md:py-24 overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Header */}
      <div className="text-center px-4 mb-12 md:mb-16">
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">
          {title}
        </h3>
        <p className="text-lg md:text-xl italic text-gray-700">{subtitle}</p>
      </div>

      {/* Carousel */}
      <div
        ref={containerRef}
        className="relative cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex items-center ease-out"
          style={{
            transform: `translateX(calc(50vw - ${cardWidth / 2}px - ${currentIndex * totalCardWidth}px + ${translateX}px))`,
            transitionProperty: 'transform',
            transitionDuration:
              isDragging || !isTransitioning ? '0ms' : '400ms',
          }}
        >
          {extendedPosts.map((post, index) => {
            const isActive = index === currentIndex;
            const distance = Math.abs(index - currentIndex);
            const scale = isActive ? 1 : Math.max(0.8, 1 - distance * 0.1);
            const opacity = distance > 2 ? 0.5 : 1 - distance * 0.1;

            return (
              <div
                key={`${post.id}-${index}`}
                className="flex-shrink-0 transition-all duration-400 ease-out"
                style={{
                  width: cardWidth,
                  marginRight: cardGap,
                  transform: `scale(${scale})`,
                  opacity,
                  zIndex: isActive ? 10 : 10 - distance,
                }}
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                  {/* Placeholder gradient if no image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />

                  {/* Image */}
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt}
                    fill
                    loading="lazy"
                    className="object-cover"
                    sizes="280px"
                    draggable={false}
                  />

                  {/* Instagram overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 text-white drop-shadow-lg">
                    <InstagramIcon className="w-6 h-6" />
                    <span className="text-sm font-medium">{post.username}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      {/* <div className="flex justify-center mt-8 md:mt-12 px-4">
        <div className="w-48 md:w-64 h-1 bg-gray-300/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-400 rounded-full transition-all duration-400 ease-out"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div> */}
    </section>
  );
}
