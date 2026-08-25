import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { Doctor } from './entities/doctor.entity';
import { DoctorAvailability } from './entities/doctor-availability.entity';
import { DoctorLeave } from './entities/doctor-leave.entity';

const mockDoc = (overrides = {}): Doctor =>
  ({
    id: 'doc-1',
    name: 'Dr. Jane Smith',
    email: 'jane@example.com',
    phone: '9999999999',
    qualification: 'MBBS',
    specialization: 'General',
    departmentId: 'dept-1',
    isActive: true,
    experience: 5,
    ...overrides,
  } as Doctor);

const mockAvailability = (overrides = {}): DoctorAvailability =>
  ({
    id: 'avail-1',
    doctorId: 'doc-1',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
    isActive: true,
    ...overrides,
  } as DoctorAvailability);

const makeQueryBuilder = (results: any[], count = 0) => ({
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([results, count]),
});

describe('DoctorsService', () => {
  let service: DoctorsService;
  let doctorsRepo: ReturnType<typeof mockRepository>;
  let availabilityRepo: ReturnType<typeof mockRepository>;
  let leaveRepo: ReturnType<typeof mockRepository>;

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorsService,
        { provide: getRepositoryToken(Doctor), useFactory: mockRepository },
        { provide: getRepositoryToken(DoctorAvailability), useFactory: mockRepository },
        { provide: getRepositoryToken(DoctorLeave), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<DoctorsService>(DoctorsService);
    doctorsRepo = module.get(getRepositoryToken(Doctor));
    availabilityRepo = module.get(getRepositoryToken(DoctorAvailability));
    leaveRepo = module.get(getRepositoryToken(DoctorLeave));
  });

  describe('create', () => {
    it('creates and saves a doctor', async () => {
      const dto = { name: 'Dr. A', email: 'a@b.com', phone: '123', qualification: 'MD', specialization: 'Cardio', departmentId: 'd1', experience: 3 };
      const doc = mockDoc();
      doctorsRepo.create.mockReturnValue(doc);
      doctorsRepo.save.mockResolvedValue(doc);

      const result = await service.create(dto as any);
      expect(doctorsRepo.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(doc);
    });
  });

  describe('findAll', () => {
    it('returns paginated doctors', async () => {
      const doc = mockDoc();
      const qb = makeQueryBuilder([doc], 1);
      doctorsRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual([doc]);
      expect(result.total).toBe(1);
    });

    it('filters by search and departmentId', async () => {
      const qb = makeQueryBuilder([], 0);
      doctorsRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ page: 1, limit: 10, search: 'cardio', departmentId: 'dept-1' });
      expect(qb.andWhere).toHaveBeenCalledTimes(3); // search, departmentId, isActive
    });
  });

  describe('findOne', () => {
    it('returns a doctor when found', async () => {
      const doc = mockDoc();
      doctorsRepo.findOne.mockResolvedValue(doc);

      const result = await service.findOne('doc-1');
      expect(result).toBe(doc);
    });

    it('throws NotFoundException when not found', async () => {
      doctorsRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates doctor properties', async () => {
      const doc = mockDoc();
      doctorsRepo.findOne.mockResolvedValue(doc);
      doctorsRepo.save.mockResolvedValue({ ...doc, experience: 10 });

      const result = await service.update('doc-1', { experience: 10 } as any);
      expect(result.experience).toBe(10);
    });

    it('sets photo to null when empty string passed', async () => {
      const doc = mockDoc({ photo: 'old.jpg' });
      doctorsRepo.findOne.mockResolvedValue(doc);
      doctorsRepo.save.mockImplementation((d) => Promise.resolve(d));

      await service.update('doc-1', { photo: '' } as any);
      expect((doc as any).photo).toBeNull();
    });
  });

  describe('remove', () => {
    it('removes a doctor', async () => {
      const doc = mockDoc();
      doctorsRepo.findOne.mockResolvedValue(doc);
      doctorsRepo.remove.mockResolvedValue(undefined);

      await expect(service.remove('doc-1')).resolves.toBeUndefined();
      expect(doctorsRepo.remove).toHaveBeenCalledWith(doc);
    });

    it('throws NotFoundException for missing doctor', async () => {
      doctorsRepo.findOne.mockResolvedValue(null);
      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('setAvailability', () => {
    it('creates availability when none exists', async () => {
      const doc = mockDoc();
      doctorsRepo.findOne.mockResolvedValue(doc);
      availabilityRepo.findOne.mockResolvedValue(null);
      const avail = mockAvailability();
      availabilityRepo.create.mockReturnValue(avail);
      availabilityRepo.save.mockResolvedValue(avail);

      const dto = { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true };
      const result = await service.setAvailability('doc-1', dto as any);
      expect(availabilityRepo.create).toHaveBeenCalled();
      expect(result).toBe(avail);
    });

    it('updates availability when it already exists for that day', async () => {
      const doc = mockDoc();
      doctorsRepo.findOne.mockResolvedValue(doc);
      const existingAvail = mockAvailability();
      availabilityRepo.findOne.mockResolvedValue(existingAvail);
      availabilityRepo.save.mockImplementation((a) => Promise.resolve(a));

      const dto = { dayOfWeek: 1, startTime: '10:00', endTime: '18:00', isActive: true };
      const result = await service.setAvailability('doc-1', dto as any);
      expect(availabilityRepo.create).not.toHaveBeenCalled();
      expect(result.startTime).toBe('10:00');
    });
  });

  describe('getAvailabilities', () => {
    it('returns active availabilities ordered by day', async () => {
      const avails = [mockAvailability()];
      availabilityRepo.find.mockResolvedValue(avails);

      const result = await service.getAvailabilities('doc-1');
      expect(availabilityRepo.find).toHaveBeenCalledWith({
        where: { doctorId: 'doc-1', isActive: true },
        order: { dayOfWeek: 'ASC' },
      });
      expect(result).toEqual(avails);
    });
  });
});
