import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function InventoryDashboard() {
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());

  const todayOrders = useMemo(() => orders.filter(o => o.collectionDate === new Date().toISOString().slice(0, 10)), [orders]);
  const pendingCollect = useMemo(() => todayOrders.filter(o => o.status === 'confirmed'), [todayOrders]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>📦 Welcome, {user?.name || 'Inventory Staff'}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#a16207' }}>{orders.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Consumables Used</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#a16207' }}>{todayOrders.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Today's Collections</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#a16207' }}>{pendingCollect.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Pending Collection Kits</div></div>
      </div>
      <div style={card}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>📋 Today's Collection Requirements</h4>
        {todayOrders.length === 0 && <p style={{ fontSize: 12, color: '#94a3b8' }}>No collections today.</p>}
        {todayOrders.map(o => (
          <div key={o.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
            <span>{o.patientInfo?.name || '—'} <span style={{ color: '#64748b' }}>| {(o.tests || []).slice(0, 3).join(', ')}</span></span>
            <span style={{ color: o.status === 'confirmed' ? '#d97706' : '#65a30d', fontWeight: 600 }}>{o.status === 'confirmed' ? 'Kit Needed' : 'Collected'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}