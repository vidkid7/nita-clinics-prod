import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { DoctorsService } from '../doctors/doctors.service';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeAppointment = (overrides: Partial<Appointment> = {}): Appointment =>
  ({
    id: 'appt-1',
    doctorId: 'doc-1',
    patientName: 'Test Patient',
    patientEmail: 'patient@test.com',
    patientPhone: '0123456789',
    date: '2026-06-01',
    startTime: '09:00:00',
    endTime: '09:30:00',
    status: AppointmentStatus.PENDING,
    cancellationReason: undefined,
    reminderSent: false,
    confirmationSent: false,
    notes: '',
    doctor: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as unknown as Appointment);

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findAndCount: jest.fn(),
  createQueryBuilder: jest.fn(),
  update: jest.fn(),
};

const mockDoctorsService = {
  getAvailableSlots: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: getRepositoryToken(Appointment), useValue: mockRepository },
        { provide: DoctorsService, useValue: mockDoctorsService },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    jest.clearAllMocks();
  });

  // ─── create ──────────────────────────────────────────────────────────────

  describe('create', () => {
    const createDto = {
      doctorId: 'doc-1',
      patientName: 'Test Patient',
      patientEmail: 'patient@test.com',
      patientPhone: '0123456789',
      date: '2026-06-01',
      startTime: '09:00',
    };

    it('should create appointment when slot is available', async () => {
      const slots = [{ startTime: '09:00', endTime: '09:30' }];
      mockDoctorsService.getAvailableSlots.mockResolvedValue(slots);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(makeAppointment());
      mockRepository.save.mockResolvedValue(makeAppointment());

      const appt = await service.create(createDto);
      expect(appt.status).toBe(AppointmentStatus.PENDING);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when no slots available', async () => {
      mockDoctorsService.getAvailableSlots.mockResolvedValue([]);
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when slot is not in available list', async () => {
      mockDoctorsService.getAvailableSlots.mockResolvedValue([
        { startTime: '10:00', endTime: '10:30' },
      ]);
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when slot is already booked (PENDING)', async () => {
      mockDoctorsService.getAvailableSlots.mockResolvedValue([{ startTime: '09:00', endTime: '09:30' }]);
      mockRepository.findOne.mockResolvedValueOnce(makeAppointment()); // pending exists
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when slot is already booked (CONFIRMED)', async () => {
      mockDoctorsService.getAvailableSlots.mockResolvedValue([{ startTime: '09:00', endTime: '09:30' }]);
      mockRepository.findOne
        .mockResolvedValueOnce(null)                               // no pending
        .mockResolvedValueOnce(makeAppointment({ status: AppointmentStatus.CONFIRMED })); // confirmed
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  // ─── findOne ─────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return appointment by id', async () => {
      mockRepository.findOne.mockResolvedValue(makeAppointment());
      const appt = await service.findOne('appt-1');
      expect(appt.id).toBe('appt-1');
    });

    it('should throw NotFoundException when id does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── cancel ──────────────────────────────────────────────────────────────

  describe('cancel', () => {
    it('should set status to CANCELLED', async () => {
      mockRepository.findOne.mockResolvedValue(makeAppointment());
      mockRepository.save.mockResolvedValue(makeAppointment({ status: AppointmentStatus.CANCELLED }));

      const result = await service.cancel('appt-1', 'Patient request');
      expect(result.status).toBe(AppointmentStatus.CANCELLED);
    });

    it('should store cancellationReason', async () => {
      const appt = makeAppointment();
      mockRepository.findOne.mockResolvedValue(appt);
      mockRepository.save.mockImplementation(async (a) => a);

      const result = await service.cancel('appt-1', 'changed mind');
      expect(result.cancellationReason).toBe('changed mind');
    });

    it('should throw NotFoundException for non-existent appointment', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.cancel('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── confirm ─────────────────────────────────────────────────────────────

  describe('confirm', () => {
    it('should set status to CONFIRMED', async () => {
      mockRepository.findOne.mockResolvedValue(makeAppointment());
      mockRepository.save.mockResolvedValue(makeAppointment({ status: AppointmentStatus.CONFIRMED }));

      const result = await service.confirm('appt-1');
      expect(result.status).toBe(AppointmentStatus.CONFIRMED);
    });

    it('should throw NotFoundException for non-existent appointment', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.confirm('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── complete ────────────────────────────────────────────────────────────

  describe('complete', () => {
    it('should set status to COMPLETED', async () => {
      mockRepository.findOne.mockResolvedValue(makeAppointment({ status: AppointmentStatus.CONFIRMED }));
      mockRepository.save.mockResolvedValue(makeAppointment({ status: AppointmentStatus.COMPLETED }));

      const result = await service.complete('appt-1');
      expect(result.status).toBe(AppointmentStatus.COMPLETED);
    });
  });

  // ─── markNoShow ──────────────────────────────────────────────────────────

  describe('markNoShow', () => {
    it('should set status to NO_SHOW', async () => {
      mockRepository.findOne.mockResolvedValue(makeAppointment());
      mockRepository.save.mockResolvedValue(makeAppointment({ status: AppointmentStatus.NO_SHOW }));

      const result = await service.markNoShow('appt-1');
      expect(result.status).toBe(AppointmentStatus.NO_SHOW);
    });
  });

  // ─── update ──────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should merge and save updated fields', async () => {
      const appt = makeAppointment();
      mockRepository.findOne.mockResolvedValue(appt);
      mockRepository.save.mockImplementation(async (a) => a);

      const result = await service.update('appt-1', { notes: 'Updated note' });
      expect(result.notes).toBe('Updated note');
    });

    it('should throw NotFoundException when appointment not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.update('bad-id', { notes: 'x' })).rejects.toThrow(NotFoundException);
    });
  });

  // ─── getTodayAppointments ─────────────────────────────────────────────────

  describe('getTodayAppointments', () => {
    it('should return confirmed appointments for today', async () => {
      const appts = [makeAppointment({ status: AppointmentStatus.CONFIRMED })];
      mockRepository.find.mockResolvedValue(appts);

      const result = await service.getTodayAppointments();
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no appointments today', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.getTodayAppointments();
      expect(result).toEqual([]);
    });
  });

  // ─── findByPatientEmail ───────────────────────────────────────────────────

  describe('findByPatientEmail', () => {
    const makeQb = (rows: Appointment[], total: number) => {
      const qb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([rows, total]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(qb);
      return qb;
    };

    it('should return paginated appointments for patient email', async () => {
      makeQb([makeAppointment()], 1);
      const result = await service.findByPatientEmail('patient@test.com', { page: 1, limit: 10 });
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });

    it('should return empty result when no appointments found', async () => {
      makeQb([], 0);
      const result = await service.findByPatientEmail('nobody@test.com', { page: 1, limit: 10 });
      expect(result.total).toBe(0);
      expect(result.data).toHaveLength(0);
    });

    it('should match email case-insensitively', async () => {
      const qb = makeQb([makeAppointment()], 1);
      await service.findByPatientEmail('  PATIENT@TEST.COM  ', { page: 1, limit: 5 });
      expect(qb.where).toHaveBeenCalledWith(
        'LOWER(TRIM(appointment.patientEmail)) = :email',
        { email: 'patient@test.com' },
      );
    });
  });

  // ─── Edge cases ──────────────────────────────────────────────────────────

  describe('edge cases', () => {
    it('should handle startTime with seconds format (HH:mm:ss)', async () => {
      const createDto = {
        doctorId: 'doc-1',
        patientName: 'Test',
        patientEmail: 'p@test.com',
        patientPhone: '123',
        date: '2026-06-01',
        startTime: '09:00:00', // already includes seconds
      };
      mockDoctorsService.getAvailableSlots.mockResolvedValue([{ startTime: '09:00', endTime: '09:30' }]);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(makeAppointment());
      mockRepository.save.mockResolvedValue(makeAppointment());

      await expect(service.create(createDto)).resolves.toBeDefined();
    });
  });
});
