import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore.js';
import { listMyOrders, cancelMyOrder, formatInr } from '../services/ordersService.js';
import './my-orders.css';

const STATUS_LABEL = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  assigned: 'Phlebo assigned',
  sample_collected: 'Sample collected',
  processing: 'Processing',
  report_ready: 'Report ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
  failed: 'Failed',
};

export default function MyOrders() {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listMyOrders();
      setOrders(list || []);
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) load();
  }, [isAuthenticated, load]);

  if (!isAuthenticated()) {
    return <Navigate to="/signup" replace state={{ from: '/my-orders' }} />;
  }

  const onCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    setBusyId(id);
    try {
      await cancelMyOrder(id, 'Cancelled by patient');
      await load();
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message || 'Cancel failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="my-orders-page">
      <div className="container">
        <header className="my-orders-head">
          <div>
            <h1>My orders</h1>
            <p className="muted">Home collection bookings saved on your account</p>
          </div>
          <Link to="/diagnostics" className="btn btn-primary">
            Book tests
          </Link>
        </header>

        {error && <div className="my-orders-error">{error}</div>}
        {loading && <p className="muted">Loading orders…</p>}

        {!loading && !orders.length && (
          <div className="my-orders-empty">
            <p>No orders yet.</p>
            <Link to="/diagnostics" className="btn btn-accent">
              Browse lab tests
            </Link>
          </div>
        )}

        <ul className="my-orders-list">
          {orders.map((o) => {
            const canCancel = o.status === 'pending' || o.status === 'confirmed';
            return (
              <li key={o.id} className="my-order-card">
                <div className="my-order-top">
                  <div>
                    <span className="my-order-code">{o.orderCode}</span>
                    <span className={`my-order-status status-${o.status}`}>
                      {STATUS_LABEL[o.status] || o.status}
                    </span>
                  </div>
                  <strong className="my-order-total">{formatInr(o.total)}</strong>
                </div>
                <p className="my-order-meta">
                  {o.patientName} · {o.patientPhone}
                  {o.collectionDate ? ` · ${o.collectionDate}` : ''}
                  {o.collectionSlot ? ` · ${o.collectionSlot}` : ''}
                </p>
                <p className="my-order-addr">
                  {o.addressLine1}
                  {o.city ? `, ${o.city}` : ''}
                  {o.pincode ? ` ${o.pincode}` : ''}
                </p>
                {o.items?.length > 0 && (
                  <ul className="my-order-items">
                    {o.items.map((it) => (
                      <li key={it.id}>
                        <span>
                          {it.testName} <em>{it.jhcCode}</em>
                        </span>
                        <span>
                          ×{it.quantity} · {formatInr(it.lineTotal)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="my-order-foot">
                  <span className="muted">
                    Payment: {o.paymentStatus}
                    {o.createdAt
                      ? ` · ${new Date(o.createdAt).toLocaleString('en-IN')}`
                      : ''}
                  </span>
                  {canCancel && (
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm"
                      disabled={busyId === o.id}
                      onClick={() => onCancel(o.id)}
                    >
                      {busyId === o.id ? 'Cancelling…' : 'Cancel'}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
