import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site-url';
import { FALLBACK_BLOG_POSTS, type BlogPost } from '@/lib/blog-data';
import { FALLBACK_LAB_TESTS } from '@/lib/diagnostic-data-fallback';
import { mapLabTestFromApi, testDetailPath, type DiagnosticTest } from '@/lib/diagnostic-data';
import { FALLBACK_VACCINES, mapVaccineFromApi, type Vaccine } from '@/lib/vaccine-data';
import { siteUrl } from '@/lib/seo';

const PUBLIC_PAGES: Array<{
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
}> = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/specialists', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/specialists/gynecology-obstetrics', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/specialists/pediatrics', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/specialists/tuberculosis', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/specialists/orthopedics', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/services/laboratory', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/services/vaccination', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/home-visit', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/online-consultation', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/pharmacy', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/checkup', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/checkup/packages', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/checkup/tuberculosis', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/checkup/pediatrics', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/checkup/gynecology', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/checkup/orthopedics', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/diagnostic-test', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/vaccination', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/team', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/doctors', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/health-card', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'yearly' },
  { path: '/gallery', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/lab-reports', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/appointments/book', priority: 0.9, changeFrequency: 'weekly' },
];

function safeDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

async function fetchPublishedBlogPosts(): Promise<BlogPost[]> {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!rawApiUrl) return [];

  try {
    const apiUrl = absoluteUrl(rawApiUrl, '');
    const response = await fetch(`${apiUrl}/api/v1/blog?limit=100`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const payload = (await response.json()) as { data?: BlogPost[] };
    return (payload.data ?? []).filter((post) => post.isPublished);
  } catch {
    return [];
  }
}

async function fetchCatalogRows(path: string): Promise<Record<string, unknown>[]> {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!rawApiUrl) return [];

  try {
    const apiUrl = absoluteUrl(rawApiUrl, '');
    const response = await fetch(`${apiUrl}/api/v1/${path}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const payload = (await response.json()) as { data?: Record<string, unknown>[] };
    return payload.data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = PUBLIC_PAGES.map(({ path, priority, changeFrequency }) => ({
    url: siteUrl(path),
    priority,
    changeFrequency,
  }));

  const [apiPosts, apiLabRows, apiVaccineRows] = await Promise.all([
    fetchPublishedBlogPosts(),
    fetchCatalogRows('lab-tests?limit=1000'),
    fetchCatalogRows('vaccinations?limit=100'),
  ]);
  const postsBySlug = new Map(
    [...FALLBACK_BLOG_POSTS, ...apiPosts].map((post) => [post.slug, post]),
  );
  const blogPages = [...postsBySlug.values()].map((post) => ({
    url: siteUrl(`/blog/${post.slug}`),
    lastModified: safeDate(post.updatedAt || post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const testsByPath = new Map<string, DiagnosticTest>(
    [...FALLBACK_LAB_TESTS, ...apiLabRows.map(mapLabTestFromApi)].map((test) => [testDetailPath(test), test]),
  );
  const labTestPages = [...testsByPath.values()].map((test) => ({
    url: siteUrl(testDetailPath(test)),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const vaccinesBySlug = new Map<string, Vaccine>(
    [...FALLBACK_VACCINES, ...apiVaccineRows.map(mapVaccineFromApi)].map((vaccine) => [vaccine.slug, vaccine]),
  );
  const vaccinePages = [...vaccinesBySlug.values()].map((vaccine) => ({
    url: siteUrl(`/vaccination/${vaccine.slug}`),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...labTestPages, ...vaccinePages];
}
