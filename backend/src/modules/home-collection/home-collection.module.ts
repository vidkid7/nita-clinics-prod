import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeCollection } from './entities/home-collection.entity';
import { HomeCollectionController } from './home-collection.controller';
import { HomeCollectionService } from './home-collection.service';

@Module({
  imports: [TypeOrmModule.forFeature([HomeCollection])],
  controllers: [HomeCollectionController],
  providers: [HomeCollectionService],
  exports: [HomeCollectionService],
})
export class HomeCollectionModule {}
