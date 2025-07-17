import Link from 'next/link';

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

export function ProductCard({ card }: { card: ProductCard }) {
  return (
    <Link
      href={card.product.href || '#'}
      className="bg-white rounded-lg border border-[#E0E0E0] relative overflow-hidden
                 p-3 md:p-4 md:w-64 md:h-80 md:flex md:flex-col
                 md:bg-gradient-to-br md:from-[#4A90E2] md:via-[#4A90E2] md:to-[#E91E63]
                 md:before:absolute md:before:inset-[8px] md:before:bg-white md:before:rounded-lg md:before:z-10"
      style={{ boxShadow: '0px 0px 16px 0px rgba(0, 0, 0, 0.16)' }}
    >
      {/* Mobile layout */}
      <div className="flex gap-3 md:hidden">
        <div className="flex-shrink-0">
          <img
            className="w-20 h-20 object-cover rounded-md"
            src={card.thumbnail.src}
            alt={card.thumbnail.altText}
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between text-[#0000C9]">
            <span className="uppercase text-xs leading-[140%]">
              {card.category}
            </span>
            <div className="py-0.5 px-1 border border-[#E0E0E0] rounded-[2px]">
              <span className="text-sm font-[600]">{card.badge}</span>
            </div>
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

      {/* Desktop layout */}
      <div className="hidden md:flex md:flex-col md:h-full md:relative md:z-20">
        {/* Top badges */}
        <div className="flex justify-between items-start mb-3">
          <div className="bg-[#4A90E2] text-white px-2 py-1 rounded text-xs font-semibold">
            {card.badge}
          </div>
          <div className="bg-[#4A90E2] text-white px-2 py-1 rounded text-xs font-semibold">
            {card.badge}
          </div>
        </div>

        {/* Badge in top right */}
        <div className="absolute top-2 right-2 bg-[#4A90E2] text-white px-2 py-1 rounded text-xs font-semibold">
          Bestseller
        </div>

        {/* Product image */}
        <div className="flex-1 flex items-center justify-center mb-4">
          <div className="bg-gray-200 rounded-lg p-8 w-full max-w-[160px] h-[120px] flex items-center justify-center">
            <img
              className="w-full h-full object-cover rounded-lg"
              src={card.thumbnail.src}
              alt={card.thumbnail.altText}
            />
          </div>
        </div>

        {/* Product details */}
        <div className="mt-auto">
          <div className="mb-2">
            <span className="uppercase text-xs text-[#0000C9] font-medium">
              {card.category}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
          <p className="text-[#525252] text-sm leading-[140%] mb-3">
            {card.description}
          </p>
          <p className="text-lg font-semibold">${card.product.price}</p>
        </div>
      </div>
    </Link>
  );
}
