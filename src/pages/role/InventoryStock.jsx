import { useState } from 'react';
import useInventoryStore from '../../stores/inventoryStore';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function InventoryStock() {
  const items = useInventoryStore(s => s.items);
  const [cat, setCat] = useState('');
  const cats = [...new Set(items.map(i => i.category))];
  const filtered = cat ? items.filter(i => i.category === cat) : items;
  const low = items.filter(i => (i.quantity || 0) <= (i.minStock || 0));
  const t = useT();

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.inventoryStock.title', '📦 Stock Overview')}</h2>
      {low.length > 0 && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 16px', marginBottom: 12, fontSize: 12, color: '#991b1b', fontWeight: 600 }}>{t('role.inventoryStock.lowStock', '🚨 {count} item(s) below minimum stock', { count: low.length })}</div>
      )}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <button onClick={() => setCat('')} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: !cat ? '#a16207' : '#fff', color: !cat ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11, fontWeight: !cat ? 600 : 400 }}>{t('role.inventoryStock.all', 'All')}</button>
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: cat === c ? '#a16207' : '#fff', color: cat === c ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11 }}>{c}</button>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 40 }}>{t('role.inventoryStock.empty', 'No items.')}</p>}
      {filtered.map((i, idx) => (
        <div key={i.id || idx} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{i.name}</span>
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>{i.category}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{t('role.inventoryStock.sku', 'SKU')}: {i.sku || '—'} · {t('role.inventoryStock.supplier', 'Supplier')}: {i.supplier || '—'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: (i.quantity || 0) <= (i.minStock || 0) ? '#dc2626' : '#0f172a' }}>{i.quantity || 0}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{i.unit} · {t('role.inventoryStock.min', 'min')}: {i.minStock || 0}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}