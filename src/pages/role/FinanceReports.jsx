import { useState } from 'react';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const REPORTS = [
  { name: 'Daily Revenue Report', period: '2025-07-08', type: 'Revenue', rows: 45, status: 'ready' },
  { name: 'Monthly Collections Summary', period: 'June 2025', type: 'Operations', rows: 230, status: 'ready' },
  { name: 'Outstanding Payments', period: 'Q2 2025', type: 'Finance', rows: 18, status: 'pending' },
  { name: 'Test Popularity Analysis', period: 'H1 2025', type: 'Analytics', rows: 67, status: 'ready' },
];

export default function FinanceReports() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>📊 Finance Reports</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Generated reports and statements</p>
      {REPORTS.map((r, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{r.name}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{r.type} · Period: {r.period} · {r.rows} rows</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: r.status === 'ready' ? '#dcfce7' : '#fef3c7', color: r.status === 'ready' ? '#16a34a' : '#d97706', fontWeight: 600, textTransform: 'capitalize' }}>{r.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}