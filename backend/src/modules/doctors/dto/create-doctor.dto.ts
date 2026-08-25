import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsUUID,
  IsBoolean,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StaffType } from '../entities/doctor.entity';

export class CreateDoctorDto {
  @ApiProperty({ example: 'Dr. John Smith' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.smith@hospital.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ example: 'BDS, MDS (Orthodontics)' })
  @IsString()
  qualification: string;

  @ApiProperty({ example: 'Orthodontics' })
  @IsString()
  specialization: string;

  @ApiPropertyOptional({ enum: StaffType, default: StaffType.DOCTOR })
  @IsOptional()
  @IsEnum(StaffType)
  staffType?: StaffType;

  @ApiProperty()
  @IsUUID()
  departmentId: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  experience: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  consultationFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;
}
