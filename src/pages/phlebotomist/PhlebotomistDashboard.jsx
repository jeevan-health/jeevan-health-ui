import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders, updateOrderStatus } from '../../services/localOrderService';

const sectionCard = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const STATUSES = ['confirmed', 'sample_collected', 'processing', 'results_ready', 'completed'];
const STATUS_MAP = { confirmed: '🟡', sample_collected: '🟢', processing: '🔵', results_ready: '🟣', completed: '✅' };

export default function PhlebotomistDashboard() {
  const user = useAuthStore(s => s.user);
  const [orders, setOrders] = useState(() => getOrders());
  const [refresh, setRefresh] = useState(0);

  const refreshOrders = () => { setOrders(getOrders()); setRefresh(r => r + 1); };

  // Filter orders assigned to this phlebotomist (by phone)
  const myOrders = useMemo(() => orders.filter(o => o.phlebotomist?.phone === user?.phone), [orders, user]);

  const stats = useMemo(() => ({
    today: myOrders.filter(o => o.collectionDate === new Date().toISOString().slice(0, 10)).length,
    pending: myOrders.filter(o => o.status === 'confirmed').length,
    collected: myOrders.filter(o => o.status === 'sample_collected').length,
    processing: myOrders.filter(o => o.status === 'processing').length,
    completed: myOrders.filter(o => o.status === 'completed').length,
  }), [myOrders]);

  const handleStatus = (id, status) => { updateOrderStatus(id, status); refreshOrders(); };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>👋 Welcome, {user?.name || 'Phlebotomist'}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

      {/* Stats */}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: 16 }}>
        {[
          { label: "Today's Collections", value: stats.today, color: '#059669', bg: '#ecfdf5' },
          { label: 'Pending Pickup', value: stats.pending, color: '#d97706', bg: '#fffbeb' },
          { label: 'Collected', value: stats.collected, color: '#2563eb', bg: '#eff6ff' },
          { label: 'Processing', value: stats.processing, color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Delivered', value: stats.completed, color: '#059669', bg: '#ecfdf5' },
        ].map(s => (
          <div key={s.label} style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* My Collections List */}
      <div style={sectionCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>📋 My Collections</h4>
          <button onClick={refreshOrders} style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>🔄 Refresh</button>
        </div>
        {myOrders.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 24 }}>No collections assigned yet.</p>}
        {myOrders.map(order => (
          <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 13 }}>{STATUS_MAP[order.status] || '⚪'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{order.patientInfo?.name || order.bookedFor || 'Unknown'}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                {order.id?.slice(0, 12)}... | {order.collectionDate || '—'} {order.collectionTime ? `@ ${order.collectionTime}` : ''}
              </div>
              {order.collectionAddress?.area && <div style={{ fontSize: 11, color: '#94a3b8' }}>{order.collectionAddress.area}</div>}
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {order.status === 'confirmed' && <button onClick={() => handleStatus(order.id, 'sample_collected')} style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: '#059669', color: '#fff', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>Mark Collected</button>}
              {order.status === 'sample_collected' && <button onClick={() => handleStatus(order.id, 'processing')} style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>Send to Lab</button>}
              {order.collectionDate === today && order.status === 'confirmed' && (
                <span style={{ padding: '3px 8px', borderRadius: 4, background: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: 600 }}>Today</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}