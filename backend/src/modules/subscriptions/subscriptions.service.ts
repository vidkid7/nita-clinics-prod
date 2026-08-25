import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  // ─── Plans ──────────────────────────────────────────────────────────────────

  findAllPlans(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };
    return this.planRepository.find({ where, order: { order: 'ASC', name: 'ASC' } });
  }

  async findPlan(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) throw new NotFoundException(`Subscription plan ${id} not found`);
    return plan;
  }

  createPlan(dto: CreateSubscriptionPlanDto) {
    const plan = this.planRepository.create(dto);
    return this.planRepository.save(plan);
  }

  async updatePlan(id: string, dto: Partial<CreateSubscriptionPlanDto>) {
    const plan = await this.findPlan(id);
    Object.assign(plan, dto);
    return this.planRepository.save(plan);
  }

  async removePlan(id: string) {
    const plan = await this.findPlan(id);
    await this.planRepository.remove(plan);
  }

  // ─── Subscriptions ───────────────────────────────────────────────────────────

  async findAllSubscriptions(patientId?: string) {
    const where = patientId ? { patientId } : {};
    return this.subscriptionRepository.find({ where, order: { createdAt: 'DESC' } });
  }

  async findSubscription(id: string) {
    const sub = await this.subscriptionRepository.findOne({ where: { id } });
    if (!sub) throw new NotFoundException(`Subscription ${id} not found`);
    return sub;
  }

  async createSubscription(dto: CreateSubscriptionDto) {
    const plan = await this.findPlan(dto.planId);
    const sub = this.subscriptionRepository.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      currency: plan.currency,
      status: SubscriptionStatus.ACTIVE,
    });
    return this.subscriptionRepository.save(sub);
  }

  async cancelSubscription(id: string, cancelledBy: string) {
    const sub = await this.findSubscription(id);
    sub.status = SubscriptionStatus.CANCELLED;
    sub.cancelledAt = new Date();
    sub.cancelledBy = cancelledBy;
    return this.subscriptionRepository.save(sub);
  }

  async findByPatientId(patientId: string) {
    return this.subscriptionRepository.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });
  }
}
