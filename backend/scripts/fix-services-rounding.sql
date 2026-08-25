-- 1) Add free_doctor_consultation column to checkup_packages (idempotent)
ALTER TABLE nita.checkup_packages
  ADD COLUMN IF NOT EXISTS free_doctor_consultation BOOLEAN NOT NULL DEFAULT TRUE;

-- 2) Fix General Public medicine discount to 10% (was 0%)
UPDATE nita.health_card_categories
SET medicine_discount = '10% off'
WHERE type = 'general_public';

\echo '--- packages with free consultation flag ---'
SELECT name, original_price, discounted_price, free_doctor_consultation
FROM nita.checkup_packages
ORDER BY category, "order";

\echo ''
\echo '--- general public tier ---'
SELECT name, type, opd_discount, lab_discount, medicine_discount
FROM nita.health_card_categories
WHERE type = 'general_public';
