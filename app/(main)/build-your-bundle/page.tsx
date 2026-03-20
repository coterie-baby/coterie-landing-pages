import BundleBuilder from '@/components/bundle-builder';

export const revalidate = 60;

export const metadata = {
  title: 'Build Your Bundle | Coterie',
  description: 'Customize your diaper bundle and save 10% with Auto-Renew.',
};

export default function BuildYourBundlePage() {
  return <BundleBuilder />;
}
