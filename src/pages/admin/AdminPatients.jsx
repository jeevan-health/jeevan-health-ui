import { useState, useMemo } from 'react';
import usePatientsStore from '../../stores/patientsStore';
import { useT } from '../../i18n/LanguageProvider';
import EmptyState from '../../components/EmptyState';
import { confirmDialog } from '../../stores/dialogStore';

const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };
const sectionCard = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

function loadOrders() { try { return JSON.parse(localStorage.getItem('jeevan_orders') || '[]'); } catch { return []; } }
function loadBookings() { try { return JSON.parse(localStorage.getItem('jh_bookings') || '[]'); } catch { return []; } }

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function AdminPatients() {
  const t = useT();
  const TAG_OPTIONS = ['regular', 'new', 'diabetic', 'cardiac', 'senior', 'pregnant', 'follow-up', 'vip'];
  const patients = usePatientsStore(s => s.patients);
  const addPatient = usePatientsStore(s => s.addPatient);
  const updatePatient = usePatientsStore(s => s.updatePatient);
  const deletePatient = usePatientsStore(s => s.deletePatient);

  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewPt, setViewPt] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', dateOfBirth: '', gender: '', bloodGroup: '', address: '', city: '', notes: '', tags: [] });

  const resetForm = () => setForm({ name: '', phone: '', email: '', dateOfBirth: '', gender: '', bloodGroup: '', address: '', city: '', notes: '', tags: [] });

  const filtered = useMemo(() => {
    if (!search) return patients;
    const q = search.toLowerCase();
    return patients.filter(p => (p.name + p.phone + p.email + p.city).toLowerCase().includes(q));
  }, [patients, search]);

  const handleSave = () => {
    if (!form.name) return;
    if (editingId) { updatePatient(editingId, form); setEditingId(null); }
    else addPatient(form);
    setShowAdd(false);
    resetForm();
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, phone: p.phone || '', email: p.email || '', dateOfBirth: p.dateOfBirth || '', gender: p.gender || '', bloodGroup: p.bloodGroup || '', address: p.address || '', city: p.city || '', notes: p.notes || '', tags: p.tags || [] });
    setShowAdd(true);
  };

  const toggleTag = (tag) => {
    const t = form.tags.includes(tag) ? form.tags.filter(x => x !== tag) : [...form.tags, tag];
    setForm({ ...form, tags: t });
  };

  // Detail view
  if (viewPt) {
    const orders = loadOrders().filter(o => o.bookedFor === viewPt.name || o.patientInfo?.phone === viewPt.phone);
    const bookings = loadBookings().filter(b => b.patientName === viewPt.name || b.patientPhone === viewPt.phone);
    return (
      <div>
        <button onClick={() => setViewPt(null)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b', marginBottom: 16 }}>{t('admin.patients.back', '← Back to Patients')}</button>
        <div style={sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{viewPt.name}</h2>
              <div style={{ fontSize: 13, color: '#64748b' }}>{viewPt.phone}{viewPt.email ? ` | ${viewPt.email}` : ''}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {viewPt.gender && <span style={{ fontSize: 11, background: '#f1f5f9', padding: '3px 8px', borderRadius: 4, color: '#475569' }}>{viewPt.gender}</span>}
                {viewPt.bloodGroup && <span style={{ fontSize: 11, background: '#fef2f2', padding: '3px 8px', borderRadius: 4, color: '#dc2626', fontWeight: 600 }}>{viewPt.bloodGroup}</span>}
                {viewPt.dateOfBirth && <span style={{ fontSize: 11, background: '#f1f5f9', padding: '3px 8px', borderRadius: 4, color: '#475569' }}>{t('admin.patients.dob', 'DOB')}: {viewPt.dateOfBirth}</span>}
                {(viewPt.tags || []).map(t => <span key={t} style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: '#3b82f6', padding: '2px 8px', borderRadius: 4 }}>{t}</span>)}
              </div>
              {viewPt.address && <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>{viewPt.address}{viewPt.city ? `, ${viewPt.city}` : ''}</div>}
              {viewPt.notes && <div style={{ fontSize: 12, color: '#64748b', marginTop: 6, fontStyle: 'italic' }}>📝 {viewPt.notes}</div>}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => { handleEdit(viewPt); setViewPt(null); }} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#3b82f6' }}>{t('admin.patients.edit', 'Edit')}</button>
            </div>
          </div>
        </div>

        <div style={sectionCard}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>📋 {t('admin.patients.orders', 'Orders')} ({orders.length})</h4>
          {orders.length === 0 && <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{t('admin.patients.no_orders', 'No orders found.')}</p>}
          {orders.map(o => (
            <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 12 }}>
              <div><span style={{ fontWeight: 600 }}>{o.id}</span> — {Array.isArray(o.tests) ? o.tests.map(t => t.name || t).join(', ') : o.tests}</div>
              <div style={{ color: o.status === 'completed' ? '#22c55e' : o.status === 'cancelled' ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>{o.status} | ₹{o.totalAmount}</div>
            </div>
          ))}
        </div>

        <div style={sectionCard}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>📅 {t('admin.patients.bookings', 'Bookings')} ({bookings.length})</h4>
          {bookings.length === 0 && <EmptyState icon="👤" title="No patients found" message="No patients match your current view." />}
          {bookings.map(b => (
            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 12 }}>
              <div><span style={{ fontWeight: 600 }}>{b.id}</span> — {b.testName || '—'} | {b.date} {b.timeSlot}</div>
              <div style={{ color: b.status === 'completed' ? '#22c55e' : b.status === 'cancelled' ? '#ef4444' : '#3b82f6', fontWeight: 600 }}>{b.status}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>👤 {t('admin.patients.title', 'Patients')} ({patients.length})</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 220, fontSize: 12 }} placeholder={t('admin.patients.search_placeholder', '🔍 Search name/phone/email...')} />
          <button onClick={() => { setEditingId(null); resetForm(); setShowAdd(true); }} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>+ {t('admin.patients.add_patient', 'Add Patient')}</button>
        </div>
      </div>

      {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, padding: 40 }}>{t('admin.patients.no_patients', 'No patients found.')}</p>}
      {filtered.map(p => (
        <div key={p.id} style={sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, cursor: 'pointer' }} onClick={() => setViewPt(p)}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #1866C9, #1A7AD4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>{(p.name || '?')[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{p.name}</span>
                  {p.bloodGroup && <span style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', background: '#fef2f2', padding: '1px 6px', borderRadius: 4 }}>{p.bloodGroup}</span>}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{p.phone}{p.email ? ` · ${p.email}` : ''}{p.city ? ` · ${p.city}` : ''}</div>
                {(p.tags || []).length > 0 && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {p.tags.map(t => <span key={t} style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: '#3b82f6', padding: '1px 6px', borderRadius: 3 }}>{t}</span>)}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => { handleEdit(p); setViewPt(null); }} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#3b82f6' }}>{t('admin.patients.edit', 'Edit')}</button>
              <button onClick={() => setViewPt(p)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#64748b' }}>{t('admin.patients.view', 'View')}</button>
              <button onClick={async () => { if (await confirmDialog(`${t('admin.patients.delete_confirm', 'Delete')} ${p.name}?`)) deletePatient(p.id); }} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#ef4444' }}>{t('admin.patients.del', 'Del')}</button>
            </div>
          </div>
        </div>
      ))}

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => { setShowAdd(false); setEditingId(null); resetForm(); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 480, maxWidth: '90vw', maxHeight: '85vh', overflowY: 'auto' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{editingId ? t('admin.patients.edit_patient', 'Edit Patient') : t('admin.patients.add_patient', 'Add Patient')}</h4>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
              <input placeholder={t('admin.patients.name_req', 'Name *')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              <input placeholder={t('admin.patients.phone', 'Phone')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
              <input placeholder={t('admin.patients.email', 'Email')} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              <input type="date" placeholder={t('admin.patients.dob', 'DOB')} value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} style={inputStyle} />
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} style={inputStyle}>
                <option value="">{t('admin.patients.gender_select', '— Gender —')}</option>
                <option value="Male">{t('admin.patients.male', 'Male')}</option>
                <option value="Female">{t('admin.patients.female', 'Female')}</option>
                <option value="Other">{t('admin.patients.other', 'Other')}</option>
              </select>
              <select value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })} style={inputStyle}>
                <option value="">{t('admin.patients.blood_group_select', '— Blood Group —')}</option>
                {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <input placeholder={t('admin.patients.address', 'Address')} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ ...inputStyle, gridColumn: '1 / -1' }} />
              <input placeholder={t('admin.patients.city', 'City')} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 6 }}>{t('admin.patients.tags', 'Tags')}</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {TAG_OPTIONS.map(t => (
                  <button key={t} onClick={() => toggleTag(t)} style={{ padding: '3px 10px', borderRadius: 6, border: 'none', background: form.tags.includes(t) ? '#3b82f6' : '#f1f5f9', color: form.tags.includes(t) ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: form.tags.includes(t) ? 600 : 400 }}>{t}</button>
                ))}
              </div>
            </div>
            <textarea rows={2} placeholder={t('admin.patients.notes', 'Notes')} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, resize: 'vertical', marginTop: 10 }} />
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAdd(false); setEditingId(null); resetForm(); }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>{t('admin.patients.cancel', 'Cancel')}</button>
              <button onClick={handleSave} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>{editingId ? t('admin.patients.update', 'Update') : t('admin.patients.add_patient', 'Add Patient')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}