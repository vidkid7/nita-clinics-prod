import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { UserRole } from '../../users/entities/user.entity';

const PASSWORD_RULE =
  'Password must be at least 10 characters and include uppercase, lowercase, and a number';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'john@nitaclinics.com' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(10, { message: PASSWORD_RULE })
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: PASSWORD_RULE })
  password: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.STAFF })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
