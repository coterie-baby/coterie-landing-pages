'use client';

import { DiscountProvider } from './discount-context';
import type { LpDiscount } from '@/lib/sanity/types';
import type { ReactNode } from 'react';

export default function DiscountProviderWrapper({
  discount,
  children,
}: {
  discount?: LpDiscount | null;
  children: ReactNode;
}) {
  return (
    <DiscountProvider code={discount?.code} percent={discount?.discountPercent}>
      {children}
    </DiscountProvider>
  );
}
