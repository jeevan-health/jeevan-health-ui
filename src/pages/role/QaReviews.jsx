import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { id: 'REV-001', patient: 'Ravi Kumar', test: 'CBC', reviewer: 'Dr. Sharma', date: '2025-07-08', status: 'pending' },
  { id: 'REV-002', patient: 'Sita Devi', test: 'Thyroid Profile', reviewer: 'Dr. Mehta', date: '2025-07-07', status: 'approved' },
  { id: 'REV-003', patient: 'Amit Singh', test: 'Lipid Profile', reviewer: 'Dr. Sharma', date: '2025-07-06', status: 'flagged' },
  { id: 'REV-004', patient: 'Priya', test: 'Vitamin D', reviewer: 'Dr. Mehta', date: '2025-07-05', status: 'approved' },
];

export default function QaReviews() {
  const t = useT();
  const [filter, setFilter] = useState('');
  const filtered = filter ? SAMPLE.filter(r => r.status === filter) : SAMPLE;
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.qa.qualityReviews', '🔍 Quality Reviews')}</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {['', 'pending', 'approved', 'flagged'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: filter === s ? '#65a30d' : '#fff', color: filter === s ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11 }}>{s || t('role.qa.all', 'All')}</button>
        ))}
      </div>
      {filtered.map((r, i) => (
        <div key={i} style={{ ...card, borderLeft: `4px solid ${r.status === 'approved' ? '#65a30d' : r.status === 'flagged' ? '#dc2626' : '#f97316'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{r.patient}</span>
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>{r.test}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{t('role.qa.by', 'By')} {r.reviewer} · {r.date}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: r.status === 'approved' ? '#dcfce7' : r.status === 'flagged' ? '#fee2e2' : '#fef3c7', color: r.status === 'approved' ? '#16a34a' : r.status === 'flagged' ? '#dc2626' : '#d97706', fontWeight: 600, textTransform: 'capitalize' }}>{r.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}