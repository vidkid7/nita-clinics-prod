import { get, put } from '@/lib/api';

/** Merge partial content into a page section without wiping existing copy (e.g. text from Content Management). */
export async function mergeContentSection(
  pageSlug: string,
  sectionKey: string,
  partial: Record<string, unknown>,
): Promise<void> {
  const existing = await get<{ content?: Record<string, unknown> }>(
    `content/page/${pageSlug}/${sectionKey}`,
  ).catch(() => null);
  await put(`content/page/${pageSlug}/${sectionKey}`, {
    content: { ...(existing?.content ?? {}), ...partial },
  });
}
