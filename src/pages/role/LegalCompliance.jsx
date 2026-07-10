import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const CHECKS = [
  { regulation: 'HIPAA Compliance', status: 'compliant', lastReview: '2025-07-01', nextAudit: '2025-10-01' },
  { regulation: 'Data Protection Act', status: 'compliant', lastReview: '2025-06-15', nextAudit: '2025-09-15' },
  { regulation: 'Clinical Lab Standards', status: 'compliant', lastReview: '2025-07-08', nextAudit: '2026-01-08' },
  { regulation: 'Employee Labor Laws', status: 'pending', lastReview: '2025-05-01', nextAudit: '2025-08-01' },
];

export default function LegalCompliance() {
  const t = useT();
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.legalCompliance.title', '✅ Legal Compliance')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{t('role.legalCompliance.subtitle', 'Regulatory compliance tracking and audits')}</p>
      {CHECKS.map((c, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{c.regulation}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{t('role.legalCompliance.lastReview', 'Last')}: {c.lastReview} · {t('role.legalCompliance.nextAudit', 'Next Audit')}: {c.nextAudit}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: c.status === 'compliant' ? '#dcfce7' : '#fef3c7', color: c.status === 'compliant' ? '#16a34a' : '#d97706', fontWeight: 600, textTransform: 'capitalize' }}>{c.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}