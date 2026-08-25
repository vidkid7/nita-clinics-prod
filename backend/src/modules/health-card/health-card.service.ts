import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthCardCategory } from './entities/health-card-category.entity';
import {
  ApplicationStatus,
  HealthCardApplication,
} from './entities/health-card-application.entity';
import { CreateHealthCardCategoryDto } from './dto/create-health-card-category.dto';
import { UpdateHealthCardCategoryDto } from './dto/update-health-card-category.dto';
import { UpdateHealthCardPageDto } from './dto/update-health-card-page.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Setting } from '../settings/entities/setting.entity';
import { PatientsService } from '../patients/patients.service';
import { addYears } from 'date-fns';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Where health-card identity documents are stored. We mirror the pattern used by
 * the media module (saved under frontend/public so Next.js serves them automatically),
 * but isolate this folder so admin-only review access can be controlled separately
 * if we later add auth on the static folder.
 */
const HEALTH_CARD_UPLOAD_DIR = path.join(
  process.cwd(),
  '..',
  'frontend',
  'public',
  'uploads',
  'health-card-docs',
);

const ALLOWED_DOCUMENT_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
];

const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024; // 8 MB

@Injectable()
export class HealthCardService {
  constructor(
    @InjectRepository(HealthCardCategory)
    private readonly categoryRepository: Repository<HealthCardCategory>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @InjectRepository(HealthCardApplication)
    private readonly applicationRepository: Repository<HealthCardApplication>,
    private readonly patientsService: PatientsService,
  ) {}

  createCategory(payload: CreateHealthCardCategoryDto) {
    const record = this.categoryRepository.create(payload);
    return this.categoryRepository.save(record);
  }

