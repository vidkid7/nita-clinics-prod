import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MediaFile } from './entities/media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaFile]),
    ConfigModule,
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
