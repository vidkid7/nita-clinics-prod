import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Enquiry, EnquiryStatus, EnquiryType } from './entities/enquiry.entity';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';

@Injectable()
export class EnquiriesService {
  constructor(
    @InjectRepository(Enquiry)
    private enquiriesRepository: Repository<Enquiry>,
    @Optional() @InjectQueue('notifications')
    private notificationsQueue?: Queue,
  ) {}

  async create(createEnquiryDto: CreateEnquiryDto): Promise<Enquiry> {
    const enquiry = this.enquiriesRepository.create(createEnquiryDto);
    const savedEnquiry = await this.enquiriesRepository.save(enquiry);

    // Send notification to admin (only if queue is available)
    if (this.notificationsQueue) {
      try {
        await this.notificationsQueue.add('new-enquiry', {
          enquiryId: savedEnquiry.id,
          type: savedEnquiry.type,
          name: savedEnquiry.name,
          email: savedEnquiry.email,
          subject: savedEnquiry.subject,
        });
      } catch (error) {
        console.warn('Failed to queue notification:', error.message);
      }
    }

    return savedEnquiry;
  }

  async findAll(
    paginationDto: PaginationDto & { type?: EnquiryType; status?: EnquiryStatus },
  ): Promise<PaginatedResponseDto<Enquiry>> {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      type,
      status,
    } = paginationDto;

    const queryBuilder = this.enquiriesRepository.createQueryBuilder('enquiry');

    if (type) {
      queryBuilder.andWhere('enquiry.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('enquiry.status = :status', { status });
    }

    queryBuilder
      .orderBy(`enquiry.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [enquiries, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(enquiries, total, page, limit);
  }

  async findOne(id: string): Promise<Enquiry> {
    const enquiry = await this.enquiriesRepository.findOne({
      where: { id },
      relations: ['assignedUser'],
    });
    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }
    return enquiry;
  }

  async update(id: string, updateEnquiryDto: UpdateEnquiryDto): Promise<Enquiry> {
    const enquiry = await this.findOne(id);
    Object.assign(enquiry, updateEnquiryDto);
    return this.enquiriesRepository.save(enquiry);
  }

  async respond(id: string, response: string): Promise<Enquiry> {
    const enquiry = await this.findOne(id);
    enquiry.response = response;
    enquiry.respondedAt = new Date();
    enquiry.status = EnquiryStatus.RESOLVED;
    
    const savedEnquiry = await this.enquiriesRepository.save(enquiry);

    // Send response notification to user (only if queue is available)
    if (this.notificationsQueue) {
      try {
        await this.notificationsQueue.add('enquiry-response', {
          enquiryId: savedEnquiry.id,
          email: savedEnquiry.email,
          name: savedEnquiry.name,
          response,
        });
      } catch (error) {
        console.warn('Failed to queue notification:', error.message);
      }
    }

    return savedEnquiry;
  }

  async assignTo(id: string, userId: string): Promise<Enquiry> {
    const enquiry = await this.findOne(id);
    enquiry.assignedTo = userId;
    enquiry.status = EnquiryStatus.IN_PROGRESS;
    return this.enquiriesRepository.save(enquiry);
  }

  async close(id: string): Promise<Enquiry> {
    const enquiry = await this.findOne(id);
    enquiry.status = EnquiryStatus.CLOSED;
    return this.enquiriesRepository.save(enquiry);
  }

  async remove(id: string): Promise<void> {
    const enquiry = await this.findOne(id);
    await this.enquiriesRepository.remove(enquiry);
  }

  async getStats(): Promise<{
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
    byType: Record<string, number>;
  }> {
    const [total, newCount, inProgress, resolved] = await Promise.all([
      this.enquiriesRepository.count(),
      this.enquiriesRepository.count({ where: { status: EnquiryStatus.NEW } }),
      this.enquiriesRepository.count({ where: { status: EnquiryStatus.IN_PROGRESS } }),
      this.enquiriesRepository.count({ where: { status: EnquiryStatus.RESOLVED } }),
    ]);

    const typeStats = await this.enquiriesRepository
      .createQueryBuilder('enquiry')
      .select('enquiry.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('enquiry.type')
      .getRawMany();

    const byType = typeStats.reduce((acc, { type, count }) => {
      acc[type] = parseInt(count);
      return acc;
    }, {} as Record<string, number>);

    return { total, new: newCount, inProgress, resolved, byType };
  }
}
