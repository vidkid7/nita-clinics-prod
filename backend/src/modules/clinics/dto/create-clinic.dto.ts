import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsEmail,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class WorkingHoursDto {
  @IsNumber()
  dayOfWeek: number;

  @IsString()
  openTime: string;

  @IsString()
  closeTime: string;

  @IsBoolean()
  isClosed: boolean;
}

export class CreateClinicDto {
  @ApiProperty({ example: 'Nita Clinic Main Branch' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'P82W+39F, Kathmandu 44600' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Medical City' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'State' })
  @IsString()
  state: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  postalCode: string;

  @ApiProperty({ example: 'Country' })
  @IsString()
  country: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'clinic@hospital.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 27.7172 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 85.324 })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ type: [WorkingHoursDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursDto)
  workingHours?: WorkingHoursDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isMain?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
