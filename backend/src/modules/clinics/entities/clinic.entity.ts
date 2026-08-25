import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity('clinics')
export class Clinic extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ name: 'postal_code' })
  postalCode: string;

  @Column()
  country: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ name: 'working_hours', type: 'jsonb', default: [] })
  workingHours: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];

  @Column({ type: 'simple-array', nullable: true })
  services?: string[];

  @Column({ type: 'simple-array', nullable: true })
  images?: string[];

  @Column({ name: 'is_main', default: false })
  isMain: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
