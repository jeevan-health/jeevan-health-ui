import { useState, useMemo, useEffect } from 'react';
import useAuthStore from '../../stores/authStore';
import { getOrders } from '../../services/localOrderService';
import { useT } from '../../i18n/LanguageProvider';

const TODAY = new Date().toISOString().slice(0, 10);
const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#22c55e', 'in-progress': '#3b82f6', completed: '#6366f1', cancelled: '#ef4444' };

export default function PhysioDashboard() {
  const t = useT();
  const user = useAuthStore(s => s.user);
  const [orders] = useState(() => getOrders());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [visitPhase, setVisitPhase] = useState('before');
  const [assessment, setAssessment] = useState({ painScore: 0, mobilityScore: 0, rom: 0, muscleStrength: 0, notes: '' });
  const [treatmentGiven, setTreatmentGiven] = useState([]);
  const [afterVisit, setAfterVisit] = useState({ nextDate: '', nextTime: '', exercisePlan: '', progress: '' });
  const [showRoute, setShowRoute] = useState(false);

  const myPatients = useMemo(() => orders.filter(o => o.physio === user?.name || o.physioPhone === user?.phone), [orders, user]);
  const todaySessions = useMemo(() => myPatients.filter(o => o.collectionDate === TODAY), [myPatients]);
  const pendingSessions = useMemo(() => myPatients.filter(o => o.status === 'confirmed'), [myPatients]);

  const treatmentOptions = [
    { id: 'manual', label: t('role.physio.manualTherapy', 'Manual Therapy'), icon: '🤲' },
    { id: 'exercise', label: t('role.physio.exerciseTherapy', 'Exercise Therapy'), icon: '🏋️' },
    { id: 'electro', label: t('role.physio.electrotherapy', 'Electrotherapy'), icon: '⚡' },
    { id: 'dry', label: t('role.physio.dryNeedling', 'Dry Needling'), icon: '📍' },
    { id: 'stretching', label: t('role.physio.stretching', 'Stretching'), icon: '🧘' },
    { id: 'strength', label: t('role.physio.strengthTraining', 'Strength Training'), icon: '💪' },
  ];

  const toggleTreatment = (id) => {
    setTreatmentGiven(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const completeSession = (patient) => {
    const all = JSON.parse(localStorage.getItem('jh_vaccination_bookings') || '[]').map(o =>
      o.id === patient.id ? { ...o, status: 'completed', completedAt: new Date().toISOString(), assessment, treatmentGiven, afterVisit } : o
    );
    localStorage.setItem('jh_vaccination_bookings', JSON.stringify(all));
    setVisitPhase('before');
    setSelectedPatient(null);
    setAssessment({ painScore: 0, mobilityScore: 0, rom: 0, muscleStrength: 0, notes: '' });
    setTreatmentGiven([]);
    setAfterVisit({ nextDate: '', nextTime: '', exercisePlan: '', progress: '' });
  };

  const tabs = [
    { id: 'dashboard', label: t('role.physio.dashboard', '📊 Dashboard'), icon: '📊' },
    { id: 'patients', label: t('role.physio.patients', '👥 My Patients'), icon: '👥' },
    { id: 'visit', label: t('role.physio.visitWorkflow', '🏥 Visit Workflow'), icon: '🏥' },
    { id: 'route', label: t('role.physio.routeMap', '🗺️ Route Map'), icon: '🗺️' },
    { id: 'payments', label: t('role.physio.payments', '💰 Payments'), icon: '💰' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0D9488, #14B8A6)', borderRadius: 16, padding: '24px 28px', marginBottom: 20, color: '#fff' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 2px' }}>{t('role.physio.welcome', 'Welcome, ')}{user?.name || t('role.physio.therapist', 'Therapist')}</h2>
        <p style={{ fontSize: 12, opacity: 0.85, margin: 0 }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: activeTab === t.id ? '#0D9488' : '#f1f5f9', color: activeTab === t.id ? '#fff' : '#475569', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>{t.label}</button>
        ))}
      </div>

      {/* TAB: Dashboard */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: 16 }}>
            <StatCard value={myPatients.length} label={t('role.physio.totalPatients', 'Total Patients')} color="#0D9488" />
            <StatCard value={todaySessions.length} label={t('role.physio.todaysSessions', "Today's Sessions")} color="#14B8A6" />
            <StatCard value={pendingSessions.length} label={t('role.physio.pending', 'Pending')} color="#f59e0b" />
            <StatCard value={myPatients.filter(o => o.status === 'completed').length} label={t('role.physio.completed', 'Completed')} color="#6366f1" />
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('role.physio.todaysSchedule', "📋 Today's Schedule")}</h4>
            {todaySessions.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 24 }}>{t('role.physio.noTodaySessions', 'No sessions scheduled for today.')}</p>
            ) : todaySessions.map(o => (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{o.patientInfo?.name || o.bookedFor || '—'}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{o.collectionTime || '—'} · {o.patientInfo?.condition || o.condition || '—'} · {o.patientInfo?.location || o.location || '—'}</div>
                </div>
                <span style={{ padding: '2px 10px', borderRadius: 20, background: STATUS_COLORS[o.status] + '20', color: STATUS_COLORS[o.status], fontSize: 10, fontWeight: 600 }}>{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: My Patients */}
      {activeTab === 'patients' && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('role.physio.allPatients', '👥 All Patients')}</h4>
          {myPatients.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 24 }}>{t('role.physio.noPatientsAssigned', 'No patients assigned yet.')}</p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {myPatients.map(o => (
                <div key={o.id} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', cursor: 'pointer', background: selectedPatient?.id === o.id ? '#f0fdfa' : '#fff' }} onClick={() => { setSelectedPatient(o); setActiveTab('visit'); setVisitPhase('before'); }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{o.patientInfo?.name || o.bookedFor || '—'}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{o.collectionDate || '—'} · {o.collectionTime || '—'} · {o.patientInfo?.location || o.location || '—'}</div>
                      <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                        {o.patientInfo?.condition && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#f0fdfa', color: '#0D9488', fontWeight: 600 }}>{o.patientInfo.condition}</span>}
                        {o.patientInfo?.previousTreatment?.map(pt => <span key={pt} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#f1f5f9', color: '#64748b' }}>{pt}</span>)}
                      </div>
                    </div>
                    <span style={{ padding: '2px 10px', borderRadius: 20, background: STATUS_COLORS[o.status] + '20', color: STATUS_COLORS[o.status], fontSize: 10, fontWeight: 600 }}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Visit Workflow */}
      {activeTab === 'visit' && (
        <div>
          {!selectedPatient ? (
            <div style={{ background: '#fff', borderRadius: 12, padding: 40, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>{t('role.physio.selectPatient', 'Select a patient from My Patients tab to start a visit.')}</p>
            </div>
          ) : (
            <>
              {/* Phase tabs */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {['before', 'during', 'after'].map(p => (
                  <button key={p} onClick={() => setVisitPhase(p)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: visitPhase === p ? '#0D9488' : '#f1f5f9', color: visitPhase === p ? '#fff' : '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {p === 'before' ? t('role.physio.beforeVisit', '📋 Before Visit') : p === 'during' ? t('role.physio.duringVisit', '🩺 During Visit') : t('role.physio.afterVisit', '✅ After Visit')}
                  </button>
                ))}
              </div>

              {/* Patient Info Bar */}
              <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{selectedPatient.patientInfo?.name || selectedPatient.bookedFor || '—'}</h3>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{selectedPatient.patientInfo?.condition || selectedPatient.condition || '—'} · {selectedPatient.patientInfo?.mode || selectedPatient.mode || '—'} · {selectedPatient.collectionDate || '—'} @ {selectedPatient.collectionTime || '—'}</p>
                  </div>
                  <span style={{ padding: '2px 10px', borderRadius: 20, background: STATUS_COLORS[selectedPatient.status] + '20', color: STATUS_COLORS[selectedPatient.status], fontSize: 10, fontWeight: 600 }}>{selectedPatient.status}</span>
                </div>
              </div>

              {/* BEFORE VISIT */}
              {visitPhase === 'before' && (
                <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('role.physio.beforeDetails', 'Patient Details')}</h4>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <InfoRow label={t('role.physio.condition', 'Condition')} value={selectedPatient.patientInfo?.condition || selectedPatient.condition || '—'} />
                    <InfoRow label={t('role.physio.mode', 'Mode')} value={selectedPatient.patientInfo?.mode || selectedPatient.mode || '—'} />
                    <InfoRow label={t('role.physio.location', 'Location')} value={selectedPatient.patientInfo?.location || selectedPatient.location || '—'} />
                    <InfoRow label={t('role.physio.painLevel', 'Pain Level')} value={selectedPatient.patientInfo?.painScore !== undefined ? `${selectedPatient.patientInfo.painScore}/10` : '—'} />
                    <InfoRow label={t('role.physio.duration', 'Duration')} value={selectedPatient.patientInfo?.painDuration || '—'} />
                    <InfoRow label={t('role.physio.previousTreatment', 'Previous Treatment')} value={selectedPatient.patientInfo?.previousTreatment?.join(', ') || '—'} />
                    <InfoRow label={t('role.physio.reports', 'Reports')} value={selectedPatient.patientInfo?.reports?.length ? `${selectedPatient.patientInfo.reports.length} file(s) uploaded` : '—'} />
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedPatient.patientInfo?.location || selectedPatient.location || 'Hyderabad')}`} target="_blank" rel="noopener" style={{ padding: '8px 16px', borderRadius: 8, background: '#0D9488', color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>🗺️ {t('role.physio.navigate', 'Navigate')}</a>
                    <a href={`tel:${selectedPatient.patientInfo?.mobile || selectedPatient.mobile}`} style={{ padding: '8px 16px', borderRadius: 8, background: '#22c55e', color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>📞 {t('role.physio.call', 'Call Patient')}</a>
                  </div>
                </div>
              )}

              {/* DURING VISIT */}
              {visitPhase === 'during' && (
                <div>
                  <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('role.physio.assessment', '📊 Assessment')}</h4>
                    <div style={{ display: 'grid', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.physio.painScore', 'Pain Score (0-10)')}: <strong>{assessment.painScore}</strong></label>
                        <input type="range" min="0" max="10" value={assessment.painScore} onChange={e => setAssessment(a => ({ ...a, painScore: +e.target.value }))} style={{ width: '100%', accentColor: '#0D9488' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.physio.mobilityScore', 'Mobility Score (0-10)')}: <strong>{assessment.mobilityScore}</strong></label>
                        <input type="range" min="0" max="10" value={assessment.mobilityScore} onChange={e => setAssessment(a => ({ ...a, mobilityScore: +e.target.value }))} style={{ width: '100%', accentColor: '#0D9488' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.physio.rom', 'Range of Motion (0-10)')}: <strong>{assessment.rom}</strong></label>
                        <input type="range" min="0" max="10" value={assessment.rom} onChange={e => setAssessment(a => ({ ...a, rom: +e.target.value }))} style={{ width: '100%', accentColor: '#0D9488' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.physio.muscleStrength', 'Muscle Strength (0-10)')}: <strong>{assessment.muscleStrength}</strong></label>
                        <input type="range" min="0" max="10" value={assessment.muscleStrength} onChange={e => setAssessment(a => ({ ...a, muscleStrength: +e.target.value }))} style={{ width: '100%', accentColor: '#0D9488' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.physio.notes', 'Notes')}</label>
                        <textarea value={assessment.notes} onChange={e => setAssessment(a => ({ ...a, notes: e.target.value }))} placeholder={t('role.physio.notesPlaceholder', 'Assessment notes, observations...')} rows={3} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('role.physio.treatmentGiven', '💉 Treatment Given')}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {treatmentOptions.map(to => (
                        <button key={to.id} onClick={() => toggleTreatment(to.id)} style={{ padding: '8px 14px', borderRadius: 8, border: treatmentGiven.includes(to.id) ? '2px solid #0D9488' : '1px solid #d0d5dd', background: treatmentGiven.includes(to.id) ? '#f0fdfa' : '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', color: treatmentGiven.includes(to.id) ? '#0D9488' : '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                          {to.icon} {to.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setVisitPhase('after')} disabled={treatmentGiven.length === 0} style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: treatmentGiven.length === 0 ? '#e2e8f0' : '#0D9488', color: treatmentGiven.length === 0 ? '#94a3b8' : '#fff', fontSize: 13, fontWeight: 700, cursor: treatmentGiven.length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>{t('role.physio.nextToAfter', 'Continue to After Visit →')}</button>
                  </div>
                </div>
              )}

              {/* AFTER VISIT */}
              {visitPhase === 'after' && (
                <div>
                  <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('role.physio.afterSession', '✅ Session Completion')}</h4>
                    <div style={{ display: 'grid', gap: 12 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.physio.nextDate', 'Next Appointment Date')}</label>
                          <input type="date" value={afterVisit.nextDate} onChange={e => setAfterVisit(a => ({ ...a, nextDate: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.physio.nextTime', 'Next Appointment Time')}</label>
                          <input type="time" value={afterVisit.nextTime} onChange={e => setAfterVisit(a => ({ ...a, nextTime: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.physio.exercisePlan', 'Home Exercise Plan')}</label>
                        <textarea value={afterVisit.exercisePlan} onChange={e => setAfterVisit(a => ({ ...a, exercisePlan: e.target.value }))} placeholder={t('role.physio.exercisePlaceholder', 'Describe the home exercises prescribed...')} rows={3} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{t('role.physio.progress', 'Patient Progress Notes')}</label>
                        <textarea value={afterVisit.progress} onChange={e => setAfterVisit(a => ({ ...a, progress: e.target.value }))} placeholder={t('role.physio.progressPlaceholder', 'How is the patient responding to treatment?')} rows={3} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setVisitPhase('during')} style={{ padding: '12px 20px', borderRadius: 8, border: '1px solid #d0d5dd', background: '#fff', color: '#475569', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{t('role.physio.back', '← Back')}</button>
                    <button onClick={() => completeSession(selectedPatient)} style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: '#22c55e', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{t('role.physio.completeSession', '✅ Complete Session')}</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB: Route Map */}
      {activeTab === 'route' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#0f172a' }}>{t('role.physio.routeTitle', '🗺️ Today\'s Route')}</h4>
            <button onClick={() => setShowRoute(!showRoute)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#0D9488', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{showRoute ? t('role.physio.hideRoute', 'Hide Route') : t('role.physio.showRoute', 'Show Route')}</button>
          </div>
          {todaySessions.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 12, padding: 40, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>{t('role.physio.noRoute', 'No visits scheduled today.')}</p>
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
              {todaySessions.map((o, i) => (
                <div key={o.id} style={{ display: 'flex', gap: 12, marginBottom: i < todaySessions.length - 1 ? 16 : 0, position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0D9488', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>{i + 1}</div>
                    {i < todaySessions.length - 1 && <div style={{ width: 2, flex: 1, background: '#e2e8f0', margin: '4px 0' }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 4 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{o.patientInfo?.name || o.bookedFor || '—'}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{o.collectionTime || '—'} · {o.patientInfo?.location || o.location || '—'}</div>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(o.patientInfo?.location || o.location || 'Hyderabad')}`} target="_blank" rel="noopener" style={{ fontSize: 11, color: '#0D9488', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}>🗺️ {t('role.physio.navigate', 'Navigate')}</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Payments */}
      {activeTab === 'payments' && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('role.physio.paymentsTitle', '💰 Payment History')}</h4>
          {myPatients.filter(o => o.status === 'completed').length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 24 }}>{t('role.physio.noPayments', 'No completed sessions yet.')}</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>{t('role.physio.patient', 'Patient')}</th>
                    <th style={{ textAlign: 'left', padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>{t('role.physio.date', 'Date')}</th>
                    <th style={{ textAlign: 'left', padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>{t('role.physio.amount', 'Amount')}</th>
                    <th style={{ textAlign: 'left', padding: '8px 10px', color: '#64748b', fontWeight: 600 }}>{t('role.physio.status', 'Status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {myPatients.filter(o => o.status === 'completed').map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600 }}>{o.patientInfo?.name || o.bookedFor || '—'}</td>
                      <td style={{ padding: '8px 10px', color: '#64748b' }}>{o.collectionDate || '—'}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 700, color: '#16a34a' }}>{o.amount ? `₹${o.amount}` : '—'}</td>
                      <td style={{ padding: '8px 10px' }}><span style={{ padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#16a34a', fontSize: 10, fontWeight: 600 }}>{t('role.physio.paid', 'Paid')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 12 }}>
      <span style={{ color: '#64748b', fontWeight: 500 }}>{label}</span>
      <span style={{ color: '#0f172a', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}
