import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  PaymentGatewayName,
  PaymentPurpose,
  PaymentStatus,
  PaymentTransaction,
} from './entities/payment-transaction.entity';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { UpdatePaymentSettingsDto } from './dto/update-payment-settings.dto';
import { Setting } from '../settings/entities/setting.entity';
import { PaymentGateway } from './gateways/payment-gateway.interface';
import { EsewaGateway } from './gateways/esewa.gateway';
import { KhaltiGateway } from './gateways/khalti.gateway';
import { FonepayGateway } from './gateways/fonepay.gateway';
import { LabOrdersService } from '../lab-orders/lab-orders.service';

const MAX_PAYMENT_AGE_HOURS = 24;

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly gateways: Record<PaymentGatewayName, PaymentGateway>;

  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly transactionRepository: Repository<PaymentTransaction>,
    @InjectRepository(Setting)
    private readonly settingsRepository: Repository<Setting>,
    private readonly labOrdersService: LabOrdersService,
    private readonly configService: ConfigService,
    esewaGateway: EsewaGateway,
    khaltiGateway: KhaltiGateway,
    fonepayGateway: FonepayGateway,
  ) {
    this.gateways = {
      [PaymentGatewayName.ESEWA]: esewaGateway,
      [PaymentGatewayName.KHALTI]: khaltiGateway,
      [PaymentGatewayName.FONEPAY]: fonepayGateway,
    };
  }

  async findByCustomerEmail(email: string, page = 1, limit = 10) {
    const norm = (email || '').trim().toLowerCase();
    const qb = this.transactionRepository
      .createQueryBuilder('t')
      .where('LOWER(TRIM(t.customer_email)) = :email', { email: norm })
      .orderBy('t.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async initiate(dto: InitiatePaymentDto) {
    const reference = `NTC-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;
    const customerEmail = dto.customerEmail?.trim().toLowerCase() || undefined;
    const requestPayload: Record<string, unknown> = {};
    if (dto.productName) requestPayload.productName = dto.productName;
    if (dto.customerPhone?.trim()) requestPayload.customerPhone = dto.customerPhone.trim();
    if (dto.cartItems?.length) requestPayload.cartItems = dto.cartItems;

    const transaction = await this.transactionRepository.save(
      this.transactionRepository.create({
        reference,
        gateway: dto.gateway,
        purpose: dto.purpose || PaymentPurpose.OTHER,
        status: PaymentStatus.INITIALIZED,
        amount: dto.amount,
        currency: dto.currency || 'NPR',
        appointmentId: dto.appointmentId,
        packageId: dto.packageId,
        customerName: dto.customerName?.trim(),
        customerEmail,
        requestPayload: Object.keys(requestPayload).length ? requestPayload : undefined,
        initiatedAt: new Date(),
      }),
    );

    const gateway = this.gateways[dto.gateway];
    if (!gateway) {
      throw new BadRequestException(`Unsupported payment gateway: ${dto.gateway}`);
    }

    const result = await gateway.initiatePayment(transaction, {
      successUrl: dto.successUrl,
      failureUrl: dto.failureUrl,
    });

    transaction.status = result.status === 'failed' ? PaymentStatus.FAILED : PaymentStatus.PENDING;
    transaction.providerReferenceId = result.providerReferenceId || transaction.providerReferenceId;
    transaction.providerTransactionId = result.providerTransactionId || transaction.providerTransactionId;
    transaction.responsePayload = result.raw;
    transaction.errorMessage = result.error;
    await this.transactionRepository.save(transaction);

    return {
      reference: transaction.reference,
      gateway: transaction.gateway,
      status: transaction.status,
      redirectUrl: result.redirectUrl,
      error: result.error,
    };
  }

  /**
   * Marks a payment as successful immediately (no gateway). Disabled in production unless PAYMENT_DEMO_ENABLED=true.
   */
  private assertPaymentDemoAllowed() {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    const explicit = this.configService.get<string>('PAYMENT_DEMO_ENABLED', '') === 'true';
    if (nodeEnv === 'production' && !explicit) {
      throw new ForbiddenException('Demo payment is disabled in production');
    }
  }

  async completeDemoPayment(dto: InitiatePaymentDto) {
    this.assertPaymentDemoAllowed();

    const reference = `NTC-DEMO-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;
    const customerEmail = dto.customerEmail?.trim().toLowerCase() || undefined;
    const requestPayload: Record<string, unknown> = { demo: true };
    if (dto.productName) requestPayload.productName = dto.productName;
    if (dto.customerPhone?.trim()) requestPayload.customerPhone = dto.customerPhone.trim();
    if (dto.cartItems?.length) requestPayload.cartItems = dto.cartItems;

    const transaction = await this.transactionRepository.save(
      this.transactionRepository.create({
        reference,
        gateway: dto.gateway,
        purpose: dto.purpose || PaymentPurpose.OTHER,
        status: PaymentStatus.SUCCESS,
        amount: dto.amount,
        currency: dto.currency || 'NPR',
        appointmentId: dto.appointmentId,
        packageId: dto.packageId,
        customerName: dto.customerName?.trim(),
        customerEmail,
        requestPayload: Object.keys(requestPayload).length ? requestPayload : { demo: true },
        initiatedAt: new Date(),
        completedAt: new Date(),
        responsePayload: { demo: true, note: 'Completed via demo payment (development)' },
      }),
    );

    try {
      await this.labOrdersService.createFromSuccessfulPayment(transaction);
    } catch (err) {
      this.logger.error(
        `Demo lab order fulfillment failed for ${transaction.reference}: ${(err as Error).message}`,
        (err as Error).stack,
      );
    }

    const base = (this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000').replace(
      /\/$/,
      '',
    );
    const redirectUrl = `${base}/payment/demo/success?reference=${encodeURIComponent(reference)}`;

    this.logger.log(`Demo payment completed: ref=${reference}`);

    return {
      reference: transaction.reference,
      gateway: transaction.gateway,
      status: transaction.status,
      redirectUrl,
      demo: true,
    };
  }

  async handleCallback(gateway: PaymentGatewayName, payload: Record<string, unknown>) {
    // Extract reference from payload (different gateways use different field names)
    const reference = String(
      payload.reference || payload.PRN || payload.purchase_order_id || payload.pid || '',
    );
    if (!reference) {
      throw new BadRequestException('Missing payment reference in callback');
    }

    // Validate gateway name
    if (!this.gateways[gateway]) {
      throw new BadRequestException(`Invalid payment gateway: ${gateway}`);
    }

    const transaction = await this.transactionRepository.findOne({
      where: { reference, gateway },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction ${reference} not found for gateway ${gateway}`);
    }

    // Idempotency: if already successfully processed, return existing result
    if (transaction.status === PaymentStatus.SUCCESS) {
      this.logger.warn(`Duplicate callback for already-completed transaction: ${reference}`);
      return transaction;
    }

    // Transaction expiry check
    if (transaction.initiatedAt) {
      const ageMs = Date.now() - new Date(transaction.initiatedAt).getTime();
      if (ageMs > MAX_PAYMENT_AGE_HOURS * 3600 * 1000) {
        this.logger.error(`Expired transaction callback: ${reference}, age=${Math.round(ageMs / 3600000)}h`);
        transaction.status = PaymentStatus.FAILED;
        transaction.errorMessage = 'Transaction expired';
        transaction.callbackPayload = payload;
        await this.transactionRepository.save(transaction);
        throw new BadRequestException('Payment transaction has expired');
      }
    }

    // Store callback payload for audit trail
    transaction.callbackPayload = payload;

    // Delegate verification to the gateway (now includes DV hash checks, API calls, etc.)
    const gatewayService = this.gateways[gateway];
    const verification = await gatewayService.verifyPayment(transaction, payload);

    if (verification.status === 'success') {
      transaction.status = PaymentStatus.SUCCESS;
      transaction.completedAt = new Date();
    } else if (verification.status === 'failed') {
      transaction.status = PaymentStatus.VERIFICATION_FAILED;
      transaction.errorMessage = verification.error || 'Verification failed';
    } else {
      transaction.status = PaymentStatus.PENDING;
    }

    transaction.providerTransactionId =
      verification.providerTransactionId || transaction.providerTransactionId;
    transaction.responsePayload = verification.raw || transaction.responsePayload;
    await this.transactionRepository.save(transaction);

    if (transaction.status === PaymentStatus.SUCCESS) {
      try {
        await this.labOrdersService.createFromSuccessfulPayment(transaction);
      } catch (err) {
        this.logger.error(
          `Lab order fulfillment failed for payment ${transaction.reference}: ${(err as Error).message}`,
          (err as Error).stack,
        );
      }
    }

    this.logger.log(
      `Payment callback processed: ref=${reference}, gateway=${gateway}, status=${transaction.status}`,
    );

    return transaction;
  }

  async verify(reference: string) {
    const transaction = await this.transactionRepository.findOne({ where: { reference } });
    if (!transaction) {
      throw new NotFoundException(`Transaction ${reference} not found`);
    }
    // Return only safe fields for public endpoint
    return {
      reference: transaction.reference,
      status: transaction.status,
      gateway: transaction.gateway,
      amount: transaction.amount,
      currency: transaction.currency,
      purpose: transaction.purpose,
      completedAt: transaction.completedAt,
    };
  }

  listTransactions(limit = 50) {
    return this.transactionRepository.find({
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async getPaymentSettings() {
    const settings = await this.settingsRepository.find({
      where: [{ category: 'payment_gateway' }, { category: 'payment' }],
    });
    return settings.reduce(
      (acc, item) => ({ ...acc, [item.key]: item.value }),
      {} as Record<string, string>,
    );
  }

  async updatePaymentSettings(payload: UpdatePaymentSettingsDto) {
    const pairs: Array<{ key: string; value?: string }> = [
      { key: 'payment_esewa_enabled', value: this.toStringValue(payload.esewaEnabled) },
      { key: 'payment_khalti_enabled', value: this.toStringValue(payload.khaltiEnabled) },
      { key: 'payment_fonepay_enabled', value: this.toStringValue(payload.fonepayEnabled) },
      { key: 'payment_sandbox_mode', value: this.toStringValue(payload.sandboxMode) },
      { key: 'payment_default_currency', value: payload.defaultCurrency },
    ];

    for (const pair of pairs) {
      if (typeof pair.value !== 'string') {
        continue;
      }
      const existing = await this.settingsRepository.findOne({ where: { key: pair.key } });
      if (existing) {
        existing.value = pair.value;
        existing.category = 'payment_gateway';
        await this.settingsRepository.save(existing);
      } else {
        const created = this.settingsRepository.create({
          key: pair.key,
          value: pair.value,
          category: 'payment_gateway',
          description: 'Payment gateway setting',
        });
        await this.settingsRepository.save(created);
      }
    }

    return this.getPaymentSettings();
  }

  private toStringValue(value?: boolean) {
    if (typeof value !== 'boolean') {
      return undefined;
    }
    return value ? 'true' : 'false';
  }
}
