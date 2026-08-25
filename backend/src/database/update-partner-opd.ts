/**
 * One-off migration: update the partner_staff health card tier to 50% off OPD
 * (was 100% off). Updates only the live DB row; safe to re-run.
 *
 * Run: npx ts-node -r tsconfig-paths/register src/database/update-partner-opd.ts
 */
import 'dotenv/config';
import dataSource from '../config/data-source';
import { HealthCardCategory } from '../modules/health-card/entities/health-card-category.entity';
import { HealthCardCategoryType } from '../modules/health-card/entities/health-card-category.entity';

const NEW_VALUES = {
  opdDiscount: '50% off',
  labDiscount: '50% Off lab tests',
  medicineDiscount: '10% Off pharmacy',
  queueBenefit: 'Priority queue',
  summary: 'For permanent staff and their immediate family of Nita Clinic partner organisations.',
  notes:
    'Eligible: permanent staff of Engineering Nita, Him River Power, SN Energy Ltd, and other Nita Clinic partner organisations. 50% off OPD, 50% off labs, 10% off pharmacy. Valid ID from the partner organisation required at enrolment.',
};

async function main() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(HealthCardCategory);
  const row = await repo.findOne({ where: { type: HealthCardCategoryType.PARTNER_STAFF } });
  if (!row) {
    console.error('No partner_staff category found — run the catalog seed first.');
    process.exit(1);
  }
  console.log('Before:', {
    opdDiscount: row.opdDiscount,
    labDiscount: row.labDiscount,
    medicineDiscount: row.medicineDiscount,
    queueBenefit: row.queueBenefit,
  });
  Object.assign(row, NEW_VALUES);
  await repo.save(row);
  const updated = await repo.findOne({ where: { type: HealthCardCategoryType.PARTNER_STAFF } });
  console.log('After:', {
    opdDiscount: updated?.opdDiscount,
    labDiscount: updated?.labDiscount,
    medicineDiscount: updated?.medicineDiscount,
    queueBenefit: updated?.queueBenefit,
  });
  await dataSource.destroy();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
