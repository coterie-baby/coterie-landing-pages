import { ReviewsToggleSection } from '@/components/reviews-toggle';
import UGCVideo from '@/components/ugc-video';
import FlexAnnouncementBar from '@/components/flex-announcement-bar';
import USP2 from '@/components/usp2';
import CTABanner from '@/components/cta-banner';
import AwardSlideshow from '@/components/award-slideshow';
import { FloatingCTA } from '@/components/floating-cta';

export default function UGCPage() {
  const awardSlideshowData = {
    awards: [
      {
        id: '1',
        heroText: '"Best Overall Subscription Diapers of 2025"',
        subText: 'The Bump',
        backgroundImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/f5071fcf4f2840303ed703792cdb7644bd65016b-2560x1440.jpg?w=2560&h=1440&q=90&fit=crop&auto=format',
        backgroundAlt: 'Award background',
      },
      {
        id: '2',
        heroText: '"Best Overnight Diapers of 2025"',
        subText: 'Babylist',
        backgroundImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/f791aefa05c69535c0cf41b2349fd5e73d80230e-2560x1440.jpg?w=2560&h=1440&q=90&fit=crop&auto=format',
        backgroundAlt: 'Babylist Best Of Award',
      },
      {
        id: '3',
        heroText:
          '"Good Housekeeping Popular Premium Pick of 2025: The Diaper"',
        subText: 'Good Housekeeping',
        backgroundImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/f4eb6d4b4d5b279034d3cfd66d14b58aff320b01-2667x4000.jpg?w=2667&h=4000&q=90&fit=crop&auto=format',
        backgroundAlt: 'A child playing with a ball.',
      },
      {
        id: '4',
        heroText: '"The Best Baby & Toddler Products of 2025"',
        subText: "Parents' Pick Awards",
        backgroundImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/bec524a38f8f3cc1f1a9a2606c690ef95174c8f0-3000x3000.jpg?w=3000&h=3000&q=90&fit=crop&auto=format',
        backgroundAlt: 'A child playing with a ball.',
      },
    ],
    eyebrowText: 'MORE GOOD COPY HERE',
    awardIcons: [
      'https://cdn.sanity.io/images/e4q6bkl9/production/bd555c4a348a1a12c6f04210d2144fea56135969-556x522.png',
      'https://cdn.sanity.io/images/e4q6bkl9/production/37a5c26978657e1d3b3b78ffd5bea7f2ba3fc1fc-556x522.png',
      'https://cdn.sanity.io/images/e4q6bkl9/production/e7913ff0a2d016cde5d5bcd627e28cccf79c0e20-556x522.png',
      'https://cdn.sanity.io/images/e4q6bkl9/production/088f06422cacba9c57bcfe3083b0caa479e3775e-556x522.png',
    ],
  };

  const usp2Data = {
    headline: 'Even More Good Coterie Copy',
    cards: 3,
    productCards: [
      {
        image:
          'https://cdn.sanity.io/images/e4q6bkl9/production/bd6462c2724c47ddc7cf46050ac3e940bfae9345-6000x4500.jpg?fit=max&w=1200&h=1200',
        headline: 'Fast-Wicking Technology',
        bodyCopy:
          'Keeps your baby dry all night with superior absorbency and leak protection.',
      },
      {
        image:
          'https://cdn.sanity.io/images/e4q6bkl9/production/bd6462c2724c47ddc7cf46050ac3e940bfae9345-6000x4500.jpg?fit=max&w=1200&h=1200',
        headline: 'Clean Ingredients',
        bodyCopy:
          'No fragrance, lotion, latex, dyes, chlorine, or parabens. Hypoallergenic and dermatologist tested.',
      },
      {
        image:
          'https://cdn.sanity.io/images/e4q6bkl9/production/bd6462c2724c47ddc7cf46050ac3e940bfae9345-6000x4500.jpg?fit=max&w=1200&h=1200',
        headline: 'Perfect Fit & Comfort',
        bodyCopy:
          'Soft, stretchy material with 360° fit that moves with your baby for ultimate comfort.',
      },
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
      <USP2 {...usp2Data} />
      <CTABanner
        headline="Ready to see why our products have over 25,000 5-star reviews?"
        buttonText="Shop Now"
        buttonHref="https://www.coterie.com/products/the-diaper"
      />
      <FloatingCTA />
    </>
  );
}
