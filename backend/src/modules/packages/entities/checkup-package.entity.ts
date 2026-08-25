import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

export enum CheckupPackageCategory {
  FEMALE_GENERAL = 'female_general',
  FEMALE_PREMIUM = 'female_premium',
  MALE_GENERAL = 'male_general',
  MALE_PREMIUM = 'male_premium',
  TUBERCULOSIS = 'tuberculosis',
  PEDIATRICS = 'pediatrics',
  GYNECOLOGY = 'gynecology',
  ORTHOPEDICS = 'orthopedics',
}

@Entity('checkup_packages')
export class CheckupPackage extends BaseEntity {
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CheckupPackageCategory,
    default: CheckupPackageCategory.FEMALE_GENERAL,
  })
  category: CheckupPackageCategory;

  @Column({ name: 'target_group', nullable: true })
  targetGroup?: string;

  @Column({ name: 'age_label', nullable: true })
  ageLabel?: string;

  @Column({ name: 'original_price', type: 'decimal', precision: 10, scale: 2 })
  originalPrice: number;

  @Column({ name: 'discounted_price', type: 'decimal', precision: 10, scale: 2 })
  discountedPrice: number;

  @Column({ default: 'NPR' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  tests: string[];

  @Column({ name: 'cta_label', nullable: true })
  ctaLabel?: string;

  @Column({ name: 'cta_link', nullable: true })
  ctaLink?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;

  /** When true, the package includes a complimentary doctor consultation. Surfaced as a prominent badge on the package card. */
  @Column({ name: 'free_doctor_consultation', type: 'boolean', default: true })
  freeDoctorConsultation: boolean;
}
