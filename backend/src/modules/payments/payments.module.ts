import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Setting } from '../settings/entities/setting.entity';
import { EsewaGateway } from './gateways/esewa.gateway';
import { KhaltiGateway } from './gateways/khalti.gateway';
import { FonepayGateway } from './gateways/fonepay.gateway';
import { ReceiptService } from './receipt.service';
import { LabOrdersModule } from '../lab-orders/lab-orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransaction, Setting]), LabOrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, EsewaGateway, KhaltiGateway, FonepayGateway, ReceiptService],
  exports: [PaymentsService, ReceiptService],
})
export class PaymentsModule {}
