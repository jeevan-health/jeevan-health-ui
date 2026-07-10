import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';
import { useT } from '../../i18n/LanguageProvider';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function SalesDashboard() {
  const t = useT();
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());

  const revenue = useMemo(() => orders.reduce((s, o) => s + (o.totalAmount || 0), 0), [orders]);
  const completed = useMemo(() => orders.filter(o => o.status === 'completed'), [orders]);
  const conversion = useMemo(() => orders.length > 0 ? Math.round((completed.length / orders.length) * 100) : 0, [orders]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.sales.welcome', '📢 Welcome, ')}{user?.name || t('role.sales.marketing', 'Sales & Marketing')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#e11d48' }}>₹{(revenue).toLocaleString()}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('role.sales.totalRevenue', 'Total Revenue')}</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#e11d48' }}>{orders.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('role.sales.totalOrders', 'Total Orders')}</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#e11d48' }}>{conversion}%</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('role.sales.conversionRate', 'Conversion Rate')}</div></div>
      </div>
      <div style={card}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>{t('role.sales.orderHistory', '📋 Order History')}</h4>
        {orders.slice(0, 8).map(o => (
          <div key={o.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
            <span>{o.patientInfo?.name || '—'} <span style={{ color: '#64748b' }}>({o.id?.slice(0, 10)})</span></span>
            <span style={{ fontWeight: 600 }}>₹{o.totalAmount || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}