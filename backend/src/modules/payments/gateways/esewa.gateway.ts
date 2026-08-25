import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PaymentGateway, PaymentInitResult, PaymentVerificationResult } from './payment-gateway.interface';
import { PaymentTransaction } from '../entities/payment-transaction.entity';

@Injectable()
export class EsewaGateway implements PaymentGateway {
  private readonly logger = new Logger(EsewaGateway.name);

  constructor(private readonly configService: ConfigService) {}

  async initiatePayment(transaction: PaymentTransaction): Promise<PaymentInitResult> {
    const baseUrl = this.configService.get('ESEWA_BASE_URL') || 'https://rc-epay.esewa.com.np';
    const productCode = this.configService.get('ESEWA_MERCHANT_ID') || this.configService.get('ESEWA_MERCHANT_CODE');
    const secretKey = this.configService.get('ESEWA_SECRET_KEY');
    const appUrl = this.configService.get('APP_URL') || 'http://localhost:3002';
    if (!productCode || !secretKey) {
      return { status: 'failed', error: 'eSewa config is missing (merchant ID or secret)' };
    }

    const totalAmount = Number(transaction.amount).toFixed(2);
    const message = `total_amount=${totalAmount},transaction_uuid=${transaction.reference},product_code=${productCode}`;
    const signature = crypto.createHmac('sha256', secretKey).update(message).digest('base64');
    const query = new URLSearchParams({
      amount: totalAmount,
      tax_amount: '0',
      total_amount: totalAmount,
      transaction_uuid: transaction.reference,
      product_code: productCode,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: `${appUrl}/payment/esewa/success`,
      failure_url: `${appUrl}/payment/esewa/failure`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
    });
    const redirectUrl = `${baseUrl}/api/epay/main/v2/form?${query.toString()}`;
    return {
      status: 'pending',
      redirectUrl,
      providerReferenceId: transaction.reference,
      raw: { gateway: 'esewa', redirectUrl, signedFieldNames: 'total_amount,transaction_uuid,product_code' },
    };
  }

  async verifyPayment(transaction: PaymentTransaction, payload?: Record<string, unknown>): Promise<PaymentVerificationResult> {
    if (payload?.data && typeof payload.data === 'string') {
      try {
        const decoded = JSON.parse(Buffer.from(payload.data, 'base64').toString('utf8'));
        const secretKey = this.configService.get('ESEWA_SECRET_KEY') || '';
        const productCode = this.configService.get('ESEWA_MERCHANT_ID') || this.configService.get('ESEWA_MERCHANT_CODE') || '';

        // Verify signature using the same field order as initiation
        const message = `total_amount=${decoded.total_amount},transaction_uuid=${decoded.transaction_uuid},product_code=${productCode}`;
        const expected = crypto.createHmac('sha256', secretKey).update(message).digest('base64');

        if (decoded.signature !== expected) {
          this.logger.error(`eSewa signature mismatch for ${transaction.reference}`);
          return { status: 'failed', providerTransactionId: decoded.transaction_uuid, raw: decoded, error: 'Invalid eSewa signature' };
        }

        // Verify amount
        const verifiedAmount = Number(decoded.total_amount);
        const requestedAmount = Number(transaction.amount);
        if (Math.abs(verifiedAmount - requestedAmount) > 0.01) {
          this.logger.error(`eSewa amount mismatch: requested=${requestedAmount}, verified=${verifiedAmount}`);
          return { status: 'failed', raw: decoded, error: `Amount mismatch: requested ${requestedAmount}, paid ${verifiedAmount}` };
        }

        // Additionally verify via eSewa transaction status API
        const statusResult = await this.verifyTransactionStatus(transaction.reference, decoded.total_amount, productCode);
        if (statusResult && statusResult.status !== 'COMPLETE') {
          this.logger.warn(`eSewa status API returned ${statusResult.status} for ${transaction.reference}`);
          return { status: 'failed', raw: { ...decoded, statusCheck: statusResult }, error: `eSewa status: ${statusResult.status}` };
        }

        this.logger.log(`eSewa payment verified: ref=${transaction.reference}, amt=${verifiedAmount}`);
        return {
          status: 'success',
          providerTransactionId: decoded.transaction_uuid || decoded.transaction_code,
          raw: { ...decoded, statusCheck: statusResult },
        };
      } catch (error) {
        this.logger.error('eSewa verification error', error);
        return { status: 'failed', error: 'Unable to parse/verify eSewa callback payload' };
      }
    }
    return { status: 'pending', raw: (payload || {}) as Record<string, unknown> };
  }

  private async verifyTransactionStatus(
    transactionUuid: string,
    totalAmount: string,
    productCode: string,
  ): Promise<{ status: string; [key: string]: unknown } | null> {
    const baseUrl = this.configService.get('ESEWA_BASE_URL') || 'https://rc-epay.esewa.com.np';
    try {
      const params = new URLSearchParams({
        product_code: productCode,
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
      });
      const response = await fetch(
        `${baseUrl}/api/epay/transaction/status/?${params.toString()}`,
        { method: 'GET' },
      );
      if (!response.ok) {
        this.logger.warn(`eSewa status API returned ${response.status}`);
        return null;
      }
      return await response.json();
    } catch (error) {
      this.logger.warn('eSewa status API call failed', error);
      return null;
    }
  }
}
