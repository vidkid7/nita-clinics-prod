// ============================================
// Common Types
// ============================================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// User & Authentication
// ============================================

export type UserRole = 'admin' | 'super_admin' | 'doctor' | 'staff' | 'patient' | 'student';

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ============================================
// Doctor
// ============================================

export interface Doctor extends BaseEntity {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  qualification: string;
  specialization: string;
  department: Department;
  departmentId: string;
  experience: number; // years
  consultationFee?: number;
  bio?: string;
  staffType?: 'doctor' | 'admin_staff' | 'nurse' | 'technician';
  isActive: boolean;
  availabilities?: DoctorAvailability[];
}

export interface DoctorAvailability extends BaseEntity {
  doctorId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string;
  slotDuration: number; // minutes (10, 15, 30)
  isActive: boolean;
}

export interface DoctorLeave extends BaseEntity {
  doctorId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

// ============================================
// Department
// ============================================

export interface Department extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  order: number;
}

// ============================================
// Appointment
// ============================================

export type AppointmentStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed' 
  | 'no_show';

export interface Appointment extends BaseEntity {
  doctorId: string;
  doctor?: Doctor;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  cancellationReason?: string;
  reminderSent: boolean;
}

export interface CreateAppointmentDto {
  doctorId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  startTime: string;
  notes?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// ============================================
// Academic Programs
// ============================================

export type ProgramType = 'bds' | 'mds' | 'internship' | 'certificate';

export interface AcademicProgram extends BaseEntity {
  name: string;
  slug: string;
  type: ProgramType;
  duration: string;
  description: string;
  eligibility: string;
  curriculum?: string;
  fees?: string;
  seats?: number;
  image?: string;
  isActive: boolean;
}

// ============================================
// Admission Application
// ============================================

export type ApplicationStatus = 
  | 'draft'
  | 'submitted' 
  | 'under_review' 
  | 'shortlisted' 
  | 'accepted' 
  | 'rejected';

export interface AdmissionApplication extends BaseEntity {
  applicationNumber: string;
  programId: string;
  program?: AcademicProgram;
  
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  address: string;
  
  // Academic Info
  previousEducation: string;
  percentage: number;
  passingYear: number;
  
  // Documents
  documents: ApplicationDocument[];
  
  status: ApplicationStatus;
  remarks?: string;
}

export interface ApplicationDocument {
  type: string;
  name: string;
  url: string;
  uploadedAt: string;
}

// ============================================
// Services
// ============================================

export interface Service extends BaseEntity {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon?: string;
  image?: string;
  gallery?: string[];
  departmentId?: string;
  department?: Department;
  isActive: boolean;
  order: number;
}

// ============================================
// Blog / Articles
// ============================================

export interface BlogPost extends BaseEntity {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  authorId?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  views: number;
  readingTime: number;
}

// ============================================
// Testimonials
// ============================================

export interface Testimonial extends BaseEntity {
  name: string;
  role: string; // e.g., "Patient", "Student", "Alumni"
  content: string;
  rating: number;
  photo?: string;
  isActive: boolean;
  order: number;
}

// ============================================
// Faculty
// ============================================

export interface Faculty extends BaseEntity {
  name: string;
  designation: string;
  qualification: string;
  departmentId: string;
  department?: Department;
  photo?: string;
  email?: string;
  specialization?: string;
  bio?: string;
  publications?: string[];
  isActive: boolean;
  order: number;
}

// ============================================
// Clinic / Location
// ============================================

export interface Clinic extends BaseEntity {
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  workingHours: ClinicWorkingHours[];
  services?: string[];
  images?: string[];
  isMain: boolean;
  isActive: boolean;
}

export interface ClinicWorkingHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

// ============================================
// Enquiry
// ============================================

export type EnquiryType = 
  | 'general' 
  | 'appointment' 
  | 'admission' 
  | 'services' 
  | 'feedback' 
  | 'complaint';

export type EnquiryStatus = 'new' | 'in_progress' | 'resolved' | 'closed';

export interface Enquiry extends BaseEntity {
  type: EnquiryType;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  assignedTo?: string;
  response?: string;
  respondedAt?: string;
}

// ============================================
// Media
// ============================================

export interface MediaFile extends BaseEntity {
  name: string;
  url: string;
  publicId: string;
  type: 'image' | 'video' | 'document';
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  folder?: string;
  alt?: string;
  caption?: string;
}

// ============================================
// SEO
// ============================================

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  schema?: Record<string, unknown>;
}

// ============================================
// Page Content (CMS)
// ============================================

export interface PageContent extends BaseEntity {
  pageSlug: string;
  sectionKey: string;
  content: Record<string, unknown>;
  seo?: SEOData;
}

// ============================================
// Settings
// ============================================

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
}

// ============================================
// Nita Clinic Domain Types
// ============================================

export type PackageCategory =
  | 'female_general'
  | 'female_premium'
  | 'male_general'
  | 'male_premium'
  | 'tuberculosis'
  | 'pediatrics'
  | 'gynecology';

