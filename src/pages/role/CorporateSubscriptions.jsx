import { useState } from 'react';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { name: 'Acme Corp', plan: 'Executive Health', employees: 150, start: '2025-01-01', end: '2025-12-31', amount: '₹4,50,000', status: 'active' },
  { name: 'TechSolutions Ltd', plan: 'Comprehensive', employees: 80, start: '2025-03-01', end: '2026-02-28', amount: '₹3,20,000', status: 'active' },
  { name: 'GreenLeaf Inc', plan: 'Basic Wellness', employees: 45, start: '2025-06-01', end: '2025-11-30', amount: '₹90,000', status: 'pending' },
];

export default function CorporateSubscriptions() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>📑 Subscriptions</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Corporate health plan subscriptions</p>
      {SAMPLE.map((s, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{s.name}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{s.plan} · {s.employees} employees · {s.amount}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.start} → {s.end}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: s.status === 'active' ? '#dcfce7' : '#fef3c7', color: s.status === 'active' ? '#16a34a' : '#d97706', fontWeight: 600, textTransform: 'capitalize' }}>{s.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}