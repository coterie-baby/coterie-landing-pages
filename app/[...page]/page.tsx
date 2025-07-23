import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/lib/sanity/client';
import { landingPageByPathQuery, allPagePathsQuery } from '@/lib/sanity/queries';
import { ComponentRenderer } from '@/components/ComponentRenderer';
import type { SanityComponent } from '@/types/sanity';

interface PageProps {
  params: Promise<{
    page: string[];
  }>;
}

// Generate static params for all pages at build time
export async function generateStaticParams() {
  try {
    const pages = await client.fetch(allPagePathsQuery);
    
    return pages
      .filter((page: { path: string }) => page.path && page.path !== '/') // Exclude homepage
      .map((page: { path: string }) => ({
        page: page.path.split('/').filter(Boolean), // Convert "/about/team" to ["about", "team"]
      }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const path = '/' + (resolvedParams?.page?.join('/') || '');

  try {
    const page = await client.fetch(landingPageByPathQuery, { path });

    if (!page) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
      };
    }

    return {
      title: page.seo?.title || page.title || 'Coterie',
      description: page.seo?.description || 'Premium baby products designed for safety and comfort.',
      openGraph: {
        title: page.seo?.title || page.title || 'Coterie',
        description: page.seo?.description || 'Premium baby products designed for safety and comfort.',
      },
    };
  } catch (error) {
    console.error('Error fetching page metadata:', error);
    return {
      title: 'Coterie',
      description: 'Premium baby products designed for safety and comfort.',
    };
  }
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const path = '/' + (params?.page?.join('/') || '');

  try {
    const page = await client.fetch(landingPageByPathQuery, { path });

    if (!page) {
      notFound();
    }

    return (
      <main>
        {page.components?.map((component: SanityComponent, index: number) => (
          <ComponentRenderer key={component._key || index} component={component} />
        ))}
      </main>
    );
  } catch (error) {
    console.error('Error fetching page:', error);
    notFound();
  }
}