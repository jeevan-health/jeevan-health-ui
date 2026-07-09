import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function FinanceDashboard() {
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());

  const revenue = useMemo(() => orders.reduce((s, o) => s + (o.totalAmount || 0), 0), [orders]);
  const payAtCollection = useMemo(() => orders.filter(o => o.paymentMethod === 'pay_at_collection'), [orders]);
  const online = useMemo(() => orders.filter(o => o.paymentMethod === 'online'), [orders]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>💳 Welcome, {user?.name || 'Finance'}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#15803d' }}>₹{(revenue).toLocaleString()}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Total Revenue</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#15803d' }}>{online.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Online Payments</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#15803d' }}>{payAtCollection.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Pay at Collection</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#15803d' }}>{orders.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Total Transactions</div></div>
      </div>
      <div style={card}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>📋 Transaction History</h4>
        {orders.slice(0, 8).map(o => (
          <div key={o.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
            <span>{o.patientInfo?.name || '—'} <span style={{ color: '#64748b' }}>{o.paymentMethod?.replace(/_/g, ' ') || '—'}</span></span>
            <span style={{ fontWeight: 600, color: '#15803d' }}>₹{o.totalAmount || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}