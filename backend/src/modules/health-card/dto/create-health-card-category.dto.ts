import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HealthCardCategoryType } from '../entities/health-card-category.entity';

export class CreateHealthCardCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: HealthCardCategoryType })
  @IsEnum(HealthCardCategoryType)
  type: HealthCardCategoryType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  opdDiscount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  labDiscount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medicineDiscount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  queueBenefit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Card image URL (e.g. Cloudinary)' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}
