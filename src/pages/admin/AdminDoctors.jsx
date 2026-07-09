import { useState, useMemo } from 'react';
import useDoctorsStore, { SPECIALTIES, DAYS } from '../../stores/doctorsStore';

const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };
const sectionCard = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const MODES = ['online', 'clinic', 'home'];
const MODE_LABELS = { online: '🖥️ Online', clinic: '🏥 Clinic', home: '🏠 Home Visit' };

export default function AdminDoctors() {
  const doctors = useDoctorsStore(s => s.doctors);
  const addDoctor = useDoctorsStore(s => s.addDoctor);
  const updateDoctor = useDoctorsStore(s => s.updateDoctor);
  const deleteDoctor = useDoctorsStore(s => s.deleteDoctor);

  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewDr, setViewDr] = useState(null);

  const [form, setForm] = useState({
    name: '', phone: '', email: '', specializations: [], qualifications: '', experience: '', consultationFee: '',
    availableDays: [], availableTimeSlots: [], consultationModes: [], bio: '', image: '',
  });

  const resetForm = () => setForm({
    name: '', phone: '', email: '', specializations: [], qualifications: '', experience: '', consultationFee: '',
    availableDays: [], availableTimeSlots: [], consultationModes: [], bio: '', image: '',
  });

  const filtered = useMemo(() => {
    let d = doctors;
    if (search) { const q = search.toLowerCase(); d = d.filter(x => (x.name + x.phone + x.email + (x.specializations || []).join(' ')).toLowerCase().includes(q)); }
    if (specFilter) d = d.filter(x => (x.specializations || []).includes(specFilter));
    return d;
  }, [doctors, search, specFilter]);

  const handleSave = () => {
    if (!form.name) return;
    const data = { ...form, qualifications: form.qualifications.split('\n').filter(Boolean), experience: Number(form.experience) || 0, consultationFee: Number(form.consultationFee) || 0 };
    if (editingId) { updateDoctor(editingId, data); setEditingId(null); }
    else addDoctor(data);
    setShowAdd(false);
    resetForm();
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({
      name: d.name, phone: d.phone || '', email: d.email || '',
      specializations: d.specializations || [], qualifications: (d.qualifications || []).join('\n'),
      experience: String(d.experience || ''), consultationFee: String(d.consultationFee || ''),
      availableDays: d.availableDays || [], availableTimeSlots: d.availableTimeSlots || [],
      consultationModes: d.consultationModes || [], bio: d.bio || '', image: d.image || '',
    });
    setShowAdd(true);
  };

  const toggleArrayField = (field, value) => {
    const arr = form[field] || [];
    setForm({ ...form, [field]: arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value] });
  };

  const allSpecs = [...new Set([...SPECIALTIES, ...doctors.flatMap(d => d.specializations || [])])];

  // Detail view
  if (viewDr) {
    const d = viewDr;
    return (
      <div>
        <button onClick={() => setViewDr(null)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b', marginBottom: 16 }}>← Back to Doctors</button>
        <div style={sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #1866C9, #1A7AD4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, flexShrink: 0 }}>{(d.name || '?')[0]}</div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{d.name}</h2>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {(d.specializations || []).join(', ')} | {(d.qualifications || []).join(', ')} | {d.experience} yrs exp
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{d.phone}{d.email ? ` | ${d.email}` : ''}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>₹{d.consultationFee}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Consultation Fee</div>
              <button onClick={() => { handleEdit(d); setViewDr(null); }} style={{ marginTop: 8, padding: '5px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#3b82f6' }}>Edit</button>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
          <div style={sectionCard}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>📅 Availability</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {DAYS.map(day => (
                <span key={day} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: (d.availableDays || []).includes(day) ? '#22c55e' : '#f1f5f9', color: (d.availableDays || []).includes(day) ? '#fff' : '#94a3b8', fontWeight: 600 }}>{day.slice(0, 3)}</span>
              ))}
            </div>
            {(d.availableTimeSlots || []).length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {(d.availableTimeSlots || []).map(s => <div key={s} style={{ fontSize: 12, color: '#0f172a', padding: '4px 8px', background: '#f1f5f9', borderRadius: 4 }}>{s}</div>)}
              </div>
            )}
          </div>
          <div style={sectionCard}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>🩺 Consultation Modes</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {MODES.map(m => (
                <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: (d.consultationModes || []).includes(m) ? '#0f172a' : '#94a3b8' }}>
                  <span style={{ fontSize: 14 }}>{(d.consultationModes || []).includes(m) ? '✅' : '❌'}</span> {MODE_LABELS[m]}
                </div>
              ))}
            </div>
          </div>
        </div>
        {d.bio && (
          <div style={sectionCard}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>📝 Bio</h4>
            <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.6 }}>{d.bio}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>🩺 Doctors ({doctors.length})</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 200, fontSize: 12 }} placeholder="🔍 Search..." />
          <select value={specFilter} onChange={e => setSpecFilter(e.target.value)} style={{ ...inputStyle, width: 160, fontSize: 12 }}>
            <option value="">All Specialties</option>
            {allSpecs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => { setEditingId(null); resetForm(); setShowAdd(true); }} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>+ Add Doctor</button>
        </div>
      </div>

      {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, padding: 40 }}>No doctors found.</p>}
      {filtered.map(d => (
        <div key={d.id} style={sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, cursor: 'pointer' }} onClick={() => setViewDr(d)}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #1866C9, #1A7AD4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, flexShrink: 0 }}>{(d.name || '?')[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{d.name}</span>
                  {!d.isActive && <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: '#64748b', padding: '1px 6px', borderRadius: 3 }}>Inactive</span>}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                  {(d.specializations || []).join(', ')} | {(d.qualifications || []).join(', ')} | {d.experience}yrs
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>₹{d.consultationFee} fee</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <button onClick={() => updateDoctor(d.id, { isActive: !d.isActive })} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: d.isActive ? '#f59e0b' : '#22c55e' }}>{d.isActive ? 'Deactivate' : 'Activate'}</button>
              <button onClick={() => { handleEdit(d); }} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#3b82f6' }}>Edit</button>
              <button onClick={() => setViewDr(d)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#64748b' }}>View</button>
              <button onClick={() => { if (confirm(`Delete ${d.name}?`)) deleteDoctor(d.id); }} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#ef4444' }}>Del</button>
            </div>
          </div>
        </div>
      ))}

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => { setShowAdd(false); setEditingId(null); resetForm(); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 520, maxWidth: '90vw', maxHeight: '85vh', overflowY: 'auto' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{editingId ? 'Edit Doctor' : 'Add Doctor'}</h4>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
              <input placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
              <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              <input type="number" placeholder="Years of Experience" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} style={inputStyle} />
              <input type="number" placeholder="Consultation Fee (₹)" value={form.consultationFee} onChange={e => setForm({ ...form, consultationFee: e.target.value })} style={inputStyle} />
              <input placeholder="Profile image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} style={inputStyle} />
            </div>
            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginTop: 10, marginBottom: 4 }}>Specializations (tap to toggle)</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
              {allSpecs.map(s => (
                <button key={s} onClick={() => toggleArrayField('specializations', s)} style={{ padding: '3px 10px', borderRadius: 6, border: 'none', background: (form.specializations || []).includes(s) ? '#1866C9' : '#f1f5f9', color: (form.specializations || []).includes(s) ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: (form.specializations || []).includes(s) ? 600 : 400 }}>{s}</button>
              ))}
            </div>
            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Available Days</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
              {DAYS.map(day => (
                <button key={day} onClick={() => toggleArrayField('availableDays', day)} style={{ padding: '3px 10px', borderRadius: 6, border: 'none', background: (form.availableDays || []).includes(day) ? '#22c55e' : '#f1f5f9', color: (form.availableDays || []).includes(day) ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: (form.availableDays || []).includes(day) ? 600 : 400 }}>{day.slice(0, 3)}</button>
              ))}
            </div>
            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Consultation Modes</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
              {MODES.map(m => (
                <button key={m} onClick={() => toggleArrayField('consultationModes', m)} style={{ padding: '3px 10px', borderRadius: 6, border: 'none', background: (form.consultationModes || []).includes(m) ? '#8b5cf6' : '#f1f5f9', color: (form.consultationModes || []).includes(m) ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: (form.consultationModes || []).includes(m) ? 600 : 400 }}>{MODE_LABELS[m]}</button>
              ))}
            </div>
            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Time Slots (one per line)</label>
            <textarea rows={2} placeholder="9:00 AM - 11:00 AM&#10;4:00 PM - 6:00 PM" value={(form.availableTimeSlots || []).join('\n')} onChange={e => setForm({ ...form, availableTimeSlots: e.target.value.split('\n').filter(Boolean) })} style={{ ...inputStyle, resize: 'vertical', marginBottom: 10 }} />
            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Qualifications (one per line)</label>
            <textarea rows={2} placeholder="MBBS&#10;MD - General Medicine" value={form.qualifications} onChange={e => setForm({ ...form, qualifications: e.target.value })} style={{ ...inputStyle, resize: 'vertical', marginBottom: 10 }} />
            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Bio</label>
            <textarea rows={3} placeholder="Short professional bio..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAdd(false); setEditingId(null); resetForm(); }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>{editingId ? 'Update' : 'Add Doctor'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}