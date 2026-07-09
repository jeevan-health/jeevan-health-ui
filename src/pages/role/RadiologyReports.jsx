import { useState } from 'react';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { patient: 'Ravi', test: 'Chest X-Ray', reported: '2025-07-08', status: 'pending' },
  { patient: 'Sita', test: 'MRI Brain', reported: '2025-07-07', status: 'approved' },
  { patient: 'Amit', test: 'CT Abdomen', reported: '2025-07-06', status: 'pending' },
];

export default function RadiologyReports() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>📄 Radiology Reports</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Pending review and approved reports</p>
      {SAMPLE.map((r, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{r.patient}</span>
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>{r.test}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{r.reported}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: r.status === 'approved' ? '#dcfce7' : '#fef3c7', color: r.status === 'approved' ? '#16a34a' : '#d97706', fontWeight: 600, textTransform: 'capitalize' }}>{r.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}