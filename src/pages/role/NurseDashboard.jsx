import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';
import { useT } from '../../i18n/LanguageProvider';

const sectionCard = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const TODAY = new Date().toISOString().slice(0, 10);

export default function NurseDashboard() {
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());

  const myPatients = useMemo(() => orders.filter(o => o.assignedNurse === user?.name || o.nursePhone === user?.phone), [orders, user]);
  const todayTasks = useMemo(() => myPatients.filter(o => o.collectionDate === TODAY), [myPatients]);
  const t = useT();

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.nurse.welcome', '🧑‍⚕️ Welcome, ')}{user?.name || t('role.nurse.fallbackName', 'Nurse')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#0891b2' }}>{myPatients.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('role.nurse.totalPatients', 'Total Patients')}</div></div>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#0891b2' }}>{todayTasks.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('role.nurse.todayTasks', "Today's Tasks")}</div></div>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#0891b2' }}>{myPatients.filter(o => o.status !== 'completed').length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('role.nurse.active', 'Active')}</div></div>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#0891b2' }}>{myPatients.filter(o => o.status === 'completed').length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('role.nurse.completed', 'Completed')}</div></div>
      </div>
      <div style={sectionCard}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>{t('role.nurse.assignedPatients', '📋 Assigned Patients')}</h4>
        {myPatients.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 24 }}>{t('role.nurse.noPatients', 'No patients assigned yet.')}</p>}
        {myPatients.map(o => (
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div><div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{o.patientInfo?.name || o.bookedFor || t('role.nurse.unknown', 'Unknown')}</div><div style={{ fontSize: 11, color: '#64748b' }}>{o.id?.slice(0, 12)} | {o.collectionDate || '—'}</div></div>
            <div style={{ fontSize: 12, color: o.collectionDate === TODAY ? '#0891b2' : '#64748b', fontWeight: o.collectionDate === TODAY ? 600 : 400 }}>{o.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}