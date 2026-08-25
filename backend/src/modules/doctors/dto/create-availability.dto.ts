import { IsNumber, IsString, Min, Max, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAvailabilityDto {
  @ApiProperty({ example: 1, description: '0-6 (Sunday-Saturday)' })
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ example: '09:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '17:00' })
  @IsString()
  endTime: string;

  @ApiPropertyOptional({ example: 15, default: 15 })
  @IsOptional()
  @IsNumber()
  slotDuration?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
