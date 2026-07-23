import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import useAuthStore from '../stores/authStore';
import * as diagnosticsService from '../services/diagnosticsService';
import { confirmDialog } from '../stores/dialogStore';
import { notify } from '../lib/toastBus';

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Scheduled',
  sample_collected: 'Sample Collected',
  processing: 'Processing',
  results_ready: 'Results Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function normalizeStatus(raw) {
  return (raw || 'pending').toLowerCase();
}

function statusBadgeClass(status) {
  if (status === 'completed' || status === 'results_ready') return 'badge-green';
  if (status === 'processing' || status === 'sample_collected') return 'badge-primary';
  if (status === 'confirmed' || status === 'pending') return 'badge-yellow';
  if (status === 'cancelled') return 'badge-red';
  return 'badge-primary';
}

function filterKey(status) {
  if (['completed', 'results_ready'].includes(status)) return 'completed';
  if (['processing', 'sample_collected'].includes(status)) return 'processing';
  if (['confirmed', 'pending'].includes(status)) return 'scheduled';
  if (status === 'cancelled') return 'cancelled';
  return status;
}

function mapOrder(o) {
  const status = normalizeStatus(o.status);
  let tests = o.tests;
  if (typeof tests === 'string') {
    try { tests = JSON.parse(tests); } catch { tests = []; }
  }
  if (!Array.isArray(tests)) tests = [];
  const testName = tests.map(t => t.name || t).filter(Boolean).join(' + ') || 'Diagnostic Tests';
  const dateRaw = o.collection_date || o.collectionDate || o.created_at || o.createdAt || '';
  const dateStr = typeof dateRaw === 'string' ? dateRaw.slice(0, 10) : '';
  let dateLabel = dateStr;
  try {
    if (dateStr) dateLabel = new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { /* keep raw */ }

  const displayOrderId = o.display_order_id || o.displayOrderId
    || `JHC-HYD-DIA-${String(o.id).padStart(5, '0')}`;
  return {
    id: String(o.id),
    displayOrderId,
    test: testName,
    status,
    statusLabel: STATUS_LABELS[status] || status,
    filter: filterKey(status),
    amount: Number(o.total_amount ?? o.totalAmount) || 0,
    date: dateLabel,
    collection: o.collection_time || o.collectionTime || '',
    canCancel: !['completed', 'cancelled', 'results_ready'].includes(status),
  };
}

export default function MyTestOrders() {
  const t = useT();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await diagnosticsService.getDiagnosticOrders();
      const list = Array.isArray(data) ? data : (data?.orders || []);
      setOrders(list.map(mapOrder));
    } catch (err) {
      if (err?.response?.status === 401) {
        setError(t('orders.loginRequired', 'Please sign in to view your orders.'));
      } else {
        setError(t('orders.loadError', 'Could not load orders. Please try again.'));
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setOrders([]);
      return;
    }
    loadOrders();
  }, [isAuthenticated]);

  const filtered = useMemo(
    () => (filter === 'all' ? orders : orders.filter(o => o.filter === filter)),
    [orders, filter]
  );

  const stats = useMemo(() => ({
    total: orders.length,
    completed: orders.filter(o => o.filter === 'completed').length,
    processing: orders.filter(o => o.filter === 'processing').length,
    scheduled: orders.filter(o => o.filter === 'scheduled').length,
  }), [orders]);

  const handleCancel = async (id) => {
    if (!(await confirmDialog(t('orders.confirmCancel', 'Cancel this order?')))) return;
    setCancellingId(id);
    try {
      await diagnosticsService.cancelDiagnosticOrder(id);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled', statusLabel: 'Cancelled', filter: 'cancelled', canCancel: false } : o));
    } catch {
      notify.error(t('orders.cancelFailed', 'Could not cancel order.'));
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-section container">
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{t('orders.title', 'My Orders')}</h1>
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>{t('orders.loginRequired', 'Please sign in to view your orders.')}</p>
          <button className="btn btn-primary" onClick={() => navigate('/signup', { state: { from: '/my-orders' } })}>
            {t('orders.signIn', 'Sign In')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section container">
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{t('orders.title', 'My Orders')}</h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>{t('orders.subtitle', 'Track and manage your test bookings')}</p>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 700, textTransform: 'capitalize' }}>{v}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t(`orders.stat.${k}`, k.charAt(0).toUpperCase() + k.slice(1))}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'completed', 'processing', 'scheduled', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}>{t(`orders.filter.${f}`, f.charAt(0).toUpperCase() + f.slice(1))}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && <p style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>{t('orders.loading', 'Loading orders…')}</p>}
        {!loading && error && <p style={{ padding: 24, textAlign: 'center', fontSize: 13, color: '#dc2626' }}>{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{t('orders.noOrders', 'No orders found.')}</p>
            <Link to="/diagnostics" className="btn btn-primary btn-sm">{t('orders.bookTest', 'Book a Test')}</Link>
          </div>
        )}
        {!loading && filtered.map(o => (
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{o.test}</p>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{o.displayOrderId || `#${o.id}`} · {o.date}</p>
              {o.collection && <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t('orders.collection', 'Collection:')} {o.collection}</p>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className={`badge ${statusBadgeClass(o.status)}`}>{o.statusLabel}</span>
              <span style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>₹{o.amount}</span>
              {o.canCancel && (
                <button
                  className="btn btn-outline btn-sm"
                  disabled={cancellingId === o.id}
                  onClick={() => handleCancel(o.id)}
                >
                  {cancellingId === o.id ? t('orders.cancelling', '…') : t('orders.cancel', 'Cancel')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
