import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import slugify from 'slugify';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const slug = slugify(createServiceDto.name, { lower: true, strict: true });
    
    const existing = await this.servicesRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('Service with this name already exists');
    }

    const service = this.servicesRepository.create({
      ...createServiceDto,
      slug,
    });
    return this.servicesRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.servicesRepository.find({
      where: { isActive: true },
      relations: ['department'],
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  /** All services (including inactive) for admin UI. */
  findAllForAdmin(): Promise<Service[]> {
    return this.servicesRepository.find({
      relations: ['department'],
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { id },
      relations: ['department'],
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async findBySlug(slug: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { slug },
      relations: ['department'],
    });
    if (!service) {
      throw new NotFoundException(`Service with slug ${slug} not found`);
    }
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    
    if (updateServiceDto.name && updateServiceDto.name !== service.name) {
      const slug = slugify(updateServiceDto.name, { lower: true, strict: true });
      const existing = await this.servicesRepository.findOne({ where: { slug } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Service with this name already exists');
      }
      service.slug = slug;
    }

    Object.assign(service, updateServiceDto);
    return this.servicesRepository.save(service);
  }

  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await this.servicesRepository.remove(service);
  }
}
