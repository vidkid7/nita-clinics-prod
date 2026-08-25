import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity('vaccines')
export class Vaccine extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'short_name', nullable: true })
  shortName?: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  category: string[];

  @Column({ nullable: true })
  tagline?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'long_description', type: 'text', nullable: true })
  longDescription?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ name: 'who_it_is_for', type: 'text', nullable: true })
  whoItIsFor?: string;

  @Column({ nullable: true })
  schedule?: string;

  @Column({ nullable: true })
  doses?: string;

  @Column({ name: 'protects_against', type: 'jsonb', default: () => "'[]'" })
  protectsAgainst: string[];

  @Column({ name: 'side_effects', type: 'jsonb', default: () => "'[]'" })
  sideEffects: string[];

  @Column({ type: 'jsonb', default: () => "'[]'" })
  contraindications: string[];

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ default: 'Available in Clinic' })
  availability: string;

  @Column({ name: 'price_note', nullable: true })
  priceNote?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;
}
