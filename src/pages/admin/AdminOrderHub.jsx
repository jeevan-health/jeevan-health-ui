/**
 * Unified admin order hub — diagnostic, pharmacy, nursing, physio, vaccine, appointments.
 * Deep-links to specialty pages for full tools (e.g. phlebo assign on /admin/orders).
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as adminService from '../../services/adminService';
import { notify } from '../../lib/toastBus';

const HUB_TYPES = [
  { key: 'all', label: 'All', color: '#0f172a' },
  { key: 'diagnostic', label: 'Diagnostics', color: '#0d9488' },
  { key: 'pharmacy', label: 'Pharmacy', color: '#db2777' },
  { key: 'nursing', label: 'Nursing', color: '#0891b2' },
  { key: 'physio', label: 'Physio', color: '#16a34a' },
  { key: 'vaccination', label: 'Vaccine', color: '#7c3aed' },
  { key: 'appointment', label: 'Doctors', color: '#2563eb' },
];

const STATUS_OPTIONS = {
  all: ['pending', 'confirmed', 'assigned', 'in_progress', 'sample_collected', 'processing', 'results_ready', 'completed', 'cancelled', 'preparing', 'shipped', 'delivered', 'scheduled'],
  diagnostic: ['pending', 'confirmed', 'sample_collected', 'processing', 'results_ready', 'completed', 'cancelled'],
  pharmacy: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'],
  nursing: ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'],
  physio: ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'],
  vaccination: ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'],
  appointment: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'],
};

const statusColor = {
  pending: '#f97316',
  confirmed: '#3b82f6',
  scheduled: '#3b82f6',
  assigned: '#6366f1',
  in_progress: '#f59e0b',
  sample_collected: '#8b5cf6',
  processing: '#f59e0b',
  results_ready: '#22c55e',
  completed: '#10b981',
  cancelled: '#ef4444',
  preparing: '#a855f7',
  shipped: '#0ea5e9',
  delivered: '#10b981',
};

const typeBadge = {
  diagnostic: { bg: '#ecfdf5', fg: '#0f766e', label: 'Diag' },
  pharmacy: { bg: '#fdf2f8', fg: '#be185d', label: 'Rx' },
  nursing: { bg: '#ecfeff', fg: '#0e7490', label: 'Nurse' },
  physio: { bg: '#f0fdf4', fg: '#15803d', label: 'Physio' },
  vaccination: { bg: '#f5f3ff', fg: '#6d28d9', label: 'Vaccine' },
  appointment: { bg: '#eff6ff', fg: '#1d4ed8', label: 'Doctor' },
};

function formatWhen(item) {
  const d = item.whenDate
    ? (String(item.whenDate).slice(0, 10))
    : (item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '—');
  const t = item.whenTime || '';
  return t ? `${d} · ${t}` : d;
}

export default function AdminOrderHub() {
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updatingKey, setUpdatingKey] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminService.getOrderHub({
        type: typeFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
        limit: 60,
      });
      setItems(data.items || []);
      setCounts(data.counts || {});
      if (data.errors) {
        console.warn('Order hub partial errors', data.errors);
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to load order hub. Deploy API with /admin/order-hub.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 280 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const statusList = useMemo(
    () => STATUS_OPTIONS[typeFilter] || STATUS_OPTIONS.all,
    [typeFilter]
  );

  const handleStatus = async (item, status) => {
    const key = `${item.hubType}-${item.id}`;
    setUpdatingKey(key);
    try {
      await adminService.updateOrderHubStatus(item.hubType, item.id, status);
      notify.success(`Updated ${item.hubType} #${item.id} → ${status.replace(/_/g, ' ')}`);
      await load();
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Status update failed');
    } finally {
      setUpdatingKey('');
    }
  };

  const totalShown = items.length;
  const countChips = HUB_TYPES.filter((t) => t.key !== 'all').map((t) => ({
    ...t,
    n: counts[t.key] ?? 0,
  }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Order hub</h2>
          <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.45, maxWidth: 520 }}>
            All live bookings in one place. Open specialty pages for full tools (phlebo assign, lab report upload, etc.).
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          style={{
            padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0',
            background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', minHeight: 40,
          }}
        >
          Refresh
        </button>
      </div>

      {/* Type chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {HUB_TYPES.map((t) => {
          const active = typeFilter === t.key;
          const n = t.key === 'all' ? totalShown : (counts[t.key] ?? '·');
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => { setTypeFilter(t.key); setStatusFilter('all'); }}
              style={{
                padding: '7px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                background: active ? t.color : '#f1f5f9',
                color: active ? '#fff' : '#475569',
              }}
            >
              {t.label}
              {t.key !== 'all' && (
                <span style={{ opacity: 0.85, marginLeft: 4 }}>({typeof n === 'number' ? n : '—'})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, id, title…"
          style={{
            flex: '1 1 180px', minWidth: 160, padding: '10px 12px', borderRadius: 8,
            border: '1px solid #e2e8f0', fontSize: 14, fontFamily: 'inherit', minHeight: 40, boxSizing: 'border-box',
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0',
            fontSize: 13, fontFamily: 'inherit', minHeight: 40, background: '#fff',
          }}
        >
          <option value="all">All statuses</option>
          {statusList.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Quick links */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, fontSize: 12 }}>
        <Link to="/admin/orders" style={{ color: '#0d9488', fontWeight: 600 }}>Diagnostics detail →</Link>
        <Link to="/admin/nursing-bookings" style={{ color: '#0891b2', fontWeight: 600 }}>Nursing →</Link>
        <Link to="/admin/physio-bookings" style={{ color: '#16a34a', fontWeight: 600 }}>Physio →</Link>
        <Link to="/admin/vaccination-bookings" style={{ color: '#7c3aed', fontWeight: 600 }}>Vaccine →</Link>
        <Link to="/admin/bookings" style={{ color: '#2563eb', fontWeight: 600 }}>Doctor bookings →</Link>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading hub…</div>}
      {error && !loading && (
        <div style={{ padding: 14, borderRadius: 10, background: '#fef2f2', color: '#b91c1c', fontSize: 13, marginBottom: 12 }}>{error}</div>
      )}
      {!loading && !error && items.length === 0 && (
        <div style={{
          textAlign: 'center', padding: 48, background: '#fff', borderRadius: 12,
          border: '1px solid #e2e8f0', color: '#94a3b8', fontSize: 13,
        }}
        >
          No bookings match these filters.
        </div>
      )}

      {!loading && items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item) => {
            const badge = typeBadge[item.hubType] || { bg: '#f1f5f9', fg: '#475569', label: item.hubType };
            const key = `${item.hubType}-${item.id}`;
            const options = STATUS_OPTIONS[item.hubType] || STATUS_OPTIONS.all;
            return (
              <div
                key={key}
                style={{
                  background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
                  padding: 14, boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                        background: badge.bg, color: badge.fg, textTransform: 'uppercase', letterSpacing: 0.3,
                      }}
                      >
                        {badge.label}
                      </span>
                      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                        {item.displayOrderId || item.display_order_id || `#${item.id}`}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                        background: `${statusColor[item.status] || '#64748b'}18`,
                        color: statusColor[item.status] || '#64748b',
                        textTransform: 'capitalize',
                      }}
                      >
                        {(item.status || '—').replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{item.patientName}</div>
                    <div style={{ fontSize: 13, color: '#334155', marginTop: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 6, lineHeight: 1.45 }}>
                      📅 {formatWhen(item)}
                      {item.phone ? ` · 📞 ${item.phone}` : ''}
                      {item.amount > 0 ? ` · ₹${Number(item.amount).toLocaleString('en-IN')}` : ''}
                      {item.assignedLabel ? ` · 👤 ${item.assignedLabel}` : ''}
                      {item.phleboStatus ? ` · Phlebo: ${String(item.phleboStatus).replace(/_/g, ' ')}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'stretch', minWidth: 140 }}>
                    <select
                      value={item.status || ''}
                      disabled={updatingKey === key}
                      onChange={(e) => handleStatus(item, e.target.value)}
                      style={{
                        padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0',
                        fontSize: 12, fontFamily: 'inherit', minHeight: 40, background: '#fff',
                      }}
                    >
                      {options.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                      {/* keep current if not in list */}
                      {item.status && !options.includes(item.status) && (
                        <option value={item.status}>{item.status.replace(/_/g, ' ')}</option>
                      )}
                    </select>
                    <Link
                      to={item.detailPath || '/admin'}
                      style={{
                        textAlign: 'center', padding: '8px 10px', borderRadius: 8,
                        background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a',
                        textDecoration: 'none', fontSize: 12, fontWeight: 600, minHeight: 36,
                      }}
                    >
                      Open detail
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && items.length > 0 && (
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 12, textAlign: 'center' }}>
          Showing {totalShown} row(s)
          {typeFilter === 'all' && countChips.some((c) => c.n > 0)
            ? ` · ${countChips.filter((c) => c.n).map((c) => `${c.label} ${c.n}`).join(' · ')}`
            : ''}
          {' '}
          (per-source limit applied)
        </p>
      )}
    </div>
  );
}
