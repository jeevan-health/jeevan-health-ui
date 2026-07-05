import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, Flask, Clock, MapPin, CheckCircle, Truck, XCircle } from '@phosphor-icons/react';
import { getDiagnosticOrders, scheduleCollection } from '../services/diagnosticsService';

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
  const [scheduling, setScheduling] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    try { const { data } = await getDiagnosticOrders(); setOrders(data); } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSchedule = async (orderId) => {
    try {
      await scheduleCollection(orderId, scheduling);
      setScheduling(null);
      load();
    } catch {}
  };

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="page-section">
      <div className="container">
        <button onClick={() => navigate('/diagnostics')} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          <CaretLeft size={16} /> Back to Diagnostics
        </button>
        <h1>My Test Orders</h1>

        {loading ? (
          <div className="card p-10 text-center" style={{ marginTop: 20 }}>Loading...</div>
        ) : orders.length === 0 ? (
          <div className="card p-10 text-center" style={{ marginTop: 20 }}>
            <Flask size={40} style={{ color: 'var(--text-light)', marginBottom: 12 }} />
            <p style={{ color: 'var(--text-light)' }}>No test orders yet.</p>
            <button onClick={() => navigate('/diagnostics')} className="btn-primary" style={{ marginTop: 16 }}>Book a Test</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
            {orders.map(order => {
              const st = statusConfig[order.status] || statusConfig.pending;
              const Icon = st.icon;
              const isPending = order.status === 'pending';

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
                    {order.tests?.map((t, i) => (
                      <div key={i} style={{ fontSize: 13, padding: '3px 0', color: 'var(--text-body)' }}>
                        <Flask size={14} style={{ marginRight: 6 }} />{t.name} — ₹{t.price}
                      </div>
                    ))}
                  </div>
                  {order.collection_date && (
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
                      <MapPin size={14} /> Collection: {new Date(order.collection_date).toLocaleDateString('en-IN')} at {order.collection_time}
                    </p>
                  )}
                  <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>
                    Ordered: {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>

                  {/* Schedule if pending */}
                  {isPending && scheduling?.id === order.id ? (
                    <div style={{ marginTop: 10, padding: 12, background: '#f5f7fa', borderRadius: 8 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                        <input type="date" min={getMinDate()} value={scheduling.collectionDate || ''}
                          onChange={e => setScheduling({ ...scheduling, collectionDate: e.target.value })}
                          className="input" style={{ padding: '6px 10px', fontSize: 12 }} placeholder="Date" />
                        <select value={scheduling.collectionTime || ''}
                          onChange={e => setScheduling({ ...scheduling, collectionTime: e.target.value })}
                          className="input" style={{ padding: '6px 10px', fontSize: 12 }}>
                          <option value="">Time</option>
                          {['6:00 AM - 8:00 AM', '8:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <input placeholder="Address" value={scheduling.collectionAddress?.line1 || ''}
                        onChange={e => setScheduling({ ...scheduling, collectionAddress: { ...scheduling.collectionAddress, line1: e.target.value } })}
                        className="input" style={{ padding: '6px 10px', fontSize: 12, marginBottom: 8 }} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleSchedule(order.id)} className="btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}>Confirm</button>
                        <button onClick={() => setScheduling(null)} style={{ padding: '6px 14px', fontSize: 12, color: 'var(--text-light)', background: 'none' }}>Cancel</button>
                      </div>
                    </div>
                  ) : isPending && (
                    <button onClick={() => setScheduling({ id: order.id, collectionDate: '', collectionTime: '', collectionAddress: { line1: '' } })}
                      className="btn-primary" style={{ marginTop: 8, padding: '6px 14px', fontSize: 12 }}>
                      Schedule Collection
                    </button>
                  )}

                  {(order.status === 'results_ready' || order.status === 'completed') && (
                    <button onClick={() => navigate(`/test-results/${order.id}`)} className="btn-primary" style={{ marginTop: 8, padding: '6px 14px', fontSize: 12 }}>
                      View Results
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
