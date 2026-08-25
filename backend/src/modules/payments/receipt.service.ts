import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentTransaction, PaymentStatus } from './entities/payment-transaction.entity';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly transactionRepository: Repository<PaymentTransaction>,
  ) {}

  async generateReceipt(reference: string) {
    const transaction = await this.transactionRepository.findOne({ where: { reference } });
    if (!transaction) {
      throw new NotFoundException(`Transaction ${reference} not found`);
    }

    return {
      receiptNumber: `REC-${transaction.reference}`,
      date: transaction.completedAt || transaction.initiatedAt || transaction.createdAt,
      customerName: transaction.customerName || 'N/A',
      customerEmail: transaction.customerEmail || 'N/A',
      gateway: transaction.gateway,
      purpose: transaction.purpose,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      reference: transaction.reference,
      providerTransactionId: transaction.providerTransactionId,
      isPaid: transaction.status === PaymentStatus.SUCCESS,
      clinic: {
        name: 'Nita Clinic',
        address: 'Birtamode-4, Jhapa, Nepal',
        phone: '+977-9768523887',
        email: 'info@nitaclinics.com',
      },
    };
  }

  async getReceiptHtml(reference: string): Promise<string> {
    const receipt = await this.generateReceipt(reference);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt - ${receipt.receiptNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
    .header { text-align: center; border-bottom: 2px solid #01ada5; padding-bottom: 15px; margin-bottom: 20px; }
    .header h1 { color: #01ada5; margin: 0; font-size: 24px; }
    .header p { margin: 5px 0; color: #666; font-size: 12px; }
    .receipt-title { text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .info-label { font-weight: bold; color: #555; }
    .amount { font-size: 20px; font-weight: bold; color: #01ada5; text-align: center; margin: 20px 0; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .status-success { background: #d4edda; color: #155724; }
    .status-pending { background: #fff3cd; color: #856404; }
    .status-failed { background: #f8d7da; color: #721c24; }
    .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 11px; color: #999; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>${receipt.clinic.name}</h1>
    <p>${receipt.clinic.address}</p>
    <p>Phone: ${receipt.clinic.phone} | Email: ${receipt.clinic.email}</p>
  </div>
  <div class="receipt-title">PAYMENT RECEIPT</div>
  <div class="info-row"><span class="info-label">Receipt No:</span><span>${receipt.receiptNumber}</span></div>
  <div class="info-row"><span class="info-label">Date:</span><span>${new Date(receipt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
  <div class="info-row"><span class="info-label">Customer:</span><span>${receipt.customerName}</span></div>
  <div class="info-row"><span class="info-label">Email:</span><span>${receipt.customerEmail}</span></div>
  <div class="info-row"><span class="info-label">Purpose:</span><span>${receipt.purpose.replace(/_/g, ' ').toUpperCase()}</span></div>
  <div class="info-row"><span class="info-label">Gateway:</span><span>${receipt.gateway.toUpperCase()}</span></div>
  <div class="info-row"><span class="info-label">Reference:</span><span>${receipt.reference}</span></div>
  <div class="info-row"><span class="info-label">Transaction ID:</span><span>${receipt.providerTransactionId || 'N/A'}</span></div>
  <div class="amount">${receipt.currency} ${Number(receipt.amount).toLocaleString()}</div>
  <div style="text-align:center;">
    <span class="status ${receipt.isPaid ? 'status-success' : receipt.status === 'pending' ? 'status-pending' : 'status-failed'}">
      ${receipt.status.toUpperCase()}
    </span>
  </div>
  <div class="footer">
    <p>This is a computer-generated receipt and does not require a signature.</p>
    <p>Thank you for choosing ${receipt.clinic.name}!</p>
  </div>
</body>
</html>`;
  }
}
