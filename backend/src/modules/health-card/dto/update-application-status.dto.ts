import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '../entities/health-card-application.entity';

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}

