import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';
import useBookingsStore from '../../stores/bookingsStore';
import { useT } from '../../i18n/LanguageProvider';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function CorporateDashboard() {
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());
  const bookings = useBookingsStore(s => s.bookings);
  const t = useT();

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('corporateDashboard.title', '🧑‍💼 Welcome, {name}').replace('{name}', user?.name || t('corporateDashboard.coordinator', 'Coordinator'))}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#1e40af' }}>{orders.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('corporateDashboard.totalOrders', 'Total Orders')}</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#1e40af' }}>{bookings.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('corporateDashboard.bookings', 'Bookings')}</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#1e40af' }}>{orders.filter(o => o.status === 'completed').length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('corporateDashboard.completed', 'Completed')}</div></div>
      </div>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <div style={card}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>{t('corporateDashboard.recentOrders', '📋 Recent Orders')}</h4>
          {orders.slice(0, 5).map(o => (
            <div key={o.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>{o.patientInfo?.name || '—'} <span style={{ color: '#64748b' }}>{o.status}</span></div>
          ))}
        </div>
        <div style={card}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>{t('corporateDashboard.recentBookings', '📅 Recent Bookings')}</h4>
          {bookings.slice(0, 5).map(b => (
            <div key={b.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>{b.patientName || '—'} <span style={{ color: '#64748b' }}>{b.date}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}