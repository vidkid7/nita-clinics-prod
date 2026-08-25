import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabReport } from './entities/lab-report.entity';
import { LabReportsController } from './lab-reports.controller';
import { LabReportsService } from './lab-reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([LabReport])],
  controllers: [LabReportsController],
  providers: [LabReportsService],
  exports: [LabReportsService],
})
export class LabReportsModule {}
