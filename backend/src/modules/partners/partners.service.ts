import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner, PartnerSection } from './entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
  ) {}

  create(payload: CreatePartnerDto) {
    const record = this.partnerRepository.create(payload);
    return this.partnerRepository.save(record);
  }

  findAll(section?: PartnerSection, includeInactive = false) {
    const where: Record<string, unknown> = {};
    if (section) {
      where.section = section;
    }
    if (!includeInactive) {
      where.isActive = true;
    }
    return this.partnerRepository.find({
      where,
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const record = await this.partnerRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Partner ${id} not found`);
    }
    return record;
  }

  async update(id: string, payload: UpdatePartnerDto) {
    const record = await this.findOne(id);
    Object.assign(record, payload);
    return this.partnerRepository.save(record);
  }

  async remove(id: string) {
    const record = await this.findOne(id);
    await this.partnerRepository.remove(record);
  }
}
