import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const MSG =
  'New password must be at least 10 characters with uppercase, lowercase, and a number';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @MaxLength(128)
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(10, { message: MSG })
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: MSG })
  newPassword: string;
}

