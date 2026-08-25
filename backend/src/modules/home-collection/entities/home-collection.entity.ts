import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { LabOrder } from '../../lab-orders/entities/lab-order.entity';

export enum HomeCollectionStatus {
  REQUESTED = 'requested',
  ASSIGNED = 'assigned',
  EN_ROUTE = 'en_route',
  COLLECTED = 'collected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('home_collections')
export class HomeCollection extends BaseEntity {
  @Column({ name: 'order_id', nullable: true })
  orderId?: string;

  @OneToOne(() => LabOrder, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_id' })
  order?: LabOrder;

  @Column({ name: 'patient_name' })
  patientName: string;

  @Column({ name: 'patient_phone' })
  patientPhone: string;

  @Column({ name: 'patient_email', nullable: true })
  patientEmail?: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  landmark?: string;

  @Column({ name: 'preferred_date', type: 'date' })
  preferredDate: string;

  @Column({ name: 'preferred_time_slot' })
  preferredTimeSlot: string;

  @Column({ name: 'assigned_staff_id', nullable: true })
  assignedStaffId?: string;

  @Column({ name: 'assigned_staff_name', nullable: true })
  assignedStaffName?: string;

  @Column({
    type: 'enum',
    enum: HomeCollectionStatus,
    default: HomeCollectionStatus.REQUESTED,
  })
  status: HomeCollectionStatus;

  @Column({ name: 'collection_notes', type: 'text', nullable: true })
  collectionNotes?: string;

  @Column({ name: 'service_charge', type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceCharge: number;

  @Column({ default: 'NPR' })
  currency: string;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt?: Date;
}
