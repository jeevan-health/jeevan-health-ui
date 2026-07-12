import { useState, useEffect, useCallback } from 'react';
import * as adminService from '../../services/adminService';
import { useT } from '../../i18n/LanguageProvider';

const STATUSES = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'];

const statusColor = {
  scheduled: '#3b82f6',
  confirmed: '#22c55e',
  in_progress: '#f59e0b',
  completed: '#16a34a',
  cancelled: '#ef4444',
};

function mapAppt(a) {
  return {
    id: a.id,
    status: a.status || 'scheduled',
    doctorName: a.doctor_name || a.doctorName || '—',
    specialty: a.specialty || '',
    userName: a.user_name || a.userName || '—',
    userPhone: a.user_phone || a.userPhone || '',
    date: a.appointment_date || a.appointmentDate || '',
    timeSlot: a.time_slot || a.timeSlot || '',
    type: a.type || a.mode || '',
    notes: a.notes || '',
  };
}

export default function AdminBookings() {
  const t = useT();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminService.getAppointments({
        status: statusFilter === 'all' ? undefined : statusFilter,
        limit: 100,
      });
      setAppointments((data.appointments || []).map(mapAppt));
      setTotal(data.total ?? (data.appointments || []).length);
    } catch (err) {
      setError(err?.response?.data?.error || t('admin.bookings.loadError', 'Failed to load appointments from API'));
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, t]);

  useEffect(() => { load(); }, [load]);

  const filtered = appointments.filter(a => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return [a.userName, a.doctorName, a.userPhone, a.specialty, String(a.id)].join(' ').toLowerCase().includes(q);
  });

  const handleStatus = async (appt, status) => {
    setUpdatingId(appt.id);
    try {
      await adminService.updateAppointmentStatus(appt.id, status);
      await load();
    } catch (err) {
      alert(err?.response?.data?.error || t('admin.bookings.updateFailed', 'Failed to update status'));
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="input"
          placeholder={t('admin.bookings.search', 'Search patient, doctor, phone…')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 160, maxWidth: 320, fontSize: 13 }}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', background: '#fff', minHeight: 40 }}
        >
          <option value="all">{t('admin.bookings.allStatus', 'All status')}</option>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <button type="button" className="btn btn-outline btn-sm" onClick={load} style={{ minHeight: 40 }}>
          {t('admin.bookings.refresh', 'Refresh')}
        </button>
        <span style={{ fontSize: 12, color: '#64748b' }}>{total} {t('admin.bookings.total', 'total')}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8, marginBottom: 16 }}>
        {[
          { label: t('admin.bookings.loaded', 'Loaded'), value: stats.total },
          { label: t('admin.bookings.active', 'Active'), value: stats.scheduled },
          { label: t('admin.bookings.done', 'Completed'), value: stats.completed },
          { label: t('admin.bookings.cancelled', 'Cancelled'), value: stats.cancelled },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>{t('admin.bookings.loading', 'Loading appointments…')}</div>}
      {error && !loading && <div style={{ textAlign: 'center', padding: 40, color: '#dc2626', fontSize: 13 }}>{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8', fontSize: 13, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          {t('admin.bookings.empty', 'No doctor appointments found. New bookings from the app will show here.')}
        </div>
      )}

      {/* Mobile cards */}
      <div className="admin-bookings-cards" style={{ display: 'none', flexDirection: 'column', gap: 10 }}>
        {filtered.map(a => (
          <div key={a.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>#{a.id} · {a.userName}</div>
              <span style={{ fontSize: 11, fontWeight: 600, color: statusColor[a.status] || '#64748b', textTransform: 'capitalize' }}>
                {(a.status || '').replace(/_/g, ' ')}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, marginBottom: 10 }}>
              <div>🩺 {a.doctorName}{a.specialty ? ` · ${a.specialty}` : ''}</div>
              <div>📅 {a.date ? new Date(a.date).toLocaleDateString('en-IN') : '—'} · {a.timeSlot || '—'}</div>
              {a.userPhone && <div>📞 {a.userPhone}</div>}
            </div>
            <select
              value={a.status}
              disabled={updatingId === a.id}
              onChange={e => handleStatus(a, e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', minHeight: 42 }}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      {!loading && filtered.length > 0 && (
        <div className="admin-bookings-table" style={{ background: '#fff', borderRadius: 12, overflowX: 'auto', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontSize: 11 }}>ID</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontSize: 11 }}>Patient</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontSize: 11 }}>Doctor</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontSize: 11 }}>When</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontSize: 11 }}>Status</th>
                <th style={{ textAlign: 'right', padding: '10px 14px', color: '#64748b', fontSize: 11 }}>Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>#{a.id}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div>{a.userName}</div>
                    {a.userPhone && <div style={{ fontSize: 11, color: '#94a3b8' }}>{a.userPhone}</div>}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div>{a.doctorName}</div>
                    {a.specialty && <div style={{ fontSize: 11, color: '#94a3b8' }}>{a.specialty}</div>}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontSize: 12 }}>
                    {a.date ? new Date(a.date).toLocaleDateString('en-IN') : '—'}
                    <div>{a.timeSlot || ''}</div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: `${statusColor[a.status] || '#94a3b8'}20`, color: statusColor[a.status] || '#475569',
                      textTransform: 'capitalize',
                    }}>
                      {(a.status || '').replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <select
                      value={a.status}
                      disabled={updatingId === a.id}
                      onChange={e => handleStatus(a, e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit' }}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-bookings-table { display: none !important; }
          .admin-bookings-cards { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
