import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useDashboardStore, { computeHealthScore, EMPTY_HEALTH } from '../stores/dashboardStore';
import useAuthStore from '../stores/authStore';
import DailyTracker from '../components/DailyTracker';

import { useT } from '../i18n/LanguageProvider';
import useDailyActivityStore from '../stores/dailyActivityStore';
import HealthToolsGrid from '../components/healthTools/HealthToolsGrid';
import PhysioCrossSell from '../components/PhysioCrossSell';
import VaccineCrossSell from '../components/VaccineCrossSell';

const STEP_LABELS = ['Personal', 'Lifestyle', 'Body', 'Family', 'Medical', 'Labs'];

const MEDICAL_CONDITIONS = [
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'highBp', label: 'High BP' },
  { key: 'thyroid', label: 'Thyroid' },
  { key: 'cholesterol', label: 'Cholesterol' },
  { key: 'kidneyDisease', label: 'Kidney Disease' },
  { key: 'liverDisease', label: 'Liver Disease' },
  { key: 'heartDisease', label: 'Heart Disease' },
];

function getSmartRecommendations(computed, healthData) {
  const recs = [];
  const l = healthData.lifestyle || {};
  const fh = healthData.familyHistory || {};
  const med = healthData.medicalHistory || {};
  const lab = healthData.labResults || {};

  if (l.smoking === 'daily' || fh.heartDisease || fh.bp) recs.push({ name: 'Lipid Profile', price: 599, why: 'Heart health assessment recommended' });
  if (fh.diabetes || med.diabetes || lab.hba1c > 5.7) recs.push({ name: 'HbA1c', price: 399, why: 'Diabetes screening' });
  if (l.exercise === 'none' || l.stress === 'very-high') recs.push({ name: 'Thyroid Profile', price: 499, why: 'Stress & metabolism check' });
  if (!lab.vitaminD || lab.vitaminD < 30) recs.push({ name: 'Vitamin D & B12', price: 899, why: 'Common deficiency check' });
  recs.push({ name: 'Complete Blood Count (CBC)', price: 499, why: 'Essential baseline test' });
  recs.push({ name: 'Annual Health Checkup', price: 2499, why: 'Complete wellness review' });
  return recs.slice(0, 3);
}

function StepIndicator({ current, t }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
      {STEP_LABELS.map((label, i) => (
        <div key={label} style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: i + 1 <= current ? '#1866C9' : '#e8edf2', color: i + 1 <= current ? '#fff' : '#94a3b8' }}>
            {i + 1}
          </div>
          <div style={{ fontSize: 9, color: i + 1 <= current ? '#1866C9' : '#94a3b8', fontWeight: i + 1 === current ? 700 : 500 }}>{t ? t(`dashboard.health.step.${label.toLowerCase()}`, label) : label}</div>
        </div>
      ))}
    </div>
  );
}

const nowH = new Date().getHours();
const GREETING = nowH < 12 ? 'Morning' : nowH < 17 ? 'Afternoon' : 'Evening';
const GREETING_ICON = nowH < 12 ? '🌅' : nowH < 17 ? '☀️' : '🌙';

const navItems = [
  { key: 'overview', label: 'Dashboard', icon: '🏠' },
  { key: 'bookings', label: 'Bookings', icon: '📅' },
  { key: 'reports', label: 'Reports', icon: '🧪' },
  { key: 'appointments', label: 'Appointments', icon: '👨‍⚕️' },
  { key: 'health', label: 'Health', icon: '🩺', action: 'health' },
  { key: 'family', label: 'Family', icon: '👪' },
  { key: 'wallet', label: 'Wallet', icon: '💳' },
  { key: 'invoices', label: 'Invoices', icon: '📄' },
  { key: 'abha', label: 'ABHA ID', icon: '🆔' },
  { key: 'profile', label: 'Profile', icon: '👤' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
  { key: 'logout', label: 'Logout', icon: '🚪' },
];

/** Primary chips on mobile — secondary items under More / Profile */
const mobilePrimaryKeys = ['overview', 'bookings', 'reports', 'appointments', 'health', 'family', 'profile'];

function Section({ id, title, icon, children, active, action }) {
  // Only render the selected section — overview is its own layout (not a dump of every panel)
  if (active !== id) return null;
  return (
    <div id={id} className="dash-section" style={{ marginBottom: 24 }}>
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          {title ? (
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              {icon && <span aria-hidden>{icon}</span>} {title}
            </h2>
          ) : <span />}
          {action || null}
        </div>
      )}
      {children}
    </div>
  );
}

function EmptyCard({ icon, title, desc, ctaLabel, onCta }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '32px 20px', border: '1px dashed #cbd5e1', background: '#fafbfc' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 22 }} aria-hidden>{icon}</div>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 4 }}>{title}</p>
      {desc ? <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: ctaLabel ? 14 : 0, lineHeight: 1.5 }}>{desc}</p> : null}
      {ctaLabel && onCta ? (
        <button type="button" onClick={onCta} className="btn btn-primary btn-sm">{ctaLabel}</button>
      ) : null}
    </div>
  );
}

const VALID_TABS = new Set(['overview', 'bookings', 'reports', 'appointments', 'health', 'family', 'wallet', 'invoices', 'abha', 'settings', 'profile']);

function Badge({ variant, children }) {
  const colors = {
    green: { bg: '#dcfce7', color: '#16a34a' },
    blue: { bg: '#dbeafe', color: '#2563eb' },
    orange: { bg: '#fed7aa', color: '#c2410c' },
    red: { bg: '#fee2e2', color: '#dc2626' },
    yellow: { bg: '#fef3c7', color: '#b45309' },
  };
  const c = colors[variant] || colors.blue;
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color }}>
      {children}
    </span>
  );
}

function TrendArrow({ value, prev }) {
  if (!prev) return null;
  const dir = value < prev ? 'down' : value > prev ? 'up' : 'same';
  const color = dir === 'down' ? '#16a34a' : dir === 'up' ? '#dc2626' : '#64748b';
  const arrow = dir === 'down' ? '↓' : dir === 'up' ? '↑' : '→';
  return <span style={{ color, fontWeight: 700, fontSize: 12 }}>{arrow} {value}</span>;
}

function HealthScoreRing({ score }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#22C55E' : score >= 60 ? '#EAB308' : '#EF4444';
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={r} fill="none" stroke="#e8edf2" strokeWidth="6" />
      <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 45 45)" />
      <text x="45" y="45" textAnchor="middle" dominantBaseline="central" fontSize="22" fontWeight="800" fill={color}>{score}</text>
    </svg>
  );
}

