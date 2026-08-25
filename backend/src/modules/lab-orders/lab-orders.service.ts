import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { LabOrder, LabOrderPaymentStatus, LabOrderStatus, CollectionType } from './entities/lab-order.entity';
import { PaymentPurpose, PaymentTransaction } from '../payments/entities/payment-transaction.entity';
import { LabOrderItem } from './entities/lab-order-item.entity';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { UpdateLabOrderDto } from './dto/update-lab-order.dto';
import { UpdateLabOrderItemDto } from './dto/update-lab-order-item.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
import { PatientsService } from '../patients/patients.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class LabOrdersService {
  constructor(
    @InjectRepository(LabOrder)
    private readonly orderRepository: Repository<LabOrder>,
    @InjectRepository(LabOrderItem)
    private readonly itemRepository: Repository<LabOrderItem>,
    private readonly patientsService: PatientsService,
  ) {}

  private generateOrderNumber(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = uuidv4().slice(0, 4).toUpperCase();
    return `LO-${ts}-${rand}`;
  }

  async create(dto: CreateLabOrderDto) {
    const emailNorm = dto.patientEmail.trim().toLowerCase();
    let patientId = dto.patientId;
    if (!patientId && emailNorm) {
      try {
        const p = await this.patientsService.findByEmail(emailNorm);
        if (p) patientId = p.id;
      } catch {
        /* no profile */
      }
    }
    const totalAmount = dto.items.reduce((sum, item) => sum + Number(item.price), 0);
    const order = this.orderRepository.create({
      orderNumber: this.generateOrderNumber(),
      patientId,
      patientName: dto.patientName.trim(),
      patientEmail: emailNorm,
      patientPhone: dto.patientPhone.trim(),
      collectionType: dto.collectionType,
      collectionDate: dto.collectionDate,
      collectionTime: dto.collectionTime,
      notes: dto.notes,
      totalAmount,
      items: dto.items.map((item) =>
        this.itemRepository.create({
          testId: item.testId,
          testName: item.testName,
          price: item.price,
        }),
      ),
    });
    return this.orderRepository.save(order);
  }

  /**
   * After a successful online payment for lab tests, create a paid lab order (idempotent by payment reference).
   */
  async createFromSuccessfulPayment(transaction: PaymentTransaction): Promise<LabOrder | null> {
    if (transaction.purpose !== PaymentPurpose.LAB_TEST) {
      return null;
    }
    const payload = (transaction.requestPayload || {}) as {
      cartItems?: Array<{ testId: string; testName: string; price: number; quantity?: number }>;
      customerPhone?: string;
      productName?: string;
    };
    const rawItems = payload.cartItems;
    if (!rawItems?.length) {
      return null;
    }

    const existing = await this.orderRepository.findOne({
      where: { paymentReference: transaction.reference },
    });
    if (existing) {
      return existing;
    }

    const email = (transaction.customerEmail || '').trim().toLowerCase();
    let patientId: string | undefined;
    if (email) {
      try {
        const p = await this.patientsService.findByEmail(email);
        if (p) patientId = p.id;
      } catch {
        /* no profile */
      }
    }

    const items = rawItems.map((i) => ({
      testId: String(i.testId || ''),
      testName: String(i.testName || 'Lab test'),
      price: Number(i.price) * Number(i.quantity ?? 1),
    }));
    const totalAmount = items.reduce((s, i) => s + i.price, 0);
    const phone = (payload.customerPhone || '').trim() || '—';

    const order = this.orderRepository.create({
      orderNumber: this.generateOrderNumber(),
      patientId,
      patientName: (transaction.customerName || 'Customer').trim(),
      patientEmail: email || 'unknown@customer.local',
      patientPhone: phone,
      collectionType: CollectionType.CLINIC,
      totalAmount,
      currency: transaction.currency || 'NPR',
      paymentStatus: LabOrderPaymentStatus.PAID,
      paymentReference: transaction.reference,
      status: LabOrderStatus.PLACED,
      notes: payload.productName ? `Online: ${payload.productName}` : 'Paid online',
      items: items.map((item) =>
        this.itemRepository.create({
          testId: item.testId,
          testName: item.testName,
          price: item.price,
        }),
      ),
    });
    return this.orderRepository.save(order);
  }

  async findAll(pagination: PaginationDto, status?: LabOrderStatus, patientId?: string) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const qb = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.patient', 'patient');

    if (status) {
      qb.andWhere('order.status = :status', { status });
    }
    if (patientId) {
      qb.andWhere('order.patientId = :patientId', { patientId });
    }

    qb.orderBy(`order.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'patient'],
    });
    if (!order) throw new NotFoundException(`Lab order ${id} not found`);
    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.orderRepository.findOne({
      where: { orderNumber },
      relations: ['items', 'patient'],
    });
    if (!order) throw new NotFoundException(`Lab order ${orderNumber} not found`);
    return order;
  }

  async findByPatientId(patientId: string, pagination: PaginationDto) {
    return this.findAll(pagination, undefined, patientId);
  }

  async findByUserId(userId: string, pagination: PaginationDto) {
    const patient = await this.patientsService.findByUserId(userId).catch(() => null);
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    if (!patient) {
      return new PaginatedResponseDto([], 0, page, limit);
    }

    const emailNorm = (patient.email ?? '').trim().toLowerCase();
    const qb = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.patient', 'patient')
      .where(
        '(order.patientId = :pid OR LOWER(TRIM(order.patientEmail)) = :email)',
        { pid: patient.id, email: emailNorm },
      );

    qb.orderBy(`order.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC').skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResponseDto(data, total, page, limit);
  }

  async update(id: string, dto: UpdateLabOrderDto) {
    const order = await this.findOne(id);
    Object.assign(order, dto);
    return this.orderRepository.save(order);
  }

  async updateItemStatus(itemId: string, dto: UpdateLabOrderItemDto) {
    const item = await this.itemRepository.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException(`Lab order item ${itemId} not found`);
    Object.assign(item, dto);
    return this.itemRepository.save(item);
  }

  async cancel(id: string, requester: { id: string; email: string; role: UserRole }) {
    const order = await this.findOne(id);
    const isAdminOrStaff = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF].includes(requester.role);
    const orderEmail = (order.patientEmail || '').trim().toLowerCase();
    const reqEmail = (requester.email || '').trim().toLowerCase();
    if (!isAdminOrStaff && orderEmail !== reqEmail) {
      throw new ForbiddenException('You are not authorised to cancel this order');
    }
    order.status = LabOrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }

  async getStats() {
    const total = await this.orderRepository.count();
    const placed = await this.orderRepository.count({ where: { status: LabOrderStatus.PLACED } });
    const confirmed = await this.orderRepository.count({ where: { status: LabOrderStatus.CONFIRMED } });
    const sampleCollected = await this.orderRepository.count({
      where: { status: LabOrderStatus.SAMPLE_COLLECTED },
    });
    const processing = await this.orderRepository.count({ where: { status: LabOrderStatus.PROCESSING } });
    const completed = await this.orderRepository.count({ where: { status: LabOrderStatus.COMPLETED } });
    const cancelled = await this.orderRepository.count({ where: { status: LabOrderStatus.CANCELLED } });
    return {
      total,
      placed,
      confirmed,
      sample_collected: sampleCollected,
      processing,
      completed,
      cancelled,
    };
  }
}
