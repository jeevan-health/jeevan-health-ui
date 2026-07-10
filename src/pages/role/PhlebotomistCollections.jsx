import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
import useBookingsStore from '../../stores/bookingsStore';
import useAuthStore from '../../stores/authStore';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function PhlebotomistCollections() {
  const t = useT();
  const user = useAuthStore(s => s.user);
  const bookings = useBookingsStore(s => s.bookings).filter(b => b.assignedTo === user?.name || b.assignedTo === user?.phone);
  const [status, setStatus] = useState('');

  const filtered = status ? bookings.filter(b => b.status === status) : bookings;

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.phlebotomist.myCollections', '🧪 My Collections')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{filtered.length} {filtered.length !== 1 ? t('role.phlebotomist.collections', 'collections') : t('role.phlebotomist.collection', 'collection')} {t('role.phlebotomist.assignedToYou', 'assigned to you')}</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {['', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setStatus(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: status === s ? '#059669' : '#fff', color: status === s ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11, fontWeight: status === s ? 600 : 400 }}>{s || t('role.phlebotomist.all', 'All')}</button>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: 40 }}>{t('role.phlebotomist.noCollections', 'No collections assigned yet.')}</p>}
      {filtered.map((b, i) => (
        <div key={b.id || i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{b.patientName || t('role.phlebotomist.patient', 'Patient')}</span>
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 8 }}>{b.patientPhone}</span>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{b.testName || t('role.phlebotomist.test', 'Test')} — {b.time || b.date}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: b.status === 'completed' ? '#dcfce7' : b.status === 'in_progress' ? '#fef3c7' : '#f1f5f9', color: b.status === 'completed' ? '#16a34a' : b.status === 'in_progress' ? '#d97706' : '#64748b', fontWeight: 600, textTransform: 'capitalize' }}>{b.status || t('role.phlebotomist.pending', 'pending')}</span>
          </div>
          {b.address && <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>📍 {b.address}</div>}
        </div>
      ))}
    </div>
  );
}