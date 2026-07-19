import { useEffect, useState } from 'react';
import { socket } from './socket';
import axios from 'axios';
import MetricsChart from './components/MetricsChart';
import LogsPanel from './components/LogsPanel';
import AlertsPanel from './components/AlertsPanel';
import ServiceHealth from './components/ServiceHealth';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

interface MetricPoint { time: string; value: number; }
interface LogEntry { id: string; level: 'info' | 'warn' | 'error' | 'debug'; message: string; service: string; timestamp: string; }
interface Alert { id: string; name: string; metric: string; threshold: number; condition: 'above' | 'below'; triggered: boolean; triggeredAt?: string; value?: number; }
interface Service { name: string; status: 'healthy' | 'degraded' | 'down'; lastSeen: string; requestCount: number; errorCount: number; avgResponseTime: number; }

export default function App() {
  const [metrics, setMetrics] = useState<Record<string, MetricPoint[]>>({});
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    socket.connect();

    // load initial data
    axios.get(`${SERVER_URL}/alerts`).then(r => setAlerts(r.data));
    axios.get(`${SERVER_URL}/logs`).then(r => setLogs(r.data));
    axios.get(`${SERVER_URL}/health/services`).then(r => setServices(r.data));

    // stream live updates
    socket.on('metric', (metric) => {
      setMetrics(prev => {
        const existing = prev[metric.name] || [];
        const point = { time: new Date(metric.timestamp).toLocaleTimeString(), value: metric.value };
        return { ...prev, [metric.name]: [point, ...existing].slice(0, 50) };
      });
    });

    socket.on('log', (log) => {
      setLogs(prev => [log, ...prev].slice(0, 200));
    });

    socket.on('alerts', () => {
  axios.get(`${SERVER_URL}/alerts`).then(r => setAlerts(r.data));
});

    socket.on('health', (service: Service) => {
      setServices(prev => {
        const exists = prev.find(s => s.name === service.name);
        if (exists) return prev.map(s => s.name === service.name ? service : s);
        return [...prev, service];
      });
    });

    return () => { socket.disconnect(); };
  }, []);

  return (
    <div style={{ backgroundColor: '#13131f', minHeight: '100vh', padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>
          🔭 Observability Dashboard
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <ServiceHealth services={services} />
          <AlertsPanel alerts={alerts} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          {Object.entries(metrics).map(([name, data]) => (
            <MetricsChart key={name} name={name} data={[...data].reverse()} />
          ))}
          {Object.keys(metrics).length === 0 && (
            <div style={{ backgroundColor: '#1e1e2e', border: '1px solid #333', borderRadius: '8px', padding: '32px', textAlign: 'center' }}>
              <p style={{ color: '#666', fontSize: '13px' }}>no metrics yet — send some data to see charts</p>
            </div>
          )}
        </div>

        <LogsPanel logs={logs} />
      </div>
    </div>
  );
}