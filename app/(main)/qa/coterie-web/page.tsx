import { ProductPush } from '@/components/product-push';
import Hero from '@/components/coterie-web/hero';

export default function CoterieWebQAPage() {
  return (
    <div>
      <Hero
        imageUrl="https://www.figma.com/api/mcp/asset/6d1baad5-6eac-4a53-9d58-06603afa49e2"
        overlay={2}
        overlayText={{
          title: 'Upgrade your\ndiapering routine',
          links: [{ _key: '1', label: 'Shop The Diaper', href: '/products/diaper' }],
          position: { mobile: 'bottom-center', desktop: 'center' },
          textColor: '#ffffff',
          titleSize: { mobile: 'h2', desktop: 'h1' },
        }}
        isFirst
        navigationShift={false}
      />
      <ProductPush
        cards={[
          {
            title: 'The Diaper',
            description:
              'Minimize leaks, blowouts, and the likelihood of diaper rash.',
            image: 'https://www.figma.com/api/mcp/asset/ba979127-61d5-4b37-b681-85fcd569ab69',
            ctaText: 'Shop The Diaper',
            ctaHref: '/products/diaper',
          },
          {
            title: 'The Pant',
            description: 'Easy changes and free movement for active babies.',
            image: 'https://www.figma.com/api/mcp/asset/d4714015-e006-43b9-9525-ad4ee2548167',
            ctaText: 'Shop The Pant',
            ctaHref: '/products/pant',
          },
        ]}
      />
    </div>
  );
}
