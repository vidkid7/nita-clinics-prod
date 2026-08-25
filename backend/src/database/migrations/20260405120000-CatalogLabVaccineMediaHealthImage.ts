import { MigrationInterface, QueryRunner } from 'typeorm';

export class CatalogLabVaccineMediaHealthImage20260405120000 implements MigrationInterface {
  name = 'CatalogLabVaccineMediaHealthImage20260405120000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "lab_test_categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "icon" character varying,
        "description" text,
        "color" character varying,
        "image" character varying,
        "is_active" boolean NOT NULL DEFAULT true,
        "order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "UQ_lab_test_categories_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_lab_test_categories_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "lab_tests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
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
        "order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "UQ_lab_tests_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_lab_tests_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_lab_tests_category" FOREIGN KEY ("category_id") REFERENCES "lab_test_categories"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_lab_tests_category_id" ON "lab_tests" ("category_id")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "vaccines" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
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
        "availability" character varying NOT NULL DEFAULT 'Available in Clinic',
        "price_note" character varying,
        "is_active" boolean NOT NULL DEFAULT true,
        "order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "UQ_vaccines_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_vaccines_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_files_type_enum') THEN
          CREATE TYPE "public"."media_files_type_enum" AS ENUM('image', 'video', 'document');
        END IF;
      END
      $$;
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "media_files" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying NOT NULL,
        "url" character varying NOT NULL,
        "public_id" character varying NOT NULL,
        "type" "public"."media_files_type_enum" NOT NULL,
        "mime_type" character varying NOT NULL,
        "size" integer NOT NULL,
        "width" integer,
        "height" integer,
        "folder" character varying,
        "alt" character varying,
        "caption" character varying,
        CONSTRAINT "PK_media_files_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "health_card_categories"
      ADD COLUMN IF NOT EXISTS "image" character varying
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        ALTER TYPE "public"."payment_transactions_purpose_enum" ADD VALUE 'lab_test';
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "health_card_categories" DROP COLUMN IF EXISTS "image"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "media_files"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "media_files_type_enum"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "lab_tests"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "lab_test_categories"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vaccines"`);
  }
}
