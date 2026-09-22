import type { Metadata } from 'next';
import { getBlogPost, type BlogPost } from '@/lib/blog-data';
import { JsonLd } from '@/components/seo/JsonLd';
import { publicPageMetadata, siteUrl } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site-url';

type Props = { params: { slug: string } };

async function getPost(slug: string): Promise<BlogPost | undefined> {
  const fallback = getBlogPost(slug);
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!rawApiUrl) return fallback;

  try {
    const apiUrl = absoluteUrl(rawApiUrl, '');
    const response = await fetch(`${apiUrl}/api/v1/blog/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (response.ok) {
      const post = (await response.json()) as BlogPost;
      if (post?.isPublished !== false) return post;
    }
  } catch {
    // The static fallback keeps public article metadata available if the API is unavailable.
  }

  return fallback;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) {
    return {
      title: 'Health Article Not Found | Nita Clinic',
      robots: { index: false, follow: false },
    };
  }

  return publicPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${params.slug}`,
    image: post.featuredImage,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt || post.publishedAt,
    authors: [post.author],
    keywords: [post.category, ...post.tags, 'health advice Nepal'],
  });
}

export default async function BlogPostLayout({ children, params }: Props & { children: React.ReactNode }) {
  const post = await getPost(params.slug);
  const articleSchema = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${siteUrl(`/blog/${params.slug}`)}#article`,
        headline: post.title,
        description: post.excerpt,
        image: [siteUrl(post.featuredImage)],
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: {
          '@type': 'Organization',
          name: post.author,
          url: siteUrl('/team'),
        },
        publisher: { '@id': `${siteUrl()}/#medical-clinic` },
        mainEntityOfPage: siteUrl(`/blog/${params.slug}`),
        articleSection: post.category,
        keywords: post.tags.join(', '),
      }
    : null;

  return (
    <>
      {articleSchema && <JsonLd data={articleSchema} />}
      {children}
    </>
  );
}
