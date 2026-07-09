import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';

const sectionCard = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const TODAY = new Date().toISOString().slice(0, 10);

export default function EmergencyDashboard() {
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());

  const urgentCases = useMemo(() => orders.filter(o => {
    const q = (user?.name || '').toLowerCase();
    return o.emergencyStaff === user?.name || o.emergencyPhone === user?.phone || o.collectionDate === TODAY;
  }), [orders, user]);

  const active = useMemo(() => urgentCases.filter(o => o.status !== 'completed' && o.status !== 'cancelled'), [urgentCases]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>🚑 Welcome, {user?.name || 'Emergency Staff'}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#dc2626' }}>{active.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Active Cases</div></div>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#dc2626' }}>{urgentCases.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Total Cases</div></div>
      </div>
      <div style={{ ...sectionCard, border: '2px solid #fecaca', background: '#fef2f2' }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#dc2626', margin: '0 0 12px' }}>🚨 Active Cases</h4>
        {active.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 24 }}>No active emergency cases.</p>}
        {active.map(o => (
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #fecaca' }}>
            <div><div style={{ fontWeight: 600, fontSize: 13, color: '#991b1b' }}>{o.patientInfo?.name || o.bookedFor || 'Unknown'}</div><div style={{ fontSize: 11, color: '#b91c1c' }}>📍 {o.collectionAddress?.area || '—'} | ⏱️ {o.collectionTime || '—'}</div></div>
            <span style={{ padding: '2px 10px', borderRadius: 20, background: '#fee2e2', color: '#dc2626', fontSize: 10, fontWeight: 700 }}>ACTIVE</span>
          </div>
        ))}
      </div>
    </div>
  );
}