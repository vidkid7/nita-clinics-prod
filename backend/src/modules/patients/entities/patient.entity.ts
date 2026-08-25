import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

@Entity('patients')
export class Patient extends BaseEntity {
  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @OneToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @Column({ type: 'enum', enum: BloodGroup, nullable: true, name: 'blood_group' })
  bloodGroup?: BloodGroup;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ name: 'emergency_contact_name', nullable: true })
  emergencyContactName?: string;

  @Column({ name: 'emergency_contact_phone', nullable: true })
  emergencyContactPhone?: string;

  @Column({ name: 'medical_history', type: 'text', nullable: true })
  medicalHistory?: string;

  @Column({ type: 'text', nullable: true })
  allergies?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
