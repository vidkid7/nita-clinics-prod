-- Seed doctors and missing departments
-- Idempotent: skips duplicates via email check

BEGIN;

-- 1) Create missing departments
INSERT INTO nita.departments (name, slug, description, is_active, "order")
VALUES
  ('Pulmonology & TB', 'pulmonology-tb',
   'Specialized care for respiratory conditions, tuberculosis screening, DOTS therapy, and chest medicine.', true, 5),
  ('Orthopedics', 'orthopedics',
   'Comprehensive musculoskeletal care covering bones, joints, muscles, spine, and trauma care.', true, 6)
ON CONFLICT (slug) DO NOTHING;

-- 2) Insert doctors (one by one using subqueries)
DO $$
DECLARE
  gyn_id    uuid;
  pedia_id  uuid;
  pulmo_id  uuid;
  ortho_id  uuid;
BEGIN
  SELECT id INTO gyn_id    FROM nita.departments WHERE slug = 'gynecology-and-obstetrics' LIMIT 1;
  SELECT id INTO pedia_id  FROM nita.departments WHERE slug = 'pediatrics'                LIMIT 1;
  SELECT id INTO pulmo_id  FROM nita.departments WHERE slug = 'pulmonology-tb'           LIMIT 1;
  SELECT id INTO ortho_id  FROM nita.departments WHERE slug = 'orthopedics'              LIMIT 1;

  -- Gynecology
  IF NOT EXISTS (SELECT 1 FROM nita.doctors WHERE email = 'josie.baral@nitaclinics.com') THEN
    INSERT INTO nita.doctors (user_id, name, email, phone, qualification, specialization,
      staff_type, department_id, experience, consultation_fee, bio, is_active)
    VALUES (NULL, 'Dr. Josie R. Baral', 'josie.baral@nitaclinics.com', '+977 01-4533361',
      'MD, MS Gynecology', 'Gynecology & Obstetrics', 'doctor', gyn_id, 14, 800.00,
      'Senior consultant in gynecology & obstetrics with 14+ years of experience in women''s health, prenatal monitoring, and reproductive care.', true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM nita.doctors WHERE email = 'sajana.shrestha@nitaclinics.com') THEN
    INSERT INTO nita.doctors (user_id, name, email, phone, qualification, specialization,
      staff_type, department_id, experience, consultation_fee, bio, is_active)
    VALUES (NULL, 'Dr. Sajana Shrestha', 'sajana.shrestha@nitaclinics.com', '+977 01-4533361',
      'MD Obstetrics & Gynecology', 'Gynecology & Obstetrics', 'doctor', gyn_id, 9, 700.00,
      'Obstetrician & gynecologist with strong focus on antenatal care, PCOS management, and minimally invasive procedures.', true);
  END IF;

  -- Pediatrics
  IF NOT EXISTS (SELECT 1 FROM nita.doctors WHERE email = 'mukti.ghimire@nitaclinics.com') THEN
    INSERT INTO nita.doctors (user_id, name, email, phone, qualification, specialization,
      staff_type, department_id, experience, consultation_fee, bio, is_active)
    VALUES (NULL, 'Dr. Mukti Ghimire', 'mukti.ghimire@nitaclinics.com', '+977 01-4533361',
      'MD Pediatrics, FCPS', 'Pediatrics', 'doctor', pedia_id, 11, 700.00,
      'Pediatrician specializing in newborn care, growth monitoring, vaccination planning, and developmental assessments.', true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM nita.doctors WHERE email = 'koshraj.rc@nitaclinics.com') THEN
    INSERT INTO nita.doctors (user_id, name, email, phone, qualification, specialization,
      staff_type, department_id, experience, consultation_fee, bio, is_active)
    VALUES (NULL, 'Dr. Kosh Raj RC', 'koshraj.rc@nitaclinics.com', '+977 01-4533361',
      'MD Pediatrics', 'Pediatrics', 'doctor', pedia_id, 7, 600.00,
      'Pediatric consultant focused on childhood nutrition, infectious diseases, and adolescent health.', true);
  END IF;

  -- Pulmonology & TB
  IF NOT EXISTS (SELECT 1 FROM nita.doctors WHERE email = 'bikash.shrestha@nitaclinics.com') THEN
    INSERT INTO nita.doctors (user_id, name, email, phone, qualification, specialization,
      staff_type, department_id, experience, consultation_fee, bio, is_active)
    VALUES (NULL, 'Dr. Bikash Shrestha', 'bikash.shrestha@nitaclinics.com', '+977 01-4533361',
      'MD Pulmonology, DTCD', 'Pulmonology & TB', 'doctor', pulmo_id, 10, 800.00,
      'Pulmonology specialist with extensive experience in TB diagnosis, DOTS therapy, and drug-resistant TB management using GeneXpert and culture-guided protocols.', true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM nita.doctors WHERE email = 'anish.mahato@nitaclinics.com') THEN
    INSERT INTO nita.doctors (user_id, name, email, phone, qualification, specialization,
      staff_type, department_id, experience, consultation_fee, bio, is_active)
    VALUES (NULL, 'Dr. Anish Mahato', 'anish.mahato@nitaclinics.com', '+977 01-4533361',
      'MD Internal Medicine', 'Internal Medicine & TB', 'doctor', pulmo_id, 6, 700.00,
      'Internal medicine specialist with a focus on tuberculosis screening, ADSN monitoring, and chest cleaning procedures.', true);
  END IF;

  -- Orthopedics
  IF NOT EXISTS (SELECT 1 FROM nita.doctors WHERE email = 'kamal.pradhan@nitaclinics.com') THEN
    INSERT INTO nita.doctors (user_id, name, email, phone, qualification, specialization,
      staff_type, department_id, experience, consultation_fee, bio, is_active)
    VALUES (NULL, 'Dr. Kamal Pradhan', 'kamal.pradhan@nitaclinics.com', '+977 01-4533361',
      'MS Orthopedics', 'Orthopedics & Trauma', 'doctor', ortho_id, 15, 800.00,
      'Senior orthopedic surgeon with expertise in trauma, fracture fixation, joint injections, and musculoskeletal imaging.', true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM nita.doctors WHERE email = 'rita.kc@nitaclinics.com') THEN
    INSERT INTO nita.doctors (user_id, name, email, phone, qualification, specialization,
      staff_type, department_id, experience, consultation_fee, bio, is_active)
    VALUES (NULL, 'Dr. Rita KC', 'rita.kc@nitaclinics.com', '+977 01-4533361',
      'MD Orthopedics', 'Orthopedics & Rehabilitation', 'doctor', ortho_id, 8, 700.00,
      'Orthopedic consultant focusing on rehabilitation, posture evaluation, and non-surgical pain management.', true);
  END IF;
END $$;

COMMIT;

-- Verify
SELECT
  d.name,
  d.specialization,
  dep.name AS department,
  d.experience,
  d.consultation_fee,
  d.is_active
FROM nita.doctors d
LEFT JOIN nita.departments dep ON dep.id = d.department_id
ORDER BY dep.name, d.experience DESC;
