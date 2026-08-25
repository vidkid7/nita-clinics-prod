import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Gender, BloodGroup } from '../entities/patient.entity';

const OPTIONAL_PASSWORD_MSG =
  'If set, password must be at least 10 characters with uppercase, lowercase, and a number';

export class CreatePatientDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName: string;

  @ApiProperty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @Matches(/^[\d+\s().-]{6,32}$/, {
    message: 'Phone must contain digits (and optional +, spaces, dashes)',
  })
  phone: string;

  @ApiPropertyOptional({ description: 'Password for patient login. If provided, a user account will be created.' })
  @IsOptional()
  @ValidateIf((_, v) => v !== undefined && v !== null && String(v).length > 0)
  @IsString()
  @MinLength(10, { message: OPTIONAL_PASSWORD_MSG })
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: OPTIONAL_PASSWORD_MSG })
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ enum: BloodGroup })
  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
