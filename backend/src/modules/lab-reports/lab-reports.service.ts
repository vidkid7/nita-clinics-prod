import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabReport } from './entities/lab-report.entity';
import { CreateLabReportDto } from './dto/create-lab-report.dto';
import { UpdateLabReportDto } from './dto/update-lab-report.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';

@Injectable()
export class LabReportsService {
  constructor(
    @InjectRepository(LabReport)
    private readonly reportRepository: Repository<LabReport>,
  ) {}

  create(dto: CreateLabReportDto, uploadedBy?: string) {
    const url = dto.reportFileUrl?.trim();
    const fileName = dto.reportFileName?.trim();
    const record = this.reportRepository.create({
      orderId: dto.orderId,
      patientId: dto.patientId,
      testName: dto.testName,
      reportDate: dto.reportDate,
      remarks: dto.remarks,
      isVisibleToPatient: dto.isVisibleToPatient,
      uploadedBy,
      reportFileUrl: url || null,
      ...(fileName ? { reportFileName: fileName } : {}),
    });
    return this.reportRepository.save(record);
  }

  async findAll(pagination: PaginationDto, patientId?: string) {
    const { page = 1, limit = 10, search, sortBy = 'reportDate', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const qb = this.reportRepository.createQueryBuilder('report')
      .leftJoinAndSelect('report.patient', 'patient');

    if (patientId) {
      qb.andWhere('report.patientId = :patientId', { patientId });
    }
    if (search) {
      qb.andWhere('(report.testName ILIKE :search OR patient.fullName ILIKE :search)', { search: `%${search}%` });
    }

    qb.orderBy(`report.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: string) {
    const record = await this.reportRepository.findOne({
      where: { id },
      relations: ['patient'],
    });
    if (!record) throw new NotFoundException(`Lab report ${id} not found`);
    return record;
  }

  async findByPatientUserId(userId: string, pagination: PaginationDto) {
    const { page = 1, limit = 10, sortBy = 'reportDate', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const qb = this.reportRepository.createQueryBuilder('report')
      .leftJoinAndSelect('report.patient', 'patient')
      .leftJoin('patient.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('report.isVisibleToPatient = :visible', { visible: true });

    qb.orderBy(`report.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findByOrderId(orderId: string) {
    return this.reportRepository.find({
      where: { orderId },
      relations: ['patient'],
      order: { reportDate: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateLabReportDto) {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.reportRepository.save(record);
  }

  async verify(id: string, verifiedBy: string) {
    const record = await this.findOne(id);
    record.isVerified = true;
    record.verifiedBy = verifiedBy;
    return this.reportRepository.save(record);
  }

  async toggleVisibility(id: string) {
    const record = await this.findOne(id);
    record.isVisibleToPatient = !record.isVisibleToPatient;
    return this.reportRepository.save(record);
  }

  async remove(id: string) {
    const record = await this.findOne(id);
    await this.reportRepository.remove(record);
  }

  async getPatientReport(id: string, userId: string) {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['patient', 'patient.user'],
    });
    if (!report) throw new NotFoundException(`Lab report ${id} not found`);
    if (!report.patient?.user || report.patient.user.id !== userId) {
      throw new ForbiddenException('You do not have access to this report');
    }
    if (!report.isVisibleToPatient) {
      throw new ForbiddenException('This report is not yet available');
    }
    return report;
  }
}
