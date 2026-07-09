import { useState, useEffect, useMemo } from 'react';
import { packageList } from '../../data/healthPackages';

const STORAGE_KEY = 'jeevan_healthPackages';
const TARGETS = [...new Set(packageList.map(p => p.target.split('|').map(s => s.trim())).flat())];
const STATUS_OPTIONS = ['Draft', 'Active', 'Inactive', 'Coming Soon'];

const emptyPkg = () => ({
  name: '', icon: '📋', color: '#2563eb', tagline: '', description: '',
  target: '', testCount: 0, mrp: 0, offerPrice: 0, discount: 0,
  rating: 4.5, bookings: '', reportTime: '24-48 hours',
  benefits: [''], whoShouldTake: [''], preparation: '', conditions: '',
  testsIncluded: [''], faqs: [{ q: '', a: '' }],
  metaTitle: '', metaDescription: '', keywords: '', status: 'Draft',
});

const loadData = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
};
const saveData = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export default function AdminHealthPackages() {
  const [extendedData, setExtendedData] = useState({});
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ target: 'all', status: 'all' });
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyPkg());
  const [activeSection, setActiveSection] = useState('identity');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { setExtendedData(loadData()); }, []);

  const allPackages = useMemo(() => {
    const seedMap = {};
    packageList.forEach(p => { seedMap[p.id] = p; });
    const ids = new Set([...packageList.map(p => p.id), ...Object.keys(extendedData)]);
    return Array.from(ids).map(id => {
      const base = seedMap[id] || {};
      const ext = extendedData[id];
      return { ...base, ...ext, id };
    }).filter(p => p.name);
  }, [packageList, extendedData]);

  const filtered = useMemo(() => allPackages.filter(p => {
    if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.target !== 'all' && !p.target?.includes(filters.target)) return false;
    if (filters.status !== 'all' && p.status !== filters.status) return false;
    return true;
  }), [allPackages, search, filters]);

  const persist = (id, data) => {
    const next = { ...extendedData, [id]: { ...extendedData[id], ...data } };
    setExtendedData(next);
    saveData(next);
  };

  const openEdit = (pkg) => {
    const mapped = {
      ...emptyPkg(),
      name: pkg.name || '',
      icon: pkg.icon || '📋',
      color: pkg.color || '#2563eb',
      tagline: pkg.tagline || '',
      description: pkg.description || '',
      target: pkg.target || '',
      testCount: pkg.testCount || 0,
      mrp: pkg.mrp || 0,
      offerPrice: pkg.offerPrice || 0,
      discount: pkg.discount || 0,
      rating: pkg.rating || 4.5,
      bookings: pkg.bookings || '',
      reportTime: pkg.reportTime || '24-48 hours',
      benefits: pkg.benefits?.length ? [...pkg.benefits] : [''],
      whoShouldTake: pkg.whoShouldTake?.length ? [...pkg.whoShouldTake] : [''],
      preparation: pkg.preparation || '',
      conditions: pkg.conditions || '',
      testsIncluded: pkg.testsIncluded?.length ? [...pkg.testsIncluded] : [''],
      faqs: pkg.faqs?.length ? pkg.faqs.map(f => ({ q: f.q || f.question || '', a: f.a || f.answer || '' })) : [{ q: '', a: '' }],
      metaTitle: pkg.metaTitle || '',
      metaDescription: pkg.metaDescription || '',
      keywords: pkg.keywords || '',
      status: pkg.status || 'Draft',
    };
    setForm(mapped);
    setEditingId(id);
    setActiveSection('identity');
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleSave = () => {
    const id = editingId || Date.now().toString();
    const data = { ...form };
    if (!data.name) { alert('Package name is required'); return; }
    persist(id, data);
    setShowForm(false);
    setEditingId(null);
  };

  const handleNew = () => {
    setForm(emptyPkg());
    setEditingId(null);
    setActiveSection('identity');
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this package?')) return;
    const next = { ...extendedData };
    delete next[id];
    setExtendedData(next);
    saveData(next);
  };

  const handleDuplicate = (pkg) => {
    const data = { ...pkg, name: pkg.name + ' (Copy)' };
    const id = Date.now().toString();
    persist(id, data);
  };

  const updateForm = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const updateArr = (key, idx, value) => {
    const arr = [...form[key]];
    arr[idx] = value;
    updateForm(key, arr);
  };
  const addArr = (key, empty) => updateForm(key, [...form[key], empty]);
  const removeArr = (key, idx) => updateForm(key, form[key].filter((_, i) => i !== idx));

  const sections = [
    { id: 'identity', label: 'Identity & Content', icon: '📝' },
    { id: 'benefits', label: 'Benefits & Targeting', icon: '🎯' },
    { id: 'tests', label: 'Tests & Pricing', icon: '💰' },
    { id: 'seo', label: 'SEO & Status', icon: '🔍' },
    { id: 'faqs', label: 'FAQ Management', icon: '❓' },
  ];

  if (showForm) return renderForm();
  return renderList();

  function renderForm() {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={() => setShowForm(false)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 }}>← Back</button>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#0f172a', flex: 1 }}>{editingId ? `Edit: ${form.name || 'New Package'}` : 'Add New Package'}</h2>
          <button onClick={handleSave} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#1866C9', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>💾 Save Package</button>
        </div>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 16, padding: '4px 0', borderBottom: '1px solid #e2e8f0' }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: activeSection === s.id ? '#1866C9' : '#f1f5f9', color: activeSection === s.id ? '#fff' : '#475569', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
          {activeSection === 'identity' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>SECTION 1: Identity & Content</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Package Name *" value={form.name} onChange={v => updateForm('name', v)} required />
                <Field label="Icon (emoji)" value={form.icon} onChange={v => updateForm('icon', v)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Field label="Color (hex)" value={form.color} onChange={v => updateForm('color', v)} placeholder="#2563eb" />
                <Field label="Rating" value={form.rating} onChange={v => updateForm('rating', Number(v))} type="number" />
                <Field label="Bookings" value={form.bookings} onChange={v => updateForm('bookings', v)} placeholder="10,000+" />
              </div>
              <Field label="Tagline" value={form.tagline} onChange={v => updateForm('tagline', v)} />
              <TextArea label="Description" value={form.description} onChange={v => updateForm('description', v)} rows={4} />
            </div>
          )}

          {activeSection === 'benefits' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>SECTION 2: Benefits & Targeting</h3>
              <Field label="Target Audience" value={form.target} onChange={v => updateForm('target', v)} placeholder="Healthy adults | Annual Screening" />
              <TextArea label="Preparation Instructions" value={form.preparation} onChange={v => updateForm('preparation', v)} rows={2} />
              <TextArea label="Conditions / Tags" value={form.conditions} onChange={v => updateForm('conditions', v)} rows={2} placeholder="Diabetes, Thyroid Disorders, Heart Disease" />
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <h4 style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', margin: 0 }}>Benefits</h4>
              {form.benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 6 }}>
                  <Field value={b} onChange={v => updateArr('benefits', i, v)} />
                  <button onClick={() => removeArr('benefits', i)} style={{ padding: '7px 10px', borderRadius: 6, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>✕</button>
                </div>
              ))}
              <button onClick={() => addArr('benefits', '')} style={{ padding: '8px 16px', borderRadius: 8, border: '2px dashed #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: 12, color: '#64748b', fontFamily: 'inherit' }}>+ Add Benefit</button>
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <h4 style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', margin: 0 }}>Who Should Take</h4>
              {form.whoShouldTake.map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: 6 }}>
                  <Field value={w} onChange={v => updateArr('whoShouldTake', i, v)} />
                  <button onClick={() => removeArr('whoShouldTake', i)} style={{ padding: '7px 10px', borderRadius: 6, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>✕</button>
                </div>
              ))}
              <button onClick={() => addArr('whoShouldTake', '')} style={{ padding: '8px 16px', borderRadius: 8, border: '2px dashed #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: 12, color: '#64748b', fontFamily: 'inherit' }}>+ Add Who Should Take</button>
            </div>
          )}

          {activeSection === 'tests' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>SECTION 3: Tests & Pricing</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Field label="MRP (₹)" value={form.mrp} onChange={v => updateForm('mrp', Number(v))} type="number" />
                <Field label="Offer Price (₹)" value={form.offerPrice} onChange={v => updateForm('offerPrice', Number(v))} type="number" />
                <Field label="Discount %" value={form.discount} onChange={v => updateForm('discount', Number(v))} type="number" />
              </div>
              {form.mrp > 0 && form.offerPrice > 0 && (
                <div style={{ padding: '10px 14px', background: form.discount > 0 ? '#ecfdf5' : '#fffbeb', borderRadius: 8, fontSize: 12 }}>
                  {form.discount > 0
                    ? `✅ You save ₹${form.mrp - form.offerPrice} (${form.discount}% off)`
                    : `ℹ️ Discount: ${Math.round((1 - form.offerPrice / form.mrp) * 100)}% — Update discount field to match`}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Test Count" value={form.testCount} onChange={v => updateForm('testCount', Number(v))} type="number" />
                <Field label="Report Time" value={form.reportTime} onChange={v => updateForm('reportTime', v)} placeholder="24-48 hours" />
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <h4 style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', margin: 0 }}>Tests Included ({form.testsIncluded.length})</h4>
              {form.testsIncluded.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 6 }}>
                  <Field value={t} onChange={v => updateArr('testsIncluded', i, v)} />
                  <button onClick={() => removeArr('testsIncluded', i)} style={{ padding: '7px 10px', borderRadius: 6, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>✕</button>
                </div>
              ))}
              <button onClick={() => addArr('testsIncluded', '')} style={{ padding: '8px 16px', borderRadius: 8, border: '2px dashed #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: 12, color: '#64748b', fontFamily: 'inherit' }}>+ Add Test</button>
            </div>
          )}

          {activeSection === 'seo' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>SECTION 4: SEO & Status</h3>
              <Field label="Meta Title" value={form.metaTitle} onChange={v => updateForm('metaTitle', v)} />
              <TextArea label="Meta Description" value={form.metaDescription} onChange={v => updateForm('metaDescription', v)} rows={2} />
              <TextArea label="Keywords (comma separated)" value={form.keywords} onChange={v => updateForm('keywords', v)} rows={2} />
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <h4 style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: 4 }}>Status</h4>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {STATUS_OPTIONS.map(s => {
                  const colors = { Draft: { bg: '#f1f5f9', text: '#64748b' }, Active: { bg: '#dcfce7', text: '#16a34a' }, Inactive: { bg: '#fee2e2', text: '#dc2626' }, 'Coming Soon': { bg: '#dbeafe', text: '#2563eb' } };
                  const c = colors[s] || { bg: '#f1f5f9', text: '#64748b' };
                  return (
                    <button key={s} onClick={() => updateForm('status', s)}
                      style={{ padding: '10px 18px', borderRadius: 10, border: `3px solid ${form.status === s ? c.text : '#e2e8f0'}`, background: form.status === s ? c.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', minWidth: 100 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: c.text }}>{s}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === 'faqs' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>SECTION 5: FAQ Management</h3>
              {form.faqs.map((f, i) => (
                <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: 14, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>FAQ #{i + 1}</span>
                    <button onClick={() => removeArr('faqs', i)} style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>Remove</button>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <Field label="Question" value={f.q} onChange={v => { const arr = [...form.faqs]; arr[i] = { ...arr[i], q: v }; updateForm('faqs', arr); }} />
                    <TextArea label="Answer" value={f.a} onChange={v => { const arr = [...form.faqs]; arr[i] = { ...arr[i], a: v }; updateForm('faqs', arr); }} rows={2} />
                  </div>
                </div>
              ))}
              <button onClick={() => addArr('faqs', { q: '', a: '' })}
                style={{ padding: '8px 16px', borderRadius: 8, border: '2px dashed #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: 12, color: '#64748b', fontFamily: 'inherit' }}>
                + Add FAQ
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderList() {
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>Health Packages</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Manage all {filtered.length} health packages — the complete package catalog</p>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 180, maxWidth: 280, fontSize: 13, padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontFamily: 'inherit', outline: 'none' }} />
          <select value={filters.target} onChange={e => setFilters({ ...filters, target: e.target.value })}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', background: '#fff' }}>
            <option value="all">All Targets</option>
            {TARGETS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', background: '#fff' }}>
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={handleNew} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1866C9', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>+ Add Package</button>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 650 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 11 }}>Package Name</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, color: '#64748b', fontSize: 11 }}>Tests</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 11 }}>Price</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 11 }}>Target</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, color: '#64748b', fontSize: 11 }}>Status</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, color: '#64748b', fontSize: 11 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const statusColor = { Draft: '#64748b', Active: '#16a34a', Inactive: '#dc2626', 'Coming Soon': '#2563eb' }[p.status] || '#64748b';
                const statusBg = { Draft: '#f1f5f9', Active: '#dcfce7', Inactive: '#fee2e2', 'Coming Soon': '#dbeafe' }[p.status] || '#f1f5f9';
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{p.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.name}</div>
                          <div style={{ fontSize: 10, color: '#94a3b8' }}>#{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>{p.testCount || p.testsIncluded?.length || '-'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>₹{p.offerPrice || p.mrp}</div>
                      {p.mrp > (p.offerPrice || p.mrp) && <div style={{ fontSize: 10, color: '#94a3b8', textDecoration: 'line-through' }}>₹{p.mrp}</div>}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#475569', fontSize: 11 }}>{p.target?.split('|')[0]?.trim() || '-'}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: statusBg, color: statusColor }}>{p.status || 'Active'}</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <ActionBtn label="View" color="#1866C9" onClick={() => openEdit(p)} />
                        <ActionBtn label="Copy" color="#7c3aed" onClick={() => handleDuplicate(p)} />
                        <ActionBtn label="Del" color="#dc2626" onClick={() => handleDelete(p.id)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No packages found matching your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

function Field({ label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <div style={{ flex: 1 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 3 }}>{label}{required && ' *'}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 3 }}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
    </div>
  );
}

function ActionBtn({ label, color, onClick }) {
  return (
    <button onClick={onClick}
      style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${color}30`, background: `${color}08`, color, cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
      {label}
    </button>
  );
}
