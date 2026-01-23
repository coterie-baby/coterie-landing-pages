'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

// Types
export type DiaperSize = 'n' | 'n+1' | '1' | '2' | '3' | '4' | '5' | '6' | '7';

export type PlanType = 'diaper-only' | 'diaper-wipe-bundle' | 'deluxe';

export type OrderType = 'subscription' | 'one-time';

export interface SizeConfig {
  label: string;
  count: number;
  weightRange: string;
}

// Size configurations with diaper counts per box
export const SIZE_CONFIGS: Record<DiaperSize, SizeConfig> = {
  n: { label: 'N', count: 186, weightRange: 'Under 6 lbs' },
  'n+1': { label: 'N+1', count: 192, weightRange: 'Under 10 lbs' },
  '1': { label: '1', count: 198, weightRange: '8-12 lbs' },
  '2': { label: '2', count: 186, weightRange: '10-16 lbs' },
  '3': { label: '3', count: 168, weightRange: '14-24 lbs' },
  '4': { label: '4', count: 150, weightRange: '20-32 lbs' },
  '5': { label: '5', count: 132, weightRange: '27+ lbs' },
  '6': { label: '6', count: 108, weightRange: '35+ lbs' },
  '7': { label: '7', count: 96, weightRange: '41+ lbs' },
};

export interface PlanConfig {
  id: PlanType;
  name: string;
  description: string;
  features: string[];
  basePrice: number;
  subscriptionPrice: number;
  subscriptionDiscount: number;
  isPopular?: boolean;
  variantIdMap: Record<DiaperSize, string>; // Maps size to Shopify variant ID
}

export interface ProductOrderState {
  selectedSize: DiaperSize | null;
  selectedPlan: PlanType;
  orderType: OrderType;
  quantity: number;
}

type ProductOrderAction =
  | { type: 'SET_SIZE'; payload: DiaperSize }
  | { type: 'SET_PLAN'; payload: PlanType }
  | { type: 'SET_ORDER_TYPE'; payload: OrderType }
  | { type: 'SET_QUANTITY'; payload: number }
  | { type: 'RESET' };

// Plan configurations - can be extended or fetched from CMS/API
export const PLAN_CONFIGS: PlanConfig[] = [
  {
    id: 'diaper-only',
    name: 'Diaper Plan',
    description: 'Diapers only',
    features: ['6 packs per box'],
    basePrice: 105.5,
    subscriptionPrice: 95,
    subscriptionDiscount: 10,
    variantIdMap: {
      n: 'gid://shopify/ProductVariant/diaper-n',
      'n+1': 'gid://shopify/ProductVariant/diaper-n1',
      '1': 'gid://shopify/ProductVariant/diaper-1',
      '2': 'gid://shopify/ProductVariant/diaper-2',
      '3': 'gid://shopify/ProductVariant/diaper-3',
      '4': 'gid://shopify/ProductVariant/diaper-4',
      '5': 'gid://shopify/ProductVariant/diaper-5',
      '6': 'gid://shopify/ProductVariant/diaper-6',
      '7': 'gid://shopify/ProductVariant/diaper-7',
    },
  },
  {
    id: 'diaper-wipe-bundle',
    name: 'Diaper + Wipe Bundle',
    description: 'Best value for daily essentials',
    features: ['6 packs per box', '4 packs of wipes (224 wipes)'],
    basePrice: 138.5,
    subscriptionPrice: 123,
    subscriptionDiscount: 10,
    isPopular: true,
    variantIdMap: {
      n: 'gid://shopify/ProductVariant/bundle-n',
      'n+1': 'gid://shopify/ProductVariant/bundle-n1',
      '1': 'gid://shopify/ProductVariant/bundle-1',
      '2': 'gid://shopify/ProductVariant/bundle-2',
      '3': 'gid://shopify/ProductVariant/bundle-3',
      '4': 'gid://shopify/ProductVariant/bundle-4',
      '5': 'gid://shopify/ProductVariant/bundle-5',
      '6': 'gid://shopify/ProductVariant/bundle-6',
      '7': 'gid://shopify/ProductVariant/bundle-7',
    },
  },
  {
    id: 'deluxe',
    name: 'Deluxe Plan',
    description: 'Maximum coverage',
    features: ['6 packs per box', '8 packs of wipes (448 wipes)'],
    basePrice: 171.5,
    subscriptionPrice: 151.0,
    subscriptionDiscount: 10,
    variantIdMap: {
      n: 'gid://shopify/ProductVariant/deluxe-n',
      'n+1': 'gid://shopify/ProductVariant/deluxe-n1',
      '1': 'gid://shopify/ProductVariant/deluxe-1',
      '2': 'gid://shopify/ProductVariant/deluxe-2',
      '3': 'gid://shopify/ProductVariant/deluxe-3',
      '4': 'gid://shopify/ProductVariant/deluxe-4',
      '5': 'gid://shopify/ProductVariant/deluxe-5',
      '6': 'gid://shopify/ProductVariant/deluxe-6',
      '7': 'gid://shopify/ProductVariant/deluxe-7',
    },
  },
];

