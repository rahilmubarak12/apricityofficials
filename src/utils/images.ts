/**
 * Appends a width parameter to Shopify CDN image URLs.
 * Example: https://cdn.shopify.com/s/files/.../image.jpg?v=123 -> ...&width=600
 */
export function getOptimizedImageUrl(url: string, width = 800): string {
  if (!url) return '';
  if (!url.includes('cdn.shopify.com')) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('width', width.toString());
    return parsed.toString();
  } catch (e) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${width}`;
  }
}

/**
 * Generates a srcSet string for responsive Shopify CDN images.
 */
export function getShopifySrcSet(url: string): string {
  if (!url || !url.includes('cdn.shopify.com')) return '';
  return [400, 600, 800, 1000, 1200]
    .map((w) => `${getOptimizedImageUrl(url, w)} ${w}w`)
    .join(', ');
}
