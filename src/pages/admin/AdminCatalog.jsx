import { useState, useEffect } from 'react';
import { useT } from '../../i18n/LanguageProvider';
import useAdminStore from '../../stores/adminStore';

const CATEGORIES = ['Hematology', 'Diabetes', 'Thyroid', 'Cardiac', 'Vitamins', 'Full Body', 'Anemia', 'Fever', 'Cancer', 'Hormones', 'Allergy', 'Arthritis', 'Pregnancy', 'Liver', 'STD'];

export default function AdminCatalog() {
  const t = useT();
  const getCatalog = useAdminStore(s => s.getCatalog);
  const saveTestOverride = useAdminStore(s => s.saveTestOverride);
  const addCustomTest = useAdminStore(s => s.addCustomTest);
  const resetCatalog = useAdminStore(s => s.resetCatalog);
  const [catalog, setCatalog] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', {t('admin.catalog.category', 'Category')}: 'Hematology', {t('admin.catalog.price', 'Price')}: 499, offer{t('admin.catalog.price', 'Price')}: 299, description: '', fasting_required: false, report_time: '24 hrs' });

  useEffect(() => { setCatalog(getCatalog()); }, []);

  const filtered = catalog.filter(t => {
    if (catFilter !== 'all' && t.{t('admin.catalog.category', 'Category')} !== catFilter) return false;
    return t.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleSave = (test) => {
    saveTestOverride(test.id, { name: editing.name, {t('admin.catalog.price', 'Price')}: Number(editing.{t('admin.catalog.price', 'Price')}), offer{t('admin.catalog.price', 'Price')}: Number(editing.offer{t('admin.catalog.price', 'Price')}), description: editing.description, {t('admin.catalog.category', 'Category')}: editing.{t('admin.catalog.category', 'Category')}, fasting_required: editing.fasting_required, report_time: editing.report_time });
    setEditing(null);
    setCatalog(getCatalog());
  };

  const handleAdd = () => {
    addCustomTest(addForm);
    setShowAdd(false);
    setAddForm({ name: '', {t('admin.catalog.category', 'Category')}: 'Hematology', {t('admin.catalog.price', 'Price')}: 499, offer{t('admin.catalog.price', 'Price')}: 299, description: '', fasting_required: false, report_time: '24 hrs' });
    setCatalog(getCatalog());
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="input" placeholder="Search tests..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, maxWidth: 300, fontSize: 13 }} />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', background: '#fff' }}>
          <option value="all">{t('admin.catalog.all_categories', 'All Categories')}</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => setShowAdd(true)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1866C9', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>+ {t('admin.catalog.add_test', 'Add Test')}</button>
        <button onClick={() => { if (confirm('Reset all catalog overrides?')) { resetCatalog(); setCatalog(getCatalog()); } }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#ef4444' }}>Reset</button>
        <span style={{ fontSize: 12, color: '#64748b' }}>{filtered.length} tests</span>
      </div>

      {/* Add Test Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: '90%', maxWidth: 480 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Add Custom Test</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <input className="input" placeholder="{t('admin.catalog.test_name', 'Test Name')}" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} />
              <select value={addForm.{t('admin.catalog.category', 'Category')}} onChange={e => setAddForm({ ...addForm, {t('admin.catalog.category', 'Category')}: e.target.value })} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontFamily: 'inherit', fontSize: 13 }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div style={{ display: 'flex', gap: 12 }}>
                <input className="input" placeholder="{t('admin.catalog.price', 'Price')}" type="number" value={addForm.{t('admin.catalog.price', 'Price')}} onChange={e => setAddForm({ ...addForm, {t('admin.catalog.price', 'Price')}: e.target.value })} style={{ flex: 1 }} />
                <input className="input" placeholder="Offer {t('admin.catalog.price', 'Price')}" type="number" value={addForm.offer{t('admin.catalog.price', 'Price')}} onChange={e => setAddForm({ ...addForm, offer{t('admin.catalog.price', 'Price')}: e.target.value })} style={{ flex: 1 }} />
              </div>
              <textarea className="input" placeholder="Description" value={addForm.description} onChange={e => setAddForm({ ...addForm, description: e.target.value })} style={{ minHeight: 60, resize: 'vertical' }} />
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={addForm.fasting_required} onChange={e => setAddForm({ ...addForm, fasting_required: e.target.checked })} /> Fasting required</label>
                <input className="input" placeholder="Report time (e.g. 6 hrs)" value={addForm.report_time} onChange={e => setAddForm({ ...addForm, report_time: e.target.value })} style={{ flex: 1 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>{t('admin.catalog.cancel', 'Cancel')}</button>
              <button onClick={handleAdd} disabled={!addForm.name} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1866C9', color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', opacity: addForm.name ? 1 : 0.5 }}>Add Test</button>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>No tests found</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.catalog.category', 'Category')}</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.catalog.price', 'Price')}</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Offer</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Fasting</th>
                <th style={{ textAlign: 'right', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Edit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: 12 }}>{t.id}{t._custom ? ' *' : ''}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</td>
                  <td style={{ padding: '10px 14px', color: '#334155', fontSize: 12 }}>{t.{t('admin.catalog.category', 'Category')}}</td>
                  <td style={{ padding: '10px 14px' }}>₹{t.{t('admin.catalog.price', 'Price')}}</td>
                  <td style={{ padding: '10px 14px' }}>{t.offer{t('admin.catalog.price', 'Price')} ? `₹${t.offer{t('admin.catalog.price', 'Price')}}` : '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontSize: 12 }}>{t.fasting_required ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <button onClick={() => setEditing(editing?.id === t.id ? null : { ...t })} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12 }}>
                      {editing?.id === t.id ? 'Cancel' : 'Edit'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit inline panel */}
      {editing && (
        <div style={{ marginTop: 24, background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Edit: {editing.name}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Name</label><input className="input" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} style={{ fontSize: 13 }} /></div>
            <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.catalog.category', 'Category')}</label>
              <select value={editing.{t('admin.catalog.category', 'Category')}} onChange={e => setEditing({ ...editing, {t('admin.catalog.category', 'Category')}: e.target.value })} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontFamily: 'inherit', fontSize: 13, width: '100%' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.catalog.price', 'Price')}</label><input className="input" type="number" value={editing.{t('admin.catalog.price', 'Price')}} onChange={e => setEditing({ ...editing, {t('admin.catalog.price', 'Price')}: e.target.value })} style={{ fontSize: 13 }} /></div>
            <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Offer {t('admin.catalog.price', 'Price')}</label><input className="input" type="number" value={editing.offer{t('admin.catalog.price', 'Price')} || ''} onChange={e => setEditing({ ...editing, offer{t('admin.catalog.price', 'Price')}: e.target.value })} style={{ fontSize: 13 }} /></div>
            <div style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Description</label><textarea className="input" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} style={{ minHeight: 60, fontSize: 13, resize: 'vertical' }} /></div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={editing.fasting_required} onChange={e => setEditing({ ...editing, fasting_required: e.target.checked })} /> Fasting required</label>
            </div>
            <div><label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Report Time</label><input className="input" value={editing.report_time} onChange={e => setEditing({ ...editing, report_time: e.target.value })} style={{ fontSize: 13 }} /></div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={() => handleSave(editing)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#1866C9', color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Save Changes</button>
            <button onClick={() => setEditing(null)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>{t('admin.catalog.cancel', 'Cancel')}</button>
          </div>
        </div>
      )}
    </div>
  );
}