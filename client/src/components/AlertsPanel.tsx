interface Alert {
  id: string;
  name: string;
  metric: string;
  threshold: number;
  condition: 'above' | 'below';
  triggered: boolean;
  triggeredAt?: string;
  value?: number;
}

interface Props {
  alerts: Alert[];
}

export default function AlertsPanel({ alerts }: Props) {
  return (
    <div style={{
      backgroundColor: '#1e1e2e',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
    }}>
      <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
        Alerts
      </h3>
      {alerts.length === 0 && (
        <p style={{ color: '#666', fontSize: '13px' }}>no alerts configured...</p>
      )}
      {alerts.map(alert => (
        <div key={alert.id} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderRadius: '6px',
          marginBottom: '8px',
          backgroundColor: alert.triggered ? '#2d1b1b' : '#1a2d1a',
          border: `1px solid ${alert.triggered ? '#ef4444' : '#22c55e'}`,
        }}>
          <div>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{alert.name}</span>
            <span style={{ color: '#666', fontSize: '12px', marginLeft: '8px' }}>
              {alert.metric} {alert.condition} {alert.threshold}
            </span>
          </div>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: alert.triggered ? '#ef4444' : '#22c55e',
          }}>
            {alert.triggered ? `🚨 FIRING (${alert.value})` : '✅ OK'}
          </span>
        </div>
      ))}
    </div>
  );
}