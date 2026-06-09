/**
 * Redis клиент для rate limiting и кэширования
 * Использует Upstash Redis (бесплатный tier) или собственный Redis
 * С изоляцией компонентов: при недоступности Redis система продолжает работать
 */

import { safeRedisOperation } from './componentIsolation';

let redisClient: any = null;

async function getRedisClient() {
  if (redisClient) {
    return redisClient;
  }

  // Проверяем, есть ли Upstash Redis
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    // Используем Upstash Redis (HTTP-based, работает на Edge)
    const { Redis } = await import('@upstash/redis');
    redisClient = new Redis({
      url: upstashUrl,
      token: upstashToken,
    });
    return redisClient;
  }

  // Если нет Upstash, используем обычный Redis (требует TCP соединение)
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    const Redis = require('ioredis');
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
    });
    return redisClient;
  }

  // Fallback: in-memory хранилище (только для разработки)
  console.warn('⚠️ Redis не настроен. Используется in-memory хранилище (не для production!)');
  return null;
}

/**
 * Rate limiting с Redis
 */
export async function checkRateLimitRedis(
  key: string,
  maxRequests: number = 100,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  // Используем изоляцию компонентов: если Redis недоступен, используем fallback
  return safeRedisOperation(
    async () => {
      const redis = await getRedisClient();
      
      if (!redis) {
        throw new Error('Redis not available');
      }

      const now = Date.now();
      const windowMs = windowSeconds * 1000;
      const redisKey = `rate_limit:${key}`;
      
      // Используем sliding window log algorithm
      const pipeline = redis.pipeline();
      
      // Удалить старые записи (старше окна)
      pipeline.zremrangebyscore(redisKey, 0, now - windowMs);
      
      // Подсчитать текущие запросы
      pipeline.zcard(redisKey);
      
      // Добавить текущий запрос
      pipeline.zadd(redisKey, now, `${now}-${Math.random()}`);
      
      // Установить TTL
      pipeline.expire(redisKey, windowSeconds);
      
      const results = await pipeline.exec();
      const count = results?.[1]?.[1] as number || 0;
      
      if (count >= maxRequests) {
        // Получить время истечения
        const ttl = await redis.ttl(redisKey);
        return {
          allowed: false,
          remaining: 0,
          resetTime: now + (ttl * 1000),
        };
      }
      
      return {
        allowed: true,
        remaining: maxRequests - count - 1,
        resetTime: now + windowMs,
      };
    },
    () => {
      // Fallback на in-memory при недоступности Redis
      console.warn('Redis unavailable, using in-memory rate limiting');
      return checkRateLimitMemory(key, maxRequests, windowSeconds * 1000);
    }
  );
}

/**
 * In-memory fallback (только для разработки)
 */
const memoryStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimitMemory(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = memoryStore.get(key);

  if (!record || now > record.resetTime) {
    memoryStore.set(key, { count: 1, resetTime: now + windowMs });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Блокировка IP адреса
 */
export async function blockIP(ip: string, durationSeconds: number = 3600): Promise<void> {
  const redis = await getRedisClient();
  if (!redis) return;

  try {
    await redis.setex(`blocked_ip:${ip}`, durationSeconds, '1');
  } catch (error) {
    console.error('Redis block IP error:', error);
  }
}

/**
 * Проверка, заблокирован ли IP
 */
export async function isIPBlocked(ip: string): Promise<boolean> {
  return safeRedisOperation(
    async () => {
      const redis = await getRedisClient();
      if (!redis) return false;

      const blocked = await redis.get(`blocked_ip:${ip}`);
      return blocked === '1';
    },
    () => {
      // Fallback: если Redis недоступен, не блокируем IP (система продолжает работать)
      return false;
    }
  );
}

/**
 * Очистка старых записей (для in-memory fallback)
 */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    memoryStore.forEach((record, key) => {
      if (now > record.resetTime) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => memoryStore.delete(key));
  }, 5 * 60 * 1000);
}

