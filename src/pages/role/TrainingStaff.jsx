import { useState } from 'react';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };

const SAMPLE = [
  { name: 'Rajesh', dept: 'Phlebotomy', training: 'Safe Blood Collection', date: '2025-07-15', status: 'completed' },
  { name: 'Sneha', dept: 'Lab', training: 'Equipment Handling', date: '2025-07-20', status: 'completed' },
  { name: 'Vikram', dept: 'Dispatch', training: 'Route Optimization', date: '2025-07-25', status: 'pending' },
  { name: 'Anita', dept: 'Nursing', training: 'Patient Care Protocol', date: '2025-08-01', status: 'scheduled' },
];

export default function TrainingStaff() {
  const [search, setSearch] = useState('');
  const filtered = search ? SAMPLE.filter(s => (s.name + s.dept).toLowerCase().includes(search.toLowerCase())) : SAMPLE;
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>👥 Staff Training</h2>
      <input value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 260, marginBottom: 16, fontSize: 12 }} placeholder="🔍 Search staff..." />
      {filtered.map((s, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{s.name}</span>
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>{s.dept}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{s.training} · {s.date}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: s.status === 'completed' ? '#dcfce7' : s.status === 'scheduled' ? '#dbeafe' : '#fef3c7', color: s.status === 'completed' ? '#16a34a' : s.status === 'scheduled' ? '#2563eb' : '#d97706', fontWeight: 600, textTransform: 'capitalize' }}>{s.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}