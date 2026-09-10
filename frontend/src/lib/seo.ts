import type { Metadata } from 'next';
import { BRAND } from '@/lib/brand';

// Canonicals must always point to the public branded domain. Vercel exposes a
// project URL during builds, but that is a deployment host—not the site users
// and search engines should treat as the canonical origin.
export const SITE_URL = BRAND.siteUrl;

/** Build an absolute URL from a site-relative path or an already absolute URL. */
export function siteUrl(path = ''): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${SITE_URL}${normalizedPath}`;
}

// This real, wide logo asset is available in production and is suitable for
// link previews until a dedicated 1200x630 brand card is supplied.
export const DEFAULT_OG_IMAGE = siteUrl('/logo.png');

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

/**
 * Metadata for indexable public pages. `title.absolute` prevents nested
 * layouts from accidentally producing duplicated brand suffixes.
 */
export function publicPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
}: PageMetadataOptions): Metadata {
  const url = siteUrl(path);
  const imageUrl = siteUrl(image);
  const openGraph = {
    type,
    locale: 'en_US',
    url,
    siteName: BRAND.name,
    title,
    description,
    images: [{ url: imageUrl, width: 600, height: 328, alt: title }],
    ...(type === 'article'
      ? {
          publishedTime,
          modifiedTime,
          authors,
        }
      : {}),
  };

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: siteUrl(item.path),
    })),
  };
}
