/**
 * Redis клиент для rate limiting и кэширования
 * Использует Upstash Redis (бесплатный tier) или собственный Redis
 */

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

