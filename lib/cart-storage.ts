import type { CartItem } from '@/components/cart/cart-context';
import type { DiaperSize } from '@/components/purchase/context';
import { SIZE_CONFIGS } from '@/components/purchase/context';

// ─── localStorage Types ──────────────────────────────────────────────────────

export interface LocalStorageCartItem {
  id: string;
  variantId: string;
  quantity: number;
  productName: string;
  image: string;
  sizeName: string;
  summarySubtitle: string;
  price: number;
  compareAtPrice: number;
  attributes: { type?: string; [key: string]: unknown };
  [key: string]: unknown;
}

export interface LocalStorageCart {
  cartId: string;
  checkoutUrl: string;
  items: LocalStorageCartItem[];
  subTotals: number;
  grandTotal: number;
  itemQuantity: number;
  updatedAt: string;
  [key: string]: unknown;
}

const STORAGE_KEY = 'cart';

// ─── Read / Write ────────────────────────────────────────────────────────────

export function readCartFromStorage(): LocalStorageCart | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return parsed as LocalStorageCart;
  } catch {
    return null;
  }
}

export function writeCartToStorage(cart: LocalStorageCart): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn('Failed to write cart to localStorage', e);
  }
}

// ─── Hydrate: localStorage → CartItem[] ──────────────────────────────────────

function parseDiaperCount(summarySubtitle: string): number {
  const match = summarySubtitle?.match(/(\d+)\s*diapers/i);
  return match ? parseInt(match[1], 10) : 0;
}

function normalizeSizeKey(sizeName: string): DiaperSize {
  const lower = sizeName.toLowerCase().trim();
  const sizeKeys = Object.keys(SIZE_CONFIGS) as DiaperSize[];
  for (const key of sizeKeys) {
    if (lower === key || lower === SIZE_CONFIGS[key].label.toLowerCase()) {
      return key;
    }
  }
  // Fallback — return as-is and let downstream handle it
  return lower as DiaperSize;
}

export function hydrateCartState(lsCart: LocalStorageCart): {
  cartId: string;
  checkoutUrl: string;
  items: CartItem[];
} {
  const items: CartItem[] = lsCart.items.map((item) => {
    const orderType =
      item.attributes?.type === 'auto_renew' ? 'subscription' : 'one-time';
    const savingsAmount = (item.compareAtPrice ?? item.price) - item.price;
    const isAddOn = item.attributes?.isAddOn === true;

    if (isAddOn) {
      return {
        lineId: item.id,
        companionLineIds: [],
        merchandiseId: item.variantId,
        quantity: item.quantity,
        title: item.productName,
        imageUrl: item.image,
        isAddOn: true,
        size: '1' as DiaperSize,
        displaySize: '',
        diaperCount: 0,
        planType: 'diaper-only' as const,
        orderType,
        currentPrice: item.price,
        originalPrice: item.compareAtPrice ?? item.price,
        savingsAmount,
      };
    }

    return {
      lineId: item.id,
      companionLineIds: [],
      merchandiseId: item.variantId,
      quantity: item.quantity,
      title: item.productName,
      imageUrl: item.image,
      size: normalizeSizeKey(item.sizeName),
      displaySize: item.sizeName,
      diaperCount: parseDiaperCount(item.summarySubtitle),
      planType: 'diaper-only' as const,
      orderType,
      currentPrice: item.price,
      originalPrice: item.compareAtPrice ?? item.price,
      savingsAmount,
    };
  });

  return {
    cartId: lsCart.cartId,
    checkoutUrl: lsCart.checkoutUrl,
    items,
  };
}

// ─── Build: CartItem[] → localStorage cart ───────────────────────────────────

function buildLocalStorageItem(
  item: CartItem,
  existingRawItem?: LocalStorageCartItem
): LocalStorageCartItem {
  if (existingRawItem) {
    // Preserve all original fields, update only tracked ones
    return {
      ...existingRawItem,
      quantity: item.quantity,
      price: item.currentPrice,
      compareAtPrice: item.originalPrice,
      variantId: item.merchandiseId,
    };
  }

  // Add-on items (upsell products) — no size/diaper-count metadata
  if (item.isAddOn) {
    return {
      id: item.lineId,
      variantId: item.merchandiseId,
      quantity: item.quantity,
      productName: item.title,
      image: item.imageUrl,
      sizeName: '',
      summarySubtitle: '',
      price: item.currentPrice,
      compareAtPrice: item.originalPrice,
      attributes: {
        type: item.orderType === 'subscription' ? 'auto_renew' : 'one_time',
        isAddOn: true,
      },
    };
  }

  // New item created on the landing page — construct from CartItem + SIZE_CONFIGS
  const sizeConfig = SIZE_CONFIGS[item.size];
  return {
    id: item.lineId,
    variantId: item.merchandiseId,
    quantity: item.quantity,
    productName: item.title,
    image: item.imageUrl,
    sizeName: item.displaySize,
    summarySubtitle: sizeConfig
      ? `${sizeConfig.count} diapers`
      : `${item.diaperCount} diapers`,
    price: item.currentPrice,
    compareAtPrice: item.originalPrice,
    attributes: {
      type: item.orderType === 'subscription' ? 'auto_renew' : 'one_time',
    },
  };
}

export function buildLocalStorageCart(
  cartId: string,
  checkoutUrl: string,
  items: CartItem[],
  existingRawCart: LocalStorageCart | null
): LocalStorageCart {
  // Index existing raw items by their id for fast lookup
  const rawItemMap = new Map<string, LocalStorageCartItem>();
  if (existingRawCart?.items) {
    for (const rawItem of existingRawCart.items) {
      rawItemMap.set(rawItem.id, rawItem);
    }
  }

  const lsItems = items.map((item) =>
    buildLocalStorageItem(item, rawItemMap.get(item.lineId))
  );

  const subTotals = lsItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const grandTotal = subTotals;
  const itemQuantity = lsItems.reduce((sum, i) => sum + i.quantity, 0);

  return {
    ...(existingRawCart ?? {}),
    cartId,
    checkoutUrl,
    items: lsItems,
    subTotals,
    grandTotal,
    itemQuantity,
    updatedAt: new Date().toISOString(),
  };
}
