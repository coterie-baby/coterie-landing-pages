import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import USP2 from '@/components/usp2';
import DiptychMediaTitle from '@/components/diptych-media-title';
import { ReviewsToggleSection } from '@/components/reviews-toggle';
import FlexAnnouncementBar from '@/components/flex-announcement-bar';
import CTABanner from '@/components/cta-banner';

export default function LandingPage() {
  const usp2Data = {
    headline: 'Designed for performance and comfort',
    cards: 3,
    productCards: [
      {
        image:
          'https://cdn.sanity.io/images/e4q6bkl9/production/4a078422f76dfdda4483b4c621917c725061e9a8-2919x4355.jpg?rect=0,1692,2674,1883&w=2400&h=1690&q=100&fit=crop&auto=format',
        headline: 'Soft, 360° stretch',
        bodyCopy:
          'The Swimsuit’s compact, plant-based core is made with a special no-swell design that won’t balloon or sag in water.',
      },
      {
        image:
          'https://cdn.sanity.io/images/e4q6bkl9/production/4a078422f76dfdda4483b4c621917c725061e9a8-2919x4355.jpg?rect=0,1692,2674,1883&w=2400&h=1690&q=100&fit=crop&auto=format',
        headline: 'Leak-guard leg cuffs',
        bodyCopy:
          'The Swimsuit’s compact, plant-based core is made with a special no-swell design that won’t balloon or sag in water.',
      },
      {
        image:
          'https://cdn.sanity.io/images/e4q6bkl9/production/4a078422f76dfdda4483b4c621917c725061e9a8-2919x4355.jpg?rect=0,1692,2674,1883&w=2400&h=1690&q=100&fit=crop&auto=format',
        headline: 'No-swell core',
        bodyCopy:
          'The Swimsuit’s compact, plant-based core is made with a special no-swell design that won’t balloon or sag in water.',
      },
    ],
  };

  return (
    <>
      <section className="h-[70vh] p-4 relative">
        <Image
          src="https://cdn.sanity.io/images/e4q6bkl9/staging/efd7fded0b766b196c98f754708a81eadd664810-4500x6000.jpg"
          alt="Baby wearing Coterie diaper"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="relative z-10 h-full">
          <div className="flex flex-col gap-3 justify-end pb-10 h-full text-center">
            <h3 className="text-2xl font-medium text-white">
              Diapering without all the stress
            </h3>
            <p className="text-white text-sm">
              Lorem ipsum dolor mont blanc red leather yellow leather blue
              bloods on christmas
            </p>
            <div className="w-full flex justify-center">
              <Link href="#" target="_blank">
                <Button
                  data-cta-location="Title Banner"
                  data-cta-text="Get Started"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <FlexAnnouncementBar />
      <USP2 {...usp2Data} />
      <DiptychMediaTitle
        backgroundColor="#F9F4EC"
        imageUrl="https://cdn.sanity.io/images/e4q6bkl9/production/a48c420d157d4b27a031e42fd2d24f2f0bcadecc-6720x4480.jpg?rect=0,350,6720,3780&w=2400&h=1350&q=100&fit=crop&auto=format"
      />
      <ReviewsToggleSection />
      <CTABanner />
    </>
  );
}
