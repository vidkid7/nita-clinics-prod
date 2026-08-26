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

export const LAB_CATALOG_IMAGES = {
  specimen: '/videos/hero/diagnostics-lab.jpg',
  microscopy: '/videos/hero/lab-microscope.jpg',
  imaging: '/videos/hero/tb-xray-review.jpg',
} as const;

/**
 * Local catalogue art for the workbook's 35 tests. The API may still contain
 * legacy generic image URLs, so the resolver below uses these images whenever
 * a test has no deliberate custom upload.
 */
const LOCAL_LAB_IMAGES_BY_SLUG: Record<string, string> = {
  hb: '/images/catalogue/blood-tube.jpg',
  tc: '/images/catalogue/blood-vials.jpg',
  dc: '/images/catalogue/blood-specimen.jpg',
  platelets: '/images/catalogue/blood-microscope.jpg',
  'pcv-hct': '/images/catalogue/lab-beakers.jpg',
  esr: '/images/catalogue/microscope-team.jpg',
  bt: '/videos/hero/diagnostics-lab.jpg',
  ct: '/images/catalogue/blood-tube.jpg',
  'blood-sugar': '/images/catalogue/pipette.jpg',
  rft: '/images/catalogue/chemistry-flasks.jpg',
  lft: '/images/catalogue/lab-beakers.jpg',
  'lipid-profile': '/images/catalogue/blood-vials.jpg',
  'serum-uric-acid': '/images/catalogue/blood-specimen.jpg',
  'serum-calcium': '/images/catalogue/microscope-team.jpg',
  'blood-group-rh': '/images/catalogue/blood-tube.jpg',
  'ra-factor': '/images/catalogue/rapid-test.jpg',
  crp: '/images/catalogue/petri-dish.jpg',
  aso: '/images/catalogue/petri-culture.jpg',
  'widal-test': '/videos/hero/diagnostics-lab.jpg',
  vdrl: '/images/catalogue/pipette.jpg',
  'hiv-rapid': '/images/catalogue/blood-microscope.jpg',
  'hbsag-rapid': '/images/catalogue/blood-vials.jpg',
  'hcv-rapid': '/images/catalogue/blood-specimen.jpg',
  'dengue-serology': '/images/catalogue/petri-dish.jpg',
  'h-pylori-antigen': '/images/catalogue/stool-sample.jpg',
  'mp-ag': '/videos/hero/lab-microscope.jpg',
  'gram-stain': '/images/catalogue/petri-culture.jpg',
  'afb-stain': '/images/catalogue/microscope-team.jpg',
  'koh-preparation': '/images/catalogue/pipette.jpg',
  'urine-re': '/images/catalogue/stool-sample.jpg',
  'stool-re': '/images/catalogue/petri-dish.jpg',
  'occult-blood': '/images/catalogue/blood-specimen.jpg',
  'reducing-sugar': '/images/catalogue/rapid-test.jpg',
  'semen-analysis': '/images/catalogue/chemistry-flasks.jpg',
  'urine-pregnancy-test': '/images/catalogue/vaccine-vial.jpg',
};

const GENERIC_CATALOG_IMAGE_RE = /(?:images\.)?unsplash\.com|source\.unsplash\.com/i;

function isGenericCatalogImage(image: string | undefined): boolean {
  return !image || GENERIC_CATALOG_IMAGE_RE.test(image);
}

/**
 * Resolve the catalogue image once for every lab surface.
 * API media is kept when it is a deliberate custom upload; generic catalogue
 * placeholders are replaced by the local stock image that best fits the test.
 */
export function resolveLabTestImage(test: Pick<DiagnosticTest, 'slug' | 'image' | 'category' | 'categorySlug' | 'name' | 'description' | 'sampleType' | 'tags'>): string {
  const customImage = test.image?.trim();
  if (customImage && !isGenericCatalogImage(customImage)) return customImage;

  const mappedImage = test.slug ? LOCAL_LAB_IMAGES_BY_SLUG[test.slug] : undefined;
  if (mappedImage) return mappedImage;

  const searchableText = [
    test.categorySlug,
    test.category,
    test.name,
    test.description,
    test.sampleType,
    ...(test.tags ?? []),
  ]
    .join(' ')
    .toLowerCase();

  if (/x[- ]?ray|xray|radiolog|imaging|ultrasound|sonograph|mri|ct scan|ecg|echocardi|scan/.test(searchableText)) {
    return LAB_CATALOG_IMAGES.imaging;
  }

  if (/microbiolog|parasitolog|microscop|patholog|stool|urine|semen|culture|sputum|fungal|parasite|malaria|body fluid|smear|gram/.test(searchableText)) {
    return LAB_CATALOG_IMAGES.microscopy;
  }

  return LAB_CATALOG_IMAGES.specimen;
}

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
