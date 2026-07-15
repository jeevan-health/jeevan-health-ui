import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getPhlebotomists, savePhlebotomist, deletePhlebotomist, getOrders } from '../../services/localOrderService';
import * as adminService from '../../services/adminService';
import { useT } from '../../i18n/LanguageProvider';
import { confirmDialog } from '../../stores/dialogStore';
import { notify } from '../../lib/toastBus';

const ALL_AREAS = ['Kukatpally', 'Madhapur', 'Gachibowli', 'Hitech City', 'Banjara Hills', 'Jubilee Hills', 'Kondapur', 'Miyapur', 'Ameerpet', 'Begumpet', 'Secunderabad', 'Dilsukhnagar', 'Uppal', 'LB Nagar', 'Shamshabad', 'Patancheru', 'Nizampet', 'KPHB', 'SR Nagar', 'Panjagutta'];

const STATUS_OPTIONS = { available: '#22c55e', busy: '#f59e0b', offline: '#94a3b8', leave: '#8b5cf6' };
const STATUS_LABELS = { available: 'Available', busy: 'Busy', offline: 'Offline', leave: 'Leave' };
const STATUS_ICONS = { available: '🟢', busy: '🟡', offline: '🔴', leave: '⚫' };
const GENDERS = ['Male', 'Female', 'Other'];
const QUALIFICATIONS = ['DMLT', 'B.Sc MLT', 'Diploma in Phlebotomy', 'B.Sc Nursing', 'Other'];
const EMPLOYMENT_TYPES = ['Full Time', 'Part Time', 'Contract', 'Partner'];
const TRANSPORT_TYPES = ['Bike', 'Car', 'Public Transport'];
const EQUIPMENT_ITEMS = ['BP Machine', 'Pulse Oximeter', 'Glucometer', 'Sample Box', 'Barcode Scanner'];
const BG_VERIFY_STATUS = ['Pending', 'Verified', 'Rejected'];

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const formatDateTime = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };
const labelStyle = { fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4, fontWeight: 500 };
const sectionHeader = { fontSize: 13, fontWeight: 700, color: '#0f172a', padding: '10px 0', borderBottom: '1px solid #e2e8f0', marginBottom: 12, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

const emptyForm = () => ({
  name: '', phone: '', email: '', profilePhoto: '', gender: '', dateOfBirth: '',
  employeeId: '', qualification: '', experience: '', joiningDate: '', employmentType: '',
  identityProof: '', aadhaar: '', pan: '', drivingLicense: '', qualificationCert: '', trainingCertificate: '', backgroundVerification: 'Pending',
  areas: '', maxTravelDistance: '', preferredWorkingAreas: '',
  status: 'available', workingSchedule: '', workingTime: '', slotCapacity: '',
  transportType: '', vehicleNumber: '',
  equipment: [],
  username: '', password: '',
  emergencyContactName: '', emergencyContactRelationship: '', emergencyContactPhone: '',
  bankAccountHolder: '', bankName: '', bankAccountNumber: '', bankIfsc: '', bankUpiId: '',
});

export default function AdminCollection() {
  const t = useT();
  const [phlebotomists, setPhlebotomists] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('phlebotomists');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm());
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [rosterSource, setRosterSource] = useState('api'); // api | local
  const [loadError, setLoadError] = useState('');

  const mapApiPhlebo = (p) => ({
    id: p.id,
    employeeId: p.employeeId || p.employee_id,
    name: p.name,
    phone: p.phone,
    email: p.email,
    gender: p.gender,
    dateOfBirth: p.dateOfBirth || p.date_of_birth,
    qualification: p.qualification,
    experience: p.experience,
    areas: p.areas || p.preferredWorkingAreas || '',
    status: p.status || 'available',
    joiningDate: p.joiningDate || p.joining_date,
    transportType: p.transportType,
    vehicleNumber: p.vehicleNumber,
    userId: p.userId,
    applicationId: p.applicationId,
    fromApi: true,
  });

  const refresh = useCallback(async () => {
    setLoadError('');
    try {
      const { data } = await adminService.listPhlebotomists({ limit: 200 });
      const list = (data.phlebotomists || []).map(mapApiPhlebo);
      setPhlebotomists(list);
      setRosterSource('api');
    } catch (err) {
      // Fallback local only if API fails
      setPhlebotomists(getPhlebotomists());
      setRosterSource('local');
      setLoadError(err?.response?.data?.error || 'Could not load Neon roster — showing local cache if any');
    }
    setOrders(getOrders());
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const activeOrders = orders.filter(o => o.phlebotomist && o.status !== 'completed' && o.status !== 'cancelled');

  const toggleSection = (key) => setExpandedSections(p => ({ ...p, [key]: !p[key] }));

  const filtered = phlebotomists.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.name || '').toLowerCase().includes(q) || (p.phone || '').toLowerCase().includes(q) || (p.employeeId || '').toLowerCase().includes(q) || (p.areas || '').toLowerCase().includes(q);
  });

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setSelectedAreas([]);
    setExpandedSections({ personal: true });
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || '', phone: p.phone || '', email: p.email || '', profilePhoto: p.profilePhoto || '', gender: p.gender || '', dateOfBirth: p.dateOfBirth || '',
      employeeId: p.employeeId || '', qualification: p.qualification || '', experience: p.experience || '', joiningDate: p.joiningDate || '', employmentType: p.employmentType || '',
      identityProof: p.identityProof || '', aadhaar: p.aadhaar || '', pan: p.pan || '', drivingLicense: p.drivingLicense || '', qualificationCert: p.qualificationCert || '', trainingCertificate: p.trainingCertificate || '', backgroundVerification: p.backgroundVerification || 'Pending',
      areas: p.areas || '', maxTravelDistance: p.maxTravelDistance || '', preferredWorkingAreas: p.preferredWorkingAreas || '',
      status: p.status || 'available', workingSchedule: p.workingSchedule || '', workingTime: p.workingTime || '', slotCapacity: p.slotCapacity || '',
      transportType: p.transportType || '', vehicleNumber: p.vehicleNumber || '',
      equipment: p.equipment || [],
      username: p.username || '', password: p.password || '',
      emergencyContactName: p.emergencyContactName || '', emergencyContactRelationship: p.emergencyContactRelationship || '', emergencyContactPhone: p.emergencyContactPhone || '',
      bankAccountHolder: p.bankAccountHolder || '', bankName: p.bankName || '', bankAccountNumber: p.bankAccountNumber || '', bankIfsc: p.bankIfsc || '', bankUpiId: p.bankUpiId || '',
    });
    setSelectedAreas((p.areas || '').split(',').map(a => a.trim()).filter(Boolean));
    setExpandedSections({ personal: true });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.phone) return;
    const autoId = editing ? editing.id : 'PHB' + String(phlebotomists.length + 1).padStart(5, '0');
    const data = {
      ...form,
      areas: selectedAreas.join(', '),
      id: editing ? editing.id : autoId,
      equipment: form.equipment || [],
      assignedJobs: editing ? editing.assignedJobs : 0,
      createdAt: editing ? editing.createdAt : new Date().toISOString(),
    };
    savePhlebotomist(data);
    setShowForm(false);
    setEditing(null);
    refresh();
  };

  const handleDelete = async (id) => { if (await confirmDialog('Delete this phlebotomist?')) { deletePhlebotomist(id); refresh(); } };

  const toggleEquipment = (item) => {
    setForm(p => ({
      ...p,
      equipment: p.equipment.includes(item) ? p.equipment.filter(e => e !== item) : [...p.equipment, item],
    }));
  };

  const toggleArea = (area) => {
    setSelectedAreas(p => p.includes(area) ? p.filter(a => a !== area) : [...p, area]);
  };

  // Stats
  const total = phlebotomists.length;
  const available = phlebotomists.filter(p => p.status === 'available').length;
  const busy = phlebotomists.filter(p => p.status === 'busy').length;
  const offline = phlebotomists.filter(p => p.status === 'offline').length;
  const leave = phlebotomists.filter(p => p.status === 'leave').length;

  // Performance for viewing
  const assignedOrders = viewing ? activeOrders.filter(o => o.phlebotomist?.name === viewing.name) : [];
  const totalCollections = assignedOrders.length;
  const todayCollections = assignedOrders.filter(o => o.collectionDate === new Date().toISOString().slice(0, 10)).length;
  const monthlyCollections = assignedOrders.filter(o => (o.collectionDate || '').startsWith(new Date().toISOString().slice(0, 7))).length;

  return (
    <div>
      {/* Stats Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatCard icon="👥" label="Total" value={total} color="#0f172a" />
        <StatCard icon="🟢" label="Available" value={available} color="#22c55e" />
        <StatCard icon="🟡" label="Busy" value={busy} color="#f59e0b" />
        <StatCard icon="🔴" label="Offline" value={offline} color="#94a3b8" />
        <StatCard icon="⚫" label="Leave" value={leave} color="#8b5cf6" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <TabBtn active={tab === 'phlebotomists'} onClick={() => setTab('phlebotomists')}>Phlebotomists ({total})</TabBtn>
        <TabBtn active={tab === 'routes'} onClick={() => setTab('routes')}>Routes & Tracking</TabBtn>
        <TabBtn active={tab === 'areas'} onClick={() => setTab('areas')}>Service Areas</TabBtn>
      </div>

      {/* Phlebotomists Tab */}
      {tab === 'phlebotomists' && (
        <div>
          {viewing ? (
            /* Performance Dashboard */
            <PerformanceDashboard
              phlebo={viewing}
              assignedOrders={assignedOrders}
              totalCollections={totalCollections}
              todayCollections={todayCollections}
              monthlyCollections={monthlyCollections}
              onBack={() => setViewing(null)}
              onEdit={() => { const v = viewing; setViewing(null); openEdit(v); }}
            />
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <Link to="/admin/staff-onboarding" style={{ fontSize: 12, color: '#0d9488', fontWeight: 600 }}>
                  📋 Review phlebotomist applications →
                </Link>
                <Link to="/onboarding-phlebotomist" target="_blank" style={{ fontSize: 12, color: '#64748b' }}>
                  Public hire form ↗
                </Link>
                <span style={{ fontSize: 11, color: rosterSource === 'api' ? '#059669' : '#b45309' }}>
                  Roster: {rosterSource === 'api' ? 'Neon (production)' : 'local fallback'}
                </span>
              </div>
              {loadError && <div style={{ fontSize: 12, color: '#b45309', marginBottom: 8 }}>{loadError}</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <input placeholder="Search name, phone, ID, area..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', maxWidth: 300, flex: 1 }} />
                <button type="button" onClick={refresh} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Refresh</button>
                <button onClick={openAdd} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }} title="Local-only draft; prefer hire form for production roster">
                  + Local draft
                </button>
              </div>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>No phlebotomists found</div>
              ) : (
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))' }}>
                  {filtered.map(p => {
                    const assigned = activeOrders.filter(o => o.phlebotomist?.name === p.name).length;
                    return (
                      <div key={p.id} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', cursor: 'pointer' }}
                        onClick={() => setViewing(p)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: p.profilePhoto ? 'transparent' : '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#4338ca', overflow: 'hidden' }}>
                              {p.profilePhoto ? <img src={p.profilePhoto} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} /> : (p.name[0] || '?')}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: '#64748b' }}>{p.employeeId || p.id} {p.gender ? `· ${p.gender}` : ''}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {p.fromApi && (
                              <button
                                type="button"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    const { data } = await adminService.enablePhlebotomistLogin(p.id);
                                    notify.success(`Login OK — OTP with phone ${data.phone || p.phone}`);
                                    refresh();
                                  } catch (err) {
                                    notify.error(err?.response?.data?.error || 'Enable login failed');
                                  }
                                }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0d9488', fontSize: 11, fontWeight: 600 }}
                              >
                                Enable login
                              </button>
                            )}
                            {!p.fromApi && (
                              <>
                                <button onClick={(e) => { e.stopPropagation(); openEdit(p); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: 12 }}>Edit</button>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 12 }}>Del</button>
                              </>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 12, flexWrap: 'wrap' }}>
                          <span style={{ padding: '2px 10px', borderRadius: 20, fontWeight: 600, background: `${STATUS_OPTIONS[p.status] || '#94a3b8'}20`, color: STATUS_OPTIONS[p.status] || '#475569', fontSize: 11 }}>
                            {STATUS_ICONS[p.status] || '⚪'} {STATUS_LABELS[p.status] || p.status}
                          </span>
                          <span style={{ color: '#64748b' }}>📋 {assigned} jobs</span>
                          {p.qualification && <span style={{ color: '#64748b' }}>🎓 {p.qualification}</span>}
                          {p.phone && <span style={{ color: '#64748b' }}>📞 {p.phone}</span>}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
                          {(p.areas || '').split(',').filter(Boolean).slice(0, 3).join(', ')}{(p.areas || '').split(',').filter(Boolean).length > 3 ? '...' : ''}
                        </div>
                        <div style={{ marginTop: 8, display: 'flex', gap: 8, fontSize: 11, color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                          <span>⭐ {p.patientRating || '—'} rating</span>
                          <span>📅 {formatDate(p.joiningDate || p.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Routes Tab */}
      {tab === 'routes' && (
        <div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>{activeOrders.length} active collections assigned</div>
          {phlebotomists.filter(p => p.status !== 'offline' && p.status !== 'leave').length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>No active phlebotomists</div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {phlebotomists.filter(p => p.status !== 'offline' && p.status !== 'leave').map(p => {
                const assignedOrders = activeOrders.filter(o => o.phlebotomist?.name === p.name);
                return (
                  <div key={p.id} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#2563eb' }}>{p.name[0]}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{p.name}</div>
                          <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: `${STATUS_OPTIONS[p.status]}20`, color: STATUS_OPTIONS[p.status] }}>
                            {STATUS_ICONS[p.status]} {STATUS_LABELS[p.status]}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{assignedOrders.length} route{assignedOrders.length !== 1 ? 's' : ''}</span>
                    </div>
                    {p.transportType && <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>🚗 {p.transportType}{p.vehicleNumber ? ` · ${p.vehicleNumber}` : ''}</div>}
                    {assignedOrders.length === 0 ? (
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>No assignments yet</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {assignedOrders.map(o => (
                          <div key={o.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 8, fontSize: 12 }}>
                            <span style={{ fontWeight: 600, color: '#0f172a', minWidth: 140 }}>{o.id}</span>
                            <span style={{ color: '#64748b', flex: 1 }}>{(o.collectionAddress || '').split(',').slice(0, 2).join(',') || '—'}</span>
                            <span style={{ color: '#3b82f6', fontWeight: 600 }}>{o.collectionDate} {o.collectionTime}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Areas Tab */}
      {tab === 'areas' && (
        <div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Service coverage areas with assigned phlebotomists</div>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {ALL_AREAS.map(area => {
              const assigned = phlebotomists.filter(p => (p.areas || '').toLowerCase().includes(area.toLowerCase()));
              return (
                <div key={area} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', marginBottom: 8 }}>{area}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    {assigned.length > 0 ? assigned.map(c => (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                        <span>{c.name}</span>
                        <span style={{ padding: '1px 6px', borderRadius: 10, fontSize: 10, fontWeight: 600, background: `${STATUS_OPTIONS[c.status]}20`, color: STATUS_OPTIONS[c.status] }}>{STATUS_LABELS[c.status]}</span>
                      </div>
                    )) : <span style={{ color: '#94a3b8' }}>No phlebotomist assigned</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add/Edit Phlebotomist Modal */}
      {showForm && <PhlebotomistForm
        form={form} setForm={setForm} editing={editing}
        selectedAreas={selectedAreas} toggleArea={toggleArea}
        expandedSections={expandedSections} toggleSection={toggleSection}
        toggleEquipment={toggleEquipment}
        onSave={handleSave} onClose={() => setShowForm(false)}
      />}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10, minWidth: 120 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
        <div style={{ fontSize: 11, color: '#64748b' }}>{label}</div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: '8px 16px', borderRadius: 8, border: active ? 'none' : '1px solid #e2e8f0', background: active ? '#0f172a' : '#fff', color: active ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: active ? 600 : 400 }}>
      {children}
    </button>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function PhlebotomistForm({ form, setForm, editing, selectedAreas, toggleArea, expandedSections, toggleSection, toggleEquipment, onSave, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, width: 600, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ position: 'sticky', top: 0, background: '#fff', padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, borderRadius: '16px 16px 0 0' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{editing ? 'Edit Phlebotomist' : 'Add Phlebotomist'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94a3b8', padding: 4 }}>✕</button>
        </div>
        <div style={{ padding: '16px 24px 24px' }}>
          {/* 1. Personal Information */}
          <CollapsibleSection title="Personal Information" expanded={expandedSections.personal} onToggle={() => toggleSection('personal')}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <FormField label="Full Name *">
                <input placeholder="Ashok Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Profile Photo">
                <input placeholder="Image URL" value={form.profilePhoto} onChange={e => setForm({ ...form, profilePhoto: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Gender">
                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} style={inputStyle}>
                  <option value="">Select gender...</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </FormField>
              <FormField label="Date of Birth">
                <input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Mobile Number *">
                <input placeholder="Required for login & communication" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Email Address">
                <input placeholder="Optional" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              </FormField>
            </div>
          </CollapsibleSection>

          {/* 2. Professional Information */}
          <CollapsibleSection title="Professional Information" expanded={expandedSections.professional} onToggle={() => toggleSection('professional')}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <FormField label="Employee ID">
                <input placeholder={editing?.employeeId || 'Auto-generated'} value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} style={inputStyle} disabled={!editing} />
              </FormField>
              <FormField label="Qualification">
                <select value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} style={inputStyle}>
                  <option value="">Select qualification...</option>
                  {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </FormField>
              <FormField label="Experience (Years)">
                <input type="number" placeholder="e.g. 5" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Joining Date">
                <input type="date" value={form.joiningDate} onChange={e => setForm({ ...form, joiningDate: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Employment Type">
                <select value={form.employmentType} onChange={e => setForm({ ...form, employmentType: e.target.value })} style={inputStyle}>
                  <option value="">Select type...</option>
                  {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </FormField>
            </div>
          </CollapsibleSection>

          {/* 3. Documents Verification */}
          <CollapsibleSection title="Documents Verification" expanded={expandedSections.documents} onToggle={() => toggleSection('documents')}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <FormField label="Identity Proof (URL)">
                <input placeholder="Upload link" value={form.identityProof} onChange={e => setForm({ ...form, identityProof: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Aadhaar (URL)">
                <input placeholder="Upload link" value={form.aadhaar} onChange={e => setForm({ ...form, aadhaar: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="PAN (URL)">
                <input placeholder="Upload link" value={form.pan} onChange={e => setForm({ ...form, pan: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Driving License (URL)">
                <input placeholder="Upload link" value={form.drivingLicense} onChange={e => setForm({ ...form, drivingLicense: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Qualification Certificate (URL)">
                <input placeholder="Upload link" value={form.qualificationCert} onChange={e => setForm({ ...form, qualificationCert: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Training Certificate (URL)">
                <input placeholder="Optional" value={form.trainingCertificate} onChange={e => setForm({ ...form, trainingCertificate: e.target.value })} style={inputStyle} />
              </FormField>
              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label="Background Verification Status">
                  <select value={form.backgroundVerification} onChange={e => setForm({ ...form, backgroundVerification: e.target.value })} style={inputStyle}>
                    {BG_VERIFY_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </FormField>
              </div>
            </div>
          </CollapsibleSection>

          {/* 4. Service Area Management */}
          <CollapsibleSection title="Service Area Management" expanded={expandedSections.areas} onToggle={() => toggleSection('areas')}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {ALL_AREAS.map(area => (
                <label key={area} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: selectedAreas.includes(area) ? '1px solid #3b82f6' : '1px solid #e2e8f0', background: selectedAreas.includes(area) ? '#eff6ff' : '#fff', cursor: 'pointer', fontSize: 12 }}>
                  <input type="checkbox" checked={selectedAreas.includes(area)} onChange={() => toggleArea(area)} style={{ accentColor: '#3b82f6' }} />
                  {area}
                </label>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <FormField label="Maximum Travel Distance (km)">
                <input type="number" placeholder="e.g. 20" value={form.maxTravelDistance} onChange={e => setForm({ ...form, maxTravelDistance: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Preferred Working Areas">
                <input placeholder="e.g. Near Hitech City" value={form.preferredWorkingAreas} onChange={e => setForm({ ...form, preferredWorkingAreas: e.target.value })} style={inputStyle} />
              </FormField>
            </div>
          </CollapsibleSection>

          {/* 5. Availability Management */}
          <CollapsibleSection title="Availability Management" expanded={expandedSections.availability} onToggle={() => toggleSection('availability')}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <FormField label="Working Status">
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                  <option value="available">🟢 Available</option>
                  <option value="busy">🟡 Busy</option>
                  <option value="offline">🔴 Offline</option>
                  <option value="leave">⚫ Leave</option>
                </select>
              </FormField>
              <FormField label="Working Schedule">
                <input placeholder="e.g. Monday - Saturday" value={form.workingSchedule} onChange={e => setForm({ ...form, workingSchedule: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Working Time">
                <input placeholder="e.g. 6 AM - 2 PM" value={form.workingTime} onChange={e => setForm({ ...form, workingTime: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Slot Capacity (bookings/day)">
                <input type="number" placeholder="e.g. 10" value={form.slotCapacity} onChange={e => setForm({ ...form, slotCapacity: e.target.value })} style={inputStyle} />
              </FormField>
            </div>
          </CollapsibleSection>

          {/* 6. Vehicle / Transport Details */}
          <CollapsibleSection title="Vehicle / Transport Details" expanded={expandedSections.transport} onToggle={() => toggleSection('transport')}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <FormField label="Transport Type">
                <select value={form.transportType} onChange={e => setForm({ ...form, transportType: e.target.value })} style={inputStyle}>
                  <option value="">Select transport...</option>
                  {TRANSPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </FormField>
              <FormField label="Vehicle Number">
                <input placeholder="e.g. TS09AB1234" value={form.vehicleNumber} onChange={e => setForm({ ...form, vehicleNumber: e.target.value })} style={inputStyle} />
              </FormField>
            </div>
          </CollapsibleSection>

          {/* 7. Collection Equipment Tracking */}
          <CollapsibleSection title="Collection Equipment Tracking" expanded={expandedSections.equipment} onToggle={() => toggleSection('equipment')}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {EQUIPMENT_ITEMS.map(item => (
                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: (form.equipment || []).includes(item) ? '1px solid #22c55e' : '1px solid #e2e8f0', background: (form.equipment || []).includes(item) ? '#f0fdf4' : '#fff', cursor: 'pointer', fontSize: 12 }}>
                  <input type="checkbox" checked={(form.equipment || []).includes(item)} onChange={() => toggleEquipment(item)} style={{ accentColor: '#22c55e' }} />
                  {item}
                </label>
              ))}
            </div>
          </CollapsibleSection>

          {/* 8. Login Access */}
          <CollapsibleSection title="Login Access" expanded={expandedSections.login} onToggle={() => toggleSection('login')}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <FormField label="Username">
                <input placeholder="Username for app login" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Password (optional)">
                <input type="password" placeholder="Leave blank for mobile OTP" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} />
              </FormField>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: '#64748b', background: '#f8fafc', padding: 12, borderRadius: 8 }}>
              <strong>Permissions:</strong><br />
              ✅ View assigned bookings · Accept jobs · Update collection status · Upload patient verification · Scan barcode<br />
              ❌ View financial data · Access other patients
            </div>
          </CollapsibleSection>

          {/* 9. Emergency Contact */}
          <CollapsibleSection title="Emergency Contact" expanded={expandedSections.emergency} onToggle={() => toggleSection('emergency')}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <FormField label="Contact Name">
                <input value={form.emergencyContactName} onChange={e => setForm({ ...form, emergencyContactName: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Relationship">
                <input value={form.emergencyContactRelationship} onChange={e => setForm({ ...form, emergencyContactRelationship: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Phone Number">
                <input value={form.emergencyContactPhone} onChange={e => setForm({ ...form, emergencyContactPhone: e.target.value })} style={inputStyle} />
              </FormField>
            </div>
          </CollapsibleSection>

          {/* 10. Bank Details */}
          <CollapsibleSection title="Bank Details" expanded={expandedSections.bank} onToggle={() => toggleSection('bank')}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <FormField label="Account Holder Name">
                <input value={form.bankAccountHolder} onChange={e => setForm({ ...form, bankAccountHolder: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Bank Name">
                <input value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Account Number">
                <input value={form.bankAccountNumber} onChange={e => setForm({ ...form, bankAccountNumber: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="IFSC Code">
                <input placeholder="e.g. SBIN0001234" value={form.bankIfsc} onChange={e => setForm({ ...form, bankIfsc: e.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="UPI ID">
                <input placeholder="e.g. name@upi" value={form.bankUpiId} onChange={e => setForm({ ...form, bankUpiId: e.target.value })} style={inputStyle} />
              </FormField>
            </div>
          </CollapsibleSection>

          {/* Form Actions */}
          <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', color: '#64748b' }}>Cancel</button>
            <button onClick={onSave} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>
              {editing ? 'Update Phlebotomist' : 'Save Phlebotomist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, expanded, onToggle, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div onClick={onToggle} style={sectionHeader}>
        <span>{title}</span>
        <span style={{ fontSize: 14, color: '#94a3b8', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </div>
      {expanded && <div style={{ paddingTop: 4 }}>{children}</div>}
    </div>
  );
}

function PerformanceDashboard({ phlebo, assignedOrders, totalCollections, todayCollections, monthlyCollections, onBack, onEdit }) {
  const rating = phlebo.patientRating || '—';
  const sampleRejection = phlebo.sampleRejectionRate || 0;
  const complaints = phlebo.complaintCount || 0;
  const avgArrival = phlebo.averageArrivalTime || '—';
  const collectionTAT = phlebo.collectionTAT || '—';
  const incentives = phlebo.incentivesEarned || 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748b', padding: 4 }}>←</button>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#4338ca' }}>
            {phlebo.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{phlebo.name}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{phlebo.employeeId || phlebo.id} · {phlebo.qualification || '—'}</div>
          </div>
        </div>
        <button onClick={onEdit} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#334155' }}>Edit Profile</button>
      </div>

      {/* Performance Grid */}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', marginBottom: 20 }}>
        <PerfCard title="Total Collections" value={totalCollections} icon="📋" color="#3b82f6" />
        <PerfCard title="Today's Collections" value={todayCollections} icon="📅" color="#22c55e" />
        <PerfCard title="Monthly Collections" value={monthlyCollections} icon="📊" color="#8b5cf6" />
        <PerfCard title="Patient Rating" value={typeof rating === 'number' ? `${rating}/5` : rating} icon="⭐" color="#f59e0b" />
        <PerfCard title="Sample Rejection" value={`${sampleRejection}%`} icon="❌" color={sampleRejection > 5 ? '#ef4444' : '#22c55e'} />
        <PerfCard title="Complaints" value={complaints} icon="⚠️" color={complaints > 0 ? '#ef4444' : '#94a3b8'} />
        <PerfCard title="Avg Arrival" value={avgArrival} icon="⏱️" color="#0f172a" />
        <PerfCard title="Collection TAT" value={collectionTAT} icon="🔄" color="#0f172a" />
        <PerfCard title="Incentives Earned" value={incentives ? `₹${incentives}` : '₹0'} icon="💰" color="#10b981" />
      </div>

      {/* Assigned Routes Today */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>Assigned Routes</div>
        {assignedOrders.length === 0 ? (
          <div style={{ fontSize: 13, color: '#94a3b8' }}>No active assignments</div>
        ) : (
          assignedOrders.map(o => (
            <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 12 }}>
              <div><span style={{ fontWeight: 600, color: '#0f172a' }}>{o.id}</span> <span style={{ color: '#64748b' }}>{(o.collectionAddress || '').split(',').slice(0, 2).join(',')}</span></div>
              <span style={{ color: '#3b82f6' }}>{o.collectionDate} {o.collectionTime}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PerfCard({ title, value, icon, color }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 11, color: '#64748b' }}>{title}</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}
