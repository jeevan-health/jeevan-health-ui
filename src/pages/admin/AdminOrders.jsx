import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import { adminListOrders, adminUpdateOrderStatus, formatInr } from '../../services/ordersService.js';
import { isAdminRole } from '../../utils/authRoles.js';
import './admin-catalog.css';
import './admin-orders.css';

const STATUSES = [
  'pending',
  'confirmed',
  'assigned',
  'sample_collected',
  'processing',
  'report_ready',
  'completed',
  'cancelled',
  'failed',
];

export default function AdminOrders() {
  const { user, isAuthenticated } = useAuthStore();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async (opts = {}) => {
    setLoading(true);
    setError(null);
    try {
      const nextQ = opts.q !== undefined ? opts.q : q;
      const nextStatus = opts.status !== undefined ? opts.status : status;
      const data = await adminListOrders({
        q: nextQ,
        status: nextStatus || undefined,
        limit: 50,
      });
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [q, status]);

  useEffect(() => {
    if (isAuthenticated() && isAdminRole(user?.role)) {
      load({ q: '', status: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated]);

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  if (!isAdminRole(user?.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  const onSearch = async (e) => {
    e.preventDefault();
    await load();
  };

  const onStatusChange = async (id, next) => {
    setBusyId(id);
    setError(null);
    try {
      await adminUpdateOrderStatus(id, next);
      await load();
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message || 'Update failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="admin-orders">
      <div className="admin-ord-hero">
        <div className="container">
          <p className="admin-ord-eyebrow">Operations</p>
          <h1>Orders</h1>
          <p>
            Home collection bookings · <strong>{total}</strong> matching
          </p>
        </div>
      </div>

      <div className="container admin-ord-body">
        <form className="admin-ord-filters admin-card" onSubmit={onSearch}>
          <label>
            Search
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Order code, patient, phone…"
            />
          </label>
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Loading…' : 'Filter'}
          </button>
        </form>

        {error && <div className="admin-ord-error">{error}</div>}

        <div className="admin-card admin-ord-table-wrap">
          {loading && <p className="muted">Loading…</p>}
          {!loading && !items.length && <p className="muted">No orders found.</p>}
          {items.length > 0 && (
            <table className="admin-table admin-ord-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Patient</th>
                  <th>Tests</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {items.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong className="code">{o.orderCode}</strong>
                      <div className="sub">{o.paymentStatus}</div>
                    </td>
                    <td>
                      <div>{o.patientName}</div>
                      <div className="sub">{o.patientPhone}</div>
                      <div className="sub">
                        {o.city}
                        {o.collectionSlot ? ` · ${o.collectionSlot}` : ''}
                      </div>
                    </td>
                    <td>
                      <div className="ord-tests">
                        {(o.items || []).slice(0, 3).map((it) => (
                          <span key={it.id}>
                            {it.testName} ×{it.quantity}
                          </span>
                        ))}
                        {(o.items || []).length > 3 ? (
                          <span>+{(o.items || []).length - 3} more</span>
                        ) : null}
                      </div>
                    </td>
                    <td>{formatInr(o.total)}</td>
                    <td>
                      <select
                        className="admin-ord-status"
                        value={o.status}
                        disabled={busyId === o.id}
                        onChange={(e) => onStatusChange(o.id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="sub">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
