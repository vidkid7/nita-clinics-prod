import type { DiagnosticCategory, DiagnosticTest } from './diagnostic-data';

/**
 * Canonical laboratory catalogue transcribed from "Price list for website.xlsx".
 * Keep this list authoritative in the UI so stale API fields cannot change the
 * public names, departments, or rates shown to patients.
 */
export const CANONICAL_LAB_CATEGORIES: DiagnosticCategory[] = [
  {
    slug: 'haematology',
    label: 'Haematology',
    icon: '🩸',
    description: 'Blood counts and coagulation tests.',
    color: 'bg-rose-600',
  },
  {
    slug: 'biochemistry',
    label: 'Biochemistry',
    icon: '🧪',
    description: 'Sugar, kidney, liver, lipid and mineral tests.',
    color: 'bg-amber-500',
  },
  {
    slug: 'serology',
    label: 'Serology',
    icon: '🛡️',
    description: 'Blood group, antibody, antigen and infection screening.',
    color: 'bg-violet-600',
  },
  {
    slug: 'microbiology',
    label: 'Microbiology',
    icon: '🔬',
    description: 'Stains and microscopy preparation tests.',
    color: 'bg-emerald-600',
  },
  {
    slug: 'parasitology',
    label: 'Parasitology',
    icon: '🧫',
    description: 'Urine, stool and body-fluid analysis.',
    color: 'bg-lime-600',
  },
];

type TestDefinition = readonly [
  slug: string,
  name: string,
  categorySlug: string,
  price: number,
  sampleType: string,
  description: string,
];

const TEST_DEFINITIONS: TestDefinition[] = [
  ['hb', 'Hb', 'haematology', 150, 'Blood', 'Haemoglobin level.'],
  ['tc', 'TC', 'haematology', 150, 'Blood', 'Total leukocyte count.'],
  ['dc', 'DC', 'haematology', 150, 'Blood', 'Differential leukocyte count.'],
  ['platelets', 'Platelets', 'haematology', 150, 'Blood', 'Platelet count.'],
  ['pcv-hct', 'PCV/HCT', 'haematology', 150, 'Blood', 'Packed cell volume / haematocrit.'],
  ['esr', 'ESR', 'haematology', 100, 'Blood', 'Erythrocyte sedimentation rate.'],
  ['bt', 'BT', 'haematology', 100, 'Blood', 'Bleeding time.'],
  ['ct', 'CT', 'haematology', 100, 'Blood', 'Clotting time.'],
  ['blood-sugar', 'Blood Sugar (F/PP/R)', 'biochemistry', 100, 'Blood', 'Fasting, post-prandial or random blood sugar.'],
  ['rft', 'Renal Function Test (RFT)', 'biochemistry', 850, 'Blood', 'Renal function test panel.'],
  ['lft', 'Liver Function Test (LFT)', 'biochemistry', 900, 'Blood', 'Liver function test panel.'],
  ['lipid-profile', 'Lipid Profile', 'biochemistry', 850, 'Blood', 'Cholesterol and triglyceride profile.'],
  ['serum-uric-acid', 'Serum Uric Acid', 'biochemistry', 250, 'Blood', 'Serum uric acid level.'],
  ['serum-calcium', 'Serum Calcium', 'biochemistry', 400, 'Blood', 'Serum calcium level.'],
  ['blood-group-rh', 'Blood Grouping & Rh typing', 'serology', 100, 'Blood', 'ABO blood grouping and Rh typing.'],
  ['ra-factor', 'RA factor', 'serology', 300, 'Blood', 'Rheumatoid factor screening.'],
  ['crp', 'CRP', 'serology', 300, 'Blood', 'C-reactive protein test.'],
  ['aso', 'ASO', 'serology', 350, 'Blood', 'Anti-streptolysin O test.'],
  ['widal-test', 'Widal Test', 'serology', 300, 'Blood', 'Widal test for enteric fever screening.'],
  ['vdrl', 'VDRL', 'serology', 250, 'Blood', 'VDRL screening test.'],
  ['hiv-rapid', 'HIV I & II Rapid Test', 'serology', 500, 'Blood', 'Rapid HIV I and II screening test.'],
  ['hbsag-rapid', 'HBsAg Rapid Test', 'serology', 500, 'Blood', 'Rapid hepatitis B surface antigen test.'],
  ['hcv-rapid', 'HCV Rapid Test', 'serology', 500, 'Blood', 'Rapid hepatitis C screening test.'],
  ['dengue-serology', 'Dengue IgG/IgM, NS1Ag', 'serology', 1300, 'Blood', 'Dengue antibody and NS1 antigen test.'],
  ['h-pylori-antigen', 'H.Pylori antigen stool', 'serology', 800, 'Stool', 'H. pylori stool antigen test.'],
  ['mp-ag', 'MP Ag', 'serology', 500, 'Blood', 'Malaria parasite antigen test.'],
  ['gram-stain', 'Gram stain', 'microbiology', 250, 'Sample', 'Gram staining preparation.'],
  ['afb-stain', 'AFB Stain', 'microbiology', 500, 'Sputum', 'Acid-fast bacilli staining.'],
  ['koh-preparation', 'KOH Preparation', 'microbiology', 200, 'Skin/Nail', 'KOH preparation for fungal elements.'],
  ['urine-re', 'Urine R/E', 'parasitology', 100, 'Urine', 'Routine urine examination.'],
  ['stool-re', 'Stool R/E', 'parasitology', 110, 'Stool', 'Routine stool examination.'],
  ['occult-blood', 'Occult Blood', 'parasitology', 250, 'Stool', 'Occult blood examination.'],
  ['reducing-sugar', 'Reducing Sugar', 'parasitology', 150, 'Urine', 'Reducing sugar test.'],
  ['semen-analysis', 'Semen Analysis', 'parasitology', 500, 'Semen', 'Semen analysis.'],
  ['urine-pregnancy-test', 'Urine Pregnancy Test', 'parasitology', 150, 'Urine', 'Urine pregnancy test.'],
];

export const CANONICAL_LAB_TESTS: DiagnosticTest[] = TEST_DEFINITIONS.map(
  ([slug, name, categorySlug, price, sampleType, description]) => ({
    id: `price-list-${slug}`,
    slug,
    name,
    category: CANONICAL_LAB_CATEGORIES.find((category) => category.slug === categorySlug)?.label || categorySlug,
    categorySlug,
    description,
    price,
    originalPrice: price,
    turnaround: 'Same day',
    sampleType,
    isPopular: false,
    tags: [],
    includes: [],
  }),
);

export const LAB_PRICE_LIST_BY_SLUG = Object.fromEntries(
  CANONICAL_LAB_TESTS.map((test) => [test.slug, test]),
) as Record<string, DiagnosticTest>;
