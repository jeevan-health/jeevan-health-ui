import { useState, useEffect, useCallback, useMemo } from 'react';
import { SPECIALTIES, DAYS } from '../../stores/doctorsStore';
import * as adminService from '../../services/adminService';
import { useT } from '../../i18n/LanguageProvider';

const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };
const sectionCard = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const MODES = ['online', 'clinic', 'home'];

const emptyForm = () => ({
  name: '', phone: '', email: '', specializations: [], qualifications: '', experience: '', consultationFee: '',
  availableDays: [], availableTimeSlots: [], consultationModes: [], bio: '', image: '',
});

/**
 * Live Neon doctors via GET/POST/PUT/DELETE /admin/doctors.
 * Public consult-doctor list uses the same doctors table.
 */
export default function AdminDoctors() {
  const t = useT();
  const MODE_LABELS = {
    online: t('admin.doctors.online', '🖥️ Online'),
    clinic: t('admin.doctors.clinic', '🏥 Clinic'),
    home: t('admin.doctors.home_visit', '🏠 Home Visit'),
  };

  const [doctors, setDoctors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewDr, setViewDr] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminService.listDoctors({
        search: search || undefined,
        specialty: specFilter || undefined,
        limit: 200,
      });
      setDoctors(data.doctors || []);
      setTotal(data.total ?? (data.doctors || []).length);
    } catch (err) {
      setError(err?.response?.data?.error || t('admin.doctors.loadError', 'Failed to load doctors. Deploy API with /admin/doctors routes.'));
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [search, specFilter, t]);

  useEffect(() => {
    const tmr = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(tmr);
  }, [load, search]);

  const resetForm = () => setForm(emptyForm());

  const handleSave = async () => {
    if (!form.name?.trim()) return;
    setSaving(true);
    setError('');
    const payload = {
      name: form.name.trim(),
      phone: form.phone,
      email: form.email,
      specializations: form.specializations || [],
      qualifications: form.qualifications.split('\n').map(s => s.trim()).filter(Boolean),
      experience: Number(form.experience) || 0,
      consultationFee: Number(form.consultationFee) || 0,
      availableDays: form.availableDays || [],
      availableTimeSlots: form.availableTimeSlots || [],
      consultationModes: form.consultationModes || [],
      bio: form.bio,
      about: form.bio,
      image: form.image || null,
    };
    try {
      if (editingId) {
        await adminService.updateDoctor(editingId, payload);
      } else {
        await adminService.createDoctor(payload);
      }
      setShowAdd(false);
      setEditingId(null);
      resetForm();
      await load();
    } catch (err) {
      setError(err?.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({
      name: d.name || '',
      phone: d.phone || '',
      email: d.email || '',
      specializations: d.specializations || (d.specialty ? [d.specialty] : []),
      qualifications: (d.qualifications || []).join('\n'),
      experience: String(d.experience || ''),
      consultationFee: String(d.consultationFee ?? d.fees ?? ''),
      availableDays: d.availableDays || [],
      availableTimeSlots: d.availableTimeSlots || [],
      consultationModes: d.consultationModes || [],
      bio: d.bio || d.about || '',
      image: d.image || '',
    });
    setShowAdd(true);
  };

  const toggleActive = async (d) => {
    try {
      await adminService.updateDoctor(d.id, { isActive: !d.isActive });
      await load();
      if (viewDr?.id === d.id) {
        setViewDr({ ...d, isActive: !d.isActive, isAvailable: !d.isActive });
      }
    } catch (err) {
      alert(err?.response?.data?.error || 'Update failed');
    }
  };

  const handleDelete = async (d) => {
    if (!confirm(`${t('admin.doctors.delete_confirm', 'Delete')} ${d.name}?`)) return;
    try {
      await adminService.deleteDoctor(d.id);
      if (viewDr?.id === d.id) setViewDr(null);
      await load();
    } catch (err) {
      alert(err?.response?.data?.error || 'Delete failed');
    }
  };

  const toggleArrayField = (field, value) => {
    const arr = form[field] || [];
    setForm({ ...form, [field]: arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value] });
  };

  const allSpecs = useMemo(
    () => [...new Set([...SPECIALTIES, ...doctors.flatMap(d => d.specializations || [])])],
    [doctors]
  );

  if (viewDr) {
    const d = viewDr;
    return (
      <div>
        <button type="button" onClick={() => setViewDr(null)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b', marginBottom: 16 }}>
          {t('admin.doctors.back', '← Back to Doctors')}
        </button>
        <div style={sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #1866C9, #1A7AD4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, flexShrink: 0 }}>
                {(d.name || '?')[0]}
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{d.name}</h2>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {(d.specializations || []).join(', ')} | {(d.qualifications || []).join(', ')} | {d.experience} {t('admin.doctors.yrs_exp', 'yrs exp')}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{d.phone}{d.email ? ` | ${d.email}` : ''}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>₹{d.consultationFee ?? d.fees}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{t('admin.doctors.consultation_fee', 'Consultation Fee')}</div>
              <button type="button" onClick={() => { handleEdit(d); setViewDr(null); }} style={{ marginTop: 8, padding: '5px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#3b82f6' }}>
                {t('admin.doctors.edit', 'Edit')}
              </button>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }} className="admin-doc-detail-grid">
          <div style={sectionCard}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>📅 {t('admin.doctors.availability', 'Availability')}</h4>
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
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>🩺 {t('admin.doctors.consultation_modes', 'Consultation Modes')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {MODES.map(m => (
                <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: (d.consultationModes || []).includes(m) ? '#0f172a' : '#94a3b8' }}>
                  <span style={{ fontSize: 14 }}>{(d.consultationModes || []).includes(m) ? '✅' : '❌'}</span> {MODE_LABELS[m]}
                </div>
              ))}
            </div>
          </div>
        </div>
        {(d.bio || d.about) && (
          <div style={sectionCard}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>📝 {t('admin.doctors.bio', 'Bio')}</h4>
            <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.6 }}>{d.bio || d.about}</p>
          </div>
        )}
        <style>{`@media (max-width: 640px) { .admin-doc-detail-grid { grid-template-columns: 1fr !important; } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>🩺 {t('admin.doctors.title', 'Doctors')} ({total})</div>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
            {t('admin.doctors.liveHint', 'Live Neon data — same catalog as patient Consult Doctor.')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 200, fontSize: 12 }} placeholder={t('admin.doctors.search_placeholder', '🔍 Search...')} />
          <select value={specFilter} onChange={e => setSpecFilter(e.target.value)} style={{ ...inputStyle, width: 160, fontSize: 12 }}>
            <option value="">{t('admin.doctors.all_specialties', 'All Specialties')}</option>
            {allSpecs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="button" onClick={load} className="btn btn-outline btn-sm" style={{ minHeight: 40 }}>Refresh</button>
          <button type="button" onClick={() => { setEditingId(null); resetForm(); setShowAdd(true); }} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600, minHeight: 40 }}>
            + {t('admin.doctors.add_doctor', 'Add Doctor')}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: 12, borderRadius: 10, background: '#FEF2F2', color: '#b91c1c', fontSize: 13, marginBottom: 12 }}>{error}</div>
      )}
      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading…</div>}
      {!loading && doctors.length === 0 && (
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, padding: 40 }}>{t('admin.doctors.no_doctors', 'No doctors found.')}</p>
      )}

      {!loading && doctors.map(d => (
        <div key={d.id} style={sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, cursor: 'pointer', minWidth: 0 }} onClick={() => setViewDr(d)} onKeyDown={e => e.key === 'Enter' && setViewDr(d)} role="button" tabIndex={0}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #1866C9, #1A7AD4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, flexShrink: 0 }}>
                {(d.name || '?')[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{d.name}</span>
                  {!d.isActive && <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: '#64748b', padding: '1px 6px', borderRadius: 3 }}>{t('admin.doctors.inactive', 'Inactive')}</span>}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                  {(d.specializations || []).join(', ')} | {(d.qualifications || []).join(', ')} | {d.experience}{t('admin.doctors.yrs', 'yrs')}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>₹{d.consultationFee ?? d.fees} {t('admin.doctors.fee', 'fee')}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => toggleActive(d)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: d.isActive ? '#f59e0b' : '#22c55e' }}>
                {d.isActive ? t('admin.doctors.deactivate', 'Deactivate') : t('admin.doctors.activate', 'Activate')}
              </button>
              <button type="button" onClick={() => handleEdit(d)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#3b82f6' }}>
                {t('admin.doctors.edit', 'Edit')}
              </button>
              <button type="button" onClick={() => setViewDr(d)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#64748b' }}>
                {t('admin.doctors.view', 'View')}
              </button>
              <button type="button" onClick={() => handleDelete(d)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#ef4444' }}>
                {t('admin.doctors.del', 'Del')}
              </button>
            </div>
          </div>
        </div>
      ))}

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 12 }} onClick={() => { setShowAdd(false); setEditingId(null); resetForm(); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 520, maxWidth: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
              {editingId ? t('admin.doctors.edit_doctor', 'Edit Doctor') : t('admin.doctors.add_doctor', 'Add Doctor')}
            </h4>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
              <input placeholder={t('admin.doctors.full_name_req', 'Full Name *')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              <input placeholder={t('admin.doctors.phone', 'Phone')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
              <input placeholder={t('admin.doctors.email', 'Email')} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              <input type="number" placeholder={t('admin.doctors.years_exp', 'Years of Experience')} value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} style={inputStyle} />
              <input type="number" placeholder={t('admin.doctors.consultation_fee_placeholder', 'Consultation Fee (₹)')} value={form.consultationFee} onChange={e => setForm({ ...form, consultationFee: e.target.value })} style={inputStyle} />
              <input placeholder={t('admin.doctors.profile_image_url', 'Profile image URL')} value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} style={inputStyle} />
            </div>
            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginTop: 10, marginBottom: 4 }}>{t('admin.doctors.specializations', 'Specializations (tap to toggle)')}</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
              {allSpecs.map(s => (
                <button type="button" key={s} onClick={() => toggleArrayField('specializations', s)} style={{ padding: '3px 10px', borderRadius: 6, border: 'none', background: (form.specializations || []).includes(s) ? '#1866C9' : '#f1f5f9', color: (form.specializations || []).includes(s) ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: (form.specializations || []).includes(s) ? 600 : 400 }}>{s}</button>
              ))}
            </div>
            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.doctors.available_days', 'Available Days')}</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
              {DAYS.map(day => (
                <button type="button" key={day} onClick={() => toggleArrayField('availableDays', day)} style={{ padding: '3px 10px', borderRadius: 6, border: 'none', background: (form.availableDays || []).includes(day) ? '#22c55e' : '#f1f5f9', color: (form.availableDays || []).includes(day) ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: (form.availableDays || []).includes(day) ? 600 : 400 }}>{day.slice(0, 3)}</button>
              ))}
            </div>
            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.doctors.consultation_modes', 'Consultation Modes')}</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
              {MODES.map(m => (
                <button type="button" key={m} onClick={() => toggleArrayField('consultationModes', m)} style={{ padding: '3px 10px', borderRadius: 6, border: 'none', background: (form.consultationModes || []).includes(m) ? '#8b5cf6' : '#f1f5f9', color: (form.consultationModes || []).includes(m) ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: (form.consultationModes || []).includes(m) ? 600 : 400 }}>{MODE_LABELS[m]}</button>
              ))}
            </div>
            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.doctors.time_slots', 'Time Slots (one per line)')}</label>
            <textarea rows={2} placeholder={'9:00 AM - 11:00 AM\n4:00 PM - 6:00 PM'} value={(form.availableTimeSlots || []).join('\n')} onChange={e => setForm({ ...form, availableTimeSlots: e.target.value.split('\n').filter(Boolean) })} style={{ ...inputStyle, resize: 'vertical', marginBottom: 10 }} />
            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.doctors.qualifications', 'Qualifications (one per line)')}</label>
            <textarea rows={2} placeholder={'MBBS\nMD - General Medicine'} value={form.qualifications} onChange={e => setForm({ ...form, qualifications: e.target.value })} style={{ ...inputStyle, resize: 'vertical', marginBottom: 10 }} />
            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.doctors.bio', 'Bio')}</label>
            <textarea rows={3} placeholder={t('admin.doctors.bio_placeholder', 'Short professional bio...')} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => { setShowAdd(false); setEditingId(null); resetForm(); }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>{t('admin.doctors.cancel', 'Cancel')}</button>
              <button type="button" disabled={saving} onClick={handleSave} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: saving ? 'wait' : 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>
                {saving ? '…' : (editingId ? t('admin.doctors.update', 'Update') : t('admin.doctors.add_doctor', 'Add Doctor'))}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
