import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Department } from '@/modules/departments/entities/department.entity';
import { DoctorAvailability } from './doctor-availability.entity';
import { DoctorLeave } from './doctor-leave.entity';
import { Appointment } from '@/modules/appointments/entities/appointment.entity';
import { User } from '@/modules/users/entities/user.entity';

export enum StaffType {
  DOCTOR = 'doctor',
  ADMIN_STAFF = 'admin_staff',
  NURSE = 'nurse',
  TECHNICIAN = 'technician',
}

@Entity('doctors')
export class Doctor extends BaseEntity {
  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  photo?: string;

  @Column()
  qualification: string;

  @Column()
  specialization: string;

  @Column({
    name: 'staff_type',
    type: 'enum',
    enum: StaffType,
    default: StaffType.DOCTOR,
  })
  staffType: StaffType;

  @Column({ name: 'department_id' })
  departmentId: string;

  @ManyToOne(() => Department, (department) => department.doctors)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ type: 'int', default: 0 })
  experience: number;

  @Column({ name: 'consultation_fee', type: 'decimal', precision: 10, scale: 2, nullable: true })
  consultationFee?: number;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => DoctorAvailability, (availability) => availability.doctor)
  availabilities: DoctorAvailability[];

  @OneToMany(() => DoctorLeave, (leave) => leave.doctor)
  leaves: DoctorLeave[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
}
