import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import useBookingsStore from '../../stores/bookingsStore';
import { useT } from '../../i18n/LanguageProvider';

const sectionCard = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function DoctorDashboard() {
  const user = useAuthStore(s => s.user);
  const bookings = useBookingsStore(s => s.bookings);
  const t = useT();
  const [view, setView] = useState('upcoming');

  // Find bookings for this doctor (matched by doctor name or assigned field)
  const myAppointments = useMemo(() => {
    const name = user?.name?.toLowerCase() || '';
    return bookings.filter(b => (b.doctor || '').toLowerCase() === name || b.assignedDoctor === user?.name);
  }, [bookings, user]);

  const today = new Date().toISOString().slice(0, 10);

  const grouped = useMemo(() => {
    const upcoming = myAppointments.filter(b => b.date >= today).sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''));
    const past = myAppointments.filter(b => b.date < today).sort((a, b) => b.date.localeCompare(a.date));
    const todayApps = myAppointments.filter(b => b.date === today);
    return { upcoming, past, todayApps };
  }, [myAppointments, today]);

  const uniquePatients = useMemo(() => {
    const set = new Set();
    myAppointments.forEach(b => { const key = (b.patientName || '') + '|' + (b.patientPhone || ''); set.add(key); if (b.name) set.add(b.name + '|' + (b.phone || '')); });
    return set.size;
  }, [myAppointments]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('doctorDashboard.title', '👋 Dr. {name}').replace('{name}', user?.name || t('doctorDashboard.doctor', 'Doctor'))}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

      {/* Stats */}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 16 }}>
        {[
          { label: t('doctorDashboard.todaysAppointments', "Today's Appointments"), value: grouped.todayApps.length, color: '#7c3aed', bg: '#f5f3ff' },
          { label: t('doctorDashboard.upcoming', 'Upcoming'), value: grouped.upcoming.length, color: '#2563eb', bg: '#eff6ff' },
          { label: t('doctorDashboard.totalPatients', 'Total Patients'), value: uniquePatients, color: '#059669', bg: '#ecfdf5' },
          { label: t('doctorDashboard.pastConsultations', 'Past Consultations'), value: grouped.past.length, color: '#64748b', bg: '#f1f5f9' },
        ].map(s => (
          <div key={s.label} style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        {['today', 'upcoming', 'past'].map(tab => (
          <button key={tab} onClick={() => setView(tab)} style={{
            padding: '6px 14px', borderRadius: 8, border: 'none',
            background: view === tab ? '#7c3aed' : '#f1f5f9',
            color: view === tab ? '#fff' : '#475569',
            cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: view === tab ? 600 : 400,
          }}>{tab === 'today' ? t('doctorDashboard.todayTab', "Today's") : tab === 'upcoming' ? t('doctorDashboard.upcomingTab', 'Upcoming') : t('doctorDashboard.pastTab', 'Past')}</button>
        ))}
      </div>

      {/* Appointments List */}
      <div style={sectionCard}>
        {view === 'today' && grouped.todayApps.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 24 }}>{t('doctorDashboard.noAppointmentsToday', 'No appointments today.')}</p>}
        {view === 'upcoming' && grouped.upcoming.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 24 }}>{t('doctorDashboard.noUpcoming', 'No upcoming appointments.')}</p>}
        {view === 'past' && grouped.past.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 24 }}>{t('doctorDashboard.noPastConsultations', 'No past consultations.')}</p>}

        {(view === 'today' ? grouped.todayApps : view === 'upcoming' ? grouped.upcoming : grouped.past).map(b => (
          <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#7c3aed', fontWeight: 700, flexShrink: 0 }}>
              {(b.patientName || b.name || '?')[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{b.patientName || b.name || 'Unknown'}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                 {b.date} {b.time ? `@ ${b.time}` : ''} | {b.test || b.reason || t('doctorDashboard.consultation', 'Consultation')}
              </div>
              {b.status && <span style={{ fontSize: 10, fontWeight: 600, color: b.status === 'completed' ? '#059669' : b.status === 'cancelled' ? '#ef4444' : '#d97706' }}>{b.status}</span>}
            </div>
            {(b.phone || b.patientPhone) && <div style={{ fontSize: 11, color: '#94a3b8' }}>{b.phone || b.patientPhone}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}