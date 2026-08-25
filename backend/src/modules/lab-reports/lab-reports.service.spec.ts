import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { LabReportsService } from './lab-reports.service';
import { LabReport } from './entities/lab-report.entity';

const mockReport = (overrides = {}): LabReport =>
  ({
    id: 'report-1',
    patientId: 'patient-1',
    testName: 'CBC',
    reportDate: new Date('2025-01-01'),
    isVerified: false,
    isVisibleToPatient: true,
    ...overrides,
  } as unknown as LabReport);

const makeQueryBuilder = (results: any[], count = 0) => ({
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([results, count]),
});

describe('LabReportsService', () => {
  let service: LabReportsService;
  let reportRepo: any;

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
        LabReportsService,
        { provide: getRepositoryToken(LabReport), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<LabReportsService>(LabReportsService);
    reportRepo = module.get(getRepositoryToken(LabReport));
  });

  describe('create', () => {
    it('creates and saves a report', async () => {
      const report = mockReport();
      reportRepo.create.mockReturnValue(report);
      reportRepo.save.mockResolvedValue(report);

      const dto = { patientId: 'patient-1', testName: 'CBC', reportDate: new Date() };
      const result = await service.create(dto as any, 'user-admin');
      expect(reportRepo.create).toHaveBeenCalledWith(expect.objectContaining({ uploadedBy: 'user-admin' }));
      expect(result).toBe(report);
    });
  });

  describe('findAll', () => {
    it('returns paginated reports', async () => {
      const report = mockReport();
      const qb = makeQueryBuilder([report], 1);
      reportRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual([report]);
    });

    it('filters by patientId and search', async () => {
      const qb = makeQueryBuilder([], 0);
      reportRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ page: 1, limit: 10, search: 'CBC' }, 'patient-1');
      expect(qb.andWhere).toHaveBeenCalledTimes(2); // patientId + search
    });
  });

  describe('findOne', () => {
    it('returns report when found', async () => {
      const report = mockReport();
      reportRepo.findOne.mockResolvedValue(report);
      await expect(service.findOne('report-1')).resolves.toBe(report);
    });

    it('throws NotFoundException when not found', async () => {
      reportRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates report fields', async () => {
      const report = mockReport();
      reportRepo.findOne.mockResolvedValue(report);
      reportRepo.save.mockImplementation((r: any) => Promise.resolve(r));

      const result = await service.update('report-1', { testName: 'LFT' } as any);
      expect(result.testName).toBe('LFT');
    });
  });

  describe('verify', () => {
    it('marks report verified with verifiedBy', async () => {
      const report = mockReport();
      reportRepo.findOne.mockResolvedValue(report);
      reportRepo.save.mockImplementation((r: any) => Promise.resolve(r));

      const result = await service.verify('report-1', 'admin-user');
      expect(result.isVerified).toBe(true);
      expect(result.verifiedBy).toBe('admin-user');
    });
  });

  describe('toggleVisibility', () => {
    it('toggles isVisibleToPatient', async () => {
      const report = mockReport({ isVisibleToPatient: true });
      reportRepo.findOne.mockResolvedValue(report);
      reportRepo.save.mockImplementation((r: any) => Promise.resolve(r));

      const result = await service.toggleVisibility('report-1');
      expect(result.isVisibleToPatient).toBe(false);
    });
  });

  describe('remove', () => {
    it('removes the report', async () => {
      const report = mockReport();
      reportRepo.findOne.mockResolvedValue(report);
      reportRepo.remove.mockResolvedValue(undefined);

      await expect(service.remove('report-1')).resolves.toBeUndefined();
      expect(reportRepo.remove).toHaveBeenCalledWith(report);
    });

    it('throws NotFoundException when not found', async () => {
      reportRepo.findOne.mockResolvedValue(null);
      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByOrderId', () => {
    it('returns reports for an order', async () => {
      const reports = [mockReport()];
      reportRepo.find.mockResolvedValue(reports);

      const result = await service.findByOrderId('order-1');
      expect(result).toEqual(reports);
      expect(reportRepo.find).toHaveBeenCalledWith(expect.objectContaining({ where: { orderId: 'order-1' } }));
    });
  });

  describe('findByPatientUserId', () => {
    it('returns visible reports for a user', async () => {
      const report = mockReport();
      const qb = makeQueryBuilder([report], 1);
      reportRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findByPatientUserId('user-1', { page: 1, limit: 10 });
      expect(result.data).toEqual([report]);
    });
  });
});
