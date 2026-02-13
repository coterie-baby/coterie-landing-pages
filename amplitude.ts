'use client';

import * as amplitude from '@amplitude/unified';

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

function initAmplitude() {
  if (typeof window !== 'undefined' && AMPLITUDE_API_KEY) {
    amplitude.initAll(AMPLITUDE_API_KEY, {
      analytics: { autocapture: true, defaultTracking: true },
      sessionReplay: { sampleRate: 0 },
    });
  }
}

initAmplitude();

export const Amplitude = () => null;
export default amplitude;
