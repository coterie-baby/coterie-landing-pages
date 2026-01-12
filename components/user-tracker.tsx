// app/meta-landing/BotTracker.tsx
'use client';
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react';
import { useEffect } from 'react';

export default function UserTracker() {
  // Use 'extendedResult: true' to get bot detection signals in the Pro version
  const { data } = useVisitorData({ extendedResult: true });

  useEffect(() => {
    if (data) {
      // Logic to log or handle bot detection
      // Pro version provides 'data.bot.result' (e.g., "bad", "good", "not_detected")
      console.log('Visitor ID:', data.visitorId);
    }
  }, [data]);

  return null; // This component stays invisible
}
