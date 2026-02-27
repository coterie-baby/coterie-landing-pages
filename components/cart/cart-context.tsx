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
  updateCartLines,
} from '@/lib/shopify/cart';
import {
  buildCartLines,
  buildBundleCartLines,
  buildUpsellCartLines,
} from '@/lib/shopify/product-mapping';
import { toVariantGid } from '@/lib/config/products';
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
  isAddOn?: boolean;
}

interface CartState {
  cartId: string | null;
  checkoutUrl: string | null;
  items: CartItem[];
  previousItems: CartItem[] | null;
  pendingLineIds: string[];
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
  | { type: 'CLOSE_CART' }
  | { type: 'OPTIMISTIC_ADD'; payload: CartItem[] }
  | { type: 'OPTIMISTIC_UPDATE_QUANTITY'; payload: { lineId: string; quantity: number } }
  | { type: 'OPTIMISTIC_REMOVE'; payload: string }
  | { type: 'ROLLBACK' };

const initialState: CartState = {
  cartId: null,
  checkoutUrl: null,
  items: [],
  previousItems: null,
  pendingLineIds: [],
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
        pendingLineIds: [],
        previousItems: null,
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
      return {
        ...state,
        items: action.payload,
        pendingLineIds: [],
        previousItems: null,
        isLoading: false,
        error: null,
      };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'OPTIMISTIC_ADD': {
      const newIds = action.payload.map((item) => item.lineId);
      return {
        ...state,
        previousItems: state.items,
        items: [...state.items, ...action.payload],
        pendingLineIds: [...state.pendingLineIds, ...newIds],
        isOpen: true,
        isLoading: false,
      };
    }
    case 'OPTIMISTIC_UPDATE_QUANTITY':
      return {
        ...state,
        previousItems: state.items,
        items: state.items.map((item) =>
          item.lineId === action.payload.lineId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        pendingLineIds: [...state.pendingLineIds, action.payload.lineId],
        isLoading: false,
      };
    case 'OPTIMISTIC_REMOVE':
      return {
        ...state,
        previousItems: state.items,
        items: state.items.filter((item) => item.lineId !== action.payload),
        pendingLineIds: [...state.pendingLineIds, action.payload],
        isLoading: false,
      };
    case 'ROLLBACK':
      return {
        ...state,
        items: state.previousItems ?? state.items,
        previousItems: null,
        pendingLineIds: [],
        isLoading: false,
      };
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
  upsellItems?: {
    shopifyVariantId: string;
    shopifySellingPlanId?: string;
    title: string;
    imageUrl: string;
    price: number;
  }[];
}

interface CartContextValue {
  state: CartState;
  pendingLineIds: string[];
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

/** Build a CartItem for a selected upsell add-on (separate line, own display). */
function buildAddOnCartItem(
  edge: ShopifyCart['lines']['edges'][number],
  upsellData: { title: string; imageUrl: string; price: number },
  orderType: OrderType
): CartItem {
  return {
    lineId: edge.node.id,
    companionLineIds: [],
    merchandiseId: edge.node.merchandise.id,
    quantity: edge.node.quantity,
    title: upsellData.title,
    imageUrl: upsellData.imageUrl,
    isAddOn: true,
    size: '1' as DiaperSize,
    displaySize: '',
    diaperCount: 0,
    planType: 'diaper-only',
    orderType,
    currentPrice: upsellData.price,
    originalPrice: upsellData.price,
    savingsAmount: 0,
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

  // Persist cart state changes back to localStorage (skip while optimistic ops are pending)
  useEffect(() => {
    if (!state.cartId) return;
    if (state.pendingLineIds.length > 0) return;
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
  }, [state.cartId, state.checkoutUrl, state.items, state.pendingLineIds]);

  const addToCart = useCallback(
    async (options: AddToCartOptions) => {
      dispatch({ type: 'SET_ERROR', payload: null });

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

      // Build optimistic items with temporary IDs
      const tempId = `pending-${Date.now()}`;
      const optimisticMain: CartItem = {
        ...displayData,
        lineId: tempId,
        companionLineIds: [],
        merchandiseId: '',
        quantity: options.quantity,
      };
      const optimisticAddOns: CartItem[] = (options.upsellItems ?? []).map(
        (u, i) => ({
          lineId: `${tempId}-upsell-${i}`,
          companionLineIds: [],
          merchandiseId: '',
          quantity: 1,
          title: u.title,
          imageUrl: u.imageUrl,
          isAddOn: true,
          size: '1' as DiaperSize,
          displaySize: '',
          diaperCount: 0,
          planType: 'diaper-only' as PlanType,
          orderType: options.orderType,
          currentPrice: u.price,
          originalPrice: u.price,
          savingsAmount: 0,
        })
      );

      // Dispatch optimistic update — drawer opens immediately
      dispatch({
        type: 'OPTIMISTIC_ADD',
        payload: [optimisticMain, ...optimisticAddOns],
      });

      try {
        if (!state.cartId) {
          // First add — create a new cart
          const result = await createCart({
            size: options.size,
            planType: options.planType,
            orderType: options.orderType,
            quantity: options.quantity,
            bundleItems: options.bundleItems,
            upsellItems: options.upsellItems,
          });

          if (
            !result.success ||
            !result.checkoutUrl ||
            !result.cartId ||
            !result.cart
          ) {
            dispatch({ type: 'ROLLBACK' });
            const errorMsg = result.error || 'Failed to create cart';
            dispatch({ type: 'SET_ERROR', payload: errorMsg });
            return;
          }

          // Split edges: upsell add-ons get their own CartItem; the rest form the primary item
          const upsellGids = new Set(
            (options.upsellItems ?? []).map((u) => toVariantGid(u.shopifyVariantId))
          );
          const mainEdges = result.cart.lines.edges.filter(
            (e) => !upsellGids.has(e.node.merchandise.id)
          );
          const upsellEdges = result.cart.lines.edges.filter(
            (e) => upsellGids.has(e.node.merchandise.id)
          );

          const cartItem = buildCartItemFromEdges(mainEdges, displayData, options.quantity);
          const addOnItems = upsellEdges.map((edge) => {
            const data = (options.upsellItems ?? []).find(
              (u) => toVariantGid(u.shopifyVariantId) === edge.node.merchandise.id
            )!;
            return buildAddOnCartItem(edge, data, options.orderType);
          });

          // Replace optimistic items with confirmed Shopify data
          // Filter out the pending items we added optimistically
          const pendingIds = new Set([
            optimisticMain.lineId,
            ...optimisticAddOns.map((a) => a.lineId),
          ]);
          const existingConfirmed = state.items.filter(
            (i) => !pendingIds.has(i.lineId)
          );

          dispatch({
            type: 'SET_CART',
            payload: {
              cartId: result.cartId,
              checkoutUrl: result.checkoutUrl,
              items: [...existingConfirmed, cartItem, ...addOnItems],
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

          if (options.upsellItems && options.upsellItems.length > 0) {
            lines.push(
              ...buildUpsellCartLines(options.upsellItems, options.orderType)
            );
          }

          // Collect all known real Shopify line IDs (exclude pending)
          const knownLineIds = new Set(
            state.items
              .filter((i) => !i.lineId.startsWith('pending-'))
              .flatMap((i) => [i.lineId, ...i.companionLineIds])
          );
          const result = await addCartLines(state.cartId, lines);

          if (!result.success || !result.cart) {
            dispatch({ type: 'ROLLBACK' });
            const errorMsg = result.error || 'Failed to add to cart';
            dispatch({ type: 'SET_ERROR', payload: errorMsg });
            return;
          }

          // Build a lookup of Shopify line quantities to detect merges
          const shopifyQuantities = new Map(
            result.cart.lines.edges.map((edge) => [
              edge.node.id,
              edge.node.quantity,
            ])
          );

          // Get confirmed (non-pending) items, update quantities if Shopify merged lines
          const confirmedItems = state.items
            .filter((i) => !i.lineId.startsWith('pending-'))
            .map((item) => {
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

          // Split new edges into main lines and upsell add-on lines
          const upsellGids = new Set(
            (options.upsellItems ?? []).map((u) => toVariantGid(u.shopifyVariantId))
          );
          const newMainEdges = newEdges.filter((e) => !upsellGids.has(e.node.merchandise.id));
          const newUpsellEdges = newEdges.filter((e) => upsellGids.has(e.node.merchandise.id));

          const newMainItem: CartItem[] =
            newMainEdges.length > 0
              ? [buildCartItemFromEdges(newMainEdges, displayData)]
              : [];
          const newAddOnItems: CartItem[] = newUpsellEdges.map((edge) => {
            const data = (options.upsellItems ?? []).find(
              (u) => toVariantGid(u.shopifyVariantId) === edge.node.merchandise.id
            )!;
            return buildAddOnCartItem(edge, data, options.orderType);
          });
          const newItems = [...newMainItem, ...newAddOnItems];

          dispatch({
            type: 'SET_CART',
            payload: {
              cartId: state.cartId,
              checkoutUrl: result.cart.checkoutUrl,
              items: [...confirmedItems, ...newItems],
            },
          });
        }
      } catch (err) {
        dispatch({ type: 'ROLLBACK' });
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

      // Optimistic update
      dispatch({ type: 'OPTIMISTIC_UPDATE_QUANTITY', payload: { lineId, quantity } });

      const item = state.items.find((i) => i.lineId === lineId);
      const allLineIds = item ? [lineId, ...item.companionLineIds] : [lineId];

      const result = await updateCartLineQuantity(
        state.cartId,
        allLineIds,
        quantity
      );

      if (!result.success) {
        dispatch({ type: 'ROLLBACK' });
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

      // Optimistic removal
      dispatch({ type: 'OPTIMISTIC_REMOVE', payload: lineId });

      const item = state.items.find((i) => i.lineId === lineId);
      const allLineIds = item ? [lineId, ...item.companionLineIds] : [lineId];

      const result = await removeCartLine(state.cartId, allLineIds);

      if (!result.success) {
        dispatch({ type: 'ROLLBACK' });
        dispatch({
          type: 'SET_ERROR',
          payload: result.error || 'Failed to remove item',
        });
        return;
      }

      let updatedItems = state.items.filter((i) => i.lineId !== lineId);

      // If only add-ons remain (no anchor product), convert subscription add-ons to one-time
      const hasAnchor = updatedItems.some((i) => !i.isAddOn);
      const subscriptionAddOns = updatedItems.filter(
        (i) => i.isAddOn && i.orderType === 'subscription'
      );

      if (!hasAnchor && subscriptionAddOns.length > 0) {
        const convertResult = await updateCartLines(
          state.cartId,
          subscriptionAddOns.map((addon) => ({
            id: addon.lineId,
            sellingPlanId: null,
          }))
        );

        if (convertResult.success && convertResult.cart) {
          // Build a price lookup from the Shopify response
          const priceByLineId = new Map(
            convertResult.cart.lines.edges.map((edge) => [
              edge.node.id,
              parseFloat(edge.node.cost.amountPerQuantity.amount),
            ])
          );

          updatedItems = updatedItems.map((i) => {
            if (i.isAddOn && i.orderType === 'subscription') {
              const otpPrice = priceByLineId.get(i.lineId) ?? i.currentPrice;
              return { ...i, orderType: 'one-time' as OrderType, currentPrice: otpPrice };
            }
            return i;
          });
        }
      }

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
    pendingLineIds: state.pendingLineIds,
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
  pendingLineIds: [],
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