// Initial state
const initialState: ProductOrderState = {
  selectedSize: null,
  selectedPlan: 'diaper-wipe-bundle', // Default to most popular
  orderType: 'subscription',
  quantity: 1,
};

// Reducer
function productOrderReducer(
  state: ProductOrderState,
  action: ProductOrderAction
): ProductOrderState {
  switch (action.type) {
    case 'SET_SIZE':
      return { ...state, selectedSize: action.payload };
    case 'SET_PLAN':
      return { ...state, selectedPlan: action.payload };
    case 'SET_ORDER_TYPE':
      return { ...state, orderType: action.payload };
    case 'SET_QUANTITY':
      return { ...state, quantity: Math.max(1, action.payload) };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Context types
interface ProductOrderContextValue {
  state: ProductOrderState;
  // Actions
  setSize: (size: DiaperSize) => void;
  setPlan: (plan: PlanType) => void;
  setOrderType: (type: OrderType) => void;
  setQuantity: (qty: number) => void;
  reset: () => void;
  // Computed values
  selectedPlanConfig: PlanConfig | undefined;
  selectedSizeConfig: SizeConfig | undefined;
  currentPrice: number;
  originalPrice: number;
  savingsAmount: number;
  savingsPercent: number;
  variantId: string | null;
  isValid: boolean;
  displaySize: string;
  diaperCount: number;
}

const ProductOrderContext = createContext<ProductOrderContextValue | null>(
  null
);

// Provider
interface ProductOrderProviderProps {
  children: ReactNode;
  initialSize?: DiaperSize;
  initialPlan?: PlanType;
  initialOrderType?: OrderType;
}

export function ProductOrderProvider({
  children,
  initialSize,
  initialPlan,
  initialOrderType,
}: ProductOrderProviderProps) {
  const [state, dispatch] = useReducer(productOrderReducer, {
    ...initialState,
    selectedSize: initialSize ?? initialState.selectedSize,
    selectedPlan: initialPlan ?? initialState.selectedPlan,
    orderType: initialOrderType ?? initialState.orderType,
  });

  // Actions
  const setSize = useCallback((size: DiaperSize) => {
    dispatch({ type: 'SET_SIZE', payload: size });
  }, []);

  const setPlan = useCallback((plan: PlanType) => {
    dispatch({ type: 'SET_PLAN', payload: plan });
  }, []);

  const setOrderType = useCallback((type: OrderType) => {
    dispatch({ type: 'SET_ORDER_TYPE', payload: type });
  }, []);

  const setQuantity = useCallback((qty: number) => {
    dispatch({ type: 'SET_QUANTITY', payload: qty });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Computed values
  const selectedPlanConfig = useMemo(
    () => PLAN_CONFIGS.find((p) => p.id === state.selectedPlan),
    [state.selectedPlan]
  );

  const selectedSizeConfig = useMemo(
    () => (state.selectedSize ? SIZE_CONFIGS[state.selectedSize] : undefined),
    [state.selectedSize]
  );

  const diaperCount = useMemo(
    () => selectedSizeConfig?.count ?? 0,
    [selectedSizeConfig]
  );

  const currentPrice = useMemo(() => {
    if (!selectedPlanConfig) return 0;
    return state.orderType === 'subscription'
      ? selectedPlanConfig.subscriptionPrice
      : selectedPlanConfig.basePrice;
  }, [selectedPlanConfig, state.orderType]);

  const originalPrice = useMemo(() => {
    return selectedPlanConfig?.basePrice ?? 0;
  }, [selectedPlanConfig]);

  const savingsAmount = useMemo(() => {
    if (state.orderType !== 'subscription') return 0;
    return originalPrice - currentPrice;
  }, [state.orderType, originalPrice, currentPrice]);

  const savingsPercent = useMemo(() => {
    return selectedPlanConfig?.subscriptionDiscount ?? 0;
  }, [selectedPlanConfig]);

  const variantId = useMemo(() => {
    if (!state.selectedSize || !selectedPlanConfig) return null;
    return selectedPlanConfig.variantIdMap[state.selectedSize] ?? null;
  }, [state.selectedSize, selectedPlanConfig]);

  const isValid = useMemo(() => {
    return state.selectedSize !== null && variantId !== null;
  }, [state.selectedSize, variantId]);

  const displaySize = useMemo(() => {
    if (!state.selectedSize) return '';
    if (state.selectedSize === 'n') return 'N';
    if (state.selectedSize === 'n+1') return 'N+1';
    return state.selectedSize;
  }, [state.selectedSize]);

  const value: ProductOrderContextValue = {
    state,
    setSize,
    setPlan,
    setOrderType,
    setQuantity,
    reset,
    selectedPlanConfig,
    selectedSizeConfig,
    currentPrice,
    originalPrice,
    savingsAmount,
    savingsPercent,
    variantId,
    isValid,
    displaySize,
    diaperCount,
  };

  return (
    <ProductOrderContext.Provider value={value}>
      {children}
    </ProductOrderContext.Provider>
  );
}

// Hook
export function useProductOrder() {
  const context = useContext(ProductOrderContext);
  if (!context) {
    throw new Error(
      'useProductOrder must be used within a ProductOrderProvider'
    );
  }
  return context;
}
