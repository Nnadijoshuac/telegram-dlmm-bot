import Redis from 'ioredis';
import storage from 'node-persist';

type JsonMap = Record<string, unknown>;

const getRedis = (): Redis | null => {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  return new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 2 });
};

let redis: Redis | null = null;
let persistentInit = false;

export const initStorage = async (): Promise<void> => {
  if (!persistentInit) {
    await storage.init({
      dir: './data',
      stringify: JSON.stringify,
      parse: JSON.parse,
      encoding: 'utf8',
      logging: false,
      ttl: false
    });
    persistentInit = true;
  }
  if (!redis) {
    redis = getRedis();
    if (redis) {
      try { await redis.connect(); } catch { /* fall back silently */ }
    }
  }
};

export const kvGet = async <T = unknown>(key: string): Promise<T | null> => {
  if (redis) {
    try {
      const raw = await redis.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch { /* fall through */ }
  }
  const val = await storage.getItem(key);
  return (val ?? null) as T | null;
};

export const kvSet = async (key: string, value: unknown): Promise<void> => {
  if (redis) {
    try { await redis.set(key, JSON.stringify(value)); return; } catch { /* fall through */ }
  }
  await storage.setItem(key, value as JsonMap);
};

export const kvDel = async (key: string): Promise<void> => {
  if (redis) {
    try { await redis.del(key); } catch { /* ignore */ }
  }
  await storage.removeItem(key);
};


