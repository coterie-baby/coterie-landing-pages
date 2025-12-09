import CTABanner from '@/components/cta-banner';
import Listicle from '@/components/listicle';

export default function SubscriptionPerksPage() {
  const listicleData = {
    banner: {
      headline: "You won't believe what comes with auto-renew",
      subheader: 'Stay stocked, save time and access exclusive member perks',
      backgroundColor: '#F9F4EC',
      textColor: '#141414',
    },
    listItems: [
      {
        headline: 'Size Assist',
        description:
          'Most leaks and blowouts come down to the wrong diaper size. That’s why we created this subscription-exclusive feature, with easy access to fit guides + a free trial pack of the next size with your first order, along with customized nudges to the next size or product—all based on how your little one is growing.',
        featuredImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/8dad42d12e2c915b43628a39324fde71a62e3252-1200x1200.png?w=2400&h=2400&q=100&fit=crop&auto=format',
        button: { label: 'Shop The Diaper', href: '#' },
        index: 0,
      },
      {
        headline: '24/7 Concierge',
        description:
          'Our concierge team is just an email or text away, ready to answer all of your questions. We’ll also always send a reminder before your next order ships in case you want to make changes.',
        featuredImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/322eb53159d9e73aea6736eb5c1a8f80a973ba52-1200x1200.png?w=2400&h=2400&q=100&fit=crop&auto=format',
        button: { label: "We're Standing By", href: '#' },
        index: 1,
      },
      {
        headline: 'Choose Your Schedule',
        description:
          'Manage your delivery frequency (each order has about a month’s supply of product) with the option to adjust, hold, or expedite shipments via email or text—and of course, delay or cancel at any time.',
        featuredImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/b55a06d78b305bef2660d0ba8f0665df4df6ce0f-1200x1200.png?w=2400&h=2400&q=100&fit=crop&auto=format',
        button: { label: 'Subscribe Now', href: '#' },
        index: 2,
      },
      {
        headline: 'Exclusive Access to Single Packs',
        description:
          'Need more diapers or pants each month to bridge the gap or want to try a new size? Add up to 2 single packs to your next shipment (note: one month’s supply = 6 single packs). And if you’re going on vacation, send single packs directly to your domestic destinations—diapers, pants, wipes, even swim diapers!',
        featuredImage:
          'https://cdn.sanity.io/images/e4q6bkl9/production/f302d3170670bec3dd188f8c5c776ae2c3fa3c95-1200x1200.png?w=2400&h=2400&q=100&fit=crop&auto=format',
        button: { label: "We'll Meet You There", href: '#' },
        index: 3,
      },
    ],
  };

  return (
    <div>
      <Listicle {...listicleData} />
      <CTABanner />
    </div>
  );
}
