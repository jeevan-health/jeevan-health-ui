import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';
import { useT } from '../../i18n/LanguageProvider';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const TODAY = new Date().toISOString().slice(0, 10);

export default function EmergCoordDashboard() {
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());

  const t = useT();
  const todayOrders = useMemo(() => orders.filter(o => o.collectionDate === TODAY), [orders]);
  const pendingToday = useMemo(() => todayOrders.filter(o => o.status === 'confirmed'), [todayOrders]);
  const unassigned = useMemo(() => todayOrders.filter(o => !o.phlebotomist), [todayOrders]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('emergCoordDashboard.title', '🚨 Welcome, {name}').replace('{name}', user?.name || t('emergCoordDashboard.emergencyCoord', 'Emergency Coordinator'))}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#b91c1c' }}>{todayOrders.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('emergCoordDashboard.todaysRequests', "Today's Requests")}</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#b91c1c' }}>{pendingToday.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('emergCoordDashboard.pendingResponse', 'Pending Response')}</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#b91c1c' }}>{unassigned.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('emergCoordDashboard.unassignedStaff', 'Unassigned Staff')}</div></div>
      </div>
      <div style={{ ...card, border: '2px solid #fecaca', background: '#fef2f2' }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#b91c1c', margin: '0 0 12px' }}>{t('emergCoordDashboard.criticalOverview', "🚨 Today's Critical Overview")}</h4>
        {todayOrders.length === 0 && <p style={{ fontSize: 12, color: '#94a3b8' }}>{t('emergCoordDashboard.noUrgentRequests', 'No urgent requests today.')}</p>}
        {todayOrders.map(o => (
          <div key={o.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #fecaca', display: 'flex', justifyContent: 'space-between' }}>
            <span><span style={{ fontWeight: 600 }}>{o.patientInfo?.name || '—'}</span> <span style={{ color: '#64748b' }}>📍 {o.collectionAddress?.area || '—'}</span></span>
            <span style={{ color: o.phlebotomist ? '#65a30d' : '#dc2626', fontWeight: 600 }}>{o.phlebotomist ? t('emergCoordDashboard.assigned', 'Assigned: {name}').replace('{name}', o.phlebotomist.name) : t('emergCoordDashboard.unassigned', '🚨 Unassigned')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}