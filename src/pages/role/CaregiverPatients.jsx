import { useState } from 'react';
import usePatientsStore from '../../stores/patientsStore';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };

export default function CaregiverPatients() {
  const t = useT();
  const patients = usePatientsStore(s => s.patients);
  const [search, setSearch] = useState('');
  const filtered = search ? patients.filter(p => (p.name + p.phone).toLowerCase().includes(search.toLowerCase())) : patients;
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('caregiverPatients.title', '👤 Assigned Patients')}</h2>
      <input value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 260, marginBottom: 16, fontSize: 12 }} placeholder={t('caregiverPatients.searchPlaceholder', '🔍 Search patients...')} />
      {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 40 }}>{t('caregiverPatients.empty', 'No patients assigned.')}</p>}
      {filtered.slice(0, 20).map((p, i) => (
        <div key={p.id || i} style={card}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{p.name}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>📞 {p.phone} · {p.gender || '—'} · {p.age ? `${p.age}y` : ''}</div>
          {p.address && <div style={{ fontSize: 12, color: '#64748b' }}>📍 {p.address}</div>}
        </div>
      ))}
    </div>
  );
}