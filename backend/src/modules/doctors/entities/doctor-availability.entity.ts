import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Doctor } from './doctor.entity';

@Entity('doctor_availabilities')
export class DoctorAvailability extends BaseEntity {
  @Column({ name: 'doctor_id' })
  doctorId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.availabilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ name: 'day_of_week', type: 'int' })
  dayOfWeek: number; // 0-6 (Sunday-Saturday)

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'slot_duration', type: 'int', default: 15 })
  slotDuration: number; // minutes

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
