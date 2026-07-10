import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';

const BOOKING_SOURCES = [
  { key: 'jh_nursing_bookings', type: 'nursing', icon: '👩‍⚕️', color: '#7C3AED', labelKey: 'nursing', route: '/nurse-at-home' },
  { key: 'jh_vaccination_bookings', type: 'vaccination', icon: '💉', color: '#2563EB', labelKey: 'vaccination', route: '/vaccination' },
  { key: 'jh_physio_bookings', type: 'physiotherapy', icon: '💪', color: '#059669', labelKey: 'physiotherapy', route: '/physiotherapy' },
];

const STATUS_ORDER = ['upcoming', 'pending', 'completed', 'cancelled'];

const normalizeBooking = (b, source) => {
  const type = source.type;
  if (type === 'nursing') {
    return {
      id: b.id, type,
      serviceName: b.serviceName || 'Nursing Service',
      patientName: b.patientName || 'Unknown',
      date: b.preferredDate || '',
      time: b.preferredTime || '',
      amount: b.totalAmount || b.servicePrice || 0,
      status: b.status === 'Pending Assessment' || b.status === 'Confirmed' ? 'upcoming' : (b.status || '').toLowerCase(),
      rawStatus: b.status || '',
      source: source,
    };
  }
  if (type === 'vaccination') {
    return {
      id: b.id, type,
      serviceName: b.vaccineName || b.vaccine || 'Vaccination',
      patientName: b.patientName || b.name || 'Unknown',
      date: b.appointmentDate || b.date || '',
      time: b.appointmentSlot || '',
      amount: b.vaccinePrice || 0,
      status: b.status === 'Confirmed' ? 'upcoming' : (b.status || 'confirmed').toLowerCase(),
      rawStatus: b.status || 'Confirmed',
      source: source,
    };
  }
  if (type === 'physiotherapy') {
    return {
      id: b.id, type,
      serviceName: b.serviceName || b.therapistName || 'Physiotherapy',
      patientName: b.patientName || 'Unknown',
      date: b.preferredDate || b.date || '',
      time: b.preferredTime || '',
      amount: b.totalAmount || 0,
      status: (b.status || 'confirmed').toLowerCase(),
      rawStatus: b.status || 'Confirmed',
      source: source,
    };
  }
  return { id: b.id, type, serviceName: 'Service', patientName: 'Unknown', date: '', time: '', amount: 0, status: 'pending', source };
};

const RESCHEDULE_REASONS = [
  'Emergency at work',
  'Patient not feeling well',
  'Family emergency',
  'Change in schedule',
  'Other',
];

