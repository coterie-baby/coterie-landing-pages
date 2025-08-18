import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/lib/sanity/client';
import { draftMode } from 'next/headers';
import { homePageQuery } from '@/lib/sanity/queries';
import { ComponentRenderer } from '@/components/ComponentRenderer';
import { getComponentsForAudience, getAudienceDataFromHeaders } from '@/lib/audience-targeting';
import type { LandingPage, SanityComponent } from '@/types/sanity';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page: LandingPage = await client.fetch(homePageQuery);

    if (!page) {
      return {
        title: 'Coterie',
        description: 'Premium baby products designed for safety and comfort.',
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
    console.error('Error fetching homepage metadata:', error);
    return {
      title: 'Coterie',
      description: 'Premium baby products designed for safety and comfort.',
    };
  }
}

export default async function Homepage() {
  const { isEnabled } = await draftMode();

  try {
    const page: LandingPage = await client.fetch(
      homePageQuery,
      {},
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

    // Get audience targeting data from middleware headers
    const { isTargetingEnabled, matchingVariant } = await getAudienceDataFromHeaders();

    // Get the appropriate components based on audience targeting
    const components = getComponentsForAudience(
      page.audienceTargeting || null,
      page.components || [],
      matchingVariant
    );

    return (
      <main>
        {components.map((component: SanityComponent, index: number) => (
          <ComponentRenderer
            key={component._key || index}
            component={component}
          />
        ))}
      </main>
    );
  } catch (error) {
    console.error('Error fetching homepage:', error);
    notFound();
  }
}