function TrendMiniBar({ values, color = '#1866C9' }) {
  if (!values || values.length < 2) return null;
  const max = Math.max(...values.map(v => v.value)) * 1.15;
  const min = Math.min(...values.map(v => v.value)) * 0.85;
  const range = max - min || 1;
  const w = 200;
  const h = 50;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v.value - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {values.map((v, i) => {
        const x = (i / (values.length - 1)) * w;
        const y = h - ((v.value - min) / range) * (h - 8) - 4;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
}

export default function Dashboard() {
  const t = useT();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => {
    const tab = searchParams.get('tab');
    return tab && VALID_TABS.has(tab) ? tab : 'overview';
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    const next = tab && VALID_TABS.has(tab) ? tab : 'overview';
    setActiveSection(next);
  }, [searchParams]);

  const goToSection = (key) => {
    if (key === 'logout') return;
    setShowMoreNav(false);
    setActiveSection(key);
    if (key === 'overview') {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ tab: key }, { replace: true });
    }
    // Keep content in view on mobile after chip tap
    try {
      const main = document.querySelector('.dash-main');
      if (main) main.scrollTo?.({ top: 0, behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch { /* ignore */ }
  };

  const [comingSoon, setComingSoon] = useState(null);
  const [showMoreNav, setShowMoreNav] = useState(false);
  const fetchDashboard = useDashboardStore(s => s.fetchDashboard);
  const dashLoading = useDashboardStore(s => s.loading);
  const fetchFamily = useAuthStore(s => s.fetchFamily);
  const authFamily = useAuthStore(s => s.family);
  const addFamilyApi = useAuthStore(s => s.addFamilyMember);
  const updateFamilyApi = useAuthStore(s => s.updateFamilyMember);
  const deleteFamilyApi = useAuthStore(s => s.deleteFamilyMember);
  useEffect(() => { fetchDashboard(); fetchFamily(); }, []);

  useEffect(() => { if (comingSoon) { const timer = setTimeout(() => setComingSoon(null), 2500); return () => clearTimeout(timer); } }, [comingSoon]);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', bloodGroup: '', dob: '', gender: '' });
  const [showReportModal, setShowReportModal] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showRecordsMember, setShowRecordsMember] = useState(null);
  const [showBookingDetail, setShowBookingDetail] = useState(null);
  const [showReschedule, setShowReschedule] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState(null);
  const [rescheduleSlot, setRescheduleSlot] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [familyForm, setFamilyForm] = useState({ name: '', relation: '', age: '', gender: '' });
  const [fullReportIndex, setFullReportIndex] = useState(null);
  const [reportSearch, setReportSearch] = useState('');
  const [reportFilter, setReportFilter] = useState('All Reports');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(null);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [healthStep, setHealthStep] = useState(1);
  const [healthSubTab, setHealthSubTab] = useState('overview');
  const [healthForm, setHealthForm] = useState({
    personalProfile: { ageGroup: '', gender: '', location: '' },
    lifestyle: { smoking: 'never', alcohol: 'never', exercise: 'frequent', sleep: 'good', stress: 'low' },
    bodyMeasurements: { heightCm: '', weightKg: '', waistCm: '' },
    familyHistory: { diabetes: false, bp: false, heartDisease: false, thyroid: false, cancer: false },
    medicalHistory: {},
    labResults: { hba1c: '', ldl: '', tsh: '', vitaminD: '', creatinine: '', egfr: '', alt: '', ast: '' },
  });

  const rescheduleDates = useMemo(() => {
    const ds = [];
    for (let i = 1; i <= 7; i++) { const d = new Date(); d.setDate(d.getDate() + i); ds.push(d); }
    return ds;
  }, []);

  const timeSlots = ['7:00 AM – 9:00 AM', '9:00 AM – 11:00 AM', '11:00 AM – 1:00 PM', '4:00 PM – 6:00 PM', '6:00 PM – 8:00 PM'];

  const store = useDashboardStore();
  const authUser = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const p = {
    ...store.profile,
    name: authUser?.name || store.profile.name || '',
    phone: authUser?.phone || store.profile.phone || '',
    email: authUser?.email || store.profile.email || '',
  };
  const displayName = (p.name && String(p.name).trim()) || t('dashboard.userFallback', 'there');
  const nameInitial = (p.name && String(p.name).trim().charAt(0).toUpperCase()) || 'U';
  const reports = store.reports;
  const family = (authFamily && authFamily.length > 0) ? authFamily : store.family;
  const upcoming = store.upcomingBookings;
  const appointments = store.appointments;
  const upcomingAppts = appointments.filter(a => !['Completed', 'cancelled', 'Cancelled', 'completed'].includes(a.status));
  const pastAppts = appointments.filter(a => ['Completed', 'completed'].includes(a.status));
  const invoices = store.invoices;
  const wallet = store.wallet;
  const abha = store.abha;
  const notifs = store.notifications;
  const prescriptions = store.savedPrescriptions;
  const activeOrders = store.activeOrders ?? upcoming.length;
  const healthScoreComputed = useMemo(() => {
    const bonus = useDailyActivityStore.getState().getHealthScoreImpact();
    return computeHealthScore(store.healthData, store.reports, bonus);
  }, [store.healthData, store.reports, store.profile.healthScore]);

  const addFamily = async () => {
    if (!familyForm.name || !familyForm.relation || !familyForm.age) return;
    const payload = { ...familyForm, age: parseInt(familyForm.age, 10), bloodGroup: '--', lastCheckup: 'N/A', abhaId: '', gender: familyForm.gender || 'Not specified' };
    if (editingFamily) {
      await updateFamilyApi(editingFamily, payload);
      store.updateFamilyMember(editingFamily, payload);
    } else {
      const created = await addFamilyApi(payload);
      if (created) store.addFamilyMember(created);
    }
    setFamilyForm({ name: '', relation: '', age: '', gender: '' });
    setShowFamilyModal(false);
    setEditingFamily(null);
  };

  const openFamilyEdit = (m) => {
    setFamilyForm({ name: m.name, relation: m.relation, age: String(m.age), gender: m.gender });
    setEditingFamily(m.id);
    setShowFamilyModal(true);
  };

  const openProfileEdit = () => {
    setProfileForm({ name: p.name, email: p.email, phone: p.phone, bloodGroup: p.bloodGroup, dob: p.dob, gender: p.gender });
    setShowProfileModal(true);
  };

  const saveProfile = () => {
    if (!profileForm.name || !profileForm.phone) return;
    store.updateProfile(profileForm);
    setShowProfileModal(false);
  };

  const firstName = displayName !== t('dashboard.userFallback', 'there') ? displayName.split(' ')[0] : '';

  const isEmptyOverview = !dashLoading && upcoming.length === 0 && reports.length === 0 && upcomingAppts.length === 0;

  return (
    <div className="dash-layout">
      {/* Sidebar — desktop */}
      <aside className="dash-sidebar">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1866C9' }}>{t('dashboard.sidebar.myHealth', 'My Health')}</div>
          {p.name ? <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div> : null}
        </div>
        <div className="dash-sidebar-nav">
          {navItems.filter(i => i.key !== 'logout').map(item => (
            <button key={item.key} type="button" onClick={() => goToSection(item.key)}
              className={`dash-side-link${activeSection === item.key ? ' active' : ''}`}>
              <span aria-hidden>{item.icon}</span>
              <span>{t(`dashboard.nav.${item.key}`, item.label)}</span>
            </button>
          ))}
        </div>
        <div className="dash-sidebar-foot">
          <button type="button" className="dash-side-link dash-side-logout" onClick={() => { logout(); navigate('/', { replace: true }); }}>
            <span aria-hidden>🚪</span>
            <span>{t('dashboard.nav.logout', 'Logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <div className="dash-main-inner">

        {/* ===== HEADER ===== */}
        <div className="dash-header-wrap" style={{ marginBottom: activeSection === 'overview' ? 16 : 10 }}>
          <div className="dash-header-top">
            <div className="dash-header-identity">
              <div className="dash-avatar" aria-hidden>{nameInitial}</div>
              <div style={{ minWidth: 0 }}>
                <h1 className="dash-greeting">
                  <span aria-hidden style={{ marginRight: 4 }}>{GREETING_ICON}</span>
                  {t('dashboard.greeting.good', 'Good')} {t(`dashboard.greeting.${GREETING.toLowerCase()}`, GREETING)}{firstName ? `, ${firstName}` : ''}
                </h1>
                <p className="dash-greeting-sub">
                  {activeSection !== 'overview' ? (
                    <button type="button" onClick={() => goToSection('overview')} className="dash-back-link">
                      ← {t('dashboard.backToOverview', 'Back to overview')}
                    </button>
                  ) : p.lastCheckup ? (
                    <>{t('dashboard.lastCheck', 'Last check-up:')} <strong style={{ color: '#334155' }}>{p.lastCheckup}</strong></>
                  ) : (
                    t('dashboard.welcomeSub', 'Your health overview')
                  )}
                </p>
              </div>
            </div>

            {activeSection === 'overview' && store.healthTrends.hba1c.length > 0 && (
              <div className="dash-hdr-trend">
                <div className="dash-trend-card">
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)' }}>📈 HbA1c</div>
                  <TrendMiniBar values={store.healthTrends.hba1c} color="#1866C9" />
                  <TrendArrow value={store.healthTrends.hba1c[store.healthTrends.hba1c.length - 1].value} prev={store.healthTrends.hba1c[store.healthTrends.hba1c.length - 2]?.value} />
                </div>
              </div>
            )}

            <div className="dash-hdr-score">
              {store.healthData && healthScoreComputed ? (
                <button type="button" onClick={() => goToSection('health')} className="dash-score-btn">
                  <div className="dash-score-icon" style={{ background: healthScoreComputed.recommendation.color + '15' }}>
                    {healthScoreComputed.recommendation.icon}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div className="dash-score-label">{t('dashboard.healthScore', 'HEALTH SCORE')}</div>
                    <div className="dash-score-value" style={{ color: healthScoreComputed.recommendation.color }}>
                      {healthScoreComputed.score}<span>/{healthScoreComputed.max}</span>
                    </div>
                    <div className="dash-score-zone" style={{ color: healthScoreComputed.recommendation.color }}>{healthScoreComputed.recommendation.zone}</div>
                  </div>
                </button>
              ) : (
                <button type="button" className="dash-score-btn" onClick={() => { setHealthStep(1); setShowHealthModal(true); }}>
                  <div className="dash-score-icon" style={{ background: '#eff6ff' }}>🩺</div>
                  <div style={{ textAlign: 'left' }}>
                    <div className="dash-score-label">{t('dashboard.healthScore', 'HEALTH SCORE')}</div>
                    <div className="dash-score-value" style={{ color: '#1866C9', fontSize: 15 }}>--/100</div>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Primary CTAs only on overview — less noise on detail tabs */}
          {activeSection === 'overview' && (
            <>
              {!store.healthData && (
                <button type="button" onClick={() => { setHealthStep(1); setShowHealthModal(true); }} className="dash-assess-cta">
                  {t('dashboard.startAssessment', '🩺 Start Health Assessment')}
                </button>
              )}
              <div className="dash-actions">
                <button type="button" onClick={() => navigate('/diagnostics')} className="dash-action-primary">
                  <span style={{ fontSize: 22, flexShrink: 0 }} aria-hidden>🧪</span>
                  <div style={{ lineHeight: 1.3 }}>
                    <div style={{ fontWeight: 700 }}>{t('dashboard.bookTest', 'Book a Test')}</div>
                    <div style={{ fontSize: 11, opacity: 0.85 }}>{t('dashboard.homeCollection', 'Home Collection')}</div>
                  </div>
                </button>
                <button type="button" onClick={() => navigate('/upload-prescription')} className="dash-action-secondary">
                  <span style={{ fontSize: 22, flexShrink: 0 }} aria-hidden>📄</span>
                  <div style={{ lineHeight: 1.3 }}>
                    <div style={{ fontWeight: 700 }}>{t('dashboard.uploadReport', 'Upload Report')}</div>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>{t('dashboard.prescription', 'Prescription')}</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Tab Nav — sticky chips */}
        <div className="dash-mobile-nav">
          <nav aria-label={t('dashboard.sidebar.navAria', 'Dashboard navigation')}>
            {navItems.filter(item => mobilePrimaryKeys.includes(item.key)).map(item => {
              const active = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => goToSection(item.key)}
                  className={`dash-chip${active ? ' active' : ''}`}
                >
                  <span aria-hidden>{item.icon}</span>
                  <span>{t(`dashboard.nav.${item.key}`, item.label)}</span>
                </button>
              );
            })}
            <button
              type="button"
              className={`dash-chip${showMoreNav ? ' active' : ''}`}
              onClick={() => setShowMoreNav(v => !v)}
              aria-expanded={showMoreNav}
            >
              <span aria-hidden>⋯</span>
              <span>{t('dashboard.nav.more', 'More')}</span>
            </button>
          </nav>
          {showMoreNav && (
            <div className="dash-more-panel">
              {[
                { key: 'wallet', icon: '💳', label: t('dashboard.nav.wallet', 'Wallet') },
                { key: 'invoices', icon: '📄', label: t('dashboard.nav.invoices', 'Invoices') },
                { key: 'abha', icon: '🆔', label: t('dashboard.nav.abha', 'ABHA') },
                { key: 'settings', icon: '⚙️', label: t('dashboard.nav.settings', 'Settings') },
              ].map(s => (
                <button key={s.key} type="button" className="dash-more-item" onClick={() => { setShowMoreNav(false); goToSection(s.key); }}>
                  <span aria-hidden>{s.icon}</span> {s.label}
                </button>
              ))}
              <button type="button" className="dash-more-item dash-more-logout" onClick={() => { logout(); navigate('/', { replace: true }); }}>
                <span aria-hidden>🚪</span> {t('dashboard.nav.logout', 'Logout')}
              </button>
            </div>
          )}
        </div>

        {dashLoading && activeSection === 'overview' && (
          <div className="dash-loading-block" aria-busy="true" aria-live="polite">
            <div className="dash-skel-row">
              {[1, 2, 3, 4].map(i => <div key={i} className="dash-skel-card" />)}
            </div>
            <p className="dash-loading-text">{t('dashboard.loading', 'Refreshing your health data…')}</p>
          </div>
        )}

        {/* ===== OVERVIEW ===== */}
        {activeSection === 'overview' && (
          <>
          {isEmptyOverview && (
            <div className="dash-welcome card">
              <div className="dash-welcome-icon" aria-hidden>👋</div>
              <h2>{t('dashboard.welcomeTitle', 'Welcome to your health hub')}</h2>
              <p>{t('dashboard.welcomeBody', 'Book a lab test, upload a prescription, or add family members — your activity will show up here.')}</p>
              <div className="dash-welcome-actions">
                <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/diagnostics')}>{t('dashboard.bookTestBtn', 'Book a Test')}</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => goToSection('family')}>{t('dashboard.addFamily', 'Add family')}</button>
              </div>
            </div>
          )}

          <div className="overview-grid">
            {[
              { key: 'bookings', icon: '📅', label: t('dashboard.overview.upcoming', 'Upcoming Bookings'), value: upcoming.length, color: '#2563eb', bg: '#eff6ff' },
              { key: 'reports', icon: '🧪', label: t('dashboard.overview.reports', 'Reports Available'), value: reports.length, color: '#16a34a', bg: '#f0fdf4' },
              { key: 'family', icon: '👪', label: t('dashboard.overview.family', 'Family Members'), value: family.length, color: '#c2410c', bg: '#fff7ed' },
              { key: 'appointments', icon: '👨‍⚕️', label: t('dashboard.overview.appointments', 'Appointments'), value: upcomingAppts.length, color: '#7c3aed', bg: '#f5f3ff' },
            ].map((card, idx) => (
              <button
                key={`${card.key}-${idx}`}
                type="button"
                className="card dash-stat-card"
                onClick={() => goToSection(card.key)}
                style={{ '--stat-color': card.color, '--stat-bg': card.bg }}
              >
                <div className="dash-stat-icon" aria-hidden>{card.icon}</div>
                <div className="dash-stat-value">{card.value}</div>
                <div className="dash-stat-label">{card.label}</div>
              </button>
            ))}
          </div>

          {/* Compact previews */}
          <div className="dash-section-grid-2">
            <div className="card dash-preview-card">
              <div className="dash-preview-head">
                <h3>{t('dashboard.overview.nextBooking', '📅 Next booking')}</h3>
                <button type="button" onClick={() => goToSection('bookings')} className="dash-link-btn">{t('dashboard.viewAll', 'View all')}</button>
              </div>
              {upcoming[0] ? (
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{upcoming[0].test}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>📅 {upcoming[0].date} · 🕘 {upcoming[0].time}</div>
                  <Badge variant={upcoming[0].status === 'Confirmed' ? 'green' : 'yellow'}>{upcoming[0].status}</Badge>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>{t('dashboard.noUpcoming', 'No upcoming bookings yet.')}</p>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/diagnostics')}>{t('dashboard.bookTestBtn', 'Book a Test')}</button>
                </div>
              )}
            </div>
            <div className="card dash-preview-card">
              <div className="dash-preview-head">
                <h3>{t('dashboard.overview.latestReport', '🧪 Latest report')}</h3>
                <button type="button" onClick={() => goToSection('reports')} className="dash-link-btn">{t('dashboard.viewAll', 'View all')}</button>
              </div>
              {reports[0] ? (
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{reports[0].test}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{reports[0].date} · {reports[0].lab}</div>
                  <Badge variant={reports[0].status === 'Normal' ? 'green' : 'orange'}>{reports[0].status}</Badge>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>{t('dashboard.noReportsYet', 'Reports will appear here after lab results are ready.')}</p>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate('/diagnostics')}>{t('dashboard.bookTestBtn', 'Book a Test')}</button>
                </div>
              )}
            </div>
          </div>

          {/* Secondary shortcuts — desktop/tablet; mobile uses More chip */}
          <div className="dash-secondary-grid">
            {[
              { key: 'appointments', icon: '👨‍⚕️', label: t('dashboard.nav.appointments', 'Appointments') },
              { key: 'wallet', icon: '💳', label: t('dashboard.nav.wallet', 'Wallet') },
              { key: 'invoices', icon: '📄', label: t('dashboard.nav.invoices', 'Invoices') },
              { key: 'abha', icon: '🆔', label: t('dashboard.nav.abha', 'ABHA') },
              { key: 'settings', icon: '⚙️', label: t('dashboard.nav.settings', 'Settings') },
              { key: 'health', icon: '🩺', label: t('dashboard.nav.health', 'Health') },
            ].map(s => (
              <button
                key={s.key}
                type="button"
                onClick={() => goToSection(s.key)}
                className="dash-secondary-tile"
              >
                <span style={{ fontSize: 20 }} aria-hidden>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
          </>
        )}

        {/* ===== UPCOMING BOOKINGS ===== */}
        <Section id="bookings" title={t('dashboard.section.bookings', 'Upcoming Bookings')} icon="📅" active={activeSection}>
          {upcoming.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '36px 24px', border: '1px dashed #cbd5e1', background: '#fafbfc' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 22 }}>📅</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 4 }}>{t('dashboard.noUpcomingTitle', 'No upcoming bookings')}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14 }}>{t('dashboard.noUpcoming', 'Book a home collection test when you are ready.')}</p>
              <button type="button" onClick={() => navigate('/diagnostics')} className="btn btn-primary btn-sm">{t('dashboard.bookTestBtn', 'Book a Test')}</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcoming.map(b => (
                <div key={b.id} className="card" style={{ padding: 14, borderRadius: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{b.test}</div>
                      <Badge variant={b.status === 'Confirmed' ? 'green' : 'yellow'}>{b.status}</Badge>
                    </div>
                    <div style={{ fontSize: 24 }}>🧪</div>
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-secondary)', flexWrap: 'wrap', marginBottom: 10 }}>
                    <span>📅 {b.date}</span>
                    <span>🕘 {b.time}</span>
                    <span>📍 {b.location}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setShowBookingDetail(b)}>{t('dashboard.view', 'View')}</button>
                    <button className="btn btn-outline btn-sm" onClick={() => { setShowReschedule(b); setRescheduleDate(null); setRescheduleSlot(null); }}>{t('dashboard.reschedule', 'Reschedule')}</button>
                    <button className="btn btn-outline btn-sm" onClick={() => { if (window.confirm(t('dashboard.cancelConfirm', 'Cancel booking for') + ` ${b.test} ${t('dashboard.onDate', 'on')} ${b.date}?`)) { store.cancelBooking(b.id); } }} style={{ color: '#dc2626', borderColor: '#fecaca' }}>{t('dashboard.cancel', 'Cancel')}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => navigate('/diagnostics')} className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>{t('dashboard.bookNewTest', '+ Book New Test')}</button>
        </Section>

        {/* Booking Detail Modal */}
        {showBookingDetail && (
          <div className="panel-overlay" onClick={() => setShowBookingDetail(null)}>
            <div className="panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
              <div className="panel-header">
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>{t('dashboard.bookingDetail.title', '📋 Booking Details')}</h3>
                <button onClick={() => setShowBookingDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, fontFamily: 'inherit' }}>✕</button>
              </div>
              <div className="panel-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                  <div style={{ padding: '10px 12px', background: '#f8f9fa', borderRadius: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>🧪 {showBookingDetail.test}</div>
                    <Badge variant={showBookingDetail.status === 'Confirmed' ? 'green' : 'yellow'}>{showBookingDetail.status}</Badge>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{t('dashboard.bookingDetail.bookingId', 'Booking ID')}</span>
                    <span style={{ fontWeight: 600 }}>{showBookingDetail.id}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{t('dashboard.bookingDetail.date', 'Date')}</span>
                    <span style={{ fontWeight: 600 }}>{showBookingDetail.date}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{t('dashboard.bookingDetail.time', 'Time')}</span>
                    <span style={{ fontWeight: 600 }}>{showBookingDetail.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{t('dashboard.bookingDetail.location', 'Location')}</span>
                    <span style={{ fontWeight: 600 }}>{showBookingDetail.location}</span>
                  </div>
                  <div style={{ marginTop: 8, background: '#e8f5e9', padding: '10px', borderRadius: 8, fontSize: 11, color: '#2e7d32' }}>
                    {t('dashboard.bookingDetail.confirmationMsg', '✅ A confirmation message has been sent to your registered mobile number.')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {showReschedule && (
          <div className="panel-overlay" onClick={() => setShowReschedule(null)}>
            <div className="panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
              <div className="panel-header">
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>{t('dashboard.rescheduleModal.title', '📅 Reschedule Booking')}</h3>
                <button onClick={() => setShowReschedule(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, fontFamily: 'inherit' }}>✕</button>
              </div>
              <div className="panel-body">
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>{t('dashboard.rescheduleModal.selectNew', 'Select a new date and time for')} <strong>{showReschedule.test}</strong></p>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{t('dashboard.rescheduleModal.newDate', 'New Date')}</div>
                <div style={{ display: 'flex', gap: 4, overflow: 'auto', paddingBottom: 8, marginBottom: 12 }}>
                  {rescheduleDates.map(d => {
                    const fmt = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
                    const isToday = d.toDateString() === new Date().toDateString();
                    return (
                      <button key={d.toISOString()} onClick={() => setRescheduleDate(d)}
                        style={{ flexShrink: 0, padding: '6px 10px', borderRadius: 8, border: `2px solid ${rescheduleDate?.toDateString() === d.toDateString() ? 'var(--primary)' : 'var(--border)'}`, background: rescheduleDate?.toDateString() === d.toDateString() ? 'var(--primary)' : '#fff', color: rescheduleDate?.toDateString() === d.toDateString() ? '#fff' : 'var(--text-body)', cursor: 'pointer', fontSize: 11, fontWeight: rescheduleDate?.toDateString() === d.toDateString() ? 700 : 500, fontFamily: 'inherit', textAlign: 'center', minWidth: 70 }}>
                        <div style={{ fontSize: 9, opacity: 0.8 }}>{isToday ? t('dashboard.today', 'Today') : fmt.split(' ')[0]}</div>
                        <div>{fmt.split(' ').slice(1).join(' ')}</div>
                      </button>
                    );
                  })}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{t('dashboard.rescheduleModal.newTime', 'New Time')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                  {timeSlots.map(s => (
                    <button key={s} onClick={() => setRescheduleSlot(s)}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, border: `2px solid ${rescheduleSlot === s ? 'var(--primary)' : 'var(--border)'}`, background: rescheduleSlot === s ? 'var(--primary-light)' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, textAlign: 'left' }}>
                      <span style={{ fontSize: 14 }}>{s.startsWith('7') || s.startsWith('9') ? '🌅' : s.startsWith('11') ? '☀️' : '🌆'}</span>
                      <span style={{ fontWeight: rescheduleSlot === s ? 700 : 500 }}>{s}</span>
                      {rescheduleSlot === s && <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontWeight: 700 }}>✓</span>}
                    </button>
                  ))}
                </div>
                <button onClick={() => { if (rescheduleDate && rescheduleSlot) { store.cancelBooking(showReschedule.id); setShowReschedule(null); alert(`${t('dashboard.rescheduleModal.confirmed', 'Booking rescheduled to')} ${rescheduleDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} ${t('dashboard.rescheduleModal.at', 'at')} ${rescheduleSlot}`); } else { alert(t('dashboard.rescheduleModal.selectBoth', 'Please select both date and time')); } }} className="btn btn-primary btn-block">{t('dashboard.rescheduleModal.confirm', 'Confirm Reschedule')}</button>
              </div>
            </div>
          </div>
        )}

        {/* ===== MY REPORTS ===== */}
        <Section id="reports" title={t('dashboard.section.reports', 'My Reports')} icon="🧪" active={activeSection}
          action={<button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/diagnostics')}>{t('dashboard.bookNewTest', '+ Book New Test')}</button>}
        >
          {reports.length === 0 ? (
            <EmptyCard
              icon="🧪"
              title={t('dashboard.noReportsTitle', 'No reports yet')}
              desc={t('dashboard.noReportsDesc', 'After your sample is collected and processed, digital reports will show up here.')}
              ctaLabel={t('dashboard.bookTestBtn', 'Book a Test')}
              onCta={() => navigate('/diagnostics')}
            />
          ) : (
          <>
          <div className="report-search-bar" style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'nowrap', alignItems: 'center', width: '100%' }}>
            <input placeholder={t('dashboard.reports.searchPlaceholder', 'Search by test name...')} className="input" style={{ flex: 1, minWidth: 0, fontSize: 13, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)' }} value={reportSearch} onChange={e => setReportSearch(e.target.value)} />
            <select className="select" style={{ width: 130, flexShrink: 0, fontSize: 12, padding: '10px 8px', borderRadius: 10, border: '1px solid var(--border)' }} value={reportFilter} onChange={e => setReportFilter(e.target.value)}>
              <option>{t('dashboard.reports.filterAll', 'All Reports')}</option>
              <option>{t('dashboard.reports.filterMonth', 'This Month')}</option>
              <option>{t('dashboard.reports.filter3Months', 'Last 3 Months')}</option>
              <option>{t('dashboard.reports.filter6Months', 'Last 6 Months')}</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reports.filter(r => {
              const match = !reportSearch || r.test.toLowerCase().includes(reportSearch.toLowerCase()) || r.status.toLowerCase().includes(reportSearch.toLowerCase());
              if (!match) return false;
              if (reportFilter === 'All Reports' || reportFilter === t('dashboard.reports.filterAll', 'All Reports')) return true;
              const days = reportFilter.includes('3') ? 90 : reportFilter.includes('6') ? 180 : 30;
              const d = new Date(r.date);
              if (Number.isNaN(d.getTime())) return true;
              const now = new Date();
              return (now - d) / (1000 * 60 * 60 * 24) <= days;
            }).map((r, i) => (
              <div key={r.id} className="card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {r.abnormal && <span style={{ color: '#dc2626', fontSize: 16 }}>⚠️</span>}
                      <span>✓</span> {r.test}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{r.date} · {r.lab}</div>
                  </div>
                  <Badge variant={r.status === 'Normal' ? 'green' : r.status === 'Low' ? 'orange' : 'yellow'}>{r.status}</Badge>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setFullReportIndex(fullReportIndex === i ? null : i)}>{t('dashboard.view', 'View')}</button>
                    <button className="btn btn-outline btn-sm" onClick={() => {
                      const lines = Object.entries(r.values).map(([key, val]) => `${key}: ${val.value} ${val.unit} (Range: ${val.range})`).join('\n');
                      const text = `📄 ${r.test} — ${r.date}\n${lines}\n\n— Jeevan HealthCare at Home`;
                      const blob = new Blob([text], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a'); a.href = url; a.download = `${r.test.replace(/\s+/g, '_')}.txt`;
                      a.click(); URL.revokeObjectURL(url);
                    }}>{t('dashboard.reports.pdf', '📥 PDF')}</button>
                    <button className="btn btn-outline btn-sm" onClick={() => {
                      const lines = Object.entries(r.values).map(([key, val]) => `${key}: ${val.value} ${val.unit} (Range: ${val.range})`).join('\n');
                      const text = `📄 ${r.test} — ${r.date}\n\n${lines}\n\nShared from Jeevan HealthCare at Home`;
                      if (navigator.share) {
                        navigator.share({ title: `${r.test} - Jeevan HealthCare at Home`, text });
                      } else {
                        navigator.clipboard.writeText(text).then(() => alert(t('dashboard.reports.copied', '✅ Report copied to clipboard. Share via WhatsApp, Email, etc.')));
                      }
                    }}>{t('dashboard.reports.share', '📤 Share')}</button>
                  </div>
                </div>

                {/* Inline report details */}
                {fullReportIndex === i && (
                  <div style={{ marginTop: 12, padding: 12, background: '#f8f9fa', borderRadius: 10, fontSize: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t('dashboard.reports.testValues', 'Test Values')}</span>
                      <button className="btn btn-outline btn-sm" onClick={() => {
                        const trend = store.healthTrends?.hba1c;
                        if (trend && trend.length > 1) {
                          const vals = trend.map(t => `${t.date}: ${t.value}%`).join('\n');
                          alert(`${t('dashboard.reports.hba1cTrend', '📈 HbA1c Trend:')}\n\n${vals}\n\n${t('dashboard.reports.showingReadings', 'Showing last')} ${trend.length} ${t('dashboard.reports.readings', 'readings')}`);
                        } else {
                          alert(t('dashboard.reports.trendUnavailable', '📈 Trend data available only for HbA1c. More trends coming soon.'));
                        }
                      }}>{t('dashboard.reports.viewTrend', '📈 View Trend')}</button>
                    </div>
                    <div style={{ display: 'grid', gap: 6 }}>
                      {Object.entries(r.values).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: '#fff', borderRadius: 6, border: '1px solid #e8edf2' }}>
                          <span style={{ fontWeight: 500, flex: 1 }}>{key}</span>
                          <span style={{ fontWeight: 700, color: val.flag === 'high' || val.flag === 'low' ? '#dc2626' : '#16a34a', marginRight: 12 }}>{val.value} {val.unit}</span>
                          <span style={{ color: 'var(--text-light)', fontSize: 10 }}>{t('dashboard.reports.range', 'Range:')} {val.range}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => {
                        const lines = Object.entries(r.values).map(([key, val]) => `${key}: ${val.value} ${val.unit} (Range: ${val.range})`).join('\n');
                        const text = `Jeevan HealthCare at Home Report\nTest: ${r.test}\nDate: ${r.date}\nLab: ${r.lab}\nStatus: ${r.status}\n\n${lines}\n\n— Jeevan HealthCare at Home`;
                        const blob = new Blob([text], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a'); a.href = url; a.download = `${r.test.replace(/\s+/g, '_')}_Report.txt`;
                        a.click(); URL.revokeObjectURL(url);
                      }}>{t('dashboard.reports.downloadZip', '📥 Download All as ZIP')}</button>
                      <button className="btn btn-outline btn-sm" style={{ color: '#16a34a', borderColor: '#bbf7d0' }} onClick={() => {
                        const lines = Object.entries(r.values).map(([key, val]) => `${key}: ${val.value} ${val.unit} (Range: ${val.range})`).join('\n');
                        const text = `🩺 ${r.test} — ${r.date}\n\n${lines}\n\nShared from Jeevan HealthCare at Home`;
                        if (navigator.share) {
                          navigator.share({ title: `${r.test} - Jeevan HealthCare at Home`, text });
                        } else {
                          navigator.clipboard.writeText(text).then(() => alert(t('dashboard.reports.summaryCopied', '✅ Report summary copied! Share it with your doctor via WhatsApp or Email.')));
                        }
                      }}>{t('dashboard.reports.shareDoctor', '🩺 Share with Doctor')}</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {reports.length > 0 && reports.filter(r => {
              const match = !reportSearch || r.test.toLowerCase().includes(reportSearch.toLowerCase()) || r.status.toLowerCase().includes(reportSearch.toLowerCase());
              return match;
            }).length === 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', padding: 16 }}>{t('dashboard.reports.noMatch', 'No reports match your search.')}</p>
            )}
          </div>
          </>
          )}
        </Section>

        {/* ===== INVOICES ===== */}
        <Section id="invoices" title={t('dashboard.section.invoices', 'Invoices & Payments')} icon="📄" active={activeSection}>
          {/* Tracked follow-up (not urgent): real PDF tax invoices / receipts — see AGENTS.md Known follow-ups */}
          <div
            role="note"
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, padding: '12px 14px',
              borderRadius: 12, border: '1px solid #fde68a', background: '#FFFBEB',
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1.2, flexShrink: 0 }} aria-hidden>📌</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 2 }}>
                {t('dashboard.invoices.todoTitle', 'To fix later — PDF invoices')}
              </div>
              <div style={{ fontSize: 12, color: '#a16207', lineHeight: 1.5 }}>
                {t(
                  'dashboard.invoices.todoBody',
                  'Invoice / receipt download currently saves a plain-text file. Need proper GST tax invoices & payment receipts as PDF (branded layout, line items, GSTIN, legal footer), plus backend storage and re-download from this list.'
                )}
              </div>
            </div>
          </div>

          {invoices.length === 0 ? (
            <EmptyCard
              icon="📄"
              title={t('dashboard.noInvoicesTitle', 'No invoices yet')}
              desc={t('dashboard.noInvoicesDesc', 'Payment receipts and tax invoices will appear here after you book a test or package.')}
              ctaLabel={t('dashboard.bookTestBtn', 'Book a Test')}
              onCta={() => navigate('/diagnostics')}
            />
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {invoices.map(inv => (
              <div key={inv.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{inv.package}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {inv.id} · {inv.date}
                  </div>
                  {inv.gst && <div style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 2 }}>{inv.gst}</div>}
                  <div style={{ fontSize: 10, color: '#b45309', marginTop: 4 }}>
                    {t('dashboard.invoices.pdfPending', 'Download is temporary (.txt) — PDF invoice pending')}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1866C9' }}>₹{inv.amount}</div>
                  <Badge variant="green">{t('dashboard.invoices.paid', 'Paid ✅')}</Badge>
                  <button type="button" className="btn btn-outline btn-sm" title={t('dashboard.invoices.txtOnlyHint', 'Temporary text download — PDF coming later')} onClick={() => {
                    // TODO(invoices): replace with real PDF tax invoice generation + API file URL
                    const text = `Jeevan HealthCare at Home\nTax Invoice\n\nInvoice No: ${inv.id}\nDate: ${inv.date}\nPackage: ${inv.package}\nAmount: ₹${inv.amount}\nStatus: Paid\n${inv.gst ? `\n${inv.gst}` : ''}\n\nThank you for choosing Jeevan HealthCare at Home!\n\n[NOTE: Placeholder text invoice — PDF GST invoice not yet implemented]`;
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const el = document.createElement('a'); el.href = url; el.download = `Invoice_${inv.id}.txt`; el.click(); URL.revokeObjectURL(url);
                  }}>{t('dashboard.invoices.invoice', '📄 Invoice')}</button>
                  <button type="button" className="btn btn-outline btn-sm" title={t('dashboard.invoices.txtOnlyHint', 'Temporary text download — PDF coming later')} onClick={() => {
                    // TODO(invoices): replace with real PDF payment receipt
                    const text = `Jeevan HealthCare at Home\nPayment Receipt\n\nReceipt No: ${inv.id}\nDate: ${inv.date}\nPackage: ${inv.package}\nAmount Paid: ₹${inv.amount}\nPayment Method: Online\nStatus: Paid ✅\n${inv.gst ? `\n${inv.gst}` : ''}\n\nThis is a computer-generated receipt.\n\n[NOTE: Placeholder text receipt — PDF not yet implemented]`;
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const el = document.createElement('a'); el.href = url; el.download = `Receipt_${inv.id}.txt`; el.click(); URL.revokeObjectURL(url);
                  }}>{t('dashboard.invoices.receipt', '🧾 Receipt')}</button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/diagnostics')}>{t('dashboard.invoices.rebook', '🔄 Re-book')}</button>
                </div>
              </div>
            ))}
          </div>
          )}
        </Section>

        {/* ===== FAMILY MEMBERS ===== */}
        <Section id="family" title={t('dashboard.section.family', 'Family Members')} icon="👪" active={activeSection}
          action={<button type="button" className="btn btn-outline btn-sm" onClick={() => { setEditingFamily(null); setFamilyForm({ name: '', relation: '', age: '', gender: '' }); setShowFamilyModal(true); }}>{t('dashboard.family.addMember', 'Add Member')}</button>}
        >
          <div className="dash-family-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {family.map(m => (
              <div key={m.id} className="card" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: m.relation === 'Self' ? 'linear-gradient(135deg, #1866C9, #0F4A96)' : '#e8edf2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: m.relation === 'Self' ? '#fff' : '#64748b' }}>
                    {m.relation === 'Self' ? '👤' : m.gender === 'Female' ? '👩' : m.gender === 'Male' ? '👦' : '👤'}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{m.relation} · {m.age} {t('dashboard.family.yrs', 'yrs')} · {m.bloodGroup}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  {t('dashboard.family.lastCheckup', 'Last Checkup:')} {m.lastCheckup}
                </div>
                {m.abhaId && (
                  <div style={{ fontSize: 10, color: '#1866C9', background: '#e8f0fe', padding: '2px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 8 }}>
                    ABHA: {m.abhaId}
                  </div>
                )}
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setShowRecordsMember(m)} style={{ fontSize: 10, padding: '4px 8px' }}>{t('dashboard.family.records', '📋 Records')}</button>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/diagnostics')} style={{ fontSize: 10, padding: '4px 8px' }}>{t('dashboard.family.bookTest', '🧪 Book Test')}</button>
                    <button className="btn btn-outline btn-sm" onClick={() => openFamilyEdit(m)} style={{ fontSize: 10, padding: '4px 8px', color: '#1866C9' }}>{t('dashboard.family.edit', '✏️ Edit')}</button>
                    <button className="btn btn-outline btn-sm" onClick={async () => { if (window.confirm(`${t('dashboard.family.removeConfirm', 'Remove')} ${m.name}?`)) { await deleteFamilyApi(m.id); store.removeFamilyMember(m.id); } }} style={{ fontSize: 10, padding: '4px 8px', color: '#dc2626', borderColor: '#fecaca' }}>{t('dashboard.family.remove', '🗑 Remove')}</button>
                  </div>
              </div>
            ))}

            {/* Add Member Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderStyle: 'dashed' }} onClick={() => setShowFamilyModal(true)}>
              <div style={{ fontSize: 32, marginBottom: 8, color: '#1866C9' }}>+</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1866C9' }}>{t('dashboard.family.addMember', 'Add Member')}</div>
            </div>
          </div>

          {/* Records Modal */}
          {showRecordsMember && (
            <div className="panel-overlay" onClick={() => setShowRecordsMember(null)}>
              <div className="panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
                <div className="panel-header">
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>{t('dashboard.records.title', "📋 {name}'s Records").replace('{name}', showRecordsMember.name)}</h3>
                  <button onClick={() => setShowRecordsMember(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, fontFamily: 'inherit' }}>✕</button>
                </div>
                <div className="panel-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#f8f9fa', borderRadius: 10 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: showRecordsMember.relation === 'Self' ? 'linear-gradient(135deg, #1866C9, #0F4A96)' : '#e8edf2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: showRecordsMember.relation === 'Self' ? '#fff' : '#64748b' }}>
                        {showRecordsMember.relation === 'Self' ? '👤' : showRecordsMember.gender === 'Female' ? '👩' : '👦'}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{showRecordsMember.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{showRecordsMember.relation} · {showRecordsMember.age} {t('dashboard.family.yrs', 'yrs')} · {showRecordsMember.bloodGroup}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{t('dashboard.records.bloodGroup', 'Blood Group')}</span>
                        <span style={{ fontWeight: 600 }}>{showRecordsMember.bloodGroup}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{t('dashboard.records.lastCheckup', 'Last Checkup')}</span>
                        <span style={{ fontWeight: 600 }}>{showRecordsMember.lastCheckup}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{t('dashboard.records.abha', 'ABHA ID')}</span>
                        <span style={{ fontWeight: 600 }}>{showRecordsMember.abhaId || t('dashboard.records.notLinked', 'Not linked')}</span>
                      </div>
                    </div>

                    {reports.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{t('dashboard.records.recentReports', 'Recent Reports')}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {reports.filter(r => r.status !== 'Normal' || true).slice(0, 3).map(r => (
                            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: '#f8f9fa', borderRadius: 6, fontSize: 11 }}>
                              <span>{r.test}</span>
                              <Badge variant={r.status === 'Normal' ? 'green' : r.status === 'Low' ? 'orange' : 'yellow'}>{r.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button onClick={() => { setShowRecordsMember(null); navigate('/diagnostics'); }} className="btn btn-primary btn-block" style={{ fontSize: 12 }}>
                      {t('dashboard.records.bookTest', 'Book Test for')} {showRecordsMember.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Family Modal */}
          {showFamilyModal && (
            <div className="panel-overlay" onClick={() => setShowFamilyModal(false)}>
              <div className="panel" onClick={e => e.stopPropagation()}>
                <div className="panel-header">
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>{editingFamily ? t('dashboard.familyModal.edit', 'Edit Family Member') : t('dashboard.familyModal.add', 'Add Family Member')}</h3>
                  <button onClick={() => { setShowFamilyModal(false); setEditingFamily(null); setFamilyForm({ name: '', relation: '', age: '', gender: '' }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
                </div>
                <div className="panel-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input className="input" placeholder={t('dashboard.familyModal.namePlaceholder', 'Full Name')} value={familyForm.name} onChange={e => setFamilyForm(p => ({ ...p, name: e.target.value }))} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <select className="select" value={familyForm.relation} onChange={e => setFamilyForm(p => ({ ...p, relation: e.target.value }))}>
                        <option value="">{t('dashboard.familyModal.relation', 'Relation')}</option>
                        <option value="Spouse">{t('dashboard.familyModal.spouse', 'Spouse')}</option>
                        <option value="Son">{t('dashboard.familyModal.son', 'Son')}</option>
                        <option value="Daughter">{t('dashboard.familyModal.daughter', 'Daughter')}</option>
                        <option value="Father">{t('dashboard.familyModal.father', 'Father')}</option>
                        <option value="Mother">{t('dashboard.familyModal.mother', 'Mother')}</option>
                        <option value="Sibling">{t('dashboard.familyModal.sibling', 'Sibling')}</option>
                      </select>
                      <input className="input" type="number" placeholder={t('dashboard.familyModal.agePlaceholder', 'Age')} value={familyForm.age} onChange={e => setFamilyForm(p => ({ ...p, age: e.target.value }))} />
                    </div>
                    <select className="select" value={familyForm.gender} onChange={e => setFamilyForm(p => ({ ...p, gender: e.target.value }))}>
                      <option value="">{t('dashboard.familyModal.gender', 'Gender')}</option>
                      <option value="Male">{t('dashboard.familyModal.male', 'Male')}</option>
                      <option value="Female">{t('dashboard.familyModal.female', 'Female')}</option>
                      <option value="Other">{t('dashboard.familyModal.other', 'Other')}</option>
                    </select>
                    <button onClick={addFamily} className="btn btn-primary btn-block">{editingFamily ? t('dashboard.familyModal.saveChanges', 'Save Changes') : t('dashboard.familyModal.addMember', 'Add Member')}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* ===== APPOINTMENTS ===== */}
        <Section id="appointments" title={t('dashboard.section.appointments', 'Appointments')} icon="👨‍⚕️" active={activeSection}
          action={<button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/consult-doctor')}>{t('dashboard.appointments.bookNew', '+ Book Doctor')}</button>}
        >
          {appointments.length === 0 ? (
            <EmptyCard
              icon="👨‍⚕️"
              title={t('dashboard.appointments.noneTitle', 'No appointments yet')}
              desc={t('dashboard.appointments.noneDesc', 'Consult a doctor online or schedule a visit — your appointments will list here.')}
              ctaLabel={t('dashboard.appointments.consultCta', 'Consult Doctor')}
              onCta={() => navigate('/consult-doctor')}
            />
          ) : (
          <>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{t('dashboard.appointments.upcoming', 'Upcoming')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {upcomingAppts.map(a => (
              <div key={a.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>🩺 {a.doctor}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.specialty} · {a.mode}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>📅 {a.date} · 🕘 {a.time}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {a.link && <button className="btn btn-green btn-sm" onClick={() => window.open(a.link, '_blank')}>{t('dashboard.appointments.joinMeeting', '🔗 Join Meeting')}</button>}
                  <button className="btn btn-outline btn-sm" onClick={() => { setShowReschedule(a); setRescheduleDate(null); setRescheduleSlot(null); }}>{t('dashboard.appointments.reschedule', 'Reschedule')}</button>
                </div>
              </div>
            ))}
            {upcomingAppts.length === 0 && (
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t('dashboard.appointments.noUpcoming', 'No upcoming appointments')}</p>
            )}
          </div>

          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{t('dashboard.appointments.past', 'Past Appointments')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pastAppts.length === 0 && (
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t('dashboard.appointments.noPast', 'No past appointments')}</p>
            )}
            {pastAppts.map(a => (
              <div key={a.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>🩺 {a.doctor}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.specialty} · {a.mode} · {a.date}</div>
                  </div>
                  <Badge variant="green">{t('dashboard.appointments.completed', 'Completed ✓')}</Badge>
                </div>
                {a.diagnosis && (
                  <div style={{ marginTop: 8, padding: 10, background: '#f8f9fa', borderRadius: 8, fontSize: 12 }}>
                    <div><strong>{t('dashboard.appointments.diagnosis', 'Diagnosis:')}</strong> {a.diagnosis}</div>
                    <div style={{ marginTop: 4 }}><strong>{t('dashboard.appointments.prescription', 'Prescription:')}</strong> {a.prescription}</div>
                    {a.followUp && <div style={{ marginTop: 4 }}><strong>{t('dashboard.appointments.followUp', 'Follow-up:')}</strong> {a.followUp}</div>}
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => { window.open(`https://wa.me/?text=${encodeURIComponent(`I need a follow-up appointment for ${a.diagnosis} (Previous: Dr. ${a.doctor}, ${a.date})`)}`, '_blank'); }}>{t('dashboard.appointments.bookFollowup', '📅 Book Follow-up')}</button>
                      <button className="btn btn-outline btn-sm" onClick={() => setShowPrescriptionModal({ doctor: a.doctor, date: a.date, diagnosis: a.diagnosis, prescription: a.prescription, followUp: a.followUp })}>{t('dashboard.appointments.viewRx', '👁️ View Rx')}</button>
                      <button className="btn btn-outline btn-sm" onClick={() => {
                        const text = `Jeevan HealthCare at Home — Prescription\nDoctor: ${a.doctor}\nDate: ${a.date}\nDiagnosis: ${a.diagnosis}\nPrescription: ${a.prescription}${a.followUp ? `\nFollow-up: ${a.followUp}` : ''}`;
                        const blob = new Blob([text], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const el = document.createElement('a'); el.href = url; el.download = `Prescription_${a.doctor.replace(/\s+/g, '_')}.txt`; el.click(); URL.revokeObjectURL(url);
                      }}>{t('dashboard.appointments.download', '📥 Download')}</button>
                      <button className="btn btn-outline btn-sm" style={{ color: '#16a34a', borderColor: '#bbf7d0' }} onClick={() => {
                        const text = `🩺 Prescription — Dr. ${a.doctor}\n${a.date}\n\nDiagnosis: ${a.diagnosis}\nRx: ${a.prescription}${a.followUp ? `\nFollow-up: ${a.followUp}` : ''}\n\n— Jeevan HealthCare at Home`;
                        if (navigator.share) { navigator.share({ title: `Prescription - Dr. ${a.doctor}`, text }); }
                        else { navigator.clipboard.writeText(text).then(() => alert(t('dashboard.appointments.prescriptionCopied', '✅ Prescription copied!'))); }
                      }}>{t('dashboard.appointments.share', '📤 Share')}</button>
                    </div>
                  </div>
                )}
                <div style={{ marginTop: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => navigate('/diagnostics')} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{t('dashboard.appointments.bookDiag', '🧪 Book Diagnostic Test')}</button>
                </div>
              </div>
            ))}
          </div>
          </>
          )}
        </Section>

        {/* ===== HEALTH WALLET ===== */}
        <Section id="wallet" title={t('dashboard.section.wallet', 'Health Wallet')} icon="💳" active={activeSection}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            <div className="card" style={{ background: 'linear-gradient(135deg, #1866C9, #0F4A96)', color: '#fff', border: 'none' }}>
              <div style={{ fontSize: 13, opacity: 0.85 }}>{t('dashboard.wallet.balance', 'Wallet Balance')}</div>
              <div style={{ fontSize: 32, fontWeight: 800, margin: '4px 0' }}>₹{wallet.balance ?? 0}</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>{t('dashboard.wallet.balanceDesc', 'Use for test bookings & health services')}</div>
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{t('dashboard.wallet.coupons', 'Available Coupons')}</div>
              {(wallet.coupons || []).length === 0 ? (
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{t('dashboard.wallet.noCoupons', 'No coupons available right now. Check back after your next booking.')}</p>
              ) : wallet.coupons.map(c => (
                <div key={c.code} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>{c.code}</strong> — ₹{c.discount} {t('dashboard.wallet.off', 'off')}</span>
                  <span style={{ color: 'var(--text-light)' }}>{t('dashboard.wallet.min', 'Min')} ₹{c.minOrder}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{t('dashboard.wallet.rewards', 'Rewards Earned')}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#E65100' }}>{wallet.rewardsPoints ?? 0} pts</div>
              <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: 8 }} onClick={() => setComingSoon(t('dashboard.wallet.redeem', 'Redeem'))}>{t('dashboard.wallet.redeem', 'Redeem Now')}</button>
            </div>
          </div>
        </Section>

        {/* ===== ABHA HEALTH ID ===== */}
        <Section id="abha" title={t('dashboard.section.abha', 'ABHA Health ID')} icon="🆔" active={activeSection}>
          {abha?.connected && abha?.number ? (
          <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4, #fff)', border: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }} aria-hidden>🆔</span>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{t('dashboard.abha.title', 'ABHA Health ID')}</h3>
                </div>
                <Badge variant="green">{t('dashboard.abha.connected', 'Connected ✅')}</Badge>
                <div style={{ fontSize: 13, marginTop: 8 }}>
                  <strong>{t('dashboard.abha.number', 'ABHA Number:')}</strong> {abha.number}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {t('dashboard.abha.linkedRecords', 'Linked Records:')} {abha.linkedRecords || 0}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setComingSoon(t('dashboard.abha.manage', 'Manage'))}>{t('dashboard.abha.manage', 'Manage')}</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setComingSoon(t('dashboard.abha.update', 'Update'))}>{t('dashboard.abha.update', 'Update')}</button>
              </div>
            </div>
            <div style={{ marginTop: 12, padding: 10, background: '#f0fdf4', borderRadius: 8, fontSize: 11, color: '#16a34a' }}>
              {t('dashboard.abha.benefits', '✅ Digital health records · Easy sharing with healthcare providers · Unified medical history')}
            </div>
          </div>
          ) : (
            <EmptyCard
              icon="🆔"
              title={t('dashboard.abha.notLinkedTitle', 'ABHA not linked yet')}
              desc={t('dashboard.abha.notLinkedDesc', 'Link your Ayushman Bharat Health Account to keep records unified across providers. Setup will be available soon.')}
              ctaLabel={t('dashboard.abha.notifyCta', 'Got it')}
              onCta={() => setComingSoon(t('dashboard.abha.title', 'ABHA Health ID'))}
            />
          )}
        </Section>

        {/* ===== HEALTH CENTER ===== */}
        {activeSection === 'health' && (
          <>
            {/* Health Sub-Tab Nav */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 14, background: '#f3f4f6', borderRadius: 10, padding: 3 }}>
              {[
                { key: 'overview', label: t('dashboard.healthTab.overview', 'Health Overview'), icon: '🩺' },
                { key: 'tracker', label: t('dashboard.healthTab.tracker', 'Daily Tracker'), icon: '📊' },
              ].map(t => (
                <button key={t.key} onClick={() => setHealthSubTab(t.key)}
                  style={{ flex: 1, padding: '8px 12px', border: 'none', borderRadius: 8, background: healthSubTab === t.key ? '#fff' : 'transparent', fontSize: 12, fontWeight: healthSubTab === t.key ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', color: healthSubTab === t.key ? '#1866C9' : '#6B7280', boxShadow: healthSubTab === t.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            {healthSubTab === 'tracker' ? (
              <DailyTracker />
            ) : (
            <div style={{ marginBottom: 24 }}>
              {/* Health Score Full */}
              <div className="card" style={{ padding: 18, marginBottom: 12 }}>
                {store.healthData && healthScoreComputed ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                      <div style={{ width: 72, height: 72, borderRadius: '50%', background: healthScoreComputed.recommendation.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                        {healthScoreComputed.recommendation.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{t('dashboard.healthCenter.scoreTitle', 'Health Score')}</h2>
                        <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1, color: healthScoreComputed.recommendation.color }}>{healthScoreComputed.score}<span style={{ fontSize: 18, fontWeight: 500, color: '#94a3b8' }}>/{healthScoreComputed.max}</span></div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: healthScoreComputed.recommendation.color, marginTop: 2 }}>{healthScoreComputed.recommendation.message}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                      {healthScoreComputed.categories.map(cat => (
                        <div key={cat.key}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, marginBottom: 2 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{cat.icon} {cat.label}</span>
                            <span style={{ fontWeight: 700, color: cat.color }}>{cat.score}/{cat.max}</span>
                          </div>
                          <div style={{ height: 5, background: '#e8edf2', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${(cat.score / cat.max) * 100}%`, height: '100%', background: cat.color, borderRadius: 3 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-primary btn-sm btn-block" style={{ width: '100%' }} onClick={() => { setHealthStep(1); setShowHealthModal(true); }}>{t('dashboard.healthCenter.updateAssessment', 'Update Assessment')}</button>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>🩺</div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>{t('dashboard.healthCenter.yourScore', 'Your Health Score')}</h2>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>{t('dashboard.healthCenter.completeAssessment', 'Complete the assessment to see your score')}</p>
                    <button className="btn btn-primary btn-sm" onClick={() => { setHealthStep(1); setShowHealthModal(true); }}>{t('dashboard.healthCenter.startAssessment', 'Start Health Assessment')}</button>
                  </div>
                )}
              </div>

              <HealthToolsGrid />

              {/* Lab Trends */}
              {store.healthTrends.hba1c.length > 0 && (
                <div className="card" style={{ marginBottom: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>{t('dashboard.healthCenter.labTrends', '📈 Lab Trends')}</h3>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <span>HbA1c</span>
                      <span><TrendArrow value={store.healthTrends.hba1c[store.healthTrends.hba1c.length - 1].value} prev={store.healthTrends.hba1c[store.healthTrends.hba1c.length - 2]?.value} /> {store.healthTrends.hba1c[store.healthTrends.hba1c.length - 1].value}%</span>
                    </div>
                    <div className="dash-trend-svg"><TrendMiniBar values={store.healthTrends.hba1c} color="#1866C9" /></div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="card" style={{ background: 'linear-gradient(135deg, #FFF8E1, #fff)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>{t('dashboard.healthCenter.recommendations', '⭐ Recommendations')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(healthScoreComputed && store.healthData ? getSmartRecommendations(healthScoreComputed, store.healthData) : []).slice(0, 3).map(rec => (
                    <div key={rec.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: '#fff', borderRadius: 10, border: '1px solid #e8edf2' }}>
                      <span style={{ fontSize: 20 }}>🧪</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{rec.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{rec.why}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1866C9' }}>₹{rec.price}</div>
                      </div>
                      <button onClick={() => navigate('/diagnostics')} className="btn btn-primary btn-sm">{t('dashboard.healthCenter.book', 'Book')}</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Physio Cross-Sell (Health Tab) */}
              <PhysioCrossSell
                testResults={store.reports?.flatMap(r =>
                  r.values ? Object.entries(r.values).map(([k, v]) => ({
                    testName: k,
                    value: v.value,
                    status: v.flag || r.status,
                  })) : []
                ) || []}
                patientCondition={store.healthData?.medicalHistory ?
                  Object.keys(store.healthData.medicalHistory).filter(k => store.healthData.medicalHistory[k]).join(', ') : ''}
                source="dashboard-health"
                compact={true}
              />
              <VaccineCrossSell
                patientCondition={store.healthData?.medicalHistory ?
                  Object.keys(store.healthData.medicalHistory).filter(k => store.healthData.medicalHistory[k]).join(', ') : ''}
                source="dashboard-health"
                compact={true}
              />
            </div>
            )}
          </>
        )}

        {/* ===== PROFILE MENU ===== */}
        {activeSection === 'profile' && (
          <div style={{ marginBottom: 24 }}>
            {/* Profile Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: '16px', background: 'linear-gradient(135deg, #1866C9, #0F4A96)', borderRadius: 16, color: '#fff' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700 }}>
                {nameInitial}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name || t('dashboard.profile.yourProfile', 'Your Profile')}</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{p.phone || p.email || t('dashboard.profile.addDetails', 'Add your contact details')}</div>
                {healthScoreComputed?.score != null && <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{t('dashboard.profile.healthScore', 'Health Score:')} {healthScoreComputed.score}/100</div>}
              </div>
            </div>

            {/* ACCOUNT Section */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, padding: '0 4px' }}>{t('dashboard.profile.sectionAccount', 'Account')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
                {[
                  { icon: '👪', label: t('dashboard.profile.familyMembers', 'Family Members'), section: 'family' },
                  { icon: '🧪', label: t('dashboard.profile.reports', 'Reports'), section: 'reports' },
                  { icon: '💳', label: t('dashboard.profile.wallet', 'Wallet'), section: 'wallet' },
                  { icon: '🧾', label: t('dashboard.profile.invoices', 'Invoices'), section: 'invoices' },
                  { icon: '🆔', label: t('dashboard.profile.abha', 'ABHA ID'), section: 'abha' },
                ].map(item => (
                  <button key={item.section} type="button" onClick={() => goToSection(item.section)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'none', border: 'none', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, textAlign: 'left', color: 'var(--text-dark)', WebkitTapHighlightColor: 'transparent', minHeight: 48 }}>
                    <span style={{ fontSize: 18, width: 24, textAlign: 'center' }} aria-hidden>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <span style={{ color: '#cbd5e1' }} aria-hidden>›</span>
                  </button>
                ))}
              </div>
            </div>

            {/* HEALTH Section */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, padding: '0 4px' }}>{t('dashboard.profile.sectionHealth', 'Health')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
                {[
                  { icon: '🩺', label: t('dashboard.profile.healthMenu', 'Health Score'), section: 'health' },
                  { icon: '👨‍⚕️', label: t('dashboard.profile.appointments', 'Appointments'), section: 'appointments' },
                ].map(item => (
                  <button key={item.section} type="button" onClick={() => goToSection(item.section)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'none', border: 'none', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, textAlign: 'left', color: 'var(--text-dark)', WebkitTapHighlightColor: 'transparent', minHeight: 48 }}>
                    <span style={{ fontSize: 18, width: 24, textAlign: 'center' }} aria-hidden>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <span style={{ color: '#cbd5e1' }} aria-hidden>›</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SETTINGS Section */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, padding: '0 4px' }}>{t('dashboard.profile.sectionSettings', 'Settings')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <button type="button" onClick={() => { openProfileEdit(); goToSection('settings'); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'none', border: 'none', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, textAlign: 'left', color: 'var(--text-dark)', WebkitTapHighlightColor: 'transparent', minHeight: 48 }}>
                  <span style={{ fontSize: 18, width: 24, textAlign: 'center' }} aria-hidden>⚙️</span>
                  <span style={{ flex: 1 }}>{t('dashboard.profile.settings', 'Settings')}</span>
                  <span style={{ color: '#cbd5e1' }} aria-hidden>›</span>
                </button>
                <button
                  type="button"
                  onClick={() => { logout(); navigate('/', { replace: true }); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, textAlign: 'left', color: '#dc2626', WebkitTapHighlightColor: 'transparent', minHeight: 48 }}
                >
                  <span style={{ fontSize: 18, width: 24, textAlign: 'center' }} aria-hidden>🚪</span>
                  <span style={{ flex: 1 }}>{t('dashboard.profile.logout', 'Logout')}</span>
                  <span style={{ color: '#fecaca' }}>›</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== NOTIFICATIONS + PRESCRIPTIONS + RECOMMENDATIONS ===== */}
        {activeSection === 'overview' && (
            <div className="dash-section-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
              {/* Notifications */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {t('dashboard.notifs.title', '🔔 Notifications')}
                    {store.unreadCount() > 0 && (
                      <span style={{ background: '#dc2626', color: '#fff', fontSize: 10, padding: '1px 6px', borderRadius: 8 }}>{store.unreadCount()}</span>
                    )}
                  </h3>
                  <button onClick={() => setShowNotifs(!showNotifs)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#1866C9', fontFamily: 'inherit' }}>
                    {showNotifs ? t('dashboard.notifs.hide', 'Hide') : t('dashboard.notifs.viewAll', 'View All')}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {notifs.length === 0 ? (
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{t('dashboard.notifs.empty', 'No notifications yet. We will alert you about bookings and reports here.')}</p>
                  ) : (showNotifs ? notifs : notifs.slice(0, 3)).map(n => (
                    <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12, opacity: n.read ? 0.6 : 1 }}>
                      <span style={{ fontSize: 16 }} aria-hidden>
                        {n.type === 'report' ? '📋' : n.type === 'reminder' ? '⏰' : n.type === 'success' ? '✅' : '🏆'}
                      </span>
                      <span style={{ flex: 1 }}>{n.text}</span>
                      {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', flexShrink: 0 }} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Prescriptions */}
              <div className="card">
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {t('dashboard.prescriptions.title', '📋 Saved Prescriptions')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {prescriptions.length === 0 ? (
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{t('dashboard.prescriptions.empty', 'Upload a prescription to order tests faster next time.')}</p>
                  ) : prescriptions.map(rx => (
                    <div key={rx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 500 }}>🩺 {rx.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{rx.date} · {rx.medicines}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowPrescriptionModal({ doctor: rx.name, date: rx.date, prescription: rx.medicines })}>{t('dashboard.prescriptions.view', '👁️')}</button>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => {
                          const text = `Jeevan HealthCare at Home — Prescription\nDoctor: ${rx.name}\nDate: ${rx.date}\nRx: ${rx.medicines}`;
                          const blob = new Blob([text], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const el = document.createElement('a'); el.href = url; el.download = `Prescription_${String(rx.name).replace(/\s+/g, '_')}.txt`; el.click(); URL.revokeObjectURL(url);
                        }}>{t('dashboard.prescriptions.download', '📥')}</button>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => {
                          const text = `🩺 Prescription — Dr. ${rx.name}\n${rx.date}\n\nRx: ${rx.medicines}\n\n— Jeevan HealthCare at Home`;
                          if (navigator.share) { navigator.share({ title: `Prescription - Dr. ${rx.name}`, text }); }
                          else { navigator.clipboard.writeText(text).then(() => alert(t('dashboard.prescriptions.copied', '✅ Prescription copied!'))); }
                        }}>{t('dashboard.prescriptions.share', '📤')}</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => navigate('/upload-prescription')} className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>{t('dashboard.prescriptions.uploadNew', '📤 Upload New')}</button>
              </div>

              {/* Recommended for You */}
              <div className="card" style={{ background: 'linear-gradient(135deg, #FFF8E1, #fff)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {t('dashboard.recommended.title', '⭐ Recommended for You')}
                </h3>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>
                  {store.healthData ? t('dashboard.recommended.hasData', 'Based on your health profile') : t('dashboard.recommended.noData', 'Take the health assessment for personalized recommendations')}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(() => {
                    const recs = healthScoreComputed && store.healthData
                      ? getSmartRecommendations(healthScoreComputed, store.healthData)
                      : [
                          { name: t('dashboard.recommended.default1Name', 'Complete Blood Count (CBC)'), price: 499, why: t('dashboard.recommended.default1Why', 'Essential baseline test') },
                          { name: t('dashboard.recommended.default2Name', 'Vitamin D & B12'), price: 899, why: t('dashboard.recommended.default2Why', 'Common deficiency check') },
                          { name: t('dashboard.recommended.default3Name', 'Annual Health Checkup'), price: 2499, why: t('dashboard.recommended.default3Why', 'Complete wellness review') },
                        ];
                    return recs.map(rec => (
                      <div key={rec.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: '#fff', borderRadius: 10, border: '1px solid #e8edf2' }}>
                        <span style={{ fontSize: 20 }}>🧪</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>{rec.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{rec.why}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#1866C9', marginTop: 1 }}>₹{rec.price}</div>
                        </div>
                        <button onClick={() => navigate('/diagnostics')} className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>{t('dashboard.recommended.bookNow', 'Book Now')}</button>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Physio Cross-Sell */}
              <PhysioCrossSell
                testResults={store.reports?.flatMap(r =>
                  r.values ? Object.entries(r.values).map(([k, v]) => ({
                    testName: k,
                    value: v.value,
                    status: v.flag || r.status,
                  })) : []
                ) || []}
                patientCondition={store.healthData?.medicalHistory ?
                  Object.keys(store.healthData.medicalHistory).filter(k => store.healthData.medicalHistory[k]).join(', ') : ''}
                source="dashboard-overview"
                compact={false}
              />
              <div style={{ marginTop: 12 }}>
                <VaccineCrossSell
                  patientCondition={store.healthData?.medicalHistory ?
                    Object.keys(store.healthData.medicalHistory).filter(k => store.healthData.medicalHistory[k]).join(', ') : ''}
                  source="dashboard-overview"
                  compact={false}
                />
              </div>
            </div>
        )}

        {/* ===== SETTINGS ===== */}
        <Section id="settings" title={t('dashboard.section.settings', 'Settings')} icon="⚙️" active={activeSection}>
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{t('dashboard.settings.profileSettings', 'Profile Settings')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { label: t('dashboard.settings.fullName', 'Full Name'), value: p.name || '—' },
                { label: t('dashboard.settings.phone', 'Phone'), value: p.phone || '—' },
                { label: t('dashboard.settings.email', 'Email'), value: p.email || '—' },
                { label: t('dashboard.settings.bloodGroup', 'Blood Group'), value: p.bloodGroup || '—' },
                { label: t('dashboard.settings.dob', 'Date of Birth'), value: p.dob || '—' },
                { label: t('dashboard.settings.gender', 'Gender'), value: p.gender || '—' },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{f.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{f.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={openProfileEdit}>{t('dashboard.settings.editProfile', 'Edit Profile')}</button>
              <button type="button" className="btn btn-outline btn-sm" style={{ color: '#dc2626', borderColor: '#fecaca' }} onClick={() => { logout(); navigate('/', { replace: true }); }}>{t('dashboard.profile.logout', 'Logout')}</button>
            </div>
          </div>
        </Section>

        {/* Profile Edit Modal */}
        {showProfileModal && (
          <div className="panel-overlay" onClick={() => setShowProfileModal(false)}>
            <div className="panel" onClick={e => e.stopPropagation()}>
              <div className="panel-header">
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>{t('dashboard.profileModal.title', 'Edit Profile')}</h3>
                <button onClick={() => setShowProfileModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, fontFamily: 'inherit' }}>✕</button>
              </div>
              <div className="panel-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="grid-2">
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.profileModal.fullName', 'Full Name')} *</label>
                      <input className="input" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.profileModal.phone', 'Phone')} *</label>
                      <input className="input" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.profileModal.email', 'Email')}</label>
                    <input className="input" value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="grid-2">
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.profileModal.bloodGroup', 'Blood Group')}</label>
                      <select className="select" value={profileForm.bloodGroup} onChange={e => setProfileForm(f => ({ ...f, bloodGroup: e.target.value }))}>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.profileModal.gender', 'Gender')}</label>
                      <select className="select" value={profileForm.gender} onChange={e => setProfileForm(f => ({ ...f, gender: e.target.value }))}>
                        <option value="Male">{t('dashboard.profileModal.male', 'Male')}</option>
                        <option value="Female">{t('dashboard.profileModal.female', 'Female')}</option>
                        <option value="Other">{t('dashboard.profileModal.other', 'Other')}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.profileModal.dob', 'Date of Birth')}</label>
                    <input className="input" value={profileForm.dob} onChange={e => setProfileForm(f => ({ ...f, dob: e.target.value }))} placeholder={t('dashboard.profileModal.dobPlaceholder', 'e.g. 15 Mar 1990')} />
                  </div>
                  <button onClick={saveProfile} className="btn btn-primary btn-block">{t('dashboard.profileModal.saveChanges', 'Save Changes')}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        </div>{/* .dash-main-inner */}
      </main>

      {/* Prescription View Modal */}
      {showPrescriptionModal && (
        <div className="panel-overlay" onClick={() => setShowPrescriptionModal(null)}>
          <div className="panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="panel-header">
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{t('dashboard.prescriptionModal.title', '🩺 Prescription')}</h3>
              <button onClick={() => setShowPrescriptionModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div className="panel-body">
              <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div><strong>{t('dashboard.prescriptionModal.doctor', 'Doctor:')}</strong> {showPrescriptionModal.doctor}</div>
                <div><strong>{t('dashboard.prescriptionModal.date', 'Date:')}</strong> {showPrescriptionModal.date}</div>
                {showPrescriptionModal.diagnosis && <div><strong>{t('dashboard.prescriptionModal.diagnosis', 'Diagnosis:')}</strong> {showPrescriptionModal.diagnosis}</div>}
                <div style={{ background: '#FFF8E1', padding: 12, borderRadius: 8, border: '1px solid #f0e6b8' }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{t('dashboard.prescriptionModal.medicines', '📋 Prescribed Medicines')}</div>
                  <div>{showPrescriptionModal.prescription}</div>
                </div>
                {showPrescriptionModal.followUp && <div><strong>{t('dashboard.prescriptionModal.followUp', 'Follow-up:')}</strong> {showPrescriptionModal.followUp}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => {
                  const text = `Jeevan HealthCare at Home — Prescription\nDoctor: ${showPrescriptionModal.doctor}\nDate: ${showPrescriptionModal.date}${showPrescriptionModal.diagnosis ? `\nDiagnosis: ${showPrescriptionModal.diagnosis}` : ''}\nRx: ${showPrescriptionModal.prescription}${showPrescriptionModal.followUp ? `\nFollow-up: ${showPrescriptionModal.followUp}` : ''}`;
                  const blob = new Blob([text], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const el = document.createElement('a'); el.href = url; el.download = `Prescription_${showPrescriptionModal.doctor.replace(/\s+/g, '_')}.txt`; el.click(); URL.revokeObjectURL(url);
                }}>{t('dashboard.prescriptionModal.download', '📥 Download')}</button>
                <button className="btn btn-outline btn-sm" style={{ flex: 1, color: '#16a34a', borderColor: '#bbf7d0' }} onClick={() => {
                  const text = `🩺 Prescription — Dr. ${showPrescriptionModal.doctor}\n${showPrescriptionModal.date}${showPrescriptionModal.diagnosis ? `\nDiagnosis: ${showPrescriptionModal.diagnosis}` : ''}\nRx: ${showPrescriptionModal.prescription}${showPrescriptionModal.followUp ? `\nFollow-up: ${showPrescriptionModal.followUp}` : ''}\n\n— Jeevan HealthCare at Home`;
                  if (navigator.share) { navigator.share({ title: `Prescription - Dr. ${showPrescriptionModal.doctor}`, text }); }
                  else { navigator.clipboard.writeText(text).then(() => alert(t('dashboard.prescriptionModal.copied', '✅ Prescription copied!'))); }
                }}>{t('dashboard.prescriptionModal.share', '📤 Share')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Assessment Modal — Multi-step */}
      {showHealthModal && (
        <div className="panel-overlay" onClick={() => setShowHealthModal(false)}>
          <div className="panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="panel-header">
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{t('dashboard.healthModal.title', '🩺 Health Assessment')}</h3>
              <button onClick={() => setShowHealthModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, fontFamily: 'inherit' }}>✕</button>
            </div>
            <div className="panel-body">
              <StepIndicator current={healthStep} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 260 }}>

                {/* STEP 1: Personal Profile */}
                {healthStep === 1 && (
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{t('dashboard.healthModal.step1Title', '👤 Personal Profile')}</h4>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>{t('dashboard.healthModal.step1Desc', 'Basic details for risk assessment')}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.healthModal.ageGroup', 'Age Group')}</label>
                        <select className="select" value={healthForm.personalProfile.ageGroup} onChange={e => setHealthForm(f => ({ ...f, personalProfile: { ...f.personalProfile, ageGroup: e.target.value } }))}>
                          <option value="">{t('dashboard.healthModal.selectAgeGroup', 'Select age group')}</option>
                          <option value="below-25">{t('dashboard.healthModal.below25', 'Below 25')}</option>
                          <option value="25-35">{t('dashboard.healthModal.age25to35', '25 – 35')}</option>
                          <option value="36-45">{t('dashboard.healthModal.age36to45', '36 – 45')}</option>
                          <option value="46-55">{t('dashboard.healthModal.age46to55', '46 – 55')}</option>
                          <option value="above-55">{t('dashboard.healthModal.above55', 'Above 55')}</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.healthModal.gender', 'Gender')}</label>
                        <select className="select" value={healthForm.personalProfile.gender} onChange={e => setHealthForm(f => ({ ...f, personalProfile: { ...f.personalProfile, gender: e.target.value } }))}>
                          <option value="">{t('dashboard.healthModal.select', 'Select')}</option>
                          <option value="male">{t('dashboard.healthModal.male', 'Male')}</option>
                          <option value="female">{t('dashboard.healthModal.female', 'Female')}</option>
                          <option value="other">{t('dashboard.healthModal.other', 'Other')}</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.healthModal.city', 'City / Area')}</label>
                        <input className="input" placeholder={t('dashboard.healthModal.cityPlaceholder', 'e.g. Hyderabad')} value={healthForm.personalProfile.location} onChange={e => setHealthForm(f => ({ ...f, personalProfile: { ...f.personalProfile, location: e.target.value } }))} />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Lifestyle */}
                {healthStep === 2 && (
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{t('dashboard.healthModal.step2Title', '🏃 Lifestyle & Habits')}</h4>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>{t('dashboard.healthModal.step2Desc', 'How you live affects your health score')}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.healthModal.smoking', 'Smoking / Tobacco')}</label>
                        <select className="select" value={healthForm.lifestyle.smoking} onChange={e => setHealthForm(f => ({ ...f, lifestyle: { ...f.lifestyle, smoking: e.target.value } }))}>
                          <option value="never">{t('dashboard.healthModal.smokeNever', 'Never used')}</option>
                          <option value="quit">{t('dashboard.healthModal.smokeQuit', 'Quit more than 1 year ago')}</option>
                          <option value="occasional">{t('dashboard.healthModal.smokeOccasional', 'Occasionally')}</option>
                          <option value="daily">{t('dashboard.healthModal.smokeDaily', 'Daily smoker')}</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.healthModal.alcohol', 'Alcohol Consumption')}</label>
                        <select className="select" value={healthForm.lifestyle.alcohol} onChange={e => setHealthForm(f => ({ ...f, lifestyle: { ...f.lifestyle, alcohol: e.target.value } }))}>
                          <option value="never">{t('dashboard.healthModal.alcoholNever', 'Never')}</option>
                          <option value="occasional">{t('dashboard.healthModal.alcoholOccasional', 'Occasionally')}</option>
                          <option value="weekly">{t('dashboard.healthModal.alcoholWeekly', 'Weekly')}</option>
                          <option value="frequent">{t('dashboard.healthModal.alcoholFrequent', 'Daily / Frequent')}</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.healthModal.activity', 'Physical Activity')}</label>
                        <select className="select" value={healthForm.lifestyle.exercise} onChange={e => setHealthForm(f => ({ ...f, lifestyle: { ...f.lifestyle, exercise: e.target.value } }))}>
                          <option value="frequent">{t('dashboard.healthModal.activityFrequent', 'Exercise 5+ days/week')}</option>
                          <option value="moderate">{t('dashboard.healthModal.activityModerate', 'Exercise 2–4 days/week')}</option>
                          <option value="sedentary">{t('dashboard.healthModal.activitySedentary', 'Mostly sitting')}</option>
                          <option value="none">{t('dashboard.healthModal.activityNone', 'No activity')}</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.healthModal.sleep', 'Sleep')}</label>
                        <select className="select" value={healthForm.lifestyle.sleep} onChange={e => setHealthForm(f => ({ ...f, lifestyle: { ...f.lifestyle, sleep: e.target.value } }))}>
                          <option value="good">{t('dashboard.healthModal.sleepGood', '7–9 hours')}</option>
                          <option value="fair">{t('dashboard.healthModal.sleepFair', '5–7 hours')}</option>
                          <option value="poor">{t('dashboard.healthModal.sleepPoor', 'Less than 5 hours')}</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.healthModal.stress', 'Stress Level')}</label>
                        <select className="select" value={healthForm.lifestyle.stress} onChange={e => setHealthForm(f => ({ ...f, lifestyle: { ...f.lifestyle, stress: e.target.value } }))}>
                          <option value="low">{t('dashboard.healthModal.stressLow', 'Low')}</option>
                          <option value="moderate">{t('dashboard.healthModal.stressModerate', 'Moderate')}</option>
                          <option value="high">{t('dashboard.healthModal.stressHigh', 'High')}</option>
                          <option value="very-high">{t('dashboard.healthModal.stressVeryHigh', 'Very High')}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Body Measurements */}
                {healthStep === 3 && (
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{t('dashboard.healthModal.step3Title', '⚖️ Body Measurements')}</h4>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>{t('dashboard.healthModal.step3Desc', 'Height, weight & BMI calculation')}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.healthModal.height', 'Height (cm)')}</label>
                        <input className="input" type="number" placeholder={t('dashboard.healthModal.heightPlaceholder', 'e.g. 170')} value={healthForm.bodyMeasurements.heightCm} onChange={e => setHealthForm(f => ({ ...f, bodyMeasurements: { ...f.bodyMeasurements, heightCm: e.target.value } }))} min={50} max={250} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.healthModal.weight', 'Weight (kg)')}</label>
                        <input className="input" type="number" placeholder={t('dashboard.healthModal.weightPlaceholder', 'e.g. 72')} value={healthForm.bodyMeasurements.weightKg} onChange={e => setHealthForm(f => ({ ...f, bodyMeasurements: { ...f.bodyMeasurements, weightKg: e.target.value } }))} min={10} max={300} />
                      </div>
                    </div>
                    {healthForm.bodyMeasurements.heightCm && healthForm.bodyMeasurements.weightKg && (
                      <div style={{ marginTop: 10, padding: '8px 12px', background: '#F0F9FF', borderRadius: 8, fontSize: 12 }}>
                        <span style={{ fontWeight: 700 }}>BMI: </span>
                        {(() => {
                          const h = parseFloat(healthForm.bodyMeasurements.heightCm) / 100;
                          const w = parseFloat(healthForm.bodyMeasurements.weightKg);
                          if (h > 0 && w > 0) {
                            const bmi = Math.round((w / (h * h)) * 10) / 10;
                            const cat = bmi < 18.5 ? t('dashboard.healthModal.underweight', 'Underweight') : bmi < 25 ? t('dashboard.healthModal.healthy', 'Healthy') : bmi < 30 ? t('dashboard.healthModal.overweight', 'Overweight') : bmi < 35 ? t('dashboard.healthModal.obese', 'Obese') : t('dashboard.healthModal.severelyObese', 'Severely Obese');
                            const catColor = bmi < 18.5 ? '#EAB308' : bmi < 25 ? '#16a34a' : bmi < 30 ? '#F97316' : '#dc2626';
                            return <span>{bmi} — <span style={{ color: catColor, fontWeight: 600 }}>{cat}</span></span>;
                          }
                          return '—';
                        })()}
                      </div>
                    )}
                    <div style={{ marginTop: 8 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('dashboard.healthModal.waist', 'Waist Circumference (cm)')} — <span style={{ fontWeight: 400, color: '#94a3b8' }}>{t('dashboard.healthModal.optional', 'optional')}</span></label>
                      <input className="input" type="number" placeholder={t('dashboard.healthModal.waistPlaceholder', 'e.g. 90')} value={healthForm.bodyMeasurements.waistCm} onChange={e => setHealthForm(f => ({ ...f, bodyMeasurements: { ...f.bodyMeasurements, waistCm: e.target.value } }))} />
                    </div>
                  </div>
                )}

                {/* STEP 4: Family History */}
                {healthStep === 4 && (
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{t('dashboard.healthModal.step4Title', '🧬 Family History')}</h4>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>{t('dashboard.healthModal.step4Desc', 'Does anyone in your family have these conditions?')}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { key: 'diabetes', label: t('dashboard.healthModal.diabetes', 'Diabetes'), icon: '🩸' },
                        { key: 'bp', label: t('dashboard.healthModal.highBp', 'High Blood Pressure'), icon: '🫀' },
                        { key: 'heartDisease', label: t('dashboard.healthModal.heartDisease', 'Heart Disease'), icon: '❤️' },
                        { key: 'thyroid', label: t('dashboard.healthModal.thyroid', 'Thyroid Disease'), icon: '🦋' },
                        { key: 'cancer', label: t('dashboard.healthModal.cancer', 'Cancer'), icon: '🎗️' },
                      ].map(opt => (
                        <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, cursor: 'pointer', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, background: healthForm.familyHistory[opt.key] ? '#e8f0fe' : '#fff', userSelect: 'none', transition: 'all 0.15s' }}>
                          <input type="checkbox" checked={!!healthForm.familyHistory[opt.key]} onChange={e => setHealthForm(f => ({ ...f, familyHistory: { ...f.familyHistory, [opt.key]: e.target.checked } }))} style={{ accentColor: '#1866C9' }} />
                          <span>{opt.icon}</span>
                          <span style={{ fontWeight: healthForm.familyHistory[opt.key] ? 600 : 400 }}>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: Medical History */}
                {healthStep === 5 && (
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{t('dashboard.healthModal.step5Title', '💊 Medical History')}</h4>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>{t('dashboard.healthModal.step5Desc', 'Do you currently have any health conditions?')}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {MEDICAL_CONDITIONS.map(cond => (
                        <label key={cond.key} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, cursor: 'pointer', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, background: healthForm.medicalHistory[cond.key] ? '#FFF0F0' : '#fff', userSelect: 'none', transition: 'all 0.15s' }}>
                          <input type="checkbox" checked={!!healthForm.medicalHistory[cond.key]} onChange={e => setHealthForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, [cond.key]: e.target.checked } }))} style={{ accentColor: '#dc2626' }} />
                          <span style={{ fontWeight: healthForm.medicalHistory[cond.key] ? 600 : 400 }}>{t('dashboard.medicalCondition.' + cond.key, cond.label)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: Lab Results */}
                {healthStep === 6 && (
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{t('dashboard.healthModal.step6Title', '🔬 Lab Results')}</h4>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>{t('dashboard.healthModal.step6Desc', 'Enter your latest report values (leave blank if unknown)')}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 2 }}>{t('dashboard.healthModal.labHba1c', 'HbA1c (%)')}</label>
                        <input className="input" type="number" step="0.1" placeholder={t('dashboard.healthModal.labHba1cPlaceholder', 'e.g. 5.4')} value={healthForm.labResults.hba1c} onChange={e => setHealthForm(f => ({ ...f, labResults: { ...f.labResults, hba1c: e.target.value } }))} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 2 }}>{t('dashboard.healthModal.labLdl', 'LDL (mg/dL)')}</label>
                        <input className="input" type="number" placeholder={t('dashboard.healthModal.labLdlPlaceholder', 'e.g. 95')} value={healthForm.labResults.ldl} onChange={e => setHealthForm(f => ({ ...f, labResults: { ...f.labResults, ldl: e.target.value } }))} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 2 }}>{t('dashboard.healthModal.labTsh', 'TSH (mIU/L)')}</label>
                        <input className="input" type="number" step="0.1" placeholder={t('dashboard.healthModal.labTshPlaceholder', 'e.g. 2.5')} value={healthForm.labResults.tsh} onChange={e => setHealthForm(f => ({ ...f, labResults: { ...f.labResults, tsh: e.target.value } }))} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 2 }}>{t('dashboard.healthModal.labVitaminD', 'Vitamin D (ng/mL)')}</label>
                        <input className="input" type="number" placeholder={t('dashboard.healthModal.labVitaminDPlaceholder', 'e.g. 35')} value={healthForm.labResults.vitaminD} onChange={e => setHealthForm(f => ({ ...f, labResults: { ...f.labResults, vitaminD: e.target.value } }))} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 2 }}>{t('dashboard.healthModal.labCreatinine', 'Creatinine (mg/dL)')}</label>
                        <input className="input" type="number" step="0.1" placeholder={t('dashboard.healthModal.labCreatininePlaceholder', 'e.g. 1.0')} value={healthForm.labResults.creatinine} onChange={e => setHealthForm(f => ({ ...f, labResults: { ...f.labResults, creatinine: e.target.value } }))} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 2 }}>{t('dashboard.healthModal.labAlt', 'ALT (U/L)')}</label>
                        <input className="input" type="number" placeholder={t('dashboard.healthModal.labAltPlaceholder', 'e.g. 30')} value={healthForm.labResults.alt} onChange={e => setHealthForm(f => ({ ...f, labResults: { ...f.labResults, alt: e.target.value } }))} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  {healthStep > 1 && (
                    <button onClick={() => setHealthStep(s => s - 1)} className="btn btn-outline btn-sm" style={{ flex: 1 }}>{t('dashboard.healthModal.back', '← Back')}</button>
                  )}
                  {healthStep < 6 ? (
                    <button onClick={() => setHealthStep(s => s + 1)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>{t('dashboard.healthModal.next', 'Next →')}</button>
                  ) : (
                    <button onClick={() => {
                      const bm = healthForm.bodyMeasurements;
                      const h = parseFloat(bm.heightCm) / 100;
                      const w = parseFloat(bm.weightKg);
                      const data = {
                        personalProfile: { ...healthForm.personalProfile },
                        lifestyle: { ...healthForm.lifestyle },
                        bodyMeasurements: {
                          heightCm: bm.heightCm ? parseFloat(bm.heightCm) : 0,
                          weightKg: bm.weightKg ? parseFloat(bm.weightKg) : 0,
                          bmi: h > 0 && w > 0 ? Math.round((w / (h * h)) * 10) / 10 : 0,
                          waistCm: bm.waistCm ? parseFloat(bm.waistCm) : 0,
                        },
                        familyHistory: { ...healthForm.familyHistory },
                        medicalHistory: { ...healthForm.medicalHistory },
                        labResults: Object.fromEntries(Object.entries(healthForm.labResults).map(([k, v]) => [k, parseFloat(v) || ''])),
                      };
                      store.updateHealthData(data);
                      setShowHealthModal(false);
                      setHealthStep(1);
                    }} className="btn btn-primary btn-sm" style={{ flex: 1 }}>{t('dashboard.healthModal.save', '💾 Save Assessment')}</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Toast */}
      {comingSoon && (
        <div style={{ position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 99999, background: '#1e293b', color: '#fff', padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', animation: 'fadeInUp 0.3s ease', whiteSpace: 'nowrap' }}>
          🚧 {comingSoon} — {t('dashboard.comingSoon', 'Coming Soon')}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes dashShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .dash-main-inner { max-width: 1080px; margin: 0 auto; width: 100%; }
        .dash-sidebar { display: flex; flex-direction: column; }
        .dash-sidebar-nav { flex: 1; overflow-y: auto; padding-bottom: 8px; }
        .dash-sidebar-foot { border-top: 1px solid var(--border); padding: 8px 0 12px; margin-top: auto; }
        .dash-side-link {
          display: flex; align-items: center; gap: 10px; padding: 10px 20px; width: 100%;
          font-size: 13px; font-weight: 500; color: var(--text-body); background: transparent;
          border: none; border-right: 3px solid transparent; cursor: pointer; font-family: inherit;
          text-align: left; transition: background 0.12s, color 0.12s;
        }
        .dash-side-link:hover { background: #f0f7ff; color: #1866C9; }
        .dash-side-link.active { background: #e8f0fe; color: #1866C9; font-weight: 600; border-right-color: #1866C9; }
        .dash-side-logout { color: #dc2626 !important; font-weight: 600; }
        .dash-side-logout:hover { background: #fef2f2 !important; }

        .dash-header-top { display: flex; align-items: stretch; gap: 14px; margin-bottom: 12px; }
        .dash-header-identity { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
        .dash-avatar {
          width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #1866C9, #0F4A96);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; color: #fff; font-weight: 700;
        }
        .dash-greeting {
          font-size: 18px; font-weight: 700; margin: 0; color: var(--text-dark);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .dash-greeting-sub { font-size: 12px; color: var(--text-secondary); margin: 3px 0 0; }
        .dash-back-link {
          background: none; border: none; padding: 0; color: #1866C9; font-weight: 600;
          font-size: 12px; cursor: pointer; font-family: inherit;
        }
        .dash-hdr-trend { flex-shrink: 0; display: flex; align-items: center; }
        .dash-trend-card {
          background: #fff; border-radius: 12px; border: 1px solid #e8edf2;
          padding: 6px 10px; display: flex; align-items: center; gap: 8px;
        }
        .dash-hdr-score { flex-shrink: 0; display: flex; align-items: center; }
        .dash-score-btn {
          background: #fff; border-radius: 12px; border: 1px solid #e8edf2;
          padding: 6px 14px 6px 10px; display: flex; align-items: center; gap: 8px;
          cursor: pointer; font-family: inherit; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .dash-score-btn:hover { border-color: #cbd5e1; box-shadow: 0 2px 8px rgba(15,23,42,0.06); }
        .dash-score-icon {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        .dash-score-label { font-size: 9px; color: var(--text-secondary); font-weight: 600; line-height: 1.1; letter-spacing: 0.02em; }
        .dash-score-value { font-size: 20px; font-weight: 800; line-height: 1.2; }
        .dash-score-value span { font-size: 12px; font-weight: 500; color: #94a3b8; }
        .dash-score-zone { font-size: 9px; font-weight: 600; line-height: 1.1; }

        .dash-assess-cta {
          display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 12px;
          border: 2px dashed #1866C9; background: #F0F7FF; color: #1866C9; font-weight: 700;
          font-size: 13px; cursor: pointer; font-family: inherit; width: 100%;
          justify-content: center; min-height: 44px; margin-bottom: 10px;
        }
        .dash-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .dash-action-primary, .dash-action-secondary {
          display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 12px;
          font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit;
          text-align: left; width: 100%; min-height: 50px; transition: filter 0.15s, box-shadow 0.15s;
        }
        .dash-action-primary {
          border: none; background: linear-gradient(135deg, #1866C9, #2B7BE8); color: #fff;
        }
        .dash-action-primary:hover { filter: brightness(1.05); box-shadow: 0 4px 14px rgba(24,102,201,0.25); }
        .dash-action-secondary {
          border: 2px solid var(--primary, #1866C9); background: #fff; color: var(--primary, #1866C9);
        }
        .dash-action-secondary:hover { background: #f0f7ff; }

        .dash-mobile-nav { display: none; margin-bottom: 14px; }
        .dash-mobile-nav nav {
          display: flex; gap: 6px; overflow-x: auto; padding: 4px 2px 8px;
          scrollbar-width: none; -webkit-overflow-scrolling: touch; -ms-overflow-style: none;
        }
        .dash-mobile-nav nav::-webkit-scrollbar { display: none; }
        .dash-chip {
          display: flex; align-items: center; gap: 6px; padding: 8px 14px;
          font-size: 12px; font-weight: 500; color: #6B7280; background: #F3F4F6;
          border: 1px solid transparent; cursor: pointer; font-family: inherit;
          white-space: nowrap; border-radius: 20px; min-height: 38px; flex-shrink: 0;
          transition: all 0.15s; -webkit-tap-highlight-color: transparent;
        }
        .dash-chip.active { font-weight: 700; color: #1866C9; background: #E8F0FE; border-color: #CBD5E1; }
        .dash-more-panel {
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;
          padding: 10px; background: #fff; border: 1px solid #e8edf2; border-radius: 12px;
        }
        .dash-more-item {
          display: flex; align-items: center; gap: 8px; padding: 12px 10px; border-radius: 10px;
          border: 1px solid #e8edf2; background: #f8fafc; font-size: 12px; font-weight: 600;
          color: #334155; cursor: pointer; font-family: inherit; min-height: 44px;
        }
        .dash-more-logout { color: #dc2626; grid-column: 1 / -1; justify-content: center; background: #fef2f2; border-color: #fecaca; }

        .overview-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr));
          gap: 12px; margin-bottom: 16px;
        }
        .dash-stat-card {
          text-align: left; cursor: pointer; padding: 16px 14px; border-radius: 14px;
          border: 1px solid #e8edf2; background: #fff; font-family: inherit;
          display: flex; flex-direction: column; gap: 10px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .dash-stat-card:hover {
          border-color: var(--stat-color, #1866C9);
          box-shadow: 0 4px 14px color-mix(in srgb, var(--stat-color, #1866C9) 12%, transparent);
        }
        .dash-stat-icon {
          width: 36px; height: 36px; border-radius: 10px; background: var(--stat-bg, #eff6ff);
          display: flex; align-items: center; justify-content: center; font-size: 18px;
        }
        .dash-stat-value { font-size: 28px; font-weight: 800; color: var(--stat-color, #2563eb); line-height: 1.1; }
        .dash-stat-label { font-size: 12px; color: #64748b; font-weight: 500; line-height: 1.3; }

        .dash-section-grid-2 {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 12px; margin-bottom: 16px;
        }
        .dash-preview-card { padding: 16px; }
        .dash-preview-head {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 8px;
        }
        .dash-preview-head h3 { font-size: 14px; font-weight: 700; margin: 0; }
        .dash-link-btn {
          background: none; border: none; color: #1866C9; font-size: 12px; font-weight: 600;
          cursor: pointer; font-family: inherit; flex-shrink: 0;
        }

        .dash-secondary-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 8px; margin-bottom: 20px;
        }
        .dash-secondary-tile {
          display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 8px;
          border-radius: 12px; border: 1px solid #e8edf2; background: #fff; cursor: pointer;
          font-family: inherit; font-size: 11px; font-weight: 600; color: #334155; min-height: 72px;
          -webkit-tap-highlight-color: transparent; transition: border-color 0.15s;
        }
        .dash-secondary-tile:hover { border-color: #1866C9; }

        .dash-welcome {
          text-align: center; padding: 28px 20px; margin-bottom: 16px;
          border: 1px solid #dbeafe; background: linear-gradient(180deg, #f0f7ff 0%, #fff 100%);
          border-radius: 16px;
        }
        .dash-welcome-icon { font-size: 32px; margin-bottom: 8px; }
        .dash-welcome h2 { font-size: 16px; font-weight: 800; margin: 0 0 6px; color: #0f172a; }
        .dash-welcome p { font-size: 13px; color: #64748b; margin: 0 0 14px; line-height: 1.5; max-width: 420px; margin-left: auto; margin-right: auto; }
        .dash-welcome-actions { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }

        .dash-loading-block { margin-bottom: 16px; }
        .dash-skel-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 8px; }
        .dash-skel-card {
          height: 96px; border-radius: 14px; border: 1px solid #e8edf2;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%; animation: dashShimmer 1.2s infinite;
        }
        .dash-loading-text { font-size: 12px; color: #1866C9; font-weight: 600; margin: 0; text-align: center; }

        @media (max-width: 900px) {
          .dash-skel-row { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .dash-sidebar { display: none !important; }
          .dash-mobile-nav {
            display: block !important;
            position: sticky; top: var(--header-height, 56px); z-index: 40;
            background: rgba(248, 250, 252, 0.96);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            margin: 0 -10px 12px; padding: 6px 10px 4px;
            border-bottom: 1px solid #e8edf2;
          }
          .dash-main { padding: 12px 10px !important; padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px)) !important; }
          .dash-greeting { font-size: 16px !important; }
          .dash-header-top { flex-direction: column !important; gap: 10px !important; }
          .dash-hdr-score .dash-score-btn { width: 100%; justify-content: flex-start; }
          .dash-hdr-trend { width: 100%; }
          .dash-trend-card { width: 100%; justify-content: space-between; }
          .dash-trend-card svg { width: 80px; }
          .dash-actions { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .overview-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          .dash-stat-card { padding: 14px 10px !important; }
          .dash-stat-value { font-size: 24px !important; }
          .dash-stat-label { font-size: 11px !important; }
          .dash-main .card { padding: 14px !important; border-radius: 16px !important; }
          .dash-section-grid-2 { grid-template-columns: 1fr !important; gap: 10px !important; }
          .dash-secondary-grid { display: none !important; }
          .dash-family-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .dash-main .btn { min-height: 40px; font-size: 12px !important; }
          .dash-main .btn-sm { min-height: 34px; padding: 6px 10px !important; font-size: 11px !important; }
          .report-search-bar { flex-direction: row !important; flex-wrap: nowrap !important; }
          .report-search-bar select { width: auto !important; min-width: 100px !important; }
          .dash-score-zone { display: none; }
          .dash-avatar { width: 42px; height: 42px; font-size: 18px; }
        }
        @media (max-width: 480px) {
          .dash-hdr-trend { display: none !important; }
          .dash-actions { grid-template-columns: 1fr !important; }
          .dash-family-grid { grid-template-columns: 1fr !important; }
          .dash-greeting { font-size: 15px !important; }
          .dash-main .card { padding: 12px !important; }
          .dash-main .input, .dash-main .select { padding: 10px 12px !important; font-size: 13px !important; }
          .report-search-bar { flex-direction: column !important; gap: 6px !important; }
          .report-search-bar select { width: 100% !important; }
          .dash-skel-row { grid-template-columns: 1fr 1fr; }
          .dash-welcome-actions { flex-direction: column; }
          .dash-welcome-actions .btn { width: 100%; }
        }
        @media (hover: none) {
          .dash-stat-card:hover { box-shadow: none; border-color: #e8edf2; }
          .dash-side-link:hover { background: transparent; color: inherit; }
          .dash-side-link.active:hover { background: #e8f0fe; color: #1866C9; }
        }
      `}</style>
    </div>
  );
}
