'use client';

import { useEffect } from 'react';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

export function LogRocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID!);
    setupLogRocketReact(LogRocket);
  }, []);

  return <>{children}</>;
}
