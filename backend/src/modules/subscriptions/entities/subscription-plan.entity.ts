import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity('subscription_plans')
export class SubscriptionPlan extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  benefits: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: 'NPR' })
  currency: string;

  @Column({ name: 'duration_months', type: 'int', default: 12 })
  durationMonths: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;
}
