import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Department } from '@/modules/departments/entities/department.entity';

@Entity('services')
export class Service extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'short_description', type: 'text' })
  shortDescription: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'simple-array', nullable: true })
  gallery?: string[];

  @Column({ name: 'department_id', nullable: true })
  departmentId?: string;

  @ManyToOne(() => Department, (department) => department.services, { nullable: true })
  @JoinColumn({ name: 'department_id' })
  department?: Department;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ default: 0 })
  order: number;
}
