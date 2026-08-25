import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientSelfUpdateDto } from './dto/patient-self-update.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreatePatientDto) {
    const email = dto.email.trim().toLowerCase();
    dto.email = email;

    // Check for duplicate email
    const existing = await this.patientRepository.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('A patient with this email already exists');
    }

    let userId: string | undefined;

    // If password provided, create a User account for patient login
    if (dto.password) {
      const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
      if (existingUser) {
        throw new BadRequestException('A user account with this email already exists');
      }
      const user = this.userRepository.create({
        email: dto.email,
        password: dto.password,
        name: dto.fullName,
        role: UserRole.PATIENT,
      });
      const savedUser = await this.userRepository.save(user);
      userId = savedUser.id;
    }

    const patient = this.patientRepository.create({
      ...dto,
      userId,
      password: undefined, // Don't store password on patient entity
    } as any);
    // Remove password from plain object before create
    delete (patient as any).password;
    return this.patientRepository.save(patient);
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.patientRepository.createQueryBuilder('patient')
      .leftJoinAndSelect('patient.user', 'user');

    if (search) {
      queryBuilder.where(
        'patient.fullName ILIKE :search OR patient.email ILIKE :search OR patient.phone ILIKE :search',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`patient.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: string) {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async findByEmail(email: string) {
    const norm = (email || '').trim().toLowerCase();
    return this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.user', 'user')
      .where('LOWER(TRIM(patient.email)) = :email', { email: norm })
      .getOne();
  }

  async findByUserId(userId: string) {
    const patient = await this.patientRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }
    return patient;
  }

  async updatePatientSelf(id: string, dto: PatientSelfUpdateDto) {
    const patient = await this.findOne(id);
    Object.assign(patient, dto);
    if (dto.fullName !== undefined && patient.userId) {
      const user = await this.userRepository.findOne({
        where: { id: patient.userId },
      });
      if (user) {
        user.name = dto.fullName;
        await this.userRepository.save(user);
      }
    }
    return this.patientRepository.save(patient);
  }

  async update(id: string, dto: UpdatePatientDto) {
    const patient = await this.findOne(id);
    const {
      password: _pwd,
      newPassword,
      email,
      ...rest
    } = dto as UpdatePatientDto & {
      password?: string;
      newPassword?: string;
      email?: string;
    };
    void _pwd;

    if (email !== undefined && email.trim().toLowerCase() !== patient.email) {
      const normalized = email.trim().toLowerCase();
      const takenPatient = await this.patientRepository.findOne({
        where: { email: normalized },
      });
      if (takenPatient && takenPatient.id !== patient.id) {
        throw new BadRequestException('Email already in use');
      }
      const takenUser = await this.userRepository.findOne({
        where: { email: normalized },
      });
      if (takenUser && takenUser.id !== patient.userId) {
        throw new BadRequestException('Email already in use');
      }
      patient.email = normalized;
    }

    Object.assign(patient, rest);
    delete (patient as { password?: string }).password;

    if (patient.userId) {
      const user = await this.userRepository.findOne({
        where: { id: patient.userId },
      });
      if (user) {
        if (email !== undefined) {
          user.email = patient.email;
        }
        if (rest.fullName !== undefined) {
          user.name = rest.fullName as string;
        }
        if (newPassword) {
          user.password = newPassword;
        }
        await this.userRepository.save(user);
      }
    }

    return this.patientRepository.save(patient);
  }

  async remove(id: string) {
    const patient = await this.findOne(id);
    // Also remove associated user account if exists
    if (patient.userId) {
      await this.userRepository.delete(patient.userId);
    }
    await this.patientRepository.remove(patient);
  }

  async activate(id: string) {
    const patient = await this.findOne(id);
    patient.isActive = true;
    if (patient.userId) {
      await this.userRepository.update(patient.userId, { isActive: true });
    }
    return this.patientRepository.save(patient);
  }

  async deactivate(id: string) {
    const patient = await this.findOne(id);
    patient.isActive = false;
    if (patient.userId) {
      await this.userRepository.update(patient.userId, { isActive: false });
    }
    return this.patientRepository.save(patient);
  }
}
