import { useState } from 'react';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { id: 'Q-001', from: 'Ravi Kumar', type: 'Booking', msg: 'Need to reschedule my blood test', status: 'open', time: '10 min ago' },
  { id: 'Q-002', from: 'Sita Devi', type: 'Report', msg: 'Not received my report yet', status: 'in_progress', time: '30 min ago' },
  { id: 'Q-003', from: 'Amit Singh', type: 'Billing', msg: 'Invoice discrepancy', status: 'resolved', time: '2 hrs ago' },
  { id: 'Q-004', from: 'Priya', type: 'General', msg: 'What tests are covered in Executive Package?', status: 'open', time: '1 hr ago' },
];

export default function CallCenterQueries() {
  const [filter, setFilter] = useState('');
  const filtered = filter ? SAMPLE.filter(q => q.status === filter) : SAMPLE;
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>❓ Queries</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {['', 'open', 'in_progress', 'resolved'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: filter === s ? '#0ea5e9' : '#fff', color: filter === s ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11 }}>{s || 'All'}</button>
        ))}
      </div>
      {filtered.map((q, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div><span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{q.from}</span> <span style={{ fontSize: 11, color: '#64748b' }}>· {q.type}</span></div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{q.msg}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{q.time}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: q.status === 'open' ? '#fee2e2' : q.status === 'in_progress' ? '#fef3c7' : '#dcfce7', color: q.status === 'open' ? '#dc2626' : q.status === 'in_progress' ? '#d97706' : '#16a34a', fontWeight: 600, textTransform: 'capitalize' }}>{q.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}