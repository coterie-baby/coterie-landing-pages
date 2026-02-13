import { cache } from 'react';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import type { Metadata } from 'next';
import { getClient, pageBySlugQuery, allPageSlugsQuery } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity/image';
import { renderSanityComponent } from '@/lib/sanity/component-registry';
import type { SanityPage } from '@/lib/sanity/types';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

const getPage = cache(
  async (slug: string, preview: boolean): Promise<SanityPage | null> => {
    const client = getClient(preview);
    return client.fetch<SanityPage | null>(pageBySlugQuery, { slug });
  }
);

export async function generateStaticParams() {
  const slugs = await getClient().fetch<string[]>(allPageSlugsQuery);
  return slugs.map((slug) => ({ slug: slug.split('/') }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const page = await getPage(slugPath, false);

  if (!page) return {};

  const metadata: Metadata = {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
  };

  if (page.seo?.ogImage?.asset) {
    metadata.openGraph = {
      images: [{ url: urlFor(page.seo.ogImage).width(1200).height(630).url() }],
    };
  }

  if (page.seo?.noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

// If a slug is not in the list above, a 404 page will be returned
export const dynamicParams = false;

export default async function SanityPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const { isEnabled: preview } = await draftMode();
  const page = await getPage(slugPath, preview);

  if (!page) {
    notFound();
  }

  return (
    <>{page.components?.map((component) => renderSanityComponent(component))}</>
  );
}
