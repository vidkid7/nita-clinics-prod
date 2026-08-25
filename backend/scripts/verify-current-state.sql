\echo '=== Health card categories ==='
SELECT name, type, opd_discount, lab_discount, medicine_discount, price, summary
FROM nita.health_card_categories
ORDER BY "order";

\echo ''
\echo '=== Vaccines ==='
SELECT name, short_name, price_note, is_active
FROM nita.vaccines
ORDER BY "order";

\echo ''
\echo '=== Checkup packages with free consultation ==='
SELECT name, original_price, discounted_price, is_active
FROM nita.checkup_packages
ORDER BY category, "order";

\echo ''
\echo '=== Lab tests count by category ==='
SELECT c.name AS category, COUNT(t.id) AS test_count, MIN(t.price) AS min_price, MAX(t.price) AS max_price
FROM nita.lab_test_categories c
LEFT JOIN nita.lab_tests t ON t.category_id = c.id
GROUP BY c.id, c.name, c."order"
ORDER BY c."order";

\echo ''
\echo '=== Free doctor consultation column check ==='
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'nita' AND table_name = 'checkup_packages'
  AND column_name LIKE '%consult%';
