import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vaccine } from './entities/vaccine.entity';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
import slugify from 'slugify';

@Injectable()
export class VaccinationsService {
  constructor(
    @InjectRepository(Vaccine)
    private readonly vaccineRepository: Repository<Vaccine>,
  ) {}

  create(dto: CreateVaccineDto) {
    const slug = dto.slug || slugify(dto.name, { lower: true, strict: true });
    const record = this.vaccineRepository.create({
      ...dto,
      slug,
      category: dto.category || [],
      protectsAgainst: dto.protectsAgainst || [],
      sideEffects: dto.sideEffects || [],
      contraindications: dto.contraindications || [],
    });
    return this.vaccineRepository.save(record);
  }

  async findAll(pagination: PaginationDto, category?: string) {
    const { page = 1, limit = 50, search, sortBy = 'order', sortOrder = 'asc' } = pagination;
    const skip = (page - 1) * limit;

    const qb = this.vaccineRepository.createQueryBuilder('vaccine')
      .where('vaccine.isActive = :active', { active: true });

    if (category && category !== 'All') {
      qb.andWhere('vaccine.category @> :category', { category: JSON.stringify([category]) });
    }
    if (search) {
      qb.andWhere('(vaccine.name ILIKE :search OR vaccine.description ILIKE :search)', { search: `%${search}%` });
    }

    qb.orderBy(`vaccine.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResponseDto(data, total, page, limit);
  }

  findAllAdmin(includeInactive = true) {
    return this.vaccineRepository.find({ order: { order: 'ASC', name: 'ASC' } });
  }

  async findOne(id: string) {
    const record = await this.vaccineRepository.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`Vaccine ${id} not found`);
    return record;
  }

  async findBySlug(slug: string) {
    const record = await this.vaccineRepository.findOne({ where: { slug } });
    if (!record) throw new NotFoundException(`Vaccine "${slug}" not found`);
    return record;
  }

  async update(id: string, dto: UpdateVaccineDto) {
    const record = await this.findOne(id);
    if (dto.name && dto.name !== record.name && !dto.slug) {
      dto.slug = slugify(dto.name, { lower: true, strict: true });
    }
    Object.assign(record, dto);
    return this.vaccineRepository.save(record);
  }

  async remove(id: string) {
    const record = await this.findOne(id);
    await this.vaccineRepository.remove(record);
  }

  async getCategories(): Promise<string[]> {
    const vaccines = await this.vaccineRepository.find({
      where: { isActive: true },
      select: ['category'],
    });
    const allCats = vaccines.flatMap((v) => v.category);
    return [...new Set(allCats)].sort();
  }
}
