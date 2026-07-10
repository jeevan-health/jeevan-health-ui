import { useState, useEffect } from 'react';
import { useT } from '../../i18n/LanguageProvider';
import { nursingCategories, nursingServices as defaultServices, nurses as defaultNurses, nursingPackages as defaultPackages, STORAGE_KEYS } from '../../data/nursingData';

const C = {
  primary: '#7C3AED',
  primaryLight: '#EDE9FE',
  accent: '#EC4899',
};

const emptyService = {
  id: 0, name: '', category: '', price: 0, originalPrice: 0, duration: '30 min', description: '', popular: false,
};

const emptyNurse = {
  id: 0, name: '', level: 'staff-nurse', qualifications: '', experience: 0, specialties: [],
  languages: ['English', 'Hindi'], rating: 4.5, sessions: 0, image: '👩‍⚕️', availability: [], mode: ['home'], isActive: true,
};

const ActionBtn = ({ label, onClick, color }) => (
  <button onClick={onClick}
    style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: color || C.primary, color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{label}</button>
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

export default function AdminNursing() {
  const t = useT();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [packages, setPackages] = useState(defaultPackages);
  const [leads, setLeads] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [carePlans, setCarePlans] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [bookingFilter, setBookingFilter] = useState('all');
  const [searchBooking, setSearchBooking] = useState('');

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [editingServiceId, setEditingServiceId] = useState(null);

  const [showNurseModal, setShowNurseModal] = useState(false);
  const [nurseForm, setNurseForm] = useState(emptyNurse);
  const [editingNurseId, setEditingNurseId] = useState(null);

  const [editPackageId, setEditPackageId] = useState(null);
  const [editPackagePrice, setEditPackagePrice] = useState(0);

  const [billingFilter, setBillingFilter] = useState('all');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [assignmentSearch, setAssignmentSearch] = useState('');
  const [carePlanSearch, setCarePlanSearch] = useState('');

  useEffect(() => {
    setBookings(loadData(STORAGE_KEYS.BOOKINGS, []));
    setServices(loadData(STORAGE_KEYS.SERVICES, defaultServices));
    setNurses(loadData(STORAGE_KEYS.CAREGIVERS, defaultNurses));
    setLeads(loadData(STORAGE_KEYS.LEADS, []));
    setAssessments(loadData(STORAGE_KEYS.ASSESSMENTS, []));
    setCarePlans(loadData(STORAGE_KEYS.CARE_PLANS, []));
    setFeedbacks(loadData('jh_nurse_feedback', []));
  }, []);

  const activeNurses = nurses.filter(n => n.isActive !== false);
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0);
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAppointments = bookings.filter(b => (b.preferredDate || b.date) === todayStr).length;

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
          !(b.serviceName || '').toLowerCase().includes(q) &&
          !(b.nurseName || '').toLowerCase().includes(q) &&
          !(b.id || '').toString().toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const openServiceModal = (svc) => {
    setServiceForm(svc ? { ...emptyService, ...svc } : emptyService);
    setEditingServiceId(svc ? svc.id : null);
    setShowServiceModal(true);
  };

  const saveService = () => {
    const svc = serviceForm;
    if (!svc.name || !svc.category) return;
    let list = [...services];
    if (editingServiceId) {
      list = list.map(item => item.id === editingServiceId ? { ...svc, id: editingServiceId } : item);
    } else {
      const maxId = Math.max(...list.map(x => x.id), 0);
      list.push({ ...svc, id: maxId + 1 });
    }
    setServices(list);
    saveData(STORAGE_KEYS.SERVICES, list);
    setShowServiceModal(false);
    setServiceForm(emptyService);
    setEditingServiceId(null);
  };

  const deleteService = (id) => {
    if (!confirm(t('admin.nursing.confirm_delete_service', 'Delete this service?'))) return;
    const list = services.filter(s => s.id !== id);
    setServices(list);
    saveData(STORAGE_KEYS.SERVICES, list);
  };

  const updateServiceForm = (key, value) => setServiceForm(f => ({ ...f, [key]: value }));

  const openNurseModal = (n) => {
    setNurseForm(n ? { ...emptyNurse, ...n } : emptyNurse);
    setEditingNurseId(n ? n.id : null);
    setShowNurseModal(true);
  };

  const saveNurse = () => {
    const n = nurseForm;
    if (!n.name) return;
    let list = [...nurses];
    if (editingNurseId) {
      list = list.map(item => item.id === editingNurseId ? { ...n, id: editingNurseId } : item);
    } else {
      const maxId = Math.max(...list.map(x => x.id), 0);
      list.push({ ...n, id: maxId + 1 });
    }
    setNurses(list);
    saveData(STORAGE_KEYS.CAREGIVERS, list);
    setShowNurseModal(false);
    setNurseForm(emptyNurse);
    setEditingNurseId(null);
  };

  const deleteNurse = (id) => {
    if (!confirm(t('admin.nursing.confirm_delete_nurse', 'Delete this nurse?'))) return;
    const list = nurses.filter(n => n.id !== id);
    setNurses(list);
    saveData(STORAGE_KEYS.CAREGIVERS, list);
  };

  const toggleNurseStatus = (id) => {
    const list = nurses.map(n => n.id === id ? { ...n, isActive: !(n.isActive !== false) } : n);
    setNurses(list);
    saveData(STORAGE_KEYS.CAREGIVERS, list);
  };

  const updateNurseForm = (key, value) => setNurseForm(f => ({ ...f, [key]: value }));

  const savePackagePrice = (id) => {
    const list = packages.map(p => p.id === id ? { ...p, price: editPackagePrice } : p);
    setPackages(list);
    setEditPackageId(null);
  };

  const tabs = [
    { id: 'dashboard', label: t('admin.nursing.dashboard', 'Dashboard'), icon: '📊' },
    { id: 'requests', label: t('admin.nursing.requests', 'Patient Requests'), icon: '📋' },
    { id: 'nurses', label: t('admin.nursing.nurses', 'Nurse Management'), icon: '👩‍⚕️' },
    { id: 'verification', label: t('admin.nursing.verification', 'Nurse Verification'), icon: '✅' },
    { id: 'availability', label: t('admin.nursing.availability', 'Availability Calendar'), icon: '📅' },
    { id: 'assignment', label: t('admin.nursing.assignment', 'Assignment'), icon: '🔄' },
    { id: 'careplans', label: t('admin.nursing.careplans', 'Care Plans'), icon: '📝' },
    { id: 'attendance', label: t('admin.nursing.attendance', 'Attendance'), icon: '✓' },
    { id: 'billing', label: t('admin.nursing.billing', 'Billing'), icon: '💰' },
    { id: 'feedback', label: t('admin.nursing.feedback', 'Feedback'), icon: '⭐' },
    { id: 'services', label: t('admin.nursing.services', 'Services'), icon: '🩹' },
    { id: 'packages', label: t('admin.nursing.packages', 'Packages'), icon: '📦' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="/admin" style={{ fontSize: 12, color: C.primary, textDecoration: 'none', fontWeight: 600 }}>← {t('admin.nursing.back', 'Back to Admin')}</a>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>🩺 {t('admin.nursing.title', 'Nursing Management')}</h2>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: activeTab === tab.id ? C.primary : '#e8edf2', color: activeTab === tab.id ? '#fff' : '#475569', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
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
              { label: t('admin.nursing.total_bookings', 'Total Bookings'), value: bookings.length, color: C.primary, icon: '📋' },
              { label: t('admin.nursing.total_revenue', 'Total Revenue'), value: `₹${totalRevenue.toLocaleString()}`, color: '#059669', icon: '💰' },
              { label: t('admin.nursing.active_nurses', 'Active Nurses'), value: activeNurses.length, color: '#EC4899', icon: '👩‍⚕️' },
              { label: t('admin.nursing.services_today', 'Services Today'), value: todayAppointments, color: '#d97706', icon: '📅' },
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
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>{t('admin.nursing.recent_bookings', 'Recent Bookings')}</h4>
              {bookings.slice(-5).reverse().map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0', fontSize: 11 }}>
                  <span style={{ fontWeight: 600 }}>{b.patientName || b.name || '-'}</span>
                  <span style={{ color: '#64748b' }}>{(b.serviceName || '')} · {b.status}</span>
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
            <input value={searchBooking} onChange={e => setSearchBooking(e.target.value)} placeholder={t('admin.nursing.search_bookings', 'Search by patient, service, nurse, ID...')}
              style={{ flex: 1, minWidth: 200, padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
            <select value={bookingFilter} onChange={e => setBookingFilter(e.target.value)}
              style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
              <option value="all">{t('admin.nursing.all_status', 'All Status')}</option>
              {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 800 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.id', 'ID')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.patient', 'Patient')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.service', 'Service')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.nurse', 'Nurse')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.date', 'Date')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.amount', 'Amount')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.status', 'Status')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>{t('admin.nursing.no_bookings', 'No bookings found.')}</td></tr>
                )}
                {filteredBookings.map(b => {
                  const sc = statusColors[b.status] || { bg: '#f1f5f9', text: '#475569' };
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600, fontSize: 10, color: C.primary }}>{b.id}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{b.patientName || b.name || '-'}</td>
                      <td style={{ padding: '8px 10px', color: '#475569' }}>{b.serviceName || '-'}</td>
                      <td style={{ padding: '8px 10px', color: '#64748b' }}>{b.nurseName || '-'}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b' }}>{b.preferredDate || b.date || '-'}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>₹{b.totalAmount || b.amount || 0}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: sc.bg, color: sc.text, textTransform: 'capitalize' }}>{b.status}</span>
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          {b.status === 'pending' && <ActionBtn label={t('admin.nursing.confirm', 'Confirm')} onClick={() => updateBookingStatus(b.id, 'confirmed')} color="#2563eb" />}
                          {b.status === 'confirmed' && <ActionBtn label={t('admin.nursing.complete', 'Complete')} onClick={() => updateBookingStatus(b.id, 'completed')} color="#059669" />}
                          {b.status !== 'completed' && b.status !== 'cancelled' && <ActionBtn label={t('admin.nursing.cancel', 'Cancel')} onClick={() => updateBookingStatus(b.id, 'cancelled')} color="#dc2626" />}
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

      {/* PATIENT REQUESTS */}
      {activeTab === 'requests' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map(s => (
              <button key={s} onClick={() => setBookingFilter(s)}
                style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: bookingFilter === s ? C.primary : '#f1f5f9', color: bookingFilter === s ? '#fff' : '#475569', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
                {s === 'all' ? t('all', 'All') : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 800 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>ID</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Patient</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Service</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Nurse</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Date</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#475569' }}>Amount</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Status</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(bookingFilter === 'all' ? bookings : bookings.filter(b => b.status === bookingFilter)).length === 0 && (
                  <tr><td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>No requests found.</td></tr>
                )}
                {(bookingFilter === 'all' ? bookings : bookings.filter(b => b.status === bookingFilter)).map(b => {
                  const sc = statusColors[b.status] || { bg: '#f1f5f9', text: '#475569' };
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600, fontSize: 10, color: C.primary }}>{b.id}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{b.patientName || b.name || '-'}</td>
                      <td style={{ padding: '8px 10px', color: '#475569' }}>{b.serviceName || '-'}</td>
                      <td style={{ padding: '8px 10px', color: '#64748b' }}>{b.nurseName || '-'}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b' }}>{b.preferredDate || b.date || '-'}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>₹{b.totalAmount || b.amount || 0}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: sc.bg, color: sc.text, textTransform: 'capitalize' }}>{b.status}</span>
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          {b.status === 'Pending Assessment' && <ActionBtn label="Assign Nurse" onClick={() => { setAssignmentSearch(b.patientName || ''); setActiveTab('assignment'); }} color={C.primary} />}
                          {b.status === 'pending' && <ActionBtn label="Confirm" onClick={() => updateBookingStatus(b.id, 'confirmed')} color="#2563eb" />}
                          {b.status === 'confirmed' && <ActionBtn label="Complete" onClick={() => updateBookingStatus(b.id, 'completed')} color="#059669" />}
                          {b.status !== 'completed' && b.status !== 'cancelled' && <ActionBtn label="Cancel" onClick={() => updateBookingStatus(b.id, 'cancelled')} color="#dc2626" />}
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

      {/* NURSE VERIFICATION */}
      {activeTab === 'verification' && (
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>Nurse Verification Status</h4>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 700 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Nurse</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Qualification</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Docs Uploaded</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Verification</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Police Clear</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Training</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {nurses.map(n => (
                  <tr key={n.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{n.image} {n.name}</td>
                    <td style={{ padding: '8px 10px', color: '#475569' }}>{n.qualifications}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}><span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span></td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 4, background: n.verified ? '#dcfce7' : '#fef3c7', color: n.verified ? '#16a34a' : '#d97706', fontSize: 10, fontWeight: 600 }}>{n.verified ? 'Verified' : 'Pending'}</span>
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 4, background: n.policeVerified ? '#dcfce7' : '#fee2e2', color: n.policeVerified ? '#16a34a' : '#dc2626', fontSize: 10, fontWeight: 600 }}>{n.policeVerified ? 'Cleared' : 'Pending'}</span>
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 4, background: '#dbeafe', color: '#1d4ed8', fontSize: 10, fontWeight: 600 }}>Completed</span>
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      {!n.verified && <ActionBtn label="Verify Now" onClick={() => {}} color="#059669" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AVAILABILITY CALENDAR */}
      {activeTab === 'availability' && (
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>Nurse Availability Calendar</h4>
          <div style={{ display: 'grid', gap: 10 }}>
            {nurses.slice(0, 6).map(n => (
              <div key={n.id} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{n.image}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{n.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{n.qualifications} · {n.experience} yrs</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {n.availability.map((a, i) => (
                    <span key={i} style={{ padding: '4px 10px', borderRadius: 6, background: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: 600 }}>📅 {a}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NURSE ASSIGNMENT */}
      {activeTab === 'assignment' && (
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>Nurse Assignment</h4>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>Search for an unassigned patient request and assign a nurse.</p>
          <input value={assignmentSearch} onChange={e => setAssignmentSearch(e.target.value)} placeholder="Search by patient name, ID..."
            style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', marginBottom: 12, boxSizing: 'border-box' }} />
          <div style={{ display: 'grid', gap: 10 }}>
            {bookings.filter(b => !b.nurseName || b.nurseName === 'Auto-assigned').slice(0, 5).map(b => (
              <div key={b.id} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{b.patientName || 'Unknown'}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{b.serviceName} · {b.preferredDate || ''}</div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {nurses.slice(0, 3).map(n => (
                    <button key={n.id} onClick={() => updateBookingStatus(b.id, 'confirmed')}
                      style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>
                      {n.name.split(' ').slice(-1)[0]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CARE PLANS */}
      {activeTab === 'careplans' && (
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>Care Plans</h4>
          <input value={carePlanSearch} onChange={e => setCarePlanSearch(e.target.value)} placeholder="Search by patient or plan..."
            style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', marginBottom: 12, boxSizing: 'border-box' }} />
          {bookings.filter(b => b.status === 'confirmed' || b.status === 'in-progress' || b.status === 'completed').length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>No active care plans yet.</div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {bookings.filter(b => b.status === 'confirmed' || b.status === 'in-progress' || b.status === 'completed').slice(0, 6).map(b => (
                <div key={b.id} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{b.patientName} — {b.serviceName}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Nurse: {b.nurseName || 'TBD'} · {b.duration || b.serviceDuration || ''}</div>
                  </div>
                  <span style={{ padding: '2px 10px', borderRadius: 4, background: statusColors[b.status]?.bg || '#f1f5f9', color: statusColors[b.status]?.text || '#475569', fontSize: 10, fontWeight: 600 }}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>Nurse Attendance</h4>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: '#475569' }}>Date:</span>
            <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 600 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Nurse</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Shift</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Check-in</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Check-out</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {nurses.slice(0, 8).map(n => (
                  <tr key={n.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{n.name}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b' }}>Day</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b' }}>—</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b' }}>—</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 4, background: '#fef3c7', color: '#d97706', fontSize: 10, fontWeight: 600 }}>Pending</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BILLING */}
      {activeTab === 'billing' && (
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>Billing & Payments</h4>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {['all', 'paid', 'pending', 'overdue'].map(s => (
              <button key={s} onClick={() => setBillingFilter(s)}
                style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: billingFilter === s ? C.primary : '#f1f5f9', color: billingFilter === s ? '#fff' : '#475569', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {bookings.filter(b => b.status === 'completed' || b.status === 'confirmed').slice(0, 6).map(b => (
              <div key={b.id} style={{ padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{b.patientName} · {b.serviceName}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>ID: {b.id} · {b.preferredDate || '-'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#059669' }}>₹{b.totalAmount || b.amount || 0}</div>
                  <span style={{ padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#16a34a', fontSize: 10, fontWeight: 600 }}>Paid</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEEDBACK */}
      {activeTab === 'feedback' && (
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>Patient Feedback</h4>
          {feedbacks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: '#94a3b8', fontSize: 12 }}>
              No feedback received yet. Feedback will appear here as patients rate their experience.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {feedbacks.map((fb, i) => (
                <div key={i} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{fb.patient}</span>
                    <span style={{ color: '#d97706', fontSize: 12 }}>{'★'.repeat(5)}</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#475569', margin: '0 0 4px', fontStyle: 'italic' }}>"{fb.comment || 'Great service, very professional!'}"</p>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>{fb.date || new Date().toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SERVICES */}
      {activeTab === 'services' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={() => openServiceModal(null)}
              style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: C.primary, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ {t('admin.nursing.add_service', 'Add Service')}</button>
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 700 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.name', 'Name')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.price', 'Price')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.category', 'Category')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.duration', 'Duration')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.description', 'Description')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>{t('admin.nursing.no_services', 'No services yet.')}</td></tr>
                )}
                {services.map(svc => {
                  const cat = nursingCategories.find(c => c.id === svc.category);
                  return (
                    <tr key={svc.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{svc.name}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#059669' }}>
                        ₹{svc.price}
                        {svc.originalPrice > svc.price && <span style={{ fontSize: 9, color: '#94a3b8', textDecoration: 'line-through', marginLeft: 4 }}>₹{svc.originalPrice}</span>}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <span style={{ padding: '2px 6px', borderRadius: 3, background: cat?.color + '15' || '#f0fdf4', color: cat?.color || '#166534', fontSize: 10 }}>{cat?.name || svc.category}</span>
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b' }}>{svc.duration}</td>
                      <td style={{ padding: '8px 10px', color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{svc.description}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          <ActionBtn label={t('admin.nursing.edit', 'Edit')} onClick={() => openServiceModal(svc)} />
                          <ActionBtn label={t('admin.nursing.delete', 'Del')} onClick={() => deleteService(svc.id)} color="#dc2626" />
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

      {/* SERVICE MODAL */}
      {showServiceModal && (
        <Modal title={editingServiceId ? t('admin.nursing.edit_service', 'Edit Service') : t('admin.nursing.add_service', 'Add Service')} onClose={() => { setShowServiceModal(false); setServiceForm(emptyService); setEditingServiceId(null); }}>
          <Field label={t('admin.nursing.name', 'Name') + ' *'} value={serviceForm.name} onChange={v => updateServiceForm('name', v)} placeholder="e.g. Wound Dressing" />
          <Select label={t('admin.nursing.category', 'Category') + ' *'} value={serviceForm.category} onChange={v => updateServiceForm('category', v)}
            options={nursingCategories.map(c => ({ value: c.id, label: c.name }))} />
          <Field label={t('admin.nursing.price', 'Price (₹)')} value={serviceForm.price} onChange={v => updateServiceForm('price', Number(v))} type="number" />
          <Field label={t('admin.nursing.original_price', 'Original Price (₹)')} value={serviceForm.originalPrice} onChange={v => updateServiceForm('originalPrice', Number(v))} type="number" />
          <Field label={t('admin.nursing.duration', 'Duration')} value={serviceForm.duration} onChange={v => updateServiceForm('duration', v)} placeholder="e.g. 30 min" />
          <Field label={t('admin.nursing.description', 'Description')} value={serviceForm.description} onChange={v => updateServiceForm('description', v)} placeholder="Short description of the service" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>{t('admin.nursing.popular', 'Popular')}</label>
            <input type="checkbox" checked={serviceForm.popular} onChange={e => updateServiceForm('popular', e.target.checked)}
              style={{ accentColor: C.primary }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={saveService}
              style={{ padding: '8px 24px', borderRadius: 6, border: 'none', background: C.primary, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{editingServiceId ? t('admin.nursing.update', 'Update') : t('admin.nursing.save', 'Save')}</button>
            <button onClick={() => { setShowServiceModal(false); setServiceForm(emptyService); setEditingServiceId(null); }}
              style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>{t('admin.nursing.cancel', 'Cancel')}</button>
          </div>
        </Modal>
      )}

      {/* NURSES */}
      {activeTab === 'nurses' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={() => openNurseModal(null)}
              style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: C.primary, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ {t('admin.nursing.add_nurse', 'Add Nurse')}</button>
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 800 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.name', 'Name')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.level', 'Level')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.qualifications', 'Qualifications')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.experience', 'Experience')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.specialties', 'Specialties')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.languages', 'Languages')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.rating', 'Rating')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.status', 'Status')}</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('admin.nursing.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {nurses.map(n => (
                  <tr key={n.id} style={{ borderBottom: '1px solid #f0f0f0', opacity: n.isActive === false ? 0.5 : 1 }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{n.image || '👩‍⚕️'} {n.name}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 6px', borderRadius: 3, background: '#f3e8ff', color: '#7c3aed', fontSize: 9, textTransform: 'capitalize' }}>{n.level?.replace('-', ' ')}</span>
                    </td>
                    <td style={{ padding: '8px 10px', color: '#475569' }}>{n.qualifications}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b' }}>{n.experience} yrs</td>
                    <td style={{ padding: '8px 10px', color: '#64748b' }}>
                      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        {(n.specialties || []).map(s => {
                          const cat = nursingCategories.find(c => c.id === s);
                          return <span key={s} style={{ padding: '1px 6px', borderRadius: 3, background: '#fdf2f8', color: '#be185d', fontSize: 9, whiteSpace: 'nowrap' }}>{cat?.name || s}</span>;
                        })}
                      </div>
                    </td>
                    <td style={{ padding: '8px 10px', color: '#64748b', fontSize: 10 }}>{(n.languages || []).join(', ')}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#d97706' }}>★ {n.rating}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: n.isActive !== false ? '#dcfce7' : '#fee2e2', color: n.isActive !== false ? '#166534' : '#991b1b' }}>
                        {n.isActive !== false ? t('admin.nursing.active', 'Active') : t('admin.nursing.inactive', 'Inactive')}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <ActionBtn label={t('admin.nursing.edit', 'Edit')} onClick={() => openNurseModal(n)} />
                        <ActionBtn label={n.isActive !== false ? t('admin.nursing.deactivate', 'Deactivate') : t('admin.nursing.activate', 'Activate')} onClick={() => toggleNurseStatus(n.id)} color="#d97706" />
                        <ActionBtn label={t('admin.nursing.delete', 'Del')} onClick={() => deleteNurse(n.id)} color="#dc2626" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NURSE MODAL */}
      {showNurseModal && (
        <Modal title={editingNurseId ? t('admin.nursing.edit_nurse', 'Edit Nurse') : t('admin.nursing.add_nurse', 'Add Nurse')} onClose={() => { setShowNurseModal(false); setNurseForm(emptyNurse); setEditingNurseId(null); }}>
          <Field label={t('admin.nursing.name', 'Name') + ' *'} value={nurseForm.name} onChange={v => updateNurseForm('name', v)} />
          <Select label={t('admin.nursing.level', 'Level')} value={nurseForm.level} onChange={v => updateNurseForm('level', v)}
            options={[
              { value: 'trained-caregiver', label: 'Trained Caregiver' },
              { value: 'staff-nurse', label: 'Staff Nurse' },
              { value: 'senior-nurse', label: 'Senior Staff Nurse' },
              { value: 'specialist', label: 'Specialist Nurse' },
            ]} />
          <Field label={t('admin.nursing.qualifications', 'Qualifications')} value={nurseForm.qualifications} onChange={v => updateNurseForm('qualifications', v)} placeholder="e.g. GNM, B.Sc Nursing" />
          <Field label={t('admin.nursing.experience', 'Experience (years)')} value={nurseForm.experience} onChange={v => updateNurseForm('experience', Number(v))} type="number" />
          <Field label={t('admin.nursing.specialties', 'Specialties (comma separated)')} value={(nurseForm.specialties || []).join(', ')} onChange={v => updateNurseForm('specialties', v.split(',').map(s => s.trim()).filter(Boolean))} placeholder="wound-care, injections, bedside" />
          <Field label={t('admin.nursing.languages', 'Languages (comma separated)')} value={(nurseForm.languages || []).join(', ')} onChange={v => updateNurseForm('languages', v.split(',').map(s => s.trim()).filter(Boolean))} placeholder="English, Hindi, Telugu" />
          <Field label={t('admin.nursing.rating', 'Rating')} value={nurseForm.rating} onChange={v => updateNurseForm('rating', Number(v))} type="number" />
          <Field label={t('admin.nursing.sessions', 'Sessions')} value={nurseForm.sessions} onChange={v => updateNurseForm('sessions', Number(v))} type="number" />
          <Field label={t('admin.nursing.image', 'Image Emoji')} value={nurseForm.image} onChange={v => updateNurseForm('image', v)} placeholder="👩‍⚕️" />
          <Field label={t('admin.nursing.availability', 'Availability (comma separated)')} value={(nurseForm.availability || []).join(', ')} onChange={v => updateNurseForm('availability', v.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Today 2 PM, Tomorrow 9 AM" />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={saveNurse}
              style={{ padding: '8px 24px', borderRadius: 6, border: 'none', background: C.primary, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{editingNurseId ? t('admin.nursing.update', 'Update') : t('admin.nursing.save', 'Save')}</button>
            <button onClick={() => { setShowNurseModal(false); setNurseForm(emptyNurse); setEditingNurseId(null); }}
              style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>{t('admin.nursing.cancel', 'Cancel')}</button>
          </div>
        </Modal>
      )}

      {/* PACKAGES */}
      {activeTab === 'packages' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {packages.map(pkg => (
              <div key={pkg.id} style={{ padding: 16, borderRadius: 10, border: pkg.popular ? '2px solid #EC4899' : '1px solid #e2e8f0', background: '#fff', position: 'relative' }}>
                {pkg.popular && <span style={{ position: 'absolute', top: 8, right: 8, padding: '2px 8px', borderRadius: 4, background: '#EC4899', color: '#fff', fontSize: 9, fontWeight: 700 }}>{t('admin.nursing.popular', 'Popular')}</span>}
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{pkg.name}</h4>
                <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 8px' }}>{pkg.services > 0 ? `${pkg.services} services` : pkg.isMonthly ? 'Monthly' : 'Custom'}</p>
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
                    <ActionBtn label={t('admin.nursing.save', 'Save')} onClick={() => savePackagePrice(pkg.id)} />
                    <ActionBtn label={t('admin.nursing.cancel', 'Cancel')} onClick={() => setEditPackageId(null)} color="#64748b" />
                  </div>
                ) : (
                  <ActionBtn label={t('admin.nursing.edit_price', 'Edit Price')} onClick={() => { setEditPackageId(pkg.id); setEditPackagePrice(pkg.price); }} color="#d97706" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
