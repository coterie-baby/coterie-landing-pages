import { BundleBuilderV2 } from '@/components/bundle-builder';

export const revalidate = 60;

export const metadata = {
  title: 'Build Your Bundle | Coterie',
  description: 'Customize your diaper bundle and save 15% with Auto-Renew.',
};

export default function BuildYourBundleV2Page() {
  return <BundleBuilderV2 />;
}
