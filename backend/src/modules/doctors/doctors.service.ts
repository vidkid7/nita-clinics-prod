import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { DoctorAvailability } from './entities/doctor-availability.entity';
import { DoctorLeave } from './entities/doctor-leave.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
import { addMinutes, format, parse, isAfter, isBefore, isEqual } from 'date-fns';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    @InjectRepository(DoctorAvailability)
    private availabilityRepository: Repository<DoctorAvailability>,
    @InjectRepository(DoctorLeave)
    private leaveRepository: Repository<DoctorLeave>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorsRepository.create(createDoctorDto);
    return this.doctorsRepository.save(doctor);
  }

  async findAll(
    paginationDto: PaginationDto & { departmentId?: string; staffType?: string },
  ): Promise<PaginatedResponseDto<Doctor>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      search,
      departmentId,
      staffType,
    } = paginationDto;

    const queryBuilder = this.doctorsRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.department', 'department');

    if (search) {
      queryBuilder.andWhere(
        '(doctor.name ILIKE :search OR doctor.specialization ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (departmentId) {
      queryBuilder.andWhere('doctor.departmentId = :departmentId', { departmentId });
    }

    if (staffType?.trim()) {
      const types = staffType
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (types.length) {
        queryBuilder.andWhere('doctor.staff_type IN (:...types)', { types });
      }
    }

    queryBuilder.andWhere('doctor.isActive = :isActive', { isActive: true });

    queryBuilder
      .orderBy(`doctor.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [doctors, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(doctors, total, page, limit);
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({
      where: { id },
      relations: ['department', 'availabilities'],
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findOne(id);
    
    // Handle photo deletion: empty string means delete the photo
    if (updateDoctorDto.photo === '') {
      // Directly set doctor.photo to null for database (cast to any to bypass TS)
      (doctor as any).photo = null;
      // Create update data without photo field
      const { photo, ...restData } = updateDoctorDto;
      Object.assign(doctor, restData);
    } else {
      // Normal update
      Object.assign(doctor, updateDoctorDto);
    }
    
    return this.doctorsRepository.save(doctor);
  }

  async remove(id: string): Promise<void> {
    const doctor = await this.findOne(id);
    await this.doctorsRepository.remove(doctor);
  }

  // Availability management
  async setAvailability(doctorId: string, availabilityDto: CreateAvailabilityDto): Promise<DoctorAvailability> {
    await this.findOne(doctorId); // Verify doctor exists

    // Check for existing availability on the same day
    const existing = await this.availabilityRepository.findOne({
      where: { doctorId, dayOfWeek: availabilityDto.dayOfWeek },
    });

    if (existing) {
      Object.assign(existing, availabilityDto);
      return this.availabilityRepository.save(existing);
    }

    const availability = this.availabilityRepository.create({
      ...availabilityDto,
      doctorId,
    });
    return this.availabilityRepository.save(availability);
  }

  async getAvailabilities(doctorId: string): Promise<DoctorAvailability[]> {
    return this.availabilityRepository.find({
      where: { doctorId, isActive: true },
      order: { dayOfWeek: 'ASC' },
    });
  }

  async removeAvailability(doctorId: string, availabilityId: string): Promise<void> {
    const availability = await this.availabilityRepository.findOne({
      where: { id: availabilityId, doctorId },
    });
    if (!availability) {
      throw new NotFoundException('Availability not found');
    }
    await this.availabilityRepository.remove(availability);
  }

  // Leave management
  async addLeave(doctorId: string, leaveDto: CreateLeaveDto): Promise<DoctorLeave> {
    await this.findOne(doctorId);
    const leave = this.leaveRepository.create({ ...leaveDto, doctorId });
    return this.leaveRepository.save(leave);
  }

  async getLeaves(doctorId: string): Promise<DoctorLeave[]> {
    return this.leaveRepository.find({
      where: { doctorId },
      order: { startDate: 'DESC' },
    });
  }

  async removeLeave(doctorId: string, leaveId: string): Promise<void> {
    const leave = await this.leaveRepository.findOne({
      where: { id: leaveId, doctorId },
    });
    if (!leave) {
      throw new NotFoundException('Leave not found');
    }
    await this.leaveRepository.remove(leave);
  }

  // Generate available time slots for a specific date (lightweight - no full doctor load)
  async getAvailableSlots(doctorId: string, date: string): Promise<{ startTime: string; endTime: string }[]> {
    const exists = await this.doctorsRepository.findOne({
      where: { id: doctorId, isActive: true },
      select: ['id'],
    });
    if (!exists) {
      return [];
    }
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();

    // Check if doctor is on leave
    const leave = await this.leaveRepository.findOne({
      where: {
        doctorId,
        startDate: LessThanOrEqual(date),
        endDate: MoreThanOrEqual(date),
      },
    });

    if (leave) {
      return [];
    }

    // Get availability for the day
    const availability = await this.availabilityRepository.findOne({
      where: { doctorId, dayOfWeek, isActive: true },
    });

    if (!availability) {
      return [];
    }

    // Normalize time strings (DB may return HH:mm or HH:mm:ss)
    const startStr =
      typeof availability.startTime === 'string'
        ? availability.startTime.length > 5
          ? availability.startTime.substring(0, 5)
          : availability.startTime
        : '';
    const endStr =
      typeof availability.endTime === 'string'
        ? availability.endTime.length > 5
          ? availability.endTime.substring(0, 5)
          : availability.endTime
        : '';
    if (!startStr || !endStr || startStr.length < 4 || endStr.length < 4) {
      return [];
    }
    try {
      const startTime = parse(startStr, 'HH:mm', new Date());
      const endTime = parse(endStr, 'HH:mm', new Date());
      if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
        return [];
      }
      const slotDuration = availability.slotDuration || 30;

      const slots: { startTime: string; endTime: string }[] = [];
      let currentSlot = startTime;

      while (isBefore(currentSlot, endTime) || isEqual(currentSlot, endTime)) {
        const slotEnd = addMinutes(currentSlot, slotDuration);
        if (isAfter(slotEnd, endTime)) break;

        slots.push({
          startTime: format(currentSlot, 'HH:mm'),
          endTime: format(slotEnd, 'HH:mm'),
        });

        currentSlot = slotEnd;
      }

      return slots;
    } catch {
      return [];
    }
  }

  /** Merged list of slot start times (HH:mm) for a date from all active doctors (for date-first booking flow) */
  async getMergedAvailableSlotsForDate(date: string): Promise<string[]> {
    if (!date || typeof date !== 'string' || date.trim() === '') {
      return [];
    }
    const dateTrimmed = date.trim();
    const dateObj = new Date(dateTrimmed);
    if (Number.isNaN(dateObj.getTime())) {
      return [];
    }
    try {
      const doctors = await this.doctorsRepository.find({
        where: { isActive: true },
        select: ['id'],
      });
      const allStarts = new Set<string>();
      for (const d of doctors) {
        try {
          const slots = await this.getAvailableSlots(d.id, dateTrimmed);
          for (const s of slots) {
            const t = s.startTime?.length === 5 ? s.startTime : (s.startTime || '').substring(0, 5);
            if (t) allStarts.add(t);
          }
        } catch {
          // Skip this doctor on any error
        }
      }
      return Array.from(allStarts).sort();
    } catch (error) {
      console.error('getMergedAvailableSlotsForDate error:', error);
      return [];
    }
  }

  /** First matching slot window for a merged start time (used when booking without a specific doctor). */
  async getMergedSlotDetail(
    date: string,
    startTimeInput: string,
  ): Promise<{ startTime: string; endTime: string } | null> {
    const dateTrimmed = date?.trim();
    if (!dateTrimmed) return null;
    const timeNorm =
      startTimeInput?.length === 5
        ? startTimeInput
        : (startTimeInput || '').substring(0, 5);
    if (!timeNorm) return null;
    const doctors = await this.doctorsRepository.find({
      where: { isActive: true },
      select: ['id'],
    });
    for (const d of doctors) {
      const slots = await this.getAvailableSlots(d.id, dateTrimmed);
      for (const s of slots) {
        const st = s.startTime?.length === 5 ? s.startTime : (s.startTime || '').substring(0, 5);
        if (st === timeNorm) {
          return {
            startTime: st,
            endTime: s.endTime,
          };
        }
      }
    }
    return null;
  }
}
