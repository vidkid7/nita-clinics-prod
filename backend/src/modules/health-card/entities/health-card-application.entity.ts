import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

export enum CardHolderType {
  DOCTOR = 'doctor',
  DOCTOR_FAMILY = 'doctor_family',
  PARTNER_STAFF = 'partner_staff',
  GENERAL_PUBLIC = 'general_public',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/**
 * Government-issued ID document used to verify a cardholder's identity
 * during the admin review process. Only one document is required.
 */
export enum IdentityDocumentType {
  PASSPORT = 'passport',
  CITIZENSHIP = 'citizenship',
  DRIVING_LICENSE = 'driving_license',
  NMC_REGISTRATION = 'nmc_registration',
  EMPLOYEE_ID = 'employee_id',
}

@Entity('health_card_applications')
export class HealthCardApplication extends BaseEntity {
  @Column({ type: 'enum', enum: CardHolderType })
  holderType: CardHolderType;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  organization?: string;

  @Column({ nullable: true })
  nmcRegistrationId?: string;

  @Column({ nullable: true })
  relationWithDoctor?: string;

  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  @Column({ nullable: true })
  rejectionReason?: string;

  @Column({ nullable: true })
  cardNumber?: string;

  @Column({ type: 'date', nullable: true })
  validUntil?: Date;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ name: 'is_collected', default: false })
  isCollected: boolean;

  @Column({ name: 'collected_at', type: 'timestamp', nullable: true })
  collectedAt?: Date;

  @Column({ name: 'collection_verified_by', nullable: true })
  collectionVerifiedBy?: string;

  @Column({ name: 'collection_otp', nullable: true })
  collectionOtp?: string;

  /** Identity document category supplied by the applicant (passport, citizenship, driving license, etc.). */
  @Column({
    name: 'document_type',
    type: 'enum',
    enum: IdentityDocumentType,
    nullable: true,
  })
  documentType?: IdentityDocumentType;

  /** Identifier printed on the document (passport number, citizenship number, license number, NMC number, employee ID). */
  @Column({ name: 'document_number', nullable: true })
  documentNumber?: string;

  /** Original file name as uploaded by the applicant. */
  @Column({ name: 'document_file_name', nullable: true })
  documentFileName?: string;

  /** Stored path on disk (relative to the backend /uploads directory) — admin uses this to view the document. */
  @Column({ name: 'document_path', nullable: true })
  documentPath?: string;

  /** MIME type of the uploaded document (image/jpeg, image/png, application/pdf). */
  @Column({ name: 'document_mime_type', nullable: true })
  documentMimeType?: string;

  /** File size in bytes — surfaced in the admin panel for quick review. */
  @Column({ name: 'document_size_bytes', type: 'int', nullable: true })
  documentSizeBytes?: number;
}

