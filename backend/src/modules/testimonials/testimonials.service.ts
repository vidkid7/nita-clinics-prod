import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { RedisCacheService } from '@/common/cache/redis-cache.service';

const TESTIMONIALS_PUBLIC_KEY = 'testimonials:public:active';
const TESTIMONIALS_TTL_SEC = 30;

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private testimonialsRepository: Repository<Testimonial>,
    private readonly cache: RedisCacheService,
  ) {}

  async create(createTestimonialDto: CreateTestimonialDto): Promise<Testimonial> {
    const testimonial = this.testimonialsRepository.create(createTestimonialDto);
    const saved = await this.testimonialsRepository.save(testimonial);
    await this.cache.del(TESTIMONIALS_PUBLIC_KEY);
    return saved;
  }

  async findAll(): Promise<Testimonial[]> {
    const hit = await this.cache.get<Testimonial[]>(TESTIMONIALS_PUBLIC_KEY);
    if (hit) return hit;

    const rows = await this.testimonialsRepository.find({
      where: { isActive: true },
      order: { order: 'ASC', createdAt: 'DESC' },
    });
    await this.cache.set(TESTIMONIALS_PUBLIC_KEY, rows, TESTIMONIALS_TTL_SEC);
    return rows;
  }

  /** Admin: active + inactive, ordered for management UI. */
  async findAllForAdmin(): Promise<Testimonial[]> {
    return this.testimonialsRepository.find({
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Testimonial> {
    const testimonial = await this.testimonialsRepository.findOne({ where: { id } });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return testimonial;
  }

  async update(id: string, updateTestimonialDto: UpdateTestimonialDto): Promise<Testimonial> {
    const testimonial = await this.findOne(id);
    Object.assign(testimonial, updateTestimonialDto);
    const saved = await this.testimonialsRepository.save(testimonial);
    await this.cache.del(TESTIMONIALS_PUBLIC_KEY);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const testimonial = await this.findOne(id);
    await this.testimonialsRepository.remove(testimonial);
    await this.cache.del(TESTIMONIALS_PUBLIC_KEY);
  }
}
