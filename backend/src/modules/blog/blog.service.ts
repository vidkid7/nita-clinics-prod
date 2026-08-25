import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { BlogPost } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PaginationDto, PaginatedResponseDto } from '@/common/dto/pagination.dto';
import slugify from 'slugify';
import { RedisCacheService } from '@/common/cache/redis-cache.service';

const BLOG_LIST_PREFIX = 'blog:list:';
const BLOG_LIST_TTL_SEC = 45;

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private blogRepository: Repository<BlogPost>,
    private readonly cache: RedisCacheService,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<BlogPost> {
    const slug = slugify(createBlogDto.title, { lower: true, strict: true });
    
    const existing = await this.blogRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('Blog post with this title already exists');
    }

    // Calculate reading time (approx 200 words per minute)
    const wordCount = createBlogDto.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    const post = this.blogRepository.create({
      ...createBlogDto,
      slug,
      readingTime,
      publishedAt: createBlogDto.isPublished ? new Date() : undefined,
    });
    const saved = await this.blogRepository.save(post);
    await this.invalidateBlogListCache();
    return saved;
  }

  async findAll(
    paginationDto: PaginationDto & { category?: string; includeAll?: boolean },
  ): Promise<PaginatedResponseDto<BlogPost>> {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'publishedAt', 
      sortOrder = 'desc',
      search,
      category,
    } = paginationDto;

    const includeAll = paginationDto.includeAll === true;

    if (!includeAll && !search) {
      const listKey = `${BLOG_LIST_PREFIX}${createHash('sha256')
        .update(JSON.stringify({ page, limit, sortBy, sortOrder, category: category ?? '' }))
        .digest('hex')
        .slice(0, 32)}`;
      const hit = await this.cache.get<{
        data: BlogPost[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>(listKey);
      if (hit) {
        return new PaginatedResponseDto(hit.data, hit.total, hit.page, hit.limit);
      }
    }

    const queryBuilder = this.blogRepository.createQueryBuilder('post');

    if (!includeAll) {
      queryBuilder.andWhere('post.isPublished = :isPublished', { isPublished: true });
    }

    if (search) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.excerpt ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('post.category = :category', { category });
    }

    queryBuilder
      .orderBy(`post.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [posts, total] = await queryBuilder.getManyAndCount();

    const result = new PaginatedResponseDto(posts, total, page, limit);

    if (!includeAll && !search) {
      const listKey = `${BLOG_LIST_PREFIX}${createHash('sha256')
        .update(JSON.stringify({ page, limit, sortBy, sortOrder, category: category ?? '' }))
        .digest('hex')
        .slice(0, 32)}`;
      await this.cache.set(
        listKey,
        {
          data: result.data,
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
        BLOG_LIST_TTL_SEC,
      );
    }

    return result;
  }

  private async invalidateBlogListCache(): Promise<void> {
    await this.cache.delByPrefix(BLOG_LIST_PREFIX);
  }

  async findOne(id: string): Promise<BlogPost> {
    const post = await this.blogRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    return post;
  }

  async findBySlug(slug: string): Promise<BlogPost> {
    const post = await this.blogRepository.findOne({ where: { slug } });
    if (!post) {
      throw new NotFoundException(`Blog post with slug ${slug} not found`);
    }
    // Increment views
    post.views += 1;
    await this.blogRepository.save(post);
    return post;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<BlogPost> {
    const post = await this.findOne(id);
    
    if (updateBlogDto.title && updateBlogDto.title !== post.title) {
      const slug = slugify(updateBlogDto.title, { lower: true, strict: true });
      const existing = await this.blogRepository.findOne({ where: { slug } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Blog post with this title already exists');
      }
      post.slug = slug;
    }

    if (updateBlogDto.content) {
      const wordCount = updateBlogDto.content.split(/\s+/).length;
      post.readingTime = Math.ceil(wordCount / 200);
    }

    Object.assign(post, updateBlogDto);
    if (post.isPublished && !post.publishedAt) {
      post.publishedAt = new Date();
    }
    const updated = await this.blogRepository.save(post);
    await this.invalidateBlogListCache();
    return updated;
  }

  async publish(id: string): Promise<BlogPost> {
    const post = await this.findOne(id);
    post.isPublished = true;
    post.publishedAt = new Date();
    const saved = await this.blogRepository.save(post);
    await this.invalidateBlogListCache();
    return saved;
  }

  async unpublish(id: string): Promise<BlogPost> {
    const post = await this.findOne(id);
    post.isPublished = false;
    const saved = await this.blogRepository.save(post);
    await this.invalidateBlogListCache();
    return saved;
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.blogRepository.remove(post);
    await this.invalidateBlogListCache();
  }

  async getCategories(): Promise<string[]> {
    const result = await this.blogRepository
      .createQueryBuilder('post')
      .select('DISTINCT post.category', 'category')
      .where('post.isPublished = true')
      .getRawMany();
    return result.map((r) => r.category);
  }
}
