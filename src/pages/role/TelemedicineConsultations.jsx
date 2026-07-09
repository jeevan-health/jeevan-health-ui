import { useState } from 'react';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { patient: 'Ravi Kumar', doctor: 'Dr. Sharma', mode: 'Video', date: '2025-07-08', time: '10:00 AM', status: 'scheduled' },
  { patient: 'Sita Devi', doctor: 'Dr. Mehta', mode: 'Audio', date: '2025-07-08', time: '11:30 AM', status: 'in_progress' },
  { patient: 'Amit Singh', doctor: 'Dr. Sharma', mode: 'Video', date: '2025-07-07', time: '2:00 PM', status: 'completed' },
  { patient: 'Priya', doctor: 'Dr. Mehta', mode: 'Video', date: '2025-07-07', time: '3:00 PM', status: 'completed' },
];

export default function TelemedicineConsultations() {
  const [filter, setFilter] = useState('');
  const filtered = filter ? SAMPLE.filter(c => c.status === filter) : SAMPLE;
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>🌐 Consultations</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {['', 'scheduled', 'in_progress', 'completed'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: filter === s ? '#0284c7' : '#fff', color: filter === s ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11 }}>{s || 'All'}</button>
        ))}
      </div>
      {filtered.map((c, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{c.patient}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{c.doctor} · {c.mode} · {c.date} {c.time}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: c.status === 'completed' ? '#dcfce7' : c.status === 'in_progress' ? '#fef3c7' : '#dbeafe', color: c.status === 'completed' ? '#16a34a' : c.status === 'in_progress' ? '#d97706' : '#0284c7', fontWeight: 600, textTransform: 'capitalize' }}>{c.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}