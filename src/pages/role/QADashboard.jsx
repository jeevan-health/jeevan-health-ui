import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';
import { useT } from '../../i18n/LanguageProvider';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function QADashboard() {
  const t = useT();
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());

  const completed = useMemo(() => orders.filter(o => o.status === 'completed'), [orders]);
  const cancelled = useMemo(() => orders.filter(o => o.status === 'cancelled'), [orders]);
  const qualityRate = useMemo(() => orders.length > 0 ? Math.round(((orders.length - cancelled.length) / orders.length) * 100) : 100, [orders]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.qa.welcome', '✅ Welcome, ')}{user?.name || t('role.qa.officer', 'QA Officer')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#65a30d' }}>{qualityRate}%</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('role.qa.qualityScore', 'Quality Score')}</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#65a30d' }}>{completed.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('role.qa.completedOrders', 'Completed Orders')}</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#65a30d' }}>{cancelled.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('role.qa.cancelledIssues', 'Cancelled / Issues')}</div></div>
      </div>
      <div style={card}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>{t('role.qa.recentOrders', '📋 Recent Orders for Review')}</h4>
        {orders.slice(0, 8).map(o => (
          <div key={o.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
            <span>{o.patientInfo?.name || '—'} <span style={{ color: '#64748b' }}>| {o.id?.slice(0, 10)}</span></span>
            <span style={{ padding: '1px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600, background: o.status === 'completed' ? '#ecfccb' : o.status === 'cancelled' ? '#fee2e2' : '#fef3c7', color: o.status === 'completed' ? '#65a30d' : o.status === 'cancelled' ? '#ef4444' : '#d97706' }}>{o.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}