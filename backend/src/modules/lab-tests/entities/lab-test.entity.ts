import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { LabTestCategory } from './lab-test-category.entity';

@Entity('lab_tests')
export class LabTest extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => LabTestCategory, (cat) => cat.tests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: LabTestCategory;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'long_description', type: 'text', nullable: true })
  longDescription?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'original_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice?: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  turnaround?: string;

  @Column({ name: 'sample_type', nullable: true })
  sampleType?: string;

  @Column({ nullable: true })
  preparation?: string;

  @Column({ name: 'is_popular', default: false })
  isPopular: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  tags: string[];

  @Column({ type: 'jsonb', default: () => "'[]'" })
  includes: string[];

  @Column({ type: 'int', default: 0 })
  order: number;
}
