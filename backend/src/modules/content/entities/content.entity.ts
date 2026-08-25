import { Entity, Column, Unique } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity('page_content')
@Unique(['pageSlug', 'sectionKey'])
export class PageContent extends BaseEntity {
  @Column({ name: 'page_slug' })
  pageSlug: string;

  @Column({ name: 'section_key' })
  sectionKey: string;

  @Column({ type: 'jsonb', default: {} })
  content: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
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
