import { MigrationInterface, QueryRunner } from 'typeorm';

export class NitaClinicsDomainUpdates20260402235500 implements MigrationInterface {
  name = 'NitaClinicsDomainUpdates20260402235500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'doctors_staff_type_enum') THEN
          CREATE TYPE "public"."doctors_staff_type_enum" AS ENUM('doctor', 'admin_staff', 'nurse', 'technician');
        END IF;
      END
      $$;
    `);
    await queryRunner.query(`
      ALTER TABLE "doctors"
      ADD COLUMN IF NOT EXISTS "staff_type" "public"."doctors_staff_type_enum" NOT NULL DEFAULT 'doctor'
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'checkup_packages_category_enum') THEN
          CREATE TYPE "public"."checkup_packages_category_enum" AS ENUM(
            'female_general',
            'female_premium',
            'male_general',
            'male_premium',
            'tuberculosis',
            'pediatrics',
            'gynecology'
          );
        END IF;
      END
      $$;
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "checkup_packages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying NOT NULL,
        "category" "public"."checkup_packages_category_enum" NOT NULL DEFAULT 'female_general',
        "target_group" character varying,
        "age_label" character varying,
        "original_price" numeric(10,2) NOT NULL,
        "discounted_price" numeric(10,2) NOT NULL,
        "currency" character varying NOT NULL DEFAULT 'NPR',
        "description" text,
        "tests" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "cta_label" character varying,
        "cta_link" character varying,
        "is_active" boolean NOT NULL DEFAULT true,
        "order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_checkup_packages_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'health_card_categories_type_enum') THEN
          CREATE TYPE "public"."health_card_categories_type_enum" AS ENUM(
            'licensed_doctors',
            'family',
            'partner_staff',
            'general_public'
          );
        END IF;
      END
      $$;
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "health_card_categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying NOT NULL,
        "type" "public"."health_card_categories_type_enum" NOT NULL DEFAULT 'general_public',
        "opd_discount" character varying,
        "lab_discount" character varying,
        "medicine_discount" character varying,
        "queue_benefit" text,
        "summary" text,
        "notes" text,
        "price" numeric(10,2),
        "is_active" boolean NOT NULL DEFAULT true,
        "order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_health_card_categories_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'partners_section_enum') THEN
          CREATE TYPE "public"."partners_section_enum" AS ENUM('health_card', 'homepage', 'footer');
        END IF;
      END
      $$;
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "partners" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying NOT NULL,
        "logo_url" character varying,
        "alt" character varying,
        "url" character varying NOT NULL,
        "description" text,
        "section" "public"."partners_section_enum" NOT NULL DEFAULT 'health_card',
        "is_active" boolean NOT NULL DEFAULT true,
        "order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_partners_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_transactions_gateway_enum') THEN
          CREATE TYPE "public"."payment_transactions_gateway_enum" AS ENUM('esewa', 'khalti', 'fonepay');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_transactions_purpose_enum') THEN
          CREATE TYPE "public"."payment_transactions_purpose_enum" AS ENUM('health_card', 'package', 'appointment', 'other');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_transactions_status_enum') THEN
          CREATE TYPE "public"."payment_transactions_status_enum" AS ENUM(
            'initialized',
            'pending',
            'success',
            'failed',
            'cancelled',
            'expired',
            'verification_failed'
          );
        END IF;
      END
      $$;
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "payment_transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "reference" character varying NOT NULL,
        "gateway" "public"."payment_transactions_gateway_enum" NOT NULL,
        "purpose" "public"."payment_transactions_purpose_enum" NOT NULL DEFAULT 'other',
        "status" "public"."payment_transactions_status_enum" NOT NULL DEFAULT 'initialized',
        "amount" numeric(10,2) NOT NULL,
        "currency" character varying NOT NULL DEFAULT 'NPR',
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
        "initiated_at" TIMESTAMP,
        "completed_at" TIMESTAMP,
        CONSTRAINT "PK_payment_transactions_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_payment_transactions_reference" UNIQUE ("reference")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_payment_transactions_status" ON "payment_transactions" ("status")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_payment_transactions_gateway" ON "payment_transactions" ("gateway")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_payment_transactions_created_at" ON "payment_transactions" ("created_at")
    `);

    await queryRunner.query(`
      INSERT INTO "settings" ("id", "created_at", "updated_at", "key", "value", "category", "description")
      VALUES
        (uuid_generate_v4(), now(), now(), 'payment_esewa_enabled', 'false', 'payment_gateway', 'Enable eSewa gateway'),
        (uuid_generate_v4(), now(), now(), 'payment_khalti_enabled', 'false', 'payment_gateway', 'Enable Khalti gateway'),
        (uuid_generate_v4(), now(), now(), 'payment_fonepay_enabled', 'false', 'payment_gateway', 'Enable Fonepay gateway'),
        (uuid_generate_v4(), now(), now(), 'payment_sandbox_mode', 'true', 'payment_gateway', 'Use sandbox/test mode for payments'),
        (uuid_generate_v4(), now(), now(), 'payment_default_currency', 'NPR', 'payment_gateway', 'Default payment currency')
      ON CONFLICT ("key") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "settings" WHERE "key" IN (
      'payment_esewa_enabled',
      'payment_khalti_enabled',
      'payment_fonepay_enabled',
      'payment_sandbox_mode',
      'payment_default_currency'
    )`);

    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_payment_transactions_created_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_payment_transactions_gateway"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_payment_transactions_status"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payment_transactions"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."payment_transactions_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."payment_transactions_purpose_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."payment_transactions_gateway_enum"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "partners"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."partners_section_enum"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "health_card_categories"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."health_card_categories_type_enum"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "checkup_packages"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."checkup_packages_category_enum"`);

    await queryRunner.query(`ALTER TABLE "doctors" DROP COLUMN IF EXISTS "staff_type"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."doctors_staff_type_enum"`);
  }
}
