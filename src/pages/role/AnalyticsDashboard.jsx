import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';
import { useT } from '../../i18n/LanguageProvider';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function AnalyticsDashboard() {
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());
  const t = useT();

  const revenue = useMemo(() => orders.reduce((s, o) => s + (o.totalAmount || 0), 0), [orders]);
  const completed = useMemo(() => orders.filter(o => o.status === 'completed'), [orders]);
  const avgOrder = useMemo(() => orders.length > 0 ? Math.round(revenue / orders.length) : 0, [revenue, orders]);
  const thisMonth = useMemo(() => {
    const m = new Date().getMonth();
    const y = new Date().getFullYear();
    return orders.filter(o => { const d = new Date(o.createdAt); return d.getMonth() === m && d.getFullYear() === y; });
  }, [orders]);
  const monthRevenue = useMemo(() => thisMonth.reduce((s, o) => s + (o.totalAmount || 0), 0), [thisMonth]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('analyticsDashboard.title', '📊 Welcome, {name}').replace('{name}', user?.name || t('analyticsDashboard.analyst', 'Analyst'))}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#6d28d9' }}>₹{(revenue).toLocaleString()}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('analyticsDashboard.lifetimeRevenue', 'Lifetime Revenue')}</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#6d28d9' }}>{orders.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('analyticsDashboard.totalOrders', 'Total Orders')}</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#6d28d9' }}>₹{avgOrder}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('analyticsDashboard.avgOrderValue', 'Avg Order Value')}</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#6d28d9' }}>{completed.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('analyticsDashboard.completedOrders', 'Completed Orders')}</div></div>
      </div>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <div style={card}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>{t('analyticsDashboard.thisMonth', '📆 This Month')}</h4>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#6d28d9' }}>{thisMonth.length}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{t('analyticsDashboard.orders', 'Orders')}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginTop: 8 }}>₹{(monthRevenue).toLocaleString()}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{t('analyticsDashboard.revenueThisMonth', 'Revenue this month')}</div>
        </div>
        <div style={card}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>{t('analyticsDashboard.statusBreakdown', '📊 Status Breakdown')}</h4>
          {['confirmed', 'sample_collected', 'processing', 'results_ready', 'completed'].map(s => (
            <div key={s} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0' }}>
              <span style={{ color: '#64748b', textTransform: 'capitalize' }}>{s.replace(/_/g, ' ')}</span>
              <span style={{ fontWeight: 600 }}>{orders.filter(o => o.status === s).length}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}