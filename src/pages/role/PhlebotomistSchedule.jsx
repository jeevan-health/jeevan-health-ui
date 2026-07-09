import { useState } from 'react';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function PhlebotomistSchedule() {
  const today = new Date();
  const [week] = useState(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() + i); return d;
  }));

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>📅 Schedule</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Your upcoming shifts and collections</p>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))' }}>
        {week.map((d, i) => (
          <div key={i} style={{ ...card, padding: 12, textAlign: 'center', marginBottom: 0, border: i === 0 ? '2px solid #059669' : '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>{WEEKDAYS[d.getDay()]}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>{d.getDate()}</div>
            <div style={{ fontSize: 10, color: i === 0 ? '#059669' : '#94a3b8' }}>{i === 0 ? 'Today' : ''}</div>
          </div>
        ))}
      </div>
      <div style={{ ...card, marginTop: 16 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Today's Shifts</h4>
        <div style={{ fontSize: 13, color: '#64748b' }}>Morning: 6:00 AM - 12:00 PM</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Collections scheduled: 4</div>
      </div>
    </div>
  );
}