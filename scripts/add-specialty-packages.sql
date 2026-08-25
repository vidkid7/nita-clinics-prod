-- Add the 3 specialty checkup packages from frontend fallback (all-fallback.json)
-- Idempotent: skip if name+category already exists
SET search_path TO nita;

INSERT INTO checkup_packages (name, category, target_group, age_label, original_price, discounted_price, currency, description, tests, cta_label, cta_link, image, is_active, "order", free_doctor_consultation)
SELECT * FROM (VALUES
  ('TB Workplace / Screening'::text, 'tuberculosis'::nita.checkup_packages_category_enum, 'Unisex'::text, NULL::text, 2800.00, 1650.00, 'NPR'::text, 'Workplace and pre-employment TB screening - includes chest X-ray, IGRA (or as advised), and a clinical consult.'::text, '["Chest X-ray","IGRA or as advised","Consult"]'::jsonb, 'Book Check-up'::text, NULL::text, NULL::text, true, 5, true),
  ('Pediatric Wellness Check'::text, 'pediatrics'::nita.checkup_packages_category_enum, 'Children'::text, '0-12 years'::text, 3200.00, 1890.00, 'NPR'::text, 'Wellness check for children 0-12 years - CBC, urine routine, and a growth review with the paediatrician.'::text, '["CBC","Urine R/E","Growth review"]'::jsonb, 'Book Check-up'::text, NULL::text, NULL::text, true, 6, true),
  ('Gynecology Well-Woman'::text, 'gynecology'::nita.checkup_packages_category_enum, 'Female'::text, NULL::text, 4500.00, 2650.00, 'NPR'::text, 'Well-woman gynecology check - CBC, PAP guidance, pelvic exam, and ultrasound if clinically indicated.'::text, '["CBC","PAP guidance","Pelvic exam","USG if indicated"]'::jsonb, 'Book Check-up'::text, NULL::text, NULL::text, true, 7, true)
) AS v(name, category, target_group, age_label, original_price, discounted_price, currency, description, tests, cta_label, cta_link, image, is_active, "order", free_doctor_consultation)
WHERE NOT EXISTS (
  SELECT 1 FROM checkup_packages p WHERE p.name = v.name AND p.category = v.category
);
