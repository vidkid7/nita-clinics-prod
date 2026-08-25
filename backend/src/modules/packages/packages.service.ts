import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CheckupPackage, CheckupPackageCategory } from './entities/checkup-package.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(CheckupPackage)
    private readonly packagesRepository: Repository<CheckupPackage>,
  ) {}

  create(createPackageDto: CreatePackageDto) {
    const record = this.packagesRepository.create({
      ...createPackageDto,
      tests: createPackageDto.tests || [],
      currency: createPackageDto.currency || 'NPR',
    });
    return this.packagesRepository.save(record);
  }

  findAll(includeInactive = false, category?: CheckupPackageCategory) {
    const where: FindOptionsWhere<CheckupPackage> = {};
    if (!includeInactive) where.isActive = true;
    if (category) where.category = category;
    return this.packagesRepository.find({
      where,
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const record = await this.packagesRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    const record = await this.findOne(id);
    Object.assign(record, updatePackageDto);
    return this.packagesRepository.save(record);
  }

  async remove(id: string) {
    const record = await this.findOne(id);
    await this.packagesRepository.remove(record);
  }
}
