interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  service: string;
  timestamp: string;
}

interface Props {
  logs: LogEntry[];
}

const levelColors = {
  info: '#4f46e5',
  warn: '#f59e0b',
  error: '#ef4444',
  debug: '#6b7280',
};

export default function LogsPanel({ logs }: Props) {
  return (
    <div style={{
      backgroundColor: '#1e1e2e',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '16px',
    }}>
      <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
        Live Logs
      </h3>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {logs.length === 0 && (
          <p style={{ color: '#666', fontSize: '13px' }}>no logs yet...</p>
        )}
        {logs.map(log => (
          <div key={log.id} style={{
            display: 'flex',
            gap: '8px',
            padding: '6px 0',
            borderBottom: '1px solid #2a2a2a',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}>
            <span style={{ color: levelColors[log.level], minWidth: '40px', fontWeight: 600 }}>
              {log.level.toUpperCase()}
            </span>
            <span style={{ color: '#888', minWidth: '80px' }}>{log.service}</span>
            <span style={{ color: '#ccc', flex: 1 }}>{log.message}</span>
            <span style={{ color: '#555', minWidth: '60px', textAlign: 'right' }}>
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}