import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Entity('subscriptions')
export class Subscription extends BaseEntity {
  @Column({ name: 'patient_id', nullable: true })
  patientId?: string;

  @Column({ name: 'plan_id', nullable: true })
  planId?: string;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @Column({
    type: 'varchar',
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({ name: 'price_paid', type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePaid?: number;

  @Column({ default: 'NPR' })
  currency: string;

  @Column({ name: 'payment_reference', nullable: true })
  paymentReference?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'auto_renew', default: false })
  autoRenew: boolean;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ name: 'cancelled_by', nullable: true })
  cancelledBy?: string;
}
