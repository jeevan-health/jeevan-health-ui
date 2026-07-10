import { useState, useEffect } from 'react';
import useAdminStore from '../../stores/adminStore';
import { assignPhlebotomist, addOrderNote, processRefund, rescheduleOrder, getPhlebotomists } from '../../services/localOrderService';
import { useT } from '../../i18n/LanguageProvider';

const STATUS_OPTIONS = ['confirmed', 'sample_collected', 'processing', 'results_ready', 'completed', 'cancelled'];

const MODAL_OVERLAY = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };

export default function AdminOrders() {
  const t = useT();
  const orders = useAdminStore(s => s.orders);
  const refreshOrders = useAdminStore(s => s.refreshOrders);
  const updateOrder = useAdminStore(s => s.updateOrder);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');

  // Modal states
  const [showAssign, setShowAssign] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [showNote, setShowNote] = useState(false);

  // Form states
  const [phleboId, setPhleboId] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [refundAmt, setRefundAmt] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [noteText, setNoteText] = useState('');

  const [phlebotomists, setPhlebotomists] = useState([]);
  const [selectedNoteAuthor, setSelectedNoteAuthor] = useState('');

  useEffect(() => { refreshOrders(); setPhlebotomists(getPhlebotomists()); }, []);
  useEffect(() => { if (selected) setPhlebotomists(getPhlebotomists()); }, [selected]);

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

  const handleAssign = () => {
    if (!phleboId) return;
    const phlebo = phlebotomists.find(p => p.id === phleboId);
    assignPhlebotomist(selected.id, phlebo);
    setShowAssign(false);
    setPhleboId('');
    refreshOrders();
    setSelected(getOrderUpdated(selected.id));
  };

  const handleReschedule = () => {
    if (!newDate || !newTime) return;
    rescheduleOrder(selected.id, newDate, newTime);
    setShowReschedule(false);
    setNewDate('');
    setNewTime('');
    refreshOrders();
    setSelected(getOrderUpdated(selected.id));
  };

  const handleRefund = () => {
    if (!refundAmt || !refundReason) return;
    processRefund(selected.id, parseFloat(refundAmt), refundReason);
    setShowRefund(false);
    setRefundAmt('');
    setRefundReason('');
    refreshOrders();
    setSelected(getOrderUpdated(selected.id));
  };

  const handleAddNote = () => {
    if (!noteText) return;
    addOrderNote(selected.id, noteText, selectedNoteAuthor || 'Admin');
    setShowNote(false);
    setNoteText('');
    setSelectedNoteAuthor('');
    refreshOrders();
    setSelected(getOrderUpdated(selected.id));
  };

  const getOrderUpdated = (id) => {
    const all = JSON.parse(localStorage.getItem('jeevan_orders') || '[]');
    return all.find(o => o.id === id) || null;
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="input" placeholder={t('admin.orders.search_placeholder', 'Search by order ID, patient, address...')} value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, maxWidth: 400, fontSize: 13 }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', background: '#fff' }}>
          <option value="all">{t('admin.orders.all_status', 'All Status')}</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
        </select>
        <span style={{ fontSize: 12, color: '#64748b' }}>{filtered.length} {t('admin.orders.orders', 'orders')}</span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>{t('admin.orders.no_orders', 'No orders found')}</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.orders.order_id', 'Order ID')}</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.orders.patient', 'Patient')}</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.orders.tests', 'Tests')}</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.orders.amount', 'Amount')}</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.orders.phlebotomist', 'Phlebotomist')}</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.orders.status', 'Status')}</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.orders.date', 'Date')}</th>
                <th style={{ textAlign: 'right', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.orders.action', 'Action')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9', background: selected?.id === o.id ? '#f8fafc' : 'transparent' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a', fontSize: 12 }}>{o.id}</td>
                  <td style={{ padding: '10px 14px', color: '#334155' }}>{o.bookedFor || o.patientInfo?.name || '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#334155', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {(o.tests || []).map(t => t.name || t).join(', ')}
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>₹{(o.totalAmount || 0).toLocaleString()}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontSize: 12 }}>
                    {o.phlebotomist ? o.phlebotomist.name : '—'}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${statusColors[o.status] || '#94a3b8'}20`, color: statusColors[o.status] || '#475569' }}>
                      {(o.status || 'pending').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontSize: 12 }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <button onClick={() => setSelected(selected?.id === o.id ? null : o)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                      {selected?.id === o.id ? `${t('admin.orders.close', 'Close')} ▲` : t('admin.orders.manage', 'Manage')}
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
        <div style={{ marginTop: 24, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>{selected.id}</h3>
              <span style={{ fontSize: 12, color: '#64748b' }}>{t('admin.orders.created', 'Created')} {formatDate(selected.createdAt)}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {selected.collectionDate && !selected.phlebotomist && (
                <ActionBtn label={t('admin.orders.assign_phlebo', 'Assign Phlebotomist')} color="#8b5cf6" onClick={() => { setShowAssign(true); }} />
              )}
              {selected.collectionDate && (
                <ActionBtn label={t('admin.orders.reschedule', 'Reschedule')} color="#f59e0b" onClick={() => { setNewDate(selected.collectionDate || ''); setNewTime(selected.collectionTime || ''); setShowReschedule(true); }} />
              )}
              {selected.status !== 'cancelled' && selected.status !== 'completed' && (
                <ActionBtn label={t('admin.orders.refund', 'Refund')} color="#ef4444" onClick={() => { setRefundAmt(String(selected.totalAmount || 0)); setShowRefund(true); }} />
              )}
              <ActionBtn label={t('admin.orders.add_note', 'Add Note')} color="#3b82f6" onClick={() => { setShowNote(true); }} />
            </div>
          </div>

          {/* Info Grid */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
            <div><span style={{ color: '#64748b' }}>{t('admin.orders.patient_label', 'Patient:')}</span> <strong>{selected.bookedFor || selected.patientInfo?.name || '—'}</strong></div>
            <div><span style={{ color: '#64748b' }}>{t('admin.orders.amount_label', 'Amount:')}</span> <strong>₹{(selected.totalAmount || 0).toLocaleString()}</strong></div>
            <div><span style={{ color: '#64748b' }}>{t('admin.orders.payment_label', 'Payment:')}</span> <strong>{(selected.paymentMethod || '—').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong></div>
            <div><span style={{ color: '#64748b' }}>{t('admin.orders.collection_label', 'Collection:')}</span> <strong>{selected.collectionDate || '—'} {selected.collectionTime || ''}</strong></div>
            <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#64748b' }}>{t('admin.orders.address_label', 'Address:')}</span> <strong>{selected.collectionAddress || '—'}</strong></div>
            <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#64748b' }}>{t('admin.orders.tests_label', 'Tests:')}</span> <strong>{(selected.tests || []).map(t => t.name || t).join(', ')}</strong></div>
            {selected.phlebotomist && (
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ color: '#64748b' }}>{t('admin.orders.phlebotomist_label', 'Phlebotomist:')}</span> <strong>{selected.phlebotomist.name}</strong>
                <span style={{ color: '#94a3b8', fontSize: 11, marginLeft: 8 }}>({selected.phlebotomist.phone})</span>
                <span style={{ color: '#94a3b8', fontSize: 11, marginLeft: 8 }}>{t('admin.orders.assigned', 'assigned')} {formatDate(selected.phlebotomist.assignedAt)}</span>
              </div>
            )}
            {selected.refund && (
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ color: '#64748b' }}>{t('admin.orders.refund_label', 'Refund:')}</span> <strong style={{ color: '#dc2626' }}>₹{selected.refund.amount}</strong>
                <span style={{ color: '#94a3b8', fontSize: 11, marginLeft: 8 }}>{selected.refund.reason}</span>
                <span style={{ color: '#94a3b8', fontSize: 11, marginLeft: 8 }}>{t('admin.orders.on', 'on')} {formatDate(selected.refund.processedAt)}</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', paddingLeft: 24 }}>
            {[
              { key: 'timeline', label: t('admin.orders.tab_timeline', 'Timeline') },
              { key: 'notes', label: `${t('admin.orders.tab_notes', 'Notes')} (${(selected.notes || []).length})` },
              { key: 'actions', label: t('admin.orders.tab_actions', 'Actions') },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{ padding: '10px 16px', border: 'none', borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400, color: activeTab === tab.key ? '#3b82f6' : '#64748b', fontFamily: 'inherit' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: 20, minHeight: 120 }}>
            {activeTab === 'timeline' && <TimelineView order={selected} t={t} />}
            {activeTab === 'notes' && <NotesView order={selected} t={t} />}
            {activeTab === 'actions' && <ActionsView order={selected} updateOrder={updateOrder} refreshOrders={refreshOrders} setShowAssign={setShowAssign} setShowReschedule={setShowReschedule} setShowRefund={setShowRefund} setNewDate={setNewDate} setNewTime={setNewTime} setRefundAmt={setRefundAmt} setShowNote={setShowNote} statusColors={statusColors} t={t} />}
          </div>
        </div>
      )}

      {/* Assign Phlebotomist Modal */}
      {showAssign && <Modal title={t('admin.orders.assign_phlebo_title', 'Assign Phlebotomist')} onClose={() => setShowAssign(false)} onConfirm={handleAssign} confirmLabel={t('admin.orders.assign', 'Assign')} t={t}>
        <select value={phleboId} onChange={e => setPhleboId(e.target.value)} style={inputStyle}>
          <option value="">{t('admin.orders.select_phlebo', 'Select phlebotomist...')}</option>
          {phlebotomists.filter(p => p.status !== 'offline').map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.phone}) — {p.status || 'available'}</option>
          ))}
        </select>
      </Modal>}

      {/* Reschedule Modal */}
      {showReschedule && <Modal title={t('admin.orders.reschedule_title', 'Reschedule Appointment')} onClose={() => setShowReschedule(false)} onConfirm={handleReschedule} confirmLabel={t('admin.orders.reschedule', 'Reschedule')} t={t}>
        <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.orders.new_date', 'New Date')}</label>
        <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }} />
        <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.orders.new_time', 'New Time')}</label>
        <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} style={inputStyle} />
      </Modal>}

      {/* Refund Modal */}
      {showRefund && <Modal title={t('admin.orders.process_refund_title', 'Process Refund')} onClose={() => setShowRefund(false)} onConfirm={handleRefund} confirmLabel={t('admin.orders.process_refund', 'Process Refund')} danger t={t}>
        <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.orders.amount_rupees', 'Amount (₹)')}</label>
        <input type="number" value={refundAmt} onChange={e => setRefundAmt(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }} />
        <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.orders.reason', 'Reason')}</label>
        <input placeholder={t('admin.orders.refund_reason_placeholder', 'e.g. Customer cancellation')} value={refundReason} onChange={e => setRefundReason(e.target.value)} style={inputStyle} />
      </Modal>}

      {/* Add Note Modal */}
      {showNote && <Modal title={t('admin.orders.add_note_title', 'Add Note')} onClose={() => setShowNote(false)} onConfirm={handleAddNote} confirmLabel={t('admin.orders.add_note', 'Add Note')} t={t}>
        <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.orders.your_name', 'Your Name')}</label>
        <input placeholder="Admin" value={selectedNoteAuthor} onChange={e => setSelectedNoteAuthor(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }} />
        <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.orders.note', 'Note')}</label>
        <textarea rows={3} placeholder={t('admin.orders.note_placeholder', 'Enter note...')} value={noteText} onChange={e => setNoteText(e.target.value)} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
      </Modal>}
    </div>
  );
}

function ActionBtn({ label, color, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${color}40`, background: `${color}10`, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color, fontWeight: 600 }}>
      {label}
    </button>
  );
}

