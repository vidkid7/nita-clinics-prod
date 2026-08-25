import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { CreatePatientDto } from './create-patient.dto';

const NEW_PASSWORD_MSG =
  'New password must be at least 10 characters with uppercase, lowercase, and a number';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @ApiPropertyOptional({
    description:
      'Admin only: set a new password for the linked patient login account',
  })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: NEW_PASSWORD_MSG })
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: NEW_PASSWORD_MSG })
  newPassword?: string;
}
