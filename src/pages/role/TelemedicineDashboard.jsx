import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import useBookingsStore from '../../stores/bookingsStore';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const TODAY = new Date().toISOString().slice(0, 10);

export default function TelemedicineDashboard() {
  const user = useAuthStore(s => s.user);
  const bookings = useBookingsStore(s => s.bookings);

  const todayApps = useMemo(() => bookings.filter(b => b.date === TODAY), [bookings]);
  const upcoming = useMemo(() => bookings.filter(b => b.date >= TODAY).length, [bookings]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>🌐 Welcome, {user?.name || 'Telemedicine Specialist'}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#0284c7' }}>{todayApps.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Today's Consultations</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#0284c7' }}>{upcoming}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Upcoming</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#0284c7' }}>{bookings.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Total Consultations</div></div>
      </div>
      <div style={card}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>📅 Consultation Schedule</h4>
        {bookings.length === 0 && <p style={{ fontSize: 12, color: '#94a3b8' }}>No consultations yet.</p>}
        {bookings.slice(0, 8).map(b => (
          <div key={b.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
            <span>{b.patientName || '—'} <span style={{ color: '#64748b' }}>{b.date} @ {b.time || '—'}</span></span>
            <span style={{ color: b.date === TODAY ? '#0284c7' : '#64748b', fontWeight: b.date === TODAY ? 600 : 400 }}>{b.test || 'Consultation'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}