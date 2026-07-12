import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/LanguageProvider';
import EmptyState from '../../components/EmptyState';
import { physioCategories, therapists as defaultTherapists, physioPackages, STORAGE_KEYS } from '../../data/physiotherapyData';
import { confirmDialog } from '../../stores/dialogStore';

const emptyTherapist = {
  id: 0, name: '', qualifications: '', experience: 0, specialties: [],
  rating: 4.5, sessions: 0, image: '👨‍⚕️', languages: ['English', 'Hindi'],
  mode: ['home', 'clinic', 'online'], isActive: true,
};

const emptyExercise = {
  id: 0, name: '', description: '', category: '', videoUrl: '',
};

const ActionBtn = ({ label, onClick, color }) => (
  <button onClick={onClick}
    style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: color || '#1866C9', color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{label}</button>
);

const Field = ({ label, value, onChange, type = 'text', placeholder, error }) => (
  <div style={{ marginBottom: 10 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: error ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
    {error && <p style={{ fontSize: 10, color: '#dc2626', margin: '2px 0 0' }}>{error}</p>}
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 10 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
      <option value="">-- Select --</option>
      {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
    </select>
  </div>
);

const TextArea = ({ label, value, onChange, rows = 3 }) => (
  <div style={{ marginBottom: 10 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{label}</label>
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, minWidth: 420, maxWidth: 520, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0f172a' }}>{title}</h3>
        <button onClick={onClose} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const loadData = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
};

const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export default function AdminPhysiotherapy() {
  const t = useT();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [leads, setLeads] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [packages, setPackages] = useState(physioPackages);

  const [bookingFilter, setBookingFilter] = useState('all');
  const [searchBooking, setSearchBooking] = useState('');

  const [showTherapistModal, setShowTherapistModal] = useState(false);
  const [therapistForm, setTherapistForm] = useState(emptyTherapist);
  const [editingTherapistId, setEditingTherapistId] = useState(null);

  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseForm, setExerciseForm] = useState(emptyExercise);
  const [editingExerciseId, setEditingExerciseId] = useState(null);

  const [editPackageId, setEditPackageId] = useState(null);
  const [editPackagePrice, setEditPackagePrice] = useState(0);

  useEffect(() => {
    setBookings(loadData(STORAGE_KEYS.BOOKINGS, []));
    setTherapists(loadData(STORAGE_KEYS.THERAPISTS, defaultTherapists));
    setLeads(loadData(STORAGE_KEYS.LEADS, []));
    setExercises(loadData(STORAGE_KEYS.EXERCISES, []));
  }, []);

  const activeTherapists = therapists.filter(t => t.isActive !== false);
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAppointments = bookings.filter(b => b.date === todayStr).length;
  const pendingVisits = bookings.filter(b => b.status === 'confirmed' || b.status === 'in-progress').length;

  const statusColors = {
    pending: { bg: '#fef3c7', text: '#92400e' },
    confirmed: { bg: '#dbeafe', text: '#1e40af' },
    'in-progress': { bg: '#dcfce7', text: '#166534' },
    completed: { bg: '#e0e7ff', text: '#3730a3' },
    cancelled: { bg: '#fee2e2', text: '#991b1b' },
  };

  const updateBookingStatus = (id, status) => {
    const next = bookings.map(b => b.id === id ? { ...b, status } : b);
    setBookings(next);
    saveData(STORAGE_KEYS.BOOKINGS, next);
  };

  const filteredBookings = bookings.filter(b => {
    if (bookingFilter !== 'all' && b.status !== bookingFilter) return false;
    if (searchBooking) {
      const q = searchBooking.toLowerCase();
      if (!(b.patientName || b.name || '').toLowerCase().includes(q) &&
          !(b.condition || '').toLowerCase().includes(q) &&
          !(b.id || '').toString().toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const openTherapistModal = (th) => {
    setTherapistForm(th ? { ...emptyTherapist, ...th } : emptyTherapist);
    setEditingTherapistId(th ? th.id : null);
    setShowTherapistModal(true);
  };

  const saveTherapist = () => {
    const th = therapistForm;
    if (!th.name) return;
    let list = [...therapists];
    if (editingTherapistId) {
      list = list.map(item => item.id === editingTherapistId ? { ...th, id: editingTherapistId } : item);
    } else {
      const maxId = Math.max(...list.map(x => x.id), 0);
      list.push({ ...th, id: maxId + 1 });
    }
    setTherapists(list);
    saveData(STORAGE_KEYS.THERAPISTS, list);
    setShowTherapistModal(false);
    setTherapistForm(emptyTherapist);
    setEditingTherapistId(null);
  };

  const deleteTherapist = async (id) => { if (!(await confirmDialog(t('admin.physio.confirm_delete_therapist', 'Delete this therapist?')))) return;
    const list = therapists.filter(t => t.id !== id);
    setTherapists(list);
    saveData(STORAGE_KEYS.THERAPISTS, list);
  };

  const toggleTherapistStatus = (id) => {
    const list = therapists.map(t => t.id === id ? { ...t, isActive: !(t.isActive !== false) } : t);
    setTherapists(list);
    saveData(STORAGE_KEYS.THERAPISTS, list);
  };

  const updateTherapistForm = (key, value) => setTherapistForm(f => ({ ...f, [key]: value }));

  const openExerciseModal = (ex) => {
    setExerciseForm(ex ? { ...emptyExercise, ...ex } : emptyExercise);
    setEditingExerciseId(ex ? ex.id : null);
    setShowExerciseModal(true);
  };

  const saveExercise = () => {
    const ex = exerciseForm;
    if (!ex.name) return;
    let list = [...exercises];
    if (editingExerciseId) {
      list = list.map(item => item.id === editingExerciseId ? { ...ex, id: editingExerciseId } : item);
    } else {
      const maxId = Math.max(...list.map(x => x.id), 0);
      list.push({ ...ex, id: maxId + 1 });
    }
    setExercises(list);
    saveData(STORAGE_KEYS.EXERCISES, list);
    setShowExerciseModal(false);
    setExerciseForm(emptyExercise);
    setEditingExerciseId(null);
  };

  const deleteExercise = async (id) => { if (!(await confirmDialog(t('admin.physio.confirm_delete_exercise', 'Delete this exercise?')))) return;
    const list = exercises.filter(ex => ex.id !== id);
    setExercises(list);
    saveData(STORAGE_KEYS.EXERCISES, list);
  };

  const updateExerciseForm = (key, value) => setExerciseForm(f => ({ ...f, [key]: value }));

  const updateLeadStatus = (id, status) => {
    const next = leads.map(l => l.id === id ? { ...l, status } : l);
    setLeads(next);
    saveData(STORAGE_KEYS.LEADS, next);
  };

  const savePackagePrice = (id) => {
    const list = packages.map(p => p.id === id ? { ...p, price: editPackagePrice } : p);
    setPackages(list);
    setEditPackageId(null);
  };

  const tabs = [
    { id: 'dashboard', label: t('admin.physio.dashboard', 'Dashboard') },
    { id: 'bookings', label: t('admin.physio.bookings', 'Bookings') },
    { id: 'therapists', label: t('admin.physio.therapists', 'Therapists') },
    { id: 'packages', label: t('admin.physio.packages', 'Packages') },
    { id: 'leads', label: t('admin.physio.leads', 'Leads') },
    { id: 'exercises', label: t('admin.physio.exercises', 'Exercises') },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/admin" style={{ fontSize: 12, color: '#1866C9', textDecoration: 'none', fontWeight: 600 }}>← {t('admin.physio.back', 'Back to Admin')}</Link>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>🦵 {t('admin.physio.title', 'Physiotherapy Management')}</h2>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {tabs.map(tab => (
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
              { label: t('admin.physio.total_bookings', 'Total Bookings'), value: bookings.length, color: '#1866C9', icon: '📋' },
              { label: t('admin.physio.active_patients', 'Active Patients'), value: leads.filter(l => l.status !== 'Closed').length, color: '#059669', icon: '👥' },
              { label: t('admin.physio.total_therapists', 'Total Therapists'), value: activeTherapists.length, color: '#7c3aed', icon: '👨‍⚕️' },
              { label: t('admin.physio.revenue', 'Revenue'), value: `₹${totalRevenue.toLocaleString()}`, color: '#d97706', icon: '💰' },
              { label: t('admin.physio.today_appointments', "Today's Appointments"), value: todayAppointments, color: '#2563eb', icon: '📅' },
              { label: t('admin.physio.pending_visits', 'Pending Visits'), value: pendingVisits, color: '#dc2626', icon: '⏳' },
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
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>{t('admin.physio.recent_bookings', 'Recent Bookings')}</h4>
              {bookings.slice(-5).reverse().map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0', fontSize: 11 }}>
                  <span style={{ fontWeight: 600 }}>{b.patientName || b.name}</span>
                  <span style={{ color: '#64748b' }}>{b.condition} · {b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOOKINGS */}
      {activeTab === 'bookings' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input value={searchBooking} onChange={e => setSearchBooking(e.target.value)} placeholder={t('admin.physio.search_bookings', 'Search by patient, condition, ID...')}
              style={{ flex: 1, minWidth: 200, padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
            <select value={bookingFilter} onChange={e => setBookingFilter(e.target.value)}
              style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
              <option value="all">{t('admin.physio.all_status', 'All Status')}</option>
              {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 800 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.physio.id', 'ID')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.physio.patient', 'Patient')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.physio.condition', 'Condition')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.mode', 'Mode')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.physio.therapist', 'Therapist')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.date', 'Date')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.status', 'Status')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#475569' }}>{t('admin.physio.amount', 'Amount')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 && (
                  <EmptyState icon="💪" title="No bookings found" message="Physiotherapy bookings will appear here." />
                )}
                {filteredBookings.map(b => {
                  const sc = statusColors[b.status] || { bg: '#f1f5f9', text: '#475569' };
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600, fontSize: 10, color: '#1866C9' }}>{b.id}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{b.patientName || b.name || '-'}</td>
                      <td style={{ padding: '8px 10px', color: '#475569' }}>{b.condition || '-'}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b', textTransform: 'capitalize' }}>{b.mode || '-'}</td>
                      <td style={{ padding: '8px 10px', color: '#64748b' }}>{b.therapistName || b.therapist || '-'}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b' }}>{b.date || '-'}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: sc.bg, color: sc.text, textTransform: 'capitalize' }}>{b.status}</span>
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>₹{b.amount || 0}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          {b.status === 'pending' && <ActionBtn label={t('admin.physio.confirm', 'Confirm')} onClick={() => updateBookingStatus(b.id, 'confirmed')} color="#2563eb" />}
                          {b.status === 'confirmed' && <ActionBtn label={t('admin.physio.complete', 'Complete')} onClick={() => updateBookingStatus(b.id, 'completed')} color="#059669" />}
                          {b.status !== 'completed' && b.status !== 'cancelled' && <ActionBtn label={t('admin.physio.cancel', 'Cancel')} onClick={() => updateBookingStatus(b.id, 'cancelled')} color="#dc2626" />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* THERAPISTS */}
      {activeTab === 'therapists' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={() => openTherapistModal(null)}
              style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#1866C9', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ {t('admin.physio.add_therapist', 'Add Therapist')}</button>
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 700 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.physio.name', 'Name')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.physio.qualifications', 'Qualifications')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.experience', 'Experience')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.physio.specialties', 'Specialties')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.mode_short', 'Mode')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.rating', 'Rating')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.status', 'Status')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {therapists.map(th => (
                  <tr key={th.id} style={{ borderBottom: '1px solid #f0f0f0', opacity: th.isActive === false ? 0.5 : 1 }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{th.image || '👨‍⚕️'} {th.name}</td>
                    <td style={{ padding: '8px 10px', color: '#475569' }}>{th.qualifications}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b' }}>{th.experience} yrs</td>
                    <td style={{ padding: '8px 10px', color: '#64748b' }}>
                      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        {(th.specialties || []).map(s => <span key={s} style={{ padding: '1px 6px', borderRadius: 3, background: '#eff6ff', color: '#2563eb', fontSize: 9, whiteSpace: 'nowrap' }}>{s}</span>)}
                      </div>
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b' }}>
                      {(th.mode || []).map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#d97706' }}>★ {th.rating}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: th.isActive !== false ? '#dcfce7' : '#fee2e2', color: th.isActive !== false ? '#166534' : '#991b1b' }}>
                        {th.isActive !== false ? t('admin.physio.active', 'Active') : t('admin.physio.inactive', 'Inactive')}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <ActionBtn label={t('admin.physio.edit', 'Edit')} onClick={() => openTherapistModal(th)} />
                        <ActionBtn label={th.isActive !== false ? t('admin.physio.deactivate', 'Deactivate') : t('admin.physio.activate', 'Activate')} onClick={() => toggleTherapistStatus(th.id)} color="#d97706" />
                        <ActionBtn label={t('admin.physio.delete', 'Del')} onClick={() => deleteTherapist(th.id)} color="#dc2626" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* THERAPIST MODAL */}
      {showTherapistModal && (
        <Modal title={editingTherapistId ? t('admin.physio.edit_therapist', 'Edit Therapist') : t('admin.physio.add_therapist', 'Add Therapist')} onClose={() => { setShowTherapistModal(false); setTherapistForm(emptyTherapist); setEditingTherapistId(null); }}>
          <Field label={t('admin.physio.name', 'Name') + ' *'} value={therapistForm.name} onChange={v => updateTherapistForm('name', v)} />
          <Field label={t('admin.physio.qualifications', 'Qualifications')} value={therapistForm.qualifications} onChange={v => updateTherapistForm('qualifications', v)} placeholder="e.g. MPT Orthopedics" />
          <Field label={t('admin.physio.experience', 'Experience (years)')} value={therapistForm.experience} onChange={v => updateTherapistForm('experience', Number(v))} type="number" />
          <Field label={t('admin.physio.specialties', 'Specialties (comma separated)')} value={(therapistForm.specialties || []).join(', ')} onChange={v => updateTherapistForm('specialties', v.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Back Pain, Sports Injury, Stroke Recovery" />
          <Field label={t('admin.physio.rating', 'Rating')} value={therapistForm.rating} onChange={v => updateTherapistForm('rating', Number(v))} type="number" />
          <Field label={t('admin.physio.sessions', 'Sessions')} value={therapistForm.sessions} onChange={v => updateTherapistForm('sessions', Number(v))} type="number" />
          <Field label={t('admin.physio.image', 'Image Emoji')} value={therapistForm.image} onChange={v => updateTherapistForm('image', v)} placeholder="👨‍⚕️" />
          <Field label={t('admin.physio.languages', 'Languages (comma separated)')} value={(therapistForm.languages || []).join(', ')} onChange={v => updateTherapistForm('languages', v.split(',').map(s => s.trim()).filter(Boolean))} placeholder="English, Hindi, Telugu" />
          <Select label={t('admin.physio.mode', 'Mode')} value={therapistForm.mode?.[0] || ''} onChange={v => updateTherapistForm('mode', v ? [v] : [])} options={['home', 'clinic', 'online']} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={saveTherapist}
              style={{ padding: '8px 24px', borderRadius: 6, border: 'none', background: '#1866C9', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{editingTherapistId ? t('admin.physio.update', 'Update') : t('admin.physio.save', 'Save')}</button>
            <button onClick={() => { setShowTherapistModal(false); setTherapistForm(emptyTherapist); setEditingTherapistId(null); }}
              style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>{t('admin.physio.cancel', 'Cancel')}</button>
          </div>
        </Modal>
      )}

      {/* PACKAGES */}
      {activeTab === 'packages' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {packages.map(pkg => (
              <div key={pkg.id} style={{ padding: 16, borderRadius: 10, border: pkg.popular ? '2px solid #1866C9' : '1px solid #e2e8f0', background: '#fff', position: 'relative' }}>
                {pkg.popular && <span style={{ position: 'absolute', top: 8, right: 8, padding: '2px 8px', borderRadius: 4, background: '#1866C9', color: '#fff', fontSize: 9, fontWeight: 700 }}>{t('admin.physio.popular', 'Popular')}</span>}
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{pkg.name}</h4>
                <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 8px' }}>{pkg.sessions > 0 ? `${pkg.sessions} sessions` : pkg.isMonthly ? 'Monthly' : 'Custom'}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#059669' }}>₹{pkg.price}</span>
                  {pkg.originalPrice > pkg.price && <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>₹{pkg.originalPrice}</span>}
                </div>
                <div style={{ marginBottom: 10 }}>
                  {(pkg.includes || []).map((feat, i) => (
                    <div key={i} style={{ fontSize: 11, color: '#475569', padding: '2px 0' }}>✓ {feat}</div>
                  ))}
                </div>
                {editPackageId === pkg.id ? (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input type="number" value={editPackagePrice} onChange={e => setEditPackagePrice(Number(e.target.value))}
                      style={{ flex: 1, padding: '6px 8px', borderRadius: 4, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
                    <ActionBtn label={t('admin.physio.save', 'Save')} onClick={() => savePackagePrice(pkg.id)} />
                    <ActionBtn label={t('admin.physio.cancel', 'Cancel')} onClick={() => setEditPackageId(null)} color="#64748b" />
                  </div>
                ) : (
                  <ActionBtn label={t('admin.physio.edit_price', 'Edit Price')} onClick={() => { setEditPackageId(pkg.id); setEditPackagePrice(pkg.price); }} color="#d97706" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEADS */}
      {activeTab === 'leads' && (
        <div>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 700 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.physio.name', 'Name')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.physio.phone', 'Phone')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.physio.condition', 'Condition')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.mode', 'Mode')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.status', 'Status')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.created', 'Created')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>{t('admin.physio.no_leads', 'No leads yet.')}</td></tr>
                )}
                {leads.map(l => {
                  const leadColors = {
                    New: { bg: '#dbeafe', text: '#1e40af' },
                    Contacted: { bg: '#fef3c7', text: '#92400e' },
                    Assessment: { bg: '#e0e7ff', text: '#3730a3' },
                    Booked: { bg: '#dcfce7', text: '#166534' },
                    Closed: { bg: '#f1f5f9', text: '#64748b' },
                  };
                  const lc = leadColors[l.status] || { bg: '#f1f5f9', text: '#475569' };
                  return (
                    <tr key={l.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{l.name || l.patientName || '-'}</td>
                      <td style={{ padding: '8px 10px', color: '#475569' }}>{l.phone || '-'}</td>
                      <td style={{ padding: '8px 10px', color: '#64748b' }}>{l.condition || '-'}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b', textTransform: 'capitalize' }}>{l.mode || '-'}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: lc.bg, color: lc.text }}>{l.status || 'New'}</span>
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b', fontSize: 10 }}>{l.createdAt ? new Date(l.createdAt).toLocaleDateString() : '-'}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          {l.status === 'New' && <ActionBtn label={t('admin.physio.contacted', 'Contacted')} onClick={() => updateLeadStatus(l.id, 'Contacted')} color="#d97706" />}
                          {l.status === 'Contacted' && <ActionBtn label={t('admin.physio.assessment', 'Assessment')} onClick={() => updateLeadStatus(l.id, 'Assessment')} color="#7c3aed" />}
                          {l.status === 'Assessment' && <ActionBtn label={t('admin.physio.booked', 'Booked')} onClick={() => updateLeadStatus(l.id, 'Booked')} color="#059669" />}
                          {l.status !== 'Closed' && l.status !== 'Booked' && <ActionBtn label={t('admin.physio.close', 'Close')} onClick={() => updateLeadStatus(l.id, 'Closed')} color="#64748b" />}
                          {l.status === 'Booked' && <ActionBtn label={t('admin.physio.close', 'Close')} onClick={() => updateLeadStatus(l.id, 'Closed')} color="#64748b" />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EXERCISES */}
      {activeTab === 'exercises' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={() => openExerciseModal(null)}
              style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#1866C9', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ {t('admin.physio.add_exercise', 'Add Exercise')}</button>
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 600 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.physio.name', 'Name')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.physio.description', 'Description')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.category', 'Category')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.physio.video_url', 'Video URL')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.physio.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {exercises.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>{t('admin.physio.no_exercises', 'No exercises added yet.')}</td></tr>
                )}
                {exercises.map(ex => (
                  <tr key={ex.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{ex.name}</td>
                    <td style={{ padding: '8px 10px', color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.description}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#475569' }}>
                      <span style={{ padding: '2px 6px', borderRadius: 3, background: '#f0fdf4', color: '#166534', fontSize: 10 }}>{ex.category}</span>
                    </td>
                    <td style={{ padding: '8px 10px', color: '#2563eb', fontSize: 10, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.videoUrl || '-'}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <ActionBtn label={t('admin.physio.edit', 'Edit')} onClick={() => openExerciseModal(ex)} />
                        <ActionBtn label={t('admin.physio.delete', 'Del')} onClick={() => deleteExercise(ex.id)} color="#dc2626" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EXERCISE MODAL */}
      {showExerciseModal && (
        <Modal title={editingExerciseId ? t('admin.physio.edit_exercise', 'Edit Exercise') : t('admin.physio.add_exercise', 'Add Exercise')} onClose={() => { setShowExerciseModal(false); setExerciseForm(emptyExercise); setEditingExerciseId(null); }}>
          <Field label={t('admin.physio.name', 'Name') + ' *'} value={exerciseForm.name} onChange={v => updateExerciseForm('name', v)} />
          <TextArea label={t('admin.physio.description', 'Description')} value={exerciseForm.description} onChange={v => updateExerciseForm('description', v)} rows={2} />
          <Field label={t('admin.physio.category', 'Category')} value={exerciseForm.category} onChange={v => updateExerciseForm('category', v)} placeholder="e.g. Strength, Stretching, Balance" />
          <Field label={t('admin.physio.video_url', 'Video URL')} value={exerciseForm.videoUrl} onChange={v => updateExerciseForm('videoUrl', v)} placeholder="https://youtube.com/..." />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={saveExercise}
              style={{ padding: '8px 24px', borderRadius: 6, border: 'none', background: '#1866C9', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{editingExerciseId ? t('admin.physio.update', 'Update') : t('admin.physio.save', 'Save')}</button>
            <button onClick={() => { setShowExerciseModal(false); setExerciseForm(emptyExercise); setEditingExerciseId(null); }}
              style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>{t('admin.physio.cancel', 'Cancel')}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