  findAllCategories(includeInactive = false) {
    if (includeInactive) {
      return this.categoryRepository.find({ order: { order: 'ASC', name: 'ASC' } });
    }
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findCategory(id: string) {
    const record = await this.categoryRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Health card category ${id} not found`);
    }
    return record;
  }

  async updateCategory(id: string, payload: UpdateHealthCardCategoryDto) {
    const record = await this.findCategory(id);
    Object.assign(record, payload);
    return this.categoryRepository.save(record);
  }

  async removeCategory(id: string) {
    const record = await this.findCategory(id);
    await this.categoryRepository.remove(record);
  }

  async getPageContent() {
    const keys = [
      'healthCardHeroTitle',
      'healthCardHeroSubtitle',
      'healthCardIntroText',
      'healthCardCtaLabel',
      'healthCardCtaLink',
    ];
    const settings = await this.settingRepository.find({
      where: keys.map((key) => ({ key })),
    });
    return settings.reduce(
      (acc, setting) => ({ ...acc, [setting.key]: setting.value }),
      {} as Record<string, string>,
    );
  }

  async updatePageContent(payload: UpdateHealthCardPageDto) {
    const pairs: Array<{ key: string; value?: string }> = [
      { key: 'healthCardHeroTitle', value: payload.heroTitle },
      { key: 'healthCardHeroSubtitle', value: payload.heroSubtitle },
      { key: 'healthCardIntroText', value: payload.introText },
      { key: 'healthCardCtaLabel', value: payload.ctaLabel },
      { key: 'healthCardCtaLink', value: payload.ctaLink },
    ];

    for (const pair of pairs) {
      if (typeof pair.value !== 'string') {
        continue;
      }
      const existing = await this.settingRepository.findOne({ where: { key: pair.key } });
      if (existing) {
        existing.value = pair.value;
        existing.category = 'health_card';
        await this.settingRepository.save(existing);
      } else {
        const created = this.settingRepository.create({
          key: pair.key,
          value: pair.value,
          category: 'health_card',
          description: 'Health card page content',
        });
        await this.settingRepository.save(created);
      }
    }

    return this.getPageContent();
  }

  private generateCardNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `NC-${year}-${random}`;
  }

  createApplication(
    payload: CreateApplicationDto,
    documentFile?: Express.Multer.File,
  ) {
    const emailRaw = payload.email?.trim();

    let documentPath: string | undefined;
    let documentFileName: string | undefined;
    let documentMimeType: string | undefined;
    let documentSizeBytes: number | undefined;

    if (documentFile) {
      if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(documentFile.mimetype)) {
        throw new BadRequestException(
          `Document type '${documentFile.mimetype}' is not allowed. Upload a JPG, PNG, WEBP or PDF under 8MB.`,
        );
      }
      if (documentFile.size > MAX_DOCUMENT_BYTES) {
        throw new BadRequestException(
          `Document exceeds the 8MB limit (${(documentFile.size / (1024 * 1024)).toFixed(2)}MB).`,
        );
      }
      if (!payload.documentType) {
        throw new BadRequestException(
          'Document type is required when uploading an identity document.',
        );
      }

      if (!fs.existsSync(HEALTH_CARD_UPLOAD_DIR)) {
        fs.mkdirSync(HEALTH_CARD_UPLOAD_DIR, { recursive: true });
      }

      const timestamp = Date.now();
      const random = crypto.randomBytes(4).toString('hex');
      const safeName = (documentFile.originalname || 'document')
        .replace(/[^a-zA-Z0-9.\-_]/g, '_')
        .slice(-80);
      const filename = `${timestamp}-${random}-${safeName}`;
      const fullPath = path.join(HEALTH_CARD_UPLOAD_DIR, filename);

      try {
        fs.writeFileSync(fullPath, documentFile.buffer);
      } catch (err) {
        console.error('Failed to save health card document:', err);
        throw new BadRequestException('Failed to save identity document on the server.');
      }

      documentPath = `/uploads/health-card-docs/${filename}`;
      documentFileName = documentFile.originalname;
      documentMimeType = documentFile.mimetype;
      documentSizeBytes = documentFile.size;
    }

    const record = this.applicationRepository.create({
      ...payload,
      email: emailRaw ? emailRaw.toLowerCase() : undefined,
      documentPath,
      documentFileName,
      documentMimeType,
      documentSizeBytes,
    });
    return this.applicationRepository.save(record);
  }

  private digitsOnly(s: string): string {
    return (s || '').replace(/\D/g, '');
  }

  async findApplicationByEmail(email: string) {
    const norm = (email || '').trim().toLowerCase();
    if (!norm) {
      return [];
    }
    return this.applicationRepository
      .createQueryBuilder('a')
      .where('LOWER(TRIM(a.email)) = :email', { email: norm })
      .orderBy('a.createdAt', 'DESC')
      .getMany();
  }

  /** Match applications where stored phone digits equal the given phone (handles +977, spaces, dashes). */
  async findApplicationsByPhoneDigits(phone: string) {
    const digits = this.digitsOnly(phone);
    if (digits.length < 7) {
      return [];
    }
    return this.applicationRepository
      .createQueryBuilder('a')
      .where("regexp_replace(coalesce(a.phone, ''), '[^0-9]', '', 'g') = :digits", { digits })
      .orderBy('a.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Dashboard: merge applications linked by login email, patient profile email, or patient phone
   * (covers optional email on the public apply form).
   */
  async findMyApplications(userId: string, userEmail: string) {
    const byId = new Map<string, HealthCardApplication>();

    const emailNorm = (userEmail || '').trim().toLowerCase();
    if (emailNorm) {
      const rows = await this.findApplicationByEmail(emailNorm);
      for (const r of rows) {
        byId.set(r.id, r);
      }
    }

    try {
      const patient = await this.patientsService.findByUserId(userId);
      const pEmail = (patient.email || '').trim().toLowerCase();
      if (pEmail && pEmail !== emailNorm) {
        const rows = await this.findApplicationByEmail(pEmail);
        for (const r of rows) {
          byId.set(r.id, r);
        }
      }
      if (patient.phone) {
        const rows = await this.findApplicationsByPhoneDigits(patient.phone);
        for (const r of rows) {
          byId.set(r.id, r);
        }
      }
    } catch {
      /* no patient row — email-only matching */
    }

    return Array.from(byId.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async listApplications(status?: ApplicationStatus) {
    if (status) {
      return this.applicationRepository.find({
        where: { status },
        order: { createdAt: 'DESC' },
      });
    }
    return this.applicationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findApplication(id: string) {
    const record = await this.applicationRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Health card application ${id} not found`);
    }
    return record;
  }

  async approveApplication(id: string, approvedBy: string) {
    const record = await this.findApplication(id);
    record.status = ApplicationStatus.APPROVED;
    record.cardNumber = this.generateCardNumber();
    record.validUntil = addYears(new Date(), 1);
    record.approvedBy = approvedBy;
    return this.applicationRepository.save(record);
  }

  async rejectApplication(id: string, rejectionReason?: string) {
    const record = await this.findApplication(id);
    record.status = ApplicationStatus.REJECTED;
    record.rejectionReason = rejectionReason || 'Not specified';
    return this.applicationRepository.save(record);
  }

  async getInventoryStats() {
    const categories = await this.categoryRepository.find();
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      type: cat.type,
      totalCards: cat.totalCards,
      issuedCards: cat.issuedCards,
      availableCards: cat.totalCards - cat.issuedCards,
    }));
  }

  async updateInventory(categoryId: string, totalCards: number) {
    const category = await this.findCategory(categoryId);
    category.totalCards = totalCards;
    return this.categoryRepository.save(category);
  }

  async generateCollectionOtp(applicationId: string) {
    const application = await this.findApplication(applicationId);
    if (application.status !== ApplicationStatus.APPROVED) {
      throw new BadRequestException('Only approved applications can generate OTP');
    }
    // Generate a 6-digit OTP using cryptographically secure random bytes
    const otp = (crypto.randomInt(100000, 1000000)).toString();
    // Store bcrypt hash — never store plain-text OTP
    application.collectionOtp = await bcrypt.hash(otp, 10);
    await this.applicationRepository.save(application);
    // Return the plain OTP once so it can be communicated to the applicant
    return { otp };
  }

  async verifyCollection(applicationId: string, otp: string, verifiedBy: string) {
    const application = await this.findApplication(applicationId);
    if (!application.collectionOtp) {
      throw new BadRequestException('No OTP has been generated for this application');
    }
    const isValid = await bcrypt.compare(otp, application.collectionOtp);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }
    application.isCollected = true;
    application.collectedAt = new Date();
    application.collectionVerifiedBy = verifiedBy;
    application.collectionOtp = undefined;

    // Increment issued cards count for the category
    const categories = await this.categoryRepository.find();
    const matchingCategory = categories.find(
      (c) => c.type.toLowerCase().replace(/_/g, '') === application.holderType.toLowerCase().replace(/_/g, ''),
    );
    if (matchingCategory) {
      matchingCategory.issuedCards = (matchingCategory.issuedCards || 0) + 1;
      await this.categoryRepository.save(matchingCategory);
    }

    return this.applicationRepository.save(application);
  }
}
