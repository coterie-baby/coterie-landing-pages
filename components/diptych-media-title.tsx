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
  // Handle Builder.io file object or string URL
  const getImageUrl = (url: string | { url: string } | undefined): string => {
    if (!url) return '/placeholder.svg';
    if (typeof url === 'string') return url;
    return url.url || '/placeholder.svg';
  };

  return (
    <section style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 items-center ${
            imagePosition === 'right' ? 'lg:grid-flow-col-dense' : ''
          }`}
        >
          {/* Image */}
          <div
            className={`${imagePosition === 'right' ? 'lg:col-start-2' : ''}`}
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={getImageUrl(imageUrl)}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              />
            </div>
          </div>

          {/* Content */}
          <div
            className={`pt-8 px-4 ${
              imagePosition === 'right' ? 'lg:col-start-1' : ''
            }`}
          >
            <div className="space-y-10">
              {/* Main Heading */}
              <h3>{mainHeading}</h3>

              {/* Two Column Content */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-4 py-4 border-t border-[#E7E7E7]">
                  <h5>{leftColumnTitle}</h5>
                  <div className="text-sm text-[#525252] leading-relaxed">
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
