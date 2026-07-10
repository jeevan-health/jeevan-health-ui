import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE_PLANS = [
  { patient: 'Ravi Kumar', condition: 'Lower Back Pain', therapy: 'Spinal Decompression', sessions: '6/12', status: 'in_progress' },
  { patient: 'Sita Devi', condition: 'Knee Osteoarthritis', therapy: 'Mobilization + Strengthening', sessions: '4/8', status: 'in_progress' },
  { patient: 'Amit Singh', condition: 'Frozen Shoulder', therapy: 'Stretching + Pendular', sessions: '10/15', status: 'in_progress' },
  { patient: 'Priya Sharma', condition: 'Post-Surgery Rehab', therapy: 'Gait Training', sessions: '0/10', status: 'new' },
];

export default function PhysioTherapy() {
  const t = useT();
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.physio.therapyPlans', '📋 Therapy Plans')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{SAMPLE_PLANS.length} {t('role.physio.activePlans', 'active plans')}</p>
      {SAMPLE_PLANS.map((p, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{p.patient}</span>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{p.condition} — {p.therapy}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{t('role.physio.progress', 'Progress:')} {p.sessions} {t('role.physio.sessions', 'sessions')}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: p.status === 'new' ? '#fef3c7' : '#dcfce7', color: p.status === 'new' ? '#d97706' : '#16a34a', fontWeight: 600, textTransform: 'capitalize' }}>{p.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}