import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPackageImageAndSubscriptions20260404120000 implements MigrationInterface {
  name = 'AddPackageImageAndSubscriptions20260404120000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add image column to checkup_packages
    await queryRunner.query(`
      ALTER TABLE "checkup_packages"
      ADD COLUMN IF NOT EXISTS "image" character varying;
    `);

    // Create subscription_plans table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "subscription_plans" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying NOT NULL,
        "description" text,
        "benefits" jsonb NOT NULL DEFAULT '[]',
        "price" numeric(10,2) NOT NULL,
        "currency" character varying NOT NULL DEFAULT 'NPR',
        "duration_months" integer NOT NULL DEFAULT 1,
        "is_active" boolean NOT NULL DEFAULT true,
        "order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_subscription_plans" PRIMARY KEY ("id")
      );
    `);

    // Create subscriptions table
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscriptions_status_enum') THEN
          CREATE TYPE "public"."subscriptions_status_enum" AS ENUM(
            'active',
            'expired',
            'cancelled',
            'pending'
          );
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "subscriptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "patient_id" uuid,
        "plan_id" uuid,
        "start_date" date NOT NULL,
        "end_date" date NOT NULL,
        "status" "public"."subscriptions_status_enum" NOT NULL DEFAULT 'active',
        "price_paid" numeric(10,2) NOT NULL DEFAULT 0,
        "currency" character varying NOT NULL DEFAULT 'NPR',
        "payment_reference" character varying,
        "notes" text,
        "auto_renew" boolean NOT NULL DEFAULT false,
        "cancelled_at" TIMESTAMP,
        "cancelled_by" character varying,
        CONSTRAINT "PK_subscriptions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_subscriptions_patient" FOREIGN KEY ("patient_id")
          REFERENCES "patients"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_subscriptions_plan" FOREIGN KEY ("plan_id")
          REFERENCES "subscription_plans"("id") ON DELETE SET NULL
      );
    `);

    // Add endpoints for patient appointments lookup
    await queryRunner.query(`
      ALTER TABLE "appointments"
      ADD COLUMN IF NOT EXISTS "patient_id" uuid;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN IF EXISTS "patient_id";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "subscriptions";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."subscriptions_status_enum";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "subscription_plans";`);
    await queryRunner.query(`ALTER TABLE "checkup_packages" DROP COLUMN IF EXISTS "image";`);
  }
}
