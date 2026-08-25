import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { LabOrdersService } from './lab-orders.service';
import { LabOrder, LabOrderStatus } from './entities/lab-order.entity';
import { LabOrderItem } from './entities/lab-order-item.entity';
import { PatientsService } from '../patients/patients.service';

const mockOrder = (overrides = {}): LabOrder =>
  ({
    id: 'order-1',
    orderNumber: 'LO-ABC-1234',
    patientId: 'patient-1',
    patientName: 'John Doe',
    patientEmail: 'john@example.com',
    patientPhone: '9999999999',
    status: LabOrderStatus.PLACED,
    totalAmount: 500,
    items: [],
    ...overrides,
  } as unknown as LabOrder);

const makeQueryBuilder = (results: any[], count = 0) => ({
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([results, count]),
});

describe('LabOrdersService', () => {
  let service: LabOrdersService;
  let orderRepo: any;
  let itemRepo: any;
  let patientsService: any;

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LabOrdersService,
        { provide: getRepositoryToken(LabOrder), useFactory: mockRepository },
        { provide: getRepositoryToken(LabOrderItem), useFactory: mockRepository },
        {
          provide: PatientsService,
          useValue: { findByUserId: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<LabOrdersService>(LabOrdersService);
    orderRepo = module.get(getRepositoryToken(LabOrder));
    itemRepo = module.get(getRepositoryToken(LabOrderItem));
    patientsService = module.get(PatientsService);
  });

  describe('create', () => {
    it('calculates total and saves order', async () => {
      const dto = {
        patientId: 'patient-1',
        patientName: 'John Doe',
        patientEmail: 'j@d.com',
        patientPhone: '9999',
        collectionType: 'walk-in',
        items: [
          { testId: 't1', testName: 'CBC', price: 200 },
          { testId: 't2', testName: 'LFT', price: 300 },
        ],
      };
      const order = mockOrder({ totalAmount: 500 });
      itemRepo.create.mockImplementation((d: any) => d);
      orderRepo.create.mockReturnValue(order);
      orderRepo.save.mockResolvedValue(order);

      const result = await service.create(dto as any);
      expect(orderRepo.create).toHaveBeenCalledWith(expect.objectContaining({ totalAmount: 500 }));
      expect(result).toBe(order);
    });
  });

  describe('findAll', () => {
    it('returns paginated results', async () => {
      const order = mockOrder();
      const qb = makeQueryBuilder([order], 1);
      orderRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual([order]);
    });

    it('filters by status and patientId', async () => {
      const qb = makeQueryBuilder([], 0);
      orderRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ page: 1, limit: 10 } as any, LabOrderStatus.COMPLETED, 'patient-1');
      expect(qb.andWhere).toHaveBeenCalledTimes(2);
    });
  });

  describe('findOne', () => {
    it('returns the order when found', async () => {
      const order = mockOrder();
      orderRepo.findOne.mockResolvedValue(order);
      await expect(service.findOne('order-1')).resolves.toBe(order);
    });

    it('throws NotFoundException when not found', async () => {
      orderRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUserId', () => {
    it('returns empty when no linked patient', async () => {
      patientsService.findByUserId.mockRejectedValue(new NotFoundException());
      const result = await service.findByUserId('user-1', { page: 1, limit: 10 });
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('delegates to findAll when patient exists', async () => {
      patientsService.findByUserId.mockResolvedValue({
        id: 'patient-1',
        email: 'john@example.com',
      });
      const qb = makeQueryBuilder([mockOrder()], 1);
      orderRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findByUserId('user-1', { page: 1, limit: 10 });
      expect(result.data.length).toBe(1);
    });
  });

  describe('update', () => {
    it('updates an order', async () => {
      const order = mockOrder();
      orderRepo.findOne.mockResolvedValue(order);
      orderRepo.save.mockImplementation((o: any) => Promise.resolve(o));

      const result = await service.update('order-1', { status: LabOrderStatus.COMPLETED } as any);
      expect(result.status).toBe(LabOrderStatus.COMPLETED);
    });
  });

  describe('updateItemStatus', () => {
    it('throws NotFoundException for missing item', async () => {
      itemRepo.findOne.mockResolvedValue(null);
      await expect(service.updateItemStatus('item-x', {} as any)).rejects.toThrow(NotFoundException);
    });

    it('updates item status', async () => {
      const item = { id: 'item-1', status: 'pending' };
      itemRepo.findOne.mockResolvedValue(item);
      itemRepo.save.mockImplementation((i: any) => Promise.resolve(i));

      const result = await service.updateItemStatus('item-1', { status: 'completed' } as any);
      expect(result.status).toBe('completed');
    });
  });
});
