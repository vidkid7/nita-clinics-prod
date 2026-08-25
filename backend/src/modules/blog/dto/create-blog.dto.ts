import { IsString, IsOptional, IsBoolean, IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({ example: '10 Tips for Better Preventive Health' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Learn practical tips for maintaining long-term family wellness.' })
  @IsString()
  excerpt: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiProperty({ example: 'Dr. John Smith' })
  @IsString()
  author: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiProperty({ example: 'Preventive Care' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ type: [String], example: ['health tips', 'preventive care'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
