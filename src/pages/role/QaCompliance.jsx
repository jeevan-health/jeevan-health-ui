import { useState } from 'react';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const CHECKS = [
  { area: 'Lab Equipment Calibration', lastCheck: '2025-07-08', nextDue: '2025-07-22', status: 'compliant' },
  { area: 'Staff Certification', lastCheck: '2025-07-01', nextDue: '2025-08-01', status: 'compliant' },
  { area: 'Data Privacy Compliance', lastCheck: '2025-06-15', nextDue: '2025-07-15', status: 'overdue' },
  { area: 'Waste Disposal', lastCheck: '2025-07-05', nextDue: '2025-07-19', status: 'compliant' },
  { area: 'Safety Protocols', lastCheck: '2025-06-01', nextDue: '2025-07-01', status: 'overdue' },
];

export default function QaCompliance() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>✅ Compliance Checklist</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Regulatory and safety compliance tracking</p>
      {CHECKS.map((c, i) => (
        <div key={i} style={{ ...card, borderLeft: `4px solid ${c.status === 'compliant' ? '#65a30d' : '#dc2626'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{c.area}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>Last: {c.lastCheck} · Next: {c.nextDue}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: c.status === 'compliant' ? '#dcfce7' : '#fee2e2', color: c.status === 'compliant' ? '#16a34a' : '#dc2626', fontWeight: 600, textTransform: 'capitalize' }}>{c.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}