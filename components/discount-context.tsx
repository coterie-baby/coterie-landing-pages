'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

const DISCOUNT_CLAIMED_KEY = 'coterie_first_visit_discount';

export const FIRST_ORDER_DISCOUNT_PERCENT = 0.10;
export const FIRST_ORDER_DISCOUNT_CODE = 'UPGRADETEN';

interface DiscountContextValue {
  discountClaimed: boolean;
  claimDiscount: () => void;
}

const DiscountContext = createContext<DiscountContextValue>({
  discountClaimed: false,
  claimDiscount: () => {},
});

export function DiscountProvider({ children }: { children: ReactNode }) {
  const [discountClaimed, setDiscountClaimed] = useState(false);

  useEffect(() => {
    try {
      setDiscountClaimed(localStorage.getItem(DISCOUNT_CLAIMED_KEY) === 'claimed');
    } catch {
      // localStorage unavailable
    }
  }, []);

  const claimDiscount = useCallback(() => {
    try {
      localStorage.setItem(DISCOUNT_CLAIMED_KEY, 'claimed');
    } catch {
      // ignore
    }
    setDiscountClaimed(true);
  }, []);

  return (
    <DiscountContext.Provider value={{ discountClaimed, claimDiscount }}>
      {children}
    </DiscountContext.Provider>
  );
}

export function useDiscount() {
  return useContext(DiscountContext);
}
