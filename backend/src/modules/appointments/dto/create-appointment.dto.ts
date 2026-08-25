import { IsString, IsEmail, IsUUID, IsDateString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateAppointmentDto {
  @ApiPropertyOptional({
    description:
      'Optional for vaccination / health check-up; omit to assign at clinic. Required for general consultation-style bookings from API consumers that expect a doctor.',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined ? undefined : value,
  )
  @IsUUID()
  doctorId?: string;

  @ApiProperty({ example: 'John Patient' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  patientName: string;

  @ApiProperty({ example: 'patient@email.com' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  patientEmail: string;

  @ApiProperty({ example: '+1234567890' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  patientPhone: string;

  @ApiProperty({ example: '2024-02-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '10:00' })
  @IsString()
  startTime: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: ['consultation', 'vaccination', 'checkup'] })
  @IsOptional()
  @IsIn(['consultation', 'vaccination', 'checkup'])
  visitCategory?: 'consultation' | 'vaccination' | 'checkup';

  @ApiPropertyOptional({ example: 'BCG vaccine' })
  @IsOptional()
  @IsString()
  visitDetail?: string;
}
