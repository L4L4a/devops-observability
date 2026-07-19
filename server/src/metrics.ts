import { createClient } from 'redis';
import { Metric, ServiceHealth } from './types';
import dotenv from 'dotenv';

dotenv.config();

const redis = createClient({ url: process.env.REDIS_URL });

redis.on('error', (err) => console.error('redis error:', err));

export async function connectRedis() {
  await redis.connect();
  console.log('redis connected');
}

// store metric in redis as a time series list
export async function recordMetric(metric: Metric): Promise<void> {
  const key = `metric:${metric.name}`;
  await redis.lPush(key, JSON.stringify(metric));
  // keep only last 100 data points per metric
  await redis.lTrim(key, 0, 99);
  await redis.expire(key, 3600); // expire after 1 hour
}

// get recent data points for a metric
export async function getMetric(name: string, limit = 50): Promise<Metric[]> {
  const key = `metric:${name}`;
  const data = await redis.lRange(key, 0, limit - 1);
  return data.map(d => JSON.parse(d) as Metric);
}

// get all metric names
export async function getMetricNames(): Promise<string[]> {
  const keys = await redis.keys('metric:*');
  return keys.map(k => k.replace('metric:', ''));
}

// track service health
export async function updateServiceHealth(health: ServiceHealth): Promise<void> {
  await redis.set(`service:${health.name}`, JSON.stringify(health));
  await redis.expire(`service:${health.name}`, 300);
}

export async function getServiceHealth(): Promise<ServiceHealth[]> {
  const keys = await redis.keys('service:*');
  if (keys.length === 0) return [];

  const services = await Promise.all(keys.map(k => redis.get(k)));
  return services
    .filter((s): s is string => s !== null)
    .map(s => JSON.parse(s) as ServiceHealth);
}

export { redis };