export interface CheckupPackage extends BaseEntity {
  name: string;
  category: PackageCategory;
  targetGroup?: string;
  ageLabel?: string;
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  description?: string;
  tests: string[];
  ctaLabel?: string;
  ctaLink?: string;
  isActive: boolean;
  order: number;
}

export type HealthCardCategoryType =
  | 'licensed_doctors'
  | 'family'
  | 'partner_staff'
  | 'general_public';

export interface HealthCardCategory extends BaseEntity {
  name: string;
  type: HealthCardCategoryType;
  opdDiscount?: string;
  labDiscount?: string;
  medicineDiscount?: string;
  queueBenefit?: string;
  summary?: string;
  notes?: string;
  price?: number;
  isActive: boolean;
  order: number;
}

export type PartnerSection = 'health_card' | 'homepage' | 'footer';

export interface Partner extends BaseEntity {
  name: string;
  logoUrl?: string;
  alt?: string;
  url: string;
  description?: string;
  section: PartnerSection;
  isActive: boolean;
  order: number;
}

export type PaymentGateway = 'esewa' | 'khalti' | 'fonepay';
export type PaymentStatus =
  | 'initialized'
  | 'pending'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'expired'
  | 'verification_failed';
export type PaymentPurpose = 'health_card' | 'package' | 'appointment' | 'lab_test' | 'other';

export interface PaymentTransaction extends BaseEntity {
  reference: string;
  gateway: PaymentGateway;
  purpose: PaymentPurpose;
  status: PaymentStatus;
  amount: number;
  currency: string;
  appointmentId?: string;
  packageId?: string;
  customerName?: string;
  customerEmail?: string;
  providerTransactionId?: string;
  providerReferenceId?: string;
  requestPayload?: Record<string, unknown>;
  responsePayload?: Record<string, unknown>;
  callbackPayload?: Record<string, unknown>;
  errorMessage?: string;
  initiatedAt?: string;
  completedAt?: string;
}

// ============================================
// Patient Management
// ============================================

export type PatientGender = 'male' | 'female' | 'other';
export type PatientBloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Patient extends BaseEntity {
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: PatientGender;
  bloodGroup?: PatientBloodGroup;
  address?: string;
  city?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalHistory?: string;
  allergies?: string;
  isActive: boolean;
}

// ============================================
// Lab Tests
// ============================================

export interface LabTestCategory extends BaseEntity {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  color?: string;
  image?: string;
  isActive: boolean;
  order: number;
  tests?: LabTest[];
}

export interface LabTest extends BaseEntity {
  name: string;
  slug: string;
  categoryId: string;
  category?: LabTestCategory;
  description?: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  turnaround?: string;
  sampleType?: string;
  preparation?: string;
  isPopular: boolean;
  isActive: boolean;
  tags: string[];
  includes: string[];
  order: number;
}

// ============================================
// Lab Orders
// ============================================

export type LabOrderStatus = 'placed' | 'confirmed' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
export type CollectionType = 'clinic' | 'home';
export type LabOrderPaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface LabOrderItem extends BaseEntity {
  orderId: string;
  testId: string;
  testName: string;
  price: number;
  status: 'pending' | 'collected' | 'processing' | 'completed';
  result?: string;
}

export interface LabOrder extends BaseEntity {
  orderNumber: string;
  patientId?: string;
  patient?: Patient;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  status: LabOrderStatus;
  collectionType: CollectionType;
  collectionDate?: string;
  collectionTime?: string;
  totalAmount: number;
  currency: string;
  paymentStatus: LabOrderPaymentStatus;
  paymentReference?: string;
  notes?: string;
  items: LabOrderItem[];
}

// ============================================
// Home Collection
// ============================================

export type HomeCollectionStatus = 'requested' | 'assigned' | 'en_route' | 'collected' | 'completed' | 'cancelled';

export interface HomeCollection extends BaseEntity {
  orderId?: string;
  order?: LabOrder;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  address: string;
  city?: string;
  landmark?: string;
  preferredDate: string;
  preferredTimeSlot: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  status: HomeCollectionStatus;
  collectionNotes?: string;
  serviceCharge: number;
  currency: string;
  completedAt?: string;
}

// ============================================
// Lab Reports
// ============================================

export interface LabReport extends BaseEntity {
  orderId?: string;
  patientId: string;
  patient?: Patient;
  testName: string;
  reportFileUrl: string;
  reportFileName?: string;
  reportDate: string;
  uploadedBy?: string;
  verifiedBy?: string;
  isVerified: boolean;
  remarks?: string;
  isVisibleToPatient: boolean;
}

// ============================================
// Vaccination
// ============================================

export interface Vaccine extends BaseEntity {
  name: string;
  slug: string;
  shortName?: string;
  category: string[];
  tagline?: string;
  description?: string;
  longDescription?: string;
  image?: string;
  whoItIsFor?: string;
  schedule?: string;
  doses?: string;
  protectsAgainst: string[];
  sideEffects: string[];
  contraindications: string[];
  notes?: string;
  availability: string;
  priceNote?: string;
  isActive: boolean;
  order: number;
}
