import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { id: 'EC-001', location: 'Koramangala', type: 'Cardiac Arrest', status: 'active', priority: 'critical', teams: 2, time: '10 min ago' },
  { id: 'EC-002', location: 'Indiranagar', type: 'Road Accident', status: 'active', priority: 'critical', teams: 1, time: '25 min ago' },
  { id: 'EC-003', location: 'Whitefield', type: 'Fire Incident', status: 'mobilizing', priority: 'high', teams: 3, time: '40 min ago' },
  { id: 'EC-004', location: 'MG Road', type: 'Medical Emergency', status: 'resolved', priority: 'normal', teams: 1, time: '2 hrs ago' },
];

export default function EmergCoordCases() {
  const t = useT();
  const [filter, setFilter] = useState('');
  const filtered = filter ? SAMPLE.filter(c => c.status === filter) : SAMPLE;
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('emergCoordCases.title', '🚨 Emergency Cases')}</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {['', 'active', 'mobilizing', 'resolved'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: filter === s ? '#b91c1c' : '#fff', color: filter === s ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11 }}>{s || t('emergCoordCases.all', 'All')}</button>
        ))}
      </div>
      {filtered.map((c, i) => (
        <div key={i} style={{ ...card, borderLeft: `4px solid ${c.priority === 'critical' ? '#dc2626' : c.priority === 'high' ? '#f97316' : '#94a3b8'}`, background: c.status === 'active' ? '#fef2f2' : '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{c.id}</span>
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>{c.type}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>📍 {c.location} · {c.teams} {t('emergCoordCases.team', 'team')}{c.teams > 1 ? 's' : ''}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.time}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: c.status === 'active' ? '#fee2e2' : c.status === 'mobilizing' ? '#fef3c7' : '#dcfce7', color: c.status === 'active' ? '#dc2626' : c.status === 'mobilizing' ? '#d97706' : '#16a34a', fontWeight: 600, textTransform: 'capitalize' }}>{c.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}