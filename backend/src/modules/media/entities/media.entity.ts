import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

@Entity('media_files')
export class MediaFile extends BaseEntity {
  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ name: 'public_id' })
  publicId: string;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type: MediaType;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ nullable: true })
  width?: number;

  @Column({ nullable: true })
  height?: number;

  @Column({ nullable: true })
  folder?: string;

  @Column({ nullable: true })
  alt?: string;

  @Column({ nullable: true })
  caption?: string;
}
