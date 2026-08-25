import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomeCollection, HomeCollectionStatus } from './entities/home-collection.entity';
import { CreateHomeCollectionDto } from './dto/create-home-collection.dto';
import { UpdateHomeCollectionDto } from './dto/update-home-collection.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class HomeCollectionService {
  constructor(
    @InjectRepository(HomeCollection)
    private readonly repository: Repository<HomeCollection>,
  ) {}

  create(dto: CreateHomeCollectionDto) {
    const record = this.repository.create({
      ...dto,
      patientEmail: dto.patientEmail?.trim().toLowerCase(),
    });
    return this.repository.save(record);
  }

  async findAll(pagination: PaginationDto, status?: HomeCollectionStatus) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const qb = this.repository.createQueryBuilder('hc')
      .leftJoinAndSelect('hc.order', 'order');

    if (status) {
      qb.andWhere('hc.status = :status', { status });
    }
    if (search) {
      qb.andWhere('(hc.patientName ILIKE :search OR hc.patientPhone ILIKE :search OR hc.address ILIKE :search)', { search: `%${search}%` });
    }

    qb.orderBy(`hc.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findByPatientEmail(email: string, pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const norm = (email || '').trim().toLowerCase();
    const qb = this.repository
      .createQueryBuilder('hc')
      .leftJoinAndSelect('hc.order', 'order')
      .where('LOWER(TRIM(hc.patientEmail)) = :email', { email: norm })
      .orderBy('hc.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: string) {
    const record = await this.repository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!record) throw new NotFoundException(`Home collection ${id} not found`);
    return record;
  }

  async update(id: string, dto: UpdateHomeCollectionDto) {
    const record = await this.findOne(id);
    if (dto.status === HomeCollectionStatus.COMPLETED) {
      (record as any).completedAt = new Date();
    }
    Object.assign(record, dto);
    return this.repository.save(record);
  }

  async assignStaff(id: string, staffId: string, staffName: string) {
    const record = await this.findOne(id);
    record.assignedStaffId = staffId;
    record.assignedStaffName = staffName;
    record.status = HomeCollectionStatus.ASSIGNED;
    return this.repository.save(record);
  }

  async cancel(id: string, requester: { id: string; email: string; role: UserRole }) {
    const record = await this.findOne(id);
    const isAdminOrStaff = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF].includes(requester.role);
    const pat = (record.patientEmail || '').trim().toLowerCase();
    const req = (requester.email || '').trim().toLowerCase();
    if (!isAdminOrStaff && pat !== req) {
      throw new ForbiddenException('You are not authorised to cancel this request');
    }
    record.status = HomeCollectionStatus.CANCELLED;
    return this.repository.save(record);
  }

  async getStats() {
    const total = await this.repository.count();
    const requested = await this.repository.count({ where: { status: HomeCollectionStatus.REQUESTED } });
    const assigned = await this.repository.count({ where: { status: HomeCollectionStatus.ASSIGNED } });
    const enRoute = await this.repository.count({ where: { status: HomeCollectionStatus.EN_ROUTE } });
    const collected = await this.repository.count({ where: { status: HomeCollectionStatus.COLLECTED } });
    const completed = await this.repository.count({ where: { status: HomeCollectionStatus.COMPLETED } });
    const cancelled = await this.repository.count({ where: { status: HomeCollectionStatus.CANCELLED } });
    return { total, requested, assigned, enRoute, collected, completed, cancelled };
  }

  async getTodayCollections() {
    const today = new Date().toISOString().split('T')[0];
    return this.repository.find({
      where: { preferredDate: today },
      relations: ['order'],
      order: { preferredTimeSlot: 'ASC' },
    });
  }
}
