import type { Metadata } from 'next';
import { builder } from '@/lib/builder/init';
import { RenderBuilderContent } from '../../components/builder';

interface PageProps {
  params: Promise<{
    page: string[];
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const urlPath = '/' + (resolvedParams?.page?.join('/') || '');

  // Fetch Builder.io page content for metadata
  const content = await builder
    .get('page', {
      userAttributes: {
        urlPath: urlPath,
      },
      prerender: false,
    })
    .toPromise();

  if (!content) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: content.data?.title || content.data?.name || 'Coterie',
    description:
      content.data?.description ||
      'Premium baby products designed for safety and comfort.',
    openGraph: {
      title: content.data?.title || content.data?.name || 'Coterie',
      description:
        content.data?.description ||
        'Premium baby products designed for safety and comfort.',
      images: content.data?.image ? [content.data.image] : [],
    },
  };
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const model = 'page';
  const content = await builder
    .get('page', {
      userAttributes: {
        urlPath: '/' + (params?.page?.join('/') || ''),
      },
      prerender: false,
    })
    .toPromise();

  return (
    <>
      <RenderBuilderContent content={content} model={model} />
    </>
  );
}
