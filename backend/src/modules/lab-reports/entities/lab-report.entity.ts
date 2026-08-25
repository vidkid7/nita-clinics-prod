import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Patient } from '../../patients/entities/patient.entity';

@Entity('lab_reports')
export class LabReport extends BaseEntity {
  @Column({ name: 'order_id', nullable: true })
  orderId?: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'test_name' })
  testName: string;

  /** Explicit DB type required — `string | null` alone makes TypeORM infer an unsupported "Object" type. */
  @Column({ name: 'report_file_url', type: 'text', nullable: true })
  reportFileUrl: string | null;

  @Column({ name: 'report_file_name', nullable: true })
  reportFileName?: string;

  @Column({ name: 'report_date', type: 'date' })
  reportDate: string;

  @Column({ name: 'uploaded_by', nullable: true })
  uploadedBy?: string;

  @Column({ name: 'verified_by', nullable: true })
  verifiedBy?: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ name: 'is_visible_to_patient', default: true })
  isVisibleToPatient: boolean;
}
