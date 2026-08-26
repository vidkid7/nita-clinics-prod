/**
 * Types for vaccines. Catalog comes from API `vaccinations`.
 */

export type VaccineCategory = 'All' | 'Children' | 'Adults' | 'Travel' | 'Women' | 'Seniors';

export type Vaccine = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: VaccineCategory[];
  tagline: string;
  description: string;
  longDescription: string;
  image: string;
  whoItIsFor: string;
  schedule: string;
  doses: string;
  protectsAgainst: string[];
  sideEffects: string[];
  contraindications: string[];
  notes?: string;
  availability: 'Available in Clinic' | 'On Request' | 'Seasonal';
  priceNote: string;
};

export const VACCINE_CATEGORIES: VaccineCategory[] = [
  'All',
  'Adults',
  'Women',
  'Children',
  'Seniors',
];

export const VACCINATION_CATALOG_IMAGE = '/videos/hero/vaccination-care.jpg';

const VACCINATION_CATALOG_IMAGES: Record<string, string> = {
  'tetanus-toxoid-tt': '/images/catalogue/vaccine-syringe.jpg',
  'influenza-vaccine': '/images/catalogue/vaccine-child.jpg',
  'pneumococcal-vaccine': '/images/catalogue/vaccine-patient.jpg',
};

const GENERIC_CATALOG_IMAGE_RE = /(?:images\.)?unsplash\.com|source\.unsplash\.com/i;

/** Keep custom media, but replace generic/default catalogue imagery locally. */
export function resolveVaccineImage(image: unknown, slug?: string, name?: string): string {
  const value = typeof image === 'string' ? image.trim() : '';
  if (value && !GENERIC_CATALOG_IMAGE_RE.test(value)) return value;
  if (slug && VACCINATION_CATALOG_IMAGES[slug]) return VACCINATION_CATALOG_IMAGES[slug];
  const normalizedName = name?.toLowerCase() || '';
  if (normalizedName.includes('tetanus')) return VACCINATION_CATALOG_IMAGES['tetanus-toxoid-tt'];
  if (normalizedName.includes('influenza') || normalizedName.includes('flu')) return VACCINATION_CATALOG_IMAGES['influenza-vaccine'];
  if (normalizedName.includes('pneumococ')) return VACCINATION_CATALOG_IMAGES['pneumococcal-vaccine'];
  return VACCINATION_CATALOG_IMAGE;
}

function asAvail(v: string | undefined): Vaccine['availability'] {
  if (v === 'On Request' || v === 'Seasonal') return v;
  return 'Available in Clinic';
}

export function mapVaccineFromApi(raw: Record<string, unknown>): Vaccine {
  const cats = Array.isArray(raw.category) ? (raw.category as string[]) : [];
  return {
    id: String(raw.id),
    slug: String(raw.slug || ''),
    name: String(raw.name || ''),
    shortName: String(raw.shortName || raw.name || ''),
    category: cats as VaccineCategory[],
    tagline: String(raw.tagline || ''),
    description: String(raw.description || ''),
    longDescription: String(raw.longDescription || raw.description || ''),
    image: resolveVaccineImage(raw.image, String(raw.slug || ''), String(raw.name || '')),
    whoItIsFor: String(raw.whoItIsFor || ''),
    schedule: String(raw.schedule || ''),
    doses: String(raw.doses || ''),
    protectsAgainst: Array.isArray(raw.protectsAgainst) ? (raw.protectsAgainst as string[]) : [],
    sideEffects: Array.isArray(raw.sideEffects) ? (raw.sideEffects as string[]) : [],
    contraindications: Array.isArray(raw.contraindications) ? (raw.contraindications as string[]) : [],
    notes: raw.notes != null ? String(raw.notes) : undefined,
    availability: asAvail(raw.availability != null ? String(raw.availability) : undefined),
    priceNote: String(raw.priceNote || 'Contact clinic for pricing'),
  };
}

/**
 * Offline fallback vaccine catalog — mirrors the backend seed slugs so detail
 * pages still render (instead of a 404) when the API returns no data.
 *
 * Catalog is intentionally narrow: only the vaccines the clinic currently
 * offers. Slugs here MUST match the backend seed (`seed-catalog.ts`).
 */
