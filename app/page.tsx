import ProductCardHero from '@/components/product-card-hero';

export default function Home() {
  return (
    <div>
      <ProductCardHero
        variant="3-card"
        headline="For every step of the journey"
        subheading="Parenthood contains multitudes, and a multitude of messes—we have wipes to take care of them all, along every stage of your child’s journey to independence."
        cards={[
          {
            product: {
              id: '1',
              title: 'The Diaper',
              price: '65',
              href: '/products/diaper',
            },
            title: 'Ultra Protection',
            description: 'Maximum absorption for all-day comfort',
            category: 'Essentials',
            badge: 'Bestseller',
            thumbnail: {
              src: '/bg-placeholder.png',
              altText: 'The Diaper product',
            },
          },
          {
            product: {
              id: '2',
              title: 'Premium Wipes',
              price: '25',
              href: '/products/wipes',
            },
            title: 'Gentle Care',
            description: 'Soft and safe for sensitive skin',
            category: 'Care',
            thumbnail: {
              src: '/bg-placeholder.png',
              altText: 'Premium Wipes product',
            },
          },
          {
            product: {
              id: '3',
              title: 'Baby Cream',
              price: '18',
              href: '/products/cream',
            },
            title: 'Soothing Formula',
            description: 'Protective barrier for delicate skin',
            category: 'Skincare',
            badge: 'New',
            thumbnail: {
              src: '/bg-placeholder.png',
              altText: 'Baby Cream product',
            },
          },
        ]}
      />
    </div>
  );
}
