/**
 * Idempotent catalog seed: lab categories/tests, vaccines, packages, health-card categories, sample team, partners,
 * sample blog posts and testimonials (for Admin → Content).
 * Run: npx ts-node -r tsconfig-paths/register src/database/seed-catalog.ts
 *
 * Images: set CLOUDINARY_CLOUD_NAME and optionally CLOUDINARY_SEED_VERSION folder (default "nita")
 * to use https://res.cloudinary.com/<cloud>/image/upload/v1/<folder>/<slug> — upload matching files in Cloudinary,
 * or leave unset to use high-quality Unsplash placeholders (replace via Admin + Media).
 */
import 'dotenv/config';
import dataSource from '../config/data-source';
import { LabTestCategory } from '../modules/lab-tests/entities/lab-test-category.entity';
import { LabTest } from '../modules/lab-tests/entities/lab-test.entity';
import { Vaccine } from '../modules/vaccinations/entities/vaccine.entity';
import { CheckupPackage, CheckupPackageCategory } from '../modules/packages/entities/checkup-package.entity';
import {
  HealthCardCategory,
  HealthCardCategoryType,
} from '../modules/health-card/entities/health-card-category.entity';
import { Doctor, StaffType } from '../modules/doctors/entities/doctor.entity';
import { Department } from '../modules/departments/entities/department.entity';
import { Partner, PartnerSection } from '../modules/partners/entities/partner.entity';
import { Setting } from '../modules/settings/entities/setting.entity';
import { BlogPost } from '../modules/blog/entities/blog.entity';
import { Testimonial } from '../modules/testimonials/entities/testimonial.entity';
import slugify from 'slugify';

/** Ensures doctors can be seeded even on a fresh database (no prior departments). */
const DEFAULT_DEPARTMENTS: Partial<Department>[] = [
  { name: 'General Medicine', slug: 'general-medicine', description: 'OPD, chronic disease, preventive care', order: 1 },
  { name: 'Pediatrics', slug: 'pediatrics', description: 'Child and adolescent health', order: 2 },
  { name: 'Gynecology & Obstetrics', slug: 'gynecology', description: "Women's health and maternity", order: 3 },
  { name: 'Laboratory & Pathology', slug: 'laboratory', description: 'Diagnostics and specimen testing', order: 4 },
  { name: 'Radiology & Imaging', slug: 'radiology', description: 'Ultrasound, X-ray, and imaging', order: 5 },
];

const cloud = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const folder = process.env.CLOUDINARY_SEED_FOLDER || 'nita';

