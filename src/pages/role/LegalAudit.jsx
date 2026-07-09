import { useState } from 'react';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { action: 'User login', user: 'admin@jeevan.com', role: 'super_admin', ip: '192.168.1.1', timestamp: '2025-07-08 09:15:00', detail: 'Successful login' },
  { action: 'Order status change', user: 'staff@jeevan.com', role: 'staff', ip: '192.168.1.2', timestamp: '2025-07-08 10:30:00', detail: 'ORD-001 → completed' },
  { action: 'Phlebotomist assigned', user: 'admin@jeevan.com', role: 'super_admin', ip: '192.168.1.1', timestamp: '2025-07-08 11:00:00', detail: 'Rajesh → ORD-001' },
  { action: 'User permission update', user: 'admin@jeevan.com', role: 'admin', ip: '192.168.1.1', timestamp: '2025-07-07 14:00:00', detail: 'Permissions modified' },
  { action: 'Report uploaded', user: 'lab@jeevan.com', role: 'staff', ip: '192.168.1.3', timestamp: '2025-07-07 15:30:00', detail: 'RPT-001 uploaded' },
];

export default function LegalAudit() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>📋 Audit Logs</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>System activity and audit trail</p>
      {SAMPLE.map((a, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{a.action}</span>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{a.detail}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{a.user} ({a.role}) · {a.ip} · {a.timestamp}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}