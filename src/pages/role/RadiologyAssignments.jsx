import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { patient: 'Rajesh', test: 'Chest X-Ray', priority: 'urgent', status: 'pending', notes: 'Patient in Ward 3A' },
  { patient: 'Meena', test: 'MRI Brain', priority: 'routine', status: 'pending', notes: 'Contrast required' },
  { patient: 'Sunil', test: 'CT Abdomen', priority: 'urgent', status: 'in_progress' },
  { patient: 'Anita', test: 'USG Pelvis', priority: 'routine', status: 'completed' },
];

export default function RadiologyAssignments() {
  const t = useT();
  const [filter, setFilter] = useState('');
  const filtered = filter ? SAMPLE.filter(a => a.status === filter) : SAMPLE;
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.radiology.assignments', '📋 Assignments')}</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {['', 'pending', 'in_progress', 'completed'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: filter === s ? '#6366f1' : '#fff', color: filter === s ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11 }}>{s || t('role.radiology.all', 'All')}</button>
        ))}
      </div>
      {filtered.map((a, i) => (
        <div key={i} style={{ ...card, border: a.priority === 'urgent' ? '2px solid #ef4444' : '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{a.patient}</span>
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>{a.test}</span>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{a.notes || ''}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: a.status === 'completed' ? '#dcfce7' : a.status === 'in_progress' ? '#fef3c7' : '#fee2e2', color: a.status === 'completed' ? '#16a34a' : a.status === 'in_progress' ? '#d97706' : '#dc2626', fontWeight: 600 }}>{a.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}