import { PaymentTransaction } from '../entities/payment-transaction.entity';

export interface PaymentInitResult {
  status: 'pending' | 'failed';
  redirectUrl?: string;
  providerReferenceId?: string;
  providerTransactionId?: string;
  raw?: Record<string, unknown>;
  error?: string;
}

export interface PaymentVerificationResult {
  status: 'success' | 'failed' | 'pending';
  providerTransactionId?: string;
  raw?: Record<string, unknown>;
  error?: string;
}

export interface PaymentGateway {
  initiatePayment(transaction: PaymentTransaction, metadata?: Record<string, unknown>): Promise<PaymentInitResult>;
  verifyPayment(transaction: PaymentTransaction, payload?: Record<string, unknown>): Promise<PaymentVerificationResult>;
}
