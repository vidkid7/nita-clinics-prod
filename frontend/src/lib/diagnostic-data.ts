import { LAB_PRICE_LIST_BY_SLUG } from './lab-price-list';

/**
 * Types + helpers for lab tests. All catalog data is loaded from the API (`lab-tests`, `lab-tests/categories`).
 */

export type DiagnosticCategory = {
  slug: string;
  label: string;
  icon: string;
  description: string;
  color: string;
};

export type DiagnosticTest = {
  id: string;
  slug?: string;
  name: string;
  category: string;
  categorySlug: string;
  categoryId?: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice: number;
  image?: string;
  turnaround: string;
  sampleType: string;
  isPopular?: boolean;
  tags?: string[];
  includes?: string[];
};

const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80';

/** Map API lab test + joined category to list/detail card shape */
export function mapLabTestFromApi(raw: Record<string, unknown>): DiagnosticTest {
  const cat = raw.category as Record<string, unknown> | string | undefined;
  const categoryName = typeof cat === 'object' && cat && 'name' in cat ? String(cat.name) : '';
  const categorySlug =
    typeof cat === 'object' && cat && 'slug' in cat ? String(cat.slug) : String(raw.categorySlug || '');
  const categoryId =
    typeof cat === 'object' && cat && 'id' in cat ? String(cat.id) : String(raw.categoryId || '');

  const price = Number(raw.price ?? 0);
  const original = raw.originalPrice != null ? Number(raw.originalPrice) : price;
  const slug = raw.slug != null ? String(raw.slug) : '';
  const canonical = LAB_PRICE_LIST_BY_SLUG[slug];

  // The workbook is the source of truth for the public catalogue. Preserve
  // the API id, but do not let stale category names, prices, or fake discounts
  // change what patients see.
  if (canonical) {
    return {
      ...canonical,
      id: String(raw.id),
      categoryId: categoryId || undefined,
      image: raw.image != null ? String(raw.image) : undefined,
      isPopular: Boolean(raw.isPopular),
    };
  }

  const out: DiagnosticTest = {
    id: String(raw.id),
    name: String(raw.name || ''),
    category: categoryName,
    categorySlug,
    categoryId: categoryId || undefined,
    description: String(raw.description || ''),
    longDescription: raw.longDescription != null ? String(raw.longDescription) : undefined,
    price,
    originalPrice: original,
    image: raw.image != null ? String(raw.image) : undefined,
    turnaround: String(raw.turnaround || '—'),
    sampleType: String(raw.sampleType || '—'),
    isPopular: Boolean(raw.isPopular),
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    includes: Array.isArray(raw.includes) ? (raw.includes as string[]) : [],
  };
  if (slug) out.slug = slug;
  return out;
}

export function getSavingsPercent(price: number, original: number): number {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

export function testDetailPath(test: DiagnosticTest): string {
  const seg = test.slug || test.id;
  return `/diagnostic-test/${seg}`;
}

export function testImageOrPlaceholder(test: DiagnosticTest): string {
  return test.image?.trim() || PLACEHOLDER_IMG;
}
