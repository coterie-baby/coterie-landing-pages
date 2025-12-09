import type { Metadata, Viewport } from 'next';
import './globals.css';
import Footer from '@/components/global/footer';
import { GoogleTagManager } from '@next/third-parties/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity';
import { DisableDraftMode } from '@/components/disable-draft-mode';
import { VercelToolbar } from '@vercel/toolbar/next';
import AnnouncementBar from '@/components/announcement-bar';
import Header from '@/components/global/header';

export const viewport: Viewport = {
  themeColor: 'white',
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

  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-N9NL6XQ" />
      <body className={`antialiased bg-white`}>
        <AnnouncementBar />
        <Header />
        <main className="bg-white min-h-screen">{children}</main>
        <Footer />
        {(await draftMode()).isEnabled && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  );
}
