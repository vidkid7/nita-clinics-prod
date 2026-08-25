-- Fix-up: Vaccines (3 only) + Health Card (4 tiers) + free-consultation flag
SET search_path TO nita;

-- ──────────────────────────────────────────────────────────────────
-- 3. VACCINATIONS — only 3 (T.T, Influenza, Pneumococcal)
-- ──────────────────────────────────────────────────────────────────
-- Wipe all existing vaccines and re-seed only the 3 we want
DELETE FROM vaccines;

INSERT INTO vaccines (id, name, slug, tagline, description, long_description, who_it_is_for, schedule, doses, protects_against, side_effects, contraindications, notes, availability, price_note, is_active, "order", created_at, updated_at)
VALUES
  (gen_random_uuid(),
   'Tetanus Toxoid (T.T)', 'tetanus-toxoid-tt',
   'Protect against tetanus — every 10 years',
   'Protects against tetanus, a serious bacterial infection caused by Clostridium tetani that enters through wounds.',
   'Tetanus is a life-threatening condition caused by toxins produced by Clostridium tetani bacteria, which enter the body through cuts, punctures or wounds. The T.T vaccine provides reliable protection and is especially important during pregnancy to prevent neonatal tetanus.',
   'All adults (booster every 10 years); mandatory during pregnancy',
   'Single dose; booster every 10 years; antenatal schedule as advised',
   '1–2 doses per course',
   '["Tetanus (lockjaw)","Neonatal tetanus via maternal antibodies"]'::jsonb,
   '["Mild soreness at injection site","Low-grade fever (rare)"]'::jsonb,
   '["Severe allergic reaction to a previous dose"]'::jsonb,
   'Mild redness and swelling at the injection site are common and usually resolve within 24-48 hours.',
   'Available in Clinic',
   'NPR 500 per dose (MRP 800)',
   true, 1, NOW(), NOW()),

  (gen_random_uuid(),
   'Influenza Vaccine', 'influenza-vaccine',
   'Annual flu protection for the whole family',
   'Annual flu shot that protects against the most common seasonal influenza strains.',
   'The influenza vaccine is updated each year to match circulating strains. It is the most effective way to prevent severe flu, complications and hospitalisation, especially in pregnant women, children, the elderly and people with chronic conditions.',
   'Everyone 6 months and older; especially pregnant women, elderly, children, healthcare workers, and people with chronic illness',
   'Annually, ideally before the start of flu season',
   '1 dose annually (children under 9 may need 2 doses in first year)',
   '["Seasonal influenza A (H1N1, H3N2)","Seasonal influenza B"]'::jsonb,
   '["Mild soreness at injection site","Low-grade fever","Body aches for 1–2 days"]'::jsonb,
   '["Severe egg allergy (consult clinician)","Previous severe reaction"]'::jsonb,
   'Best given in early autumn for full season coverage. Mild flu-like symptoms for a day or two are normal.',
   'Available in Clinic',
   'NPR 1,500 per dose (MRP 2,200)',
   true, 2, NOW(), NOW()),

  (gen_random_uuid(),
   'Pneumococcal Vaccine', 'pneumococcal-vaccine',
   'Protection against pneumonia and pneumococcal disease',
   'Protects against pneumococcal disease — pneumonia, meningitis and bloodstream infection.',
   'Pneumococcal disease is caused by Streptococcus pneumoniae and is a leading cause of serious illness in young children, older adults and people with chronic conditions. Vaccination dramatically reduces the risk of pneumonia, meningitis and invasive pneumococcal disease.',
   'Children under 2, adults over 65, and high-risk patients (chronic heart/lung/liver disease, diabetes, immunocompromised, smokers)',
   'As per national immunisation schedule; one-time dose for adults over 65',
   '1–2 doses depending on age and risk',
   '["Pneumonia","Pneumococcal meningitis","Bacteraemia / sepsis"]'::jsonb,
   '["Mild soreness at injection site","Low-grade fever","Fatigue"]'::jsonb,
   '["Severe allergic reaction to a previous dose or vaccine component"]'::jsonb,
   'A single dose provides years of protection for most adults. Children follow a structured PCV schedule.',
   'Available in Clinic',
   'NPR 2,500 per dose (MRP 3,500)',
   true, 3, NOW(), NOW());

-- ──────────────────────────────────────────────────────────────────
-- 4. HEALTH CARD CATEGORIES — 4 tiers
--    enum types: licensed_doctors | family | partner_staff | general_public
--    discount fields are TEXT (e.g. "100% off", "50% off")
-- ──────────────────────────────────────────────────────────────────
DELETE FROM health_card_categories;

INSERT INTO health_card_categories (id, name, type, opd_discount, lab_discount, medicine_discount, queue_benefit, summary, notes, is_active, "order", created_at, updated_at)
VALUES
  (gen_random_uuid(),
   'For Doctors (Any Specialty)', 'licensed_doctors',
   '100% off', '50% off', '10% off',
   'Priority queue + Free OPD',
   'Exclusive tier for licensed medical doctors from any specialty.',
   'Valid for the cardholder only. Requires Nepal Medical Council (NMC) registration proof at enrolment. Benefits: 100% off OPD consultation, 50% off all laboratory tests, 10% off pharmacy.',
   true, 1, NOW(), NOW()),

  (gen_random_uuid(),
   'For Doctors'' Family Members', 'family',
   '50% off', '35% off', '10% off',
   'Priority queue',
   'Covers spouse, parents and children of licensed doctors.',
   'Eligible dependents: spouse, parents and children of a licensed doctor. Benefits: 50% off OPD consultation, 35% off all laboratory tests, 10% off pharmacy.',
   true, 2, NOW(), NOW()),

  (gen_random_uuid(),
   'For Partner Organisation Staff', 'partner_staff',
   '100% off', '50% off', '10% off',
   'Priority queue + Free OPD',
   'For permanent staff and their immediate family of Nita Clinics partner organisations.',
   'Eligible: permanent staff of Engineering Nita, Him River Power, SN Energy Ltd, and other Nita Clinics partner organisations. Same benefits as the Doctors tier (100% OPD, 50% labs, 10% pharmacy). Valid ID from the partner organisation required at enrolment.',
   true, 3, NOW(), NOW()),

  (gen_random_uuid(),
   'For General Public', 'general_public',
   '20% off', '20% off', '0%',
   'Standard queue',
   'Open tier for everyone — affordable preventive care for the whole family.',
   'Available to all. Benefits: 20% off OPD consultation and 20% off all laboratory tests. No pharmacy discount on this tier.',
   true, 4, NOW(), NOW());

-- ──────────────────────────────────────────────────────────────────
-- 5. CHECKUP PACKAGES — add free_doctor_consultation flag
-- ──────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'nita' AND table_name = 'checkup_packages' AND column_name = 'free_doctor_consultation'
  ) THEN
    ALTER TABLE nita.checkup_packages ADD COLUMN free_doctor_consultation boolean NOT NULL DEFAULT true;
  END IF;
END$$;

UPDATE nita.checkup_packages SET free_doctor_consultation = true;

-- Quick verify
SELECT 'vaccines' AS what, count(*) AS rows FROM nita.vaccines
UNION ALL
SELECT 'health_card_categories', count(*) FROM nita.health_card_categories
UNION ALL
SELECT 'checkup_packages_with_free_consult', count(*) FROM nita.checkup_packages WHERE free_doctor_consultation = true;
