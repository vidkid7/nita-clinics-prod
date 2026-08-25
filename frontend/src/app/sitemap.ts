import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nitaclinics.com';

  const staticPages = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/specialists`, priority: 0.9 },
    { url: `${baseUrl}/specialists/gynecology-obstetrics`, priority: 0.9 },
    { url: `${baseUrl}/specialists/pediatrics`, priority: 0.9 },
    { url: `${baseUrl}/specialists/tuberculosis`, priority: 0.9 },
    { url: `${baseUrl}/specialists/orthopedics`, priority: 0.9 },
    { url: `${baseUrl}/services`, priority: 0.9 },
    { url: `${baseUrl}/services/laboratory`, priority: 0.9 },
    { url: `${baseUrl}/services/vaccination`, priority: 0.8 },
    { url: `${baseUrl}/services/home-visit`, priority: 0.8 },
    { url: `${baseUrl}/services/online-consultation`, priority: 0.8 },
    { url: `${baseUrl}/checkup`, priority: 0.8 },
    { url: `${baseUrl}/checkup/packages`, priority: 0.9 },
    { url: `${baseUrl}/checkup/tuberculosis`, priority: 0.7 },
    { url: `${baseUrl}/checkup/pediatrics`, priority: 0.7 },
    { url: `${baseUrl}/checkup/gynecology`, priority: 0.7 },
    { url: `${baseUrl}/vaccination`, priority: 0.8 },
    { url: `${baseUrl}/team`, priority: 0.7 },
    { url: `${baseUrl}/health-card`, priority: 0.8 },
    { url: `${baseUrl}/about`, priority: 0.6 },
    { url: `${baseUrl}/contact`, priority: 0.6 },
    { url: `${baseUrl}/blog`, priority: 0.7 },
    { url: `${baseUrl}/appointments/book`, priority: 0.9 },
  ].map((page) => ({
    ...page,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
  }));

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const posts = await fetch(`${apiUrl}/api/v1/blog?limit=100`).then((r) => r.json());
    blogPages = (posts.data || []).map((post: { slug: string; updatedAt: string }) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    blogPages = [];
  }

  return [...staticPages, ...blogPages];
}
