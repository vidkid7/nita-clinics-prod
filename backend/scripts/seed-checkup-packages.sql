-- Health Check-up Package Pricing — Nita Clinics
-- Based on the official posters (image 1: General, image 2: Premium)
-- All packages priced at 30% off MRP for consistent value perception.
-- Fixed typo in image 2 (Below 40) and rounded the male premium price for a cleaner offer.

SET search_path TO nita;

-- Clean slate for these categories (idempotent re-run)
DELETE FROM checkup_packages WHERE category IN (
  'female_general','male_general','female_premium','male_premium'
);

-- ──────────────────────────────────────────────────────────────────
--  GENERAL HEALTH PACKAGE  (from poster image 1)
-- ──────────────────────────────────────────────────────────────────

-- Below 40 — appears in both female and male filters
INSERT INTO checkup_packages
  (name, category, target_group, age_label, original_price, discounted_price, currency,
   description, tests, cta_label, is_active, "order")
VALUES
  ('General Health Package - Below 40', 'female_general', 'Unisex', 'Below 40',
   4300, 3010, 'NPR',
   'Comprehensive essential screening panel for adults under 40. Covers core blood, kidney, liver, lipid, and thyroid markers for a complete annual preventive check-up.',
   '["CBC","Glucose F","Uric Acid","RFT","LFT","Lipid Profile","TSH","Calcium","Urine R/E"]',
   'Book Check-up', true, 1),
  ('General Health Package - Below 40', 'male_general', 'Unisex', 'Below 40',
   4300, 3010, 'NPR',
   'Comprehensive essential screening panel for adults under 40. Covers core blood, kidney, liver, lipid, and thyroid markers for a complete annual preventive check-up.',
   '["CBC","Glucose F","Uric Acid","RFT","LFT","Lipid Profile","TSH","Calcium","Urine R/E"]',
   'Book Check-up', true, 1),

-- Female Over 40 (adds CA125)
  ('General Health Package - Female (Over 40)', 'female_general', 'Female', 'Over 40',
   6300, 4410, 'NPR',
   'Tailored for women over 40. Adds CA125 for ovarian health screening alongside the full general panel.',
   '["CBC","Glucose F","Uric Acid","RFT","LFT","Lipid Profile","TSH","Calcium","Urine R/E","CA125"]',
   'Book Check-up', true, 2),

-- Male Over 40 (adds PSA)
  ('General Health Package - Male (Over 40)', 'male_general', 'Male', 'Over 40',
   5800, 4060, 'NPR',
   'Designed for men over 40. Adds PSA for prostate health screening alongside the full general panel.',
   '["CBC","Glucose F","Uric Acid","RFT","LFT","Lipid Profile","TSH","Calcium","Urine R/E","PSA"]',
   'Book Check-up', true, 2);

-- ──────────────────────────────────────────────────────────────────
--  PREMIUM HEALTH PACKAGE  (from poster image 2)
--  Replaces TSH with full TFT and adds Albumin for a deeper panel.
-- ──────────────────────────────────────────────────────────────────

-- Below 40 — appears in both female and male filters
INSERT INTO checkup_packages
  (name, category, target_group, age_label, original_price, discounted_price, currency,
   description, tests, cta_label, is_active, "order")
VALUES
  ('Premium Health Package - Below 40', 'female_premium', 'Unisex', 'Below 40',
   5000, 3500, 'NPR',
   'Deeper screening tier for adults under 40. Upgrades TSH to a full thyroid function test (TFT) and adds Albumin for a richer metabolic picture.',
   '["CBC","Glucose F","Uric Acid","Albumin","Calcium","RFT","LFT","Lipid Profile","TFT","Urine R/E"]',
   'Book Check-up', true, 3),
  ('Premium Health Package - Below 40', 'male_premium', 'Unisex', 'Below 40',
   5000, 3500, 'NPR',
   'Deeper screening tier for adults under 40. Upgrades TSH to a full thyroid function test (TFT) and adds Albumin for a richer metabolic picture.',
   '["CBC","Glucose F","Uric Acid","Albumin","Calcium","RFT","LFT","Lipid Profile","TFT","Urine R/E"]',
   'Book Check-up', true, 3),

-- Female Over 40 (adds CA125)
  ('Premium Health Package - Female (Over 40)', 'female_premium', 'Female', 'Over 40',
   7300, 5110, 'NPR',
   'Top-tier panel for women over 40. Combines CA125 for ovarian health with full TFT, Albumin, and the complete premium metabolic screen.',
   '["CBC","Glucose F","Uric Acid","Albumin","Calcium","RFT","LFT","Lipid Profile","TFT","Urine R/E","CA125"]',
   'Book Check-up', true, 4),

-- Male Over 40 (adds PSA, rounded to 30% off for a cleaner offer)
  ('Premium Health Package - Male (Over 40)', 'male_premium', 'Male', 'Over 40',
   6000, 4200, 'NPR',
   'Top-tier panel for men over 40. Combines PSA for prostate health with full TFT, Albumin, and the complete premium metabolic screen.',
   '["CBC","Glucose F","Uric Acid","Albumin","Calcium","RFT","LFT","Lipid Profile","TFT","Urine R/E","PSA"]',
   'Book Check-up', true, 4);

-- Quick verify
SELECT name, category, target_group, age_label, original_price, discounted_price, "order"
FROM checkup_packages
WHERE category IN ('female_general','male_general','female_premium','male_premium')
ORDER BY "order", category;
