import Image from 'next/image';

interface DiptychMediaTitleProps {
  // Image props
  imageUrl?: string | { url: string };
  imageAlt?: string;

  // Main heading
  mainHeading?: string;

  // Left column
  leftColumnTitle?: string;
  leftColumnContent?: string;

  // Right column
  rightColumnTitle?: string;
  rightColumnContent?: string;

  // Layout options
  imagePosition?: 'left' | 'right';
  backgroundColor?: string;
}

export default function DiptychMediaTitle({
  imageUrl = '/images/child-outdoor.png',
  imageAlt = 'Child wearing tie-dye shirt outdoors',
  mainHeading = 'Our products undergo dual safety testing:',
  leftColumnTitle = 'Chemical compound testing',
  leftColumnContent = 'Our products are proven to be free, below detectable levels, or (when regulation exists) significantly below allowed levels of 200+ chemicals that may be considered toxic or harmful for use. We continually update what we test for as regulations and awareness of ingredient safety evolve.',
  rightColumnTitle = 'Clinical HRIPT testing',
  rightColumnContent = "All materials that may come in contact with your baby's skin undergo clinical testing for allergenicity and sensitization, and are proven hypoallergenic in independent labs under the supervision of board-certified dermatologists.",
  imagePosition = 'left',
  backgroundColor = '#ffffff',
}: DiptychMediaTitleProps) {
  // Handle Sanity file object or string URL
  const getImageUrl = (url: string | { url: string } | undefined): string => {
    if (!url) return '/placeholder.svg';
    if (typeof url === 'string') return url;
    return url.url || '/placeholder.svg';
  };

  return (
    <section style={{ backgroundColor }}>
      <div className="">
        <div
          className={`flex flex-col md:flex-row md:h-[900px] ${
            imagePosition === 'right' ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {/* Image */}
          <div className="w-full lg:w-1/2 md:h-full">
            {/* Mobile: Square with fill */}
            <div className="relative aspect-square w-full lg:hidden">
              <Image
                src={getImageUrl(imageUrl)}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            {/* Desktop: Full height */}
            <div className="relative hidden lg:block w-full h-full">
              <Image
                src={getImageUrl(imageUrl)}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 pt-8 px-4 md:p-15 md:h-full">
            <div className="space-y-10 md:flex md:flex-col md:justify-between md:h-full">
              {/* Main Heading */}
              <h3>{mainHeading}</h3>

              {/* Two Column Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
                {/* Left Column */}
                <div className="space-y-4 py-4 border-t border-[#E7E7E7]">
                  <p className="text-[22px] md:text-[17px] md:leading-[140%]">
                    {leftColumnTitle}
                  </p>
                  <div className="text-xs text-[#525252] leading-relaxed md:text-sm">
                    {typeof leftColumnContent === 'string' ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: leftColumnContent }}
                      />
                    ) : (
                      leftColumnContent
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4 py-4 border-t border-[#E7E7E7]">
                  <h5>{rightColumnTitle}</h5>
                  <div className="text-sm text-[#525252] leading-relaxed">
                    {typeof rightColumnContent === 'string' ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: rightColumnContent }}
                      />
                    ) : (
                      rightColumnContent
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
