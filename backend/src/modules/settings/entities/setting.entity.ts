import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity('settings')
export class Setting extends BaseEntity {
  @Column({ unique: true })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
