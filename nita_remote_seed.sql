-- ============================================================
-- Nita Clinics — nita schema seed for Supabase
-- Generated 2026-08-07T08:26:52.805Z
-- Paste this entire file into Supabase SQL Editor and Run
-- ============================================================

CREATE SCHEMA IF NOT EXISTS nita;
SET search_path TO nita, public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE nita.appointments_status_enum AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
CREATE TYPE nita.checkup_packages_category_enum AS ENUM ('female_general', 'female_premium', 'male_general', 'male_premium', 'tuberculosis', 'pediatrics', 'gynecology');
CREATE TYPE nita.doctors_staff_type_enum AS ENUM ('doctor', 'admin_staff', 'nurse', 'technician');
CREATE TYPE nita.enquiries_status_enum AS ENUM ('new', 'in_progress', 'resolved', 'closed');
CREATE TYPE nita.enquiries_type_enum AS ENUM ('general', 'appointment', 'admission', 'services', 'feedback', 'complaint');
CREATE TYPE nita.health_card_applications_document_type_enum AS ENUM ('passport', 'citizenship', 'driving_license', 'nmc_registration', 'employee_id');
CREATE TYPE nita.health_card_applications_holdertype_enum AS ENUM ('doctor', 'doctor_family', 'partner_staff', 'general_public');
CREATE TYPE nita.health_card_applications_status_enum AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE nita.health_card_categories_type_enum AS ENUM ('licensed_doctors', 'family', 'partner_staff', 'general_public');
CREATE TYPE nita.home_collections_status_enum AS ENUM ('requested', 'assigned', 'en_route', 'collected', 'completed', 'cancelled');
CREATE TYPE nita.lab_order_items_status_enum AS ENUM ('pending', 'collected', 'processing', 'completed');
CREATE TYPE nita.lab_orders_collection_type_enum AS ENUM ('clinic', 'home');
CREATE TYPE nita.lab_orders_payment_status_enum AS ENUM ('unpaid', 'paid', 'refunded');
CREATE TYPE nita.lab_orders_status_enum AS ENUM ('placed', 'confirmed', 'sample_collected', 'processing', 'completed', 'cancelled');
CREATE TYPE nita.media_files_type_enum AS ENUM ('image', 'video', 'document');
CREATE TYPE nita.partners_section_enum AS ENUM ('health_card', 'homepage', 'footer');
CREATE TYPE nita.patients_blood_group_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE nita.patients_gender_enum AS ENUM ('male', 'female', 'other');
CREATE TYPE nita.payment_transactions_gateway_enum AS ENUM ('esewa', 'khalti', 'fonepay');
CREATE TYPE nita.payment_transactions_purpose_enum AS ENUM ('health_card', 'package', 'appointment', 'lab_test', 'other');
CREATE TYPE nita.payment_transactions_status_enum AS ENUM ('initialized', 'pending', 'success', 'failed', 'cancelled', 'expired', 'verification_failed');
CREATE TYPE nita.users_role_enum AS ENUM ('super_admin', 'admin', 'staff', 'patient');

-- Table: nita.users
CREATE TABLE IF NOT EXISTS nita.users (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "email" character varying NOT NULL,
  "password" character varying NOT NULL,
  "name" character varying NOT NULL,
  "role" nita.users_role_enum NOT NULL DEFAULT 'staff'::nita.users_role_enum,
  "avatar" character varying,
  "is_active" boolean NOT NULL DEFAULT true,
  "last_login" timestamp without time zone,
  "refresh_token" character varying
);

ALTER TABLE nita.users ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_97672ac88f789774dd47f7c8be3" ON nita.users ("email");

-- Data for nita.users (7 rows)
INSERT INTO nita.users ("id", "created_at", "updated_at", "email", "password", "name", "role", "avatar", "is_active", "last_login", "refresh_token") VALUES ('ca2dea8f-477a-4411-89b3-37acd1691188', '2026-08-04T21:17:53.994Z', '2026-08-04T21:17:53.994Z', 'smoke.p3@example.com', '$2a$10$cj4UZOZjDkUb206RkxU0Ne4gvmNDPHaE8EyPLoBDTBxVTO93aYdyS', 'Smoke Test', 'patient', NULL, true, NULL, NULL);
INSERT INTO nita.users ("id", "created_at", "updated_at", "email", "password", "name", "role", "avatar", "is_active", "last_login", "refresh_token") VALUES ('1e07d6c2-e9ab-46ec-9f01-9ff533f8bcc7', '2026-08-05T02:32:33.730Z', '2026-08-05T02:32:33.730Z', 'smoke-test-5@example.com', '$2a$10$GTXEI0qRul8PowDNZPw1kuhIxjpYzds7hPKX10GSgGphxxJhoKNrC', 'Smoke Test User 5', 'patient', NULL, true, NULL, NULL);
INSERT INTO nita.users ("id", "created_at", "updated_at", "email", "password", "name", "role", "avatar", "is_active", "last_login", "refresh_token") VALUES ('d990d9a1-8a5d-4a29-8226-f6652d124147', '2026-08-05T02:41:36.609Z', '2026-08-05T07:52:07.674Z', 'admin@nita.com', '$2a$10$JFCP5maO9Q9N8cYdwDTwkuGX3nJz8rClSg7jWl2hgniyc6RDcwbsG', 'Nita Admin', 'super_admin', NULL, true, '2026-08-05T07:52:07.587Z', '$2a$10$CYj0aLpfiyCEgM4KeUeDYuFN8CVa3UlhAdZN77Z9QNZaNX9sN.q3S');
INSERT INTO nita.users ("id", "created_at", "updated_at", "email", "password", "name", "role", "avatar", "is_active", "last_login", "refresh_token") VALUES ('0cc8d3ba-0ea5-464f-a6f9-62bc62161a01', '2026-08-05T07:53:57.959Z', '2026-08-05T07:54:32.506Z', 'testing@nitaclinics.com', '$2a$10$ENo2E6yQYN5kuHoeOAi.k.rqkwPjxTlYK9ocFDYCHw4bvfXMX1O6G', 'Test Purpose', 'patient', NULL, true, '2026-08-05T07:54:32.419Z', '$2a$10$FgPVMdo4abaDWacgjOjp2ewp30SnBNVq1xacRC4hKvgVv2jMJ51M2');
INSERT INTO nita.users ("id", "created_at", "updated_at", "email", "password", "name", "role", "avatar", "is_active", "last_login", "refresh_token") VALUES ('bdb12f5c-ddbc-4853-af08-e36759b67a7f', '2026-08-05T03:04:32.120Z', '2026-08-05T03:04:32.120Z', 'audit-full-266955@test.com', '$2a$10$BXPXDXInINsKAwuinwaVAuBpygxsBIFcZC98Bd84ijEoKvzxWiNba', 'Audit Full 266955', 'patient', NULL, true, NULL, NULL);
INSERT INTO nita.users ("id", "created_at", "updated_at", "email", "password", "name", "role", "avatar", "is_active", "last_login", "refresh_token") VALUES ('ea88f687-5a5a-4085-8362-4baa2d348fd8', '2026-08-05T06:46:05.677Z', '2026-08-05T06:46:29.254Z', 'verify-20260805123105@nitatest.com', '$2a$10$0H7jBoOx39acbr8wyCnj.uNaeH8EIBnqaX74GF1KYRVB0DGOmXcD.', 'Verify Patient 20260805123105', 'patient', NULL, true, '2026-08-05T06:46:29.171Z', '$2a$10$JQX/zy4LoycBpDG8pEnV5eAn.Fq/8RWMeuBx4HJg5uklRPb5xqdri');
INSERT INTO nita.users ("id", "created_at", "updated_at", "email", "password", "name", "role", "avatar", "is_active", "last_login", "refresh_token") VALUES ('5cba6c52-ba43-4584-a576-5c733b082047', '2026-08-05T03:00:15.193Z', '2026-08-05T06:56:56.208Z', 'audit-717934@nita-test.com', '$2a$10$KO3Zx4oYgVoMzX0S01jX5u4q2kX0i/PYReJ022b4yxtiqrtNa0A5e', 'Audit Patient 717934', 'patient', NULL, true, '2026-08-05T06:56:56.129Z', '$2a$10$/9aPLYUB5leKfcbT0E7cru1IO5goc2fhAK2HC4bCHYH/YEVHr20xG');

-- Table: nita.departments
CREATE TABLE IF NOT EXISTS nita.departments (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "name" character varying NOT NULL,
  "slug" character varying NOT NULL,
  "description" text,
  "icon" character varying,
  "image" character varying,
  "is_active" boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0
);

ALTER TABLE nita.departments ADD CONSTRAINT "departments_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_a23b1fdc69006219d8acc76c04f" ON nita.departments ("slug");

-- Data for nita.departments (6 rows)
INSERT INTO nita.departments ("id", "created_at", "updated_at", "name", "slug", "description", "icon", "image", "is_active", "order") VALUES ('678f5c98-3e4c-4496-83d1-e09b4248eb54', '2026-08-04T12:42:59.562Z', '2026-08-04T12:42:59.562Z', 'General Medicine', 'general-medicine', 'Comprehensive outpatient care including preventive and follow-up services', NULL, NULL, true, 1);
INSERT INTO nita.departments ("id", "created_at", "updated_at", "name", "slug", "description", "icon", "image", "is_active", "order") VALUES ('9fcdbed4-eb33-4cbe-8f17-89ef0cb2a366', '2026-08-04T12:42:59.642Z', '2026-08-04T12:42:59.642Z', 'Gynecology and Obstetrics', 'gynecology-and-obstetrics', 'Women-focused care including reproductive health consultations', NULL, NULL, true, 2);
INSERT INTO nita.departments ("id", "created_at", "updated_at", "name", "slug", "description", "icon", "image", "is_active", "order") VALUES ('4d809c4b-a7e2-4951-8a9e-f58109c35f64', '2026-08-04T12:42:59.656Z', '2026-08-04T12:42:59.656Z', 'Pediatrics', 'pediatrics', 'Comprehensive care for infants, children, and adolescents', NULL, NULL, true, 3);
INSERT INTO nita.departments ("id", "created_at", "updated_at", "name", "slug", "description", "icon", "image", "is_active", "order") VALUES ('d47d40a4-eabb-4a16-bee0-bb8675b6f160', '2026-08-04T12:42:59.667Z', '2026-08-04T12:42:59.667Z', 'Diagnostic Services', 'diagnostic-services', 'Laboratory and diagnostic support for accurate clinical decisions', NULL, NULL, true, 4);
INSERT INTO nita.departments ("id", "created_at", "updated_at", "name", "slug", "description", "icon", "image", "is_active", "order") VALUES ('6cd5a455-f854-471e-9ed7-9c7ce4aa35d9', '2026-08-05T06:52:28.935Z', '2026-08-05T06:52:28.935Z', 'Pulmonology & TB', 'pulmonology-tb', 'Specialized care for respiratory conditions, tuberculosis screening, DOTS therapy, and chest medicine.', NULL, NULL, true, 5);
INSERT INTO nita.departments ("id", "created_at", "updated_at", "name", "slug", "description", "icon", "image", "is_active", "order") VALUES ('5216b57e-bb4e-43d0-bc61-0e191113ea6a', '2026-08-05T06:52:28.935Z', '2026-08-05T06:52:28.935Z', 'Orthopedics', 'orthopedics', 'Comprehensive musculoskeletal care covering bones, joints, muscles, spine, and trauma care.', NULL, NULL, true, 6);

-- Table: nita.doctors
CREATE TABLE IF NOT EXISTS nita.doctors (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "user_id" uuid,
  "name" character varying NOT NULL,
  "email" character varying NOT NULL,
  "phone" character varying NOT NULL,
  "photo" character varying,
  "qualification" character varying NOT NULL,
  "specialization" character varying NOT NULL,
  "staff_type" nita.doctors_staff_type_enum NOT NULL DEFAULT 'doctor'::nita.doctors_staff_type_enum,
  "department_id" uuid NOT NULL,
  "experience" integer NOT NULL DEFAULT 0,
  "consultation_fee" numeric(10,2),
  "bio" text,
  "is_active" boolean NOT NULL DEFAULT true
);

ALTER TABLE nita.doctors ADD CONSTRAINT "doctors_pkey" PRIMARY KEY ("id");

ALTER TABLE nita.doctors ADD CONSTRAINT "FK_3672b55bcb332e54bc8d8cda1c1" FOREIGN KEY ("department_id") REFERENCES nita.departments ("id");
ALTER TABLE nita.doctors ADD CONSTRAINT "FK_653c27d1b10652eb0c7bbbc4427" FOREIGN KEY ("user_id") REFERENCES nita.users ("id");

