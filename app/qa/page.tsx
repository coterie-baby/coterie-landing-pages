'use client';

import React from 'react';
import AwardSlideshow from '@/components/award-slideshow';
import ComparisonTable from '@/components/comparison-table';
import ContentBanner from '@/components/content-banner';
import DiptychMediaTitle from '@/components/diptych-media-title';
import Listicle from '@/components/listicle';
import ProductCardHero from '@/components/product-card-hero';
import ProductCrossSell from '@/components/product-cross-sell';
import SafetyStandards from '@/components/safety-standards';
// import ThreeColumnTable from '@/components/three-column-table';
import TitleBanner from '@/components/title-banner';
import USP2 from '@/components/usp2';
// import Reviews from '@/components/reviews';

export default function QAPage() {
  // Sample data for components
  const awardSlideshowData = {
    awards: [
      {
        id: '1',
        heroText: 'Headline Goes Here',
        subText: 'Sub-Header Goes Here',
        backgroundImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/b5abe843879e377543e14e433d23f194ffbcd5d3-2560x1440.jpg?w=2400&h=1350&q=100&fit=crop&auto=format',
        backgroundAlt: 'Award background',
      },
      {
        id: '2',
        heroText: 'Headline #2 Goes Here',
        subText: 'Sub-Header #2 Goes Here',
        backgroundImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/8a2cfdc1cc49bc789c06ef598b2412a9354d9049-2560x1440.jpg?w=2400&h=1350&q=100&fit=crop&auto=format',
        backgroundAlt: 'Industry background',
      },
    ],
    eyebrowText: 'PRE-HEADER GOES HERE',
    awardIcons: [
      'https://cdn.sanity.io/images/e4q6bkl9/production/cb21f2c41683833c278af0261792bb2a58b39db5-976x901.png',
      'https://cdn.sanity.io/images/e4q6bkl9/production/e29b57c295ec4246a353162cf7217121a40cfb81-1000x1000.png?w=160&h=160&q=100&fit=crop&auto=format',
    ],
  };

  const comparisonTableData = {
    title: 'How We Compare',
    columns: [
      { name: 'Feature', highlighted: false },
      { name: 'Coterie', highlighted: true },
      { name: 'Competitor A', highlighted: false },
      { name: 'Competitor B', highlighted: false },
    ],
    rows: [
      {
        label: 'Absorbency',
        values: ['Excellent', 'Good', 'Fair', 'Poor'],
        unit: '',
      },
      { label: 'Comfort', values: [true, false, true, false], unit: '' },
      { label: 'Price', values: ['$25', '$30', '$20', '$35'], unit: '' },
    ],
    footnotes: ['Based on independent testing', 'Results may vary'],
  };

  const contentBannerData = {
    headline: 'Safe for Your Baby',
    subheader: 'Our products meet the highest safety standards',
    backgroundImage:
      'https://cdn.sanity.io/images/e4q6bkl9/production/a48c420d157d4b27a031e42fd2d24f2f0bcadecc-6720x4480.jpg?rect=0,350,6720,3780&w=2400&h=1350&q=100&fit=crop&auto=format',
    overlay: 30 as const,
    position: 'middle' as const,
  };

  const listicleData = {
    banner: {
      headline: '5 Reasons Why to Choose Coterie',
      subheader: 'Discover what makes us different',
      backgroundImage:
        'https://cdn.sanity.io/images/e4q6bkl9/production/a48c420d157d4b27a031e42fd2d24f2f0bcadecc-6720x4480.jpg?rect=0,350,6720,3780&w=2400&h=1350&q=100&fit=crop&auto=format',
      overlay: 30 as const,
    },
    listItems: [
      {
        headline: 'We offer far superior absorption',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        featuredImage:
          'https://cdn.sanity.io/images/e4q6bkl9/staging/60797a928ea7334bcbb8cba7924481e18107d0d1-1646x1098.png',
        button: { label: 'Learn More', href: '#' },
        index: 0,
      },
      {
        headline: 'Comfort First',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        featuredImage:
          'https://cdn.sanity.io/images/e4q6bkl9/staging/8b49aa3a8418032a735a9230fe384de450a54212-1662x1114.png',
        button: { label: 'Learn More', href: '#' },
        index: 1,
      },
    ],
  };

  const productCardHeroData = {
    headline: "There's one for every mess",
    subheading:
      'Parenthood contains a multitude of messes—we have a wipe for every step of the way.',
    cards: [
      {
        product: {
          id: '1',
          title: 'The Wipe',
          description: '99% purified water + just 5 clean ingredients',
          href: '#',
          price: '28.00',
        },
        title: 'The Wipe',
        description: '99% purified water + just 5 clean ingredients',
        category: 'For Babies+',
        badge: 'Bestseller',
        thumbnail: {
          src: 'https://cdn.sanity.io/images/e4q6bkl9/production/df5a7f20467985464856f55fd75fe0ee3bfd688c-1920x2400.jpg?rect=0,240,1920,1920&w=2400&h=2400&q=100&fit=crop&auto=format',
          altText: 'Diaper product',
        },
      },
      {
        product: {
          id: '2',
          title: 'The Soft Wipe',
          description: 'Premium cotton-enhanced + moisturizer-infused',
          href: '#',
          price: '28.00',
        },
        title: 'The Soft Wipe',
        description: 'Premium cotton-enhanced + moisturizer-infused',
        category: 'For babies +',
        badge: 'New',
        thumbnail: {
          src: 'https://cdn.sanity.io/images/e4q6bkl9/production/2efc22da90edbd361a2b1fa39fd32c76ab9c90f1-1920x2400.png?rect=0,240,1920,1920&w=640&h=640&q=100&fit=crop&auto=format',
          altText: 'Wipes product',
        },
      },
    ],
    variant: '2-card',
    background: {
      type: 'image' as const,
      src: 'https://cdn.sanity.io/images/e4q6bkl9/production/b4735f37e41e856f91614dc55238775bc8b91d27-834x628.png?rect=0,105,834,418&w=2400&h=1203&q=100&fit=crop&auto=format',
      altText: 'Product background',
    },
  };

  const productCrossSellData = {
    headline: 'Shop More Essentials',
    products: [
      {
        id: '1',
        title: 'Night Diapers',
        description: 'Extra protection for longer nights',
        price: '89.99',
        category: 'Diapers',
        imageUrl: '/placeholder.png',
        variantId: '123',
      },
      {
        id: '2',
        title: 'Sensitive Wipes',
        description: 'For the most delicate skin',
        price: '34.99',
        category: 'Wipes',
        imageUrl: '/placeholder.png',
        variantId: '124',
      },
    ],
    mainSiteUrl: 'https://coterie.com',
  };

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

  // const reviewsData = {
  //   reviews: [
  //     {
  //       id: 1,
  //       score: 5,
  //       votes_up: 10,
  //       votes_down: 1,
  //       content: 'These diapers are amazing! No leaks and so comfortable.',
  //       title: 'Best diapers ever',
  //       created_at: '2024-01-15',
  //       verified_buyer: true,
  //       custom_fields: {
  //         size: { title: 'Size', value: 'Medium' },
  //       },
  //       user: { display_name: 'Sarah M.' },
  //     },
  //   ],
  //   totalReviews: 1234,
  //   averageRating: 4.8,
  //   productId: '4471557914690',
  // };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Component QA Page
        </h1>
        <p className="text-center text-gray-600 mb-12">
          This page displays all components for UX review and QA testing.
        </p>

        <div className="space-y-16">
          {/* Award Slideshow */}
          <section className="border-b pb-16">
            <h2 className="text-2xl font-semibold mb-4">Award Slideshow</h2>
            <AwardSlideshow {...awardSlideshowData} />
          </section>

          {/* Comparison Table */}
          <section className="border-b pb-16">
            <h2 className="text-2xl font-semibold mb-4">Comparison Table</h2>
            <ComparisonTable {...comparisonTableData} />
          </section>

          {/* Content Banner */}
          <section className="border-b pb-16">
            <h2 className="text-2xl font-semibold mb-4">Content Banner</h2>
            <ContentBanner {...contentBannerData} />
          </section>

          {/* Diptych Media Title */}
          <section className="border-b pb-16">
            <h2 className="text-2xl font-semibold mb-4">Diptych Media Title</h2>
            <DiptychMediaTitle
              backgroundColor="#F9F4EC"
              imageUrl="https://cdn.sanity.io/images/e4q6bkl9/production/a48c420d157d4b27a031e42fd2d24f2f0bcadecc-6720x4480.jpg?rect=0,350,6720,3780&w=2400&h=1350&q=100&fit=crop&auto=format"
            />
          </section>

          {/* Listicle */}
          <section className="border-b pb-16">
            <h2 className="text-2xl font-semibold mb-4">Listicle</h2>
            <Listicle {...listicleData} />
          </section>

          {/* Product Card Hero */}
          <section className="border-b pb-16">
            <h2 className="text-2xl font-semibold mb-4">Product Card Hero</h2>
            <ProductCardHero {...productCardHeroData} />
          </section>

          {/* Product Cross Sell */}
          <section className="border-b pb-16">
            <h2 className="text-2xl font-semibold mb-4">Product Cross Sell</h2>
            <ProductCrossSell {...productCrossSellData} />
          </section>

          {/* Safety Standards */}
          <section className="border-b pb-16">
            <h2 className="text-2xl font-semibold mb-4">Safety Standards</h2>
            <SafetyStandards />
          </section>

          {/* Three Column Table */}
          {/* <section className="border-b pb-16">
            <h2 className="text-2xl font-semibold mb-4">Three Column Table</h2>
            <ThreeColumnTable />
          </section> */}

          {/* Title Banner */}
          <section className="border-b pb-16">
            <h2 className="text-2xl font-semibold mb-4">Title Banner</h2>
            <TitleBanner
              headline="Welcome to Coterie"
              subheader="Premium baby care products for modern parents"
              backgroundImage="https://cdn.sanity.io/images/e4q6bkl9/production/a48c420d157d4b27a031e42fd2d24f2f0bcadecc-6720x4480.jpg?rect=0,350,6720,3780&w=2400&h=1350&q=100&fit=crop&auto=format"
              button={{
                label: 'Shop Now',
                href: '#',
              }}
            />
          </section>

          {/* USP2 */}
          <section className="border-b pb-16">
            <h2 className="text-2xl font-semibold mb-4">USP2</h2>
            <USP2 {...usp2Data} />
          </section>

          {/* Reviews */}
          {/* <section className="pb-16">
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            <Reviews {...reviewsData} />
          </section> */}
        </div>
      </div>
    </div>
  );
}
