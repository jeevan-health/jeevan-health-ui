import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';
import { useT } from '../../i18n/LanguageProvider';

const sectionCard = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const TODAY = new Date().toISOString().slice(0, 10);

export default function RadiologyDashboard() {
  const t = useT();
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());

  const myAssignments = useMemo(() => orders.filter(o => o.radiologist === user?.name || o.radioPhone === user?.phone), [orders, user]);
  const pending = useMemo(() => myAssignments.filter(o => o.status === 'confirmed'), [myAssignments]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.radiology.welcome', '🩻 Welcome, ')}{user?.name || t('role.radiology.tech', 'Radiology Tech')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#6366f1' }}>{myAssignments.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('role.radiology.totalAssignments', 'Total Assignments')}</div></div>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#6366f1' }}>{pending.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('role.radiology.pendingImaging', 'Pending Imaging')}</div></div>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#6366f1' }}>{myAssignments.filter(o => o.collectionDate === TODAY).length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('role.radiology.todaysCases', "Today's Cases")}</div></div>
      </div>
      <div style={sectionCard}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>{t('role.radiology.imagingAssignments', '📋 Imaging Assignments')}</h4>
        {myAssignments.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 24 }}>{t('role.radiology.noAssignments', 'No imaging assignments.')}</p>}
        {myAssignments.map(o => (
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div><div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{o.patientInfo?.name || o.bookedFor || t('role.radiology.unknown', 'Unknown')}</div><div style={{ fontSize: 11, color: '#64748b' }}>{o.id} | {o.collectionAddress?.area || '—'}</div></div>
            <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: o.status === 'completed' ? '#eef2ff' : '#fef3c7', color: o.status === 'completed' ? '#6366f1' : '#d97706' }}>{o.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}