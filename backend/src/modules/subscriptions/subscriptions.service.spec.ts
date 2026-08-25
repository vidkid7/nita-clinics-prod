import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makePlan = (overrides = {}): SubscriptionPlan =>
  ({
    id: 'plan-1',
    name: 'Basic Plan',
    price: 100,
    currency: 'NPR',
    durationMonths: 1,
    isActive: true,
    benefits: [],
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as unknown as SubscriptionPlan);

const makeSub = (overrides = {}): Subscription =>
  ({
    id: 'sub-1',
    planId: 'plan-1',
    patientId: 'patient-1',
    status: SubscriptionStatus.ACTIVE,
    startDate: new Date('2026-04-01'),
    endDate: new Date('2026-05-01'),
    currency: 'NPR',
    cancelledAt: undefined,
    cancelledBy: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as unknown as Subscription);

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPlanRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockSubRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: getRepositoryToken(SubscriptionPlan), useValue: mockPlanRepository },
        { provide: getRepositoryToken(Subscription), useValue: mockSubRepository },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    jest.clearAllMocks();
  });

  // ─── findAllPlans ─────────────────────────────────────────────────────────

  describe('findAllPlans', () => {
    it('should return only active plans by default', async () => {
      mockPlanRepository.find.mockResolvedValue([makePlan()]);
      const result = await service.findAllPlans();
      expect(mockPlanRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isActive: true } })
      );
      expect(result).toHaveLength(1);
    });

    it('should return all plans when includeInactive is true', async () => {
      mockPlanRepository.find.mockResolvedValue([makePlan(), makePlan({ isActive: false })]);
      const result = await service.findAllPlans(true);
      expect(mockPlanRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} })
      );
      expect(result).toHaveLength(2);
    });
  });

  // ─── findPlan ─────────────────────────────────────────────────────────────

  describe('findPlan', () => {
    it('should return plan by id', async () => {
      mockPlanRepository.findOne.mockResolvedValue(makePlan());
      const result = await service.findPlan('plan-1');
      expect(result.id).toBe('plan-1');
    });

    it('should throw NotFoundException when plan not found', async () => {
      mockPlanRepository.findOne.mockResolvedValue(null);
      await expect(service.findPlan('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── createPlan ───────────────────────────────────────────────────────────

  describe('createPlan', () => {
    it('should create and save a plan', async () => {
      const dto = { name: 'Premium', price: 200, durationMonths: 3 };
      mockPlanRepository.create.mockReturnValue(makePlan(dto));
      mockPlanRepository.save.mockResolvedValue(makePlan(dto));

      const result = await service.createPlan(dto as any);
      expect(result.name).toBe('Premium');
      expect(mockPlanRepository.save).toHaveBeenCalled();
    });
  });

  // ─── updatePlan ───────────────────────────────────────────────────────────

  describe('updatePlan', () => {
    it('should update and return modified plan', async () => {
      mockPlanRepository.findOne.mockResolvedValue(makePlan());
      mockPlanRepository.save.mockImplementation(async (p) => p);

      const result = await service.updatePlan('plan-1', { name: 'Updated Name' });
      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException when plan does not exist', async () => {
      mockPlanRepository.findOne.mockResolvedValue(null);
      await expect(service.updatePlan('bad-id', { name: 'x' })).rejects.toThrow(NotFoundException);
    });
  });

  // ─── removePlan ───────────────────────────────────────────────────────────

  describe('removePlan', () => {
    it('should remove an existing plan', async () => {
      mockPlanRepository.findOne.mockResolvedValue(makePlan());
      mockPlanRepository.remove.mockResolvedValue(undefined);

      await expect(service.removePlan('plan-1')).resolves.toBeUndefined();
      expect(mockPlanRepository.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException when plan does not exist', async () => {
      mockPlanRepository.findOne.mockResolvedValue(null);
      await expect(service.removePlan('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── createSubscription ───────────────────────────────────────────────────

  describe('createSubscription', () => {
    it('should create subscription with plan currency and ACTIVE status', async () => {
      mockPlanRepository.findOne.mockResolvedValue(makePlan({ currency: 'NPR' }));
      mockSubRepository.create.mockReturnValue(makeSub());
      mockSubRepository.save.mockResolvedValue(makeSub());

      const dto = {
        planId: 'plan-1',
        patientId: 'pat-1',
        startDate: '2026-04-01',
        endDate: '2026-05-01',
      };
      const result = await service.createSubscription(dto as any);
      expect(result.status).toBe(SubscriptionStatus.ACTIVE);
    });

    it('should throw NotFoundException when plan does not exist', async () => {
      mockPlanRepository.findOne.mockResolvedValue(null);
      await expect(service.createSubscription({ planId: 'bad', patientId: 'p', startDate: '2026-01-01', endDate: '2026-02-01' } as any))
        .rejects.toThrow(NotFoundException);
    });
  });

  // ─── cancelSubscription ───────────────────────────────────────────────────

  describe('cancelSubscription', () => {
    it('should cancel subscription and record cancelledBy', async () => {
      mockSubRepository.findOne.mockResolvedValue(makeSub());
      mockSubRepository.save.mockImplementation(async (s) => s);

      const result = await service.cancelSubscription('sub-1', 'admin@clinic.com');
      expect(result.status).toBe(SubscriptionStatus.CANCELLED);
      expect(result.cancelledBy).toBe('admin@clinic.com');
      expect(result.cancelledAt).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException when subscription not found', async () => {
      mockSubRepository.findOne.mockResolvedValue(null);
      await expect(service.cancelSubscription('bad-id', 'admin')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── findByPatientId ──────────────────────────────────────────────────────

  describe('findByPatientId', () => {
    it('should return subscriptions for a patient', async () => {
      mockSubRepository.find.mockResolvedValue([makeSub()]);
      const result = await service.findByPatientId('patient-1');
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no subscriptions', async () => {
      mockSubRepository.find.mockResolvedValue([]);
      const result = await service.findByPatientId('no-patient');
      expect(result).toEqual([]);
    });
  });
});
