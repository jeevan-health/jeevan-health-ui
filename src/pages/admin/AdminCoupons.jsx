import { useState, useEffect } from 'react';
import { useT } from '../../i18n/LanguageProvider';
import useAdminStore from '../../stores/adminStore';
import { confirmDialog } from '../../stores/dialogStore';

export default function AdminCoupons() {
  const t = useT();
  const coupons = useAdminStore(s => s.coupons);
  const saveCoupon = useAdminStore(s => s.saveCoupon);
  const deleteCoupon = useAdminStore(s => s.deleteCoupon);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ code: '', discount: 10, minOrder: 0, maxUses: 100, active: true });

  useEffect(() => { useAdminStore.getState().refreshCoupons(); }, []);

  const handleSave = () => {
    if (!form.code.trim()) return;
    saveCoupon({ ...form, usedCount: editing?.usedCount || 0 });
    setEditing(null);
    setForm({ code: '', discount: 10, minOrder: 0, maxUses: 100, active: true });
  };

  const handleEdit = (c) => {
    setForm({ code: c.code, discount: c.discount, minOrder: c.minOrder, maxUses: c.maxUses, active: c.active });
    setEditing(c.code);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <button onClick={() => { setEditing('new'); setForm({ code: '', discount: 10, minOrder: 0, maxUses: 100, active: true }); }} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1866C9', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>+ New Coupon</button>
        <span style={{ fontSize: 12, color: '#64748b' }}>{coupons.length} coupons</span>
      </div>

      {/* Edit/Add form */}
      {editing && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{editing === 'new' ? 'New Coupon' : `Edit: ${editing}`}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Code</label><input className="input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. SAVE20" style={{ fontSize: 13 }} disabled={editing !== 'new'} /></div>
            <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Discount %</label><input className="input" type="number" value={form.discount} onChange={e => setForm({ ...form, discount: Number(e.target.value) })} style={{ fontSize: 13 }} /></div>
            <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Min Order (₹)</label><input className="input" type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: Number(e.target.value) })} style={{ fontSize: 13 }} /></div>
            <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Max Uses</label><input className="input" type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: Number(e.target.value) })} style={{ fontSize: 13 }} /></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
              <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> Active</label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSave} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#1866C9', color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Save</button>
            <button onClick={() => setEditing(null)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>{t('admin.coupons.cancel', 'Cancel')}</button>
          </div>
        </div>
      )}

      {coupons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>No coupons created yet</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.coupons.code', 'Code')}</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.coupons.discount', 'Discount')}</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Min Order</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Used / Max</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', fontSize: 14 }}>{c.code}</td>
                  <td style={{ padding: '10px 14px', color: '#10b981', fontWeight: 600 }}>{c.discount}%</td>
                  <td style={{ padding: '10px 14px', color: '#334155' }}>{c.minOrder > 0 ? `₹${c.minOrder}` : 'None'}</td>
                  <td style={{ padding: '10px 14px', color: '#334155' }}>{c.usedCount || 0} / {c.maxUses || '∞'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.active ? '#dcfce7' : '#f1f5f9', color: c.active ? '#166534' : '#64748b' }}>{c.active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <button onClick={() => handleEdit(c)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12, marginRight: 8 }}>{t('admin.coupons.edit', 'Edit')}</button>
                    <button onClick={async () => { if (await confirmDialog('Delete coupon?')) deleteCoupon(c.code); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}>{t('admin.coupons.delete', 'Delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}