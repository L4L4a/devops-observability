interface Service {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastSeen: string;
  requestCount: number;
  errorCount: number;
  avgResponseTime: number;
}

interface Props {
  services: Service[];
}

const statusColors = {
  healthy: '#22c55e',
  degraded: '#f59e0b',
  down: '#ef4444',
};

export default function ServiceHealth({ services }: Props) {
  return (
    <div style={{
      backgroundColor: '#1e1e2e',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
    }}>
      <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
        Service Health
      </h3>
      {services.length === 0 && (
        <p style={{ color: '#666', fontSize: '13px' }}>no services reporting...</p>
      )}
      {services.map(service => (
        <div key={service.name} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 0',
          borderBottom: '1px solid #2a2a2a',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: statusColors[service.status],
            }} />
            <span style={{ color: '#fff', fontSize: '13px' }}>{service.name}</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#888' }}>
            <span>{service.requestCount} reqs</span>
            <span style={{ color: service.errorCount > 0 ? '#ef4444' : '#888' }}>
              {service.errorCount} errors
            </span>
            <span>{service.avgResponseTime}ms avg</span>
          </div>
        </div>
      ))}
    </div>
  );
}