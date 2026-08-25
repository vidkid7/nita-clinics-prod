import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentGateway, PaymentInitResult, PaymentVerificationResult } from './payment-gateway.interface';
import { PaymentTransaction } from '../entities/payment-transaction.entity';

@Injectable()
export class KhaltiGateway implements PaymentGateway {
  private readonly logger = new Logger(KhaltiGateway.name);

  constructor(private readonly configService: ConfigService) {}

  async initiatePayment(transaction: PaymentTransaction): Promise<PaymentInitResult> {
    const secretKey = this.configService.get('KHALTI_SECRET_KEY');
    const baseUrl = this.configService.get('KHALTI_BASE_URL') || 'https://a.khalti.com';
    const appUrl = this.configService.get('APP_URL') || 'http://localhost:3002';

    if (!secretKey) {
      return { status: 'failed', error: 'Khalti secret key is not configured' };
    }

    // Use Khalti e-Payment API v2 to initiate payment server-side
    const amountInPaisa = Math.round(Number(transaction.amount) * 100);
    const initiateBody = {
      return_url: `${appUrl}/payment/khalti/callback`,
      website_url: appUrl,
      amount: amountInPaisa,
      purchase_order_id: transaction.reference,
      purchase_order_name: transaction.purpose || 'healthcare-payment',
    };

    try {
      const response = await fetch(`${baseUrl}/api/v2/epayment/initiate/`, {
        method: 'POST',
        headers: {
          Authorization: `Key ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initiateBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.logger.error(`Khalti initiate failed: ${response.status}`, errorData);
        return {
          status: 'failed',
          error: `Khalti initiation failed: ${JSON.stringify(errorData)}`,
        };
      }

      const data = await response.json();
      this.logger.log(`Khalti payment initiated: pidx=${data.pidx}, ref=${transaction.reference}`);

      return {
        status: 'pending',
        redirectUrl: data.payment_url,
        providerReferenceId: data.pidx,
        raw: { gateway: 'khalti', pidx: data.pidx, payment_url: data.payment_url },
      };
    } catch (error) {
      this.logger.error('Khalti initiation error', error);
      return { status: 'failed', error: String(error) };
    }
  }

  async verifyPayment(
    transaction: PaymentTransaction,
    payload?: Record<string, unknown>,
  ): Promise<PaymentVerificationResult> {
    const secretKey = this.configService.get('KHALTI_SECRET_KEY');
    const baseUrl = this.configService.get('KHALTI_BASE_URL') || 'https://a.khalti.com';

    if (!secretKey) {
      return { status: 'failed', error: 'Khalti secret key not configured' };
    }

    // Extract pidx from callback payload
    const pidx = String(payload?.pidx || payload?.transaction_id || '');
    if (!pidx) {
      this.logger.warn('Khalti verification: missing pidx');
      return { status: 'failed', error: 'Missing Khalti payment identifier (pidx)' };
    }

    try {
      // Server-side verification: call Khalti lookup API
      const response = await fetch(`${baseUrl}/api/v2/epayment/lookup/`, {
        method: 'POST',
        headers: {
          Authorization: `Key ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pidx }),
      });

      if (!response.ok) {
        this.logger.error(`Khalti lookup API failed: ${response.status}`);
        return { status: 'failed', error: 'Khalti verification API call failed' };
      }

      const data = await response.json();
      this.logger.log(`Khalti lookup response: status=${data.status}, pidx=${pidx}`);

      // Verify payment status is Completed
      if (data.status !== 'Completed') {
        this.logger.warn(`Khalti payment not completed: ${data.status}`);
        return {
          status: data.status === 'Pending' ? 'pending' : 'failed',
          providerTransactionId: data.transaction_id,
          raw: data,
          error: `Payment status: ${data.status}`,
        };
      }

      // Verify purchase_order_id matches our transaction reference
      if (data.purchase_order_id && data.purchase_order_id !== transaction.reference) {
        this.logger.error(
          `Khalti order ID mismatch: expected=${transaction.reference}, got=${data.purchase_order_id}`,
        );
        return {
          status: 'failed',
          raw: data,
          error: 'Payment reference mismatch - possible fraud attempt',
        };
      }

      // Verify amount (Khalti returns amount in paisa)
      const verifiedAmount = data.total_amount / 100;
      const requestedAmount = Number(transaction.amount);
      if (Math.abs(verifiedAmount - requestedAmount) > 0.01) {
        this.logger.error(
          `Khalti amount mismatch: requested=${requestedAmount}, verified=${verifiedAmount}`,
        );
        return {
          status: 'failed',
          raw: data,
          error: `Amount mismatch: requested ${requestedAmount}, paid ${verifiedAmount}`,
        };
      }

      this.logger.log(
        `Khalti payment verified: pidx=${pidx}, txn=${data.transaction_id}, amt=${verifiedAmount}`,
      );

      return {
        status: 'success',
        providerTransactionId: data.transaction_id || pidx,
        raw: data,
      };
    } catch (error) {
      this.logger.error('Khalti verification error', error);
      return { status: 'failed', error: `Khalti verification failed: ${String(error)}` };
    }
  }
}