export const FALLBACK_VACCINES: Vaccine[] = [
  {
    id: 'fb-tt',
    slug: 'tetanus-toxoid-tt',
    name: 'Tetanus Toxoid (T.T)',
    shortName: 'T-T',
    category: ['Adults', 'Women'],
    tagline: 'Tetanus protection & wound prevention',
    description: 'Tetanus toxoid vaccine for adults and during pregnancy.',
    longDescription:
      'Tetanus toxoid (T-T) protects against tetanus, a serious bacterial infection caused by Clostridium tetani that enters the body through wounds. The vaccine is given as a booster every 10 years for adults and is routinely recommended during each pregnancy (ideally between 27–36 weeks) to protect the newborn through maternal antibody transfer.',
    image: VACCINATION_CATALOG_IMAGES['tetanus-toxoid-tt'],
    whoItIsFor: 'Adults; pregnant women (27–36 wks)',
    schedule: 'Every 10 years; each pregnancy',
    doses: '1 dose',
    protectsAgainst: ['Tetanus (lockjaw)'],
    sideEffects: ['Arm soreness', 'Mild fever', 'Fatigue'],
    contraindications: ['Severe allergy to a previous dose'],
    availability: 'Available in Clinic',
    priceNote: 'Contact clinic',
  },
  {
    id: 'fb-flu',
    slug: 'influenza-vaccine',
    name: 'Influenza Vaccine',
    shortName: 'Influenza',
    category: ['Adults', 'Children', 'Seniors'],
    tagline: 'Annual seasonal flu protection',
    description: 'Yearly flu shot covering current circulating strains.',
    longDescription:
      'The seasonal influenza vaccine is updated each year to protect against the influenza virus strains expected to circulate. Annual vaccination is recommended for everyone 6 months and older, and is especially important for older adults, young children, pregnant women, and people with chronic conditions such as asthma, diabetes, or heart disease. Get vaccinated before the flu season peaks to reduce the risk of severe illness and complications.',
    image: VACCINATION_CATALOG_IMAGES['influenza-vaccine'],
    whoItIsFor: '6 months and older',
    schedule: 'Once yearly',
    doses: '1 dose (2 for some children)',
    protectsAgainst: ['Seasonal influenza A/B strains'],
    sideEffects: ['Arm soreness', 'Mild fever', 'Body aches'],
    contraindications: ['Severe allergy to vaccine components'],
    availability: 'Seasonal',
    priceNote: 'Contact clinic',
  },
  {
    id: 'fb-pneumo',
    slug: 'pneumococcal-vaccine',
    name: 'Pneumococcal Vaccine',
    shortName: 'Pneumococcal',
    category: ['Adults', 'Seniors', 'Children'],
    tagline: 'Pneumonia & invasive disease prevention',
    description: 'Conjugate or polysaccharide vaccine per age and risk.',
    longDescription:
      'The pneumococcal vaccine protects against Streptococcus pneumoniae, a leading cause of pneumonia, meningitis, and bloodstream infections. It is recommended for infants, adults over 65, and individuals with chronic illnesses or weakened immune systems. The conjugate (PCV) and polysaccharide (PPSV) formulations are used per age and clinical indication.',
    image: VACCINATION_CATALOG_IMAGES['pneumococcal-vaccine'],
    whoItIsFor: 'Infants, elderly (65+), high-risk adults',
    schedule: 'Per age and risk-based schedule',
    doses: '1–4 doses',
    protectsAgainst: ['Streptococcus pneumoniae (covered serotypes)'],
    sideEffects: ['Injection site soreness', 'Mild fever'],
    contraindications: ['Severe allergy to a previous dose or component'],
    availability: 'Available in Clinic',
    priceNote: 'Contact clinic',
  },
];

/** Look up a vaccine by slug from the offline fallback catalog. */
export function getVaccineBySlug(slug: string): Vaccine | undefined {
  return FALLBACK_VACCINES.find((v) => v.slug === slug);
}
