import Footer from '@/components/global/footer';
import AnnouncementBar from '@/components/announcement-bar';
import Header from '@/components/global/header';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="bg-white min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
