export type MetricType = 'counter' | 'gauge' | 'histogram';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface Metric {
  name: string;
  value: number;
  type: MetricType;
  labels: Record<string, string>;
  timestamp: string;
}

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  service: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Alert {
  id: string;
  name: string;
  metric: string;
  threshold: number;
  condition: 'above' | 'below';
  triggered: boolean;
  triggeredAt?: string;
  value?: number;
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastSeen: string;
  requestCount: number;
  errorCount: number;
  avgResponseTime: number;
}