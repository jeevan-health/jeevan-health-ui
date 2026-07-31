import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore.js';
import { listMyOrders, cancelMyOrder, formatInr } from '../services/ordersService.js';
import { formatOrderStatus } from '../utils/orderStatus.js';
import './my-orders.css';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'processing', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

function filterKey(status) {
  if (['completed', 'report_ready'].includes(status)) return 'completed';
  if (['processing', 'sample_collected', 'assigned'].includes(status)) return 'processing';
  if (['confirmed', 'pending'].includes(status)) return 'scheduled';
  if (status === 'cancelled' || status === 'failed') return 'cancelled';
  return status;
}

const PAY_LABEL = {
  cod: 'Cash on collection',
  card: 'Card on collection',
  online: 'Online (pending)',
};

export default function MyOrders() {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState('all');

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

  const filtered = useMemo(
    () =>
      filter === 'all' ? orders : orders.filter((o) => filterKey(o.status) === filter),
    [orders, filter],
  );

  const stats = useMemo(
    () => ({
      total: orders.length,
      scheduled: orders.filter((o) => filterKey(o.status) === 'scheduled').length,
      processing: orders.filter((o) => filterKey(o.status) === 'processing').length,
      completed: orders.filter((o) => filterKey(o.status) === 'completed').length,
    }),
    [orders],
  );

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
            <h1>My Bookings</h1>
            <p className="muted">Track home collection bookings and manage open orders</p>
          </div>
          <Link to="/diagnostics" className="btn btn-primary">
            Book tests
          </Link>
        </header>

        <div className="my-orders-stats">
          <div>
            <strong>{stats.total}</strong>
            <span>Total</span>
          </div>
          <div>
            <strong>{stats.scheduled}</strong>
            <span>Scheduled</span>
          </div>
          <div>
            <strong>{stats.processing}</strong>
            <span>In progress</span>
          </div>
          <div>
            <strong>{stats.completed}</strong>
            <span>Completed</span>
          </div>
        </div>

        <div className="my-orders-filters">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={filter === f.id ? 'active' : ''}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && <div className="my-orders-error">{error}</div>}
        {loading && <p className="muted">Loading orders…</p>}

        {!loading && !filtered.length && (
          <div className="my-orders-empty">
            <p>{orders.length ? 'No orders in this filter.' : 'No orders yet.'}</p>
            <Link to="/diagnostics" className="btn btn-accent">
              Browse lab tests
            </Link>
          </div>
        )}

        <ul className="my-orders-list">
          {filtered.map((o) => {
            const canCancel = o.status === 'pending' || o.status === 'confirmed';
            return (
              <li key={o.id} className="my-order-card">
                <div className="my-order-top">
                  <div>
                    <span className="my-order-code">{o.orderCode}</span>
                    <span className={`my-order-status status-${o.status}`}>
                      {formatOrderStatus(o.status, o.phleboStatus)}
                    </span>
                  </div>
                  <strong className="my-order-total">{formatInr(o.total)}</strong>
                </div>
                <p className="my-order-meta">
                  <strong>
                    {o.patientName}
                    {o.patientRelation ? ` · ${o.patientRelation}` : ''}
                  </strong>
                  {o.patientAge != null ? ` · ${o.patientAge} yrs` : ''}
                  {o.patientGender ? ` · ${o.patientGender}` : ''}
                </p>
                <p className="my-order-meta">
                  {o.collectionDate || 'Date TBC'}
                  {o.collectionSlot ? ` · ${o.collectionSlot}` : ''}
                </p>
                <p className="my-order-addr">
                  {o.addressLine1}
                  {o.landmark ? `, ${o.landmark}` : ''}
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
                    {PAY_LABEL[o.paymentMode] || o.paymentMode || 'Payment'} · {o.paymentStatus}
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
