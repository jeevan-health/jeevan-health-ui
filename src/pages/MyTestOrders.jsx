import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, Flask, Clock, MapPin, CheckCircle, Truck, XCircle, WhatsappLogo } from '@phosphor-icons/react';
import { getOrders, cancelOrder, updateOrder } from '../services/localOrderService';

const statusConfig = {
  pending: { icon: Clock, color: '#e65100', bg: '#fff3e0', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: '#0F5DA8', bg: '#e8f0fe', label: 'Confirmed' },
  sample_collected: { icon: Truck, color: '#7c3aed', bg: '#f5f3ff', label: 'Sample Collected' },
  processing: { icon: Clock, color: '#e65100', bg: '#fff3e0', label: 'Processing' },
  results_ready: { icon: CheckCircle, color: '#2e7d32', bg: '#e8f5e9', label: 'Results Ready' },
  completed: { icon: CheckCircle, color: '#2e7d32', bg: '#e8f5e9', label: 'Completed' },
  cancelled: { icon: XCircle, color: '#c62828', bg: '#fbe9e7', label: 'Cancelled' },
};

export default function MyTestOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => {
    setOrders(getOrders());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="page-section">
      <div className="container">
        <button onClick={() => navigate('/diagnostics')} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
          <CaretLeft size={16} /> Back to Diagnostics
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h1 style={{ margin: 0 }}>My Bookings</h1>
          <button onClick={() => navigate('/diagnostics')} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            Book New Test
          </button>
        </div>

        {loading ? (
          <div className="card p-10 text-center" style={{ marginTop: 20 }}>Loading...</div>
        ) : orders.length === 0 ? (
          <div className="card p-10 text-center" style={{ marginTop: 20 }}>
            <Flask size={40} style={{ color: 'var(--text-light)', marginBottom: 12 }} />
            <p style={{ color: 'var(--text-light)' }}>No test orders yet.</p>
            <button onClick={() => navigate('/diagnostics')} className="btn-primary" style={{ marginTop: 16 }}>Book a Test</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            {orders.map(order => {
              const st = statusConfig[order.status] || statusConfig.pending;
              const Icon = st.icon;
              const canCancel = ['pending', 'confirmed'].includes(order.status);

              return (
                <div key={order.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-light)' }}>#{order.id}</span>
                      <span style={{ padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon size={13} /> {st.label}
                      </span>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#e53935' }}>{'\u20B9'}{order.totalAmount}</span>
                  </div>

                  <div style={{ marginBottom: 6 }}>
                    {order.tests?.map((t, i) => (
                      <div key={i} style={{ fontSize: 12, padding: '2px 0', color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Flask size={12} color="#0F5DA8" /> {t.name} — {'\u20B9'}{t.price}
                      </div>
                    ))}
                  </div>

                  {order.collectionDate && (
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} /> {new Date(order.collectionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}{order.collectionTime ? ` at ${order.collectionTime}` : ''}
                    </div>
                  )}

                  <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 10 }}>
                    Booked: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/diagnostics')} style={{ padding: '6px 14px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Flask size={12} /> Re-Book
                    </button>
                    {order.status === 'results_ready' && (
                      <button onClick={() => navigate(`/test-results/${order.id}`)} style={{ padding: '6px 14px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: '#2e7d32', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        View Results
                      </button>
                    )}
                    <a href={`https://wa.me/919700104108?text=${encodeURIComponent('Hi! I have a query about my order: ' + order.id)}`} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 14px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: '#25d366', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <WhatsappLogo size={12} weight="fill" /> Support
                    </a>
                    {canCancel && (
                      <button onClick={() => { cancelOrder(order.id); load(); }} style={{ padding: '6px 14px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Cancel
                      </button>
                    )}
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
