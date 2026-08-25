-- Nita Clinic — Services data (lab tests, vaccines, health card tiers, package free consult highlight)
SET search_path TO nita;

-- ──────────────────────────────────────────────────────────────────
-- 1. LAB TEST CATEGORIES (departments)
-- ──────────────────────────────────────────────────────────────────
DELETE FROM lab_test_categories WHERE slug IN
  ('haematology','biochemistry','serology','microbiology','parasitology');

INSERT INTO lab_test_categories (id, name, slug, description, icon, color, is_active, "order", created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Haematology',   'haematology',   'Complete blood count, coagulation and related tests.',     '🩸', '#ef4444', true, 1, NOW(), NOW()),
  (gen_random_uuid(), 'Biochemistry',   'biochemistry',   'Sugar, kidney, liver, lipid and electrolyte panels.',     '🧪', '#f59e0b', true, 2, NOW(), NOW()),
  (gen_random_uuid(), 'Serology',       'serology',       'Antibody, antigen and infectious disease screening.',     '🛡️', '#3b82f6', true, 3, NOW(), NOW()),
  (gen_random_uuid(), 'Microbiology',   'microbiology',    'Smear, stain and culture-based tests.',                   '🔬', '#8b5cf6', true, 4, NOW(), NOW()),
  (gen_random_uuid(), 'Parasitology',   'parasitology',   'Urine, stool and body fluid analysis.',                   '🧫', '#10b981', true, 5, NOW(), NOW());

-- ──────────────────────────────────────────────────────────────────
-- 2. LAB TESTS (36 tests from Price list for website.xlsx)
-- ──────────────────────────────────────────────────────────────────
DELETE FROM lab_tests WHERE slug IN (
  'hb','tc','dc','platelets','pcv-hct','esr','bt','ct',
  'blood-sugar','rft','lft','lipid-profile','serum-uric-acid','serum-calcium',
  'blood-group-rh','ra-factor','crp','aso','widal-test','vdrl','hiv-rapid','hbsag-rapid','hcv-rapid',
  'dengue-serology','h-pylori-antigen','mp-ag',
  'gram-stain','afb-stain','koh-preparation',
  'urine-re','stool-re','occult-blood','reducing-sugar','semen-analysis','urine-pregnancy-test'
);

-- Haematology (8)
INSERT INTO lab_tests (name, slug, category_id, description, long_description, price, original_price, turnaround, sample_type, preparation, is_popular, is_active, "order", created_at, updated_at)
SELECT v.name, v.slug, c.id, v.description, v.long_description, v.price, v.original_price, v.turnaround, v.sample_type, v.preparation, v.is_popular, true, v.ord, NOW(), NOW()
FROM (VALUES
  ('Hb',           'hb',           'haematology', 'Haemoglobin level — checks for anaemia.',                          'Measures the amount of haemoglobin in your blood to detect anaemia or polycythemia.',        150, 200, 'Same day',  'Blood',  'No fasting required', false, 1),
  ('TC',           'tc',           'haematology', 'Total leukocyte count — overall infection screen.',               'Total white blood cell count helps identify infections, inflammation or immune disorders.',     150, 200, 'Same day',  'Blood',  'No fasting required', true,  2),
  ('DC',           'dc',           'haematology', 'Differential leukocyte count — type of WBC.',                     'Breaks down the different types of white blood cells to pinpoint specific conditions.',          150, 200, 'Same day',  'Blood',  'No fasting required', false, 3),
  ('Platelets',    'platelets',    'haematology', 'Platelet count — clotting health.',                                'Counts platelets to assess bleeding or clotting risk.',                                         150, 200, 'Same day',  'Blood',  'No fasting required', false, 4),
  ('PCV / HCT',    'pcv-hct',      'haematology', 'Packed cell volume / haematocrit.',                                'Measures the proportion of red blood cells in your blood.',                                      150, 200, 'Same day',  'Blood',  'No fasting required', false, 5),
  ('ESR',          'esr',          'haematology', 'Erythrocyte sedimentation rate — inflammation marker.',            'Detects inflammation by measuring how fast red blood cells settle.',                              100, 150, 'Same day',  'Blood',  'No fasting required', false, 6),
  ('BT',           'bt',           'haematology', 'Bleeding time — primary haemostasis screen.',                      'Assesses how quickly small blood vessels stop bleeding.',                                          100, 150, 'Same day',  'Blood',  'No fasting required', false, 7),
  ('CT',           'ct',           'haematology', 'Clotting time — coagulation screen.',                             'Measures the time it takes for blood to clot, screening coagulation disorders.',                   100, 150, 'Same day',  'Blood',  'No fasting required', false, 8)
) AS v(name, slug, cat_slug, description, long_description, price, original_price, turnaround, sample_type, preparation, is_popular, ord)
JOIN lab_test_categories c ON c.slug = v.cat_slug;

-- Biochemistry (6)
INSERT INTO lab_tests (name, slug, category_id, description, long_description, price, original_price, turnaround, sample_type, preparation, is_popular, is_active, "order", created_at, updated_at)
SELECT v.name, v.slug, c.id, v.description, v.long_description, v.price, v.original_price, v.turnaround, v.sample_type, v.preparation, v.is_popular, true, v.ord, NOW(), NOW()
FROM (VALUES
  ('Blood Sugar (F / PP / R)',     'blood-sugar',        'biochemistry', 'Fasting, post-prandial or random glucose — diabetes screen.', 'Measures blood glucose in fasting, post-meal or random state to detect or monitor diabetes.', 100, 150, 'Same day',  'Blood',  '8-12 hrs fasting for F sample', true,  1),
  ('Renal Function Test (RFT)',   'rft',                'biochemistry', 'Kidney function panel — urea, creatinine, electrolytes.',      'Evaluates how well your kidneys filter waste, including urea, creatinine and electrolytes.',     850, 1100, 'Same day',  'Blood',  'No fasting required',            true,  2),
  ('Liver Function Test (LFT)',   'lft',                'biochemistry', 'Liver enzyme and protein panel.',                                'Measures liver enzymes, bilirubin and proteins to assess liver health.',                          900, 1200, 'Same day',  'Blood',  '8-12 hrs fasting',                true,  3),
  ('Lipid Profile',               'lipid-profile',      'biochemistry', 'Cholesterol and triglyceride panel — cardiovascular risk.',     'Measures total cholesterol, HDL, LDL and triglycerides for cardiovascular risk.',                  850, 1100, 'Same day',  'Blood',  '12 hrs fasting',                  true,  4),
  ('Serum Uric Acid',             'serum-uric-acid',    'biochemistry', 'Uric acid level — gout / kidney function.',                     'Detects elevated uric acid associated with gout, kidney stones or renal issues.',                  250, 350,  'Same day',  'Blood',  'No fasting required',            false, 5),
  ('Serum Calcium',               'serum-calcium',      'biochemistry', 'Blood calcium level.',                                           'Measures calcium for bone, nerve and muscle function assessment.',                                 400, 500,  'Same day',  'Blood',  'No fasting required',            false, 6)
) AS v(name, slug, cat_slug, description, long_description, price, original_price, turnaround, sample_type, preparation, is_popular, ord)
JOIN lab_test_categories c ON c.slug = v.cat_slug;

-- Serology (13)
INSERT INTO lab_tests (name, slug, category_id, description, long_description, price, original_price, turnaround, sample_type, preparation, is_popular, is_active, "order", created_at, updated_at)
SELECT v.name, v.slug, c.id, v.description, v.long_description, v.price, v.original_price, v.turnaround, v.sample_type, v.preparation, v.is_popular, true, v.ord, NOW(), NOW()
FROM (VALUES
  ('Blood Grouping & Rh Typing',  'blood-group-rh',     'serology', 'ABO + Rh blood group determination.',                       'Identifies your blood group (A/B/AB/O) and Rh factor for transfusion or pregnancy safety.',  100, 150, 'Same day', 'Blood',  'No fasting required', false, 1),
  ('RA Factor',                   'ra-factor',          'serology', 'Rheumatoid arthritis screening.',                          'Detects rheumatoid factor antibodies associated with rheumatoid arthritis.',                  300, 450, 'Same day', 'Blood',  'No fasting required', false, 2),
  ('CRP',                         'crp',                'serology', 'C-reactive protein — acute inflammation.',                'Quantitative CRP to detect and monitor acute inflammation or infection.',                       300, 450, 'Same day', 'Blood',  'No fasting required', false, 3),
  ('ASO',                         'aso',                'serology', 'Anti-streptolysin O — post-strep complications.',         'Detects antibodies from recent streptococcal infection.',                                       350, 500, 'Same day', 'Blood',  'No fasting required', false, 4),
  ('Widal Test',                  'widal-test',         'serology', 'Enteric fever (typhoid / paratyphoid) screen.',             'Agglutination test for typhoid and paratyphoid fever antibodies.',                              300, 450, 'Same day', 'Blood',  'No fasting required', false, 5),
  ('VDRL',                        'vdrl',               'serology', 'Syphilis screening (non-treponemal).',                      'Screening test for syphilis antibodies.',                                                       250, 400, 'Same day', 'Blood',  'No fasting required', false, 6),
  ('HIV I & II Rapid Test',       'hiv-rapid',          'serology', 'HIV 1 and 2 antibody rapid screening.',                     'Rapid screening for HIV-1 and HIV-2 antibodies with same-day confidential results.',             500, 750, 'Same day', 'Blood',  'No fasting required', true,  7),
  ('HBsAg Rapid Test',            'hbsag-rapid',        'serology', 'Hepatitis B surface antigen rapid test.',                  'Rapid screening for hepatitis B surface antigen (current infection).',                          500, 750, 'Same day', 'Blood',  'No fasting required', true,  8),
  ('HCV Rapid Test',              'hcv-rapid',          'serology', 'Hepatitis C antibody rapid test.',                          'Rapid screening for hepatitis C antibodies.',                                                   500, 750, 'Same day', 'Blood',  'No fasting required', true,  9),
  ('Dengue Serology (IgG/IgM, NS1Ag)', 'dengue-serology', 'serology', 'Dengue fever antibody and antigen panel.',                'Detects dengue NS1 antigen and IgG/IgM antibodies for acute or past infection.',              1300, 1700, 'Same day', 'Blood',  'No fasting required', true, 10),
  ('H. Pylori Antigen (Stool)',   'h-pylori-antigen',   'serology', 'Helicobacter pylori antigen in stool.',                     'Detects active H. pylori infection associated with gastritis and ulcers.',                       800, 1100, 'Same day', 'Stool',  'No special preparation', false, 11),
  ('MP Ag (Malaria)',             'mp-ag',              'serology', 'Malaria parasite antigen rapid test.',                      'Rapid antigen detection for malaria parasites.',                                                  500, 750, 'Same day', 'Blood',  'No fasting required', false, 12),
  ('Urine R/E',                   'urine-re',           'serology', 'Urine routine and microscopic examination.',                'Chemical and microscopic urine analysis — kidney, urinary tract and metabolic screen.',          100, 150, 'Same day', 'Urine',  'Mid-stream clean-catch sample',  true,  13)
) AS v(name, slug, cat_slug, description, long_description, price, original_price, turnaround, sample_type, preparation, is_popular, ord)
JOIN lab_test_categories c ON c.slug = v.cat_slug;

-- Microbiology (3)
INSERT INTO lab_tests (name, slug, category_id, description, long_description, price, original_price, turnaround, sample_type, preparation, is_popular, is_active, "order", created_at, updated_at)
SELECT v.name, v.slug, c.id, v.description, v.long_description, v.price, v.original_price, v.turnaround, v.sample_type, v.preparation, v.is_popular, true, v.ord, NOW(), NOW()
FROM (VALUES
  ('Gram Stain',                  'gram-stain',         'microbiology', 'Bacterial Gram stain — preliminary organism ID.',          'Differential staining to classify bacteria as Gram-positive or Gram-negative.',                250, 400, 'Same day', 'Swab/Sample', 'As directed by clinician', false, 1),
  ('AFB Stain',                   'afb-stain',          'microbiology', 'Acid-fast bacilli stain — TB screen.',                     'Ziehl-Neelsen stain for detection of acid-fast bacilli (TB and NTM).',                           500, 700, 'Same day', 'Sputum',     'Early morning sputum preferred', true, 2),
  ('KOH Preparation',             'koh-preparation',    'microbiology', 'Fungal element screen (KOH mount).',                       'Potassium hydroxide mount for fungal hyphae and yeast in skin/hair/nail samples.',               200, 300, 'Same day', 'Skin/Nail',  'No special preparation', false, 3)
) AS v(name, slug, cat_slug, description, long_description, price, original_price, turnaround, sample_type, preparation, is_popular, ord)
JOIN lab_test_categories c ON c.slug = v.cat_slug;

-- Parasitology (additional 5, since Urine R/E is already in Serology)
INSERT INTO lab_tests (name, slug, category_id, description, long_description, price, original_price, turnaround, sample_type, preparation, is_popular, is_active, "order", created_at, updated_at)
SELECT v.name, v.slug, c.id, v.description, v.long_description, v.price, v.original_price, v.turnaround, v.sample_type, v.preparation, v.is_popular, true, v.ord, NOW(), NOW()
FROM (VALUES
  ('Stool R/E',                   'stool-re',            'parasitology', 'Stool routine and microscopic examination.',                'Detects intestinal parasites, ova, cysts and occult blood in stool.',                             110, 150, 'Same day', 'Stool',  'Fresh sample in sterile container', false, 1),
  ('Occult Blood (Stool)',        'occult-blood',        'parasitology', 'Hidden blood in stool — GI bleed screen.',                 'Detects blood not visible to the naked eye, useful for GI bleed screening.',                    250, 350, 'Same day', 'Stool',  'No special preparation',           false, 2),
  ('Reducing Sugar (Urine)',      'reducing-sugar',      'parasitology', 'Sugar in urine — diabetes monitoring.',                    'Detects glucose in urine, used in diabetes monitoring and screening.',                            150, 250, 'Same day', 'Urine',  'No special preparation',           false, 3),
  ('Semen Analysis',              'semen-analysis',      'parasitology', 'Semen analysis — fertility workup.',                       'Evaluates sperm count, motility and morphology for fertility assessment.',                       500, 750, 'Same day', 'Semen',  '3-5 days abstinence; lab collection', true, 4),
  ('Urine Pregnancy Test',        'urine-pregnancy-test','parasitology', 'Rapid hCG urine pregnancy test.',                          'Qualitative hCG detection in urine for early pregnancy confirmation.',                            150, 250, 'Same day', 'Urine',  'First morning void preferred',     true,  5)
) AS v(name, slug, cat_slug, description, long_description, price, original_price, turnaround, sample_type, preparation, is_popular, ord)
JOIN lab_test_categories c ON c.slug = v.cat_slug;

-- ──────────────────────────────────────────────────────────────────
-- 3. VACCINATIONS — only 3 (T.T, Influenza, Pneumococcal)
-- ──────────────────────────────────────────────────────────────────
DELETE FROM vaccines WHERE slug IN (
  'tetanus-toxoid-tt','influenza-vaccine','pneumococcal-vaccine'
);

INSERT INTO vaccines (name, slug, description, price, original_price, age_group, doses, side_effects, is_active, "order", created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Tetanus Toxoid (T.T)', 'tetanus-toxoid-tt',
   'Protects against tetanus — a serious bacterial infection caused by Clostridium tetani entering through wounds. Recommended every 10 years for adults and during pregnancy for maternal and neonatal protection.',
   500, 800, 'All ages (boosters every 10 years; antenatal for pregnant women)', '1–2 doses', 'Mild soreness, redness or swelling at the injection site; rarely low-grade fever.', true, 1, NOW(), NOW()),
  (gen_random_uuid(), 'Influenza Vaccine', 'influenza-vaccine',
   'Annual flu shot that protects against the most common seasonal influenza strains. Recommended for everyone, especially pregnant women, elderly, children and people with chronic illness.',
   1500, 2200, 'All ages (annually, ideally before flu season)', '1 dose annually', 'Mild soreness, low-grade fever, body aches for 1-2 days.', true, 2, NOW(), NOW()),
  (gen_random_uuid(), 'Pneumococcal Vaccine', 'pneumococcal-vaccine',
   'Protects against pneumococcal disease — pneumonia, meningitis and bloodstream infection. Especially important for children under 2, adults over 65 and people with chronic conditions.',
   2500, 3500, 'Children under 2, adults over 65, high-risk patients', '1-2 doses', 'Mild soreness, low-grade fever, fatigue.', true, 3, NOW(), NOW())
;

-- ──────────────────────────────────────────────────────────────────
-- 4. HEALTH CARD CATEGORIES — 4 tiers
-- ──────────────────────────────────────────────────────────────────
DELETE FROM health_card_categories WHERE slug IN (
  'doctors-tier','doctors-family-tier','partner-staff-tier','general-public-tier'
);

INSERT INTO health_card_categories (id, name, slug, type, opd_discount, lab_discount, medicine_discount, queue_benefit, summary, notes, image, price, total_cards, issued_cards, is_active, "order", created_at, updated_at)
VALUES
  -- 1. For Doctors
  (gen_random_uuid(), 'For Doctors (Any Specialty)', 'doctors-tier', 'doctor',
   100, 50, 10, 'Priority queue + free OPD',
   'Exclusive tier for licensed medical doctors from any specialty.',
   'Valid for the cardholder only. Requires Nepal Medical Council registration proof. 100% off OPD consultation, 50% off all lab tests, 10% off pharmacy.',
   NULL, 0, NULL, 0, true, 1, NOW(), NOW()),

  -- 2. For Family Members of Doctors
  (gen_random_uuid(), 'For Doctors'' Family Members', 'doctors-family-tier', 'family',
   50, 35, 10, 'Priority queue',
   'Covers spouse, parents and children of licensed doctors.',
   'Eligible dependents: spouse, parents, and children of a licensed doctor. 50% off OPD, 35% off labs, 10% off pharmacy.',
   NULL, 0, NULL, 0, true, 2, NOW(), NOW()),

  -- 3. For Partner Organisation Staff
  (gen_random_uuid(), 'For Partner Organisation Staff', 'partner-staff-tier', 'partner',
   100, 50, 10, 'Priority queue + free OPD',
   'For staff of Nita Clinics partner organisations — Engineering Nita, Him River Power, SN Energy Ltd.',
   'Available to permanent staff and their immediate family of partner organisations (Engineering Nita, Him River Power, SN Energy Ltd). Same benefits as the Doctors tier.',
   NULL, 0, NULL, 0, true, 3, NOW(), NOW()),

  -- 4. For General Public
  (gen_random_uuid(), 'For General Public', 'general-public-tier', 'public',
   20, 20, 0, 'Standard queue',
   'Open tier for everyone — affordable preventive care for the whole family.',
   'Available to all. 20% off OPD consultations and 20% off all laboratory tests. No pharmacy discount on this tier.',
   NULL, 0, NULL, 0, true, 4, NOW(), NOW());

-- ──────────────────────────────────────────────────────────────────
-- 5. CHECKUP PACKAGES — highlight "Dr. consultation free" + add isFreeConsultation
-- ──────────────────────────────────────────────────────────────────
-- Add the highlight column (NULL-safe; only adds if not present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'nita' AND table_name = 'checkup_packages' AND column_name = 'free_doctor_consultation'
  ) THEN
    ALTER TABLE nita.checkup_packages ADD COLUMN free_doctor_consultation boolean NOT NULL DEFAULT true;
  END IF;
END$$;

-- All packages already include free doctor consultation; flip the column on (default true anyway)
UPDATE nita.checkup_packages SET free_doctor_consultation = true WHERE free_doctor_consultation IS NULL;

-- Quick verify
SELECT 'lab_test_categories' AS what, count(*) FROM nita.lab_test_categories WHERE slug IN ('haematology','biochemistry','serology','microbiology','parasitology')
UNION ALL
SELECT 'lab_tests', count(*) FROM nita.lab_tests WHERE slug IN ('hb','tc','dc','platelets','pcv-hct','esr','bt','ct','blood-sugar','rft','lft','lipid-profile','serum-uric-acid','serum-calcium','blood-group-rh','ra-factor','crp','aso','widal-test','vdrl','hiv-rapid','hbsag-rapid','hcv-rapid','dengue-serology','h-pylori-antigen','mp-ag','gram-stain','afb-stain','koh-preparation','urine-re','stool-re','occult-blood','reducing-sugar','semen-analysis','urine-pregnancy-test')
UNION ALL
SELECT 'vaccines', count(*) FROM nita.vaccines WHERE slug IN ('tetanus-toxoid-tt','influenza-vaccine','pneumococcal-vaccine')
UNION ALL
SELECT 'health_card_categories', count(*) FROM nita.health_card_categories WHERE slug IN ('doctors-tier','doctors-family-tier','partner-staff-tier','general-public-tier')
UNION ALL
SELECT 'checkup_packages_with_free_consult', count(*) FROM nita.checkup_packages WHERE free_doctor_consultation = true;
