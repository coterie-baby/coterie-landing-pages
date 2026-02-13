'use client';

export interface UpsellProduct {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  imageUrl: string;
}

interface CartUpsellCardProps {
  product: UpsellProduct;
  onAdd: (product: UpsellProduct) => void;
}

export default function CartUpsellCard({ product, onAdd }: CartUpsellCardProps) {
  return (
    <div className="flex-shrink-0 w-36 bg-[#F8F8F8] rounded-lg p-3">
      <div className="w-full h-24 bg-white rounded-md mb-2 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            Image
          </div>
        )}
      </div>
      <p className="text-xs font-medium leading-tight">{product.title}</p>
      <p className="text-[10px] text-gray-500 mt-0.5">{product.subtitle}</p>
      <p className="text-xs font-medium mt-1">${product.price.toFixed(2)}</p>
      <button
        onClick={() => onAdd(product)}
        className="mt-2 w-full text-[10px] font-medium py-1.5 rounded-full border border-[#0000C9] text-[#0000C9] hover:bg-[#0000C9] hover:text-white transition-colors"
      >
        Add Once
      </button>
    </div>
  );
}
