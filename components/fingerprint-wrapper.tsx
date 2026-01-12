'use client';

import { FpjsProvider } from '@fingerprintjs/fingerprintjs-pro-react';
export default function FingerprintWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure the API key is safely handled using environment variables
  const apiKey = process.env.NEXT_PUBLIC_FPJS_API_KEY || 'PLlkegUBVVWF9KAd7SQJ';

  return (
    <FpjsProvider
      loadOptions={{
        apiKey: apiKey,
        // Add other options like 'region' if necessary
      }}
    >
      {children}
    </FpjsProvider>
  );
}
