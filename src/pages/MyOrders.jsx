import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, Package, Clock, CheckCircle, Truck, XCircle } from '@phosphor-icons/react';
import { getMyOrders } from '../services/pharmacyService';

const statusConfig = {
  pending: { icon: Clock, color: '#e65100', bg: '#fff3e0', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: '#0B4FA8', bg: '#e8f0fe', label: 'Confirmed' },
  preparing: { icon: Package, color: '#7c3aed', bg: '#f5f3ff', label: 'Preparing' },
  shipped: { icon: Truck, color: '#2e7d32', bg: '#e8f5e9', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: '#2e7d32', bg: '#e8f5e9', label: 'Delivered' },
  cancelled: { icon: XCircle, color: '#c62828', bg: '#fbe9e7', label: 'Cancelled' },
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyOrders().then(({ data }) => setOrders(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-section">
      <div className="container">
        <button onClick={() => navigate('/pharmacy')} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          <CaretLeft size={16} /> Back to Pharmacy
        </button>
        <h1>My Orders</h1>

        {loading ? (
          <div className="card p-10 text-center" style={{ marginTop: 20 }}>Loading...</div>
        ) : orders.length === 0 ? (
          <div className="card p-10 text-center" style={{ marginTop: 20 }}>
            <Package size={40} style={{ color: 'var(--text-light)', marginBottom: 12 }} />
            <p style={{ color: 'var(--text-light)' }}>No orders yet.</p>
            <button onClick={() => navigate('/pharmacy')} className="btn-primary" style={{ marginTop: 16 }}>Order Medicines</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
            {orders.map(order => {
              const st = statusConfig[order.status] || statusConfig.pending;
              const Icon = st.icon;
              return (
                <div key={order.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-light)' }}>Order #{order.id}</span>
                      <span style={{ padding: '2px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600, background: st.bg, color: st.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon size={14} /> {st.label}
                      </span>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>₹{order.total_amount}</span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '3px 0', color: 'var(--text-body)' }}>
                        <span>{item.name} × {item.qty}</span>
                        <span>₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 8 }}>
                    Placed: {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['pending', 'confirmed', 'preparing', 'shipped'].map(s => {
                      const sc = statusConfig[s];
                      const done = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered'].indexOf(s) <= ['pending', 'confirmed', 'preparing', 'shipped', 'delivered'].indexOf(order.status);
                      return (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: done ? sc.color : '#ccc' }}>
                          <sc.icon size={12} weight={done ? 'fill' : 'regular'} /> {sc.label}
                          {s !== 'shipped' && <span style={{ color: '#ccc' }}>→</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
