import { useState } from 'react';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function AnalyticsReports() {
  const [period, setPeriod] = useState('7d');
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>📄 Analytics Reports</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {['7d', '30d', '90d', '1y'].map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: period === p ? '#6d28d9' : '#fff', color: period === p ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11, fontWeight: period === p ? 600 : 400 }}>{p}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 11, color: '#64748b' }}>Total Orders</div><div style={{ fontSize: 22, fontWeight: 800, color: '#6d28d9' }}>156</div></div>
        <div style={{ ...card, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 11, color: '#64748b' }}>Revenue</div><div style={{ fontSize: 22, fontWeight: 800, color: '#6d28d9' }}>₹1,82,500</div></div>
        <div style={{ ...card, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 11, color: '#64748b' }}>Avg Order Value</div><div style={{ fontSize: 22, fontWeight: 800, color: '#6d28d9' }}>₹1,170</div></div>
        <div style={{ ...card, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 11, color: '#64748b' }}>Conversion</div><div style={{ fontSize: 22, fontWeight: 800, color: '#6d28d9' }}>68%</div></div>
      </div>
      <div style={card}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>Top Tests (Last 7 days)</h4>
        {['Complete Blood Count', 'Thyroid Profile', 'Lipid Profile', 'Vitamin D', 'HbA1c'].map((t, i) => (
          <div key={t} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
            <span style={{ fontSize: 13, color: '#0f172a' }}>{i + 1}. {t}</span>
            <span style={{ fontSize: 12, color: '#64748b' }}>{[28, 22, 18, 15, 12][i]} orders</span>
          </div>
        ))}
      </div>
    </div>
  );
}