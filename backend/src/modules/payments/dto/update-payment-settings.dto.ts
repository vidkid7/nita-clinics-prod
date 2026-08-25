import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  esewaEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  khaltiEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  fonepayEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  sandboxMode?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  defaultCurrency?: string;
}
