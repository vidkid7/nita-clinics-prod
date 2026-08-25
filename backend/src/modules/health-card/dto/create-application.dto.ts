import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { CardHolderType, IdentityDocumentType } from '../entities/health-card-application.entity';

export class CreateApplicationDto {
  @IsEnum(CardHolderType)
  holderType: CardHolderType;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @Matches(/^[0-9+\-\s]{7,15}$/)
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  organization?: string;

  @IsString()
  @IsOptional()
  nmcRegistrationId?: string;

  @IsString()
  @IsOptional()
  relationWithDoctor?: string;

  /** Identity document category (passport, citizenship, driving license, NMC registration, employee ID). */
  @IsOptional()
  @IsEnum(IdentityDocumentType)
  documentType?: IdentityDocumentType;

  /** Document number printed on the ID (passport no., citizenship no., license no., NMC no., employee ID). */
  @IsOptional()
  @IsString()
  @MaxLength(80)
  documentNumber?: string;
}
