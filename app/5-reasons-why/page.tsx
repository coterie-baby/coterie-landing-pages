import CTABanner from '@/components/cta-banner';
import Listicle from '@/components/listicle';

export default function FiveReasonsWhyPage() {
  const listicleData = {
    banner: {
      headline: '5 Reasons Coterie is Setting a New Standard in Diapering',
      subheader:
        'Coterie is one of the most awarded diapers in the world, and it’s easy to see why.',
      backgroundColor: '#F9F4EC',
      textColor: '#141414',
    },
    listItems: [
      {
        headline: 'Made with totally chlorine free pulp',
        description:
          'Coterie is actually the #1 selling TCF pulp diaper on the market*. They go above and beyond – they’re certified safe from 1,000 potentially harmful chemicals including regulated PFAS* and are one of the only diaper brands to publish their Safety Report. Bonus: Their wipes (another must-have!) are EWG Verified, supremely soft, and made with 100% plant-derived fibers.',
        featuredImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/2685c2c08e2f587d672c40aa86fa7119f87740b5-1920x1080.jpg?w=2400&h=1350&q=100&fit=crop&auto=format',
        index: 0,
      },
      {
        headline: 'Free trial pack of next size up',
        description:
          'Coterie takes the guesswork out of sizing. Your first subscription box comes with a trial pack of the next size up, ensuring the perfect fit right away (plus, you save 10% when you subscribe). And with their Size Assist tool, you’ll always know when it’s time to consider moving on to the next.',
        featuredImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/fbd715d700ab17bcbf1e2bea560ffb069f4ac1e6-2048x2048.jpg?w=2400&h=2400&q=100&fit=crop&auto=format',
        index: 1,
      },
      {
        headline: 'Supports uninterrupted sleep',
        description:
          'Imagine sleeping in a damp towel… unthinkable, right? Diapers need to absorb quickly to keep your baby from waking up from the cold liquid. With up to 12 hours of leak protection, Coterie is designed for long stretches. It absorbs in record speed and holds more than two full cups of liquid (16 oz) which helps eliminate middle-of-the-night changes.',
        featuredImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/bd6462c2724c47ddc7cf46050ac3e940bfae9345-6000x4500.jpg?w=2400&h=1800&q=100&fit=crop&auto=format',
        index: 2,
      },
      {
        headline: 'Bye bye leaks, blowouts, and diaper rash',
        description:
          'Coterie’s blowout-blocking fit, super fast absorption, and high liquid capacity work together to help stop leaks and blowouts before they happen. Think: Fewer changes, less laundry, and happier babies and parents. 94% of parents report no skin irritation – Coterie minimizes the case of moisture-related diaper rash.',
        featuredImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/7e03c2af841f49de58758cdc762a64c4a90ce3a7-3000x3000.jpg?w=2400&h=2400&q=100&fit=crop&auto=format',
        index: 3,
      },
      {
        headline: '24/7 diaper concierge',
        description:
          'Our top-tier service is always available (even via text!) and ready to adjust your size, reschedule a delivery, track down a package, or answer any questions. From fit guidance to diaper advice, we’ve got you covered 24/7.',
        featuredImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/60797a928ea7334bcbb8cba7924481e18107d0d1-1646x1098.png?rect=0,1,1646,1097&w=2400&h=1600&q=100&fit=crop&auto=format',
        index: 4,
      },
    ],
  };

  return (
    <div>
      <Listicle {...listicleData} />
      <CTABanner
        headline="Ready to see why our products have over 25,000 5-star reviews?"
        buttonText="Shop Now"
        buttonHref="https://www.coterie.com/products/the-diaper"
      />
    </div>
  );
}
