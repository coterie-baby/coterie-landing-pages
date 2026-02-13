'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import {
  createCart,
  addCartLines,
  updateCartLineQuantity,
  removeCartLine,
} from '@/lib/shopify/cart';
import {
  buildCartLines,
  buildBundleCartLines,
} from '@/lib/shopify/product-mapping';
import type {
  DiaperSize,
  PlanType,
  OrderType,
} from '@/components/purchase/context';
import type { BundleItem } from '@/lib/sanity/types';
import type { ShopifyCart } from '@/lib/shopify/types';
import {
  readCartFromStorage,
  writeCartToStorage,
  hydrateCartState,
  buildLocalStorageCart,
  type LocalStorageCart,
} from '@/lib/cart-storage';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartItem {
  lineId: string;
  companionLineIds: string[];
  merchandiseId: string;
  quantity: number;
  title: string;
  imageUrl: string;
  size: DiaperSize;
  displaySize: string;
  diaperCount: number;
  planType: PlanType;
  orderType: OrderType;
  currentPrice: number;
  originalPrice: number;
  savingsAmount: number;
}

interface CartState {
  cartId: string | null;
  checkoutUrl: string | null;
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | {
      type: 'SET_CART';
      payload: { cartId: string; checkoutUrl: string; items: CartItem[] };
    }
  | {
      type: 'HYDRATE_CART';
      payload: { cartId: string; checkoutUrl: string; items: CartItem[] };
    }
  | { type: 'UPDATE_ITEMS'; payload: CartItem[] }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

const initialState: CartState = {
  cartId: null,
  checkoutUrl: null,
  items: [],
  isOpen: false,
  isLoading: false,
  error: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_CART':
      return {
        ...state,
        cartId: action.payload.cartId,
        checkoutUrl: action.payload.checkoutUrl,
        items: action.payload.items,
        isLoading: false,
        error: null,
        isOpen: true,
      };
    case 'HYDRATE_CART':
      return {
        ...state,
        cartId: action.payload.cartId,
        checkoutUrl: action.payload.checkoutUrl,
        items: action.payload.items,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_ITEMS':
      return { ...state, items: action.payload, isLoading: false, error: null };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

export interface AddToCartOptions {
  size: DiaperSize;
  displaySize: string;
  diaperCount: number;
  planType: PlanType;
  orderType: OrderType;
  quantity: number;
  currentPrice: number;
  originalPrice: number;
  savingsAmount: number;
  title: string;
  imageUrl: string;
  bundleItems?: BundleItem[];
}

interface CartContextValue {
  state: CartState;
  addToCart: (options: AddToCartOptions) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  itemCount: number;
  subtotal: number;
  totalSavings: number;
  yearlySavingsProjection: number;
  hasFreeShipping: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

const FREE_SHIPPING_THRESHOLD = 110;

type CartDisplayData = Omit<
  CartItem,
  'lineId' | 'companionLineIds' | 'merchandiseId' | 'quantity'
>;

/** Build a single CartItem from a group of Shopify lines (primary + companions). */
function buildCartItemFromEdges(
  edges: ShopifyCart['lines']['edges'],
  displayData: CartDisplayData,
  fallbackQuantity?: number
): CartItem {
  const [primary, ...companions] = edges;
  return {
    ...displayData,
    lineId: primary.node.id,
    companionLineIds: companions.map((e) => e.node.id),
    merchandiseId: primary.node.merchandise.id,
    quantity: primary.node.quantity ?? fallbackQuantity ?? 1,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const rawCartRef = useRef<LocalStorageCart | null>(null);
  const isHydratingRef = useRef(false);

  // Mount-time hydration from localStorage
  useEffect(() => {
    const stored = readCartFromStorage();
    if (stored && stored.items.length > 0) {
      rawCartRef.current = stored;
      isHydratingRef.current = true;
      dispatch({ type: 'HYDRATE_CART', payload: hydrateCartState(stored) });
    }
  }, []);

  // Persist cart state changes back to localStorage
  useEffect(() => {
    if (!state.cartId) return;
    if (isHydratingRef.current) {
      isHydratingRef.current = false;
      return;
    }
    const lsCart = buildLocalStorageCart(
      state.cartId,
      state.checkoutUrl ?? '',
      state.items,
      rawCartRef.current
    );
    rawCartRef.current = lsCart;
    writeCartToStorage(lsCart);
  }, [state.cartId, state.checkoutUrl, state.items]);

  const addToCart = useCallback(
    async (options: AddToCartOptions) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const displayData = {
          title: options.title,
          imageUrl: options.imageUrl,
          size: options.size,
          displaySize: options.displaySize,
          diaperCount: options.diaperCount,
          planType: options.planType,
          orderType: options.orderType,
          currentPrice: options.currentPrice,
          originalPrice: options.originalPrice,
          savingsAmount: options.savingsAmount,
        };

        if (!state.cartId) {
          // First add — create a new cart
          const result = await createCart({
            size: options.size,
            planType: options.planType,
            orderType: options.orderType,
            quantity: options.quantity,
            bundleItems: options.bundleItems,
          });

          if (
            !result.success ||
            !result.checkoutUrl ||
            !result.cartId ||
            !result.cart
          ) {
            const errorMsg = result.error || 'Failed to create cart';
            dispatch({ type: 'SET_ERROR', payload: errorMsg });
            throw new Error(errorMsg);
          }

          // Build a single CartItem from all Shopify response lines (primary + companions)
          const cartItem = buildCartItemFromEdges(
            result.cart.lines.edges,
            displayData,
            options.quantity
          );

          dispatch({
            type: 'SET_CART',
            payload: {
              cartId: result.cartId,
              checkoutUrl: result.checkoutUrl,
              items: [...state.items, cartItem],
            },
          });
        } else {
          // Subsequent adds — add lines to existing cart
          const lines = buildCartLines({
            size: options.size,
            planType: options.planType,
            orderType: options.orderType,
            quantity: options.quantity,
          });

          if (options.bundleItems && options.bundleItems.length > 0) {
            lines.push(
              ...buildBundleCartLines(options.bundleItems, options.orderType)
            );
          }

          // Collect all known Shopify line IDs (primary + companions)
          const knownLineIds = new Set(
            state.items.flatMap((i) => [i.lineId, ...i.companionLineIds])
          );
          const result = await addCartLines(state.cartId, lines);

          if (!result.success || !result.cart) {
            const errorMsg = result.error || 'Failed to add to cart';
            dispatch({ type: 'SET_ERROR', payload: errorMsg });
            throw new Error(errorMsg);
          }

          // Build a lookup of Shopify line quantities to detect merges
          const shopifyQuantities = new Map(
            result.cart.lines.edges.map((edge) => [
              edge.node.id,
              edge.node.quantity,
            ])
          );

          // Update existing items whose quantities changed (Shopify merged lines)
          const updatedExistingItems = state.items.map((item) => {
            const shopifyQty = shopifyQuantities.get(item.lineId);
            if (shopifyQty !== undefined && shopifyQty !== item.quantity) {
              return { ...item, quantity: shopifyQty };
            }
            return item;
          });

          // Find truly new lines (not primary or companion of any existing item)
          const newEdges = result.cart.lines.edges.filter(
            (edge) => !knownLineIds.has(edge.node.id)
          );

          // Group new lines into a single CartItem (primary + companions)
          const newItems: CartItem[] =
            newEdges.length > 0
              ? [buildCartItemFromEdges(newEdges, displayData)]
              : [];

          dispatch({
            type: 'SET_CART',
            payload: {
              cartId: state.cartId,
              checkoutUrl: result.cart.checkoutUrl,
              items: [...updatedExistingItems, ...newItems],
            },
          });
        }
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          payload:
            err instanceof Error ? err.message : 'An unexpected error occurred',
        });
      }
    },
    [state.cartId, state.items]
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!state.cartId) return;
      dispatch({ type: 'SET_LOADING', payload: true });

      const item = state.items.find((i) => i.lineId === lineId);
      const allLineIds = item ? [lineId, ...item.companionLineIds] : [lineId];

      const result = await updateCartLineQuantity(
        state.cartId,
        allLineIds,
        quantity
      );

      if (!result.success) {
        dispatch({
          type: 'SET_ERROR',
          payload: result.error || 'Failed to update quantity',
        });
        return;
      }

      const updatedItems = state.items.map((i) =>
        i.lineId === lineId ? { ...i, quantity } : i
      );
      dispatch({ type: 'UPDATE_ITEMS', payload: updatedItems });
    },
    [state.cartId, state.items]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!state.cartId) return;
      dispatch({ type: 'SET_LOADING', payload: true });

      const item = state.items.find((i) => i.lineId === lineId);
      const allLineIds = item ? [lineId, ...item.companionLineIds] : [lineId];

      const result = await removeCartLine(state.cartId, allLineIds);

      if (!result.success) {
        dispatch({
          type: 'SET_ERROR',
          payload: result.error || 'Failed to remove item',
        });
        return;
      }

      const updatedItems = state.items.filter((i) => i.lineId !== lineId);
      dispatch({ type: 'UPDATE_ITEMS', payload: updatedItems });
    },
    [state.cartId, state.items]
  );

  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);

  // Computed values
  const itemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  const subtotal = useMemo(
    () =>
      state.items.reduce(
        (sum, item) => sum + item.currentPrice * item.quantity,
        0
      ),
    [state.items]
  );

  const totalSavings = useMemo(
    () =>
      state.items.reduce(
        (sum, item) => sum + item.savingsAmount * item.quantity,
        0
      ),
    [state.items]
  );

  const yearlySavingsProjection = useMemo(
    () => totalSavings * 12,
    [totalSavings]
  );

  const hasFreeShipping = useMemo(
    () => subtotal >= FREE_SHIPPING_THRESHOLD,
    [subtotal]
  );

  const value: CartContextValue = {
    state,
    addToCart,
    updateQuantity,
    removeItem,
    openCart,
    closeCart,
    itemCount,
    subtotal,
    totalSavings,
    yearlySavingsProjection,
    hasFreeShipping,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

const noop = async () => {};

const defaultCartValue: CartContextValue = {
  state: initialState,
  addToCart: noop as CartContextValue['addToCart'],
  updateQuantity: noop as CartContextValue['updateQuantity'],
  removeItem: noop as CartContextValue['removeItem'],
  openCart: () => {},
  closeCart: () => {},
  itemCount: 0,
  subtotal: 0,
  totalSavings: 0,
  yearlySavingsProjection: 0,
  hasFreeShipping: false,
};

export function useCart() {
  const context = useContext(CartContext);
  // Return safe default when used outside CartProvider (e.g. quiz pages)
  return context ?? defaultCartValue;
}
