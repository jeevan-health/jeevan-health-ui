import { useState } from 'react';
import useBookingsStore from '../../stores/bookingsStore';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function CallCenterBookings() {
  const bookings = useBookingsStore(s => s.bookings);
  const [filter, setFilter] = useState('');
  const filtered = filter ? bookings.filter(b => b.status === filter) : bookings;
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>📅 Bookings</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {['', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: filter === s ? '#0ea5e9' : '#fff', color: filter === s ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11 }}>{s || 'All'}</button>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 40 }}>No bookings.</p>}
      {filtered.map((b, i) => (
        <div key={b.id || i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{b.patientName || 'Patient'}</span>
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>{b.patientPhone}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{b.testName || 'Test'} · {b.date} {b.time}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: b.status === 'completed' ? '#dcfce7' : b.status === 'confirmed' ? '#dbeafe' : b.status === 'cancelled' ? '#fee2e2' : '#f1f5f9', color: b.status === 'completed' ? '#16a34a' : b.status === 'confirmed' ? '#2563eb' : b.status === 'cancelled' ? '#dc2626' : '#64748b', fontWeight: 600, textTransform: 'capitalize' }}>{b.status || 'pending'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}