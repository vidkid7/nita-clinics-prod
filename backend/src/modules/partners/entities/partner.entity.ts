import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

export enum PartnerSection {
  HEALTH_CARD = 'health_card',
  HOMEPAGE = 'homepage',
  FOOTER = 'footer',
}

@Entity('partners')
export class Partner extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl?: string;

  @Column({ nullable: true })
  alt?: string;

  @Column()
  url: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: PartnerSection,
    default: PartnerSection.HEALTH_CARD,
  })
  section: PartnerSection;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;
}
