import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('blog_posts')
export class BlogPost extends BaseEntity {
  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'featured_image', nullable: true })
  featuredImage?: string;

  @Column()
  author: string;

  @Column({ name: 'author_id', nullable: true })
  authorId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  authorUser?: User;

  @Column()
  category: string;

  @Column({ type: 'simple-array', default: [] })
  tags: string[];

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @Column({ name: 'published_at', nullable: true })
  publishedAt?: Date;

  @Column({ default: 0 })
  views: number;

  @Column({ name: 'reading_time', default: 5 })
  readingTime: number;
}
