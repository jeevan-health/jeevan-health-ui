import { useState } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function ITSupportDashboard() {
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());
  const users = useAuthStore(s => s.getUsers)();

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>🖥️ Welcome, {user?.name || 'IT Support'}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#4f46e5' }}>{users.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>System Users</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#4f46e5' }}>{orders.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Total Orders</div></div>
      </div>
      <div style={card}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>📊 System Overview</h4>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Active Users</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{users.filter(u => u.updatedAt && Date.now() - new Date(u.updatedAt).getTime() < 86400000).length}</div>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Recent Orders (24h)</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{orders.filter(o => o.createdAt && Date.now() - new Date(o.createdAt).getTime() < 86400000).length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}