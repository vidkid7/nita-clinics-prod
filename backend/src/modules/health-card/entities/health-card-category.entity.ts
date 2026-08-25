import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

export enum HealthCardCategoryType {
  LICENSED_DOCTORS = 'licensed_doctors',
  FAMILY = 'family',
  PARTNER_STAFF = 'partner_staff',
  GENERAL_PUBLIC = 'general_public',
}

@Entity('health_card_categories')
export class HealthCardCategory extends BaseEntity {
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: HealthCardCategoryType,
    default: HealthCardCategoryType.GENERAL_PUBLIC,
  })
  type: HealthCardCategoryType;

  @Column({ name: 'opd_discount', nullable: true })
  opdDiscount?: string;

  @Column({ name: 'lab_discount', nullable: true })
  labDiscount?: string;

  @Column({ name: 'medicine_discount', nullable: true })
  medicineDiscount?: string;

  @Column({ name: 'queue_benefit', type: 'text', nullable: true })
  queueBenefit?: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  /** Hero / card visual (Cloudinary or any HTTPS URL) */
  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column({ name: 'total_cards', type: 'int', default: 0 })
  totalCards: number;

  @Column({ name: 'issued_cards', type: 'int', default: 0 })
  issuedCards: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;
}
