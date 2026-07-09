import { useState } from 'react';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE_CASES = [
  { id: 'EM-001', patient: 'Ravi Kumar', type: 'Cardiac Arrest', location: 'Koramangala', status: 'active', priority: 'critical', time: '10 min ago' },
  { id: 'EM-002', patient: 'Sita Devi', type: 'Accident Trauma', location: 'Indiranagar', status: 'active', priority: 'critical', time: '25 min ago' },
  { id: 'EM-003', patient: 'Amit Singh', type: 'Burn Injury', location: 'Whitefield', status: 'en_route', priority: 'high', time: '40 min ago' },
  { id: 'EM-004', patient: 'Priya', type: 'Stroke', location: 'MG Road', status: 'resolved', priority: 'normal', time: '2 hrs ago' },
];

export default function EmergencyCases() {
  const [filter, setFilter] = useState('');
  const filtered = filter ? SAMPLE_CASES.filter(c => c.status === filter) : SAMPLE_CASES;
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>🚨 Active Cases</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {['', 'active', 'en_route', 'resolved'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: filter === s ? '#dc2626' : '#fff', color: filter === s ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11, fontWeight: filter === s ? 600 : 400 }}>{s || 'All'}</button>
        ))}
      </div>
      {filtered.map((c, i) => (
        <div key={i} style={{ ...card, border: c.priority === 'critical' ? '2px solid #ef4444' : '1px solid #e2e8f0', background: c.status === 'active' ? '#fef2f2' : '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{c.id}</span>
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>{c.patient}</span>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{c.type} · 📍 {c.location}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.time}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: c.status === 'active' ? '#fee2e2' : c.status === 'en_route' ? '#fef3c7' : '#dcfce7', color: c.status === 'active' ? '#dc2626' : c.status === 'en_route' ? '#d97706' : '#16a34a', fontWeight: 600, textTransform: 'capitalize' }}>{c.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}