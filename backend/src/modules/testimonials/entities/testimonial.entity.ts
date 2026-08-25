import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity('testimonials')
export class Testimonial extends BaseEntity {
  @Column()
  name: string;

  @Column()
  role: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @Column({ nullable: true })
  photo?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ default: 0 })
  order: number;
}
