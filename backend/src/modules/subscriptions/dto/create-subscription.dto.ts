import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  planId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsNumber()
  pricePaid?: number;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;
}
