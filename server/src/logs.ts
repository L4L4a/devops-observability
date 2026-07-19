import { v4 as uuidv4 } from 'uuid';
import { LogEntry, LogLevel } from './types';

// in-memory log store with a max size
const MAX_LOGS = 1000;
const logs: LogEntry[] = [];

export function addLog(
  level: LogLevel,
  message: string,
  service: string,
  metadata?: Record<string, unknown>
): LogEntry {
  const entry: LogEntry = {
    id: uuidv4(),
    level,
    message,
    service,
    timestamp: new Date().toISOString(),
    metadata,
  };

  logs.unshift(entry); // newest first

  // drop oldest logs when we hit the limit
  if (logs.length > MAX_LOGS) {
    logs.splice(MAX_LOGS);
  }

  return entry;
}

export function getLogs(options: {
  level?: LogLevel;
  service?: string;
  search?: string;
  limit?: number;
}): LogEntry[] {
  let filtered = [...logs];

  if (options.level) {
    filtered = filtered.filter(l => l.level === options.level);
  }

  if (options.service) {
    filtered = filtered.filter(l => l.service === options.service);
  }

  if (options.search) {
    const term = options.search.toLowerCase();
    filtered = filtered.filter(l =>
      l.message.toLowerCase().includes(term) ||
      l.service.toLowerCase().includes(term)
    );
  }

  return filtered.slice(0, options.limit || 100);
}

export function getServices(): string[] {
  return [...new Set(logs.map(l => l.service))];
}