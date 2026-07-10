import { useState } from 'react';
import useInventoryStore from '../../stores/inventoryStore';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function PharmacyOrders() {
  const items = useInventoryStore(s => s.items);
  const t = useT();
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.pharmacyOrders.title', '📋 Pharmacy Orders')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{t('role.pharmacyOrders.subtitle', 'Order fulfillment and tracking')}</p>
      {items.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 40 }}>{t('role.pharmacyOrders.noOrders', 'No orders yet.')}</p>}
      {items.slice(0, 10).map((i, idx) => (
        <div key={i.id || idx} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{i.name}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>Qty: {i.quantity || 0} {i.unit} · ₹{i.costPerUnit || 0}/unit</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: '#f1f5f9', color: '#64748b', fontWeight: 600 }}>{i.category}</span>
          </div>
        </div>
      ))}
    </div>
  );
}