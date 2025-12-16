import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/lib/sanity/client';
import { draftMode } from 'next/headers';
import {
  landingPageByPathQuery,
  allPagePathsQuery,
} from '@/lib/sanity/queries';
import { ComponentRenderer } from '@/components/ComponentRenderer';
import type { LandingPage, SanityComponent } from '@/types/sanity';

interface PageProps {
  params: Promise<{
    page: string[];
  }>;
}

export async function generateStaticParams() {
  try {
    const pages = await client.fetch(allPagePathsQuery);
    return pages
      .filter(
        (page: { slug: { current: string } }) =>
          page.slug?.current && page.slug.current !== 'home'
      ) // Exclude homepage
      .map((page: { slug: { current: string } }) => ({
        page: [page.slug.current], // Convert slug to array format for dynamic routes
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
  const slug = resolvedParams?.page?.[0] || '';

  try {
    const page: LandingPage = await client.fetch(landingPageByPathQuery, {
      slug,
    });

    if (!page) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
      };
    }

    return {
      title: page.seo?.metaTitle || page.title || 'Coterie',
      description:
        page.seo?.metaDescription ||
        'Premium baby products designed for safety and comfort.',
      openGraph: {
        title: page.seo?.metaTitle || page.title || 'Coterie',
        description:
          page.seo?.metaDescription ||
          'Premium baby products designed for safety and comfort.',
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
  const slug = params?.page?.[0] || '';
  const { isEnabled } = await draftMode();

  try {
    const page: LandingPage = await client.fetch(
      landingPageByPathQuery,
      { slug },
      isEnabled
        ? {
            perspective: 'previewDrafts',
            useCdn: false,
            stega: true,
          }
        : undefined
    );

    if (!page) {
      notFound();
    }

    return (
      <main>
        {page.components?.map((component: SanityComponent, index: number) => (
          <ComponentRenderer
            key={component._key || index}
            component={component}
          />
        ))}
      </main>
    );
  } catch (error) {
    console.error('Error fetching page:', error);
    notFound();
  }
}
