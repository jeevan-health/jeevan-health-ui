import { useState } from 'react';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { system: 'Lab Information System', status: 'online', uptime: '99.9%', lastIncident: 'None' },
  { system: 'Billing System', status: 'online', uptime: '99.5%', lastIncident: '2025-07-05' },
  { system: 'Website / Patient Portal', status: 'online', uptime: '99.8%', lastIncident: 'None' },
  { system: 'Inventory Management', status: 'online', uptime: '100%', lastIncident: 'None' },
  { system: 'Email / Notification Service', status: 'degraded', uptime: '95%', lastIncident: '2025-07-08' },
];

export default function ITSupportSystem() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>⚙️ System Status</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Monitor and manage IT infrastructure</p>
      {SAMPLE.map((s, i) => (
        <div key={i} style={{ ...card, borderLeft: `4px solid ${s.status === 'online' ? '#22c55e' : s.status === 'degraded' ? '#f97316' : '#ef4444'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{s.system}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>Uptime: {s.uptime} · Last incident: {s.lastIncident}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: s.status === 'online' ? '#dcfce7' : '#fff7ed', color: s.status === 'online' ? '#16a34a' : '#f97316', fontWeight: 600, textTransform: 'capitalize' }}>{s.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}