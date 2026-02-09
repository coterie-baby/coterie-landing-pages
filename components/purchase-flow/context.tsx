'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { DiaperSize, SIZE_CONFIGS, PlanType, OrderType, PLAN_CONFIGS } from '../purchase/context';

export type PurchaseFlowStep = 'welcome' | 'size' | 'bundle' | 'review';

export const STEPS: PurchaseFlowStep[] = ['welcome', 'size', 'bundle', 'review'];

export const STEP_CONFIG: Record<PurchaseFlowStep, { title: string; subtitle: string }> = {
  welcome: {
    title: 'Build Your Bundle',
    subtitle: "Let's find the perfect fit for your baby",
  },
  size: {
    title: 'Select Your Size',
    subtitle: 'Choose the right size for your baby',
  },
  bundle: {
    title: 'Build Your Bundle',
    subtitle: 'Add wipes to save more',
  },
  review: {
    title: 'Review Your Order',
    subtitle: 'Everything look good?',
  },
};

// Wipes options for the bundle step
export type WipesOption = 'none' | '4-pack' | '8-pack';

export interface WipesConfig {
  id: WipesOption;
  name: string;
  description: string;
  count: number;
  basePrice: number;
  subscriptionPrice: number;
}

export const WIPES_CONFIGS: WipesConfig[] = [
  {
    id: 'none',
    name: 'No Wipes',
    description: 'Just diapers',
    count: 0,
    basePrice: 0,
    subscriptionPrice: 0,
  },
  {
    id: '4-pack',
    name: '4 Pack Wipes',
    description: '224 wipes total',
    count: 224,
    basePrice: 33,
    subscriptionPrice: 28,
  },
  {
    id: '8-pack',
    name: '8 Pack Wipes',
    description: '448 wipes total',
    count: 448,
    basePrice: 66,
    subscriptionPrice: 56,
  },
];

export interface PurchaseFlowState {
  currentStep: PurchaseFlowStep;
  selectedSize: DiaperSize | null;
  selectedWipes: WipesOption;
  orderType: OrderType;
  isAnimating: boolean;
}

type PurchaseFlowAction =
  | { type: 'SET_STEP'; payload: PurchaseFlowStep }
  | { type: 'SET_SIZE'; payload: DiaperSize }
  | { type: 'SET_WIPES'; payload: WipesOption }
  | { type: 'SET_ORDER_TYPE'; payload: OrderType }
  | { type: 'SET_ANIMATING'; payload: boolean }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' };

const initialState: PurchaseFlowState = {
  currentStep: 'welcome',
  selectedSize: null,
  selectedWipes: '4-pack',
  orderType: 'subscription',
  isAnimating: false,
};

