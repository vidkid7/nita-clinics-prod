-- Seed weekly availability for all doctors (Mon-Sat 9:00-17:00, 15 min slots)
-- Idempotent: skips per doctor + day_of_week duplicates

BEGIN;

-- Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
-- Active days: Mon(1) through Sat(6) - 6 days
INSERT INTO nita.doctor_availabilities (doctor_id, day_of_week, start_time, end_time, slot_duration, is_active)
SELECT
  d.id,
  dow.day,
  '09:00'::time,
  '17:00'::time,
  15,
  true
FROM nita.doctors d
CROSS JOIN (
  VALUES (1), (2), (3), (4), (5), (6)
) AS dow(day)
WHERE d.is_active = true
ON CONFLICT DO NOTHING;

COMMIT;

-- Verify
SELECT
  d.name,
  dep.name AS department,
  COUNT(da.id) AS availability_slots
FROM nita.doctors d
LEFT JOIN nita.departments dep ON dep.id = d.department_id
LEFT JOIN nita.doctor_availabilities da ON da.doctor_id = d.id
WHERE d.is_active = true
GROUP BY d.id, d.name, dep.name
ORDER BY dep.name, d.name;
