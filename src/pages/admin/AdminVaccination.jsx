import { useState, useEffect, useMemo } from 'react';
import { vaccineCategories as defaultCategories, vaccines as defaultVaccines } from '../../data/vaccinationData';

const STORAGE_KEY = 'jeevan_vaccinationAdmin';

const emptyVaccine = {
  id: 0, slug: '', category: 'baby', name: '', brand: '', manufacturer: '', disease: '',
  ageGroup: '', doseCount: 1, doseInterval: '', price: 0, gst: 5, description: '',
  fullDescription: '', benefits: [], sideEffects: [], whoShouldAvoid: [],
  ageRecommendation: '', schedule: [{ dose: 1, timing: '', route: 'IM' }],
  availability: 'Home & Clinic', seoTitle: '', seoDescription: '', faqs: [],
};

const emptyCategory = { id: '', name: '', age: '', icon: '💉', description: '', color: '#2563eb', slug: '' };

const Field = ({ label, value, onChange, type = 'text', placeholder, error }) => (
  <div style={{ marginBottom: 10 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: error ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
    {error && <p style={{ fontSize: 10, color: '#dc2626', margin: '2px 0 0' }}>{error}</p>}
  </div>
);

const Select = ({ label, value, onChange, options, error }) => (
  <div style={{ marginBottom: 10 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: error ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
      <option value="">-- Select --</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    {error && <p style={{ fontSize: 10, color: '#dc2626', margin: '2px 0 0' }}>{error}</p>}
  </div>
);

const TextArea = ({ label, value, onChange, rows = 3 }) => (
  <div style={{ marginBottom: 10 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{label}</label>
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
  </div>
);

const Label = ({ children }) => <div style={{ fontSize: 11, fontWeight: 700, color: '#1866C9', margin: '14px 0 6px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{children}</div>;

const ActionBtn = ({ label, onClick, color }) => (
  <button onClick={onClick}
    style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: color || '#1866C9', color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{label}</button>
);

export default function AdminVaccination() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({ vaccines: [], categories: [], bookings: [] });
  const [vaccineForm, setVaccineForm] = useState(emptyVaccine);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [editingId, setEditingId] = useState(null);
  const [activeSection, setActiveSection] = useState('basic');
  const [showVaccineForm, setShowVaccineForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [search, setSearch] = useState('');
  const [catSearch, setCatSearch] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      setData({
        vaccines: saved.vaccines || defaultVaccines,
        categories: saved.categories || defaultCategories,
        bookings: saved.bookings || [],
      });
    } catch { setData({ vaccines: defaultVaccines, categories: defaultCategories, bookings: [] }); }
  }, []);

  const persist = (key, val) => {
    const next = { ...data, [key]: val };
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const updateVaccineForm = (key, value) => setVaccineForm(f => ({ ...f, [key]: value }));
  const updateCategoryForm = (key, value) => setCategoryForm(f => ({ ...f, [key]: value }));

  const slugify = (name) => name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '';

  const filteredVaccines = useMemo(() => {
    const q = search.toLowerCase();
    return data.vaccines.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.disease.toLowerCase().includes(q) ||
      v.manufacturer?.toLowerCase().includes(q)
    );
  }, [data.vaccines, search]);

  const filteredCategories = useMemo(() => {
    const q = catSearch.toLowerCase();
    return data.categories.filter(c =>
      c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
    );
  }, [data.categories, catSearch]);

  const bookings = data.bookings || [];
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Quick Request').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.vaccinePrice || 0), 0);
  const lowStockVaccines = data.vaccines.filter(v => v.stock !== undefined && v.stock < 10).length;

  const vaccineFormSections = [
    { id: 'basic', label: 'Basic Info', icon: '🆔' },
    { id: 'clinical', label: 'Clinical Info', icon: '🩺' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'seo', label: 'SEO & FAQ', icon: '🔍' },
  ];

  const resetVaccineForm = () => {
    setVaccineForm(emptyVaccine);
    setEditingId(null);
    setActiveSection('basic');
  };

  const editVaccine = (v) => {
    setVaccineForm({ ...v, schedule: v.schedule || [{ dose: 1, timing: '', route: 'IM' }] });
    setEditingId(v.id);
    setShowVaccineForm(true);
    setActiveSection('basic');
  };

  const saveVaccine = () => {
    const v = vaccineForm;
    if (!v.name) return;
    let list = [...data.vaccines];
    if (editingId) {
      list = list.map(item => item.id === editingId ? { ...v, id: editingId } : item);
    } else {
      const maxId = Math.max(...list.map(x => x.id), 0);
      list.push({ ...v, id: maxId + 1, slug: slugify(v.name) });
    }
    persist('vaccines', list);
    setShowVaccineForm(false);
    resetVaccineForm();
  };

  const deleteVaccine = (id) => {
    if (!confirm('Delete this vaccine?')) return;
    persist('vaccines', data.vaccines.filter(v => v.id !== id));
  };

  const duplicateVaccine = (v) => {
    const maxId = Math.max(...data.vaccines.map(x => x.id), 0);
    const copy = { ...v, id: maxId + 1, name: v.name + ' (Copy)', slug: slugify(v.name + '-copy') };
    persist('vaccines', [...data.vaccines, copy]);
  };

  const saveCategory = () => {
    const c = categoryForm;
    if (!c.name) return;
    let list = [...data.categories];
    if (editingId) {
      list = list.map(item => item.id === editingId ? { ...c, id: editingId } : item);
    } else {
      list.push({ ...c, id: slugify(c.name), slug: slugify(c.name) });
    }
    persist('categories', list);
    setShowCategoryForm(false);
    setCategoryForm(emptyCategory);
    setEditingId(null);
  };

  const deleteCategory = (id) => {
    if (!confirm('Delete this category?')) return;
    persist('categories', data.categories.filter(c => c.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>💉 Vaccination Management</h2>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'vaccines', label: 'Vaccine Master' },
            { id: 'categories', label: 'Categories' },
            { id: 'bookings', label: 'Bookings' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: activeTab === tab.id ? '#1866C9' : '#e8edf2', color: activeTab === tab.id ? '#fff' : '#475569', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'Total Vaccines', value: data.vaccines.length, color: '#1866C9', icon: '💉' },
              { label: 'Total Bookings', value: totalBookings, color: '#059669', icon: '📋' },
              { label: 'Confirmed', value: confirmedBookings, color: '#16a34a', icon: '✅' },
              { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: '#7c3aed', icon: '💰' },
              { label: 'Categories', value: data.categories.length, color: '#d97706', icon: '📂' },
              { label: 'Low Stock Alerts', value: lowStockVaccines, color: '#dc2626', icon: '⚠️' },
            ].map(s => (
              <div key={s.label} style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>
          {bookings.length > 0 && (
            <div style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', marginBottom: 12 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>Recent Bookings</h4>
              {bookings.slice(-5).reverse().map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0', fontSize: 11 }}>
                  <span style={{ fontWeight: 600 }}>{b.vaccineName || b.vaccine}</span>
                  <span style={{ color: '#64748b' }}>{b.patientName || b.name} · {b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VACCINE MASTER */}
      {activeTab === 'vaccines' && !showVaccineForm && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, gap: 8, flexWrap: 'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vaccines by name, disease, manufacturer..."
              style={{ flex: 1, minWidth: 200, padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
            <button onClick={() => { resetVaccineForm(); setShowVaccineForm(true); }}
              style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#1866C9', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Vaccine</button>
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 700 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Name</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Disease</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Category</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Age Group</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#475569' }}>Price</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Doses</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVaccines.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{v.name}</td>
                    <td style={{ padding: '8px 10px', color: '#64748b' }}>{v.disease}</td>
                    <td style={{ padding: '8px 10px', color: '#64748b', textTransform: 'capitalize' }}>{v.category}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#475569' }}>{v.ageGroup}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>₹{v.price}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>{v.doseCount}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <ActionBtn label="Edit" onClick={() => editVaccine(v)} />
                        <ActionBtn label="Copy" onClick={() => duplicateVaccine(v)} color="#d97706" />
                        <ActionBtn label="Del" onClick={() => deleteVaccine(v.id)} color="#dc2626" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredVaccines.length === 0 && <p style={{ padding: 16, textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>No vaccines found.</p>}
          </div>
        </div>
      )}

      {/* VACCINE FORM */}
      {activeTab === 'vaccines' && showVaccineForm && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{editingId ? 'Edit' : 'Add'} Vaccine</h3>
            <button onClick={() => { setShowVaccineForm(false); resetVaccineForm(); }}
              style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>← Back to List</button>
          </div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 14, flexWrap: 'wrap' }}>
            {vaccineFormSections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: activeSection === s.id ? '#1866C9' : '#e8edf2', color: activeSection === s.id ? '#fff' : '#475569', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
          <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
            {activeSection === 'basic' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                <Label>Vaccine Identity</Label>
                <Field label="Vaccine Name *" value={vaccineForm.name} onChange={v => updateVaccineForm('name', v)} />
                <Field label="Brand Name" value={vaccineForm.brand} onChange={v => updateVaccineForm('brand', v)} />
                <Field label="Manufacturer" value={vaccineForm.manufacturer} onChange={v => updateVaccineForm('manufacturer', v)} />
                <Field label="Disease Prevented" value={vaccineForm.disease} onChange={v => updateVaccineForm('disease', v)} />
                <Select label="Category" value={vaccineForm.category} onChange={v => updateVaccineForm('category', v)}
                  options={data.categories.map(c => ({ value: c.id, label: c.name }))} />
                <Label>Availability</Label>
                <Select label="Service Type" value={vaccineForm.availability} onChange={v => updateVaccineForm('availability', v)}
                  options={[
                    { value: 'Home & Clinic', label: 'Home & Clinic' },
                    { value: 'Home Only', label: 'Home Only' },
                    { value: 'Clinic Only', label: 'Clinic Only' },
                  ]} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <TextArea label="Short Description" value={vaccineForm.description} onChange={v => updateVaccineForm('description', v)} rows={2} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <TextArea label="Full Description" value={vaccineForm.fullDescription} onChange={v => updateVaccineForm('fullDescription', v)} rows={3} />
                </div>
              </div>
            )}
            {activeSection === 'clinical' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                <Label>Clinical Information</Label>
                <Field label="Recommended Age" value={vaccineForm.ageGroup} onChange={v => updateVaccineForm('ageGroup', v)} placeholder="e.g. 9-45 Years" />
                <Field label="Age Recommendation Text" value={vaccineForm.ageRecommendation} onChange={v => updateVaccineForm('ageRecommendation', v)} />
                <Field label="Dose Interval" value={vaccineForm.doseInterval} onChange={v => updateVaccineForm('doseInterval', v)} placeholder="e.g. 6 months apart" />
                <Label>Benefits (one per line)</Label>
                <div style={{ gridColumn: '1 / -1' }}>
                  <TextArea label="" value={vaccineForm.benefits.join('\n')} onChange={v => updateVaccineForm('benefits', v.split('\n').filter(Boolean))} rows={3} />
                </div>
                <Label>Side Effects (one per line)</Label>
                <div style={{ gridColumn: '1 / -1' }}>
                  <TextArea label="" value={vaccineForm.sideEffects.join('\n')} onChange={v => updateVaccineForm('sideEffects', v.split('\n').filter(Boolean))} rows={2} />
                </div>
                <Label>Who Should Avoid (one per line)</Label>
                <div style={{ gridColumn: '1 / -1' }}>
                  <TextArea label="" value={vaccineForm.whoShouldAvoid.join('\n')} onChange={v => updateVaccineForm('whoShouldAvoid', v.split('\n').filter(Boolean))} rows={2} />
                </div>
              </div>
            )}
            {activeSection === 'pricing' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                <Label>Pricing</Label>
                <Field label="Price (₹) *" value={vaccineForm.price} onChange={v => updateVaccineForm('price', Number(v))} type="number" />
                <Field label="GST (%)" value={vaccineForm.gst} onChange={v => updateVaccineForm('gst', Number(v))} type="number" />
              </div>
            )}
            {activeSection === 'schedule' && (
              <div>
                <Label>Dose Schedule</Label>
                {vaccineForm.schedule.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, padding: 8, borderRadius: 6, background: '#f8fafc' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#1866C9', minWidth: 40 }}>Dose {d.dose}</span>
                    <input value={d.timing} onChange={e => {
                      const s = [...vaccineForm.schedule];
                      s[i] = { ...s[i], timing: e.target.value };
                      updateVaccineForm('schedule', s);
                    }} placeholder="Timing" style={{ flex: 1, padding: '6px 8px', borderRadius: 4, border: '1px solid #d0d5dd', fontSize: 11, fontFamily: 'inherit', outline: 'none' }} />
                    <select value={d.route} onChange={e => {
                      const s = [...vaccineForm.schedule];
                      s[i] = { ...s[i], route: e.target.value };
                      updateVaccineForm('schedule', s);
                    }} style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid #d0d5dd', fontSize: 11, fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
                      <option value="IM">IM</option>
                      <option value="SC">SC</option>
                      <option value="Oral">Oral</option>
                      <option value="Intradermal">Intradermal</option>
                    </select>
                    {vaccineForm.schedule.length > 1 && (
                      <button onClick={() => updateVaccineForm('schedule', vaccineForm.schedule.filter((_, idx) => idx !== i))}
                        style={{ padding: '4px 8px', borderRadius: 4, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>×</button>
                    )}
                  </div>
                ))}
                <button onClick={() => updateVaccineForm('schedule', [...vaccineForm.schedule, { dose: vaccineForm.schedule.length + 1, timing: '', route: 'IM' }])}
                  style={{ padding: '6px 14px', borderRadius: 6, border: '1px dashed #1866C9', background: '#fff', color: '#1866C9', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>+ Add Dose</button>
              </div>
            )}
            {activeSection === 'seo' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                <Label>SEO</Label>
                <Field label="SEO Title" value={vaccineForm.seoTitle} onChange={v => updateVaccineForm('seoTitle', v)} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <TextArea label="SEO Description" value={vaccineForm.seoDescription} onChange={v => updateVaccineForm('seoDescription', v)} rows={2} />
                </div>
                <Label>FAQs</Label>
                <div style={{ gridColumn: '1 / -1' }}>
                  {(vaccineForm.faqs || []).map((f, i) => (
                    <div key={i} style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 8, background: '#f8fafc' }}>
                      <input value={f.q} onChange={e => {
                        const faqs = [...(vaccineForm.faqs || [])];
                        faqs[i] = { ...faqs[i], q: e.target.value };
                        updateVaccineForm('faqs', faqs);
                      }} placeholder="Question" style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: '1px solid #d0d5dd', fontSize: 11, fontFamily: 'inherit', marginBottom: 4, outline: 'none', boxSizing: 'border-box' }} />
                      <textarea value={f.a} onChange={e => {
                        const faqs = [...(vaccineForm.faqs || [])];
                        faqs[i] = { ...faqs[i], a: e.target.value };
                        updateVaccineForm('faqs', faqs);
                      }} rows={2} placeholder="Answer" style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: '1px solid #d0d5dd', fontSize: 11, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                      <button onClick={() => updateVaccineForm('faqs', (vaccineForm.faqs || []).filter((_, idx) => idx !== i))}
                        style={{ padding: '3px 8px', borderRadius: 4, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: 10, marginTop: 4, fontFamily: 'inherit' }}>Remove</button>
                    </div>
                  ))}
                  <button onClick={() => updateVaccineForm('faqs', [...(vaccineForm.faqs || []), { q: '', a: '' }])}
                    style={{ padding: '6px 14px', borderRadius: 6, border: '1px dashed #1866C9', background: '#fff', color: '#1866C9', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>+ Add FAQ</button>
                </div>
              </div>
            )}
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button onClick={saveVaccine}
                style={{ padding: '8px 24px', borderRadius: 6, border: 'none', background: '#1866C9', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{editingId ? 'Update' : 'Save'} Vaccine</button>
              <button onClick={() => { setShowVaccineForm(false); resetVaccineForm(); }}
                style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORIES */}
      {activeTab === 'categories' && !showCategoryForm && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, gap: 8, flexWrap: 'wrap' }}>
            <input value={catSearch} onChange={e => setCatSearch(e.target.value)} placeholder="Search categories..."
              style={{ flex: 1, minWidth: 200, padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
            <button onClick={() => { setCategoryForm(emptyCategory); setEditingId(null); setShowCategoryForm(true); }}
              style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#1866C9', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Category</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {filteredCategories.map(c => (
              <div key={c.id} style={{ padding: 14, borderRadius: 10, border: `1px solid ${c.color}20`, background: '#fff', borderTop: `3px solid ${c.color}` }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{c.icon}</div>
                <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{c.name}</h4>
                <p style={{ fontSize: 11, color: c.color, fontWeight: 600, margin: '0 0 4px' }}>{c.age}</p>
                <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 8px', lineHeight: 1.4 }}>{c.description}</p>
                <p style={{ fontSize: 10, color: '#94a3b8', marginBottom: 6 }}>Slug: {c.slug}</p>
                <div style={{ display: 'flex', gap: 4 }}>
                  <ActionBtn label="Edit" onClick={() => { setCategoryForm(c); setEditingId(c.id); setShowCategoryForm(true); }} />
                  <ActionBtn label="Del" onClick={() => deleteCategory(c.id)} color="#dc2626" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORY FORM */}
      {activeTab === 'categories' && showCategoryForm && (
        <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', maxWidth: 500 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px' }}>{editingId ? 'Edit' : 'Add'} Category</h3>
          <Field label="Category Name *" value={categoryForm.name} onChange={v => updateCategoryForm('name', v)} />
          <Field label="Icon (emoji)" value={categoryForm.icon} onChange={v => updateCategoryForm('icon', v)} placeholder="e.g. 👶" />
          <Field label="Age Range" value={categoryForm.age} onChange={v => updateCategoryForm('age', v)} placeholder="e.g. 0-5 Years" />
          <Field label="Color (hex)" value={categoryForm.color} onChange={v => updateCategoryForm('color', v)} placeholder="e.g. #2563eb" />
          <TextArea label="Description" value={categoryForm.description} onChange={v => updateCategoryForm('description', v)} rows={2} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={saveCategory}
              style={{ padding: '8px 24px', borderRadius: 6, border: 'none', background: '#1866C9', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{editingId ? 'Update' : 'Save'} Category</button>
            <button onClick={() => { setShowCategoryForm(false); setCategoryForm(emptyCategory); setEditingId(null); }}
              style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* BOOKINGS */}
      {activeTab === 'bookings' && (
        <div>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 700 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Booking ID</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Patient</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Vaccine</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Date</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Amount</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>No bookings yet.</td></tr>
                )}
                {bookings.slice().reverse().map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, fontSize: 10, color: '#1866C9' }}>{b.id}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{b.patientName || b.name || '-'}</td>
                    <td style={{ padding: '8px 10px', color: '#475569' }}>{b.vaccineName || b.vaccine || '-'}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b' }}>{b.appointmentDate || b.date || '-'}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#059669' }}>₹{b.vaccinePrice || 0}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                        background: b.status === 'Confirmed' ? '#dcfce7' : b.status === 'Quick Request' ? '#fef3c7' : '#f1f5f9',
                        color: b.status === 'Confirmed' ? '#166534' : b.status === 'Quick Request' ? '#92400e' : '#475569' }}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