function purchaseFlowReducer(
  state: PurchaseFlowState,
  action: PurchaseFlowAction
): PurchaseFlowState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_SIZE':
      return { ...state, selectedSize: action.payload };
    case 'SET_WIPES':
      return { ...state, selectedWipes: action.payload };
    case 'SET_ORDER_TYPE':
      return { ...state, orderType: action.payload };
    case 'SET_ANIMATING':
      return { ...state, isAnimating: action.payload };
    case 'NEXT_STEP': {
      const currentIndex = STEPS.indexOf(state.currentStep);
      if (currentIndex < STEPS.length - 1) {
        return { ...state, currentStep: STEPS[currentIndex + 1] };
      }
      return state;
    }
    case 'PREV_STEP': {
      const currentIndex = STEPS.indexOf(state.currentStep);
      if (currentIndex > 0) {
        return { ...state, currentStep: STEPS[currentIndex - 1] };
      }
      return state;
    }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface PurchaseFlowContextValue {
  state: PurchaseFlowState;
  // Actions
  setStep: (step: PurchaseFlowStep) => void;
  setSize: (size: DiaperSize) => void;
  setWipes: (wipes: WipesOption) => void;
  setOrderType: (type: OrderType) => void;
  setAnimating: (animating: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  // Computed values
  currentStepIndex: number;
  totalSteps: number;
  selectedSizeConfig: typeof SIZE_CONFIGS[DiaperSize] | undefined;
  selectedWipesConfig: WipesConfig | undefined;
  diaperPrice: number;
  wipesPrice: number;
  totalPrice: number;
  originalDiaperPrice: number;
  originalWipesPrice: number;
  originalTotalPrice: number;
  totalSavings: number;
  diaperCount: number;
  canProceed: boolean;
  planType: PlanType;
}

const PurchaseFlowContext = createContext<PurchaseFlowContextValue | null>(null);

interface PurchaseFlowProviderProps {
  children: ReactNode;
}

export function PurchaseFlowProvider({ children }: PurchaseFlowProviderProps) {
  const [state, dispatch] = useReducer(purchaseFlowReducer, initialState);

  // Actions
  const setStep = useCallback((step: PurchaseFlowStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const setSize = useCallback((size: DiaperSize) => {
    dispatch({ type: 'SET_SIZE', payload: size });
  }, []);

  const setWipes = useCallback((wipes: WipesOption) => {
    dispatch({ type: 'SET_WIPES', payload: wipes });
  }, []);

  const setOrderType = useCallback((type: OrderType) => {
    dispatch({ type: 'SET_ORDER_TYPE', payload: type });
  }, []);

  const setAnimating = useCallback((animating: boolean) => {
    dispatch({ type: 'SET_ANIMATING', payload: animating });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Computed values
  const currentStepIndex = useMemo(
    () => STEPS.indexOf(state.currentStep),
    [state.currentStep]
  );

  const totalSteps = STEPS.length;

  const selectedSizeConfig = useMemo(
    () => (state.selectedSize ? SIZE_CONFIGS[state.selectedSize] : undefined),
    [state.selectedSize]
  );

  const selectedWipesConfig = useMemo(
    () => WIPES_CONFIGS.find((w) => w.id === state.selectedWipes),
    [state.selectedWipes]
  );

  const diaperCount = useMemo(
    () => selectedSizeConfig?.count ?? 0,
    [selectedSizeConfig]
  );

  // Get diaper plan config
  const diaperPlanConfig = useMemo(
    () => PLAN_CONFIGS.find((p) => p.id === 'diaper-only'),
    []
  );

  const diaperPrice = useMemo(() => {
    if (!diaperPlanConfig) return 0;
    return state.orderType === 'subscription'
      ? diaperPlanConfig.subscriptionPrice
      : diaperPlanConfig.basePrice;
  }, [diaperPlanConfig, state.orderType]);

  const originalDiaperPrice = useMemo(
    () => diaperPlanConfig?.basePrice ?? 0,
    [diaperPlanConfig]
  );

  const wipesPrice = useMemo(() => {
    if (!selectedWipesConfig) return 0;
    return state.orderType === 'subscription'
      ? selectedWipesConfig.subscriptionPrice
      : selectedWipesConfig.basePrice;
  }, [selectedWipesConfig, state.orderType]);

  const originalWipesPrice = useMemo(
    () => selectedWipesConfig?.basePrice ?? 0,
    [selectedWipesConfig]
  );

  const totalPrice = useMemo(
    () => diaperPrice + wipesPrice,
    [diaperPrice, wipesPrice]
  );

  const originalTotalPrice = useMemo(
    () => originalDiaperPrice + originalWipesPrice,
    [originalDiaperPrice, originalWipesPrice]
  );

  const totalSavings = useMemo(
    () => (state.orderType === 'subscription' ? originalTotalPrice - totalPrice : 0),
    [state.orderType, originalTotalPrice, totalPrice]
  );

  // Map wipes selection to plan type
  const planType: PlanType = useMemo(() => {
    if (state.selectedWipes === '8-pack') return 'deluxe';
    if (state.selectedWipes === '4-pack') return 'diaper-wipe-bundle';
    return 'diaper-only';
  }, [state.selectedWipes]);

  const canProceed = useMemo(() => {
    switch (state.currentStep) {
      case 'welcome':
        return true;
      case 'size':
        return state.selectedSize !== null;
      case 'bundle':
        return true; // Can always proceed with any wipes selection
      case 'review':
        return state.selectedSize !== null;
      default:
        return false;
    }
  }, [state.currentStep, state.selectedSize]);

  const value: PurchaseFlowContextValue = {
    state,
    setStep,
    setSize,
    setWipes,
    setOrderType,
    setAnimating,
    nextStep,
    prevStep,
    reset,
    currentStepIndex,
    totalSteps,
    selectedSizeConfig,
    selectedWipesConfig,
    diaperPrice,
    wipesPrice,
    totalPrice,
    originalDiaperPrice,
    originalWipesPrice,
    originalTotalPrice,
    totalSavings,
    diaperCount,
    canProceed,
    planType,
  };

  return (
    <PurchaseFlowContext.Provider value={value}>
      {children}
    </PurchaseFlowContext.Provider>
  );
}

export function usePurchaseFlow() {
  const context = useContext(PurchaseFlowContext);
  if (!context) {
    throw new Error('usePurchaseFlow must be used within a PurchaseFlowProvider');
  }
  return context;
}