function img(slug: string, unsplashId: string) {
  if (cloud) {
    return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_900/v1/${folder}/${slug}`;
  }
  return `https://images.unsplash.com/${unsplashId}?w=900&q=80`;
}

const LAB_CATS: Partial<LabTestCategory>[] = [
  { name: 'Haematology', slug: 'haematology', icon: '🩸', color: 'bg-rose-600', order: 1, description: 'Blood counts and coagulation tests.' },
  { name: 'Biochemistry', slug: 'biochemistry', icon: '🧪', color: 'bg-amber-500', order: 2, description: 'Sugar, kidney, liver, lipid and mineral tests.' },
  { name: 'Serology', slug: 'serology', icon: '🛡️', color: 'bg-violet-600', order: 3, description: 'Blood group, antibody, antigen and infection screening.' },
  { name: 'Microbiology', slug: 'microbiology', icon: '🔬', color: 'bg-emerald-600', order: 4, description: 'Stains and microscopy preparation tests.' },
  { name: 'Parasitology', slug: 'parasitology', icon: '🧫', color: 'bg-lime-600', order: 5, description: 'Urine, stool and body-fluid analysis.' },
];

const LAB_TESTS: Array<{
  slug: string;
  name: string;
  catSlug: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription?: string;
  turnaround?: string;
  sampleType?: string;
  isPopular?: boolean;
  tags?: string[];
  includes?: string[];
  imgKey: string;
  unsplash: string;
}> = [
  { slug: 'lipid-profile', name: 'Lipid Profile', catSlug: 'heart-lipid', price: 820, description: 'Full cholesterol panel for heart risk.', turnaround: 'Same Day', sampleType: 'Blood', isPopular: true, tags: ['Heart'], includes: ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides'], imgKey: 'lipid-profile', unsplash: 'photo-1578662996442-8f6e1f3a7548' }, // heart/stethoscope
  { slug: 'diabetes-panel', name: 'Diabetes Screening Panel', catSlug: 'diabetes-metabolic', price: 1800, originalPrice: 2200, description: 'FBS, PPBS, HbA1c and related markers.', turnaround: 'Same Day', sampleType: 'Blood', isPopular: true, tags: ['Diabetes'], includes: ['FBS', 'HbA1c'], imgKey: 'diabetes-panel', unsplash: 'photo-1576091160550-2173dba999ef' }, // blood glucose test
  { slug: 'thyroid-profile', name: 'Thyroid Function Test (TFT)', catSlug: 'diabetes-metabolic', price: 1050, description: 'TSH, T3, T4 as clinically indicated.', turnaround: 'Same Day', sampleType: 'Blood', isPopular: true, tags: ['Thyroid'], includes: ['TSH', 'Free T4'], imgKey: 'thyroid', unsplash: 'photo-1576091160399-112ba8d25d1d' }, // thyroid gland illustration
  { slug: 'cbc', name: 'Complete Blood Count (CBC)', catSlug: 'womens-health', price: 450, description: 'Full blood count with differential.', turnaround: 'Same Day', sampleType: 'Blood', tags: ['Routine'], includes: ['Hb', 'WBC', 'Platelets'], imgKey: 'cbc', unsplash: 'photo-1559757175-0eb30cd8c063' }, // blood cells
  { slug: 'gene-xpert-tb', name: 'GeneXpert MTB/RIF', catSlug: 'tb-pulmonary', price: 3500, description: 'Molecular TB test with rifampicin resistance.', turnaround: '24–48h', sampleType: 'Sputum', tags: ['TB'], includes: ['MTB detection', 'RIF resistance'], imgKey: 'genexpert', unsplash: 'photo-1584036561566-baf8f0f1b144' }, // TB test
  { slug: 'liver-profile', name: 'Liver Function Panel', catSlug: 'liver-kidney', price: 1200, description: 'ALT, AST, bilirubin, ALP and more.', turnaround: 'Same Day', sampleType: 'Blood', tags: ['Liver'], includes: ['ALT', 'AST', 'Bilirubin'], imgKey: 'liver', unsplash: 'photo-1579684385127-1ef15d508118' }, // liver
  { slug: 'renal-profile', name: 'Renal Function Test', catSlug: 'liver-kidney', price: 980, description: 'Creatinine, urea, electrolytes.', turnaround: 'Same Day', sampleType: 'Blood', tags: ['Kidney'], includes: ['Creatinine', 'Urea'], imgKey: 'renal', unsplash: 'photo-1551601651-2a8555f1a136' }, // kidneys
  { slug: 'usg-abdomen', name: 'Ultrasound Abdomen', catSlug: 'imaging', price: 2200, description: 'Abdominal ultrasound study.', turnaround: 'Same Day', sampleType: 'Imaging', tags: ['Ultrasound'], includes: ['Report by radiologist'], imgKey: 'usg', unsplash: 'photo-1516549655169-df83a0774514' }, // ultrasound
  { slug: 'chest-xray', name: 'Chest X-Ray (PA)', catSlug: 'imaging', price: 650, description: 'Posteroanterior chest radiograph.', turnaround: 'Same Day', sampleType: 'Imaging', isPopular: true, tags: ['TB', 'Respiratory'], includes: ['Radiologist report'], imgKey: 'chest-xray', unsplash: 'photo-1582719471384-894fbb16e074' }, // chest x-ray lungs
  { slug: 'urine-routine', name: 'Urine Routine Examination', catSlug: 'liver-kidney', price: 280, description: 'Microscopy and dipstick analysis.', turnaround: 'Same Day', sampleType: 'Urine', tags: ['Routine'], includes: ['Protein', 'Sugar', 'Microscopy'], imgKey: 'urine', unsplash: 'photo-1579684385127-1ef15d508118' }, // urine test
  { slug: 'hbsag', name: 'HBsAg (Hepatitis B surface antigen)', catSlug: 'liver-kidney', price: 550, description: 'Screening for hepatitis B infection.', turnaround: 'Same Day', sampleType: 'Blood', tags: ['Liver', 'Screening'], includes: ['Qualitative result'], imgKey: 'hbsag', unsplash: 'photo-1628771065518-0d82f1938462' }, // hepatitis
  { slug: 'vitamin-d', name: 'Vitamin D (25-OH)', catSlug: 'diabetes-metabolic', price: 3200, description: 'Vitamin D status assessment.', turnaround: '24–48h', sampleType: 'Blood', tags: ['Bone', 'Metabolic'], includes: ['25-hydroxyvitamin D'], imgKey: 'vitd', unsplash: 'photo-1559757175-0eb30cd8c063' }, // vitamin D/sunlight
  { slug: 'hba1c', name: 'HbA1c (Glycated hemoglobin)', catSlug: 'diabetes-metabolic', price: 950, description: '3-month average glucose control.', turnaround: 'Same Day', sampleType: 'Blood', isPopular: true, tags: ['Diabetes'], includes: ['HbA1c %'], imgKey: 'hba1c', unsplash: 'photo-1491553890911-05266313557' }, // long-term diabetes monitoring
  { slug: 'pap-smear', name: 'Pap Smear (Cervical cytology)', catSlug: 'womens-health', price: 1200, description: 'Cervical cancer screening.', turnaround: '3–5 days', sampleType: 'Cervical Swab', tags: ["Women's health"], includes: ['Pathology report'], imgKey: 'pap', unsplash: 'photo-1559757148-5c350d0d3c56' }, // pap smear
  { slug: 'ecg', name: 'Resting ECG (12-lead)', catSlug: 'heart-lipid', price: 500, description: 'Electrocardiogram at rest.', turnaround: 'Same Day', sampleType: 'Non-invasive', tags: ['Heart'], includes: ['Cardiologist review if indicated'], imgKey: 'ecg', unsplash: 'photo-1628348066683-6931b3003fcb' }, // ECG/EKG
];

// Authoritative rates from Price list for website.xlsx. This second, compact
// definition is kept separate from the older seed block so existing database
// history is not lost when this idempotent script is run again.
const WORKBOOK_LAB_TESTS = [
  ['hb', 'Hb', 'haematology', 150, 'Blood'], ['tc', 'TC', 'haematology', 150, 'Blood'], ['dc', 'DC', 'haematology', 150, 'Blood'],
  ['platelets', 'Platelets', 'haematology', 150, 'Blood'], ['pcv-hct', 'PCV/HCT', 'haematology', 150, 'Blood'], ['esr', 'ESR', 'haematology', 100, 'Blood'],
  ['bt', 'BT', 'haematology', 100, 'Blood'], ['ct', 'CT', 'haematology', 100, 'Blood'],
  ['blood-sugar', 'Blood Sugar (F/PP/R)', 'biochemistry', 100, 'Blood'], ['rft', 'Renal Function Test (RFT)', 'biochemistry', 850, 'Blood'],
  ['lft', 'Liver Function Test (LFT)', 'biochemistry', 900, 'Blood'], ['lipid-profile', 'Lipid Profile', 'biochemistry', 850, 'Blood'],
  ['serum-uric-acid', 'Serum Uric Acid', 'biochemistry', 250, 'Blood'], ['serum-calcium', 'Serum Calcium', 'biochemistry', 400, 'Blood'],
  ['blood-group-rh', 'Blood Grouping & Rh typing', 'serology', 100, 'Blood'], ['ra-factor', 'RA factor', 'serology', 300, 'Blood'],
  ['crp', 'CRP', 'serology', 300, 'Blood'], ['aso', 'ASO', 'serology', 350, 'Blood'], ['widal-test', 'Widal Test', 'serology', 300, 'Blood'],
  ['vdrl', 'VDRL', 'serology', 250, 'Blood'], ['hiv-rapid', 'HIV I & II Rapid Test', 'serology', 500, 'Blood'],
  ['hbsag-rapid', 'HBsAg Rapid Test', 'serology', 500, 'Blood'], ['hcv-rapid', 'HCV Rapid Test', 'serology', 500, 'Blood'],
  ['dengue-serology', 'Dengue IgG/IgM, NS1Ag', 'serology', 1300, 'Blood'], ['h-pylori-antigen', 'H.Pylori antigen stool', 'serology', 800, 'Stool'],
  ['mp-ag', 'MP Ag', 'serology', 500, 'Blood'], ['gram-stain', 'Gram stain', 'microbiology', 250, 'Sample'],
  ['afb-stain', 'AFB Stain', 'microbiology', 500, 'Sputum'], ['koh-preparation', 'KOH Preparation', 'microbiology', 200, 'Skin/Nail'],
  ['urine-re', 'Urine R/E', 'parasitology', 100, 'Urine'], ['stool-re', 'Stool R/E', 'parasitology', 110, 'Stool'],
  ['occult-blood', 'Occult Blood', 'parasitology', 250, 'Stool'], ['reducing-sugar', 'Reducing Sugar', 'parasitology', 150, 'Urine'],
  ['semen-analysis', 'Semen Analysis', 'parasitology', 500, 'Semen'], ['urine-pregnancy-test', 'Urine Pregnancy Test', 'parasitology', 150, 'Urine'],
] as const;

const VACCINES_SEED: Partial<Vaccine>[] = [
  { slug: 'tetanus-toxoid-tt', name: 'Tetanus Toxoid (T.T)', shortName: 'T-T', category: ['Adults', 'Women'], tagline: 'Tetanus protection & wound prevention', description: 'Tetanus toxoid vaccine for adults and during pregnancy.', longDescription: 'Tetanus toxoid (T-T) protects against tetanus, a serious bacterial infection caused by Clostridium tetani that enters the body through wounds. The vaccine is given as a booster every 10 years for adults and is routinely recommended during each pregnancy (ideally between 27–36 weeks) to protect the newborn through maternal antibody transfer.', image: img('tetanus-toxoid-tt', 'photo-1559757175-0eb30cd8c063'), whoItIsFor: 'Adults; pregnant women (27–36 wks)', schedule: 'Every 10 years; each pregnancy', doses: '1 dose', protectsAgainst: ['Tetanus (lockjaw)'], sideEffects: ['Arm soreness', 'Mild fever', 'Fatigue'], contraindications: ['Severe allergy to a previous dose'], availability: 'Available in Clinic', priceNote: 'Contact clinic', order: 1 },
  { slug: 'influenza-vaccine', name: 'Influenza Vaccine', shortName: 'Influenza', category: ['Adults', 'Children', 'Seniors'], tagline: 'Annual seasonal flu protection', description: 'Yearly flu shot covering current circulating strains.', longDescription: 'The seasonal influenza vaccine is updated each year to protect against the influenza virus strains expected to circulate. Annual vaccination is recommended for everyone 6 months and older, and is especially important for older adults, young children, pregnant women, and people with chronic conditions such as asthma, diabetes, or heart disease. Get vaccinated before the flu season peaks to reduce the risk of severe illness and complications.', image: img('influenza-vaccine', 'photo-1576091160550-2173dba999ef'), whoItIsFor: '6 months and older', schedule: 'Once yearly', doses: '1 dose (2 for some children)', protectsAgainst: ['Seasonal influenza A/B strains'], sideEffects: ['Arm soreness', 'Mild fever', 'Body aches'], contraindications: ['Severe allergy to vaccine components'], availability: 'Seasonal', priceNote: 'Contact clinic', order: 2 },
  { slug: 'pneumococcal-vaccine', name: 'Pneumococcal Vaccine', shortName: 'Pneumococcal', category: ['Adults', 'Seniors', 'Children'], tagline: 'Pneumonia & invasive disease prevention', description: 'Conjugate or polysaccharide vaccine per age and risk.', longDescription: 'The pneumococcal vaccine protects against Streptococcus pneumoniae, a leading cause of pneumonia, meningitis, and bloodstream infections. It is recommended for infants, adults over 65, and individuals with chronic illnesses or weakened immune systems. The conjugate (PCV) and polysaccharide (PPSV) formulations are used per age and clinical indication.', image: img('pneumococcal-vaccine', 'photo-1551601651-2a8555f1a136'), whoItIsFor: 'Infants, elderly (65+), high-risk adults', schedule: 'Per age and risk-based schedule', doses: '1–4 doses', protectsAgainst: ['Streptococcus pneumoniae (covered serotypes)'], sideEffects: ['Injection site soreness', 'Mild fever'], contraindications: ['Severe allergy to a previous dose or component'], availability: 'Available in Clinic', priceNote: 'Contact clinic', order: 3 },
];

/** Vaccines that are no longer offered — kept here so we can mark them inactive on re-seed. */
const RETIRED_VACCINE_SLUGS = [
  'flu-quadrivalent',
  'hepatitis-b',
  'tdap',
  'hepatitis-a',
  'cholera',
  'hpv',
  'mmr',
  'typhoid',
  'varicella',
  // Defensive: slugs from earlier short-name variants should the data ever be reseeded
  'tetanus-toxoid',
  'influenza',
  'pneumococcal',
];

const PACKAGES_SEED: Partial<CheckupPackage>[] = [
  { name: 'General Health Package Female (Over 40)', category: CheckupPackageCategory.FEMALE_GENERAL, originalPrice: 6300, discountedPrice: 3010, tests: ['CBC', 'Lipid Profile', 'Glucose F', 'TSH', 'Uric Acid', 'CA 125', 'RFT', 'Urine R/E', 'LFT', 'Calcium'], order: 1, image: img('pkg-female-gen', 'photo-1559757175-0eb30cd8c063') },
  { name: 'Premium Health Package Female (Over 40)', category: CheckupPackageCategory.FEMALE_PREMIUM, originalPrice: 7300, discountedPrice: 3700, tests: ['CBC', 'RFT', 'Glucose F', 'LFT', 'Lipid Profile', 'TFT', 'CA125', 'Calcium', 'Urine R/E'], order: 2, image: img('pkg-female-prem', 'photo-1576091160399-112ba8d25d1d') },
  { name: 'General Health Package Male (Over 40)', category: CheckupPackageCategory.MALE_GENERAL, originalPrice: 5800, discountedPrice: 4410, tests: ['CBC', 'TSH', 'Glucose F', 'PSA', 'RFT', 'Lipid Profile'], order: 3, image: img('pkg-male-gen', 'photo-1622253692010-333f2da603ea') },
  { name: 'Premium Health Package Male (Over 40)', category: CheckupPackageCategory.MALE_PREMIUM, originalPrice: 6800, discountedPrice: 5110, tests: ['CBC', 'RFT', 'Glucose F', 'LFT', 'Lipid Profile', 'PSA', 'TFT'], order: 4, image: img('pkg-male-prem', 'photo-1571019614242-c5c5dee9f50b') },
  { name: 'Pediatric Wellness Check', category: CheckupPackageCategory.PEDIATRICS, originalPrice: 3200, discountedPrice: 1890, targetGroup: 'Children', ageLabel: '0–12 years', tests: ['CBC', 'Urine R/E', 'Growth review'], order: 5, image: img('pkg-peds', 'photo-1503454537195-1dcabb73ffb9') },
  { name: 'Gynecology Well-Woman', category: CheckupPackageCategory.GYNECOLOGY, originalPrice: 4500, discountedPrice: 2650, tests: ['CBC', 'PAP guidance', 'Pelvic exam', 'USG if indicated'], order: 6, image: img('pkg-gyn', 'photo-1559757148-5c350d0d3c56') },
  { name: 'TB Workplace / Screening', category: CheckupPackageCategory.TUBERCULOSIS, originalPrice: 2800, discountedPrice: 1650, tests: ['Chest X-ray', 'IGRA or as advised', 'Consult'], order: 7, image: img('pkg-tb', 'photo-1584036561566-baf8f0f1b144') },
];

const HEALTH_CARD_SEED: Array<{
  type: HealthCardCategoryType;
  name: string;
  opdDiscount: string;
  labDiscount: string;
  medicineDiscount: string;
  queueBenefit: string;
  summary: string;
  notes: string;
  price?: number;
  order: number;
  imgKey: string;
  unsplash: string;
}> = [
  { type: HealthCardCategoryType.LICENSED_DOCTORS, name: "Doctors' Card", opdDiscount: '100% Free OPD', labDiscount: '50% Off lab tests', medicineDiscount: '10% Off pharmacy', queueBenefit: 'Priority queue', summary: 'Licensed medical practitioners', notes: 'NMC registration required.', order: 1, imgKey: 'hc-doctors', unsplash: 'photo-1576091160399-112ba8d25d1d' },
  { type: HealthCardCategoryType.FAMILY, name: "Doctor's Family", opdDiscount: '50% Off OPD', labDiscount: '35% Off lab', medicineDiscount: '10% Off pharmacy', queueBenefit: 'Priority access', summary: 'Spouse, parents, children', notes: 'Eligibility verified on application.', order: 2, imgKey: 'hc-family', unsplash: 'photo-1511895426328-dc8714191300' },
  { type: HealthCardCategoryType.PARTNER_STAFF, name: 'Partner Staff', opdDiscount: '50% off', labDiscount: '50% Off lab tests', medicineDiscount: '10% Off pharmacy', queueBenefit: 'Priority queue', summary: 'Staff of Nita Group partner organisations', notes: 'Employer verification required. Valid ID from the partner organisation needed at enrolment.', order: 3, imgKey: 'hc-partner', unsplash: 'photo-1521737711867-e3b97375f902' },
  { type: HealthCardCategoryType.GENERAL_PUBLIC, name: 'General Public', opdDiscount: 'Queue benefits', labDiscount: '10–20% selected tests', medicineDiscount: '5–10% pharmacy', queueBenefit: 'Queue skip + rates', summary: 'Open to everyone', notes: 'Apply online or at reception.', order: 4, imgKey: 'hc-public', unsplash: 'photo-1571019613454-1cb2f99b2d8b' },
];

/** Matches homepage `PartnersSection` fallback — section `homepage` drives the public carousel. */
const PARTNERS_SEED: Partial<Partner>[] = [
  {
    name: 'Engineering Nita Pvt. Ltd.',
    url: 'https://engineeringnita.com',
    logoUrl: 'https://engineeringnita.com/css/images/mainlogo.png',
    alt: 'Engineering Nita',
    section: PartnerSection.HOMEPAGE,
    order: 1,
    isActive: true,
  },
  {
    name: 'Him River Power Limited',
    url: 'https://himriverpower.com',
    logoUrl: 'https://himriverpower.com/wp-content/themes/him-river/assets/images/logo.png',
    alt: 'Him River Power',
    section: PartnerSection.HOMEPAGE,
    order: 2,
    isActive: true,
  },
  {
    name: 'SN Energy Limited',
    url: 'https://www.snenergyltd.com',
    logoUrl: 'https://www.snenergyltd.com/img/logo.png',
    alt: 'SN Energy',
    section: PartnerSection.HOMEPAGE,
    order: 3,
    isActive: true,
  },
];

const BLOG_CONTENT_SEED: Array<{
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
}> = [
  {
    title: 'Stay Safe This Monsoon Season: Health Tips from Our Doctors',
    excerpt:
      'Monsoon brings waterborne and respiratory illnesses. Here are simple steps to protect your family throughout the season.',
    content: `<h2>Why monsoon matters</h2>
<p>During the rainy months in Nepal, waterborne diseases and respiratory infections rise. These simple, doctor-approved habits help you stay healthy.</p>
<h2>Safe water and food</h2>
<p>Drink boiled or purified water, wash fruits and vegetables well, and prefer freshly cooked meals. Avoid street drinks and raw salads from unknown vendors when hygiene is uncertain.</p>
<h2>Vector-borne illness</h2>
<p>Empty containers that collect rainwater, use mosquito nets, and seek care early for fever with body aches or rash.</p>
<p>Visit Nita Clinic for vaccines, lab tests, or if symptoms persist — our team is here to help.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&q=85',
    author: 'Dr. Nita Clinic Team',
    category: 'Preventive Health',
    tags: ['monsoon', 'prevention', 'Nepal'],
    isPublished: true,
  },
  {
    title: 'Daily Habits for Better Heart and Metabolic Health',
    excerpt:
      'Small changes to movement, diet, and sleep can reduce blood pressure and diabetes risk over time.',
    content: `<h2>Move consistently</h2>
<p>Aim for brisk walking or equivalent activity most days — even 20–30 minutes helps cardiovascular and metabolic health.</p>
<h2>Balanced plates</h2>
<p>Include vegetables, adequate protein, and whole grains; limit sugary drinks and ultra-processed snacks.</p>
<h2>Sleep and stress</h2>
<p>Regular sleep patterns and simple stress-reduction techniques support blood pressure and glucose control.</p>
<p>Book a check-up or lab package at Nita Clinic to monitor lipids, glucose, and blood pressure with your clinician.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=85',
    author: 'Dr. Nita Clinic Team',
    category: 'Heart Health',
    tags: ['heart health', 'diabetes', 'check-up'],
    isPublished: true,
  },
];

const TESTIMONIALS_SEED: Array<{
  name: string;
  role: string;
  content: string;
  rating: number;
  order: number;
}> = [
  {
    name: 'Sujan K.',
    role: 'Patient · Family Medicine',
    content:
      'The consultation was smooth and well-organised. Lab reports were delivered quickly and the doctors explained everything clearly. I highly recommend this clinic for any routine or specialist consultation.',
    rating: 5,
    order: 1,
  },
  {
    name: 'Mina R.',
    role: 'Health Package Client',
    content:
      'I booked a complete health check-up package and finished all tests in one visit. The staff were polite, the facility was clean, and the pricing was very transparent. Excellent service.',
    rating: 5,
    order: 2,
  },
  {
    name: 'Ritesh P.',
    role: 'Parent · Pediatrics',
    content:
      "Our child's vaccination follow-up was handled efficiently. The pediatric team was reassuring and very helpful. We feel confident in the care quality here.",
    rating: 5,
    order: 3,
  },
];

async function main() {
  await dataSource.initialize();
  const qc = dataSource.getRepository(LabTestCategory);
  const qt = dataSource.getRepository(LabTest);
  const vv = dataSource.getRepository(Vaccine);
  const pk = dataSource.getRepository(CheckupPackage);
  const hc = dataSource.getRepository(HealthCardCategory);
  const doc = dataSource.getRepository(Doctor);
  const dep = dataSource.getRepository(Department);
  const partnerRepo = dataSource.getRepository(Partner);

  const deptBySlug = new Map<string, Department>();
  for (const d of DEFAULT_DEPARTMENTS) {
    let row = await dep.findOne({ where: { slug: d.slug } });
    if (!row) {
      row = dep.create({ ...d, isActive: true } as Department);
      await dep.save(row);
    } else {
      Object.assign(row, { ...d, isActive: true });
      await dep.save(row);
    }
    deptBySlug.set(row.slug, row);
  }

  const catBySlug = new Map<string, LabTestCategory>();

  for (const c of LAB_CATS) {
    let row = await qc.findOne({ where: { slug: c.slug } });
    if (!row) {
      row = qc.create({ ...c, isActive: true });
      await qc.save(row);
    } else {
      Object.assign(row, c);
      await qc.save(row);
    }
    catBySlug.set(c.slug!, row);
  }

  for (const t of LAB_TESTS) {
    const cat = catBySlug.get(t.catSlug);
    if (!cat) continue;
    let row = await qt.findOne({ where: { slug: t.slug } });
    const payload = {
      name: t.name,
      slug: t.slug,
      categoryId: cat.id,
      description: t.description,
      longDescription: t.longDescription,
      price: t.price,
      originalPrice: t.originalPrice ?? t.price,
      image: img(t.imgKey, t.unsplash),
      turnaround: t.turnaround,
      sampleType: t.sampleType,
      isPopular: t.isPopular ?? false,
      tags: t.tags ?? [],
      includes: t.includes ?? [],
      isActive: true,
      order: 0,
    };
    if (!row) {
      row = qt.create(payload);
      await qt.save(row);
    } else {
      Object.assign(row, payload);
      await qt.save(row);
    }
  }

  for (const [slug, name, catSlug, price, sampleType] of WORKBOOK_LAB_TESTS) {
    const cat = catBySlug.get(catSlug);
    if (!cat) continue;
    let row = await qt.findOne({ where: { slug } });
    const payload = {
      name,
      slug,
      categoryId: cat.id,
      description: `${name} laboratory test.`,
      longDescription: undefined,
      price,
      originalPrice: price,
      image: img(`lab-${slug}`, 'photo-1576091160550-2173dba999ef'),
      turnaround: 'Same day',
      sampleType,
      isPopular: false,
      tags: [],
      includes: [],
      isActive: true,
      order: 0,
    };
    if (!row) {
      row = qt.create(payload);
    } else {
      Object.assign(row, payload);
    }
    await qt.save(row);
  }

  await qt
    .createQueryBuilder()
    .update()
    .set({ isActive: false })
    .where('slug NOT IN (:...slugs)', { slugs: WORKBOOK_LAB_TESTS.map(([slug]) => slug) })
    .andWhere('isActive = :active', { active: true })
    .execute();

  await qc
    .createQueryBuilder()
    .update()
    .set({ isActive: false })
    .where('slug NOT IN (:...slugs)', { slugs: LAB_CATS.map((category) => category.slug) })
    .andWhere('isActive = :active', { active: true })
    .execute();

  for (const v of VACCINES_SEED) {
    let row = await vv.findOne({ where: { slug: v.slug } });
    if (!row) {
      // Brand-new vaccine: insert with full seed content.
      row = vv.create({ ...v, isActive: true } as Vaccine);
      await vv.save(row);
    } else {
      // Existing vaccine: ONLY ensure it's active. Don't overwrite the
      // production copy (descriptions, pricing, images) — admins may have
      // edited it via the dashboard.
      if (!row.isActive) {
        row.isActive = true;
        await vv.save(row);
      }
    }
  }

  // Deactivate any retired vaccine so it no longer appears in the public catalog.
  // We keep the row in the DB (history, references) but flip isActive off.
  if (RETIRED_VACCINE_SLUGS.length > 0) {
    await vv
      .createQueryBuilder()
      .update()
      .set({ isActive: false })
      .where('slug IN (:...slugs)', { slugs: RETIRED_VACCINE_SLUGS })
      .andWhere('isActive = :active', { active: true })
      .execute();
  }

  for (const p of PACKAGES_SEED) {
    const existing = await pk.findOne({ where: { name: p.name! } });
    if (!existing) {
      await pk.save(pk.create({ ...p, currency: 'NPR', isActive: true } as CheckupPackage));
    } else {
      Object.assign(existing, p);
      await pk.save(existing);
    }
  }

  for (const h of HEALTH_CARD_SEED) {
    let row = await hc.findOne({ where: { type: h.type } });
    const payload = {
      name: h.name,
      type: h.type,
      opdDiscount: h.opdDiscount,
      labDiscount: h.labDiscount,
      medicineDiscount: h.medicineDiscount,
      queueBenefit: h.queueBenefit,
      summary: h.summary,
      notes: h.notes,
      price: h.price,
      order: h.order,
      image: img(h.imgKey, h.unsplash),
      isActive: true,
    };
    if (!row) {
      row = hc.create(payload);
      await hc.save(row);
    } else {
      Object.assign(row, payload);
      await hc.save(row);
    }
  }

  type TeamRow = {
    name: string;
    email: string;
    phone: string;
    qualification: string;
    specialization: string;
    staffType: StaffType;
    experience: number;
    photo: string | null;
    bio: string;
    deptSlug: string;
    consultationFee: number;
  };

  const teamSeed: TeamRow[] = [
    {
      name: 'Dr. Anil Sharma',
      email: 'dr.anil.sharma@nitaclinics.seed',
      phone: '+9779801000001',
      qualification: 'MD (Internal Medicine)',
      specialization: 'General Medicine & Diabetes',
      staffType: StaffType.DOCTOR,
      experience: 18,
      photo: null,
      bio: 'Seed profile — replace with your lead physician details in Admin.',
      deptSlug: 'general-medicine',
      consultationFee: 1500,
    },
    {
      name: 'Dr. Priya Karki',
      email: 'dr.priya.karki@nitaclinics.seed',
      phone: '+9779801000002',
      qualification: 'MD (Pediatrics)',
      specialization: 'Child Health & Immunization',
      staffType: StaffType.DOCTOR,
      experience: 12,
      photo: null,
      bio: 'Seed profile — edit photo, bio, and fee in Admin.',
      deptSlug: 'pediatrics',
      consultationFee: 1200,
    },
    {
      name: 'Dr. Sunita Thapa',
      email: 'dr.sunita.thapa@nitaclinics.seed',
      phone: '+9779801000003',
      qualification: 'MD (OBGYN)',
      specialization: "Obstetrics & Gynecology",
      staffType: StaffType.DOCTOR,
      experience: 14,
      photo: null,
      bio: 'Seed profile — update in Admin under Doctors.',
      deptSlug: 'gynecology',
      consultationFee: 1500,
    },
    {
      name: 'Ramesh Gurung',
      email: 'ramesh.gurung@nitaclinics.seed',
      phone: '+9779801000004',
      qualification: 'BSc MLT',
      specialization: 'Laboratory Services',
      staffType: StaffType.TECHNICIAN,
      experience: 9,
      photo: null,
      bio: 'Seed lab team member — edit in Admin.',
      deptSlug: 'laboratory',
      consultationFee: 0,
    },
    {
      name: 'Sita Tamang',
      email: 'sita.tamang@nitaclinics.seed',
      phone: '+9779801000005',
      qualification: 'BN',
      specialization: 'OPD Nursing',
      staffType: StaffType.NURSE,
      experience: 7,
      photo: null,
      bio: 'Seed nursing staff — edit in Admin.',
      deptSlug: 'general-medicine',
      consultationFee: 0,
    },
    {
      name: 'Kiran Basnet',
      email: 'kiran.basnet@nitaclinics.seed',
      phone: '+9779801000006',
      qualification: 'BBA',
      specialization: 'Front Desk & Billing',
      staffType: StaffType.ADMIN_STAFF,
      experience: 5,
      photo: null,
      bio: 'Seed admin staff — edit in Admin.',
      deptSlug: 'general-medicine',
      consultationFee: 0,
    },
  ];

  for (const t of teamSeed) {
    const department = deptBySlug.get(t.deptSlug);
    if (!department) continue;
    let row = await doc.findOne({ where: { email: t.email } });
    const payload = {
      name: t.name,
      email: t.email,
      phone: t.phone,
      qualification: t.qualification,
      specialization: t.specialization,
      staffType: t.staffType,
      experience: t.experience,
      photo: t.photo,
      bio: t.bio,
      consultationFee: t.consultationFee,
      departmentId: department.id,
      isActive: true,
    };
    if (!row) {
      row = doc.create(payload as Doctor);
      await doc.save(row);
    } else {
      Object.assign(row, payload);
      await doc.save(row);
    }
  }

  for (const p of PARTNERS_SEED) {
    let row = await partnerRepo.findOne({ where: { url: p.url } });
    if (!row) {
      row = partnerRepo.create({ ...p } as Partner);
      await partnerRepo.save(row);
    } else {
      Object.assign(row, p);
      await partnerRepo.save(row);
    }
  }

  const settingRepo = dataSource.getRepository(Setting);
  const homeServicesKey = 'home_services';
  let homeSetting = await settingRepo.findOne({ where: { key: homeServicesKey } });
  const homeServicesJson = JSON.stringify({
    badge: 'Our Services',
    heading: 'Comprehensive Clinical Services',
    subheading:
      'From diagnostics to specialist consultations, we offer a full range of modern healthcare services for individuals and families.',
    items: [
      {
        iconKey: 'microscope',
        colorKey: 'primary',
        title: 'NITA Path Labs',
        desc:
          'Leading pathology & diagnostic center offering advanced testing for early disease detection, treatment monitoring, and preventive healthcare.',
        href: '/diagnostic-test',
        tag: 'Diagnostics',
      },
      {
        iconKey: 'female',
        colorKey: 'rose',
        title: "Women's Health Clinic",
        desc:
          'Comprehensive gynecological care for all ages — from routine check-ups to specialist treatment and prenatal support.',
        href: '/specialists/gynecology-obstetrics',
        tag: 'Specialists',
      },
      {
        iconKey: 'heartbeat',
        colorKey: 'emerald',
        title: 'Family Medicine & Wellness',
        desc:
          'Accurate diagnosis and prevention-focused primary care for your whole family, including chronic disease management.',
        href: '/checkup',
        tag: 'Check-up',
      },
      {
        iconKey: 'creditCard',
        colorKey: 'sky',
        title: 'NITA Health Card',
        desc:
          'Membership benefits for doctors, staff, and partner organizations — including OPD privileges, lab discounts, priority access, and savings on health packages.',
        href: '/health-card',
        tag: 'Health Card',
      },
      {
        iconKey: 'xray',
        colorKey: 'primary',
        title: 'Imaging & Ultrasound',
        desc:
          'Digital X-ray, 3D/4D ultrasound, color Doppler, ECG, Echo, and PFT under one roof with fast report delivery.',
        href: '/diagnostic-test',
        tag: 'Imaging',
      },
      {
        iconKey: 'syringe',
        colorKey: 'amber',
        title: 'Vaccination Clinic',
        desc:
          "Adult and pediatric vaccine schedules, immunization records, and traveler's health immunization in a safe environment.",
        href: '/vaccination',
        tag: 'Vaccination',
      },
    ],
  });
  if (!homeSetting) {
    homeSetting = settingRepo.create({
      key: homeServicesKey,
      value: homeServicesJson,
      category: 'homepage',
      description: 'Home page Our Services section (JSON)',
    });
    await settingRepo.save(homeSetting);
  }

  const blogRepo = dataSource.getRepository(BlogPost);
  const testimonialRepo = dataSource.getRepository(Testimonial);

  for (const b of BLOG_CONTENT_SEED) {
    const slug = slugify(b.title, { lower: true, strict: true });
    let row = await blogRepo.findOne({ where: { slug } });
    const plain = b.content.replace(/<[^>]+>/g, ' ');
    const wordCount = plain.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    const publishedAt = b.isPublished ? row?.publishedAt ?? new Date() : undefined;
    const payload = {
      title: b.title,
      slug,
      excerpt: b.excerpt,
      content: b.content,
      featuredImage: b.featuredImage,
      author: b.author,
      category: b.category,
      tags: b.tags,
      isPublished: b.isPublished,
      readingTime,
      views: row?.views ?? 0,
      publishedAt,
    };
    if (!row) {
      row = blogRepo.create(payload as BlogPost);
      await blogRepo.save(row);
    } else {
      Object.assign(row, payload);
      await blogRepo.save(row);
    }
  }

  for (const t of TESTIMONIALS_SEED) {
    let row = await testimonialRepo.findOne({ where: { name: t.name } });
    const payload = {
      name: t.name,
      role: t.role,
      content: t.content,
      rating: t.rating,
      order: t.order,
      isActive: true,
    };
    if (!row) {
      row = testimonialRepo.create(payload as Testimonial);
      await testimonialRepo.save(row);
    } else {
      Object.assign(row, payload);
      await testimonialRepo.save(row);
    }
  }

  await dataSource.destroy();
  // eslint-disable-next-line no-console
  console.log('Catalog seed completed.');
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
