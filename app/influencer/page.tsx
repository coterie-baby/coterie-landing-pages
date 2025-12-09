import ContentBanner from '@/components/content-banner';
import CTABanner from '@/components/cta-banner';
import Header from '@/components/global/header';
import ProductCardHero from '@/components/product-card-hero';
import Quote from '@/components/quote';
import DiptychMediaTitle from '@/components/diptych-media-title';

export default function InfluencerPage() {
  const contentBannerData = {
    headline: "Say Hi to Barbara's Top Diaper Pick",
    backgroundImage:
      'https://cdn.sanity.io/images/e4q6bkl9/production/efe9f6b58682949bb6f1e99cfd615dbdf78ae8d1-4160x6240.jpg?rect=358,1166,3469,3469&w=1200&h=1200&q=100&fit=crop&auto=format',
    overlay: 30 as const,
    position: 'bottom' as const,
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
      type: 'color' as const,
      color: '#FFF',
    },
  };
  return (
    <div>
      <Header />
      <ContentBanner {...contentBannerData} />
      <Quote quote="Coterie diapers are the best on the market and give me peace of mind!" />
      <DiptychMediaTitle
        backgroundColor="#F9F4EC"
        imageUrl="https://cdn.sanity.io/images/e4q6bkl9/production/a48c420d157d4b27a031e42fd2d24f2f0bcadecc-6720x4480.jpg?rect=0,350,6720,3780&w=2400&h=1350&q=100&fit=crop&auto=format"
      />
      <CTABanner />
      <ProductCardHero {...productCardHeroData} />
    </div>
  );
}
