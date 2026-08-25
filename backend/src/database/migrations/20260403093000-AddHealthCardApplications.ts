import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHealthCardApplications20260403093000 implements MigrationInterface {
  name = 'AddHealthCardApplications20260403093000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'health_card_applications_holder_type_enum') THEN
          CREATE TYPE "public"."health_card_applications_holder_type_enum" AS ENUM(
            'doctor',
            'doctor_family',
            'partner_staff',
            'general_public'
          );
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'health_card_applications_status_enum') THEN
          CREATE TYPE "public"."health_card_applications_status_enum" AS ENUM(
            'pending',
            'approved',
            'rejected'
          );
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "health_card_applications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "holder_type" "public"."health_card_applications_holder_type_enum" NOT NULL,
        "full_name" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "email" character varying,
        "organization" character varying,
        "nmc_registration_id" character varying,
        "relation_with_doctor" character varying,
        "status" "public"."health_card_applications_status_enum" NOT NULL DEFAULT 'pending',
        "rejection_reason" character varying,
        "card_number" character varying,
        "valid_until" date,
        "approved_by" character varying,
        CONSTRAINT "PK_health_card_applications_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "health_card_applications"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."health_card_applications_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."health_card_applications_holder_type_enum"`);
  }
}

