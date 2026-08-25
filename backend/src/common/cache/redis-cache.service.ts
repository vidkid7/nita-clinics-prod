import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Optional Redis JSON cache for hot reads (settings, CMS, blog lists).
 * When REDIS_URL is unset, all methods no-op and callers hit the DB as usual.
 */
@Injectable()
export class RedisCacheService implements OnModuleDestroy {
  private readonly client: Redis | null = null;

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('REDIS_URL')?.trim();
    if (!url) {
      return;
    }
    try {
      this.client = new Redis(url, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        reconnectOnError: (err) => err.message.includes('READONLY'),
      });
      this.client.on('error', (e) => {
        console.error('[RedisCache]', e.message);
      });
    } catch (e) {
      console.warn('[RedisCache] disabled:', e);
    }
  }

  get isReady(): boolean {
    return this.client != null;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    try {
      const raw = await this.client.get(key);
      if (raw == null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!this.client || ttlSeconds <= 0) return;
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      /* ignore */
    }
  }

  async del(...keys: string[]): Promise<void> {
    if (!this.client || keys.length === 0) return;
    try {
      await this.client.del(...keys);
    } catch {
      /* ignore */
    }
  }

  /** Delete keys matching prefix (use sparingly; SCAN-based). */
  async delByPrefix(prefix: string): Promise<void> {
    if (!this.client) return;
    const pattern = `${prefix}*`;
    try {
      let cursor = '0';
      do {
        const [next, keys] = await this.client.scan(cursor, 'MATCH', pattern, 'COUNT', 128);
        cursor = next;
        if (keys.length) await this.client.del(...keys);
      } while (cursor !== '0');
    } catch {
      /* ignore */
    }
  }

  async ping(): Promise<boolean> {
    if (!this.client) return false;
    try {
      const r = await this.client.ping();
      return r === 'PONG';
    } catch {
      return false;
    }
  }

  onModuleDestroy() {
    this.client?.disconnect();
  }
}
