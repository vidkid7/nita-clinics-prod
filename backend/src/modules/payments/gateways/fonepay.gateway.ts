import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PaymentGateway, PaymentInitResult, PaymentVerificationResult } from './payment-gateway.interface';
import { PaymentTransaction } from '../entities/payment-transaction.entity';

@Injectable()
export class FonepayGateway implements PaymentGateway {
  private readonly logger = new Logger(FonepayGateway.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Generate HMAC-SHA512 hash per Fonepay spec.
   * Key is the shared secret; message is comma-separated field values.
   */
  private generateHash(secretKey: string, message: string): string {
    return crypto
      .createHmac('sha512', secretKey)
      .update(message, 'utf8')
      .digest('hex')
      .toUpperCase();
  }

  async initiatePayment(transaction: PaymentTransaction): Promise<PaymentInitResult> {
    const merchantCode = this.configService.get('FONEPAY_MERCHANT_CODE');
    const secretKey = this.configService.get('FONEPAY_SECRET_KEY');
    const baseUrl =
      this.configService.get('FONEPAY_BASE_URL') || 'https://dev-clientapi.fonepay.com';
    const appUrl = this.configService.get('APP_URL') || 'http://localhost:3002';

    if (!merchantCode || !secretKey) {
      return { status: 'failed', error: 'Fonepay merchant code or secret is not configured' };
    }

    const returnUrl = `${appUrl}/payment/fonepay/callback`;
    const dateText = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
    const amount = Number(transaction.amount).toFixed(2);
    const r1 = `Nita Clinic Payment - ${transaction.reference}`;
    const r2 = 'nitaclinics.com';

    // DV hash field order per Fonepay spec: PID,MD,PRN,AMT,CRN,DT,R1,R2,RU
    const dvMessage = [
      merchantCode,           // PID
      'P',                    // MD (Payment)
      transaction.reference,  // PRN
      amount,                 // AMT
      'NPR',                  // CRN
      dateText,               // DT (MM/DD/YYYY)
      r1,                     // R1
      r2,                     // R2
      returnUrl,              // RU
    ].join(',');

    const dv = this.generateHash(secretKey, dvMessage);

    const redirectUrl = `${baseUrl}/api/merchantRequest?${new URLSearchParams({
      PID: merchantCode,
      MD: 'P',
      AMT: amount,
      CRN: 'NPR',
      DT: dateText,
      R1: r1,
      R2: r2,
      RU: returnUrl,
      PRN: transaction.reference,
      DV: dv,
    }).toString()}`;

    this.logger.log(`Fonepay payment initiated: PRN=${transaction.reference}, AMT=${amount}`);

    return {
      status: 'pending',
      redirectUrl,
      providerReferenceId: transaction.reference,
      raw: { gateway: 'fonepay', redirectUrl },
    };
  }

  async verifyPayment(
    transaction: PaymentTransaction,
    payload?: Record<string, unknown>,
  ): Promise<PaymentVerificationResult> {
    const secretKey = this.configService.get('FONEPAY_SECRET_KEY') || '';

    if (!payload || !secretKey) {
      return { status: 'pending', raw: (payload || {}) as Record<string, unknown> };
    }

    const prn = String(payload.PRN || '');
    const pid = String(payload.PID || '');
    const ps = String(payload.PS || '');
    const rc = String(payload.RC || '');
    const dv = String(payload.DV || '');
    const uid = String(payload.UID || '');
    const bc = String(payload.BC || '');
    const ini = String(payload.INI || '');
    const pAmt = String(payload.P_AMT || '');
    const rAmt = String(payload.R_AMT || '');

    if (!prn || !ps || !dv) {
      this.logger.warn(`Fonepay callback missing required fields: PRN=${prn}, PS=${ps}`);
      return { status: 'failed', error: 'Missing required callback parameters' };
    }

    // Verify DV hash per Fonepay spec: PRN,PID,PS,RC,UID,BC,INI,P_AMT,R_AMT
    const dvMessage = [prn, pid, ps, rc, uid, bc, ini, pAmt, rAmt].join(',');
    const expectedDv = this.generateHash(secretKey, dvMessage);

    if (expectedDv !== dv) {
      this.logger.error(
        `Fonepay DV mismatch for PRN=${prn}. Expected=${expectedDv.slice(0, 16)}..., Got=${dv.slice(0, 16)}...`,
      );
      return {
        status: 'failed',
        providerTransactionId: prn,
        raw: payload,
        error: 'Fonepay callback signature verification failed',
      };
    }

    // Payment status check
    if (ps !== 'true' || rc !== 'successful') {
      this.logger.warn(`Fonepay payment not successful: PS=${ps}, RC=${rc}`);
      return {
        status: 'failed',
        providerTransactionId: prn,
        raw: payload,
        error: `Payment not successful: PS=${ps}, RC=${rc}`,
      };
    }

    // Amount validation: R_AMT should match the requested transaction amount
    const requestedAmount = Number(transaction.amount);
    const returnedAmount = Number(rAmt);
    if (returnedAmount > 0 && Math.abs(returnedAmount - requestedAmount) > 0.01) {
      this.logger.error(
        `Fonepay amount mismatch for PRN=${prn}: requested=${requestedAmount}, returned R_AMT=${returnedAmount}`,
      );
      return {
        status: 'failed',
        providerTransactionId: prn,
        raw: payload,
        error: `Amount mismatch: requested ${requestedAmount}, got ${returnedAmount}`,
      };
    }

    this.logger.log(`Fonepay payment verified: PRN=${prn}, UID=${uid}, P_AMT=${pAmt}`);

    return {
      status: 'success',
      providerTransactionId: uid || prn,
      raw: payload,
    };
  }
}
