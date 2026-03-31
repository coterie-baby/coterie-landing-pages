import Footer from '@/components/global/footer';
import AnnouncementBar from '@/components/announcement-bar';
import Header from '@/components/global/header';
import { CartProvider } from '@/components/cart/cart-context';
import CartDrawer from '@/components/cart/cart-drawer';
import ShopifyProviderWrapper from '@/components/cart/shopify-provider';
import { DiscountProvider } from '@/components/discount-context';
import { LogRocketProvider } from '@/components/providers/logrocket-provider';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LogRocketProvider>
    <ShopifyProviderWrapper>
      <DiscountProvider>
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main className="bg-white min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </DiscountProvider>
    </ShopifyProviderWrapper>
    </LogRocketProvider>
  );
}
