import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContentDto {
  @ApiProperty({ example: 'home' })
  @IsString()
  pageSlug: string;

  @ApiProperty({ example: 'hero' })
  @IsString()
  sectionKey: string;

  @ApiProperty({ example: { title: 'Welcome', subtitle: 'Nita Clinic' } })
  @IsObject()
  content: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    schema?: Record<string, unknown>;
  };
}
