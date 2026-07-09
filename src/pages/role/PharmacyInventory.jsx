import { useState } from 'react';
import useInventoryStore from '../../stores/inventoryStore';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function PharmacyInventory() {
  const items = useInventoryStore(s => s.items).filter(i => i.category === 'Pharmacy');
  const low = items.filter(i => (i.quantity || 0) <= (i.minStock || 0));
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>📦 Pharmacy Inventory</h2>
      {low.length > 0 && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 16px', marginBottom: 12, fontSize: 12, color: '#991b1b', fontWeight: 600 }}>🚨 {low.length} item{low.length > 1 ? 's' : ''} low on stock</div>
      )}
      {items.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 40 }}>No pharmacy items.</p>}
      {items.map((i, idx) => (
        <div key={i.id || idx} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{i.name}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>Stock: {i.quantity || 0} {i.unit} · Min: {i.minStock || 0}</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: (i.quantity || 0) <= (i.minStock || 0) ? '#dc2626' : '#16a34a' }}>{i.quantity || 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
}