-- Data for nita.doctors (8 rows)
INSERT INTO nita.doctors ("id", "created_at", "updated_at", "user_id", "name", "email", "phone", "photo", "qualification", "specialization", "staff_type", "department_id", "experience", "consultation_fee", "bio", "is_active") VALUES ('17b9e0bb-5f79-4e78-96c6-713de1299f82', '2026-08-05T06:52:28.935Z', '2026-08-05T06:52:28.935Z', NULL, 'Dr. Josie R. Baral', 'josie.baral@nitaclinics.com', '+977 01-4533361', NULL, 'MD, MS Gynecology', 'Gynecology & Obstetrics', 'doctor', '9fcdbed4-eb33-4cbe-8f17-89ef0cb2a366', 14, '800.00', 'Senior consultant in gynecology & obstetrics with 14+ years of experience in women''s health, prenatal monitoring, and reproductive care.', true);
INSERT INTO nita.doctors ("id", "created_at", "updated_at", "user_id", "name", "email", "phone", "photo", "qualification", "specialization", "staff_type", "department_id", "experience", "consultation_fee", "bio", "is_active") VALUES ('bc68cd0b-eeaa-459d-8b92-5a9d9f4fff6b', '2026-08-05T06:52:28.935Z', '2026-08-05T06:52:28.935Z', NULL, 'Dr. Sajana Shrestha', 'sajana.shrestha@nitaclinics.com', '+977 01-4533361', NULL, 'MD Obstetrics & Gynecology', 'Gynecology & Obstetrics', 'doctor', '9fcdbed4-eb33-4cbe-8f17-89ef0cb2a366', 9, '700.00', 'Obstetrician & gynecologist with strong focus on antenatal care, PCOS management, and minimally invasive procedures.', true);
INSERT INTO nita.doctors ("id", "created_at", "updated_at", "user_id", "name", "email", "phone", "photo", "qualification", "specialization", "staff_type", "department_id", "experience", "consultation_fee", "bio", "is_active") VALUES ('adb422bc-5ee8-4673-840c-cb9712b5910b', '2026-08-05T06:52:28.935Z', '2026-08-05T06:52:28.935Z', NULL, 'Dr. Mukti Ghimire', 'mukti.ghimire@nitaclinics.com', '+977 01-4533361', NULL, 'MD Pediatrics, FCPS', 'Pediatrics', 'doctor', '4d809c4b-a7e2-4951-8a9e-f58109c35f64', 11, '700.00', 'Pediatrician specializing in newborn care, growth monitoring, vaccination planning, and developmental assessments.', true);
INSERT INTO nita.doctors ("id", "created_at", "updated_at", "user_id", "name", "email", "phone", "photo", "qualification", "specialization", "staff_type", "department_id", "experience", "consultation_fee", "bio", "is_active") VALUES ('55667c6e-14ed-4174-bc2b-d6b49a4ddb01', '2026-08-05T06:52:28.935Z', '2026-08-05T06:52:28.935Z', NULL, 'Dr. Kosh Raj RC', 'koshraj.rc@nitaclinics.com', '+977 01-4533361', NULL, 'MD Pediatrics', 'Pediatrics', 'doctor', '4d809c4b-a7e2-4951-8a9e-f58109c35f64', 7, '600.00', 'Pediatric consultant focused on childhood nutrition, infectious diseases, and adolescent health.', true);
INSERT INTO nita.doctors ("id", "created_at", "updated_at", "user_id", "name", "email", "phone", "photo", "qualification", "specialization", "staff_type", "department_id", "experience", "consultation_fee", "bio", "is_active") VALUES ('5dc681b5-3dde-4441-a664-8bda76b03a76', '2026-08-05T06:52:28.935Z', '2026-08-05T06:52:28.935Z', NULL, 'Dr. Bikash Shrestha', 'bikash.shrestha@nitaclinics.com', '+977 01-4533361', NULL, 'MD Pulmonology, DTCD', 'Pulmonology & TB', 'doctor', '6cd5a455-f854-471e-9ed7-9c7ce4aa35d9', 10, '800.00', 'Pulmonology specialist with extensive experience in TB diagnosis, DOTS therapy, and drug-resistant TB management using GeneXpert and culture-guided protocols.', true);
INSERT INTO nita.doctors ("id", "created_at", "updated_at", "user_id", "name", "email", "phone", "photo", "qualification", "specialization", "staff_type", "department_id", "experience", "consultation_fee", "bio", "is_active") VALUES ('b3ffb0d8-7429-49b5-9d13-1e156f5f0c52', '2026-08-05T06:52:28.935Z', '2026-08-05T06:52:28.935Z', NULL, 'Dr. Anish Mahato', 'anish.mahato@nitaclinics.com', '+977 01-4533361', NULL, 'MD Internal Medicine', 'Internal Medicine & TB', 'doctor', '6cd5a455-f854-471e-9ed7-9c7ce4aa35d9', 6, '700.00', 'Internal medicine specialist with a focus on tuberculosis screening, ADSN monitoring, and chest cleaning procedures.', true);
INSERT INTO nita.doctors ("id", "created_at", "updated_at", "user_id", "name", "email", "phone", "photo", "qualification", "specialization", "staff_type", "department_id", "experience", "consultation_fee", "bio", "is_active") VALUES ('a432e703-809f-43fe-9874-ec034b4934ff', '2026-08-05T06:52:28.935Z', '2026-08-05T06:52:28.935Z', NULL, 'Dr. Kamal Pradhan', 'kamal.pradhan@nitaclinics.com', '+977 01-4533361', NULL, 'MS Orthopedics', 'Orthopedics & Trauma', 'doctor', '5216b57e-bb4e-43d0-bc61-0e191113ea6a', 15, '800.00', 'Senior orthopedic surgeon with expertise in trauma, fracture fixation, joint injections, and musculoskeletal imaging.', true);
INSERT INTO nita.doctors ("id", "created_at", "updated_at", "user_id", "name", "email", "phone", "photo", "qualification", "specialization", "staff_type", "department_id", "experience", "consultation_fee", "bio", "is_active") VALUES ('d2ac697a-c4ec-410f-8064-b88220743a26', '2026-08-05T06:52:28.935Z', '2026-08-05T06:52:28.935Z', NULL, 'Dr. Rita KC', 'rita.kc@nitaclinics.com', '+977 01-4533361', NULL, 'MD Orthopedics', 'Orthopedics & Rehabilitation', 'doctor', '5216b57e-bb4e-43d0-bc61-0e191113ea6a', 8, '700.00', 'Orthopedic consultant focusing on rehabilitation, posture evaluation, and non-surgical pain management.', true);

-- Table: nita.appointments
CREATE TABLE IF NOT EXISTS nita.appointments (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "doctor_id" uuid,
  "patient_name" character varying NOT NULL,
  "patient_email" character varying NOT NULL,
  "patient_phone" character varying NOT NULL,
  "date" date NOT NULL,
  "start_time" time without time zone NOT NULL,
  "end_time" time without time zone NOT NULL,
  "status" nita.appointments_status_enum NOT NULL DEFAULT 'pending'::nita.appointments_status_enum,
  "notes" text,
  "cancellation_reason" text,
  "reminder_sent" boolean NOT NULL DEFAULT false,
  "confirmation_sent" boolean NOT NULL DEFAULT false
);

ALTER TABLE nita.appointments ADD CONSTRAINT "appointments_pkey" PRIMARY KEY ("id");

ALTER TABLE nita.appointments ADD CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2" FOREIGN KEY ("doctor_id") REFERENCES nita.doctors ("id");

