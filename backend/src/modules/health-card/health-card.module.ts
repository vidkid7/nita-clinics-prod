import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCardCategory } from './entities/health-card-category.entity';
import { HealthCardApplication } from './entities/health-card-application.entity';
import { HealthCardController } from './health-card.controller';
import { HealthCardService } from './health-card.service';
import { Setting } from '../settings/entities/setting.entity';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HealthCardCategory, HealthCardApplication, Setting]),
    PatientsModule,
  ],
  controllers: [HealthCardController],
  providers: [HealthCardService],
  exports: [HealthCardService],
})
export class HealthCardModule {}
