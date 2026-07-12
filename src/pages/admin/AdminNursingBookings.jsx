import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/LanguageProvider';
import * as nursingService from '../../services/nursingService';
import { notify } from '../../lib/toastBus';

const STATUSES = ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'];

const statusColor = {
  pending: '#f97316', confirmed: '#22c55e', assigned: '#3b82f6',
  in_progress: '#f59e0b', completed: '#16a34a', cancelled: '#ef4444',
};

/**
 * Real nursing bookings from Neon via GET /admin/nursing/bookings.
 * The older AdminNursing.jsx page remains for catalog/marketing mock tools.
 */
export default function AdminNursingBookings() {
  const t = useT();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await nursingService.adminListBookings({
        status: statusFilter === 'all' ? undefined : statusFilter,
        limit: 100,
      });
      setBookings(data.bookings || []);
      setTotal(data.total ?? (data.bookings || []).length);
    } catch (err) {
      setError(err?.response?.data?.error || t('admin.nursing.loadError', 'Failed to load nursing bookings. Deploy API with /admin/nursing routes.'));
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, t]);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (b, status) => {
    setUpdatingId(b.id);
    try {
      await nursingService.adminUpdateBookingStatus(b.id, status);
      await load();
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700 }}>{t('admin.nursing.bookingsTitle', 'Nursing bookings')}</h2>
          <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
            {t('admin.nursing.bookingsSub', 'Live Neon data. Catalog/CMS tools:')}{' '}
            <Link to="/admin/nursing" style={{ color: '#1866C9' }}>{t('admin.nursing.legacy', 'legacy Nursing page')}</Link>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', minHeight: 40 }}
          >
            <option value="all">All status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <button type="button" onClick={load} className="btn btn-outline btn-sm" style={{ minHeight: 40 }}>Refresh</button>
          <span style={{ fontSize: 12, color: '#64748b', alignSelf: 'center' }}>{total} total</span>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading…</div>}
      {error && !loading && <div style={{ padding: 16, borderRadius: 10, background: '#FEF2F2', color: '#b91c1c', fontSize: 13, marginBottom: 12 }}>{error}</div>}
      {!loading && !error && bookings.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', color: '#94a3b8', fontSize: 13 }}>
          No nursing bookings yet. Patient flow: signed-in user completes /nursing-care/book.
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <>
          <div className="admin-nursing-cards" style={{ display: 'none', flexDirection: 'column', gap: 10 }}>
            {bookings.map(b => (
              <div key={b.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>#{b.id} · {b.serviceName}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, marginBottom: 8 }}>
                  {b.patientName} · {b.patientPhone || b.userPhone || '—'}
                  <div>{b.preferredDate || '—'} · {b.preferredTime || '—'}</div>
                  <div>₹{Number(b.totalAmount || 0).toLocaleString('en-IN')} · {b.nurseName || '—'}</div>
                </div>
                <select
                  value={b.status}
                  disabled={updatingId === b.id}
                  onChange={e => handleStatus(b, e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', minHeight: 42 }}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="admin-nursing-table" style={{ background: '#fff', borderRadius: 12, overflowX: 'auto', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 11, color: '#64748b' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 11, color: '#64748b' }}>Service</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 11, color: '#64748b' }}>Patient</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 11, color: '#64748b' }}>When</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 11, color: '#64748b' }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 11, color: '#64748b' }}>Status</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 11, color: '#64748b' }}>Update</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>#{b.id}</td>
                    <td style={{ padding: '10px 12px' }}>{b.serviceName}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div>{b.patientName}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{b.patientPhone || b.userPhone || ''}</div>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>
                      {b.preferredDate ? new Date(b.preferredDate).toLocaleDateString('en-IN') : '—'}
                      <div>{b.preferredTime || ''}</div>
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>₹{Number(b.totalAmount || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: `${statusColor[b.status] || '#94a3b8'}22`, color: statusColor[b.status] || '#475569',
                        textTransform: 'capitalize',
                      }}>
                        {(b.status || '').replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <select
                        value={b.status}
                        disabled={updatingId === b.id}
                        onChange={e => handleStatus(b, e.target.value)}
                        style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit' }}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-nursing-table { display: none !important; }
          .admin-nursing-cards { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
