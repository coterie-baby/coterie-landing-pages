import { client } from '../../lib/sanity/client';

// Reserved paths that shouldn't be used for landing pages
const RESERVED_PATHS = [
  '/studio',
  '/api',
  '/components',
  '/admin',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

export async function validateUniquePath(path: string, currentDocId?: string) {
  // Check if path is reserved
  if (RESERVED_PATHS.some(reserved => path.startsWith(reserved))) {
    return `Path "${path}" is reserved and cannot be used`;
  }

  // Check for existing pages with the same path
  const query = currentDocId 
    ? `*[_type == "landingPage" && path == $path && _id != $currentDocId]`
    : `*[_type == "landingPage" && path == $path]`;
  
  const existingPages = await client.fetch(query, { 
    path, 
    currentDocId 
  });

  if (existingPages.length > 0) {
    return `A page with path "${path}" already exists`;
  }

  return true;
}