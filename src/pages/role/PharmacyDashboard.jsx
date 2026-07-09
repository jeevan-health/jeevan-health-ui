import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';

const sectionCard = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function PharmacyDashboard() {
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());

  const pharmacyOrders = useMemo(() => {
    const q = (user?.name || '').toLowerCase();
    return orders.filter(o => (o.pharmacyStaff || '').toLowerCase() === q || (o.assignedPharmacist || '').toLowerCase() === q || (o.tests || []).some(t => (t || '').toLowerCase().includes('medicine') || (t || '').toLowerCase().includes('pharmacy')));
  }, [orders, user]);

  const pending = useMemo(() => pharmacyOrders.filter(o => o.status === 'confirmed' || o.status === 'pending'), [pharmacyOrders]);
  const delivered = useMemo(() => pharmacyOrders.filter(o => o.status === 'completed'), [pharmacyOrders]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>💊 Welcome, {user?.name || 'Pharmacy Staff'}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#db2777' }}>{pharmacyOrders.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Total Orders</div></div>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#db2777' }}>{pending.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Pending Delivery</div></div>
        <div style={{ ...sectionCard, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#db2777' }}>{delivered.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Delivered</div></div>
      </div>
      <div style={sectionCard}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>📋 Pharmacy Orders</h4>
        {pharmacyOrders.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 24 }}>No orders assigned.</p>}
        {pharmacyOrders.map(o => (
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div><div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{o.patientInfo?.name || o.bookedFor || 'Unknown'}</div><div style={{ fontSize: 11, color: '#64748b' }}>📍 {o.collectionAddress?.area || '—'} | {(o.tests || []).slice(0, 3).join(', ')}</div></div>
            <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: o.status === 'completed' ? '#fce7f3' : '#fef3c7', color: o.status === 'completed' ? '#db2777' : '#d97706' }}>{o.status === 'completed' ? 'Delivered' : 'Pending'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}