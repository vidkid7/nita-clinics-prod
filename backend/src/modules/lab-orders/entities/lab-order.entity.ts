import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { LabOrderItem } from './lab-order-item.entity';

export enum LabOrderStatus {
  PLACED = 'placed',
  CONFIRMED = 'confirmed',
  SAMPLE_COLLECTED = 'sample_collected',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum CollectionType {
  CLINIC = 'clinic',
  HOME = 'home',
}

export enum LabOrderPaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

@Entity('lab_orders')
export class LabOrder extends BaseEntity {
  @Column({ name: 'order_number', unique: true })
  orderNumber: string;

  @Column({ name: 'patient_id', nullable: true })
  patientId?: string;

  @ManyToOne(() => Patient, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient;

  @Column({ name: 'patient_name' })
  patientName: string;

  @Column({ name: 'patient_email' })
  patientEmail: string;

  @Column({ name: 'patient_phone' })
  patientPhone: string;

  @Column({ type: 'enum', enum: LabOrderStatus, default: LabOrderStatus.PLACED })
  status: LabOrderStatus;

  @Column({ name: 'collection_type', type: 'enum', enum: CollectionType, default: CollectionType.CLINIC })
  collectionType: CollectionType;

  @Column({ name: 'collection_date', type: 'date', nullable: true })
  collectionDate?: string;

  @Column({ name: 'collection_time', nullable: true })
  collectionTime?: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ default: 'NPR' })
  currency: string;

  @Column({ name: 'payment_status', type: 'enum', enum: LabOrderPaymentStatus, default: LabOrderPaymentStatus.UNPAID })
  paymentStatus: LabOrderPaymentStatus;

  @Column({ name: 'payment_reference', nullable: true })
  paymentReference?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @OneToMany(() => LabOrderItem, (item) => item.order, { cascade: true, eager: true })
  items: LabOrderItem[];
}
