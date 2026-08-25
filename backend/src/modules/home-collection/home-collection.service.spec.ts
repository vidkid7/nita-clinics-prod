import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { HomeCollectionService } from './home-collection.service';
import { HomeCollection, HomeCollectionStatus } from './entities/home-collection.entity';
import { UserRole } from '../users/entities/user.entity';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const adminUser = { id: 'admin-1', email: 'admin@clinic.com', role: UserRole.ADMIN };
const patientUser = { id: 'pat-1', email: 'patient@test.com', role: UserRole.PATIENT };
const otherPatient = { id: 'pat-2', email: 'other@test.com', role: UserRole.PATIENT };

const makeHC = (overrides: Partial<HomeCollection> = {}): HomeCollection =>
  ({
    id: 'hc-1',
    patientName: 'Test Patient',
    patientPhone: '0123456789',
    patientEmail: 'patient@test.com',
    address: '123 Test St',
    preferredDate: '2026-06-01',
    preferredTimeSlot: '10:00',
    status: HomeCollectionStatus.REQUESTED,
    serviceCharge: 0,
    currency: 'NPR',
    collectionNotes: '',
    assignedStaffId: undefined,
    assignedStaffName: undefined,
    completedAt: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: null,
    ...overrides,
  } as unknown as HomeCollection);

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockQb = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn(),
};

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findAndCount: jest.fn(),
  count: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQb),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('HomeCollectionService', () => {
  let service: HomeCollectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeCollectionService,
        { provide: getRepositoryToken(HomeCollection), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<HomeCollectionService>(HomeCollectionService);
    jest.clearAllMocks();
  });

  // ─── create ──────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and save a home collection record', async () => {
      mockRepository.create.mockReturnValue(makeHC());
      mockRepository.save.mockResolvedValue(makeHC());

      const dto = {
        patientName: 'Test Patient',
        patientPhone: '0123456789',
        address: '123 Test St',
        preferredDate: '2026-06-01',
        preferredTimeSlot: '10:00',
      };
      const result = await service.create(dto);
      expect(result.status).toBe(HomeCollectionStatus.REQUESTED);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  // ─── findOne ─────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return record by id', async () => {
      mockRepository.findOne.mockResolvedValue(makeHC());
      const result = await service.findOne('hc-1');
      expect(result.id).toBe('hc-1');
    });

    it('should throw NotFoundException when not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── cancel ──────────────────────────────────────────────────────────────

  describe('cancel', () => {
    it('should allow admin to cancel any request', async () => {
      mockRepository.findOne.mockResolvedValue(makeHC());
      mockRepository.save.mockImplementation(async (r) => r);

      const result = await service.cancel('hc-1', adminUser);
      expect(result.status).toBe(HomeCollectionStatus.CANCELLED);
    });

    it('should allow patient to cancel their own request', async () => {
      mockRepository.findOne.mockResolvedValue(makeHC({ patientEmail: 'patient@test.com' }));
      mockRepository.save.mockImplementation(async (r) => r);

      const result = await service.cancel('hc-1', patientUser);
      expect(result.status).toBe(HomeCollectionStatus.CANCELLED);
    });

    it('should throw ForbiddenException when patient tries to cancel another patient\'s request', async () => {
      mockRepository.findOne.mockResolvedValue(makeHC({ patientEmail: 'patient@test.com' }));
      await expect(service.cancel('hc-1', otherPatient)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when record does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.cancel('bad-id', adminUser)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── assignStaff ─────────────────────────────────────────────────────────

  describe('assignStaff', () => {
    it('should assign staff and change status to ASSIGNED', async () => {
      mockRepository.findOne.mockResolvedValue(makeHC());
      mockRepository.save.mockImplementation(async (r) => r);

      const result = await service.assignStaff('hc-1', 'staff-1', 'John Doe');
      expect(result.status).toBe(HomeCollectionStatus.ASSIGNED);
      expect(result.assignedStaffId).toBe('staff-1');
      expect(result.assignedStaffName).toBe('John Doe');
    });
  });

  // ─── update ──────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update record fields', async () => {
      mockRepository.findOne.mockResolvedValue(makeHC());
      mockRepository.save.mockImplementation(async (r) => r);

      const result = await service.update('hc-1', { collectionNotes: 'call first' });
      expect(result.collectionNotes).toBe('call first');
    });

    it('should set completedAt when status changed to COMPLETED', async () => {
      mockRepository.findOne.mockResolvedValue(makeHC());
      mockRepository.save.mockImplementation(async (r) => r);

      const result = await service.update('hc-1', { status: HomeCollectionStatus.COMPLETED });
      expect((result as any).completedAt).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException when record does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.update('bad-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  // ─── findByPatientEmail ───────────────────────────────────────────────────

  describe('findByPatientEmail', () => {
    it('should return paginated records for email', async () => {
      mockQb.getManyAndCount.mockResolvedValue([[makeHC()], 1]);
      const result = await service.findByPatientEmail('patient@test.com', { page: 1, limit: 10 });
      expect(result.total).toBe(1);
    });

    it('should return empty result when no records', async () => {
      mockQb.getManyAndCount.mockResolvedValue([[], 0]);
      const result = await service.findByPatientEmail('nobody@test.com', { page: 1, limit: 10 });
      expect(result.data).toHaveLength(0);
    });
  });

  // ─── getStats ────────────────────────────────────────────────────────────

  describe('getStats', () => {
    it('should return stats with all counts', async () => {
      mockRepository.count.mockResolvedValue(5);
      const stats = await service.getStats();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('requested');
      expect(stats).toHaveProperty('assigned');
      expect(stats).toHaveProperty('completed');
    });
  });

  // ─── getTodayCollections ─────────────────────────────────────────────────

  describe('getTodayCollections', () => {
    it('should return collections scheduled for today', async () => {
      mockRepository.find.mockResolvedValue([makeHC()]);
      const result = await service.getTodayCollections();
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no collections today', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.getTodayCollections();
      expect(result).toEqual([]);
    });
  });
});
