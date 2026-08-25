import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateSettingDto {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class BulkUpdateSettingsDto {
  @ApiProperty({ type: [UpdateSettingDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSettingDto)
  settings: UpdateSettingDto[];
}
