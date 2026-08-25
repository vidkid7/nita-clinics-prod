import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Doctor } from '@/modules/doctors/entities/doctor.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

@Entity('appointments')
export class Appointment extends BaseEntity {
  @Column({ name: 'doctor_id', nullable: true })
  doctorId: string | null;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, { nullable: true })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor | null;

  @Column({ name: 'patient_name' })
  patientName: string;

  @Column({ name: 'patient_email' })
  patientEmail: string;

  @Column({ name: 'patient_phone' })
  patientPhone: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  cancellationReason?: string;

  @Column({ name: 'reminder_sent', default: false })
  reminderSent: boolean;

  @Column({ name: 'confirmation_sent', default: false })
  confirmationSent: boolean;
}
