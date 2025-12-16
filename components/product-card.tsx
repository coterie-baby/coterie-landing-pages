import Link from 'next/link';
import Image from 'next/image';

export interface ProductCard {
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

export function ProductCard({ card, priority = false }: { card: ProductCard; priority?: boolean }) {
  return (
    <Link
      href={card.product.href || '#'}
      className="bg-white rounded-lg border border-[#E0E0E0] relative overflow-hidden
                 p-3 md:p-4 md:w-64 md:flex md:flex-col"
      style={{ boxShadow: '0px 0px 16px 0px rgba(0, 0, 0, 0.16)' }}
    >
      <div className="flex gap-3 md:flex-col">
        <div className="relative w-[80px] h-[80px] md:w-full md:h-auto md:aspect-square flex-shrink-0">
          <Image
            className="object-cover rounded-md md:rounded-lg"
            src={card.thumbnail.src}
            alt={card.thumbnail.altText}
            fill
            sizes="(max-width: 768px) 80px, (max-width: 1024px) 256px, 300px"
            priority={priority}
          />
          {card.badge && (
            <div className="hidden bg-white py-0.5 px-1 border border-[#E0E0E0] rounded-[2px] md:block absolute top-2 right-2">
              <span className="text-sm text-[#0000C9] font-[600]">
                {card.badge}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between text-[#0000C9]">
            <span className="uppercase text-xs leading-[140%]">
              {card.category}
            </span>
            {card.badge && (
              <div className="py-0.5 px-1 border border-[#E0E0E0] rounded-[2px] md:hidden">
                <span className="text-sm font-[600]">{card.badge}</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm leading-[140%] font-[600]">{card.title}</p>
            <p className="text-[#525252] text-sm leading-[140%]">
              {card.description}
            </p>
          </div>
          <div>
            <p className="text-sm">${card.product.price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
