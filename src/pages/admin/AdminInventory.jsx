import { useState, useMemo } from 'react';
import { useT } from '../../i18n/LanguageProvider';
import useInventoryStore, { CATEGORIES, UNITS } from '../../stores/inventoryStore';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };

export default function AdminInventory() {
  const t = useT();
  const items = useInventoryStore(s => s.items);
  const addItem = useInventoryStore(s => s.addItem);
  const updateItem = useInventoryStore(s => s.updateItem);
  const deleteItem = useInventoryStore(s => s.deleteItem);
  const adjustStock = useInventoryStore(s => s.adjustStock);

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [lowOnly, setLowOnly] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [adjustId, setAdjustId] = useState(null);

  const [form, setForm] = useState({ name: '', category: 'Consumables', sku: '', quantity: '', minStock: '', unit: 'pieces', costPerUnit: '', supplier: '', notes: '' });

  const resetForm = () => setForm({ name: '', category: 'Consumables', sku: '', quantity: '', minStock: '', unit: 'pieces', costPerUnit: '', supplier: '', notes: '' });

  const lowStockItems = useMemo(() => items.filter(i => (i.quantity || 0) <= (i.minStock || 0)), [items]);

  const filtered = useMemo(() => {
    let d = items;
    if (search) { const q = search.toLowerCase(); d = d.filter(i => (i.name + i.sku + i.supplier + i.category).toLowerCase().includes(q)); }
    if (catFilter) d = d.filter(i => i.category === catFilter);
    if (lowOnly) d = d.filter(i => (i.quantity || 0) <= (i.minStock || 0));
    return d;
  }, [items, search, catFilter, lowOnly]);

  const handleSave = () => {
    if (!form.name || !form.quantity) return;
    const data = { ...form, quantity: Number(form.quantity), minStock: Number(form.minStock) || 0, costPerUnit: Number(form.costPerUnit) || 0 };
    if (editId) { updateItem(editId, data); setEditId(null); } else addItem(data);
    setShowAdd(false); resetForm();
  };

  const handleEdit = (i) => {
    setEditId(i.id); setForm({ name: i.name, category: i.category, sku: i.sku || '', quantity: String(i.quantity || ''), minStock: String(i.minStock || ''), unit: i.unit, costPerUnit: String(i.costPerUnit || ''), supplier: i.supplier || '', notes: i.notes || '' });
    setShowAdd(true);
  };

  const totalValue = useMemo(() => items.reduce((s, i) => s + ((i.quantity || 0) * (i.costPerUnit || 0)), 0), [items]);
  const totalItems = useMemo(() => items.reduce((s, i) => s + (i.quantity || 0), 0), [items]);

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#a16207' }}>{items.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Items</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#a16207' }}>{totalItems.toLocaleString()}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Total Stock</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#a16207' }}>₹{totalValue.toLocaleString()}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Stock Value</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0, border: lowStockItems.length > 0 ? '2px solid #ef4444' : '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: lowStockItems.length > 0 ? '#ef4444' : '#a16207' }}>{lowStockItems.length}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Low Stock Alerts</div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 200, fontSize: 12 }} placeholder="🔍 Search..." />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ ...inputStyle, width: 140, fontSize: 12 }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: '#64748b' }}>
          <input type="checkbox" checked={lowOnly} onChange={e => setLowOnly(e.target.checked)} /> Low stock only
        </label>
        <div style={{ flex: 1 }} />
        <button onClick={() => { setEditId(null); resetForm(); setShowAdd(true); }} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>+ {t('admin.inventory.add_item', 'Add Item')}</button>
      </div>

      {/* Low Stock Banner */}
      {lowStockItems.length > 0 && !lowOnly && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 16px', marginBottom: 12, fontSize: 12, color: '#991b1b', fontWeight: 600 }}>
          🚨 {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} low on stock — <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setLowOnly(true)}>view all</span>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 40 }}>No items found.</p>}
      {filtered.map(i => {
        const low = (i.quantity || 0) <= (i.minStock || 0);
        return (
          <div key={i.id} style={{ ...card, padding: 14, border: low ? '2px solid #fecaca' : '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{i.name}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#f1f5f9', color: '#64748b' }}>{i.category}</span>
                  {low && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#fee2e2', color: '#dc2626', fontWeight: 700 }}>LOW STOCK</span>}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                  SKU: {i.sku || '—'} | {i.supplier ? `Supplier: ${i.supplier}` : ''} | ₹{i.costPerUnit || 0}/{i.unit}
                </div>
                <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: low ? '#dc2626' : '#0f172a' }}>{i.quantity || 0}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{i.unit}</span>
                  {i.minStock > 0 && <span style={{ fontSize: 11, color: '#94a3b8' }}>min: {i.minStock}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <button onClick={() => setAdjustId(i.id)} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#a16207' }}>Stock</button>
                <button onClick={() => handleEdit(i)} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#3b82f6' }}>{t('admin.inventory.edit', 'Edit')}</button>
                <button onClick={() => { if (confirm(`Delete ${i.name}?`)) deleteItem(i.id); }} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#ef4444' }}>Del</button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Stock Adjustment Modal */}
      {adjustId && (() => {
        const item = items.find(i => i.id === adjustId);
        if (!item) return null;
        const AdjustForm = () => {
          const [delta, setDelta] = useState('');
          const [reason, setReason] = useState('');
          return (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setAdjustId(null)}>
              <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 360, maxWidth: '90vw' }}>
                <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Adjust Stock: {item.name}</h4>
                <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>Current: <strong>{item.quantity}</strong> {item.unit} | Min: {item.minStock}</p>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <input type="number" value={delta} onChange={e => setDelta(e.target.value)} style={{ ...inputStyle }} placeholder="+/- quantity" />
                    <button onClick={() => { const v = Number(delta); if (v) { adjustStock(item.id, v, reason || 'Manual adjustment'); setAdjustId(null); } }} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#22c55e', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600, whiteSpace: 'nowrap' }}>Add</button>
                    <button onClick={() => { const v = Number(delta); if (v) { adjustStock(item.id, -v, reason || 'Manual adjustment'); setAdjustId(null); } }} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600, whiteSpace: 'nowrap' }}>Remove</button>
                  </div>
                  <input value={reason} onChange={e => setReason(e.target.value)} style={inputStyle} placeholder="Reason (optional)" />
                </div>
                <button onClick={() => setAdjustId(null)} style={{ marginTop: 8, padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#64748b', width: '100%' }}>{t('admin.inventory.cancel', 'Cancel')}</button>
              </div>
            </div>
          );
        };
        return <AdjustForm />;
      })()}

      {/* Add/Edit Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => { setShowAdd(false); setEditId(null); resetForm(); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 480, maxWidth: '90vw' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{editId ? 'Edit Item' : 'Add Inventory Item'}</h4>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
              <input placeholder="Item Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              <input placeholder="SKU (optional)" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} style={inputStyle} />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} style={inputStyle}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <input type="number" placeholder="Quantity *" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} style={inputStyle} />
              <input type="number" placeholder="Min Stock (reorder at)" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} style={inputStyle} />
              <input type="number" placeholder="Cost per Unit (₹)" value={form.costPerUnit} onChange={e => setForm({ ...form, costPerUnit: e.target.value })} style={inputStyle} />
              <input placeholder="Supplier" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} style={inputStyle} />
            </div>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, resize: 'vertical', minHeight: 50, marginTop: 10 }} placeholder="Notes (optional)" />
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAdd(false); setEditId(null); resetForm(); }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>{t('admin.inventory.cancel', 'Cancel')}</button>
              <button onClick={handleSave} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>{editId ? 'Update' : 'Add Item'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}