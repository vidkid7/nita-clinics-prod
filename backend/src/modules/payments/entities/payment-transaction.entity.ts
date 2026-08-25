import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

export enum PaymentGatewayName {
  ESEWA = 'esewa',
  KHALTI = 'khalti',
  FONEPAY = 'fonepay',
}

export enum PaymentStatus {
  INITIALIZED = 'initialized',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  VERIFICATION_FAILED = 'verification_failed',
}

export enum PaymentPurpose {
  HEALTH_CARD = 'health_card',
  PACKAGE = 'package',
  APPOINTMENT = 'appointment',
  LAB_TEST = 'lab_test',
  OTHER = 'other',
}

@Entity('payment_transactions')
export class PaymentTransaction extends BaseEntity {
  @Index({ unique: true })
  @Column()
  reference: string;

  @Column({ type: 'enum', enum: PaymentGatewayName })
  gateway: PaymentGatewayName;

  @Column({ type: 'enum', enum: PaymentPurpose, default: PaymentPurpose.OTHER })
  purpose: PaymentPurpose;

  @Index()
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.INITIALIZED })
  status: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'NPR' })
  currency: string;

  @Column({ name: 'appointment_id', nullable: true })
  appointmentId?: string;

  @Column({ name: 'package_id', nullable: true })
  packageId?: string;

  @Column({ name: 'customer_name', nullable: true })
  customerName?: string;

  @Column({ name: 'customer_email', nullable: true })
  customerEmail?: string;

  @Column({ name: 'provider_transaction_id', nullable: true })
  providerTransactionId?: string;

  @Column({ name: 'provider_reference_id', nullable: true })
  providerReferenceId?: string;

  @Column({ name: 'request_payload', type: 'jsonb', nullable: true })
  requestPayload?: Record<string, unknown>;

  @Column({ name: 'response_payload', type: 'jsonb', nullable: true })
  responsePayload?: Record<string, unknown>;

  @Column({ name: 'callback_payload', type: 'jsonb', nullable: true })
  callbackPayload?: Record<string, unknown>;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ name: 'initiated_at', type: 'timestamp', nullable: true })
  initiatedAt?: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt?: Date;
}
