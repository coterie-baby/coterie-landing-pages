import dynamic from 'next/dynamic';
import UGCVideo from '@/components/ugc-video';
import FlexAnnouncementBar from '@/components/flex-announcement-bar';
import { FloatingCTA } from '@/components/floating-cta';
import OrderTypeSelector from '@/components/order-type-selector';

// Lazy load below-fold components
const ReviewsToggleSection = dynamic(
  () =>
    import('@/components/reviews-toggle').then(
      (mod) => mod.ReviewsToggleSection
    ),
  {
    loading: () => <div className="min-h-[600px] bg-gray-50 animate-pulse" />,
  }
);

const AwardSlideshow = dynamic(() => import('@/components/award-slideshow'), {
  loading: () => <div className="h-[80vh] bg-gray-100 animate-pulse" />,
});

const SocialPosts = dynamic(() => import('@/components/social-posts'), {
  loading: () => <div className="min-h-[500px] bg-white animate-pulse" />,
});

const CTABanner = dynamic(() => import('@/components/cta-banner'), {
  loading: () => <div className="min-h-[200px] bg-gray-50 animate-pulse" />,
});

export default function UGCPage() {
  // Mobile-optimized image sizes (2x retina)
  const awardSlideshowData = {
    awards: [
      {
        id: '1',
        heroText: '"Best Overall Subscription Diapers of 2025"',
        subText: 'The Bump',
        backgroundImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/f5071fcf4f2840303ed703792cdb7644bd65016b-2560x1440.jpg?rect=899,0,810,1440&w=1200&h=2133&q=100&fit=crop&auto=format',
        backgroundAlt: 'Award background',
      },
      {
        id: '2',
        heroText: '"Best Overnight Diapers of 2025"',
        subText: 'Babylist',
        backgroundImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/f791aefa05c69535c0cf41b2349fd5e73d80230e-2560x1440.jpg?rect=1528,0,810,1440&w=1200&h=2133&q=100&fit=crop&auto=format',
        backgroundAlt: 'Babylist Best Of Award',
      },
      {
        id: '3',
        heroText:
          '"Good Housekeeping Popular Premium Pick of 2025: The Diaper"',
        subText: 'Good Housekeeping',
        backgroundImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/f4eb6d4b4d5b279034d3cfd66d14b58aff320b01-2667x4000.jpg?rect=209,0,2250,4000&w=1200&h=2133&q=100&fit=crop&auto=format',
        backgroundAlt: 'A child playing with a ball.',
      },
      {
        id: '4',
        heroText: '"The Best Baby & Toddler Products of 2025"',
        subText: "Parents' Pick Awards",
        backgroundImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/bec524a38f8f3cc1f1a9a2606c690ef95174c8f0-3000x3000.jpg?rect=656,0,1688,3000&w=1200&h=2133&q=100&fit=crop&auto=format',
        backgroundAlt: 'A child playing with a ball.',
      },
    ],
    eyebrowText: 'The Trophy Case Is Full',
    awardIcons: [
      'https://cdn.sanity.io/images/e4q6bkl9/production/bd555c4a348a1a12c6f04210d2144fea56135969-556x522.png?w=128&h=128&q=80&fit=crop&auto=format',
      'https://cdn.sanity.io/images/e4q6bkl9/production/37a5c26978657e1d3b3b78ffd5bea7f2ba3fc1fc-556x522.png?w=128&h=128&q=80&fit=crop&auto=format',
      'https://cdn.sanity.io/images/e4q6bkl9/production/e7913ff0a2d016cde5d5bcd627e28cccf79c0e20-556x522.png?w=128&h=128&q=80&fit=crop&auto=format',
      'https://cdn.sanity.io/images/e4q6bkl9/production/088f06422cacba9c57bcfe3083b0caa479e3775e-556x522.png?w=128&h=128&q=80&fit=crop&auto=format',
    ],
  };

  return (
    <>
      <UGCVideo />
      <FlexAnnouncementBar
        announcement="Over 25,000 5-Star Reviews"
        showStars={true}
        rating={5}
      />
      <ReviewsToggleSection />
      <AwardSlideshow {...awardSlideshowData} />
      <SocialPosts />
      <CTABanner
        headline="Ready to see why our products have over 25,000 5-star reviews?"
        buttonText="Shop Now"
        buttonHref="https://www.coterie.com/products/the-diaper"
      />
      <OrderTypeSelector />
      <FloatingCTA />
    </>
  );
}
