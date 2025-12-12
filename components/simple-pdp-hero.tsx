'use client';
import Image from 'next/image';

interface SimplePDPHeroProps {
  imageUrl?: string;
  imageAlt?: string;
  title?: string;
  rating?: number;
  reviewCount?: number;
  description?: string;
  price?: string;
}

export default function SimplePDPHero({
  imageUrl = 'https://cdn.sanity.io/images/e4q6bkl9/production/bd6462c2724c47ddc7cf46050ac3e940bfae9345-6000x4500.jpg?fit=max&w=1200&h=1200',
  imageAlt = 'Product image',
  title = 'The Diaper',
  rating = 4.8,
  reviewCount = 8955,
  description = 'A fast wicking, highly absorbent diaper with clean ingredients',
  price = '$95/month',
}: SimplePDPHeroProps) {
  return (
    <section className="bg-white">
      {/* Hero Image - Full width, no padding */}
      <div className="relative w-full aspect-square">
        <Image
          fill
          src={imageUrl}
          alt={imageAlt}
          className="object-cover"
        />
      </div>

      {/* Product Info - Below the image */}
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-[#0000C9]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.215 3.74a1 1 0 00.95.69h3.932c.969 0 1.371 1.24.588 1.81l-3.184 2.314a1 1 0 00-.364 1.118l1.215 3.74c.3.921-.755 1.688-1.54 1.118L10 13.011l-3.184 2.314c-.784.57-1.838-.197-1.54-1.118l1.215-3.74a1 1 0 00-.364-1.118L3.943 9.167c-.783-.57-.38-1.81.588-1.81h3.932a1 1 0 00.95-.69l1.215-3.74z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#0000C9]">
                  {rating} ({reviewCount.toLocaleString()} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-[#525252] text-base leading-relaxed mb-4">
                {description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-2xl font-bold text-[#0000C9]">
                  {price}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

