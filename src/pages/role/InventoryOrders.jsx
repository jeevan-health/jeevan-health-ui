import { useState } from 'react';
import useInventoryStore from '../../stores/inventoryStore';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function InventoryOrders() {
  const items = useInventoryStore(s => s.items);
  const pending = items.filter(i => (i.quantity || 0) <= (i.minStock || 0));
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>📋 Reorder Requests</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Items that need to be reordered from suppliers</p>
      {pending.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 40 }}>All items are well-stocked. No reorder needed.</p>}
      {pending.map((i, idx) => (
        <div key={i.id || idx} style={{ ...card, border: '2px solid #fecaca', background: '#fef2f2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#991b1b' }}>{i.name}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>Supplier: {i.supplier || '—'} · Current: {i.quantity || 0} {i.unit} · Min: {i.minStock || 0}</div>
            </div>
            <div style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: '#fee2e2', color: '#dc2626', fontWeight: 600 }}>Reorder Qty: {(i.minStock || 10) * 2}+</div>
          </div>
        </div>
      ))}
    </div>
  );
}