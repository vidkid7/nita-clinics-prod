import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLeaveDto {
  @ApiProperty({ example: '2024-02-20' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-02-22' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: 'Annual leave' })
  @IsOptional()
  @IsString()
  reason?: string;
}
