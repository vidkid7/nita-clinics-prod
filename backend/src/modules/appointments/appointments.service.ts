import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull, In } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
import { DoctorsService } from '../doctors/doctors.service';
import { Doctor } from '../doctors/entities/doctor.entity';
import { UserRole } from '../users/entities/user.entity';
import { addMinutes, format, parse } from 'date-fns';

/** Normalize time to HH:mm:ss for PostgreSQL time column */
function toTimeString(t: string): string {
  if (!t || typeof t !== 'string') return '09:00:00';
  const parts = t.trim().split(':');
  const h = parts[0]?.padStart(2, '0') || '00';
  const m = (parts[1] ?? '00').padStart(2, '0');
  const s = (parts[2] ?? '00').padStart(2, '0');
  return `${h}:${m}:${s}`;
}

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private doctorsService: DoctorsService,
    // @InjectQueue('notifications') // Temporarily disabled
    // private notificationsQueue: Queue,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const doctorIdRaw = createAppointmentDto.doctorId?.trim();
    const doctorId = doctorIdRaw || null;
    const { date, startTime } = createAppointmentDto;
    const category = createAppointmentDto.visitCategory;

    if (!doctorId) {
      if (category !== 'vaccination' && category !== 'checkup') {
        throw new BadRequestException(
          'Select a doctor for a consultation, or choose Vaccination / Health check-up to book without a specific doctor.',
        );
      }
    }

    const normalizedStartTime = startTime.length === 5 ? startTime : startTime.substring(0, 5);
    const startTimeDb = toTimeString(startTime);
    let endTimeDb: string;

    if (doctorId) {
      const availableSlots = await this.doctorsService.getAvailableSlots(doctorId, date);

      if (!availableSlots || availableSlots.length === 0) {
        throw new BadRequestException(
          'Doctor is not available on this day. Please select another date.',
        );
      }

      const slot = availableSlots.find((s) => {
        const st = s.startTime?.length === 5 ? s.startTime : (s.startTime || '').substring(0, 5);
        return st === normalizedStartTime;
      });

      if (!slot) {
        const availableTimes = availableSlots
          .map((s) => (s.startTime?.length === 5 ? s.startTime : (s.startTime || '').substring(0, 5)))
          .join(', ');
        throw new BadRequestException(
          `Selected time (${startTime}) is not available for this doctor on ${date}. Available times: ${availableTimes}`,
        );
      }

      endTimeDb = toTimeString(slot.endTime);

      const existingAppointment = await this.appointmentsRepository.findOne({
        where: {
          doctorId,
          date,
          startTime: startTimeDb,
          status: AppointmentStatus.PENDING,
        },
      });

      if (existingAppointment) {
        throw new BadRequestException('This time slot is already booked');
      }

      const confirmedAppointment = await this.appointmentsRepository.findOne({
        where: {
          doctorId,
          date,
          startTime: startTimeDb,
          status: AppointmentStatus.CONFIRMED,
        },
      });

      if (confirmedAppointment) {
        throw new BadRequestException('This time slot is already booked');
      }
    } else {
      const merged = await this.doctorsService.getMergedSlotDetail(date, startTime);
      if (!merged) {
        throw new BadRequestException(
          'This time is not available on the selected date. Please pick another slot.',
        );
      }
      endTimeDb = toTimeString(merged.endTime);

      const taken = await this.appointmentsRepository.findOne({
        where: {
          doctorId: IsNull(),
          date,
          startTime: startTimeDb,
          status: In([AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]),
        },
      });
      if (taken) {
        throw new BadRequestException('This clinic slot is already booked. Please choose another time.');
      }
    }

    const noteLines: string[] = [];
    if (category) {
      noteLines.push(
        `Visit: ${category}${createAppointmentDto.visitDetail ? ` — ${createAppointmentDto.visitDetail.trim()}` : ''}`,
      );
    } else if (createAppointmentDto.visitDetail?.trim()) {
      noteLines.push(createAppointmentDto.visitDetail.trim());
    }
    if (createAppointmentDto.notes?.trim()) {
      noteLines.push(createAppointmentDto.notes.trim());
    }
    const mergedNotes = noteLines.length > 0 ? noteLines.join('\n') : undefined;

    const appointment = this.appointmentsRepository.create({
      doctorId,
      patientName: createAppointmentDto.patientName.trim(),
      patientEmail: createAppointmentDto.patientEmail.trim().toLowerCase(),
      patientPhone: createAppointmentDto.patientPhone.trim(),
      date,
      startTime: startTimeDb,
      endTime: endTimeDb,
      notes: mergedNotes,
      status: AppointmentStatus.PENDING,
    });

    const savedAppointment = await this.appointmentsRepository.save(appointment);

    // Queue confirmation notification in background (temporarily disabled - no Redis)
    // void this.doctorsService.findOne(doctorId).then((doctor) => {
    //   return this.notificationsQueue.add('appointment-confirmation', {
    //     appointmentId: savedAppointment.id,
    //     patientEmail: savedAppointment.patientEmail,
    //     patientPhone: savedAppointment.patientPhone,
    //     doctorName: doctor?.name ?? 'Doctor',
    //     date: savedAppointment.date,
    //     time: savedAppointment.startTime,
    //   });
    // }).catch((err) => {
    //   console.error('Failed to queue notification (booking still succeeded):', err);
    // });

    return savedAppointment;
  }

  async findAll(
    paginationDto: PaginationDto & { 
      doctorId?: string; 
      status?: AppointmentStatus;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<PaginatedResponseDto<Appointment>> {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'date', 
      sortOrder = 'desc', 
      doctorId, 
      status,
      startDate,
      endDate,
    } = paginationDto;

    const queryBuilder = this.appointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor');

    if (doctorId) {
      queryBuilder.andWhere('appointment.doctorId = :doctorId', { doctorId });
    }

    if (status) {
      queryBuilder.andWhere('appointment.status = :status', { status });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('appointment.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    queryBuilder
      .orderBy(`appointment.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .addOrderBy('appointment.startTime', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [appointments, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(appointments, total, page, limit);
  }

  async findByPatientEmail(
    email: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<Appointment>> {
    const { page = 1, limit = 10 } = pagination;
    const normalized = email.trim().toLowerCase();
    const qb = this.appointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .where('LOWER(TRIM(appointment.patientEmail)) = :email', { email: normalized })
      .orderBy('appointment.date', 'DESC')
      .addOrderBy('appointment.startTime', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);
    const [appointments, total] = await qb.getManyAndCount();
    return new PaginatedResponseDto(appointments, total, page, limit);
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, updateAppointmentDto);
    return this.appointmentsRepository.save(appointment);
  }

  async cancel(
    id: string,
    reason?: string,
    requester?: { email: string; role: UserRole | string },
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);
    if (requester?.role === UserRole.PATIENT) {
      const apptEmail = appointment.patientEmail.trim().toLowerCase();
      const userEmail = requester.email.trim().toLowerCase();
      if (apptEmail !== userEmail) {
        throw new ForbiddenException('You can only cancel your own appointments');
      }
    }
    appointment.status = AppointmentStatus.CANCELLED;
    appointment.cancellationReason = reason;
    return this.appointmentsRepository.save(appointment);
  }

  async confirm(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = AppointmentStatus.CONFIRMED;
    
    const savedAppointment = await this.appointmentsRepository.save(appointment);

    // Send confirmation notification (temporarily disabled - no Redis)
    // await this.notificationsQueue.add('appointment-confirmed', {
    //   appointmentId: savedAppointment.id,
    //   patientEmail: savedAppointment.patientEmail,
    //   patientPhone: savedAppointment.patientPhone,
    // });

    return savedAppointment;
  }

  async complete(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = AppointmentStatus.COMPLETED;
    return this.appointmentsRepository.save(appointment);
  }

  async markNoShow(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = AppointmentStatus.NO_SHOW;
    return this.appointmentsRepository.save(appointment);
  }

  async getAppointmentsByDoctor(doctorId: string, date: string): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: {
        doctorId,
        date,
        status: AppointmentStatus.CONFIRMED,
      },
      order: { startTime: 'ASC' },
    });
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = format(new Date(), 'yyyy-MM-dd');
    return this.appointmentsRepository.find({
      where: {
        date: today,
        status: AppointmentStatus.CONFIRMED,
      },
      relations: ['doctor'],
      order: { startTime: 'ASC' },
    });
  }

  // Get appointments that need reminders (24 hours before)
  async getAppointmentsForReminders(): Promise<Appointment[]> {
    const tomorrow = format(addMinutes(new Date(), 24 * 60), 'yyyy-MM-dd');
    return this.appointmentsRepository.find({
      where: {
        date: tomorrow,
        status: AppointmentStatus.CONFIRMED,
        reminderSent: false,
      },
      relations: ['doctor'],
    });
  }

  async markReminderSent(id: string): Promise<void> {
    await this.appointmentsRepository.update(id, { reminderSent: true });
  }

  /** Doctors available at the given date and time slot (for date-first booking flow) */
  async getAvailableDoctorsAtSlot(date: string, time: string): Promise<Doctor[]> {
    const timeNorm = time?.length === 5 ? time : (time || '').substring(0, 5);
    if (!timeNorm || !date) return [];

    const timeDb = toTimeString(time);
    const { data: doctors } = await this.doctorsService.findAll({
      page: 1,
      limit: 100,
      sortBy: 'name',
      sortOrder: 'asc',
    });

    const available: Doctor[] = [];
    for (const doctor of doctors) {
      const slots = await this.doctorsService.getAvailableSlots(doctor.id, date);
      const hasSlot = slots.some((s) => {
        const st = s.startTime?.length === 5 ? s.startTime : (s.startTime || '').substring(0, 5);
        return st === timeNorm;
      });
      if (!hasSlot) continue;

      const booked = await this.appointmentsRepository.findOne({
        where: {
          doctorId: doctor.id,
          date,
          startTime: timeDb,
          status: AppointmentStatus.PENDING,
        },
      });
      if (booked) continue;
      const confirmed = await this.appointmentsRepository.findOne({
        where: {
          doctorId: doctor.id,
          date,
          startTime: timeDb,
          status: AppointmentStatus.CONFIRMED,
        },
      });
      if (confirmed) continue;
      available.push(doctor);
    }
    return available;
  }
}
