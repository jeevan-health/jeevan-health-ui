import { useState, useMemo } from 'react';
import useAuthStore from '../../stores/authStore';
import useInventoryStore from '../../stores/inventoryStore';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function InventoryDashboard() {
  const user = useAuthStore(s => s.user);
  const items = useInventoryStore(s => s.items);

  const lowStock = useMemo(() => items.filter(i => (i.quantity || 0) <= (i.minStock || 0)), [items]);
  const totalStock = useMemo(() => items.reduce((s, i) => s + (i.quantity || 0), 0), [items]);
  const totalValue = useMemo(() => items.reduce((s, i) => s + ((i.quantity || 0) * (i.costPerUnit || 0)), 0), [items]);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>📦 Welcome, {user?.name || 'Inventory Staff'}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#a16207' }}>{items.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Unique Items</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#a16207' }}>{totalStock.toLocaleString()}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Total Units in Stock</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#a16207' }}>₹{totalValue.toLocaleString()}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Stock Value</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0, border: lowStock.length > 0 ? '2px solid #ef4444' : '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: lowStock.length > 0 ? '#ef4444' : '#a16207' }}>{lowStock.length}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Low Stock Alerts</div>
        </div>
      </div>

      {/* Low Stock Items */}
      {lowStock.length > 0 && (
        <div style={{ ...card, border: '2px solid #fecaca', background: '#fef2f2' }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', margin: '0 0 10px' }}>🚨 Items Need Restocking</h4>
          {lowStock.map(i => (
            <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #fecaca', fontSize: 13 }}>
              <div><span style={{ fontWeight: 600, color: '#991b1b' }}>{i.name}</span> <span style={{ color: '#64748b', fontSize: 12 }}>{i.category}</span></div>
              <div><span style={{ fontWeight: 700, color: '#dc2626' }}>{i.quantity || 0}</span> <span style={{ color: '#64748b', fontSize: 11 }}>/ min {i.minStock || 0} {i.unit}</span></div>
            </div>
          ))}
        </div>
      )}

      {/* All Stock */}
      <div style={card}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>📋 All Stock</h4>
        {items.length === 0 && <p style={{ fontSize: 12, color: '#94a3b8' }}>No inventory items yet.</p>}
        {items.map(i => (
          <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
            <div>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{i.name}</span>
              <span style={{ color: '#64748b', fontSize: 11, marginLeft: 6 }}>{i.category}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, color: (i.quantity || 0) <= (i.minStock || 0) ? '#dc2626' : '#0f172a' }}>{i.quantity || 0}</span>
              <span style={{ color: '#64748b', fontSize: 11 }}>{i.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}