export default function PatientBookings() {
  const t = useT();
  const [allBookings, setAllBookings] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [rescheduleId, setRescheduleId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const all = [];
    BOOKING_SOURCES.forEach(src => {
      try {
        const data = JSON.parse(localStorage.getItem(src.key) || '[]');
        data.forEach(b => all.push(normalizeBooking(b, src)));
      } catch { /* ignore */ }
    });
    all.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    setAllBookings(all);
  }, []);

  const filtered = useMemo(() => {
    return allBookings.filter(b => {
      const matchType = typeFilter === 'all' || b.type === typeFilter;
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchSearch = !search || b.serviceName?.toLowerCase().includes(search.toLowerCase()) || b.patientName?.toLowerCase().includes(search.toLowerCase()) || b.id?.toLowerCase().includes(search.toLowerCase());
      return matchType && matchStatus && matchSearch;
    });
  }, [allBookings, typeFilter, statusFilter, search]);

  const stats = useMemo(() => ({
    total: allBookings.length,
    upcoming: allBookings.filter(b => b.status === 'upcoming').length,
    completed: allBookings.filter(b => b.status === 'completed').length,
    cancelled: allBookings.filter(b => b.status === 'cancelled').length,
  }), [allBookings]);

  const handleReschedule = () => {
    if (!rescheduleDate) return;
    const keyMap = {
      nursing: 'jh_nursing_bookings',
      vaccination: 'jh_vaccination_bookings',
      physiotherapy: 'jh_physio_bookings',
    };
    const booking = allBookings.find(b => b.id === rescheduleId);
    if (!booking) return;
    const key = keyMap[booking.type];
    try {
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = data.map(b => {
        if (b.id === rescheduleId) {
          const fields = booking.type === 'nursing' ? { preferredDate: rescheduleDate, preferredTime: rescheduleTime, rescheduleReason, rescheduledAt: new Date().toISOString() }
            : booking.type === 'vaccination' ? { appointmentDate: rescheduleDate, appointmentSlot: rescheduleTime, rescheduleReason, rescheduledAt: new Date().toISOString() }
            : { preferredDate: rescheduleDate, preferredTime: rescheduleTime, rescheduleReason, rescheduledAt: new Date().toISOString() };
          return { ...b, ...fields };
        }
        return b;
      });
      localStorage.setItem(key, JSON.stringify(updated));
      setAllBookings(all => all.map(b => b.id === rescheduleId ? { ...b, date: rescheduleDate, time: rescheduleTime } : b));
      setRescheduleId(null);
      setRescheduleDate('');
      setRescheduleTime('');
      setRescheduleReason('');
      showToast(t('patient.booking.rescheduled', 'Booking rescheduled successfully!'));
    } catch { showToast(t('error', 'Error rescheduling. Please try again.')); }
  };

  const handleCancel = () => {
    const keyMap = {
      nursing: 'jh_nursing_bookings',
      vaccination: 'jh_vaccination_bookings',
      physiotherapy: 'jh_physio_bookings',
    };
    const booking = allBookings.find(b => b.id === cancelId);
    if (!booking) return;
    const key = keyMap[booking.type];
    try {
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = data.map(b => {
        if (b.id === cancelId) return { ...b, status: 'Cancelled', cancelReason, cancelledAt: new Date().toISOString() };
        return b;
      });
      localStorage.setItem(key, JSON.stringify(updated));
      setAllBookings(all => all.map(b => b.id === cancelId ? { ...b, status: 'cancelled', rawStatus: 'Cancelled' } : b));
      setCancelId(null);
      setCancelReason('');
      showToast(t('patient.booking.cancelled', 'Booking cancelled.'));
    } catch { showToast(t('error', 'Error cancelling. Please try again.')); }
  };

  const getStatusStyle = (status) => {
    const map = {
      upcoming: { bg: '#dcfce7', text: '#166534' },
      pending: { bg: '#fef3c7', text: '#92400e' },
      completed: { bg: '#dbeafe', text: '#1e40af' },
      cancelled: { bg: '#fee2e2', text: '#991b1b' },
    };
    return map[status] || map.pending;
  };

  return (
    <div className="page-section container" style={{ maxWidth: 720 }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, padding: '12px 24px', borderRadius: 8, background: '#065f46', color: '#fff', fontSize: 13, fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', margin: '-32px -24px 24px', padding: '32px 24px 28px', borderRadius: '0 0 24px 24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>{t('patient.dashboard.title', 'My Bookings')}</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{t('patient.dashboard.subtitle', 'View and manage your healthcare bookings')}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { label: t('patient.stats.total', 'Total'), value: stats.total, color: '#0f172a' },
          { label: t('patient.stats.upcoming', 'Upcoming'), value: stats.upcoming, color: '#059669' },
          { label: t('patient.stats.completed', 'Completed'), value: stats.completed, color: '#2563eb' },
          { label: t('patient.stats.cancelled', 'Cancelled'), value: stats.cancelled, color: '#dc2626' },
        ].map(s => (
          <div key={s.label} style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('patient.search.placeholder', 'Search by service, patient, ID...')}
          style={{ flex: 1, minWidth: 180, padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 11, fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
          <option value="all">{t('patient.filter.all', 'All Services')}</option>
          {BOOKING_SOURCES.map(s => <option key={s.type} value={s.type}>{s.icon} {t(s.labelKey)}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 11, fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
          <option value="all">{t('patient.filter.all.status', 'All Status')}</option>
          {STATUS_ORDER.map(s => <option key={s} value={s}>{t(`patient.status.${s}`, s.charAt(0).toUpperCase() + s.slice(1))}</option>)}
        </select>
      </div>

      {/* Booking List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📋</div>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>{t('patient.no.bookings', 'No bookings found.')}</p>
          <Link to="/nurse-at-home" style={{ display: 'inline-block', marginTop: 12, padding: '10px 24px', borderRadius: 8, background: '#7C3AED', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
            {t('patient.book.now', 'Book a Service')} →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {filtered.map(b => {
            const st = getStatusStyle(b.status);
            return (
              <div key={b.id + b.type} style={{ padding: 14, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 28 }}>{b.source.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{b.serviceName}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{b.patientName} · {b.id}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: st.bg, color: st.text }}>{b.rawStatus || b.status}</span>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>₹{b.amount}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>
                  📅 {b.date || 'TBD'} {b.time ? `· 🕐 ${b.time}` : ''}
                </div>
                {b.status === 'upcoming' && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                    <button onClick={() => { setRescheduleId(b.id); setRescheduleDate(''); setRescheduleTime(''); setRescheduleReason('') }}
                      style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #2563eb', background: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
                      📅 {t('patient.reschedule', 'Reschedule')}
                    </button>
                    <button onClick={() => { setCancelId(b.id); setCancelReason('') }}
                      style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #dc2626', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
                      ✕ {t('patient.cancel', 'Cancel')}
                    </button>
                    <Link to={b.source.route} style={{ marginLeft: 'auto', fontSize: 11, color: b.source.color, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                      {t('patient.view.service', 'View Service')} →
                    </Link>
                  </div>
                )}
                {(b.status === 'completed' || b.status === 'cancelled') && (
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => {
                      const msg = `Hi Jeevan Health! I want to re-book ${b.serviceName}. My previous booking ID was ${b.id}.`;
                      window.open(`https://wa.me/919700104108?text=${encodeURIComponent(msg)}`, '_blank');
                    }} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #25d366', background: '#f0fdf4', color: '#166534', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
                      💬 {t('patient.rebook', 'Re-book via WhatsApp')}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 24, minWidth: 360, maxWidth: 420, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{t('patient.reschedule.title', 'Reschedule Booking')}</h3>
            <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 14px' }}>{t('patient.reschedule.desc', 'Select a new date and time')}</p>
            <div style={{ display: 'grid', gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('patient.new.date', 'New Date')} *</label>
                <input type="date" value={rescheduleDate} onChange={e => setRescheduleDate(e.target.value)} min={new Date().toISOString().slice(0, 10)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('patient.new.time', 'New Time')}</label>
                <select value={rescheduleTime} onChange={e => setRescheduleTime(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="">{t('patient.select.time', 'Select time slot')}</option>
                  {['6:00 AM - 8:00 AM', '8:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM', '6:00 PM - 8:00 PM', '8:00 PM - 10:00 PM'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('patient.reason', 'Reason')}</label>
                <select value={rescheduleReason} onChange={e => setRescheduleReason(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="">{t('patient.select.reason', 'Select reason')}</option>
                  {RESCHEDULE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={handleReschedule} disabled={!rescheduleDate}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: !rescheduleDate ? '#94a3b8' : '#2563eb', color: '#fff', cursor: !rescheduleDate ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit' }}>
                {t('patient.confirm.reschedule', 'Confirm Reschedule')}
              </button>
              <button onClick={() => setRescheduleId(null)}
                style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                {t('cancel', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 24, minWidth: 360, maxWidth: 420, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: '#dc2626' }}>{t('patient.cancel.title', 'Cancel Booking')}</h3>
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px' }}>{t('patient.cancel.desc', 'Are you sure you want to cancel this booking?')}</p>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('patient.reason', 'Reason')}</label>
              <select value={cancelReason} onChange={e => setCancelReason(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                <option value="">{t('patient.select.reason', 'Select reason')}</option>
                {['No longer needed', 'Found another provider', 'Patient recovered', 'Scheduling conflict', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={handleCancel}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit' }}>
                {t('patient.confirm.cancel', 'Yes, Cancel Booking')}
              </button>
              <button onClick={() => setCancelId(null)}
                style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                {t('keep', 'Keep')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
