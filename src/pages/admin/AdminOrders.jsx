import { useState, useEffect } from 'react';
import useAdminStore from '../../stores/adminStore';

const STATUS_OPTIONS = ['confirmed', 'sample_collected', 'processing', 'results_ready', 'completed', 'cancelled'];

export default function AdminOrders() {
  const orders = useAdminStore(s => s.orders);
  const refreshOrders = useAdminStore(s => s.refreshOrders);
  const updateOrder = useAdminStore(s => s.updateOrder);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => { refreshOrders(); }, []);

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    const q = search.toLowerCase();
    return (o.id || '').toLowerCase().includes(q) ||
      (o.bookedFor || '').toLowerCase().includes(q) ||
      (o.patientInfo?.name || '').toLowerCase().includes(q) ||
      (o.collectionAddress || '').toLowerCase().includes(q);
  });

  const statusColors = {
    pending: '#f97316', confirmed: '#3b82f6', sample_collected: '#8b5cf6',
    processing: '#f59e0b', results_ready: '#22c55e', completed: '#10b981', cancelled: '#ef4444',
  };

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="input" placeholder="Search by order ID, patient, address..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, maxWidth: 400, fontSize: 13 }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', background: '#fff' }}>
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <span style={{ fontSize: 12, color: '#64748b' }}>{filtered.length} orders</span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>No orders found</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Order ID</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Patient</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Tests</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Date</th>
                <th style={{ textAlign: 'right', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a', fontSize: 12 }}>{o.id}</td>
                  <td style={{ padding: '10px 14px', color: '#334155' }}>{o.bookedFor || o.patientInfo?.name || '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#334155', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {(o.tests || []).map(t => t.name || t).join(', ')}
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>₹{(o.totalAmount || 0).toLocaleString()}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${statusColors[o.status] || '#94a3b8'}20`, color: statusColors[o.status] || '#475569' }}>
                      {(o.status || 'pending').replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontSize: 12 }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <button onClick={() => setSelected(selected?.id === o.id ? null : o)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12 }}>
                      {selected?.id === o.id ? 'Close' : 'Manage'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Panel */}
      {selected && (
        <div style={{ marginTop: 24, background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#0f172a' }}>Order {selected.id}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20, fontSize: 13 }}>
            <div><span style={{ color: '#64748b' }}>Patient:</span> <strong>{selected.bookedFor || selected.patientInfo?.name || '—'}</strong></div>
            <div><span style={{ color: '#64748b' }}>Amount:</span> <strong>₹{(selected.totalAmount || 0).toLocaleString()}</strong></div>
            <div><span style={{ color: '#64748b' }}>Payment:</span> <strong>{(selected.paymentMethod || '—').replace(/_/g, ' ')}</strong></div>
            <div><span style={{ color: '#64748b' }}>Collection:</span> <strong>{selected.collectionDate || '—'} {selected.collectionTime || ''}</strong></div>
            <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#64748b' }}>Address:</span> <strong>{selected.collectionAddress || '—'}</strong></div>
            <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#64748b' }}>Tests:</span> <strong>{(selected.tests || []).map(t => t.name || t).join(', ')}</strong></div>
          </div>

          {/* Status Timeline */}
          {(selected.statusHistory || []).length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>TIMELINE</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {selected.statusHistory.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, background: '#f1f5f9', fontSize: 11 }}>{h.from} → {h.to}</span>
                    <span style={{ fontSize: 10 }}>{new Date(h.at).toLocaleString()}</span>
                    {i < selected.statusHistory.length - 1 && <span style={{ color: '#d1d5db' }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Actions */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>UPDATE STATUS</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {STATUS_OPTIONS.filter(s => s !== selected.status && s !== 'cancelled').map(s => (
                <button key={s} onClick={() => { updateOrder(selected.id, s); }} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#334155' }}>
                  Mark {s.replace(/_/g, ' ')}
                </button>
              ))}
              {selected.status !== 'cancelled' && (
                <button onClick={() => { if (confirm('Cancel this order?')) updateOrder(selected.id, 'cancelled'); }} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#dc2626' }}>
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
