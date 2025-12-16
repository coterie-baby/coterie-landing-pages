'use client';

import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="flex flex-col h-full animate-page-enter">
      {children}
    </div>
  );
}
