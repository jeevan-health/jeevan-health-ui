import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';
import useBookingsStore from '../../stores/bookingsStore';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const TODAY = new Date().toISOString().slice(0, 10);

export default function CallCenterDashboard() {
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());
  const bookings = useBookingsStore(s => s.bookings);

  const todayOrders = useMemo(() => orders.filter(o => o.collectionDate === TODAY), [orders]);
  const todayBookings = useMemo(() => bookings.filter(b => b.date === TODAY), [bookings]);
  const pendingOrders = useMemo(() => orders.filter(o => o.status === 'confirmed'), [orders]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>☎️ Welcome, {user?.name || 'Customer Care'}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#0ea5e9' }}>{todayBookings.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Today's Bookings</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#0ea5e9' }}>{todayOrders.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Today's Orders</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#0ea5e9' }}>{pendingOrders.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Pending Follow-ups</div></div>
      </div>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <div style={card}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>📅 Today's Bookings</h4>
          {todayBookings.length === 0 ? <p style={{ fontSize: 12, color: '#94a3b8' }}>No bookings today.</p> : todayBookings.map(b => (
            <div key={b.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              {b.patientName || '—'} <span style={{ color: '#64748b' }}>{b.time || '—'} | {b.test || '—'}</span>
            </div>
          ))}
        </div>
        <div style={card}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>📋 Pending Orders</h4>
          {pendingOrders.length === 0 ? <p style={{ fontSize: 12, color: '#94a3b8' }}>No pending orders.</p> : pendingOrders.slice(0, 6).map(o => (
            <div key={o.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              {o.patientInfo?.name || '—'} <span style={{ color: '#64748b' }}>| {o.id?.slice(0, 10)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}