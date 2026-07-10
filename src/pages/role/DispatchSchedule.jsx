import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { route: 'Zone A - Koramangala', slots: 8, filled: 6, status: 'active' },
  { route: 'Zone B - Indiranagar', slots: 5, filled: 3, status: 'active' },
  { route: 'Zone C - Whitefield', slots: 10, filled: 10, status: 'completed' },
  { route: 'Zone D - JP Nagar', slots: 4, filled: 0, status: 'pending' },
];

export default function DispatchSchedule() {
  const t = useT();
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('dispatchSchedule.title', '📅 Dispatch Schedule')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{t('dispatchSchedule.subtitle', 'Collection and delivery routing')}</p>
      {SAMPLE.map((s, i) => (
        <div key={i} style={{ ...card, border: s.status === 'active' ? '2px solid #f97316' : '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{s.route}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{s.filled}/{s.slots} {t('dispatchSchedule.slotsFilled', 'slots filled')}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: s.status === 'active' ? '#fff7ed' : s.status === 'completed' ? '#dcfce7' : '#f1f5f9', color: s.status === 'active' ? '#f97316' : s.status === 'completed' ? '#16a34a' : '#64748b', fontWeight: 600, textTransform: 'capitalize' }}>{s.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}