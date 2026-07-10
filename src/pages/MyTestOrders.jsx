import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/localOrderService';

const statusColors = { confirmed: '#2563eb', sample_collected: '#d97706', processing: '#7c3aed', results_ready: '#059669', completed: '#16a34a', cancelled: '#dc2626' };
const statusLabels = { confirmed: 'Confirmed', sample_collected: 'Sample Collected', processing: 'Processing', results_ready: 'Results Ready', completed: 'Completed', cancelled: 'Cancelled' };

export default function MyTestOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => { setOrders(getOrders()); }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    active: orders.filter(o => ['confirmed', 'sample_collected', 'processing'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="page-section container">
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>My Orders</h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Track and manage your test bookings</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 700, textTransform: 'capitalize', color: k === 'cancelled' ? '#dc2626' : k === 'completed' ? '#16a34a' : '#0f172a' }}>{v}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{k}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'confirmed', 'processing', 'completed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}>{f === 'all' ? `All (${orders.length})` : f}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {orders.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>No orders yet. Book your first test!</p>
            <Link to="/diagnostics" className="btn btn-primary">Browse Tests</Link>
          </div>
        ) : filtered.length === 0 ? (
          <p style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>No orders with status "{filter}".</p>
        ) : (
          filtered.map(o => (
            <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{o.tests?.map(t => t.name).join(', ') || 'Test Order'}</p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{o.id} · {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                {o.collectionDate && <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Collection: {o.collectionDate} {o.collectionTime ? `at ${o.collectionTime}` : ''}</p>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: statusColors[o.status] + '18', color: statusColors[o.status] }}>
                  {statusLabels[o.status] || o.status}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>₹{o.totalAmount?.toLocaleString()}</span>
                {o.status === 'results_ready' || o.status === 'completed' ? (
                  <button className="btn btn-outline btn-sm">View Report</button>
                ) : (
                  <Link to={`/dashboard?tab=bookings`} className="btn btn-outline btn-sm">Track</Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Link to="/diagnostics" className="btn btn-primary">Book Another Test</Link>
      </div>
    </div>
  );
}
