import { headers } from 'next/headers';
import type { AudienceTargeting, AudienceVariant, SanityComponent } from '@/types/sanity';

export async function getAudienceDataFromHeaders(): Promise<{
  isTargetingEnabled: boolean;
  matchingVariant: string | null;
}> {
  const headersList = await headers();
  const isTargetingEnabled = headersList.get('x-audience-targeting-enabled') === 'true';
  const matchingVariant = headersList.get('x-audience-variant');

  return {
    isTargetingEnabled,
    matchingVariant,
  };
}

export function getComponentsForAudience(
  audienceTargeting: AudienceTargeting | null,
  defaultComponents: SanityComponent[],
  matchingVariantName?: string | null
): SanityComponent[] {
  // If no audience targeting or no matching variant, return default components
  if (!audienceTargeting?.enabled || !matchingVariantName) {
    return defaultComponents || [];
  }

  // Find the matching variant and return its components
  const matchingVariant = audienceTargeting.variants?.find(
    variant => variant.name === matchingVariantName
  );

  if (matchingVariant?.components?.length > 0) {
    return matchingVariant.components;
  }

  return defaultComponents || [];
}