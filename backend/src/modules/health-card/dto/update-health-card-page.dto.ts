import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHealthCardPageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heroTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  introText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaLabel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaLink?: string;
}
