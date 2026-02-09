import OrderTypeSelector from '@/components/order-type-selector';
import USP2 from '@/components/usp2';
import Reviews from '@/components/reviews';
import SocialPosts from '@/components/social-posts';
import DiptychMediaTitle from '@/components/diptych-media-title';

const diaperUSPCards = [
  {
    image:
      'https://cdn.sanity.io/images/e4q6bkl9/production/9d7a260cecbd200206a701775abbf817720c0301-1200x865.jpg?rect=168,0,865,865&w=960&h=960&q=100&fit=crop&auto=format',
    headline: 'Proven hypoallergenic',
    bodyCopy:
      'All materials that may come in contact with your baby’s skin are dermatologist-tested and proven hypoallergenic.',
  },
  {
    image:
      'https://cdn.sanity.io/images/e4q6bkl9/production/93efd0099f6dd30495fe07bd958205970aacd566-1200x865.jpg?rect=168,0,865,865&w=960&h=960&q=100&fit=crop&auto=format',
    headline: '25% plant-based',
    bodyCopy:
      'The Diaper is cruelty-free and made with responsibly sourced, TCF (Totally Chlorine Free) wood pulp from sustainably managed forests.',
  },
  {
    image:
      'https://cdn.sanity.io/images/e4q6bkl9/production/01f0a320e0b37e59c68f12ff3e0b2453755ed4be-1200x865.jpg?rect=168,0,865,865&w=960&h=960&q=100&fit=crop&auto=format',
    headline: 'Apparel-grade materials',
    bodyCopy:
      'Apex® Technology provides supreme softness, while our exclusive 3D backsheet and elasticized leg cuffs help protect against blowouts and chafing.',
  },
];

export default function DiaperPDPPage() {
  return (
    <div>
      <OrderTypeSelector />
      <DiptychMediaTitle
        imageUrl="https://cdn.sanity.io/images/e4q6bkl9/production/ec5a384428110d9ddc4b1445fdfdb118d4beb658-6720x4480.png?w=1920&q=80&auto=format"
        backgroundColor="#F9F4EC"
      />
      <USP2
        headline="Made gentle for delicate skin"
        productCards={diaperUSPCards}
      />
      <SocialPosts title="Your babies in Coterie" />
      <Reviews productId="4471557914690" />
    </div>
  );
}