function Modal({ title, children, onClose, onConfirm, confirmLabel, danger, t }) {
  return (
    <div style={MODAL_OVERLAY} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 400, maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{title}</h4>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8' }}>✕</button>
        </div>
        {children}
        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>{t('admin.orders.cancel', 'Cancel')}</button>
          <button onClick={onConfirm} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: danger ? '#ef4444' : '#3b82f6', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function TimelineView({ order, t }) {
  const timeline = order.timeline || [];
  const all = [
    ...order.statusHistory.map(h => ({ event: `${t('admin.orders.status_event', 'Status')}: ${h.from} → ${h.to}`, detail: '', at: h.at, type: 'status' })),
  ];
  if (timeline.length > 0) {
    const existingEvents = new Set(timeline.map(t => t.at));
    all.forEach(a => { if (!existingEvents.has(a.at)) timeline.push(a); });
    timeline.sort((a, b) => new Date(a.at) - new Date(b.at));
  }
  const items = (timeline.length > 0 ? timeline : all).sort((a, b) => new Date(a.at) - new Date(b.at));

  if (items.length === 0) return <div style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: 20 }}>{t('admin.orders.no_timeline', 'No timeline events')}</div>;

  return (
    <div style={{ position: 'relative' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 16, position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: 4 }} />
            {i < items.length - 1 && <div style={{ width: 1, flex: 1, background: '#d1d5db', marginTop: 4 }} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{item.event}</div>
            {item.detail && <div style={{ fontSize: 12, color: '#64748b' }}>{item.detail}</div>}
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{formatDateLocal(item.at)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NotesView({ order, t }) {
  const notes = order.notes || [];
  if (notes.length === 0) return <div style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: 20 }}>{t('admin.orders.no_notes', 'No notes yet')}</div>;
  return (
    <div>
      {[...notes].reverse().map((n, i) => (
        <div key={i} style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8, marginBottom: 8, fontSize: 13 }}>
          <div style={{ color: '#0f172a' }}>{n.text}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
            <span>{n.author || 'Admin'}</span>
            <span>{formatDateLocal(n.at)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActionsView({ order, updateOrder, refreshOrders, statusColors, t }) {
  const STATUS_OPTIONS = ['confirmed', 'sample_collected', 'processing', 'results_ready', 'completed', 'cancelled'];
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>{t('admin.orders.update_status', 'UPDATE STATUS')}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {STATUS_OPTIONS.filter(s => s !== order.status && s !== 'cancelled').map(s => (
          <button key={s} onClick={() => { updateOrder(order.id, s); refreshOrders(); }}
            style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${(statusColors[s] || '#e2e8f0')}40`, background: `${(statusColors[s] || '#fff')}15`, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: statusColors[s] || '#334155', fontWeight: 600 }}>
            {t('admin.orders.mark', 'Mark')} {s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
        {order.status !== 'cancelled' && (
          <button onClick={() => { if (confirm(t('admin.orders.cancel_confirm', 'Cancel this order?'))) { updateOrder(order.id, 'cancelled'); refreshOrders(); } }}
            style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#dc2626', fontWeight: 600 }}>
            {t('admin.orders.cancel_order', 'Cancel Order')}
          </button>
        )}
      </div>
    </div>
  );
}

function formatDateLocal(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}