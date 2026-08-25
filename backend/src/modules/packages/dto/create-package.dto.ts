import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CheckupPackageCategory } from '../entities/checkup-package.entity';

export class CreatePackageDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: CheckupPackageCategory })
  @IsEnum(CheckupPackageCategory)
  category: CheckupPackageCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  targetGroup?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ageLabel?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  originalPrice: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  discountedPrice: number;

  @ApiPropertyOptional({ default: 'NPR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tests?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaLabel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  ctaLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}
