import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLabReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty()
  @IsString()
  patientId: string;

  @ApiProperty()
  @IsString()
  testName: string;

  @ApiPropertyOptional({ description: 'URL to PDF/report; optional until file is uploaded' })
  @IsOptional()
  @IsString()
  reportFileUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reportFileName?: string;

  @ApiProperty()
  @IsString()
  reportDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isVisibleToPatient?: boolean;
}
