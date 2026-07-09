import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';

const sectionCard = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const TODAY = new Date().toISOString().slice(0, 10);

export default function CaregiverDashboard() {
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());

  const myPatients = useMemo(() => orders.filter(o => o.caregiver === user?.name || o.caregiverPhone === user?.phone), [orders, user]);
  const todayTasks = useMemo(() => myPatients.filter(o => o.collectionDate === TODAY), [myPatients]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>👵 Welcome, {user?.name || 'Caregiver'}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#d97706' }}>{myPatients.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Assigned Patients</div></div>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#d97706' }}>{todayTasks.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Today's Care</div></div>
      </div>
      <div style={sectionCard}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>👤 Patients Under Care</h4>
        {myPatients.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 24 }}>No patients assigned.</p>}
        {myPatients.map(o => (
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div><div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{o.patientInfo?.name || o.bookedFor || 'Unknown'}</div><div style={{ fontSize: 11, color: '#64748b' }}>📍 {o.collectionAddress?.area || '—'} | {o.collectionDate || '—'}</div></div>
            <span style={{ padding: '2px 10px', borderRadius: 20, background: o.collectionDate === TODAY ? '#fef3c7' : '#f1f5f9', color: o.collectionDate === TODAY ? '#d97706' : '#94a3b8', fontSize: 10, fontWeight: 600 }}>{o.collectionDate === TODAY ? 'Today' : 'Scheduled'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}