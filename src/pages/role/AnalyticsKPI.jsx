import { useState } from 'react';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const KPIS = [
  { label: 'Monthly Active Users', value: '2,450', change: '+12%', positive: true },
  { label: 'Order Fulfillment Rate', value: '94%', change: '+3%', positive: true },
  { label: 'Avg Turnaround Time', value: '18 hrs', change: '-2 hrs', positive: true },
  { label: 'Customer Satisfaction', value: '4.6/5', change: '+0.2', positive: true },
  { label: 'Phlebotomist Utilization', value: '76%', change: '+5%', positive: true },
  { label: 'Abandoned Bookings', value: '8%', change: '+1%', positive: false },
];

export default function AnalyticsKPI() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>📈 Key Performance Indicators</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Track business health metrics</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {KPIS.map(k => (
          <div key={k.label} style={card}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{k.value}</div>
            <div style={{ fontSize: 12, color: k.positive ? '#16a34a' : '#dc2626', marginTop: 2 }}>{k.change} {k.positive ? '↑' : '↓'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}