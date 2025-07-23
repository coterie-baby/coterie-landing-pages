import ComparisonTable from '@/components/comparison-table';
import TitleBanner from '@/components/title-banner';
import DiptychMediaTitle from '@/components/diptych-media-title';
import ProductCardHero from '@/components/product-card-hero';
import { ProductCard } from '@/components/product-card';
import ProductCrossSell from '@/components/product-cross-sell';
import SafetyStandards from '@/components/safety-standards';
import ThreeColumnTable from '@/components/three-column-table';
import Usp2 from '@/components/usp2';
import Header from '@/components/global/header';
import Footer from '@/components/global/footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Reviews from '@/components/reviews';
import { StarRating } from '@/components/reviews/star-rating';

export default function ComponentsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-15 bg-white border-b">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-center mb-4">
            Component Library
          </h1>
          <p className="text-lg text-center text-gray-600">
            All available components with example implementations
          </p>
        </div>
      </section>

      {/* Global Components */}
      <section className="py-15 bg-white">
        <div className="px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Global Components
          </h2>

          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">Header</h3>
              <Header />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">Footer</h3>
              <Footer />
            </div>
          </div>
        </div>
      </section>

      {/* Hero Components */}
      <section className="py-15 bg-gray-100">
        <div className="px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Hero Components
          </h2>

          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Title Banner
              </h3>
              <TitleBanner
                headline="Welcome to the Headline!"
                subheader="It's one of the hardest, wildest, most all-consuming adventures you'll go on, and right now your job is to soak it all in. Ours is to make the cleanest, safest, highest-performing diapering products, and deliver them to you in the most convenient ways possible."
                backgroundImage="/bg-placeholder.png"
                button={{ label: 'Shop The Diaper', href: '#' }}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Product Card Hero
              </h3>
              <ProductCardHero
                variant="3-card"
                headline="Choose Your Perfect Diaper"
                subheading="Premium protection for every stage"
                cards={[
                  {
                    product: {
                      id: '1',
                      title: 'The Diaper',
                      price: '$65',
                      href: '/products/diaper',
                    },
                    title: 'Ultra Protection',
                    description: 'Maximum absorption for all-day comfort',
                    category: 'Essentials',
                    badge: 'Best Seller',
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
          </div>
        </div>
      </section>

      {/* Product Components */}
      <section className="py-15 bg-white">
        <div className="px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Product Components
          </h2>

          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Product Card
              </h3>
              <div className="flex justify-center">
                <ProductCard
                  card={{
                    product: {
                      id: '1',
                      title: 'The Diaper',
                      price: '65',
                      href: '/products/diaper',
                    },
                    title: 'Ultra Protection',
                    description: 'Ultra-soft, super-absorbent protection',
                    thumbnail: {
                      src: '/product-placeholder.jpg',
                      altText: 'The Diaper product',
                    },
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Product Cross Sell
              </h3>
              <ProductCrossSell
                headline="Shop More Diapering Essentials"
                products={[
                  {
                    id: '1',
                    title: 'Baby Wipes',
                    description: 'Gentle and effective cleaning',
                    price: '24.99',
                    category: 'Essentials',
                    imageUrl: '/wipes-placeholder.jpg',
                    variantId: 'wipes-variant-id',
                  },
                  {
                    id: '2',
                    title: 'Diaper Cream',
                    description: 'Protective barrier for sensitive skin',
                    price: '16.99',
                    category: 'Care',
                    imageUrl: '/cream-placeholder.jpg',
                    variantId: 'cream-variant-id',
                  },
                ]}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                USP2 Carousel
              </h3>
              <Usp2 />
            </div>
          </div>
        </div>
      </section>

      {/* Content Components */}
      <section className="py-15 bg-gray-100">
        <div className="px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Content Components
          </h2>

          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Diptych Media Title
              </h3>
              <DiptychMediaTitle
                mainHeading="Innovation Meets Comfort"
                leftColumnTitle="Advanced Technology"
                leftColumnContent="Our advanced technology ensures maximum absorption while keeping your baby comfortable all day long."
                rightColumnTitle="Premium Materials"
                rightColumnContent="Using only the highest quality, safest materials for your baby's delicate skin."
                imageUrl="/innovation-placeholder.jpg"
                imageAlt="Product innovation"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Safety Standards
              </h3>
              <SafetyStandards />
            </div>
          </div>
        </div>
      </section>

      {/* Table Components */}
      <section className="py-15 bg-white">
        <div className="px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Table Components
          </h2>

          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Comparison Table
              </h3>
              <ComparisonTable
                title="Feature Comparison"
                columns={[
                  { name: 'Coterie', highlighted: true },
                  { name: 'Competitor A' },
                  { name: 'Competitor B' },
                ]}
                rows={[
                  {
                    label: 'Absorption',
                    values: ['12 hours', '8 hours', '6 hours'],
                    unit: 'hours',
                  },
                  {
                    label: 'Eco-Friendly',
                    values: [true, false, true],
                  },
                  {
                    label: 'Hypoallergenic',
                    values: [true, true, false],
                  },
                ]}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Three Column Table
              </h3>
              <ThreeColumnTable />
            </div>
          </div>
        </div>
      </section>

      {/* UI Components */}
      <section className="py-15 bg-gray-100">
        <div className="px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">UI Components</h2>

          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Buttons
              </h3>
              <div className="bg-white p-6">
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button>Default Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="destructive">Destructive Button</Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">Tabs</h3>
              <div className="bg-white p-6">
                <Tabs defaultValue="tab1" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab1" className="mt-6">
                    Content for Tab 1
                  </TabsContent>
                  <TabsContent value="tab2" className="mt-6">
                    Content for Tab 2
                  </TabsContent>
                  <TabsContent value="tab3" className="mt-6">
                    Content for Tab 3
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Components */}
      <section className="py-15 bg-white">
        <div className="px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Review Components
          </h2>

          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Star Rating
              </h3>
              <div className="bg-gray-50 p-6">
                <div className="space-y-4 flex flex-col items-center">
                  <StarRating rating={5} />
                  <StarRating rating={4} />
                  <StarRating rating={3} />
                  <StarRating rating={2} />
                  <StarRating rating={1} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Reviews System
              </h3>
              <Reviews />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
