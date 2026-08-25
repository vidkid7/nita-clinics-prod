import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { RedisCacheService } from '@/common/cache/redis-cache.service';

const SETTINGS_KV_PREFIX = 'settings:kv:';
const SETTINGS_KV_TTL_SEC = 120;

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    private readonly cache: RedisCacheService,
  ) {}

  async findAll(category?: string): Promise<Setting[]> {
    const query = this.settingRepository.createQueryBuilder('setting');
    
    if (category) {
      query.where('setting.category = :category', { category });
    }
    
    return query.getMany();
  }

  async findOne(key: string): Promise<Setting> {
    const setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }
    return setting;
  }

  async findByCategory(category: string): Promise<Setting[]> {
    return this.settingRepository.find({ where: { category } });
  }

  async upsert(updateSettingDto: UpdateSettingDto): Promise<Setting> {
    const existing = await this.settingRepository.findOne({
      where: { key: updateSettingDto.key },
    });

    if (existing) {
      Object.assign(existing, updateSettingDto);
      const saved = await this.settingRepository.save(existing);
      await this.invalidateSettingsCache();
      return saved;
    }

    const newSetting = this.settingRepository.create(updateSettingDto);
    const created = await this.settingRepository.save(newSetting);
    await this.invalidateSettingsCache();
    return created;
  }

  async bulkUpsert(settings: UpdateSettingDto[]): Promise<Setting[]> {
    const results: Setting[] = [];

    for (const settingDto of settings) {
      const existing = await this.settingRepository.findOne({
        where: { key: settingDto.key },
      });

      if (existing) {
        Object.assign(existing, settingDto);
        results.push(await this.settingRepository.save(existing));
      } else {
        const created = this.settingRepository.create(settingDto);
        results.push(await this.settingRepository.save(created));
      }
    }

    await this.invalidateSettingsCache();
    return results;
  }

  async remove(key: string): Promise<void> {
    const setting = await this.findOne(key);
    await this.settingRepository.remove(setting);
    await this.invalidateSettingsCache();
  }

  private async invalidateSettingsCache(): Promise<void> {
    await this.cache.delByPrefix(SETTINGS_KV_PREFIX);
  }

  // Helper method to get settings as key-value object
  async getSettingsObject(category?: string): Promise<Record<string, string>> {
    const cacheKey = `${SETTINGS_KV_PREFIX}${category ?? 'all'}`;
    const cached = await this.cache.get<Record<string, string>>(cacheKey);
    if (cached) return cached;

    const settings = await this.findAll(category);
    const obj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
    await this.cache.set(cacheKey, obj, SETTINGS_KV_TTL_SEC);
    return obj;
  }
}
