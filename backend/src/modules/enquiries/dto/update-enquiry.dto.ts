import { PartialType } from '@nestjs/swagger';
import { CreateEnquiryDto } from './create-enquiry.dto';
import { IsOptional, IsEnum, IsUUID, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EnquiryStatus } from '../entities/enquiry.entity';

export class UpdateEnquiryDto extends PartialType(CreateEnquiryDto) {
  @ApiPropertyOptional({ enum: EnquiryStatus })
  @IsOptional()
  @IsEnum(EnquiryStatus)
  status?: EnquiryStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  response?: string;
}
