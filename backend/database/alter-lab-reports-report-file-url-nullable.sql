-- Run once on PostgreSQL if lab_reports.report_file_url was NOT NULL and you deploy without TypeORM synchronize.
-- Allows creating a lab report before the PDF URL is available.
ALTER TABLE lab_reports
  ALTER COLUMN report_file_url DROP NOT NULL;
