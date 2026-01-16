import { get, has } from '@vercel/edge-config';

export interface ForeverLinkMapping {
  destination: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForeverLinksConfig {
  default: string;
  mappings: Record<string, ForeverLinkMapping>;
}

const DEFAULT_CONFIG: ForeverLinksConfig = {
  default: 'https://www.coterie.com/products/the-diaper',
  mappings: {},
};

/**
 * Get the Forever Links configuration from Edge Config
 * Returns the full config including default and all mappings
 */
export async function getForeverLinksConfig(): Promise<ForeverLinksConfig> {
  try {
    const config = await get<ForeverLinksConfig>('foreverLinks');
    return config ?? DEFAULT_CONFIG;
  } catch (error) {
    console.error('Error reading Forever Links config:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Get the destination for a specific utm_content value
 * Returns the mapped destination or null if not found
 */
export async function getDestinationForUtm(
  utmContent: string
): Promise<string | null> {
  try {
    const config = await get<ForeverLinksConfig>('foreverLinks');
    if (!config?.mappings) return null;

    const mapping = config.mappings[utmContent];
    return mapping?.destination ?? null;
  } catch (error) {
    console.error('Error getting destination for UTM:', error);
    return null;
  }
}

/**
 * Get the default fallback destination
 */
export async function getDefaultDestination(): Promise<string> {
  try {
    const config = await get<ForeverLinksConfig>('foreverLinks');
    return config?.default ?? DEFAULT_CONFIG.default;
  } catch (error) {
    console.error('Error getting default destination:', error);
    return DEFAULT_CONFIG.default;
  }
}

/**
 * Check if Edge Config is properly configured
 */
export async function isEdgeConfigAvailable(): Promise<boolean> {
  try {
    return await has('foreverLinks');
  } catch {
    return false;
  }
}

/**
 * Build a redirect URL preserving query parameters
 * @param destination - The target URL (can be relative or absolute)
 * @param currentUrl - The current request URL to extract params from
 * @param excludeParams - Parameters to exclude (like utm_content after processing)
 */
export function buildRedirectUrl(
  destination: string,
  currentUrl: URL,
  excludeParams: string[] = []
): string {
  // Get all current query params except excluded ones
  const params = new URLSearchParams();
  currentUrl.searchParams.forEach((value, key) => {
    if (!excludeParams.includes(key)) {
      params.append(key, value);
    }
  });

  const queryString = params.toString();

  // Check if destination is absolute URL or relative path
  if (destination.startsWith('http://') || destination.startsWith('https://')) {
    const destUrl = new URL(destination);
    // Merge params - destination params take precedence
    params.forEach((value, key) => {
      if (!destUrl.searchParams.has(key)) {
        destUrl.searchParams.append(key, value);
      }
    });
    return destUrl.toString();
  }

  // Relative path - append query string
  if (queryString) {
    const separator = destination.includes('?') ? '&' : '?';
    return `${destination}${separator}${queryString}`;
  }

  return destination;
}
