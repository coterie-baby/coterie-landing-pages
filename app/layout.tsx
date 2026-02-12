import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GoogleTagManager } from '@next/third-parties/google';
import { VercelToolbar } from '@vercel/toolbar/next';
import { Amplitude } from '@/amplitude';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GTMTracking } from '@/lib/gtm';
import { draftMode } from 'next/headers';
import SanityVisualEditing from '@/components/sanity-visual-editing';

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
};

export const metadata: Metadata = {
  title:
    'Coterie Diapers, Baby Wipes | Clean, High-performing Baby Care | Coterie',
  description:
    'High-performing diapers and baby wipes for uncompromising parents. Our diapers are ultra-soft, highly absorbent, and fast wicking, with clean ingredients for comfort and peace of mind.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shouldInjectToolbar = process.env.NODE_ENV === 'development';
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en">
      <head>
        {/* DNS prefetch and preconnect for external domains */}
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link
          rel="preconnect"
          href="https://player.vimeo.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://player.vimeo.com" />

        {/* Preload critical fonts for faster text rendering */}
        <link
          rel="preload"
          href="/fonts/CoterieSuisse-Regular-WebXL.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/CoterieSuisse-Medium-WebXL.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <GoogleTagManager gtmId="GTM-N9NL6XQ" />
      <Amplitude />
      <body className="antialiased bg-white">
        <GTMTracking />
        {children}
        {shouldInjectToolbar && <VercelToolbar />}
        {isDraftMode && <SanityVisualEditing />}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
