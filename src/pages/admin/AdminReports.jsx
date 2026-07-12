import { useState, useEffect } from 'react';
import { useT } from '../../i18n/LanguageProvider';
import { getOrders } from '../../services/localOrderService';
import { confirmDialog } from '../../stores/dialogStore';

const REPORTS_KEY = 'jh_reports';
const loadReports = () => { try { return JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]'); } catch { return []; } };
const saveReports = (r) => localStorage.setItem(REPORTS_KEY, JSON.stringify(r));

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

export default function AdminReports() {
  const t = useT();
  const [reports, setReports] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({ orderId: '', patientName: '', testName: '', file: '', notes: '' });

  const refresh = () => { setReports(loadReports()); setOrders(getOrders()); };
  useEffect(() => { refresh(); }, []);

  const filtered = reports.filter(r => {
    if (tab === 'pending' && r.status !== 'pending') return false;
    if (tab === 'approved' && r.status !== 'approved') return false;
    if (tab === 'delivered' && r.status !== 'delivered') return false;
    const q = search.toLowerCase();
    return (r.patientName || '').toLowerCase().includes(q) || (r.orderId || '').toLowerCase().includes(q) || (r.testName || '').toLowerCase().includes(q);
  });

  const handleUpload = () => {
    if (!form.patientName || !form.testName) return;
    const report = {
      id: 'RPT-' + Date.now().toString(36).toUpperCase(),
      orderId: form.orderId || null,
      patientName: form.patientName,
      testName: form.testName,
      file: form.file || null,
      notes: form.notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      verifiedBy: null,
      verifiedAt: null,
      deliveredAt: null,
      deliveredVia: null,
    };
    const all = [report, ...loadReports()];
    saveReports(all);
    setReports(all);
    setShowUpload(false);
    setForm({ orderId: '', patientName: '', testName: '', file: '', notes: '' });
  };

  const handleApprove = (id) => {
    const all = loadReports().map(r => r.id === id ? { ...r, status: 'approved', verifiedBy: 'Admin', verifiedAt: new Date().toISOString() } : r);
    saveReports(all);
    setReports(all);
  };

  const handleMarkDelivered = (id, via) => {
    const all = loadReports().map(r => r.id === id ? { ...r, status: 'delivered', deliveredAt: new Date().toISOString(), deliveredVia: t('admin.reports.via', 'via') } : r);
    saveReports(all);
    setReports(all);
  };

  const handleDelete = async (id) => {
    if (!(await confirmDialog('Delete this report?'))) return;
    const all = loadReports().filter(r => r.id !== id);
    saveReports(all);
    setReports(all);
  };

  const statusColors = { pending: '#f59e0b', approved: '#22c55e', delivered: '#3b82f6' };

  const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <TabBtn active={tab === 'all'} onClick={() => setTab('all')}>{t('admin.reports.all', 'All')} ({reports.length})</TabBtn>
        <TabBtn active={tab === 'pending'} onClick={() => setTab('pending')}>{t('admin.reports.pending', 'Pending')} ({reports.filter(r => r.status === 'pending').length})</TabBtn>
        <TabBtn active={tab === 'approved'} onClick={() => setTab('approved')}>{t('admin.reports.approved', 'Approved')} ({reports.filter(r => r.status === 'approved').length})</TabBtn>
        <TabBtn active={tab === 'delivered'} onClick={() => setTab('delivered')}>{t('admin.reports.delivered', 'Delivered')} ({reports.filter(r => r.status === 'delivered').length})</TabBtn>
        <div style={{ flex: 1 }} />
        <input placeholder={t('admin.reports.search_placeholder', 'Search reports...')} value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', maxWidth: 240 }} />
        <button onClick={() => setShowUpload(true)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600 }}>
          + Upload Report
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>{t('admin.reports.no_reports', 'No reports found')}</div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map(r => (
            <div key={r.id} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{r.testName}</span>
                    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: `${statusColors[r.status]}20`, color: statusColors[r.status] }}>{r.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                    {t('admin.reports.patient_label', 'Patient:')} {r.patientName}
                    {r.orderId && <span> — Order: {r.orderId}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {r.status === 'pending' && (
                    <button onClick={() => handleApprove(r.id)} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: '#22c55e', color: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: 600 }}>
                      Approve ✓
                    </button>
                  )}
                  {r.status === 'approved' && (
                    <>
                      <button onClick={() => handleMarkDelivered(r.id, 'whatsapp')} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: '#25D366', color: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: 600 }}>
                        WhatsApp ↗
                      </button>
                      <button onClick={() => handleMarkDelivered(r.id, 'email')} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: 600 }}>
                        Email ↗
                      </button>
                    </>
                  )}
                  {r.file && <span style={{ padding: '5px 12px', borderRadius: 6, background: '#f1f5f9', fontSize: 11, color: '#64748b' }}>📎 File</span>}
                  <button onClick={() => handleDelete(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 14 }}>✕</button>
                </div>
              </div>
              {r.notes && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>Notes: {r.notes}</div>}
              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#94a3b8', marginTop: 8, flexWrap: 'wrap' }}>
                <span>{t('admin.reports.uploaded', 'Uploaded:')} {formatDate(r.createdAt)}</span>
                {r.verifiedAt && <span>{t('admin.reports.verified', 'Verified:')} {formatDate(r.verifiedAt)} {t('admin.reports.by', 'by')} {r.verifiedBy}</span>}
                {r.deliveredAt && <span>{t('admin.reports.delivered_label', 'Delivered:')} {formatDate(r.deliveredAt)} {t('admin.reports.via', 'via')} {r.deliveredVia}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowUpload(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 440, maxWidth: '90vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{t('admin.reports.upload_report_title', 'Upload Report')}</h4>
              <button onClick={() => setShowUpload(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.reports.link_to_order', 'Link to Order (optional)')}</label>
                <select value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} style={inputStyle}>
                  <option value="">{t('admin.reports.no_order_link', 'No order link')}</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>{o.id} — {o.bookedFor || o.patientInfo?.name || 'Unknown'}</option>
                  ))}
                </select>
              </div>
              <input placeholder={t('admin.reports.patient_name_req', 'Patient Name *')} value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} style={inputStyle} />
              <input placeholder={t('admin.reports.test_name_req', 'Test Name *')} value={form.testName} onChange={e => setForm({ ...form, testName: e.target.value })} style={inputStyle} />
              <div>
                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.reports.report_file', 'Report File (PDF URL or upload)')}</label>
                <input placeholder={t('admin.reports.file_url', 'Paste file URL or filename')} value={form.file} onChange={e => setForm({ ...form, file: e.target.value })} style={inputStyle} />
              </div>
              <input placeholder={t('admin.reports.notes_optional', 'Notes (optional)')} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowUpload(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>{t('admin.reports.cancel', 'Cancel')}</button>
              <button onClick={handleUpload} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>{t('admin.reports.upload_report', 'Upload Report')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: '8px 16px', borderRadius: 8, border: active ? 'none' : '1px solid #e2e8f0', background: active ? '#0f172a' : '#fff', color: active ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: active ? 600 : 400 }}>
      {children}
    </button>
  );
}
