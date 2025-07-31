import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/global/header';
import Footer from '@/components/global/footer';
import { GoogleTagManager } from '@next/third-parties/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity';
import { DisableDraftMode } from '@/components/disable-draft-mode';

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
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-N9NL6XQ" />
      <body className={`antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        {(await draftMode()).isEnabled && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  );
}
