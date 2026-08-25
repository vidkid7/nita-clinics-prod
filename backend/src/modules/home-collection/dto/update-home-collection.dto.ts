import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { HomeCollectionStatus } from '../entities/home-collection.entity';

export class UpdateHomeCollectionDto {
  @ApiPropertyOptional({ enum: HomeCollectionStatus })
  @IsOptional()
  @IsEnum(HomeCollectionStatus)
  status?: HomeCollectionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedStaffId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedStaffName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  collectionNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preferredDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preferredTimeSlot?: string;
}
