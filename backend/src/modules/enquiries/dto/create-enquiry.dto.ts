import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EnquiryType } from '../entities/enquiry.entity';

export class CreateEnquiryDto {
  @ApiPropertyOptional({ enum: EnquiryType, default: EnquiryType.GENERAL })
  @IsOptional()
  @IsEnum(EnquiryType)
  type?: EnquiryType;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@email.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Appointment Inquiry' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'I would like to book an appointment for a health checkup.' })
  @IsString()
  message: string;
}
