import { builder } from '@/lib/builder/init';
import { RenderBuilderContent } from '../../components/builder';

interface PageProps {
  params: Promise<{
    page: string[];
  }>;
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
