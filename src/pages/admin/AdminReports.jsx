import { useCallback, useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import { isAdminRole } from '../../utils/authRoles.js';
import { adminListOrders } from '../../services/ordersService.js';
import { adminUploadReport, adminListReportsForOrder } from '../../services/reportsService.js';
import './admin-catalog.css';
import './admin-orders.css';
import './admin-reports.css';

export default function AdminReports() {
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [fileName, setFileName] = useState('lab-report.pdf');
  const [testLabel, setTestLabel] = useState('');
  const [contentBase64, setContentBase64] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [existing, setExisting] = useState([]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminListOrders({ limit: 40 });
      setOrders(data.items || []);
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated() && isAdminRole(user?.role)) loadOrders();
  }, [user, isAuthenticated, loadOrders]);

  useEffect(() => {
    if (!orderId) {
      setExisting([]);
      return;
    }
    adminListReportsForOrder(orderId)
      .then(setExisting)
      .catch(() => setExisting([]));
  }, [orderId]);

  if (!isAuthenticated() || !isAdminRole(user?.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const buf = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    setContentBase64(btoa(binary));
  };

  const onUpload = async (e) => {
    e.preventDefault();
    if (!orderId || !contentBase64) {
      setError('Select order and PDF file');
      return;
    }
    setBusy(true);
    setError(null);
    setMsg(null);
    try {
      const result = await adminUploadReport({
        orderId,
        fileName,
        contentBase64,
        testLabel: testLabel || null,
        sendEmail,
      });
      setMsg(
        `Uploaded for ${result.order?.orderCode || orderId} · email: ${result.emailStatus}`,
      );
      setContentBase64('');
      setExisting(await adminListReportsForOrder(orderId));
    } catch (err) {
      setError(err?.response?.data?.error?.message || err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-reports">
      <div className="admin-ord-hero">
        <div className="container">
          <p className="admin-ord-eyebrow">Lab</p>
          <h1>Report upload</h1>
          <p>Attach PDF to an order · email patient via Brevo when available</p>
        </div>
      </div>

      <div className="container admin-ord-body">
        <form className="admin-card admin-report-form" onSubmit={onUpload}>
          <label>
            Order *
            <select value={orderId} onChange={(e) => setOrderId(e.target.value)} required>
              <option value="">Select order…</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.orderCode} · {o.patientName} · {o.status}
                </option>
              ))}
            </select>
          </label>
          <label>
            PDF file *
            <input type="file" accept="application/pdf,.pdf" onChange={onFile} />
          </label>
          <label>
            File name
            <input value={fileName} onChange={(e) => setFileName(e.target.value)} />
          </label>
          <label>
            Test label (optional)
            <input
              value={testLabel}
              onChange={(e) => setTestLabel(e.target.value)}
              placeholder="e.g. CBC + Lipid Profile"
            />
          </label>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
            />
            Email patient (if account has email on file)
          </label>
          {error && <div className="admin-ord-error">{error}</div>}
          {msg && <div className="admin-ord-ok">{msg}</div>}
          <button type="submit" className="btn btn-primary" disabled={busy || loading}>
            {busy ? 'Uploading…' : 'Upload report'}
          </button>
          <Link to="/admin/orders" className="btn btn-outline-dark">
            Back to orders
          </Link>
        </form>

        {existing.length > 0 && (
          <div className="admin-card">
            <h2>Reports on this order</h2>
            <ul className="admin-report-existing">
              {existing.map((r) => (
                <li key={r.id}>
                  {r.fileName} · {r.testLabel || '—'} · email: {r.emailStatus || '—'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
