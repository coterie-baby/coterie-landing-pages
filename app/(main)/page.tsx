// app/page.tsx or any other client component
'use client';

import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react';

export default function HomePage() {
  // The hook provides data, loading state, and potential errors
  const { isLoading, data, error } = useVisitorData();

  if (isLoading) {
    return <div>Loading visitor data...</div>;
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  // Display the visitor ID once loaded
  return (
    <main>
      <h1>Hi!</h1>
      {data && <p>Your visitor ID is: {data.visitorId}</p>}
    </main>
  );
}
