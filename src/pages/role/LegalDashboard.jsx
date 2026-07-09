import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function LegalDashboard() {
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());
  const users = useAuthStore(s => s.getUsers)();

  const cancelled = useMemo(() => orders.filter(o => o.status === 'cancelled'), [orders]);
  const consentOrders = useMemo(() => orders.filter(o => o.consent === true || o.consentGiven), [orders]);
  const consentRate = useMemo(() => orders.length > 0 ? Math.round((consentOrders.length / orders.length) * 100) : 0, [orders]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>⚖️ Welcome, {user?.name || 'Legal Officer'}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#4f46e5' }}>{users.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Registered Users</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#4f46e5' }}>{cancelled.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Cancelled / Disputes</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#4f46e5' }}>{consentRate}%</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Consent Capture Rate</div></div>
      </div>
      <div style={card}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>📋 Audit Trail — Recent Orders</h4>
        {orders.slice(0, 8).map(o => (
          <div key={o.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
            <span>{o.patientInfo?.name || '—'} <span style={{ color: '#64748b' }}>| {o.id?.slice(0, 12)}</span></span>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>{new Date(o.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}