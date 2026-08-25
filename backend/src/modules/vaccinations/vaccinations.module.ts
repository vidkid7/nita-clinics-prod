import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vaccine } from './entities/vaccine.entity';
import { VaccinationsController } from './vaccinations.controller';
import { VaccinationsService } from './vaccinations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vaccine])],
  controllers: [VaccinationsController],
  providers: [VaccinationsService],
  exports: [VaccinationsService],
})
export class VaccinationsModule {}
