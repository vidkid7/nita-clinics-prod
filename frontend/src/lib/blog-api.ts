import { get } from '@/lib/api';
import type { BlogPost } from '@/lib/blog-data';
import type { PaginatedResponse } from '@/lib/api';

/** Published posts only (public API). */
export async function fetchPublishedBlogPosts(limit: number): Promise<BlogPost[]> {
  const res = await get<PaginatedResponse<BlogPost>>('blog', {
    params: { limit, sortBy: 'publishedAt', sortOrder: 'desc' },
  });
  const rows = res?.data ?? [];
  return rows.filter((p) => p.isPublished);
}
