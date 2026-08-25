import { IsString, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateTestimonialDto {
  @ApiProperty({ example: 'Sarah Johnson' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Patient' })
  @Transform(({ value }) =>
    value == null || String(value).trim() === '' ? 'Patient' : String(value).trim(),
  )
  @IsString()
  role: string;

  @ApiProperty({ example: 'Excellent service! The staff was very professional and caring.' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  order?: number;
}
