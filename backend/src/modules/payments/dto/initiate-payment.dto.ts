import { IsArray, IsEmail, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaymentGatewayName, PaymentPurpose } from '../entities/payment-transaction.entity';
import { CartLinePaymentDto } from './cart-line-payment.dto';

export class InitiatePaymentDto {
  @ApiProperty({ enum: PaymentGatewayName })
  @IsEnum(PaymentGatewayName)
  gateway: PaymentGatewayName;

  @ApiProperty({ enum: PaymentPurpose })
  @IsEnum(PaymentPurpose)
  purpose: PaymentPurpose;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({ default: 'NPR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  appointmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  packageId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerPhone?: string;

  /** Display label only (e.g. single product name); line items use cartItems for lab orders. */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional({ type: [CartLinePaymentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartLinePaymentDto)
  cartItems?: CartLinePaymentDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  successUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  failureUrl?: string;
}
