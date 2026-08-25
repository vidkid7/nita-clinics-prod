import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabOrder } from './entities/lab-order.entity';
import { LabOrderItem } from './entities/lab-order-item.entity';
import { LabOrdersController } from './lab-orders.controller';
import { LabOrdersService } from './lab-orders.service';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [TypeOrmModule.forFeature([LabOrder, LabOrderItem]), PatientsModule],
  controllers: [LabOrdersController],
  providers: [LabOrdersService],
  exports: [LabOrdersService],
})
export class LabOrdersModule {}
