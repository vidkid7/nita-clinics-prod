import { IsString, IsOptional, IsEmail, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHomeCollectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty()
  @IsString()
  patientName: string;

  @ApiProperty()
  @IsString()
  patientPhone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  patientEmail?: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiProperty()
  @IsString()
  preferredDate: string;

  @ApiProperty()
  @IsString()
  preferredTimeSlot: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  collectionNotes?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  serviceCharge?: number;
}
