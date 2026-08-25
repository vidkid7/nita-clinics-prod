import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';

export enum EnquiryType {
  GENERAL = 'general',
  APPOINTMENT = 'appointment',
  ADMISSION = 'admission',
  SERVICES = 'services',
  FEEDBACK = 'feedback',
  COMPLAINT = 'complaint',
}

export enum EnquiryStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('enquiries')
export class Enquiry extends BaseEntity {
  @Column({
    type: 'enum',
    enum: EnquiryType,
    default: EnquiryType.GENERAL,
  })
  type: EnquiryType;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: EnquiryStatus,
    default: EnquiryStatus.NEW,
  })
  status: EnquiryStatus;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assignedUser?: User;

  @Column({ type: 'text', nullable: true })
  response?: string;

  @Column({ name: 'responded_at', nullable: true })
  respondedAt?: Date;
}
