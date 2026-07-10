import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { name: 'Safe Blood Collection', staff: ['Rajesh', 'Priya', 'Sunil'], date: '2025-07-15', validTill: '2026-07-15', status: 'valid' },
  { name: 'Equipment Handling', staff: ['Sneha', 'Amit'], date: '2025-07-20', validTill: '2026-07-20', status: 'valid' },
  { name: 'CPR & Emergency Response', staff: ['Vikram'], date: '2024-06-01', validTill: '2025-06-01', status: 'expired' },
];

export default function TrainingCertifications() {
  const t = useT();
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.training.certifications', '📜 Certifications')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{t('role.training.certDesc', 'Staff training certifications and validity')}</p>
      {SAMPLE.map((c, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{c.name}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{c.staff.join(', ')}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.date} {t('role.training.validTill', '→ Valid till')} {c.validTill}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: c.status === 'valid' ? '#dcfce7' : '#fee2e2', color: c.status === 'valid' ? '#16a34a' : '#dc2626', fontWeight: 600, textTransform: 'capitalize' }}>{c.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}