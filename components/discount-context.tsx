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

interface DiscountContextValue {
  discountCode: string | null;
  discountPercent: number;
  discountClaimed: boolean;
  claimDiscount: () => void;
}

const DiscountContext = createContext<DiscountContextValue>({
  discountCode: null,
  discountPercent: 0,
  discountClaimed: false,
  claimDiscount: () => {},
});

export function DiscountProvider({
  children,
  code,
  percent = 0,
}: {
  children: ReactNode;
  code?: string;
  percent?: number;
}) {
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
    <DiscountContext.Provider
      value={{
        discountCode: discountClaimed && code ? code : null,
        discountPercent: discountClaimed && code ? percent : 0,
        discountClaimed: discountClaimed && !!code,
        claimDiscount,
      }}
    >
      {children}
    </DiscountContext.Provider>
  );
}

export function useDiscount() {
  return useContext(DiscountContext);
}
