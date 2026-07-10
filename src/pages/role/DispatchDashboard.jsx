import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';
import useBookingsStore from '../../stores/bookingsStore';
import { useT } from '../../i18n/LanguageProvider';

const sectionCard = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const TODAY = new Date().toISOString().slice(0, 10);

export default function DispatchDashboard() {
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());
  const bookings = useBookingsStore(s => s.bookings);
  const t = useT();

  const todayOrders = useMemo(() => orders.filter(o => o.collectionDate === TODAY), [orders]);
  const todayBookings = useMemo(() => bookings.filter(b => b.date === TODAY), [bookings]);
  const pendingStaff = useMemo(() => todayOrders.filter(o => !o.phlebotomist), [todayOrders]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('dispatchDashboard.title', '📦 Welcome, {name}').replace('{name}', user?.name || t('dispatchDashboard.dispatch', 'Dispatch'))}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#f97316' }}>{todayOrders.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('dispatchDashboard.todaysOrders', "Today's Orders")}</div></div>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#f97316' }}>{todayBookings.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('dispatchDashboard.todaysBookings', "Today's Bookings")}</div></div>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#f97316' }}>{pendingStaff.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('dispatchDashboard.unassignedStaff', 'Unassigned Staff')}</div></div>
      </div>
      <div style={sectionCard}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>{t('dispatchDashboard.dispatchOverview', '📋 Dispatch Overview')}</h4>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ background: '#fff7ed', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: '#f97316', marginBottom: 6 }}>{t('dispatchDashboard.unassignedStaffNeeded', '🟡 Unassigned Staff Needed')}</div>
            {pendingStaff.length === 0 ? <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{t('dispatchDashboard.allStaffAssigned', 'All staff assigned ✓')}</p> : pendingStaff.slice(0, 5).map(o => (
              <div key={o.id} style={{ fontSize: 11, color: '#0f172a', padding: '3px 0' }}>{o.patientInfo?.name || '—'} — {o.collectionAddress?.area || '—'}</div>
            ))}
          </div>
          <div style={{ background: '#f0f9ff', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: '#0ea5e9', marginBottom: 6 }}>{t('dispatchDashboard.schedule', '🔵 Schedule')}</div>
            {todayBookings.length === 0 ? <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{t('dispatchDashboard.noBookingsToday', 'No bookings today')}</p> : todayBookings.slice(0, 5).map(b => (
              <div key={b.id} style={{ fontSize: 11, color: '#0f172a', padding: '3px 0' }}>{b.patientName || '—'} @ {b.time || '—'}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}