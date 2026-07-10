import { useState } from 'react';
import useAdminStore from '../../stores/adminStore';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function CorporateOrders() {
  const t = useT();
  const orders = useAdminStore(s => s.orders || []);
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('corporateOrders.title', '📋 Corporate Orders')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{t('corporateOrders.subtitle', 'Bulk orders and corporate account requests')}</p>
      {orders.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 40 }}>{t('corporateOrders.empty', 'No corporate orders yet.')}</p>}
      {orders.slice(0, 10).map((o, i) => (
        <div key={o.id || i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>Order #{o.id?.slice(0, 8) || `ORD-${i + 1}`}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{o.patientName || o.name} · {o.testName || o.tests?.[0]?.name || '—'}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: o.status === 'completed' ? '#dcfce7' : o.status === 'confirmed' ? '#dbeafe' : '#f1f5f9', color: o.status === 'completed' ? '#16a34a' : o.status === 'confirmed' ? '#2563eb' : '#64748b', fontWeight: 600, textTransform: 'capitalize' }}>{o.status || 'pending'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}