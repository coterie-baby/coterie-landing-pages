'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { getDiaperVariantIds } from '@/lib/config/products';

// Types
export type DiaperSize = 'n' | 'n+1' | '1' | '2' | '3' | '4' | '5' | '6' | '7';

export type PlanType = 'diaper-only' | 'diaper-wipe-bundle' | 'deluxe';

export type OrderType = 'subscription' | 'one-time';

export interface SizeConfig {
  label: string;
  variantName: string;
  count: number;
  weightRange: string;
  changesPerDay: number;
}

// Size configurations with diaper counts per box
export const SIZE_CONFIGS: Record<DiaperSize, SizeConfig> = {
  n: {
    label: 'N',
    variantName: 'NB / 6 packs',
    count: 186,
    weightRange: 'Under 6 lbs',
    changesPerDay: 7,
  },
  'n+1': {
    label: 'N+1',
    variantName: 'NB / 3 packs, 01 / 3 packs',
    count: 192,
    weightRange: 'Under 10 lbs',
    changesPerDay: 7,
  },
  '1': {
    label: '1',
    variantName: '1 / 6 packs',
    count: 198,
    weightRange: '8-12 lbs',
    changesPerDay: 7,
  },
  '2': {
    label: '2',
    variantName: '2 / 6 packs',
    count: 186,
    weightRange: '10-16 lbs',
    changesPerDay: 6,
  },
  '3': {
    label: '3',
    variantName: '3 / 6 packs',
    count: 168,
    weightRange: '14-24 lbs',
    changesPerDay: 6,
  },
  '4': {
    label: '4',
    variantName: '4 / 6 packs',
    count: 150,
    weightRange: '20-32 lbs',
    changesPerDay: 5,
  },
  '5': {
    label: '5',
    variantName: '5 / 6 packs',
    count: 132,
    weightRange: '27+ lbs',
    changesPerDay: 5,
  },
  '6': {
    label: '6',
    variantName: '6 / 6 packs',
    count: 108,
    weightRange: '35+ lbs',
    changesPerDay: 4,
  },
  '7': {
    label: '7',
    variantName: '7 / 6 packs',
    count: 96,
    weightRange: '41+ lbs',
    changesPerDay: 4,
  },
};

// Size option for display in UI selectors
export interface SizeOption {
  id: string;
  label: string;
  weightRange: string;
}

// Ordered list of sizes for iteration
export const SIZE_ORDER: DiaperSize[] = ['n', 'n+1', '1', '2', '3', '4', '5', '6', '7'];

// Generate display sizes from SIZE_CONFIGS (excludes n+1 since it's handled via modal)
export const DISPLAY_SIZES: SizeOption[] = [
  { id: 'n-or-n1', label: 'N or N+1', weightRange: 'Under 10 lbs' },
  ...SIZE_ORDER.filter((size) => size !== 'n' && size !== 'n+1').map((size) => ({
    id: size,
    label: SIZE_CONFIGS[size].label,
    weightRange: SIZE_CONFIGS[size].weightRange,
  })),
];

export interface PlanConfig {
  id: PlanType;
  name: string;
  description: string;
  features: string[];
  basePrice: number;
  subscriptionPrice: number;
  subscriptionDiscount: number;
  isPopular?: boolean;
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
  },
  {
    id: 'deluxe',
    name: 'Deluxe Plan',
    description: 'Maximum coverage',
    features: ['6 packs per box', '8 packs of wipes (448 wipes)'],
    basePrice: 171.5,
    subscriptionPrice: 151.0,
    subscriptionDiscount: 10,
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
    if (!state.selectedSize) return null;
    return getDiaperVariantIds()[state.selectedSize] ?? null;
  }, [state.selectedSize]);

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
