import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageContent } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { RedisCacheService } from '@/common/cache/redis-cache.service';

const CONTENT_SECTION_TTL_SEC = 90;
const contentSectionKey = (pageSlug: string, sectionKey: string) =>
  `content:section:${pageSlug}:${sectionKey}`;
const contentPageKey = (pageSlug: string) => `content:page:${pageSlug}`;

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(PageContent)
    private contentRepository: Repository<PageContent>,
    private readonly cache: RedisCacheService,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<PageContent> {
    const content = this.contentRepository.create(createContentDto);
    const saved = await this.contentRepository.save(content);
    await this.invalidatePageCache(saved.pageSlug, saved.sectionKey);
    return saved;
  }

  async findByPage(pageSlug: string): Promise<PageContent[]> {
    const key = contentPageKey(pageSlug);
    const hit = await this.cache.get<PageContent[]>(key);
    if (hit) return hit;

    const rows = await this.contentRepository.find({
      where: { pageSlug },
      order: { sectionKey: 'ASC' },
    });
    await this.cache.set(key, rows, CONTENT_SECTION_TTL_SEC);
    return rows;
  }

  async findByPageAndSection(pageSlug: string, sectionKey: string): Promise<PageContent | null> {
    const key = contentSectionKey(pageSlug, sectionKey);
    const hit = await this.cache.get<PageContent>(key);
    if (hit) return hit;

    const row = await this.contentRepository.findOne({
      where: { pageSlug, sectionKey },
    });
    if (row) {
      await this.cache.set(key, row, CONTENT_SECTION_TTL_SEC);
    }
    return row;
  }

  private async invalidatePageCache(pageSlug: string, sectionKey?: string): Promise<void> {
    await this.cache.del(contentPageKey(pageSlug));
    if (sectionKey) {
      await this.cache.del(contentSectionKey(pageSlug, sectionKey));
    }
  }

  async findOne(id: string): Promise<PageContent> {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return content;
  }

  async upsert(pageSlug: string, sectionKey: string, data: UpdateContentDto): Promise<PageContent> {
    let content = await this.contentRepository.findOne({
      where: { pageSlug, sectionKey },
    });

    if (content) {
      Object.assign(content, data);
    } else {
      content = this.contentRepository.create({
        pageSlug,
        sectionKey,
        ...data,
      });
    }

    const saved = await this.contentRepository.save(content);
    await this.invalidatePageCache(pageSlug, sectionKey);
    return saved;
  }

  async update(id: string, updateContentDto: UpdateContentDto): Promise<PageContent> {
    const content = await this.findOne(id);
    Object.assign(content, updateContentDto);
    const saved = await this.contentRepository.save(content);
    await this.invalidatePageCache(saved.pageSlug, saved.sectionKey);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const content = await this.findOne(id);
    const { pageSlug, sectionKey } = content;
    await this.contentRepository.remove(content);
    await this.invalidatePageCache(pageSlug, sectionKey);
  }

  async getAllPages(): Promise<string[]> {
    const result = await this.contentRepository
      .createQueryBuilder('content')
      .select('DISTINCT content.pageSlug', 'pageSlug')
      .getRawMany();
    return result.map((r) => r.pageSlug);
  }
}