-- Data for nita.appointments (1 rows)
INSERT INTO nita.appointments ("id", "created_at", "updated_at", "doctor_id", "patient_name", "patient_email", "patient_phone", "date", "start_time", "end_time", "status", "notes", "cancellation_reason", "reminder_sent", "confirmation_sent") VALUES ('0a49a32d-b2d9-4fac-a55f-582e732b1c0c', '2026-08-05T06:55:08.729Z', '2026-08-05T06:55:26.362Z', 'bc68cd0b-eeaa-459d-8b92-5a9d9f4fff6b', 'Audit Patient 717934', 'audit-717934@nita-test.com', '+97798717934', '2026-08-10T18:15:00.000Z', '10:00:00', '10:15:00', 'confirmed', 'Visit: consultation
Verify appointment via audit', NULL, false, false);

-- Table: nita.blog_posts
CREATE TABLE IF NOT EXISTS nita.blog_posts (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "title" character varying NOT NULL,
  "slug" character varying NOT NULL,
  "excerpt" text NOT NULL,
  "content" text NOT NULL,
  "featured_image" character varying,
  "author" character varying NOT NULL,
  "author_id" uuid,
  "category" character varying NOT NULL,
  "tags" text NOT NULL DEFAULT '[]'::text,
  "is_published" boolean NOT NULL DEFAULT false,
  "published_at" timestamp without time zone,
  "views" integer NOT NULL DEFAULT 0,
  "reading_time" integer NOT NULL DEFAULT 5
);

ALTER TABLE nita.blog_posts ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_5b2818a2c45c3edb9991b1c7a51" ON nita.blog_posts ("slug");

ALTER TABLE nita.blog_posts ADD CONSTRAINT "FK_c3fc4a3a656aad74331acfcf2a9" FOREIGN KEY ("author_id") REFERENCES nita.users ("id");

-- (no rows for nita.blog_posts)

-- Table: nita.checkup_packages
CREATE TABLE IF NOT EXISTS nita.checkup_packages (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "name" character varying NOT NULL,
  "category" nita.checkup_packages_category_enum NOT NULL DEFAULT 'female_general'::nita.checkup_packages_category_enum,
  "target_group" character varying,
  "age_label" character varying,
  "original_price" numeric(10,2) NOT NULL,
  "discounted_price" numeric(10,2) NOT NULL,
  "currency" character varying NOT NULL DEFAULT 'NPR'::character varying,
  "description" text,
  "tests" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "cta_label" character varying,
  "cta_link" character varying,
  "image" character varying,
  "is_active" boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0,
  "free_doctor_consultation" boolean NOT NULL DEFAULT true
);

ALTER TABLE nita.checkup_packages ADD CONSTRAINT "checkup_packages_pkey" PRIMARY KEY ("id");

-- Data for nita.checkup_packages (8 rows)
INSERT INTO nita.checkup_packages ("id", "created_at", "updated_at", "name", "category", "target_group", "age_label", "original_price", "discounted_price", "currency", "description", "tests", "cta_label", "cta_link", "image", "is_active", "order", "free_doctor_consultation") VALUES ('a1fcc2f0-d57d-4115-9ccf-9821fa7f17a2', '2026-08-04T13:39:44.787Z', '2026-08-04T13:39:44.787Z', 'General Health Package - Below 40', 'female_general', 'Unisex', 'Below 40', '4300.00', '3010.00', 'NPR', 'Comprehensive essential screening panel for adults under 40. Covers core blood, kidney, liver, lipid, and thyroid markers for a complete annual preventive check-up.', '["CBC","Glucose F","Uric Acid","RFT","LFT","Lipid Profile","TSH","Calcium","Urine R/E"]', 'Book Check-up', NULL, NULL, true, 1, true);
INSERT INTO nita.checkup_packages ("id", "created_at", "updated_at", "name", "category", "target_group", "age_label", "original_price", "discounted_price", "currency", "description", "tests", "cta_label", "cta_link", "image", "is_active", "order", "free_doctor_consultation") VALUES ('d5c940a0-93db-42bf-b155-2c6410e6e82c', '2026-08-04T13:39:44.787Z', '2026-08-04T13:39:44.787Z', 'General Health Package - Below 40', 'male_general', 'Unisex', 'Below 40', '4300.00', '3010.00', 'NPR', 'Comprehensive essential screening panel for adults under 40. Covers core blood, kidney, liver, lipid, and thyroid markers for a complete annual preventive check-up.', '["CBC","Glucose F","Uric Acid","RFT","LFT","Lipid Profile","TSH","Calcium","Urine R/E"]', 'Book Check-up', NULL, NULL, true, 1, true);
INSERT INTO nita.checkup_packages ("id", "created_at", "updated_at", "name", "category", "target_group", "age_label", "original_price", "discounted_price", "currency", "description", "tests", "cta_label", "cta_link", "image", "is_active", "order", "free_doctor_consultation") VALUES ('a118b98e-7171-4192-8b8f-8b58708f212d', '2026-08-04T13:39:44.787Z', '2026-08-04T13:39:44.787Z', 'General Health Package - Female (Over 40)', 'female_general', 'Female', 'Over 40', '6300.00', '4410.00', 'NPR', 'Tailored for women over 40. Adds CA125 for ovarian health screening alongside the full general panel.', '["CBC","Glucose F","Uric Acid","RFT","LFT","Lipid Profile","TSH","Calcium","Urine R/E","CA125"]', 'Book Check-up', NULL, NULL, true, 2, true);
INSERT INTO nita.checkup_packages ("id", "created_at", "updated_at", "name", "category", "target_group", "age_label", "original_price", "discounted_price", "currency", "description", "tests", "cta_label", "cta_link", "image", "is_active", "order", "free_doctor_consultation") VALUES ('5a952e0b-701e-4d76-93bc-42e0c4485e25', '2026-08-04T13:39:44.787Z', '2026-08-04T13:39:44.787Z', 'General Health Package - Male (Over 40)', 'male_general', 'Male', 'Over 40', '5800.00', '4060.00', 'NPR', 'Designed for men over 40. Adds PSA for prostate health screening alongside the full general panel.', '["CBC","Glucose F","Uric Acid","RFT","LFT","Lipid Profile","TSH","Calcium","Urine R/E","PSA"]', 'Book Check-up', NULL, NULL, true, 2, true);
INSERT INTO nita.checkup_packages ("id", "created_at", "updated_at", "name", "category", "target_group", "age_label", "original_price", "discounted_price", "currency", "description", "tests", "cta_label", "cta_link", "image", "is_active", "order", "free_doctor_consultation") VALUES ('b9033497-f944-4d62-a74d-d03595baa4f8', '2026-08-04T13:39:44.836Z', '2026-08-04T13:39:44.836Z', 'Premium Health Package - Below 40', 'female_premium', 'Unisex', 'Below 40', '5000.00', '3500.00', 'NPR', 'Deeper screening tier for adults under 40. Upgrades TSH to a full thyroid function test (TFT) and adds Albumin for a richer metabolic picture.', '["CBC","Glucose F","Uric Acid","Albumin","Calcium","RFT","LFT","Lipid Profile","TFT","Urine R/E"]', 'Book Check-up', NULL, NULL, true, 3, true);
INSERT INTO nita.checkup_packages ("id", "created_at", "updated_at", "name", "category", "target_group", "age_label", "original_price", "discounted_price", "currency", "description", "tests", "cta_label", "cta_link", "image", "is_active", "order", "free_doctor_consultation") VALUES ('21a235ac-f896-41ea-bc0d-6114413e3040', '2026-08-04T13:39:44.836Z', '2026-08-04T13:39:44.836Z', 'Premium Health Package - Below 40', 'male_premium', 'Unisex', 'Below 40', '5000.00', '3500.00', 'NPR', 'Deeper screening tier for adults under 40. Upgrades TSH to a full thyroid function test (TFT) and adds Albumin for a richer metabolic picture.', '["CBC","Glucose F","Uric Acid","Albumin","Calcium","RFT","LFT","Lipid Profile","TFT","Urine R/E"]', 'Book Check-up', NULL, NULL, true, 3, true);
INSERT INTO nita.checkup_packages ("id", "created_at", "updated_at", "name", "category", "target_group", "age_label", "original_price", "discounted_price", "currency", "description", "tests", "cta_label", "cta_link", "image", "is_active", "order", "free_doctor_consultation") VALUES ('7060fcf9-cc47-4106-978a-088dd605c0dc', '2026-08-04T13:39:44.836Z', '2026-08-04T13:39:44.836Z', 'Premium Health Package - Female (Over 40)', 'female_premium', 'Female', 'Over 40', '7300.00', '5110.00', 'NPR', 'Top-tier panel for women over 40. Combines CA125 for ovarian health with full TFT, Albumin, and the complete premium metabolic screen.', '["CBC","Glucose F","Uric Acid","Albumin","Calcium","RFT","LFT","Lipid Profile","TFT","Urine R/E","CA125"]', 'Book Check-up', NULL, NULL, true, 4, true);
INSERT INTO nita.checkup_packages ("id", "created_at", "updated_at", "name", "category", "target_group", "age_label", "original_price", "discounted_price", "currency", "description", "tests", "cta_label", "cta_link", "image", "is_active", "order", "free_doctor_consultation") VALUES ('243221fd-b5fb-4540-b52a-3f079e807689', '2026-08-04T13:39:44.836Z', '2026-08-04T13:39:44.836Z', 'Premium Health Package - Male (Over 40)', 'male_premium', 'Male', 'Over 40', '6000.00', '4200.00', 'NPR', 'Top-tier panel for men over 40. Combines PSA for prostate health with full TFT, Albumin, and the complete premium metabolic screen.', '["CBC","Glucose F","Uric Acid","Albumin","Calcium","RFT","LFT","Lipid Profile","TFT","Urine R/E","PSA"]', 'Book Check-up', NULL, NULL, true, 4, true);

-- Table: nita.clinics
CREATE TABLE IF NOT EXISTS nita.clinics (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "name" character varying NOT NULL,
  "slug" character varying NOT NULL,
  "address" character varying NOT NULL,
  "city" character varying NOT NULL,
  "state" character varying NOT NULL,
  "postal_code" character varying NOT NULL,
  "country" character varying NOT NULL,
  "phone" character varying NOT NULL,
  "email" character varying NOT NULL,
  "latitude" numeric(10,8) NOT NULL,
  "longitude" numeric(11,8) NOT NULL,
  "working_hours" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "services" text,
  "images" text,
  "is_main" boolean NOT NULL DEFAULT false,
  "is_active" boolean NOT NULL DEFAULT true
);

ALTER TABLE nita.clinics ADD CONSTRAINT "clinics_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_1c4933755297e407da44d46031c" ON nita.clinics ("slug");

-- (no rows for nita.clinics)

-- Table: nita.doctor_availabilities
CREATE TABLE IF NOT EXISTS nita.doctor_availabilities (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "doctor_id" uuid NOT NULL,
  "day_of_week" integer NOT NULL,
  "start_time" time without time zone NOT NULL,
  "end_time" time without time zone NOT NULL,
  "slot_duration" integer NOT NULL DEFAULT 15,
  "is_active" boolean NOT NULL DEFAULT true
);

ALTER TABLE nita.doctor_availabilities ADD CONSTRAINT "doctor_availabilities_pkey" PRIMARY KEY ("id");

ALTER TABLE nita.doctor_availabilities ADD CONSTRAINT "FK_aa49ce7b9ff575a2963abcb6910" FOREIGN KEY ("doctor_id") REFERENCES nita.doctors ("id") ON DELETE CASCADE;

-- Data for nita.doctor_availabilities (48 rows)
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('11d46c4a-fb19-4ab4-bc63-9dcb16f37179', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '17b9e0bb-5f79-4e78-96c6-713de1299f82', 1, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('cf916b38-d1b6-415f-9782-ea4c25f590c0', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '17b9e0bb-5f79-4e78-96c6-713de1299f82', 2, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('89ef41be-f568-4605-9097-3101f121ec6e', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '17b9e0bb-5f79-4e78-96c6-713de1299f82', 3, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('ba9941b9-2873-42fb-beda-0df2e034a9d3', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '17b9e0bb-5f79-4e78-96c6-713de1299f82', 4, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('eaf10eb2-b8d0-47e6-a50b-928c0ab50be0', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '17b9e0bb-5f79-4e78-96c6-713de1299f82', 5, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('75cfe2f5-3e7c-4e3e-859d-22131d74bb28', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '17b9e0bb-5f79-4e78-96c6-713de1299f82', 6, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('164ff6a1-3f87-4ac4-bb8c-9f267ab6934e', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'bc68cd0b-eeaa-459d-8b92-5a9d9f4fff6b', 1, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('6d7fcb55-71cd-46b5-b6c1-478320bc4109', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'bc68cd0b-eeaa-459d-8b92-5a9d9f4fff6b', 2, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('a011a2ec-a4d4-4bee-9988-a92691d8cbbe', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'bc68cd0b-eeaa-459d-8b92-5a9d9f4fff6b', 3, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('5136f5b9-d50f-4d13-b284-d4d69a66e3e0', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'bc68cd0b-eeaa-459d-8b92-5a9d9f4fff6b', 4, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('327df1db-72ac-45d6-bdfb-efca3009fc3e', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'bc68cd0b-eeaa-459d-8b92-5a9d9f4fff6b', 5, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('d311466a-41ce-45c2-aa6d-eaf3485307b4', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'bc68cd0b-eeaa-459d-8b92-5a9d9f4fff6b', 6, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('3a7839d7-a99c-4449-b8e3-c49a8d451322', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'adb422bc-5ee8-4673-840c-cb9712b5910b', 1, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('085707eb-0774-43eb-884d-8f3e6ada55d9', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'adb422bc-5ee8-4673-840c-cb9712b5910b', 2, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('ccd1e102-49b3-41b5-b0a2-8b0a9f1eadb8', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'adb422bc-5ee8-4673-840c-cb9712b5910b', 3, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('75b1c94d-36fa-4cee-bc75-1700bfcd07bb', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'adb422bc-5ee8-4673-840c-cb9712b5910b', 4, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('c9c261f2-252b-40b7-9546-d3536edae4b6', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'adb422bc-5ee8-4673-840c-cb9712b5910b', 5, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('b2b94aca-5330-4df4-aaeb-3d7420b92847', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'adb422bc-5ee8-4673-840c-cb9712b5910b', 6, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('bccac7e8-7585-4257-9f84-16763bbb1069', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '55667c6e-14ed-4174-bc2b-d6b49a4ddb01', 1, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('617c256a-5347-42fa-9758-bad616c6faa3', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '55667c6e-14ed-4174-bc2b-d6b49a4ddb01', 2, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('77005642-4cb9-474d-819d-994c5c9b0c6f', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '55667c6e-14ed-4174-bc2b-d6b49a4ddb01', 3, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('fb0bbc0b-2211-4707-9a73-fcdd229638f0', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '55667c6e-14ed-4174-bc2b-d6b49a4ddb01', 4, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('fff39f1a-57d6-4106-8510-80db6e14e6c3', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '55667c6e-14ed-4174-bc2b-d6b49a4ddb01', 5, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('22f9f702-7691-4bb0-bb30-9d8d99051860', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '55667c6e-14ed-4174-bc2b-d6b49a4ddb01', 6, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('a6e6698e-fcf1-4a90-b834-2229dbb81555', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '5dc681b5-3dde-4441-a664-8bda76b03a76', 1, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('217b553e-3363-47af-b7e0-5d1f11b7e445', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '5dc681b5-3dde-4441-a664-8bda76b03a76', 2, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('7726bf30-f678-4008-b9ad-e7d3b8eba72c', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '5dc681b5-3dde-4441-a664-8bda76b03a76', 3, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('b27e09eb-6be4-40ec-8021-675d8e7d4373', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '5dc681b5-3dde-4441-a664-8bda76b03a76', 4, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('52e78dcf-d18f-43aa-9e75-23b4ac8554a4', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '5dc681b5-3dde-4441-a664-8bda76b03a76', 5, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('73e96630-ad27-4bc7-8017-4534e573b752', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', '5dc681b5-3dde-4441-a664-8bda76b03a76', 6, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('3640ef0c-c178-412f-8087-9a6792f57e93', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'b3ffb0d8-7429-49b5-9d13-1e156f5f0c52', 1, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('574cd7bb-4bd3-4e94-8fd6-c0395c4cc9dd', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'b3ffb0d8-7429-49b5-9d13-1e156f5f0c52', 2, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('becaf614-9f09-4b8e-95f8-af0a10786408', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'b3ffb0d8-7429-49b5-9d13-1e156f5f0c52', 3, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('386acee6-2fa4-4d16-8e36-3e016bcd8743', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'b3ffb0d8-7429-49b5-9d13-1e156f5f0c52', 4, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('1c2a19ae-f472-4205-b71b-f7eaf04b94c4', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'b3ffb0d8-7429-49b5-9d13-1e156f5f0c52', 5, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('55455a73-9ca1-4ce4-818f-0bcbbb3ca683', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'b3ffb0d8-7429-49b5-9d13-1e156f5f0c52', 6, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('02d88afc-9e85-408e-b27e-551780f38fb1', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'a432e703-809f-43fe-9874-ec034b4934ff', 1, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('8d3e1342-6091-4b19-9fad-9b7407071b81', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'a432e703-809f-43fe-9874-ec034b4934ff', 2, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('bd7f8436-ea6f-4272-991a-db2b2ccc4622', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'a432e703-809f-43fe-9874-ec034b4934ff', 3, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('298a6369-afb1-43a7-a42e-190f967ba223', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'a432e703-809f-43fe-9874-ec034b4934ff', 4, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('ff5f6b43-9cac-41ad-be5f-615d9567a29b', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'a432e703-809f-43fe-9874-ec034b4934ff', 5, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('1623c421-7c86-4b83-b43a-aa702f3bd539', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'a432e703-809f-43fe-9874-ec034b4934ff', 6, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('8d884a25-4453-4a83-9100-542da3801c13', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'd2ac697a-c4ec-410f-8064-b88220743a26', 1, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('4c670be5-f9fc-4755-bcaf-d608ab2cba04', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'd2ac697a-c4ec-410f-8064-b88220743a26', 2, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('8976aa3a-8e68-463f-9f9c-97606d470740', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'd2ac697a-c4ec-410f-8064-b88220743a26', 3, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('c987af87-652f-4156-8ded-a90380aeaeec', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'd2ac697a-c4ec-410f-8064-b88220743a26', 4, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('8709f6a3-d2c7-4a74-806c-cc7702549237', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'd2ac697a-c4ec-410f-8064-b88220743a26', 5, '09:00:00', '17:00:00', 15, true);
INSERT INTO nita.doctor_availabilities ("id", "created_at", "updated_at", "doctor_id", "day_of_week", "start_time", "end_time", "slot_duration", "is_active") VALUES ('b3b4d514-a784-4189-b7a5-bc0beb41210a', '2026-08-05T06:54:54.577Z', '2026-08-05T06:54:54.577Z', 'd2ac697a-c4ec-410f-8064-b88220743a26', 6, '09:00:00', '17:00:00', 15, true);

-- Table: nita.doctor_leaves
CREATE TABLE IF NOT EXISTS nita.doctor_leaves (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "doctor_id" uuid NOT NULL,
  "start_date" date NOT NULL,
  "end_date" date NOT NULL,
  "reason" text
);

ALTER TABLE nita.doctor_leaves ADD CONSTRAINT "doctor_leaves_pkey" PRIMARY KEY ("id");

ALTER TABLE nita.doctor_leaves ADD CONSTRAINT "FK_d9896f0becfc0dba8b724c5459b" FOREIGN KEY ("doctor_id") REFERENCES nita.doctors ("id") ON DELETE CASCADE;

-- (no rows for nita.doctor_leaves)

-- Table: nita.enquiries
CREATE TABLE IF NOT EXISTS nita.enquiries (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "type" nita.enquiries_type_enum NOT NULL DEFAULT 'general'::nita.enquiries_type_enum,
  "name" character varying NOT NULL,
  "email" character varying NOT NULL,
  "phone" character varying,
  "subject" character varying NOT NULL,
  "message" text NOT NULL,
  "status" nita.enquiries_status_enum NOT NULL DEFAULT 'new'::nita.enquiries_status_enum,
  "assigned_to" uuid,
  "response" text,
  "responded_at" timestamp without time zone
);

ALTER TABLE nita.enquiries ADD CONSTRAINT "enquiries_pkey" PRIMARY KEY ("id");

ALTER TABLE nita.enquiries ADD CONSTRAINT "FK_7cd8ff13ddd8446af7dd4eb5da1" FOREIGN KEY ("assigned_to") REFERENCES nita.users ("id");

-- Data for nita.enquiries (9 rows)
INSERT INTO nita.enquiries ("id", "created_at", "updated_at", "type", "name", "email", "phone", "subject", "message", "status", "assigned_to", "response", "responded_at") VALUES ('ebf621bb-3484-40c7-bbe7-65c9a75e849b', '2026-08-04T18:40:51.217Z', '2026-08-04T18:40:51.217Z', 'services', 'Test Patient', 'home-visit-test@example.com', '9841234567', 'Home visit booking — Doctor home visit', 'Service: Doctor home visit
Address: Kathmandu
Preferred date: 2026-08-10', 'new', NULL, NULL, NULL);
INSERT INTO nita.enquiries ("id", "created_at", "updated_at", "type", "name", "email", "phone", "subject", "message", "status", "assigned_to", "response", "responded_at") VALUES ('9fd01837-24ff-4da2-96dd-4426225e7a8a', '2026-08-04T18:46:39.067Z', '2026-08-04T18:46:39.067Z', 'services', 'Home Visit Patient', 'hv-1@example.com', '9841000000', 'Home visit booking — Lab sample collection at home', 'Service: Lab sample collection at home
Address: Baluwatar, Kathmandu
Preferred date: 2026-08-08
Notes: Please arrive before 10am', 'new', NULL, NULL, NULL);
INSERT INTO nita.enquiries ("id", "created_at", "updated_at", "type", "name", "email", "phone", "subject", "message", "status", "assigned_to", "response", "responded_at") VALUES ('6c9bc03c-4120-4950-82b1-de880864c25d', '2026-08-04T18:46:41.135Z', '2026-08-04T18:46:41.135Z', 'services', 'Tele-consult Patient', 'tc-1@example.com', '9842000000', 'Online consultation booking — Cardiology (Extended consultation (30 min))', 'Specialty: Cardiology
Plan: Extended consultation (30 min)
Preferred date: 2026-08-09', 'new', NULL, NULL, NULL);
INSERT INTO nita.enquiries ("id", "created_at", "updated_at", "type", "name", "email", "phone", "subject", "message", "status", "assigned_to", "response", "responded_at") VALUES ('d21ee1c0-d323-44ff-8a51-f66196b9a5a6', '2026-08-05T02:33:55.396Z', '2026-08-05T02:33:55.396Z', 'services', 'Smoke Test HV', 'smoke-test-hv@example.com', '9800000014', 'Home visit request', 'Please arrange a home visit for sample collection', 'new', NULL, NULL, NULL);
INSERT INTO nita.enquiries ("id", "created_at", "updated_at", "type", "name", "email", "phone", "subject", "message", "status", "assigned_to", "response", "responded_at") VALUES ('3414de01-0c5f-46de-a45a-91fe7438bb8b', '2026-08-05T02:33:55.660Z', '2026-08-05T02:33:55.660Z', 'services', 'Smoke Test OC', 'smoke-test-oc@example.com', '9800000015', 'Online consult request', 'Please arrange a video consultation', 'new', NULL, NULL, NULL);
INSERT INTO nita.enquiries ("id", "created_at", "updated_at", "type", "name", "email", "phone", "subject", "message", "status", "assigned_to", "response", "responded_at") VALUES ('b683a063-5428-419c-9989-f67e97859b49', '2026-08-05T02:33:55.911Z', '2026-08-05T02:33:55.911Z', 'services', 'Smoke Test Vax', 'smoke-test-vax@example.com', '9800000016', 'TT vaccine request', 'I need Tetanus vaccine', 'new', NULL, NULL, NULL);
INSERT INTO nita.enquiries ("id", "created_at", "updated_at", "type", "name", "email", "phone", "subject", "message", "status", "assigned_to", "response", "responded_at") VALUES ('fac238e2-1769-47aa-a65e-9aa6630dac53', '2026-08-05T03:03:35.260Z', '2026-08-05T03:03:35.260Z', 'services', 'Audit User 455515', 'audit-enq-455515@test.com', '98455515', 'Audit - home visit', 'Audit test home visit enquiry', 'new', NULL, NULL, NULL);
INSERT INTO nita.enquiries ("id", "created_at", "updated_at", "type", "name", "email", "phone", "subject", "message", "status", "assigned_to", "response", "responded_at") VALUES ('f8e6efb4-a2d9-4f94-bc28-adca6008dfd9', '2026-08-05T03:03:35.525Z', '2026-08-05T03:03:35.525Z', 'services', 'Audit OC 455515', 'audit-oc-455515@test.com', '98455515', 'Audit - online consult', 'Audit test online consult enquiry', 'new', NULL, NULL, NULL);
INSERT INTO nita.enquiries ("id", "created_at", "updated_at", "type", "name", "email", "phone", "subject", "message", "status", "assigned_to", "response", "responded_at") VALUES ('738b6c58-ab4e-486f-9ac2-a4a945bfee70', '2026-08-05T03:03:35.777Z', '2026-08-05T03:08:46.833Z', 'services', 'Audit Vax 455515', 'audit-vax-455515@test.com', '98455515', 'Audit - TT vaccine', 'Audit test vaccination enquiry', 'resolved', NULL, 'Audit reply via PATCH', '2026-08-05T03:08:46.832Z');

-- Table: nita.health_card_applications
CREATE TABLE IF NOT EXISTS nita.health_card_applications (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "holderType" nita.health_card_applications_holdertype_enum NOT NULL,
  "fullName" character varying NOT NULL,
  "phone" character varying NOT NULL,
  "email" character varying,
  "organization" character varying,
  "nmcRegistrationId" character varying,
  "relationWithDoctor" character varying,
  "status" nita.health_card_applications_status_enum NOT NULL DEFAULT 'pending'::nita.health_card_applications_status_enum,
  "rejectionReason" character varying,
  "cardNumber" character varying,
  "validUntil" date,
  "approvedBy" character varying,
  "is_collected" boolean NOT NULL DEFAULT false,
  "collected_at" timestamp without time zone,
  "collection_verified_by" character varying,
  "collection_otp" character varying,
  "document_type" nita.health_card_applications_document_type_enum,
  "document_number" character varying,
  "document_file_name" character varying,
  "document_path" character varying,
  "document_mime_type" character varying,
  "document_size_bytes" integer
);

ALTER TABLE nita.health_card_applications ADD CONSTRAINT "health_card_applications_pkey" PRIMARY KEY ("id");

-- Data for nita.health_card_applications (7 rows)
INSERT INTO nita.health_card_applications ("id", "created_at", "updated_at", "holderType", "fullName", "phone", "email", "organization", "nmcRegistrationId", "relationWithDoctor", "status", "rejectionReason", "cardNumber", "validUntil", "approvedBy", "is_collected", "collected_at", "collection_verified_by", "collection_otp", "document_type", "document_number", "document_file_name", "document_path", "document_mime_type", "document_size_bytes") VALUES ('4af7ac5e-62e5-4790-8f2f-76175f39b174', '2026-08-04T18:39:24.677Z', '2026-08-04T18:39:24.677Z', 'general_public', 'Test Citizen', '9841234567', 'test.citizen@example.com', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, 'citizenship', 'CIT-12345', 'citizenship.png', '/uploads/health-card-docs/1785868764528-28e92abc-citizenship.png', 'image/png', 69);
INSERT INTO nita.health_card_applications ("id", "created_at", "updated_at", "holderType", "fullName", "phone", "email", "organization", "nmcRegistrationId", "relationWithDoctor", "status", "rejectionReason", "cardNumber", "validUntil", "approvedBy", "is_collected", "collected_at", "collection_verified_by", "collection_otp", "document_type", "document_number", "document_file_name", "document_path", "document_mime_type", "document_size_bytes") VALUES ('634c5b2a-376f-459a-88b9-38211159ae3e', '2026-08-04T18:46:19.606Z', '2026-08-04T18:46:19.606Z', 'doctor', 'Dr. Final Test', '9841999999', 'final.test@example.com', NULL, 'NMC-99999', NULL, 'pending', NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, 'passport', 'P-99999', 'passport.png', '/uploads/health-card-docs/1785869179526-31f61fd1-passport.png', 'image/png', 69);
INSERT INTO nita.health_card_applications ("id", "created_at", "updated_at", "holderType", "fullName", "phone", "email", "organization", "nmcRegistrationId", "relationWithDoctor", "status", "rejectionReason", "cardNumber", "validUntil", "approvedBy", "is_collected", "collected_at", "collection_verified_by", "collection_otp", "document_type", "document_number", "document_file_name", "document_path", "document_mime_type", "document_size_bytes") VALUES ('f63fcc39-c4f5-41d2-a83e-e68d188480f5', '2026-08-04T21:16:31.349Z', '2026-08-04T21:16:31.349Z', 'partner_staff', 'Smoke Test User', '+9779800000099', 'smoke2.hc@example.com', 'Smoke Org', NULL, NULL, 'pending', NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO nita.health_card_applications ("id", "created_at", "updated_at", "holderType", "fullName", "phone", "email", "organization", "nmcRegistrationId", "relationWithDoctor", "status", "rejectionReason", "cardNumber", "validUntil", "approvedBy", "is_collected", "collected_at", "collection_verified_by", "collection_otp", "document_type", "document_number", "document_file_name", "document_path", "document_mime_type", "document_size_bytes") VALUES ('95674c2c-f51c-45ea-8ca6-5e4fc7aa9346', '2026-08-05T02:32:27.549Z', '2026-08-05T02:32:27.549Z', 'general_public', 'Smoke Test User', '9800000002', 'smoke-test-2@example.com', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, 'citizenship', '12-34-56-78901', NULL, NULL, NULL, NULL);
INSERT INTO nita.health_card_applications ("id", "created_at", "updated_at", "holderType", "fullName", "phone", "email", "organization", "nmcRegistrationId", "relationWithDoctor", "status", "rejectionReason", "cardNumber", "validUntil", "approvedBy", "is_collected", "collected_at", "collection_verified_by", "collection_otp", "document_type", "document_number", "document_file_name", "document_path", "document_mime_type", "document_size_bytes") VALUES ('3e42ec67-f6b7-4222-839c-4e505a8eb4e6', '2026-08-05T03:04:31.816Z', '2026-08-05T03:04:31.816Z', 'doctor', 'Dr. Audit 266955', '98266955', 'audit-doc-266955@test.com', NULL, 'NMC-266955', NULL, 'pending', NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, 'nmc_registration', 'NMC-266955', NULL, NULL, NULL, NULL);
INSERT INTO nita.health_card_applications ("id", "created_at", "updated_at", "holderType", "fullName", "phone", "email", "organization", "nmcRegistrationId", "relationWithDoctor", "status", "rejectionReason", "cardNumber", "validUntil", "approvedBy", "is_collected", "collected_at", "collection_verified_by", "collection_otp", "document_type", "document_number", "document_file_name", "document_path", "document_mime_type", "document_size_bytes") VALUES ('9a7c59fa-df0f-4788-8051-839bec7acb63', '2026-08-05T03:05:34.291Z', '2026-08-05T03:08:47.429Z', 'doctor', 'Dr. DocUpload 199376', '98199376', 'audit-doc-199376@test.com', NULL, 'NMC-199376', NULL, 'approved', NULL, 'NC-2026-10436', '2027-08-04T18:15:00.000Z', 'Nita Admin', false, NULL, NULL, '$2a$10$mgWld5oQrL8kCtKNSAAWyu19Cyg8BWSpLb3fUTviNESbxEy2M.gV2', 'nmc_registration', 'NMC-199376', 'test-doc.png', '/uploads/health-card-docs/1785899134198-1f8d8f20-test-doc.png', 'image/png', 67);
INSERT INTO nita.health_card_applications ("id", "created_at", "updated_at", "holderType", "fullName", "phone", "email", "organization", "nmcRegistrationId", "relationWithDoctor", "status", "rejectionReason", "cardNumber", "validUntil", "approvedBy", "is_collected", "collected_at", "collection_verified_by", "collection_otp", "document_type", "document_number", "document_file_name", "document_path", "document_mime_type", "document_size_bytes") VALUES ('694242bf-c972-4730-8a03-2263f3e989e1', '2026-08-05T06:55:49.282Z', '2026-08-05T06:56:55.791Z', 'general_public', 'Verify Patient Test', '+9779812345678', 'verify-20260805123105@nitatest.com', NULL, NULL, NULL, 'approved', NULL, 'NC-2026-84679', '2027-08-04T18:15:00.000Z', 'Nita Admin', false, NULL, NULL, NULL, 'citizenship', 'CIT-12345-67', NULL, NULL, NULL, NULL);

-- Table: nita.health_card_categories
CREATE TABLE IF NOT EXISTS nita.health_card_categories (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "name" character varying NOT NULL,
  "type" nita.health_card_categories_type_enum NOT NULL DEFAULT 'general_public'::nita.health_card_categories_type_enum,
  "opd_discount" character varying,
  "lab_discount" character varying,
  "medicine_discount" character varying,
  "queue_benefit" text,
  "summary" text,
  "notes" text,
  "image" character varying,
  "price" numeric(10,2),
  "total_cards" integer NOT NULL DEFAULT 0,
  "issued_cards" integer NOT NULL DEFAULT 0,
  "is_active" boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0
);

ALTER TABLE nita.health_card_categories ADD CONSTRAINT "health_card_categories_pkey" PRIMARY KEY ("id");

-- Data for nita.health_card_categories (4 rows)
INSERT INTO nita.health_card_categories ("id", "created_at", "updated_at", "name", "type", "opd_discount", "lab_discount", "medicine_discount", "queue_benefit", "summary", "notes", "image", "price", "total_cards", "issued_cards", "is_active", "order") VALUES ('7ca2ed11-26c8-48ac-84ac-2f01bcd224fa', '2026-08-04T18:19:11.245Z', '2026-08-04T18:19:11.245Z', 'For Doctors (Any Specialty)', 'licensed_doctors', '100% off', '50% off', '10% off', 'Priority queue + Free OPD', 'Exclusive tier for licensed medical doctors from any specialty.', 'Valid for the cardholder only. Requires Nepal Medical Council (NMC) registration proof at enrolment. Benefits: 100% off OPD consultation, 50% off all laboratory tests, 10% off pharmacy.', NULL, NULL, 0, 0, true, 1);
INSERT INTO nita.health_card_categories ("id", "created_at", "updated_at", "name", "type", "opd_discount", "lab_discount", "medicine_discount", "queue_benefit", "summary", "notes", "image", "price", "total_cards", "issued_cards", "is_active", "order") VALUES ('47c107de-3e17-4561-b717-348662c14299', '2026-08-04T18:19:11.245Z', '2026-08-04T18:19:11.245Z', 'For Doctors'' Family Members', 'family', '50% off', '35% off', '10% off', 'Priority queue', 'Covers spouse, parents and children of licensed doctors.', 'Eligible dependents: spouse, parents and children of a licensed doctor. Benefits: 50% off OPD consultation, 35% off all laboratory tests, 10% off pharmacy.', NULL, NULL, 0, 0, true, 2);
INSERT INTO nita.health_card_categories ("id", "created_at", "updated_at", "name", "type", "opd_discount", "lab_discount", "medicine_discount", "queue_benefit", "summary", "notes", "image", "price", "total_cards", "issued_cards", "is_active", "order") VALUES ('27dc7a65-d5ca-4e7b-add3-8d07aa683fe1', '2026-08-04T18:19:11.245Z', '2026-08-04T18:19:11.245Z', 'For Partner Organisation Staff', 'partner_staff', '100% off', '50% off', '10% off', 'Priority queue + Free OPD', 'For permanent staff and their immediate family of Nita Clinics partner organisations.', 'Eligible: permanent staff of Engineering Nita, Him River Power, SN Energy Ltd, and other Nita Clinics partner organisations. Same benefits as the Doctors tier (100% OPD, 50% labs, 10% pharmacy). Valid ID from the partner organisation required at enrolment.', NULL, NULL, 0, 0, true, 3);
INSERT INTO nita.health_card_categories ("id", "created_at", "updated_at", "name", "type", "opd_discount", "lab_discount", "medicine_discount", "queue_benefit", "summary", "notes", "image", "price", "total_cards", "issued_cards", "is_active", "order") VALUES ('c9906e64-bb9b-4d78-ab37-4dd65c65c507', '2026-08-04T18:19:11.245Z', '2026-08-04T18:19:11.245Z', 'For General Public', 'general_public', '20% off', '20% off', '10% off', 'Standard queue', 'Open tier for everyone — affordable preventive care for the whole family.', 'Available to all. Benefits: 20% off OPD consultation and 20% off all laboratory tests. No pharmacy discount on this tier.', NULL, NULL, 0, 0, true, 4);

-- Table: nita.patients
CREATE TABLE IF NOT EXISTS nita.patients (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "user_id" uuid,
  "full_name" character varying NOT NULL,
  "email" character varying NOT NULL,
  "phone" character varying NOT NULL,
  "date_of_birth" date,
  "gender" nita.patients_gender_enum,
  "blood_group" nita.patients_blood_group_enum,
  "address" text,
  "city" character varying,
  "emergency_contact_name" character varying,
  "emergency_contact_phone" character varying,
  "medical_history" text,
  "allergies" text,
  "is_active" boolean NOT NULL DEFAULT true
);

ALTER TABLE nita.patients ADD CONSTRAINT "patients_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "REL_7fe1518dc780fd777669b5cb7a" ON nita.patients ("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_64e2031265399f5690b0beba6a5" ON nita.patients ("email");

ALTER TABLE nita.patients ADD CONSTRAINT "FK_7fe1518dc780fd777669b5cb7a0" FOREIGN KEY ("user_id") REFERENCES nita.users ("id") ON DELETE SET NULL;

-- Data for nita.patients (6 rows)
INSERT INTO nita.patients ("id", "created_at", "updated_at", "user_id", "full_name", "email", "phone", "date_of_birth", "gender", "blood_group", "address", "city", "emergency_contact_name", "emergency_contact_phone", "medical_history", "allergies", "is_active") VALUES ('0999d58a-babc-41e8-8e55-75ac78eb2063', '2026-08-04T21:17:54.095Z', '2026-08-04T21:17:54.095Z', 'ca2dea8f-477a-4411-89b3-37acd1691188', 'Smoke Test', 'smoke.p3@example.com', '+9779812345678', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO nita.patients ("id", "created_at", "updated_at", "user_id", "full_name", "email", "phone", "date_of_birth", "gender", "blood_group", "address", "city", "emergency_contact_name", "emergency_contact_phone", "medical_history", "allergies", "is_active") VALUES ('3217cb90-750c-41ff-b557-c8bd087a8d88', '2026-08-05T02:32:33.807Z', '2026-08-05T02:32:33.807Z', '1e07d6c2-e9ab-46ec-9f01-9ff533f8bcc7', 'Smoke Test User 5', 'smoke-test-5@example.com', '9800000005', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO nita.patients ("id", "created_at", "updated_at", "user_id", "full_name", "email", "phone", "date_of_birth", "gender", "blood_group", "address", "city", "emergency_contact_name", "emergency_contact_phone", "medical_history", "allergies", "is_active") VALUES ('999d9034-71f3-4cc9-9a95-8a6a05b3d77c', '2026-08-05T03:04:32.197Z', '2026-08-05T03:04:32.197Z', 'bdb12f5c-ddbc-4853-af08-e36759b67a7f', 'Audit Full 266955', 'audit-full-266955@test.com', '98266955', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO nita.patients ("id", "created_at", "updated_at", "user_id", "full_name", "email", "phone", "date_of_birth", "gender", "blood_group", "address", "city", "emergency_contact_name", "emergency_contact_phone", "medical_history", "allergies", "is_active") VALUES ('faf33d04-0afb-4373-83f7-86458307828a', '2026-08-05T06:46:05.767Z', '2026-08-05T06:46:05.767Z', 'ea88f687-5a5a-4085-8362-4baa2d348fd8', 'Verify Patient 20260805123105', 'verify-20260805123105@nitatest.com', '+9779812345678', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO nita.patients ("id", "created_at", "updated_at", "user_id", "full_name", "email", "phone", "date_of_birth", "gender", "blood_group", "address", "city", "emergency_contact_name", "emergency_contact_phone", "medical_history", "allergies", "is_active") VALUES ('ab6c41ef-7d7e-4aa1-8897-0f92c83bd354', '2026-08-05T03:00:15.277Z', '2026-08-05T06:56:56.467Z', '5cba6c52-ba43-4584-a576-5c733b082047', 'Audit Patient 717934', 'audit-717934@nita-test.com', '98717934', NULL, NULL, 'O+', 'Bhimselgola-9, Kathmandu', 'Kathmandu', NULL, NULL, NULL, NULL, true);
INSERT INTO nita.patients ("id", "created_at", "updated_at", "user_id", "full_name", "email", "phone", "date_of_birth", "gender", "blood_group", "address", "city", "emergency_contact_name", "emergency_contact_phone", "medical_history", "allergies", "is_active") VALUES ('1188dbe3-a44a-4367-a3d4-92c10215323a', '2026-08-05T07:53:58.043Z', '2026-08-05T07:53:58.043Z', '0cc8d3ba-0ea5-464f-a6f9-62bc62161a01', 'Test Purpose', 'testing@nitaclinics.com', '99999999', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true);

-- Table: nita.lab_orders
CREATE TABLE IF NOT EXISTS nita.lab_orders (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "order_number" character varying NOT NULL,
  "patient_id" uuid,
  "patient_name" character varying NOT NULL,
  "patient_email" character varying NOT NULL,
  "patient_phone" character varying NOT NULL,
  "status" nita.lab_orders_status_enum NOT NULL DEFAULT 'placed'::nita.lab_orders_status_enum,
  "collection_type" nita.lab_orders_collection_type_enum NOT NULL DEFAULT 'clinic'::nita.lab_orders_collection_type_enum,
  "collection_date" date,
  "collection_time" character varying,
  "total_amount" numeric(10,2) NOT NULL,
  "currency" character varying NOT NULL DEFAULT 'NPR'::character varying,
  "payment_status" nita.lab_orders_payment_status_enum NOT NULL DEFAULT 'unpaid'::nita.lab_orders_payment_status_enum,
  "payment_reference" character varying,
  "notes" text
);

ALTER TABLE nita.lab_orders ADD CONSTRAINT "lab_orders_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_54636afb374c8f12628f4f719f7" ON nita.lab_orders ("order_number");

ALTER TABLE nita.lab_orders ADD CONSTRAINT "FK_b2d20a4e73dd2b139e08db51e8f" FOREIGN KEY ("patient_id") REFERENCES nita.patients ("id") ON DELETE SET NULL;

-- (no rows for nita.lab_orders)

-- Table: nita.home_collections
CREATE TABLE IF NOT EXISTS nita.home_collections (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "order_id" uuid,
  "patient_name" character varying NOT NULL,
  "patient_phone" character varying NOT NULL,
  "patient_email" character varying,
  "address" text NOT NULL,
  "city" character varying,
  "landmark" character varying,
  "preferred_date" date NOT NULL,
  "preferred_time_slot" character varying NOT NULL,
  "assigned_staff_id" character varying,
  "assigned_staff_name" character varying,
  "status" nita.home_collections_status_enum NOT NULL DEFAULT 'requested'::nita.home_collections_status_enum,
  "collection_notes" text,
  "service_charge" numeric(10,2) NOT NULL DEFAULT '0'::numeric,
  "currency" character varying NOT NULL DEFAULT 'NPR'::character varying,
  "completed_at" timestamp without time zone
);

ALTER TABLE nita.home_collections ADD CONSTRAINT "home_collections_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "REL_8f7dc3b124e7decb81baf7704a" ON nita.home_collections ("order_id");

ALTER TABLE nita.home_collections ADD CONSTRAINT "FK_8f7dc3b124e7decb81baf7704a9" FOREIGN KEY ("order_id") REFERENCES nita.lab_orders ("id") ON DELETE SET NULL;

-- Data for nita.home_collections (3 rows)
INSERT INTO nita.home_collections ("id", "created_at", "updated_at", "order_id", "patient_name", "patient_phone", "patient_email", "address", "city", "landmark", "preferred_date", "preferred_time_slot", "assigned_staff_id", "assigned_staff_name", "status", "collection_notes", "service_charge", "currency", "completed_at") VALUES ('81574ce3-ebfc-4355-837d-fa7a422445e5', '2026-08-04T21:18:19.365Z', '2026-08-04T21:18:19.365Z', NULL, 'Smoke Home', '+9779812345678', NULL, 'Smoke Test Address', NULL, NULL, '2026-08-09T18:15:00.000Z', '10:00-12:00', NULL, NULL, 'requested', NULL, '0.00', 'NPR', NULL);
INSERT INTO nita.home_collections ("id", "created_at", "updated_at", "order_id", "patient_name", "patient_phone", "patient_email", "address", "city", "landmark", "preferred_date", "preferred_time_slot", "assigned_staff_id", "assigned_staff_name", "status", "collection_notes", "service_charge", "currency", "completed_at") VALUES ('059bfe3e-7da3-4505-aa46-e80b56da4ae9', '2026-08-05T02:33:39.656Z', '2026-08-05T02:33:39.656Z', NULL, 'Smoke Test User', '9800000010', 'smoke-test-hc@example.com', 'Bhimselgola-9, Test Address', NULL, NULL, '2026-08-09T18:15:00.000Z', 'morning', NULL, NULL, 'requested', 'Sample collection request', '0.00', 'NPR', NULL);
INSERT INTO nita.home_collections ("id", "created_at", "updated_at", "order_id", "patient_name", "patient_phone", "patient_email", "address", "city", "landmark", "preferred_date", "preferred_time_slot", "assigned_staff_id", "assigned_staff_name", "status", "collection_notes", "service_charge", "currency", "completed_at") VALUES ('7db85c2c-8ded-47db-88a5-d953cb5c4a3f', '2026-08-05T03:03:34.717Z', '2026-08-05T03:08:26.092Z', NULL, 'Audit User 455515', '98455515', 'audit-hc-455515@test.com', 'Bhimselgola-9', NULL, NULL, '2026-08-14T18:15:00.000Z', 'morning', NULL, NULL, 'assigned', 'Audit test home collection', '0.00', 'NPR', NULL);

-- Table: nita.lab_order_items
CREATE TABLE IF NOT EXISTS nita.lab_order_items (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "order_id" uuid NOT NULL,
  "test_id" character varying NOT NULL,
  "test_name" character varying NOT NULL,
  "price" numeric(10,2) NOT NULL,
  "status" nita.lab_order_items_status_enum NOT NULL DEFAULT 'pending'::nita.lab_order_items_status_enum,
  "result" text
);

ALTER TABLE nita.lab_order_items ADD CONSTRAINT "lab_order_items_pkey" PRIMARY KEY ("id");

ALTER TABLE nita.lab_order_items ADD CONSTRAINT "FK_9ec251f9ba811b2e24bb0c41a7e" FOREIGN KEY ("order_id") REFERENCES nita.lab_orders ("id") ON DELETE CASCADE;

-- (no rows for nita.lab_order_items)

-- Table: nita.lab_reports
CREATE TABLE IF NOT EXISTS nita.lab_reports (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "order_id" character varying,
  "patient_id" uuid NOT NULL,
  "test_name" character varying NOT NULL,
  "report_file_url" text,
  "report_file_name" character varying,
  "report_date" date NOT NULL,
  "uploaded_by" character varying,
  "verified_by" character varying,
  "is_verified" boolean NOT NULL DEFAULT false,
  "remarks" text,
  "is_visible_to_patient" boolean NOT NULL DEFAULT true
);

ALTER TABLE nita.lab_reports ADD CONSTRAINT "lab_reports_pkey" PRIMARY KEY ("id");

ALTER TABLE nita.lab_reports ADD CONSTRAINT "FK_abcc2ecb1b4c68ae0eebde502e5" FOREIGN KEY ("patient_id") REFERENCES nita.patients ("id") ON DELETE CASCADE;

-- (no rows for nita.lab_reports)

-- Table: nita.lab_test_categories
CREATE TABLE IF NOT EXISTS nita.lab_test_categories (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "name" character varying NOT NULL,
  "slug" character varying NOT NULL,
  "icon" character varying,
  "description" text,
  "color" character varying,
  "image" character varying,
  "is_active" boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0
);

ALTER TABLE nita.lab_test_categories ADD CONSTRAINT "lab_test_categories_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_976ca5f337d92b632db8ebc3e15" ON nita.lab_test_categories ("slug");

-- Data for nita.lab_test_categories (5 rows)
INSERT INTO nita.lab_test_categories ("id", "created_at", "updated_at", "name", "slug", "icon", "description", "color", "image", "is_active", "order") VALUES ('373c1c81-ef96-42e9-988f-04c0a7fa92c3', '2026-08-04T18:18:33.276Z', '2026-08-04T18:18:33.276Z', 'Haematology', 'haematology', '🩸', 'Complete blood count, coagulation and related tests.', '#ef4444', NULL, true, 1);
INSERT INTO nita.lab_test_categories ("id", "created_at", "updated_at", "name", "slug", "icon", "description", "color", "image", "is_active", "order") VALUES ('61d6bacb-4180-4d11-bd32-b0289dc64226', '2026-08-04T18:18:33.276Z', '2026-08-04T18:18:33.276Z', 'Biochemistry', 'biochemistry', '🧪', 'Sugar, kidney, liver, lipid and electrolyte panels.', '#f59e0b', NULL, true, 2);
INSERT INTO nita.lab_test_categories ("id", "created_at", "updated_at", "name", "slug", "icon", "description", "color", "image", "is_active", "order") VALUES ('1dc6b6f0-b343-4165-acdd-574e1934637a', '2026-08-04T18:18:33.276Z', '2026-08-04T18:18:33.276Z', 'Serology', 'serology', '🛡️', 'Antibody, antigen and infectious disease screening.', '#3b82f6', NULL, true, 3);
INSERT INTO nita.lab_test_categories ("id", "created_at", "updated_at", "name", "slug", "icon", "description", "color", "image", "is_active", "order") VALUES ('f097bad5-f6ec-4166-b5c5-c38634567aac', '2026-08-04T18:18:33.276Z', '2026-08-04T18:18:33.276Z', 'Microbiology', 'microbiology', '🔬', 'Smear, stain and culture-based tests.', '#8b5cf6', NULL, true, 4);
INSERT INTO nita.lab_test_categories ("id", "created_at", "updated_at", "name", "slug", "icon", "description", "color", "image", "is_active", "order") VALUES ('28105448-2cd8-4d9b-9391-02ee316b4675', '2026-08-04T18:18:33.276Z', '2026-08-04T18:18:33.276Z', 'Parasitology', 'parasitology', '🧫', 'Urine, stool and body fluid analysis.', '#10b981', NULL, true, 5);

-- Table: nita.lab_tests
CREATE TABLE IF NOT EXISTS nita.lab_tests (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "name" character varying NOT NULL,
  "slug" character varying NOT NULL,
  "category_id" uuid NOT NULL,
  "description" text,
  "long_description" text,
  "price" numeric(10,2) NOT NULL,
  "original_price" numeric(10,2),
  "image" character varying,
  "turnaround" character varying,
  "sample_type" character varying,
  "preparation" character varying,
  "is_popular" boolean NOT NULL DEFAULT false,
  "is_active" boolean NOT NULL DEFAULT true,
  "tags" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "includes" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "order" integer NOT NULL DEFAULT 0
);

ALTER TABLE nita.lab_tests ADD CONSTRAINT "lab_tests_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_655f50c82542f7a3792d4cabc52" ON nita.lab_tests ("slug");

ALTER TABLE nita.lab_tests ADD CONSTRAINT "FK_662fe6bddb4bf7133a3117bbe1c" FOREIGN KEY ("category_id") REFERENCES nita.lab_test_categories ("id") ON DELETE CASCADE;

-- Data for nita.lab_tests (35 rows)
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('45e93e76-a042-4749-93cd-789f0c63e98e', '2026-08-04T18:18:33.287Z', '2026-08-04T18:18:33.287Z', 'CT', 'ct', '373c1c81-ef96-42e9-988f-04c0a7fa92c3', 'Clotting time — coagulation screen.', 'Measures the time it takes for blood to clot, screening coagulation disorders.', '100.00', '150.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 8);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('de74bb35-7165-4a60-a97a-343eb0501c9f', '2026-08-04T18:18:33.287Z', '2026-08-04T18:18:33.287Z', 'BT', 'bt', '373c1c81-ef96-42e9-988f-04c0a7fa92c3', 'Bleeding time — primary haemostasis screen.', 'Assesses how quickly small blood vessels stop bleeding.', '100.00', '150.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 7);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('253c0aa6-66c9-4450-ac96-65db37577fe2', '2026-08-04T18:18:33.287Z', '2026-08-04T18:18:33.287Z', 'ESR', 'esr', '373c1c81-ef96-42e9-988f-04c0a7fa92c3', 'Erythrocyte sedimentation rate — inflammation marker.', 'Detects inflammation by measuring how fast red blood cells settle.', '100.00', '150.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 6);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('ba81fbaf-8100-44ce-aacf-e43bc4ed8a1a', '2026-08-04T18:18:33.287Z', '2026-08-04T18:18:33.287Z', 'PCV / HCT', 'pcv-hct', '373c1c81-ef96-42e9-988f-04c0a7fa92c3', 'Packed cell volume / haematocrit.', 'Measures the proportion of red blood cells in your blood.', '150.00', '200.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 5);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('8ebba427-3735-490b-a1f1-a45a0d04eefa', '2026-08-04T18:18:33.287Z', '2026-08-04T18:18:33.287Z', 'Platelets', 'platelets', '373c1c81-ef96-42e9-988f-04c0a7fa92c3', 'Platelet count — clotting health.', 'Counts platelets to assess bleeding or clotting risk.', '150.00', '200.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 4);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('b931e45f-f2ce-4b4e-bbd9-e83ab2a17d2b', '2026-08-04T18:18:33.287Z', '2026-08-04T18:18:33.287Z', 'DC', 'dc', '373c1c81-ef96-42e9-988f-04c0a7fa92c3', 'Differential leukocyte count — type of WBC.', 'Breaks down the different types of white blood cells to pinpoint specific conditions.', '150.00', '200.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 3);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('e77a29c5-107f-45ae-90c0-2d5ac9e3dedc', '2026-08-04T18:18:33.287Z', '2026-08-04T18:18:33.287Z', 'TC', 'tc', '373c1c81-ef96-42e9-988f-04c0a7fa92c3', 'Total leukocyte count — overall infection screen.', 'Total white blood cell count helps identify infections, inflammation or immune disorders.', '150.00', '200.00', NULL, 'Same day', 'Blood', 'No fasting required', true, true, '[]', '[]', 2);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('c2bce4a6-a75b-4679-a2c3-e765d873b7d5', '2026-08-04T18:18:33.287Z', '2026-08-04T18:18:33.287Z', 'Hb', 'hb', '373c1c81-ef96-42e9-988f-04c0a7fa92c3', 'Haemoglobin level — checks for anaemia.', 'Measures the amount of haemoglobin in your blood to detect anaemia or polycythemia.', '150.00', '200.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 1);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('b3d67fe0-d1a1-44d4-bd73-ab0cb29ca0d5', '2026-08-04T18:18:33.315Z', '2026-08-04T18:18:33.315Z', 'Serum Calcium', 'serum-calcium', '61d6bacb-4180-4d11-bd32-b0289dc64226', 'Blood calcium level.', 'Measures calcium for bone, nerve and muscle function assessment.', '400.00', '500.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 6);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('2d9525fe-4046-4981-9e91-bdea8a73b616', '2026-08-04T18:18:33.315Z', '2026-08-04T18:18:33.315Z', 'Serum Uric Acid', 'serum-uric-acid', '61d6bacb-4180-4d11-bd32-b0289dc64226', 'Uric acid level — gout / kidney function.', 'Detects elevated uric acid associated with gout, kidney stones or renal issues.', '250.00', '350.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 5);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('87217799-2ca9-42be-9b9c-c9bddf443b01', '2026-08-04T18:18:33.315Z', '2026-08-04T18:18:33.315Z', 'Lipid Profile', 'lipid-profile', '61d6bacb-4180-4d11-bd32-b0289dc64226', 'Cholesterol and triglyceride panel — cardiovascular risk.', 'Measures total cholesterol, HDL, LDL and triglycerides for cardiovascular risk.', '850.00', '1100.00', NULL, 'Same day', 'Blood', '12 hrs fasting', true, true, '[]', '[]', 4);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('e78988dd-7e63-4a3c-ac59-a93ef1332146', '2026-08-04T18:18:33.315Z', '2026-08-04T18:18:33.315Z', 'Liver Function Test (LFT)', 'lft', '61d6bacb-4180-4d11-bd32-b0289dc64226', 'Liver enzyme and protein panel.', 'Measures liver enzymes, bilirubin and proteins to assess liver health.', '900.00', '1200.00', NULL, 'Same day', 'Blood', '8-12 hrs fasting', true, true, '[]', '[]', 3);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('837c7cf9-e219-4959-86d0-8d3b68d129bd', '2026-08-04T18:18:33.315Z', '2026-08-04T18:18:33.315Z', 'Renal Function Test (RFT)', 'rft', '61d6bacb-4180-4d11-bd32-b0289dc64226', 'Kidney function panel — urea, creatinine, electrolytes.', 'Evaluates how well your kidneys filter waste, including urea, creatinine and electrolytes.', '850.00', '1100.00', NULL, 'Same day', 'Blood', 'No fasting required', true, true, '[]', '[]', 2);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('5de9a455-f069-4628-96d1-bd606642d8a8', '2026-08-04T18:18:33.315Z', '2026-08-04T18:18:33.315Z', 'Blood Sugar (F / PP / R)', 'blood-sugar', '61d6bacb-4180-4d11-bd32-b0289dc64226', 'Fasting, post-prandial or random glucose — diabetes screen.', 'Measures blood glucose in fasting, post-meal or random state to detect or monitor diabetes.', '100.00', '150.00', NULL, 'Same day', 'Blood', '8-12 hrs fasting for F sample', true, true, '[]', '[]', 1);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('410b62ca-982e-4fc4-8789-fa27e7c2f840', '2026-08-04T18:18:33.329Z', '2026-08-04T18:18:33.329Z', 'Urine R/E', 'urine-re', '1dc6b6f0-b343-4165-acdd-574e1934637a', 'Urine routine and microscopic examination.', 'Chemical and microscopic urine analysis — kidney, urinary tract and metabolic screen.', '100.00', '150.00', NULL, 'Same day', 'Urine', 'Mid-stream clean-catch sample', true, true, '[]', '[]', 13);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('444fb3c9-d8ca-45af-b934-691da509d924', '2026-08-04T18:18:33.329Z', '2026-08-04T18:18:33.329Z', 'MP Ag (Malaria)', 'mp-ag', '1dc6b6f0-b343-4165-acdd-574e1934637a', 'Malaria parasite antigen rapid test.', 'Rapid antigen detection for malaria parasites.', '500.00', '750.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 12);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('549be165-6152-4e2c-8e3c-16a5c2a9cb04', '2026-08-04T18:18:33.329Z', '2026-08-04T18:18:33.329Z', 'H. Pylori Antigen (Stool)', 'h-pylori-antigen', '1dc6b6f0-b343-4165-acdd-574e1934637a', 'Helicobacter pylori antigen in stool.', 'Detects active H. pylori infection associated with gastritis and ulcers.', '800.00', '1100.00', NULL, 'Same day', 'Stool', 'No special preparation', false, true, '[]', '[]', 11);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('b11d6cb4-7726-4eed-ace4-1c73e7d6c9d1', '2026-08-04T18:18:33.329Z', '2026-08-04T18:18:33.329Z', 'Dengue Serology (IgG/IgM, NS1Ag)', 'dengue-serology', '1dc6b6f0-b343-4165-acdd-574e1934637a', 'Dengue fever antibody and antigen panel.', 'Detects dengue NS1 antigen and IgG/IgM antibodies for acute or past infection.', '1300.00', '1700.00', NULL, 'Same day', 'Blood', 'No fasting required', true, true, '[]', '[]', 10);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('70408212-96aa-4c7b-a842-76153de8a8da', '2026-08-04T18:18:33.329Z', '2026-08-04T18:18:33.329Z', 'HCV Rapid Test', 'hcv-rapid', '1dc6b6f0-b343-4165-acdd-574e1934637a', 'Hepatitis C antibody rapid test.', 'Rapid screening for hepatitis C antibodies.', '500.00', '750.00', NULL, 'Same day', 'Blood', 'No fasting required', true, true, '[]', '[]', 9);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('c50cef7c-363a-4628-962d-d093d5fbde69', '2026-08-04T18:18:33.329Z', '2026-08-04T18:18:33.329Z', 'HBsAg Rapid Test', 'hbsag-rapid', '1dc6b6f0-b343-4165-acdd-574e1934637a', 'Hepatitis B surface antigen rapid test.', 'Rapid screening for hepatitis B surface antigen (current infection).', '500.00', '750.00', NULL, 'Same day', 'Blood', 'No fasting required', true, true, '[]', '[]', 8);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('07df8849-1e89-444a-b40a-5c282a942510', '2026-08-04T18:18:33.329Z', '2026-08-04T18:18:33.329Z', 'HIV I & II Rapid Test', 'hiv-rapid', '1dc6b6f0-b343-4165-acdd-574e1934637a', 'HIV 1 and 2 antibody rapid screening.', 'Rapid screening for HIV-1 and HIV-2 antibodies with same-day confidential results.', '500.00', '750.00', NULL, 'Same day', 'Blood', 'No fasting required', true, true, '[]', '[]', 7);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('346fb02b-1e1c-4ba3-9762-4b8c5e11e6f2', '2026-08-04T18:18:33.329Z', '2026-08-04T18:18:33.329Z', 'VDRL', 'vdrl', '1dc6b6f0-b343-4165-acdd-574e1934637a', 'Syphilis screening (non-treponemal).', 'Screening test for syphilis antibodies.', '250.00', '400.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 6);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('bc3e0210-8088-4df1-9a80-1ba78e5b982d', '2026-08-04T18:18:33.329Z', '2026-08-04T18:18:33.329Z', 'Widal Test', 'widal-test', '1dc6b6f0-b343-4165-acdd-574e1934637a', 'Enteric fever (typhoid / paratyphoid) screen.', 'Agglutination test for typhoid and paratyphoid fever antibodies.', '300.00', '450.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 5);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('ba9b29bd-8f80-46e7-b3a8-77a9cb447233', '2026-08-04T18:18:33.329Z', '2026-08-04T18:18:33.329Z', 'ASO', 'aso', '1dc6b6f0-b343-4165-acdd-574e1934637a', 'Anti-streptolysin O — post-strep complications.', 'Detects antibodies from recent streptococcal infection.', '350.00', '500.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 4);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('af46583d-11cb-4796-8cc2-484c11e381e4', '2026-08-04T18:18:33.329Z', '2026-08-04T18:18:33.329Z', 'CRP', 'crp', '1dc6b6f0-b343-4165-acdd-574e1934637a', 'C-reactive protein — acute inflammation.', 'Quantitative CRP to detect and monitor acute inflammation or infection.', '300.00', '450.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 3);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('5edf4e30-3ea0-4154-bfc8-547d5084ec9d', '2026-08-04T18:18:33.329Z', '2026-08-04T18:18:33.329Z', 'RA Factor', 'ra-factor', '1dc6b6f0-b343-4165-acdd-574e1934637a', 'Rheumatoid arthritis screening.', 'Detects rheumatoid factor antibodies associated with rheumatoid arthritis.', '300.00', '450.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 2);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('7d0959f0-8612-446b-944c-574ccf6953ec', '2026-08-04T18:18:33.329Z', '2026-08-04T18:18:33.329Z', 'Blood Grouping & Rh Typing', 'blood-group-rh', '1dc6b6f0-b343-4165-acdd-574e1934637a', 'ABO + Rh blood group determination.', 'Identifies your blood group (A/B/AB/O) and Rh factor for transfusion or pregnancy safety.', '100.00', '150.00', NULL, 'Same day', 'Blood', 'No fasting required', false, true, '[]', '[]', 1);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('1d67d1d8-db91-4b8e-82f7-3dc60710cc83', '2026-08-04T18:18:33.355Z', '2026-08-04T18:18:33.355Z', 'KOH Preparation', 'koh-preparation', 'f097bad5-f6ec-4166-b5c5-c38634567aac', 'Fungal element screen (KOH mount).', 'Potassium hydroxide mount for fungal hyphae and yeast in skin/hair/nail samples.', '200.00', '300.00', NULL, 'Same day', 'Skin/Nail', 'No special preparation', false, true, '[]', '[]', 3);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('e91cb608-963d-447a-a8b4-339cea1de3bd', '2026-08-04T18:18:33.355Z', '2026-08-04T18:18:33.355Z', 'AFB Stain', 'afb-stain', 'f097bad5-f6ec-4166-b5c5-c38634567aac', 'Acid-fast bacilli stain — TB screen.', 'Ziehl-Neelsen stain for detection of acid-fast bacilli (TB and NTM).', '500.00', '700.00', NULL, 'Same day', 'Sputum', 'Early morning sputum preferred', true, true, '[]', '[]', 2);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('fa718368-f0f6-487b-bf56-c0fda507e6d6', '2026-08-04T18:18:33.355Z', '2026-08-04T18:18:33.355Z', 'Gram Stain', 'gram-stain', 'f097bad5-f6ec-4166-b5c5-c38634567aac', 'Bacterial Gram stain — preliminary organism ID.', 'Differential staining to classify bacteria as Gram-positive or Gram-negative.', '250.00', '400.00', NULL, 'Same day', 'Swab/Sample', 'As directed by clinician', false, true, '[]', '[]', 1);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('1724d7e5-4afb-4dee-abbb-d0d0dfa753cf', '2026-08-04T18:18:33.363Z', '2026-08-04T18:18:33.363Z', 'Urine Pregnancy Test', 'urine-pregnancy-test', '28105448-2cd8-4d9b-9391-02ee316b4675', 'Rapid hCG urine pregnancy test.', 'Qualitative hCG detection in urine for early pregnancy confirmation.', '150.00', '250.00', NULL, 'Same day', 'Urine', 'First morning void preferred', true, true, '[]', '[]', 5);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('01ddc27d-2af8-4742-99b1-edac50c980df', '2026-08-04T18:18:33.363Z', '2026-08-04T18:18:33.363Z', 'Semen Analysis', 'semen-analysis', '28105448-2cd8-4d9b-9391-02ee316b4675', 'Semen analysis — fertility workup.', 'Evaluates sperm count, motility and morphology for fertility assessment.', '500.00', '750.00', NULL, 'Same day', 'Semen', '3-5 days abstinence; lab collection', true, true, '[]', '[]', 4);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('c13d7a2e-5684-4f28-8290-2d7886c7555d', '2026-08-04T18:18:33.363Z', '2026-08-04T18:18:33.363Z', 'Reducing Sugar (Urine)', 'reducing-sugar', '28105448-2cd8-4d9b-9391-02ee316b4675', 'Sugar in urine — diabetes monitoring.', 'Detects glucose in urine, used in diabetes monitoring and screening.', '150.00', '250.00', NULL, 'Same day', 'Urine', 'No special preparation', false, true, '[]', '[]', 3);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('7530848a-c36c-4dd5-8bde-50e2d13e445e', '2026-08-04T18:18:33.363Z', '2026-08-04T18:18:33.363Z', 'Occult Blood (Stool)', 'occult-blood', '28105448-2cd8-4d9b-9391-02ee316b4675', 'Hidden blood in stool — GI bleed screen.', 'Detects blood not visible to the naked eye, useful for GI bleed screening.', '250.00', '350.00', NULL, 'Same day', 'Stool', 'No special preparation', false, true, '[]', '[]', 2);
INSERT INTO nita.lab_tests ("id", "created_at", "updated_at", "name", "slug", "category_id", "description", "long_description", "price", "original_price", "image", "turnaround", "sample_type", "preparation", "is_popular", "is_active", "tags", "includes", "order") VALUES ('5c34aaf4-91c0-4135-8e6b-6310ef4d74e2', '2026-08-04T18:18:33.363Z', '2026-08-04T18:18:33.363Z', 'Stool R/E', 'stool-re', '28105448-2cd8-4d9b-9391-02ee316b4675', 'Stool routine and microscopic examination.', 'Detects intestinal parasites, ova, cysts and occult blood in stool.', '110.00', '150.00', NULL, 'Same day', 'Stool', 'Fresh sample in sterile container', false, true, '[]', '[]', 1);

-- Table: nita.media_files
CREATE TABLE IF NOT EXISTS nita.media_files (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "name" character varying NOT NULL,
  "url" character varying NOT NULL,
  "public_id" character varying NOT NULL,
  "type" nita.media_files_type_enum NOT NULL,
  "mime_type" character varying NOT NULL,
  "size" integer NOT NULL,
  "width" integer,
  "height" integer,
  "folder" character varying,
  "alt" character varying,
  "caption" character varying
);

ALTER TABLE nita.media_files ADD CONSTRAINT "media_files_pkey" PRIMARY KEY ("id");

-- (no rows for nita.media_files)

-- Table: nita.page_content
CREATE TABLE IF NOT EXISTS nita.page_content (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "page_slug" character varying NOT NULL,
  "section_key" character varying NOT NULL,
  "content" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "seo" jsonb
);

ALTER TABLE nita.page_content ADD CONSTRAINT "page_content_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_f04e4efd8e1815ddec794e163bb" ON nita.page_content ("page_slug", "section_key");

-- (no rows for nita.page_content)

-- Table: nita.partners
CREATE TABLE IF NOT EXISTS nita.partners (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "name" character varying NOT NULL,
  "logo_url" character varying,
  "alt" character varying,
  "url" character varying NOT NULL,
  "description" text,
  "section" nita.partners_section_enum NOT NULL DEFAULT 'health_card'::nita.partners_section_enum,
  "is_active" boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0
);

ALTER TABLE nita.partners ADD CONSTRAINT "partners_pkey" PRIMARY KEY ("id");

-- (no rows for nita.partners)

-- Table: nita.payment_transactions
CREATE TABLE IF NOT EXISTS nita.payment_transactions (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "reference" character varying NOT NULL,
  "gateway" nita.payment_transactions_gateway_enum NOT NULL,
  "purpose" nita.payment_transactions_purpose_enum NOT NULL DEFAULT 'other'::nita.payment_transactions_purpose_enum,
  "status" nita.payment_transactions_status_enum NOT NULL DEFAULT 'initialized'::nita.payment_transactions_status_enum,
  "amount" numeric(10,2) NOT NULL,
  "currency" character varying NOT NULL DEFAULT 'NPR'::character varying,
  "appointment_id" character varying,
  "package_id" character varying,
  "customer_name" character varying,
  "customer_email" character varying,
  "provider_transaction_id" character varying,
  "provider_reference_id" character varying,
  "request_payload" jsonb,
  "response_payload" jsonb,
  "callback_payload" jsonb,
  "error_message" text,
  "initiated_at" timestamp without time zone,
  "completed_at" timestamp without time zone
);

ALTER TABLE nita.payment_transactions ADD CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_e612d69ed822a1d769e8958608" ON nita.payment_transactions ("reference");

-- (no rows for nita.payment_transactions)

-- Table: nita.services
CREATE TABLE IF NOT EXISTS nita.services (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "name" character varying NOT NULL,
  "slug" character varying NOT NULL,
  "short_description" text NOT NULL,
  "description" text NOT NULL,
  "icon" character varying,
  "image" character varying,
  "gallery" text,
  "department_id" uuid,
  "is_active" boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0
);

ALTER TABLE nita.services ADD CONSTRAINT "services_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_02cf0d0f46e11d22d952f623670" ON nita.services ("slug");

ALTER TABLE nita.services ADD CONSTRAINT "FK_fe8dcab94e4095af071399c6523" FOREIGN KEY ("department_id") REFERENCES nita.departments ("id");

-- (no rows for nita.services)

-- Table: nita.settings
CREATE TABLE IF NOT EXISTS nita.settings (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "key" character varying NOT NULL,
  "value" text NOT NULL,
  "category" character varying,
  "description" text
);

ALTER TABLE nita.settings ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_c8639b7626fa94ba8265628f214" ON nita.settings ("key");

-- Data for nita.settings (1 rows)
INSERT INTO nita.settings ("id", "created_at", "updated_at", "key", "value", "category", "description") VALUES ('6b3f7ac4-adc5-4185-bca0-efaea076007b', '2026-08-05T11:43:15.481Z', '2026-08-05T11:43:15.481Z', 'home_services', '{"badge":"Our Services","heading":"Comprehensive Clinical Services","subheading":"From specialist consultations to lab tests, vaccination, and preventive check-ups, we offer a full range of modern healthcare services for individuals and families.","items":[{"iconKey":"microscope","colorKey":"primary","title":"NITA Labs","desc":"Leading pathology lab offering advanced testing for early disease detection, treatment monitoring, and preventive healthcare.","href":"/services/laboratory","tag":"Lab Tests"},{"iconKey":"female","colorKey":"rose","title":"Women''s Health Clinic","desc":"Comprehensive gynecological care for all ages — from routine check-ups to specialist treatment and prenatal support.","href":"/specialists/gynecology-obstetrics","tag":"Specialists"},{"iconKey":"heartbeat","colorKey":"emerald","title":"Family Medicine & Wellness","desc":"Accurate diagnosis and prevention-focused primary care for your whole family, including chronic disease management.","href":"/checkup","tag":"Check-up"},{"iconKey":"creditCard","colorKey":"sky","title":"NITA Health Card","desc":"Membership benefits for doctors, staff, and partner organizations — including OPD privileges, lab discounts, priority access, and savings on health packages.","href":"/health-card","tag":"Health Card"}]}', 'homepage', 'Home page “Our Services” section (JSON)');

-- Table: nita.subscription_plans
CREATE TABLE IF NOT EXISTS nita.subscription_plans (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "name" character varying NOT NULL,
  "description" text,
  "benefits" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "price" numeric(10,2) NOT NULL DEFAULT '0'::numeric,
  "currency" character varying NOT NULL DEFAULT 'NPR'::character varying,
  "duration_months" integer NOT NULL DEFAULT 12,
  "is_active" boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0
);

ALTER TABLE nita.subscription_plans ADD CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id");

-- (no rows for nita.subscription_plans)

-- Table: nita.subscriptions
CREATE TABLE IF NOT EXISTS nita.subscriptions (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "patient_id" character varying,
  "plan_id" character varying,
  "start_date" timestamp without time zone NOT NULL,
  "end_date" timestamp without time zone NOT NULL,
  "status" character varying NOT NULL DEFAULT 'active'::character varying,
  "price_paid" numeric(10,2),
  "currency" character varying NOT NULL DEFAULT 'NPR'::character varying,
  "payment_reference" character varying,
  "notes" text,
  "auto_renew" boolean NOT NULL DEFAULT false,
  "cancelled_at" timestamp without time zone,
  "cancelled_by" character varying
);

ALTER TABLE nita.subscriptions ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");

-- (no rows for nita.subscriptions)

-- Table: nita.testimonials
CREATE TABLE IF NOT EXISTS nita.testimonials (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "name" character varying NOT NULL,
  "role" character varying NOT NULL,
  "content" text NOT NULL,
  "rating" integer NOT NULL DEFAULT 5,
  "photo" character varying,
  "is_active" boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0
);

ALTER TABLE nita.testimonials ADD CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id");

-- (no rows for nita.testimonials)

-- Table: nita.vaccines
CREATE TABLE IF NOT EXISTS nita.vaccines (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp without time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp without time zone NOT NULL DEFAULT now(),
  "name" character varying NOT NULL,
  "slug" character varying NOT NULL,
  "short_name" character varying,
  "category" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "tagline" character varying,
  "description" text,
  "long_description" text,
  "image" character varying,
  "who_it_is_for" text,
  "schedule" character varying,
  "doses" character varying,
  "protects_against" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "side_effects" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "contraindications" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "notes" text,
  "availability" character varying NOT NULL DEFAULT 'Available in Clinic'::character varying,
  "price_note" character varying,
  "is_active" boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0
);

ALTER TABLE nita.vaccines ADD CONSTRAINT "vaccines_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_2bd33e47bdbe58d692fc5da4058" ON nita.vaccines ("slug");

-- Data for nita.vaccines (3 rows)
INSERT INTO nita.vaccines ("id", "created_at", "updated_at", "name", "slug", "short_name", "category", "tagline", "description", "long_description", "image", "who_it_is_for", "schedule", "doses", "protects_against", "side_effects", "contraindications", "notes", "availability", "price_note", "is_active", "order") VALUES ('32d8cd8e-76d5-4493-8639-710d4e0b1510', '2026-08-04T18:19:11.241Z', '2026-08-04T18:19:11.241Z', 'Tetanus Toxoid (T.T)', 'tetanus-toxoid-tt', NULL, '[]', 'Protect against tetanus — every 10 years', 'Protects against tetanus, a serious bacterial infection caused by Clostridium tetani that enters through wounds.', 'Tetanus is a life-threatening condition caused by toxins produced by Clostridium tetani bacteria, which enter the body through cuts, punctures or wounds. The T.T vaccine provides reliable protection and is especially important during pregnancy to prevent neonatal tetanus.', NULL, 'All adults (booster every 10 years); mandatory during pregnancy', 'Single dose; booster every 10 years; antenatal schedule as advised', '1–2 doses per course', '["Tetanus (lockjaw)","Neonatal tetanus via maternal antibodies"]', '["Mild soreness at injection site","Low-grade fever (rare)"]', '["Severe allergic reaction to a previous dose"]', 'Mild redness and swelling at the injection site are common and usually resolve within 24-48 hours.', 'Available in Clinic', 'NPR 500 per dose (MRP 800)', true, 1);
INSERT INTO nita.vaccines ("id", "created_at", "updated_at", "name", "slug", "short_name", "category", "tagline", "description", "long_description", "image", "who_it_is_for", "schedule", "doses", "protects_against", "side_effects", "contraindications", "notes", "availability", "price_note", "is_active", "order") VALUES ('25a33b04-e9d6-4b9d-9161-f0f1a75e9396', '2026-08-04T18:19:11.241Z', '2026-08-04T18:19:11.241Z', 'Influenza Vaccine', 'influenza-vaccine', NULL, '[]', 'Annual flu protection for the whole family', 'Annual flu shot that protects against the most common seasonal influenza strains.', 'The influenza vaccine is updated each year to match circulating strains. It is the most effective way to prevent severe flu, complications and hospitalisation, especially in pregnant women, children, the elderly and people with chronic conditions.', NULL, 'Everyone 6 months and older; especially pregnant women, elderly, children, healthcare workers, and people with chronic illness', 'Annually, ideally before the start of flu season', '1 dose annually (children under 9 may need 2 doses in first year)', '["Seasonal influenza A (H1N1, H3N2)","Seasonal influenza B"]', '["Mild soreness at injection site","Low-grade fever","Body aches for 1–2 days"]', '["Severe egg allergy (consult clinician)","Previous severe reaction"]', 'Best given in early autumn for full season coverage. Mild flu-like symptoms for a day or two are normal.', 'Available in Clinic', 'NPR 1,500 per dose (MRP 2,200)', true, 2);
INSERT INTO nita.vaccines ("id", "created_at", "updated_at", "name", "slug", "short_name", "category", "tagline", "description", "long_description", "image", "who_it_is_for", "schedule", "doses", "protects_against", "side_effects", "contraindications", "notes", "availability", "price_note", "is_active", "order") VALUES ('b869c8ab-c18c-4820-88e1-07ada01e7282', '2026-08-04T18:19:11.241Z', '2026-08-04T18:19:11.241Z', 'Pneumococcal Vaccine', 'pneumococcal-vaccine', NULL, '[]', 'Protection against pneumonia and pneumococcal disease', 'Protects against pneumococcal disease — pneumonia, meningitis and bloodstream infection.', 'Pneumococcal disease is caused by Streptococcus pneumoniae and is a leading cause of serious illness in young children, older adults and people with chronic conditions. Vaccination dramatically reduces the risk of pneumonia, meningitis and invasive pneumococcal disease.', NULL, 'Children under 2, adults over 65, and high-risk patients (chronic heart/lung/liver disease, diabetes, immunocompromised, smokers)', 'As per national immunisation schedule; one-time dose for adults over 65', '1–2 doses depending on age and risk', '["Pneumonia","Pneumococcal meningitis","Bacteraemia / sepsis"]', '["Mild soreness at injection site","Low-grade fever","Fatigue"]', '["Severe allergic reaction to a previous dose or vaccine component"]', 'A single dose provides years of protection for most adults. Children follow a structured PCV schedule.', 'Available in Clinic', 'NPR 2,500 per dose (MRP 3,500)', true, 3);

-- Done.
