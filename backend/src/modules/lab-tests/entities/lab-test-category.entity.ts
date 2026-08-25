import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { LabTest } from './lab-test.entity';

@Entity('lab_test_categories')
export class LabTestCategory extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;

  @OneToMany(() => LabTest, (test) => test.category)
  tests: LabTest[];
}
