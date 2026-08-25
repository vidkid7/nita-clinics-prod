import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Doctor } from './doctor.entity';

@Entity('doctor_leaves')
export class DoctorLeave extends BaseEntity {
  @Column({ name: 'doctor_id' })
  doctorId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.leaves, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;
}
