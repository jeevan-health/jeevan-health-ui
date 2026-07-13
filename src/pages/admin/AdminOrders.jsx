import { useState, useEffect, useCallback, useRef } from 'react';
import * as adminService from '../../services/adminService';
import * as labReportService from '../../services/labReportService';
import { useT } from '../../i18n/LanguageProvider';
import { notify } from '../../lib/toastBus';

const DIAG_STATUSES = ['pending', 'confirmed', 'sample_collected', 'processing', 'results_ready', 'completed', 'cancelled'];
const PHARM_STATUSES = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];

function parseTests(tests) {
  if (!tests) return [];
  if (typeof tests === 'string') {
    try { return JSON.parse(tests); } catch { return []; }
  }
  return Array.isArray(tests) ? tests : [];
}

function mapOrder(o) {
  const tests = parseTests(o.tests || o.items);
  const addr = o.collection_address || o.delivery_address || o.collectionAddress || {};
  const addrStr = typeof addr === 'string'
    ? addr
    : [addr.addressLine, addr.city, addr.pincode, addr.fullName].filter(Boolean).join(', ');
  return {
    id: o.id,
    orderType: o.order_type || o.orderType || 'diagnostic',
    status: o.status || 'pending',
    totalAmount: Number(o.total_amount ?? o.totalAmount) || 0,
    tests,
    userId: o.user_id || o.userId || null,
    userName: o.user_name || o.userName || addr.fullName || addr.patient?.name || '—',
    userPhone: o.user_phone || o.userPhone || '',
    userEmail: o.user_email || o.userEmail || '',
    collectionDate: o.collection_date || o.collectionDate || '',
    collectionTime: o.collection_time || o.collectionTime || '',
    address: addrStr || '—',
    createdAt: o.created_at || o.createdAt,
    notes: o.notes || '',
  };
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve(result.includes(',') ? result.split(',')[1] : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminOrders() {
  const t = useT();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [uploadingReport, setUploadingReport] = useState(false);
  const reportInputRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminService.getOrders({
        type: typeFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
        limit: 100,
      });
      const list = (data.orders || data || []).map(mapOrder);
      setOrders(list);
      if (selected) {
        const refreshed = list.find(o => o.id === selected.id && o.orderType === selected.orderType);
        setSelected(refreshed || null);
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || t('admin.orders.loadError', 'Failed to load orders'));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, search, t]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  const statusColors = {
    pending: '#f97316', confirmed: '#3b82f6', sample_collected: '#8b5cf6',
    processing: '#f59e0b', results_ready: '#22c55e', completed: '#10b981', cancelled: '#ef4444',
    preparing: '#a855f7', shipped: '#0ea5e9', delivered: '#10b981',
  };

  const handleStatusChange = async (order, status) => {
    setUpdatingId(order.id);
    try {
      await adminService.updateOrderStatus(order.orderType, order.id, status);
      await load();
    } catch (err) {
      notify.error(err?.response?.data?.error || t('admin.orders.updateFailed', 'Failed to update status'));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUploadReport = async (order) => {
    if (!order?.userId) {
      notify.error('This order has no linked patient account — cannot upload report');
      return;
    }
    if (!reportFile) {
      notify.warning('Choose a PDF report first');
      return;
    }
    if (reportFile.type && reportFile.type !== 'application/pdf') {
      notify.error('Please upload a PDF file');
      return;
    }
    if (reportFile.size > 8 * 1024 * 1024) {
      notify.error('PDF must be under 8 MB');
      return;
    }
    setUploadingReport(true);
    try {
      const pdfBase64 = await fileToBase64(reportFile);
      const testName = order.tests.map((x) => x.name || x).filter(Boolean).join(', ')
        || `Order #${order.id} report`;
      const { data } = await labReportService.uploadReport({
        userId: order.userId,
        testName: String(testName).slice(0, 200),
        fileName: reportFile.name || `order-${order.id}-report.pdf`,
        mimeType: 'application/pdf',
        pdfBase64,
        notes: `Linked to diagnostic order #${order.id}`,
        sendEmail: true,
        sendPush: true,
      });
      // Mark order results ready if still earlier status
      if (order.orderType === 'diagnostic' && !['completed', 'cancelled', 'results_ready'].includes(order.status)) {
        try {
          await adminService.updateOrderStatus(order.orderType, order.id, 'results_ready');
        } catch { /* optional */ }
      }
      notify.success(
        data.email?.sent
          ? `Report uploaded & emailed to ${data.email.to || order.userEmail || 'patient'}`
          : `Report uploaded (email: ${data.email?.error || 'check patient email'})`
      );
      setReportFile(null);
      if (reportInputRef.current) reportInputRef.current.value = '';
      await load();
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Report upload failed');
    } finally {
      setUploadingReport(false);
    }
  };

  const statusOptions = typeFilter === 'pharmacy' ? PHARM_STATUSES : DIAG_STATUSES;

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="input"
          placeholder={t('admin.orders.search_placeholder', 'Search by order ID, patient...')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 180, maxWidth: 360, fontSize: 13 }}
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', background: '#fff' }}
        >
          <option value="all">{t('admin.orders.all_types', 'All Types')}</option>
          <option value="diagnostic">{t('admin.orders.diagnostic', 'Diagnostics')}</option>
          <option value="pharmacy">{t('admin.orders.pharmacy', 'Pharmacy')}</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', background: '#fff' }}
        >
          <option value="all">{t('admin.orders.all_status', 'All Status')}</option>
          {statusOptions.map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
          ))}
        </select>
        <button type="button" className="btn btn-outline btn-sm" onClick={load}>
          {t('admin.orders.refresh', 'Refresh')}
        </button>
        <span style={{ fontSize: 12, color: '#64748b' }}>{orders.length} {t('admin.orders.orders', 'orders')}</span>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>{t('admin.orders.loading', 'Loading…')}</div>}
      {error && !loading && <div style={{ textAlign: 'center', padding: 40, color: '#dc2626', fontSize: 13 }}>{error}</div>}
      {!loading && !error && orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>{t('admin.orders.no_orders', 'No orders found')}</div>
      )}

      {/* Mobile card list */}
      {!loading && orders.length > 0 && (
        <div className="admin-orders-cards" style={{ display: 'none', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {orders.map(o => {
            const open = selected?.id === o.id && selected?.orderType === o.orderType;
            return (
              <div key={`${o.orderType}-${o.id}`} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>#{o.id} · <span style={{ textTransform: 'capitalize', fontWeight: 500, color: '#64748b' }}>{o.orderType}</span></div>
                  <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: `${statusColors[o.status] || '#94a3b8'}20`, color: statusColors[o.status] || '#475569' }}>
                    {(o.status || 'pending').replace(/_/g, ' ')}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{o.userName}</div>
                {o.userPhone && <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{o.userPhone}</div>}
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, lineHeight: 1.4 }}>
                  {o.tests.map(x => x.name || x).join(', ') || '—'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: 14 }}>₹{o.totalAmount.toLocaleString()}</strong>
                  <button
                    type="button"
                    onClick={() => setSelected(open ? null : o)}
                    style={{ background: '#EEF2FF', border: 'none', color: '#1866C9', cursor: 'pointer', fontSize: 12, fontWeight: 700, padding: '8px 12px', borderRadius: 8, minHeight: 40 }}
                  >
                    {open ? t('admin.orders.close', 'Close') : t('admin.orders.manage', 'Manage')}
                  </button>
                </div>
                {open && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, lineHeight: 1.5 }}>
                      <div>📅 {o.collectionDate || '—'} {o.collectionTime || ''}</div>
                      <div>📍 {o.address}</div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(o.orderType === 'pharmacy' ? PHARM_STATUSES : DIAG_STATUSES).map(s => (
                        <button
                          key={s}
                          type="button"
                          disabled={updatingId === o.id}
                          onClick={() => handleStatusChange(o, s)}
                          style={{
                            padding: '8px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                            cursor: 'pointer', minHeight: 36,
                            border: o.status === s ? '2px solid #1866C9' : '1px solid #e2e8f0',
                            background: o.status === s ? '#EEF2FF' : '#fff',
                            color: o.status === s ? '#1866C9' : '#475569',
                          }}
                        >
                          {s.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="admin-orders-table" style={{ background: '#fff', borderRadius: 12, overflowX: 'auto', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11 }}>ID</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11 }}>Type</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11 }}>Patient</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11 }}>Items</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11 }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11 }}>Status</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11 }}>Date</th>
                <th style={{ textAlign: 'right', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={`${o.orderType}-${o.id}`} style={{ borderBottom: '1px solid #f1f5f9', background: selected?.id === o.id && selected?.orderType === o.orderType ? '#f8fafc' : 'transparent' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, fontSize: 12 }}>#{o.id}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, textTransform: 'capitalize' }}>{o.orderType}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div>{o.userName}</div>
                    {o.userPhone && <div style={{ fontSize: 11, color: '#94a3b8' }}>{o.userPhone}</div>}
                  </td>
                  <td style={{ padding: '10px 14px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.tests.map(x => x.name || x).join(', ') || '—'}
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>₹{o.totalAmount.toLocaleString()}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${statusColors[o.status] || '#94a3b8'}20`, color: statusColors[o.status] || '#475569' }}>
                      {(o.status || 'pending').replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontSize: 12 }}>
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => setSelected(selected?.id === o.id && selected?.orderType === o.orderType ? null : o)}
                      style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                    >
                      {selected?.id === o.id && selected?.orderType === o.orderType ? 'Close' : 'Manage'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="admin-orders-detail" style={{ marginTop: 24, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>#{selected.id} · {selected.orderType}</h3>
          <div className="admin-orders-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13, marginBottom: 16 }}>
            <div><span style={{ color: '#64748b' }}>Patient:</span> <strong>{selected.userName}</strong></div>
            <div><span style={{ color: '#64748b' }}>Amount:</span> <strong>₹{selected.totalAmount.toLocaleString()}</strong></div>
            <div><span style={{ color: '#64748b' }}>Collection:</span> <strong>{selected.collectionDate || '—'} {selected.collectionTime || ''}</strong></div>
            <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#64748b' }}>Address:</span> <strong>{selected.address}</strong></div>
            <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#64748b' }}>Items:</span> <strong>{selected.tests.map(x => x.name || x).join(', ') || '—'}</strong></div>
            {selected.notes && <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#64748b' }}>Notes:</span> {selected.notes}</div>}
          </div>
          <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600 }}>Update status</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(selected.orderType === 'pharmacy' ? PHARM_STATUSES : DIAG_STATUSES).map(s => (
              <button
                key={s}
                type="button"
                disabled={updatingId === selected.id}
                onClick={() => handleStatusChange(selected, s)}
                style={{
                  padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  cursor: 'pointer', minHeight: 40,
                  border: selected.status === s ? '2px solid #1866C9' : '1px solid #e2e8f0',
                  background: selected.status === s ? '#EEF2FF' : '#fff',
                  color: selected.status === s ? '#1866C9' : '#475569',
                }}
              >
                {s.replace(/_/g, ' ')}
              </button>
            ))}
            {updatingId === selected.id && <span style={{ fontSize: 12, color: '#64748b', alignSelf: 'center' }}>Saving…</span>}
          </div>

          {/* Upload lab report PDF → patient email + dashboard download */}
          {selected.orderType === 'diagnostic' && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>📄 Upload lab report (PDF)</div>
              <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748b', lineHeight: 1.45 }}>
                Sends PDF to the patient email and shows it under their Dashboard → Reports.
                {selected.userEmail ? ` Patient email: ${selected.userEmail}` : ' ⚠️ No email on file — patient must have email for delivery.'}
              </p>
              {!selected.userId && (
                <div style={{ fontSize: 12, color: '#b91c1c', marginBottom: 8 }}>No linked user_id on this order — cannot attach report.</div>
              )}
              <input
                ref={reportInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => setReportFile(e.target.files?.[0] || null)}
                style={{ fontSize: 13, marginBottom: 10, width: '100%' }}
              />
              {reportFile && (
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>
                  {reportFile.name} ({Math.round(reportFile.size / 1024)} KB)
                </div>
              )}
              <button
                type="button"
                className="btn btn-primary"
                disabled={uploadingReport || !selected.userId}
                onClick={() => handleUploadReport(selected)}
                style={{ minHeight: 42 }}
              >
                {uploadingReport ? 'Uploading & notifying…' : 'Upload report · email PDF · notify'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile: report upload inside expanded card manage section is via detail hidden — show inline when selected on mobile */}
      {selected && selected.orderType === 'diagnostic' && (
        <div className="admin-orders-report-mobile" style={{ display: 'none', marginTop: 12, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>📄 Upload report for #{selected.id}</div>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: '#64748b' }}>{selected.userName} · {selected.userEmail || 'no email'}</p>
          <input type="file" accept="application/pdf,.pdf" onChange={(e) => setReportFile(e.target.files?.[0] || null)} style={{ fontSize: 13, width: '100%', marginBottom: 8 }} />
          <button type="button" className="btn btn-primary btn-block" disabled={uploadingReport || !selected.userId} onClick={() => handleUploadReport(selected)} style={{ minHeight: 44 }}>
            {uploadingReport ? 'Uploading…' : 'Upload report PDF'}
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-orders-table { display: none !important; }
          .admin-orders-cards { display: flex !important; }
          .admin-orders-detail { display: none !important; }
          .admin-orders-detail-grid { grid-template-columns: 1fr !important; }
          .admin-orders-report-mobile { display: block !important; }
        }
      `}</style>
    </div>
  );
}
