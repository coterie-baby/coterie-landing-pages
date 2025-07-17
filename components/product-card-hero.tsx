import { ProductCard } from './product-card';

type BackgroundType =
  | { type: 'color'; color: string }
  | { type: 'image'; src: string; altText?: string }
  | { type: 'video'; src: string; poster?: string };

interface ProductCardHero {
  headline: string;
  subheading?: string;
  variant: '3-card' | '2-card';
  cards: ProductCard[];
  background?: BackgroundType;
}

interface ProductCard {
  product: Product;
  title?: string;
  description?: string;
  category?: string;
  badge?: string;
  thumbnail: {
    src: string;
    altText: string;
  };
}

interface Product {
  id: string;
  title: string;
  description?: string;
  href?: string;
  price: string;
}

export default function ProductCardHero({
  headline,
  subheading,
  cards,
  background,
}: ProductCardHero) {
  const getBackgroundStyles = () => {
    if (!background) return {};

    switch (background.type) {
      case 'color':
        return { backgroundColor: background.color };
      case 'image':
        return {
          backgroundImage: `url(${background.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      case 'video':
        return {};
      default:
        return {};
    }
  };

  return (
    <section
      className="relative py-10 px-4 md:px-10 md:py-25"
      style={getBackgroundStyles()}
    >
      {background?.type === 'video' && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          poster={background.poster}
        >
          <source src={background.src} type="video/mp4" />
        </video>
      )}

      <div className="relative z-10 max-w-6xl mx-auto md:flex md:justify-between">
        <div className="flex flex-col gap-2 text-center mb-12">
          <h3 className="text-center text-[#141414] text-[38px] leading-[110%] font-normal tracking-[-0.76px]">
            {headline}
          </h3>
          {subheading && (
            <p className="text-sm text-[#525252] leading-[140%] max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        <div className={`flex flex-col gap-4 md:flex-row`}>
          {cards.map((card) => (
            <ProductCard key={card.product.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
