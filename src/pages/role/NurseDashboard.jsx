import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/LanguageProvider';
import useAuthStore from '../../stores/authStore';

const TODAY = new Date().toISOString().slice(0, 10);
const TEAL = '#0891b2';
const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#22c55e', 'in-progress': '#3b82f6', completed: '#0891b2', cancelled: '#ef4444' };

const loadNursingBookings = () => { try { return JSON.parse(localStorage.getItem('jh_nursing_bookings') || '[]'); } catch { return []; } };
const loadDiagnosticsOrders = () => { try { return JSON.parse(localStorage.getItem('jh_orders') || '[]'); } catch { return []; } };

export default function NurseDashboard() {
  const t = useT();
  const user = useAuthStore(s => s.user);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeVisit, setActiveVisit] = useState({ patientId: null, phase: 'before', vitals: {}, procedureLog: '', notes: '', startTime: null, completed: false });
  const [checklist, setChecklist] = useState([
    { id: 'uniform', label: t('role.nurse.uniformReady', 'Uniform ready'), checked: false },
    { id: 'equipment', label: t('role.nurse.equipmentCheck', 'Equipment check done'), checked: false },
    { id: 'route', label: t('role.nurse.routePlanned', 'Route planned'), checked: false },
  ]);
  const [afterVisit, setAfterVisit] = useState({ completed: false, followUpDate: '', careSummary: '', prescription: '' });
  const [showRoute, setShowRoute] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [payoutMsg, setPayoutMsg] = useState('');

  const nursingBookings = useMemo(() => loadNursingBookings(), [activeTab]);
  const diagnosticsOrders = useMemo(() => loadDiagnosticsOrders(), [activeTab]);

  const myPatients = useMemo(() => {
    const nurseName = user?.name || '';
    const fromNursing = nursingBookings.filter(b => b.assignedNurse === nurseName);
    const fromDiagnostics = diagnosticsOrders.filter(o => o.assignedNurse === nurseName);
    return [...fromNursing, ...fromDiagnostics];
  }, [nursingBookings, diagnosticsOrders, user]);

  const todayVisits = useMemo(() => myPatients.filter(p => (p.date || p.collectionDate || p.appointmentDate || '') === TODAY), [myPatients]);
  const activeCases = useMemo(() => myPatients.filter(p => p.status === 'in-progress' || p.status === 'confirmed'), [myPatients]);
  const completedVisits = useMemo(() => myPatients.filter(p => p.status === 'completed'), [myPatients]);

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return myPatients;
    const q = searchQuery.toLowerCase();
    return myPatients.filter(p => {
      const name = p.patientName || p.patientInfo?.name || p.bookedFor || '';
      const service = p.service || p.test || p.patientInfo?.condition || '';
      return name.toLowerCase().includes(q) || service.toLowerCase().includes(q);
    });
  }, [myPatients, searchQuery]);

  const monthlyEarnings = useMemo(() => {
    const monthStart = new Date();
    monthStart.setDate(1);
    return completedVisits.filter(p => {
      const d = new Date(p.date || p.collectionDate || p.completedAt || 0);
      return d >= monthStart;
    }).reduce((sum, p) => sum + (p.amount || p.fee || 0), 0);
  }, [completedVisits]);

  const getPatientName = (p) => p.patientName || p.patientInfo?.name || p.bookedFor || '—';
  const getPatientService = (p) => p.service || p.test || p.patientInfo?.condition || p.condition || '—';
  const getPatientDate = (p) => p.date || p.collectionDate || p.appointmentDate || '—';
  const getPatientTime = (p) => p.time || p.collectionTime || p.appointmentTime || '—';
  const getPatientAddress = (p) => p.address || p.patientInfo?.location || p.location || '—';
  const getPatientPhone = (p) => p.phone || p.mobile || p.patientInfo?.mobile || '';
  const getPatientAmount = (p) => p.amount || p.fee || 0;

  const startTimer = () => {
    setActiveVisit(v => ({ ...v, startTime: Date.now() }));
    setTimerRunning(true);
  };

  const stopTimer = () => {
    if (activeVisit.startTime) {
      setElapsed(prev => prev + (Date.now() - activeVisit.startTime));
    }
    setActiveVisit(v => ({ ...v, startTime: null }));
    setTimerRunning(false);
  };

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleChecklist = (id) => {
    setChecklist(c => c.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const updateVitals = (field, value) => {
    setActiveVisit(v => ({ ...v, vitals: { ...v.vitals, [field]: value } }));
  };

  const completeVisit = () => {
    const all = JSON.parse(localStorage.getItem('jh_nursing_bookings') || '[]').map(b =>
      (b.id === selectedPatient?.id || b._id === selectedPatient?._id) && b.assignedNurse === user?.name
        ? { ...b, status: 'completed', completedAt: new Date().toISOString(), vitals: activeVisit.vitals, procedureLog: activeVisit.procedureLog, notes: activeVisit.notes, afterVisit }
        : b
    );
    localStorage.setItem('jh_nursing_bookings', JSON.stringify(all));

    const orders = JSON.parse(localStorage.getItem('jh_orders') || '[]').map(o =>
      (o.id === selectedPatient?.id || o._id === selectedPatient?._id) && o.assignedNurse === user?.name
        ? { ...o, status: 'completed', completedAt: new Date().toISOString(), vitals: activeVisit.vitals, procedureLog: activeVisit.procedureLog, notes: activeVisit.notes, afterVisit }
        : o
    );
    localStorage.setItem('jh_orders', JSON.stringify(orders));

    setActiveVisit({ patientId: null, phase: 'before', vitals: {}, procedureLog: '', notes: '', startTime: null, completed: false });
    setAfterVisit({ completed: false, followUpDate: '', careSummary: '', prescription: '' });
    setSelectedPatient(null);
    setTimerRunning(false);
    setElapsed(0);
    setChecklist(c => c.map(item => ({ ...item, checked: false })));
  };

  const requestPayout = () => {
    const payouts = JSON.parse(localStorage.getItem('jh_nurse_payouts') || '[]');
    payouts.push({ id: Date.now(), nurseName: user?.name, amount: monthlyEarnings, date: new Date().toISOString(), status: 'pending' });
    localStorage.setItem('jh_nurse_payouts', JSON.stringify(payouts));
    setPayoutMsg(t('role.nurse.payoutRequested', 'Payout requested successfully!'));
    setTimeout(() => setPayoutMsg(''), 3000);
  };

  const tabs = [
    { id: 'dashboard', label: t('role.nurse.dashboard', '📊 Dashboard'), icon: '📊' },
    { id: 'patients', label: t('role.nurse.myPatients', '👥 My Patients'), icon: '👥' },
    { id: 'visit', label: t('role.nurse.visitWorkflow', '🏥 Visit Workflow'), icon: '🏥' },
    { id: 'route', label: t('role.nurse.routeMap', '🗺️ Route Map'), icon: '🗺️' },
    { id: 'payments', label: t('role.nurse.paymentsTitle', '💰 Payments'), icon: '💰' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', borderRadius: 16, padding: '24px 28px', marginBottom: 20, color: '#fff' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 2px' }}>{t('role.nurse.welcome', 'Welcome, ')}{user?.name || t('role.nurse.nurse', 'Nurse')}</h2>
        <p style={{ fontSize: 12, opacity: 0.85, margin: 0 }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: activeTab === t.id ? TEAL : '#f1f5f9', color: activeTab === t.id ? '#fff' : '#475569', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>{t.label}</button>
        ))}
      </div>

      {/* TAB 1: Dashboard */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: 16 }}>
            <StatCard value={myPatients.length} label={t('role.nurse.totalPatients', 'Total Patients')} color={TEAL} />
            <StatCard value={todayVisits.length} label={t('role.nurse.todaysVisits', "Today's Visits")} color="#06b6d4" />
            <StatCard value={activeCases.length} label={t('role.nurse.activeCases', 'Active Cases')} color="#f59e0b" />
            <StatCard value={completedVisits.length} label={t('role.nurse.completed', 'Completed')} color="#22c55e" />
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <button onClick={() => { setActiveTab('visit'); }} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: TEAL, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{t('role.nurse.startVisit', '🚀 Start Visit')}</button>
            <button onClick={() => setActiveTab('route')} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #d0d5dd', background: '#fff', color: '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{t('role.nurse.viewSchedule', '📋 View Schedule')}</button>
            <Link to="/support" style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #d0d5dd', background: '#fff', color: '#475569', fontSize: 12, fontWeight: 700, textDecoration: 'none', fontFamily: 'inherit' }}>{t('role.nurse.contactSupport', '📞 Contact Support')}</Link>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('role.nurse.todaysSchedule', "📋 Today's Schedule")}</h4>
            {todayVisits.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 24 }}>{t('role.nurse.noVisitsToday', 'No visits scheduled for today.')}</p>
            ) : todayVisits.map(p => (
              <div key={p.id || p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{getPatientName(p)}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{getPatientTime(p)} · {getPatientService(p)} · {getPatientAddress(p)}</div>
                </div>
                <span style={{ padding: '2px 10px', borderRadius: 20, background: (STATUS_COLORS[p.status] || '#94a3b8') + '20', color: STATUS_COLORS[p.status] || '#94a3b8', fontSize: 10, fontWeight: 600 }}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: My Patients */}
      {activeTab === 'patients' && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('role.nurse.searchPatients', '🔍 Search patients by name or service...')} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {filteredPatients.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, padding: 40, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>{t('role.nurse.noPatientsAssigned', 'No patients assigned yet.')}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {filteredPatients.map(p => {
                const isExpanded = selectedPatient?.id === p.id || selectedPatient?._id === p._id;
                return (
                  <div key={p.id || p._id} style={{ background: '#fff', borderRadius: 12, padding: 14, border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => setSelectedPatient(isExpanded ? null : p)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{getPatientName(p)}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{getPatientService(p)} · {getPatientDate(p)} · {getPatientTime(p)}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{getPatientAddress(p)}</div>
                      </div>
                      <span style={{ padding: '2px 10px', borderRadius: 20, background: (STATUS_COLORS[p.status] || '#94a3b8') + '20', color: STATUS_COLORS[p.status] || '#94a3b8', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>{p.status}</span>
                    </div>
                    {isExpanded && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                        <InfoRow icon="📞" label={t('role.nurse.phone', 'Phone')} value={getPatientPhone(p)} />
                        <InfoRow icon="📋" label={t('role.nurse.medicalNotes', 'Medical Notes')} value={p.medicalNotes || p.patientInfo?.notes || '—'} />
                        <InfoRow icon="🏥" label={t('role.nurse.serviceDetails', 'Service Details')} value={getPatientService(p)} />
                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                          {getPatientDate(p) === TODAY && (
                            <button onClick={(e) => { e.stopPropagation(); setSelectedPatient(p); setActiveVisit(v => ({ ...v, patientId: p.id || p._id, phase: 'before' })); setActiveTab('visit'); }} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: TEAL, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{t('role.nurse.startVisit', '🚀 Start Visit')}</button>
                          )}
                          {getPatientPhone(p) && (
                            <a href={`https://wa.me/91${getPatientPhone(p).replace(/\D/g, '')}`} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #25D366', background: '#fff', color: '#25D366', fontSize: 11, fontWeight: 700, textDecoration: 'none', fontFamily: 'inherit' }}>{t('role.nurse.whatsapp', '💬 WhatsApp')}</a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Visit Workflow */}
      {activeTab === 'visit' && (
        <div>
          {!selectedPatient ? (
            <div style={{ background: '#fff', borderRadius: 12, padding: 40, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>{t('role.nurse.selectPatient', 'Select a patient from My Patients tab to start a visit.')}</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {['before', 'during', 'after'].map(p => (
                  <button key={p} onClick={() => setActiveVisit(v => ({ ...v, phase: p }))} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: activeVisit.phase === p ? TEAL : '#f1f5f9', color: activeVisit.phase === p ? '#fff' : '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {p === 'before' ? t('role.nurse.beforeVisit', '📋 Before Visit') : p === 'during' ? t('role.nurse.duringVisit', '🩺 During Visit') : t('role.nurse.afterVisit', '✅ After Visit')}
                  </button>
                ))}
              </div>

              <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{getPatientName(selectedPatient)}</h3>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{getPatientService(selectedPatient)} · {getPatientAddress(selectedPatient)} · {getPatientDate(selectedPatient)} @ {getPatientTime(selectedPatient)}</p>
                  </div>
                  <span style={{ padding: '2px 10px', borderRadius: 20, background: (STATUS_COLORS[selectedPatient.status] || '#94a3b8') + '20', color: STATUS_COLORS[selectedPatient.status] || '#94a3b8', fontSize: 10, fontWeight: 600 }}>{selectedPatient.status}</span>
                </div>
              </div>

              {activeVisit.phase === 'before' && (
                <div>
                  <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('role.nurse.patientDetails', 'Patient Details')}</h4>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <InfoRow icon="👤" label={t('role.nurse.name', 'Name')} value={getPatientName(selectedPatient)} />
                      <InfoRow icon="📞" label={t('role.nurse.phone', 'Phone')} value={getPatientPhone(selectedPatient)} />
                      <InfoRow icon="📍" label={t('role.nurse.address', 'Address')} value={getPatientAddress(selectedPatient)} />
                      <InfoRow icon="🏥" label={t('role.nurse.service', 'Service')} value={getPatientService(selectedPatient)} />
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(getPatientAddress(selectedPatient))}`} target="_blank" rel="noopener" style={{ padding: '8px 16px', borderRadius: 8, background: TEAL, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>🗺️ {t('role.nurse.navigate', 'Navigate')}</a>
                      <a href={`tel:${getPatientPhone(selectedPatient)}`} style={{ padding: '8px 16px', borderRadius: 8, background: '#22c55e', color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>📞 {t('role.nurse.call', 'Call Patient')}</a>
                    </div>
                  </div>
                  <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('role.nurse.checklist', '✅ Visit Checklist')}</h4>
                    {checklist.map(item => (
                      <div key={item.id} onClick={() => toggleChecklist(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ width: 18, height: 18, borderRadius: 4, border: item.checked ? 'none' : '2px solid #d0d5dd', background: item.checked ? TEAL : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 700 }}>{item.checked ? '✓' : ''}</div>
                        <span style={{ fontSize: 12, color: item.checked ? '#0891b2' : '#475569', fontWeight: item.checked ? 600 : 400 }}>{item.label}</span>
                      </div>
                    ))}
                    <button onClick={() => setActiveVisit(v => ({ ...v, phase: 'during' }))} disabled={!checklist.every(i => i.checked)} style={{ width: '100%', marginTop: 12, padding: '10px', borderRadius: 8, border: 'none', background: checklist.every(i => i.checked) ? TEAL : '#e2e8f0', color: checklist.every(i => i.checked) ? '#fff' : '#94a3b8', fontSize: 13, fontWeight: 700, cursor: checklist.every(i => i.checked) ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>{t('role.nurse.proceedToVisit', 'Proceed to Visit →')}</button>
                  </div>
                </div>
              )}

              {activeVisit.phase === 'during' && (
                <div>
                  <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('role.nurse.vitalSigns', '📊 Vital Signs')}</h4>
                    <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.nurse.bpSystolic', 'BP Systolic')}</label>
                        <input type="number" value={activeVisit.vitals.bpSystolic || ''} onChange={e => updateVitals('bpSystolic', e.target.value)} placeholder="120" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.nurse.bpDiastolic', 'BP Diastolic')}</label>
                        <input type="number" value={activeVisit.vitals.bpDiastolic || ''} onChange={e => updateVitals('bpDiastolic', e.target.value)} placeholder="80" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.nurse.pulse', 'Pulse (bpm)')}</label>
                        <input type="number" value={activeVisit.vitals.pulse || ''} onChange={e => updateVitals('pulse', e.target.value)} placeholder="72" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.nurse.temperature', 'Temperature (°F)')}</label>
                        <input type="number" step="0.1" value={activeVisit.vitals.temperature || ''} onChange={e => updateVitals('temperature', e.target.value)} placeholder="98.6" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.nurse.spo2', 'SpO₂ (%)')}</label>
                        <input type="number" value={activeVisit.vitals.spo2 || ''} onChange={e => updateVitals('spo2', e.target.value)} placeholder="98" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.nurse.bloodSugar', 'Blood Sugar (mg/dL)')}</label>
                        <input type="number" value={activeVisit.vitals.bloodSugar || ''} onChange={e => updateVitals('bloodSugar', e.target.value)} placeholder="100" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.nurse.painLevel', 'Pain Level (1-10)')}</label>
                        <input type="range" min="1" max="10" value={activeVisit.vitals.painLevel || 1} onChange={e => updateVitals('painLevel', +e.target.value)} style={{ width: '100%', accentColor: TEAL }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: TEAL }}>{activeVisit.vitals.painLevel || 1}/10</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('role.nurse.procedureLog', '📝 Procedure Log')}</h4>
                    <textarea value={activeVisit.procedureLog} onChange={e => setActiveVisit(v => ({ ...v, procedureLog: e.target.value }))} placeholder={t('role.nurse.procedurePlaceholder', 'Describe the nursing procedures performed...')} rows={3} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                  </div>
                  <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('role.nurse.notes', '📋 Notes')}</h4>
                    <textarea value={activeVisit.notes} onChange={e => setActiveVisit(v => ({ ...v, notes: e.target.value }))} placeholder={t('role.nurse.notesPlaceholder', 'Additional observations, patient feedback...')} rows={3} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    {!timerRunning ? (
                      <button onClick={startTimer} style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: TEAL, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>⏱️ {t('role.nurse.startTimer', 'Start Timer')}</button>
                    ) : (
                      <button onClick={stopTimer} style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>⏱️ {t('role.nurse.endTimer', 'End Timer')} ({formatTime(elapsed + (activeVisit.startTime ? Date.now() - activeVisit.startTime : 0))})</button>
                    )}
                  </div>
                  <button onClick={() => setActiveVisit(v => ({ ...v, phase: 'after' }))} disabled={!activeVisit.vitals.bpSystolic} style={{ width: '100%', padding: '12px', borderRadius: 8, border: 'none', background: activeVisit.vitals.bpSystolic ? TEAL : '#e2e8f0', color: activeVisit.vitals.bpSystolic ? '#fff' : '#94a3b8', fontSize: 13, fontWeight: 700, cursor: activeVisit.vitals.bpSystolic ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>{t('role.nurse.nextToAfter', 'Continue to After Visit →')}</button>
                </div>
              )}

              {activeVisit.phase === 'after' && (
                <div>
                  <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('role.nurse.afterCare', '✅ After Visit')}</h4>
                    <div style={{ display: 'grid', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input type="checkbox" checked={afterVisit.completed} onChange={e => setAfterVisit(a => ({ ...a, completed: e.target.checked }))} style={{ accentColor: TEAL, width: 16, height: 16 }} />
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{t('role.nurse.serviceCompleted', 'Service completed')}</label>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.nurse.followUpDate', 'Follow-up Date')}</label>
                        <input type="date" value={afterVisit.followUpDate} onChange={e => setAfterVisit(a => ({ ...a, followUpDate: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.nurse.careSummary', 'Care Summary')}</label>
                        <textarea value={afterVisit.careSummary} onChange={e => setAfterVisit(a => ({ ...a, careSummary: e.target.value }))} placeholder={t('role.nurse.careSummaryPlaceholder', 'Summary of care provided, patient condition...')} rows={3} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.nurse.prescription', 'Prescription / Medication Notes')}</label>
                        <textarea value={afterVisit.prescription} onChange={e => setAfterVisit(a => ({ ...a, prescription: e.target.value }))} placeholder={t('role.nurse.prescriptionPlaceholder', 'Medication given, dosage, instructions...')} rows={3} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setActiveVisit(v => ({ ...v, phase: 'during' }))} style={{ padding: '12px 20px', borderRadius: 8, border: '1px solid #d0d5dd', background: '#fff', color: '#475569', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{t('role.nurse.back', '← Back')}</button>
                    <button onClick={completeVisit} disabled={!afterVisit.completed} style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: afterVisit.completed ? '#22c55e' : '#e2e8f0', color: afterVisit.completed ? '#fff' : '#94a3b8', fontSize: 13, fontWeight: 700, cursor: afterVisit.completed ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>{t('role.nurse.completeVisit', '✅ Complete Visit')}</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB 4: Route Map */}
      {activeTab === 'route' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#0f172a' }}>{t('role.nurse.routeTitle', "🗺️ Today's Route")}</h4>
            <button onClick={() => setShowRoute(!showRoute)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: TEAL, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{showRoute ? t('role.nurse.hideRoute', 'Hide Route') : t('role.nurse.showRoute', 'Show Route')}</button>
          </div>
          {todayVisits.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, padding: 40, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>{t('role.nurse.noRoute', 'No visits scheduled today.')}</p>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
              {todayVisits.map((p, i) => (
                <div key={p.id || p._id} style={{ display: 'flex', gap: 12, marginBottom: i < todayVisits.length - 1 ? 16 : 0, position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: TEAL, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>{i + 1}</div>
                    {i < todayVisits.length - 1 && <div style={{ width: 2, flex: 1, background: '#e2e8f0', margin: '4px 0' }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 4 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{getPatientName(p)}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{getPatientTime(p)} · {getPatientAddress(p)} · {t('role.nurse.distance', '~4.5 km')}</div>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(getPatientAddress(p))}`} target="_blank" rel="noopener" style={{ fontSize: 11, color: TEAL, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}>🗺️ {t('role.nurse.navigate', 'Navigate')}</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Payments */}
      {activeTab === 'payments' && (
        <div>
          {payoutMsg && (
            <div style={{ background: '#dcfce7', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 12, fontWeight: 600, color: '#16a34a' }}>{payoutMsg}</div>
          )}
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#0f172a' }}>{t('role.nurse.paymentsTitle', '💰 Payment History')}</h4>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: TEAL }}>₹{monthlyEarnings.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{t('role.nurse.totalEarnings', 'Earnings this month')}</div>
              </div>
            </div>
          </div>
          {completedVisits.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, padding: 40, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>{t('role.nurse.noPayments', 'No completed visits yet.')}</p>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 16 }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ textAlign: 'left', padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>{t('role.nurse.patient', 'Patient')}</th>
                      <th style={{ textAlign: 'left', padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>{t('role.nurse.date', 'Date')}</th>
                      <th style={{ textAlign: 'left', padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>{t('role.nurse.service', 'Service')}</th>
                      <th style={{ textAlign: 'left', padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>{t('role.nurse.amount', 'Amount')}</th>
                      <th style={{ textAlign: 'left', padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>{t('role.nurse.status', 'Status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedVisits.map(p => (
                      <tr key={p.id || p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 600 }}>{getPatientName(p)}</td>
                        <td style={{ padding: '8px 10px', color: '#64748b' }}>{getPatientDate(p)}</td>
                        <td style={{ padding: '8px 10px', color: '#64748b' }}>{getPatientService(p)}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: '#16a34a' }}>₹{getPatientAmount(p)}</td>
                        <td style={{ padding: '8px 10px' }}><span style={{ padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#16a34a', fontSize: 10, fontWeight: 600 }}>{t('role.nurse.paid', 'Paid')}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <button onClick={requestPayout} style={{ width: '100%', padding: '12px', borderRadius: 8, border: 'none', background: TEAL, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{t('role.nurse.requestPayout', '💰 Request Payout')}</button>
        </div>
      )}
    </div>
  );
}

function StatCard({ value, label, color }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 16, textAlign: 'center', border: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 12 }}>
      <span style={{ color: '#64748b', fontWeight: 500 }}>{icon && <span style={{ marginRight: 4 }}>{icon}</span>}{label}</span>
      <span style={{ color: '#0f172a', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}
