import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { LabOrder } from './lab-order.entity';

export enum LabOrderItemStatus {
  PENDING = 'pending',
  COLLECTED = 'collected',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
}

@Entity('lab_order_items')
export class LabOrderItem extends BaseEntity {
  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => LabOrder, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: LabOrder;

  @Column({ name: 'test_id' })
  testId: string;

  @Column({ name: 'test_name' })
  testName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: LabOrderItemStatus, default: LabOrderItemStatus.PENDING })
  status: LabOrderItemStatus;

  @Column({ type: 'text', nullable: true })
  result?: string;
}
