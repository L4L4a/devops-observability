import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  time: string;
  value: number;
}

interface Props {
  name: string;
  data: DataPoint[];
  color?: string;
}

export default function MetricsChart({ name, data, color = '#4f46e5' }: Props) {
  return (
    <div style={{
      backgroundColor: '#1e1e2e',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
    }}>
      <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
        {name}
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="time" stroke="#666" tick={{ fontSize: 11 }} />
          <YAxis stroke="#666" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #444', borderRadius: '6px' }}
            labelStyle={{ color: '#fff' }}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}