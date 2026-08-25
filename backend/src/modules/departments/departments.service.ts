import { Injectable, NotFoundException, ConflictException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import slugify from 'slugify';

@Injectable()
export class DepartmentsService implements OnModuleInit {
  private readonly logger = new Logger(DepartmentsService.name);
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
  ) {}

  // Automatically seed some default departments if none exist
  async onModuleInit() {
    const count = await this.departmentsRepository.count();
    if (count > 0) {
      return;
    }

    this.logger.log('No departments found. Seeding default departments...');

    const defaults = [
      {
        name: 'General Medicine',
        description: 'Comprehensive outpatient care including preventive and follow-up services',
        isActive: true,
        order: 1,
      },
      {
        name: 'Gynecology and Obstetrics',
        description: 'Women-focused care including reproductive health consultations',
        isActive: true,
        order: 2,
      },
      {
        name: 'Pediatrics',
        description: 'Comprehensive care for infants, children, and adolescents',
        isActive: true,
        order: 3,
      },
      {
        name: 'Diagnostic Services',
        description: 'Laboratory and diagnostic support for accurate clinical decisions',
        isActive: true,
        order: 4,
      },
    ];

    for (const dept of defaults) {
      const slug = slugify(dept.name, { lower: true, strict: true });
      const existing = await this.departmentsRepository.findOne({ where: { slug } });
      if (!existing) {
        const entity = this.departmentsRepository.create({
          ...dept,
          slug,
        });
        await this.departmentsRepository.save(entity);
      }
    }

    this.logger.log('Default departments seeded.');
  }

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const slug = slugify(createDepartmentDto.name, { lower: true, strict: true });
    
    const existing = await this.departmentsRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('Department with this name already exists');
    }

    const department = this.departmentsRepository.create({
      ...createDepartmentDto,
      slug,
    });
    return this.departmentsRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentsRepository.find({
      where: { isActive: true },
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { id },
      relations: ['doctors', 'services'],
    });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  async findBySlug(slug: string): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { slug },
      relations: ['doctors', 'services'],
    });
    if (!department) {
      throw new NotFoundException(`Department with slug ${slug} not found`);
    }
    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);
    
    if (updateDepartmentDto.name && updateDepartmentDto.name !== department.name) {
      const slug = slugify(updateDepartmentDto.name, { lower: true, strict: true });
      const existing = await this.departmentsRepository.findOne({ where: { slug } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Department with this name already exists');
      }
      department.slug = slug;
    }

    Object.assign(department, updateDepartmentDto);
    return this.departmentsRepository.save(department);
  }

  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentsRepository.remove(department);
  }
}
