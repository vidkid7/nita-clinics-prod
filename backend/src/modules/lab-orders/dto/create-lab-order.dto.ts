import { IsString, IsOptional, IsEnum, IsArray, IsNumber, ValidateNested, Min, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CollectionType } from '../entities/lab-order.entity';

export class CreateLabOrderItemDto {
  @ApiProperty()
  @IsString()
  testId: string;

  @ApiProperty()
  @IsString()
  testName: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateLabOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiProperty()
  @IsString()
  patientName: string;

  @ApiProperty()
  @IsEmail()
  patientEmail: string;

  @ApiProperty()
  @IsString()
  patientPhone: string;

  @ApiPropertyOptional({ enum: CollectionType, default: CollectionType.CLINIC })
  @IsOptional()
  @IsEnum(CollectionType)
  collectionType?: CollectionType;

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

  @ApiProperty({ type: [CreateLabOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLabOrderItemDto)
  items: CreateLabOrderItemDto[];
}
