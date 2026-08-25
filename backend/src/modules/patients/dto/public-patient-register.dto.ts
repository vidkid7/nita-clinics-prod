import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

const PASSWORD_MESSAGE =
  'Password must be at least 10 characters and include uppercase, lowercase, and a number';

export class PublicPatientRegisterDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName: string;

  @ApiProperty({ example: 'jane@example.com' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiProperty({ example: '+9779812345678' })
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @Matches(/^[\d+\s().-]{6,32}$/, {
    message: 'Phone must contain digits (and optional +, spaces, dashes)',
  })
  phone: string;

  @ApiProperty({ example: 'SecurePass1' })
  @IsString()
  @MinLength(10, { message: PASSWORD_MESSAGE })
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: PASSWORD_MESSAGE })
  password: string;
}
