import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { name: 'Rajesh K', role: 'Phlebotomist', zone: 'Koramangala', status: 'on_duty', phone: '9876543210' },
  { name: 'Sneha M', role: 'Phlebotomist', zone: 'Indiranagar', status: 'on_duty', phone: '9876543211' },
  { name: 'Vikram S', role: 'Driver', zone: 'Whitefield', status: 'available', phone: '9876543212' },
  { name: 'Anita P', role: 'Phlebotomist', zone: 'JP Nagar', status: 'offline', phone: '9876543213' },
];

export default function DispatchStaff() {
  const t = useT();
  const [filter, setFilter] = useState('');
  const filtered = filter ? SAMPLE.filter(s => s.status === filter) : SAMPLE;
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('dispatchStaff.title', '👥 Field Staff')}</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {['', 'on_duty', 'available', 'offline'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: filter === s ? '#f97316' : '#fff', color: filter === s ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11 }}>{s || t('dispatchStaff.all', 'All')}</button>
        ))}
      </div>
      {filtered.map((s, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{s.name}</span>
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>{s.role}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>📍 {s.zone} · 📞 {s.phone}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: s.status === 'on_duty' ? '#dcfce7' : s.status === 'available' ? '#fef3c7' : '#f1f5f9', color: s.status === 'on_duty' ? '#16a34a' : s.status === 'available' ? '#d97706' : '#64748b', fontWeight: 600, textTransform: 'capitalize' }}>{s.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}