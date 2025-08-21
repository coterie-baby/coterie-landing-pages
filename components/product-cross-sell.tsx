'use client';
import Image from 'next/image';

// Utility functions for Shopify cart integration
const addToShopifyCart = {
  // Method 1: API call to your headless cart endpoint
  async viaAPI(mainSiteUrl: string, variantId: string, quantity: number = 1) {
    const response = await fetch(`${mainSiteUrl}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: variantId, quantity }],
      }),
    });
    return response.ok;
  },

  // Method 2: Shopify permalink (direct cart URL)
  viaPermalink(mainSiteUrl: string, variantId: string, quantity: number = 1) {
    window.location.href = `${mainSiteUrl}/cart/${variantId}:${quantity}`;
  },

  // Method 3: Shopify AJAX API (if enabled)
  async viaAjax(mainSiteUrl: string, variantId: string, quantity: number = 1) {
    const response = await fetch(`${mainSiteUrl}/cart/add.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: variantId, quantity }],
      }),
    });
    return response.ok;
  },
};

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  variantId?: string;
}

interface ProductCrossSellProps {
  headline: string;
  products?: Product[];
  mainSiteUrl?: string;
}

export default function ProductCrossSell({
  headline = 'Shop More Diapering Essentials',
  products = [],
  mainSiteUrl = 'https://coterie.com',
}: ProductCrossSellProps) {
  return (
    <div className="py-10 px-4 md:py-20">
      <div className="flex flex-col gap-10 max-w-[898px] mx-auto md:gap-10">
        <h4 className="text-center">{headline}</h4>
        <div className="flex gap-3">
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductListingCard
                key={product.id}
                product={product}
                mainSiteUrl={mainSiteUrl}
              />
            ))
          ) : (
            // Default placeholder cards
            <>
              <ProductListingCard mainSiteUrl={mainSiteUrl} />
              <ProductListingCard mainSiteUrl={mainSiteUrl} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductListingCard({
  product,
  mainSiteUrl = 'https://coterie.com',
}: {
  product?: Product;
  mainSiteUrl?: string;
}) {
  const handleAddToCart = async () => {
    if (!product?.variantId) {
      window.open(`${mainSiteUrl}/shop`, '_blank');
      return;
    }

    const variantId = product.variantId;

    try {
      // Try headless cart API first
      const success = await addToShopifyCart.viaAPI(mainSiteUrl, variantId);

      if (success) {
        // Success! Redirect to cart
        window.location.href = `${mainSiteUrl}/cart`;
      } else {
        // API failed, try Shopify AJAX API
        const ajaxSuccess = await addToShopifyCart.viaAjax(
          mainSiteUrl,
          variantId
        );

        if (ajaxSuccess) {
          window.location.href = `${mainSiteUrl}/cart`;
        } else {
          // Both APIs failed, use permalink method (most reliable)
          addToShopifyCart.viaPermalink(mainSiteUrl, variantId);
        }
      }
    } catch (error) {
      console.error('All API methods failed, using permalink:', error);
      // Ultimate fallback: Shopify permalink (always works)
      addToShopifyCart.viaPermalink(mainSiteUrl, variantId);
    }
  };

  return (
    <div className="flex-1">
      <div className="relative w-full aspect-square mb-3">
        <Image
          src={product?.imageUrl || '/placeholder.png'}
          alt={product?.title || 'Product'}
          fill
          className="object-cover rounded-t-[8px]"
        />
        <button
          onClick={handleAddToCart}
          className="cursor-pointer bg-white font-bold text-xs leading-[140%] absolute bottom-[7.5px] right-[7.5px] border border-[#E0E0E0] text-[#0000C9] px-4 py-3 rounded-[100px] hover:bg-gray-50 transition-colors md:right-2 md:bottom-6"
        >
          Add
        </button>
      </div>
      <div className="flex flex-col gap-0.5 md:gap-2">
        <span className="uppercase text-xs leading-[140%] text-[#0000C9]">
          {product?.category || 'Category'}
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-bold leading-[140%]">
            {product?.title || 'Product Title'}
          </p>
          <p className="text-sm text-[#525252] leading-[140%]">
            {product?.description || 'Lorem ipsum dolor sit amet consecte'}
          </p>
        </div>
        <p className="text-sm leading-[140%]">
          from $<span>{product?.price || 'XX.XX'}</span>
        </p>
      </div>
    </div>
  );
}
