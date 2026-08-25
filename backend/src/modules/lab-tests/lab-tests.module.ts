import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabTest } from './entities/lab-test.entity';
import { LabTestCategory } from './entities/lab-test-category.entity';
import { LabTestsController } from './lab-tests.controller';
import { LabTestsService } from './lab-tests.service';

@Module({
  imports: [TypeOrmModule.forFeature([LabTest, LabTestCategory])],
  controllers: [LabTestsController],
  providers: [LabTestsService],
  exports: [LabTestsService],
})
export class LabTestsModule {}
