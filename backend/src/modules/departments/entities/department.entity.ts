import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Doctor } from '@/modules/doctors/entities/doctor.entity';
import { Service } from '@/modules/services/entities/service.entity';

@Entity('departments')
export class Department extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ default: 0 })
  order: number;

  @OneToMany(() => Doctor, (doctor) => doctor.department)
  doctors: Doctor[];

  @OneToMany(() => Service, (service) => service.department)
  services: Service[];
}
