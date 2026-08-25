import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabTest } from './entities/lab-test.entity';
import { LabTestCategory } from './entities/lab-test-category.entity';
import { CreateLabTestDto } from './dto/create-lab-test.dto';
import { UpdateLabTestDto } from './dto/update-lab-test.dto';
import { CreateLabTestCategoryDto } from './dto/create-lab-test-category.dto';
import { UpdateLabTestCategoryDto } from './dto/update-lab-test-category.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
import slugify from 'slugify';

@Injectable()
export class LabTestsService {
  constructor(
    @InjectRepository(LabTest)
    private readonly testRepository: Repository<LabTest>,
    @InjectRepository(LabTestCategory)
    private readonly categoryRepository: Repository<LabTestCategory>,
  ) {}

  // --- Categories ---

  createCategory(dto: CreateLabTestCategoryDto) {
    const slug = dto.slug || slugify(dto.name, { lower: true, strict: true });
    const record = this.categoryRepository.create({ ...dto, slug });
    return this.categoryRepository.save(record);
  }

  findAllCategories(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };
    return this.categoryRepository.find({
      where,
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findCategory(id: string) {
    const record = await this.categoryRepository.findOne({
      where: { id },
      relations: ['tests'],
    });
    if (!record) throw new NotFoundException(`Lab test category ${id} not found`);
    return record;
  }

  async findCategoryBySlug(slug: string) {
    const record = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['tests'],
    });
    if (!record) throw new NotFoundException(`Lab test category "${slug}" not found`);
    return record;
  }

  async updateCategory(id: string, dto: UpdateLabTestCategoryDto) {
    const record = await this.findCategory(id);
    if (dto.name && dto.name !== record.name && !dto.slug) {
      dto.slug = slugify(dto.name, { lower: true, strict: true });
    }
    Object.assign(record, dto);
    return this.categoryRepository.save(record);
  }

  async removeCategory(id: string) {
    const record = await this.findCategory(id);
    await this.categoryRepository.remove(record);
  }

  // --- Tests ---

  createTest(dto: CreateLabTestDto) {
    const slug = dto.slug || slugify(dto.name, { lower: true, strict: true });
    const record = this.testRepository.create({
      ...dto,
      slug,
      tags: dto.tags || [],
      includes: dto.includes || [],
    });
    return this.testRepository.save(record);
  }

  async findAllTests(pagination: PaginationDto, categoryId?: string, popular?: boolean) {
    const { page = 1, limit = 10, search, sortBy = 'order', sortOrder = 'asc' } = pagination;
    const skip = (page - 1) * limit;

    const qb = this.testRepository.createQueryBuilder('test')
      .leftJoinAndSelect('test.category', 'category')
      .where('test.isActive = :active', { active: true });

    if (categoryId) {
      qb.andWhere('test.categoryId = :categoryId', { categoryId });
    }
    if (popular) {
      qb.andWhere('test.isPopular = :popular', { popular: true });
    }
    if (search) {
      qb.andWhere('(test.name ILIKE :search OR test.description ILIKE :search)', { search: `%${search}%` });
    }

    qb.orderBy(`test.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findTest(id: string) {
    const record = await this.testRepository.findOne({ where: { id }, relations: ['category'] });
    if (!record) throw new NotFoundException(`Lab test ${id} not found`);
    return record;
  }

  async findTestBySlug(slug: string) {
    const record = await this.testRepository.findOne({ where: { slug }, relations: ['category'] });
    if (!record) throw new NotFoundException(`Lab test "${slug}" not found`);
    return record;
  }

  async updateTest(id: string, dto: UpdateLabTestDto) {
    const record = await this.findTest(id);
    if (dto.name && dto.name !== record.name && !dto.slug) {
      dto.slug = slugify(dto.name, { lower: true, strict: true });
    }
    Object.assign(record, dto);
    return this.testRepository.save(record);
  }

  async removeTest(id: string) {
    const record = await this.findTest(id);
    await this.testRepository.remove(record);
  }

  async findAllTestsAdmin(pagination: PaginationDto, categoryId?: string) {
    const { page = 1, limit = 50, search, sortBy = 'order', sortOrder = 'asc' } = pagination;
    const skip = (page - 1) * limit;

    const qb = this.testRepository.createQueryBuilder('test')
      .leftJoinAndSelect('test.category', 'category');

    if (categoryId) {
      qb.andWhere('test.categoryId = :categoryId', { categoryId });
    }
    if (search) {
      qb.andWhere('(test.name ILIKE :search OR test.description ILIKE :search)', { search: `%${search}%` });
    }

    qb.orderBy(`test.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResponseDto(data, total, page, limit);
  }
}
