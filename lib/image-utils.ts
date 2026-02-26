export function getCartThumbnailUrl(url: string): string {
  if (!url) return url;
  if (!url.includes('cdn.sanity.io')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=160&h=160&q=80&fit=crop&auto=format`;
}
