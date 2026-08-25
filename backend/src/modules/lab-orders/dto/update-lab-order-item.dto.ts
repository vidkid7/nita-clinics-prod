import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LabOrderItemStatus } from '../entities/lab-order-item.entity';

export class UpdateLabOrderItemDto {
  @ApiPropertyOptional({ enum: LabOrderItemStatus })
  @IsOptional()
  @IsEnum(LabOrderItemStatus)
  status?: LabOrderItemStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  result?: string;
}
