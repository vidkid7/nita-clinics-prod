import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from './entities/clinic.entity';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import slugify from 'slugify';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
  ) {}

  async create(createClinicDto: CreateClinicDto): Promise<Clinic> {
    const slug = slugify(createClinicDto.name, { lower: true, strict: true });
    
    const existing = await this.clinicsRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('Clinic with this name already exists');
    }

    const clinic = this.clinicsRepository.create({
      ...createClinicDto,
      slug,
    });
    return this.clinicsRepository.save(clinic);
  }

  async findAll(): Promise<Clinic[]> {
    return this.clinicsRepository.find({
      where: { isActive: true },
      order: { isMain: 'DESC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Clinic> {
    const clinic = await this.clinicsRepository.findOne({ where: { id } });
    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }
    return clinic;
  }

  async findBySlug(slug: string): Promise<Clinic> {
    const clinic = await this.clinicsRepository.findOne({ where: { slug } });
    if (!clinic) {
      throw new NotFoundException(`Clinic with slug ${slug} not found`);
    }
    return clinic;
  }

  async update(id: string, updateClinicDto: UpdateClinicDto): Promise<Clinic> {
    const clinic = await this.findOne(id);
    
    if (updateClinicDto.name && updateClinicDto.name !== clinic.name) {
      const slug = slugify(updateClinicDto.name, { lower: true, strict: true });
      const existing = await this.clinicsRepository.findOne({ where: { slug } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Clinic with this name already exists');
      }
      clinic.slug = slug;
    }

    Object.assign(clinic, updateClinicDto);
    return this.clinicsRepository.save(clinic);
  }

  async remove(id: string): Promise<void> {
    const clinic = await this.findOne(id);
    await this.clinicsRepository.remove(clinic);
  }

  async getMainClinic(): Promise<Clinic | null> {
    return this.clinicsRepository.findOne({ where: { isMain: true, isActive: true } });
  }
}
