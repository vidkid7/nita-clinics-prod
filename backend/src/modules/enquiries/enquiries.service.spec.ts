import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bull';
import { EnquiriesService } from './enquiries.service';
import { Enquiry, EnquiryStatus, EnquiryType } from './entities/enquiry.entity';

const mockEnquiry = (overrides = {}): Enquiry =>
  ({
    id: 'enq-1',
    name: 'Alice',
    email: 'alice@example.com',
    subject: 'Test Subject',
    message: 'Test message',
    type: EnquiryType.GENERAL,
    status: EnquiryStatus.NEW,
    ...overrides,
  } as Enquiry);

const makeQueryBuilder = (results: any[], count = 0) => ({
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([results, count]),
});

describe('EnquiriesService', () => {
  let service: EnquiriesService;
  let enquiriesRepo: any;
  let notificationsQueue: any;

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  });

  const mockQueue = () => ({
    add: jest.fn().mockResolvedValue({}),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnquiriesService,
        { provide: getRepositoryToken(Enquiry), useFactory: mockRepository },
        { provide: getQueueToken('notifications'), useFactory: mockQueue },
      ],
    }).compile();

    service = module.get<EnquiriesService>(EnquiriesService);
    enquiriesRepo = module.get(getRepositoryToken(Enquiry));
    notificationsQueue = module.get(getQueueToken('notifications'));
  });

  describe('create', () => {
    it('creates and queues a notification', async () => {
      const enquiry = mockEnquiry();
      enquiriesRepo.create.mockReturnValue(enquiry);
      enquiriesRepo.save.mockResolvedValue(enquiry);

      const dto = { name: 'Alice', email: 'alice@example.com', subject: 'Test', message: 'Hello', type: EnquiryType.GENERAL };
      const result = await service.create(dto as any);
      expect(result).toBe(enquiry);
      expect(notificationsQueue.add).toHaveBeenCalledWith('new-enquiry', expect.objectContaining({ enquiryId: 'enq-1' }));
    });

    it('still saves if queue throws', async () => {
      const enquiry = mockEnquiry();
      enquiriesRepo.create.mockReturnValue(enquiry);
      enquiriesRepo.save.mockResolvedValue(enquiry);
      notificationsQueue.add.mockRejectedValue(new Error('Queue down'));

      const result = await service.create({ name: 'Alice', email: 'a@b.com', subject: 'S', message: 'M', type: EnquiryType.GENERAL } as any);
      expect(result).toBe(enquiry);
    });
  });

  describe('findAll', () => {
    it('returns paginated enquiries', async () => {
      const enq = mockEnquiry();
      const qb = makeQueryBuilder([enq], 1);
      enquiriesRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual([enq]);
      expect(result.total).toBe(1);
    });

    it('filters by type and status', async () => {
      const qb = makeQueryBuilder([], 0);
      enquiriesRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ page: 1, limit: 10, type: EnquiryType.APPOINTMENT, status: EnquiryStatus.NEW });
      expect(qb.andWhere).toHaveBeenCalledTimes(2);
    });
  });

  describe('findOne', () => {
    it('returns an enquiry when found', async () => {
      const enq = mockEnquiry();
      enquiriesRepo.findOne.mockResolvedValue(enq);
      await expect(service.findOne('enq-1')).resolves.toBe(enq);
    });

    it('throws NotFoundException when not found', async () => {
      enquiriesRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates an enquiry', async () => {
      const enq = mockEnquiry();
      enquiriesRepo.findOne.mockResolvedValue(enq);
      enquiriesRepo.save.mockImplementation((e: any) => Promise.resolve(e));

      const result = await service.update('enq-1', { status: EnquiryStatus.IN_PROGRESS } as any);
      expect(result.status).toBe(EnquiryStatus.IN_PROGRESS);
    });
  });

  describe('respond', () => {
    it('sets response, respondedAt and RESOLVED status', async () => {
      const enq = mockEnquiry();
      enquiriesRepo.findOne.mockResolvedValue(enq);
      enquiriesRepo.save.mockImplementation((e: any) => Promise.resolve(e));

      const result = await service.respond('enq-1', 'Your issue has been resolved.');
      expect(result.response).toBe('Your issue has been resolved.');
      expect(result.status).toBe(EnquiryStatus.RESOLVED);
      expect(result.respondedAt).toBeInstanceOf(Date);
      expect(notificationsQueue.add).toHaveBeenCalledWith('enquiry-response', expect.objectContaining({ enquiryId: 'enq-1' }));
    });

    it('still saves if notification queue fails', async () => {
      const enq = mockEnquiry();
      enquiriesRepo.findOne.mockResolvedValue(enq);
      enquiriesRepo.save.mockImplementation((e: any) => Promise.resolve(e));
      notificationsQueue.add.mockRejectedValue(new Error('Queue down'));

      const result = await service.respond('enq-1', 'Response');
      expect(result.response).toBe('Response');
    });
  });

  describe('assignTo', () => {
    it('assigns enquiry to a user and sets IN_PROGRESS', async () => {
      const enq = mockEnquiry();
      enquiriesRepo.findOne.mockResolvedValue(enq);
      enquiriesRepo.save.mockImplementation((e: any) => Promise.resolve(e));

      const result = await service.assignTo('enq-1', 'user-42');
      expect(result.assignedTo).toBe('user-42');
      expect(result.status).toBe(EnquiryStatus.IN_PROGRESS);
    });
  });
});
