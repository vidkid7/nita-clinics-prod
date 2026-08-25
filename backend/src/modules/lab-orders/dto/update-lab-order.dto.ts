import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LabOrderStatus, LabOrderPaymentStatus } from '../entities/lab-order.entity';

export class UpdateLabOrderDto {
  @ApiPropertyOptional({ enum: LabOrderStatus })
  @IsOptional()
  @IsEnum(LabOrderStatus)
  status?: LabOrderStatus;

  @ApiPropertyOptional({ enum: LabOrderPaymentStatus })
  @IsOptional()
  @IsEnum(LabOrderPaymentStatus)
  paymentStatus?: LabOrderPaymentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentReference?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  collectionDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  collectionTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
