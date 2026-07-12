import { useState, useEffect, useCallback } from 'react';
import * as adminService from '../../services/adminService';
import { useT } from '../../i18n/LanguageProvider';
import { confirmDialog } from '../../stores/dialogStore';
import { notify } from '../../lib/toastBus';

const inputStyle = {
  padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13,
  fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff',
};
const card = { background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 10 };

const emptyForm = () => ({
  name: '', category: '', composition: '', price: '', mrp: '', manufacturer: '',
  requiresPrescription: false, inStock: true, description: '', image: '',
});

/**
 * Live Neon medicines via GET/POST/PUT/DELETE /admin/medicines.
 * Same table as public pharmacy search API.
 */
export default function AdminMedicines() {
  const t = useT();
  const [medicines, setMedicines] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminService.listMedicines({
        search: search || undefined,
        category: category || undefined,
        limit: 200,
      });
      setMedicines(data.medicines || []);
      setTotal(data.total ?? (data.medicines || []).length);
    } catch (err) {
      setError(err?.response?.data?.error || t('admin.meds.loadError', 'Failed to load medicines. Deploy API with /admin/medicines.'));
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, t]);

  useEffect(() => {
    const tmr = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(tmr);
  }, [load, search]);

  const categories = [...new Set(medicines.map(m => m.category).filter(Boolean))].sort();

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (m) => {
    setEditingId(m.id);
    setForm({
      name: m.name || '',
      category: m.category || '',
      composition: m.composition || '',
      price: String(m.price ?? ''),
      mrp: String(m.mrp ?? ''),
      manufacturer: m.manufacturer || '',
      requiresPrescription: !!m.requiresPrescription,
      inStock: m.inStock !== false,
      description: m.description || '',
      image: m.image || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    setError('');
    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || null,
      composition: form.composition.trim() || null,
      price: Number(form.price) || 0,
      mrp: form.mrp !== '' ? Number(form.mrp) : Number(form.price) || 0,
      manufacturer: form.manufacturer.trim() || null,
      requiresPrescription: !!form.requiresPrescription,
      inStock: !!form.inStock,
      description: form.description.trim() || null,
      image: form.image.trim() || null,
    };
    try {
      if (editingId) await adminService.updateMedicine(editingId, payload);
      else await adminService.createMedicine(payload);
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm());
      await load();
    } catch (err) {
      setError(err?.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleStock = async (m) => {
    try {
      await adminService.updateMedicine(m.id, { inStock: !m.inStock });
      await load();
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Update failed');
    }
  };

  const handleDelete = async (m) => {
    if (!(await confirmDialog(`Delete ${m.name}?`))) return;
    try {
      await adminService.deleteMedicine(m.id);
      await load();
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700 }}>💊 {t('admin.meds.title', 'Medicines')} ({total})</h2>
          <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
            {t('admin.meds.sub', 'Live Neon catalog (pharmacy API). Patient storefront still not fully wired.')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('admin.meds.search', 'Search name, composition…')}
            style={{ ...inputStyle, width: 200, minHeight: 40 }}
          />
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, width: 140, minHeight: 40 }}>
            <option value="">{t('admin.meds.allCat', 'All categories')}</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="button" onClick={load} className="btn btn-outline btn-sm" style={{ minHeight: 40 }}>Refresh</button>
          <button type="button" onClick={openCreate} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', minHeight: 40 }}>
            + {t('admin.meds.add', 'Add medicine')}
          </button>
        </div>
      </div>

      {error && <div style={{ padding: 12, borderRadius: 10, background: '#FEF2F2', color: '#b91c1c', fontSize: 13, marginBottom: 12 }}>{error}</div>}
      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading…</div>}
      {!loading && medicines.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8', fontSize: 13, border: '1px dashed #e2e8f0', borderRadius: 12, background: '#fff' }}>
          No medicines yet. Seed runs on empty DB, or add one above.
        </div>
      )}

      {!loading && medicines.length > 0 && (
        <>
          <div className="admin-med-cards" style={{ display: 'none', flexDirection: 'column', gap: 10 }}>
            {medicines.map(m => (
              <div key={m.id} style={card}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                  {m.category || '—'} · {m.manufacturer || '—'}
                  <div>₹{m.price} {m.mrp > m.price ? <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>₹{m.mrp}</span> : null}</div>
                  <div>
                    {m.requiresPrescription ? 'Rx required' : 'OTC'} · {m.inStock ? 'In stock' : 'Out of stock'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => toggleStock(m)} style={btnOutline}>{m.inStock ? 'Mark OOS' : 'Mark in stock'}</button>
                  <button type="button" onClick={() => openEdit(m)} style={btnOutline}>Edit</button>
                  <button type="button" onClick={() => handleDelete(m)} style={{ ...btnOutline, color: '#ef4444', borderColor: '#fecaca' }}>Del</button>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-med-table" style={{ background: '#fff', borderRadius: 12, overflowX: 'auto', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={th}>Name</th>
                  <th style={th}>Category</th>
                  <th style={th}>Price</th>
                  <th style={th}>Rx</th>
                  <th style={th}>Stock</th>
                  <th style={{ ...th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={td}>
                      <div style={{ fontWeight: 600 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{m.composition || m.manufacturer || ''}</div>
                    </td>
                    <td style={td}>{m.category || '—'}</td>
                    <td style={td}>
                      <strong>₹{Number(m.price).toLocaleString('en-IN')}</strong>
                      {m.mrp > m.price && (
                        <div style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through' }}>₹{m.mrp}</div>
                      )}
                    </td>
                    <td style={td}>{m.requiresPrescription ? 'Yes' : 'No'}</td>
                    <td style={td}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                        background: m.inStock ? '#dcfce7' : '#fee2e2',
                        color: m.inStock ? '#166534' : '#b91c1c',
                      }}>
                        {m.inStock ? 'In stock' : 'OOS'}
                      </span>
                    </td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <button type="button" onClick={() => toggleStock(m)} style={{ ...btnOutline, marginRight: 4 }}>{m.inStock ? 'OOS' : 'Stock'}</button>
                      <button type="button" onClick={() => openEdit(m)} style={{ ...btnOutline, marginRight: 4, color: '#3b82f6' }}>Edit</button>
                      <button type="button" onClick={() => handleDelete(m)} style={{ ...btnOutline, color: '#ef4444', borderColor: '#fecaca' }}>Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 12 }} onClick={() => { setShowForm(false); setEditingId(null); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 480, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>{editingId ? 'Edit medicine' : 'Add medicine'}</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              <input placeholder="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input placeholder="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle} />
                <input placeholder="Manufacturer" value={form.manufacturer} onChange={e => setForm(f => ({ ...f, manufacturer: e.target.value }))} style={inputStyle} />
              </div>
              <input placeholder="Composition" value={form.composition} onChange={e => setForm(f => ({ ...f, composition: e.target.value }))} style={inputStyle} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input type="number" placeholder="Price ₹ *" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={inputStyle} />
                <input type="number" placeholder="MRP ₹" value={form.mrp} onChange={e => setForm(f => ({ ...f, mrp: e.target.value }))} style={inputStyle} />
              </div>
              <textarea rows={2} placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.requiresPrescription} onChange={e => setForm(f => ({ ...f, requiresPrescription: e.target.checked }))} />
                Requires prescription
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.checked }))} />
                In stock
              </label>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} style={btnOutline}>Cancel</button>
              <button type="button" disabled={saving} onClick={handleSave} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, fontSize: 12, cursor: saving ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                {saving ? '…' : (editingId ? 'Update' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-med-table { display: none !important; }
          .admin-med-cards { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

const th = { textAlign: 'left', padding: '10px 12px', fontSize: 11, color: '#64748b' };
const td = { padding: '10px 12px', verticalAlign: 'middle' };
const btnOutline = {
  padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff',
  cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#475569',
};
