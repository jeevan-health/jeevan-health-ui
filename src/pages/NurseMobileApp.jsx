import { useState } from 'react';
import { useT } from '../i18n/LanguageProvider';

const C = { primary: '#0891b2', primaryLight: '#ECFEFF', accent: '#06b6d4', bg: '#F0FDFA' };

const APP_FEATURES = [
  { icon: '📊', title: 'Today\'s Visits', desc: 'View all scheduled visits for the day with patient details and timings.' },
  { icon: '👥', title: 'Assigned Patients', desc: 'Complete list of assigned patients with medical history and care plans.' },
  { icon: '🗺️', title: 'Navigation', desc: 'Google Maps integration for turn-by-turn directions to patient locations.' },
  { icon: '📍', title: 'Check-in/Check-out', desc: 'Mark your arrival and departure with geo-tagged timestamps.' },
  { icon: '📊', title: 'Vital Entry', desc: 'Record patient vitals — BP, pulse, SpO2, temperature, blood sugar, pain level.' },
  { icon: '📝', title: 'Care Notes', desc: 'Document procedures performed, observations, and care provided.' },
  { icon: '📸', title: 'Upload Images', desc: 'Capture and upload wound photos, documents, and reports securely.' },
  { icon: '⭐', title: 'Patient Feedback', desc: 'Collect patient/family feedback and ratings after each visit.' },
  { icon: '🚨', title: 'Emergency Alert', desc: 'One-tap emergency alert to Jeevan central command center.' },
  { icon: '💰', title: 'Payout Dashboard', desc: 'Track earnings, completed visits, pending payouts, and request withdrawals.' },
  { icon: '📅', title: 'Schedule View', desc: 'Weekly calendar view with shift assignments and time-off requests.' },
  { icon: '💬', title: 'Chat Support', desc: 'In-app chat with care coordinators, doctors, and family members.' },
];

const SCREENS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', color: '#0891b2' },
  { id: 'patients', label: 'Patients', icon: '👥', color: '#8B5CF6' },
  { id: 'vitals', label: 'Vitals Entry', icon: '📊', color: '#10B981' },
  { id: 'navigation', label: 'Navigation', icon: '🗺️', color: '#F59E0B' },
  { id: 'payouts', label: 'Payouts', icon: '💰', color: '#EC4899' },
];

export default function NurseMobileApp() {
  const t = useT();
  const [activeScreen, setActiveScreen] = useState('dashboard');

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.accent} 100%)`, padding: '36px 0 40px', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontSize: 48, marginBottom: 8 }}>📱</div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: '0 0 4px' }}>{t('nurse.app.title', 'Jeevan Nurse Mobile App')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '0 auto 16px', maxWidth: 400 }}>
            {t('nurse.app.subtitle', 'Everything a nurse needs — schedule, patients, vitals, navigation, and payouts — in one app')}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#" style={{ padding: '12px 24px', background: '#000', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              ▶ {t('nurse.app.playStore', 'Google Play')}
            </a>
            <a href="#" style={{ padding: '12px 24px', background: '#000', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              🍎 {t('nurse.app.appStore', 'App Store')}
            </a>
          </div>
        </div>
      </div>

      <div className="page-section container">
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'start' }}>
          <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: 16 }}>
            <div style={{ display: 'grid', gap: 4 }}>
              {SCREENS.map(s => (
                <button key={s.id} onClick={() => setActiveScreen(s.id)}
                  style={{ padding: '10px 14px', borderRadius: 8, border: 'none', background: activeScreen === s.id ? `${s.color}15` : 'transparent', color: activeScreen === s.id ? s.color : '#475569', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: activeScreen === s.id ? 700 : 400, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ maxWidth: 300, margin: '0 auto', border: '3px solid #1a1a2e', borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
              <div style={{ background: '#1a1a2e', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', fontSize: 11 }}>
                <span>9:41</span>
                <span>📶 🔋</span>
              </div>
              <div style={{ background: '#fff', padding: 16, minHeight: 400 }}>
                {activeScreen === 'dashboard' && (
                  <div>
                    <div style={{ background: C.primary, padding: 12, borderRadius: 8, color: '#fff', marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{t('nurse.app.greeting', 'Good Morning,')}</div>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>{t('nurse.app.nurseName', 'Sr. Lakshmi')}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                      {[
                        { value: '5', label: t('nurse.app.today', 'Today Visits'), color: C.primary },
                        { value: '3', label: t('nurse.app.pending', 'Pending'), color: '#F59E0B' },
                        { value: '2', label: t('nurse.app.completed', 'Completed'), color: '#22C55E' },
                        { value: '₹8.5k', label: t('nurse.app.earnings', 'This Month'), color: '#EC4899' },
                      ].map(s => (
                        <div key={s.label} style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                          <div style={{ fontSize: 9, color: '#64748b' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#0f172a' }}>{t('nurse.app.schedule', 'Today\'s Schedule')}</div>
                    {[
                      { time: '8:00 AM', patient: 'Mr. R. Sharma', service: 'Wound Dressing', status: 'checked-in' },
                      { time: '10:30 AM', patient: 'Mrs. P. Reddy', service: 'IV Fluids', status: 'pending' },
                      { time: '2:00 PM', patient: 'Mr. A. Verma', service: 'Post-Surgery', status: 'pending' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 10 }}>
                        <span style={{ fontWeight: 700, color: C.primary, minWidth: 50 }}>{item.time}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.patient}</div>
                          <div style={{ color: '#64748b' }}>{item.service}</div>
                        </div>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 9, background: item.status === 'checked-in' ? '#dcfce7' : '#fef3c7', color: item.status === 'checked-in' ? '#16a34a' : '#d97706', fontWeight: 600 }}>
                          {item.status === 'checked-in' ? '✓' : '⏳'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {activeScreen === 'patients' && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>{t('nurse.app.myPatients', 'My Patients')}</div>
                    {[
                      { name: 'Mr. R. Sharma', condition: 'Post-Surgery', nextVisit: 'Today 8 AM' },
                      { name: 'Mrs. P. Reddy', condition: 'IV Therapy', nextVisit: 'Today 10:30 AM' },
                      { name: 'Mr. A. Verma', condition: 'Wound Care', nextVisit: 'Today 2 PM' },
                      { name: 'Mrs. S. Devi', condition: 'Elderly Care', nextVisit: 'Tomorrow 9 AM' },
                    ].map((p, i) => (
                      <div key={i} style={{ padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 6 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>{p.condition} · {p.nextVisit}</div>
                      </div>
                    ))}
                  </div>
                )}
                {activeScreen === 'vitals' && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>{t('nurse.app.vitals', 'Vital Signs Entry')}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10 }}>{t('nurse.app.vitalsFor', 'Patient: Mr. R. Sharma')}</div>
                    {[
                      { label: 'BP', value: '120/80', unit: 'mmHg' },
                      { label: 'Pulse', value: '72', unit: 'bpm' },
                      { label: 'Temp', value: '98.6', unit: '°F' },
                      { label: 'SpO2', value: '98', unit: '%' },
                      { label: 'Blood Sugar', value: '110', unit: 'mg/dL' },
                      { label: 'Pain Level', value: '3', unit: '/10' },
                    ].map((v, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 11 }}>
                        <span style={{ color: '#64748b' }}>{v.label}</span>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{v.value} <span style={{ fontWeight: 400, color: '#94a3b8' }}>{v.unit}</span></span>
                      </div>
                    ))}
                    <button style={{ width: '100%', marginTop: 10, padding: 10, borderRadius: 6, border: 'none', background: C.primary, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      {t('nurse.app.saveVitals', 'Save Vitals')}
                    </button>
                  </div>
                )}
                {activeScreen === 'navigation' && (
                  <div style={{ textAlign: 'center', padding: 20 }}>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>🗺️</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{t('nurse.app.nav', 'Navigation')}</div>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 10, background: '#f8fafc' }}>
                      <div style={{ fontSize: 28, marginBottom: 4 }}>📍</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{t('nurse.app.nextStop', 'Next Stop')}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{t('nurse.app.nextStopAddr', 'H.No. 1-2-3, Banjara Hills, Hyderabad')}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, margin: '8px 0' }}>2.4 km</div>
                      <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 16px', borderRadius: 6, background: C.primary, color: '#fff', textDecoration: 'none', fontSize: 12, fontWeight: 700, display: 'inline-block' }}>
                        🗺️ {t('nurse.app.openMaps', 'Open Google Maps')}
                      </a>
                    </div>
                  </div>
                )}
                {activeScreen === 'payouts' && (
                  <div>
                    <div style={{ textAlign: 'center', padding: '16px 0', marginBottom: 12, background: '#f0fdf4', borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{t('nurse.app.monthlyEarnings', 'This Month')}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: '#16a34a' }}>₹8,540</div>
                    </div>
                    {[
                      { date: '10 Jul', patient: 'Mr. Sharma', amount: 599, status: 'paid' },
                      { date: '9 Jul', patient: 'Mrs. Reddy', amount: 799, status: 'paid' },
                      { date: '8 Jul', patient: 'Mr. Verma', amount: 499, status: 'pending' },
                    ].map((p, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 11 }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.patient}</div>
                          <div style={{ color: '#94a3b8' }}>{p.date}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: '#16a34a' }}>₹{p.amount}</div>
                          <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: 9, background: p.status === 'paid' ? '#dcfce7' : '#fef3c7', color: p.status === 'paid' ? '#16a34a' : '#d97706' }}>{p.status}</span>
                        </div>
                      </div>
                    ))}
                    <button style={{ width: '100%', marginTop: 10, padding: 10, borderRadius: 6, border: 'none', background: C.primary, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      {t('nurse.app.requestPayout', '💰 Request Payout')}
                    </button>
                  </div>
                )}
              </div>
              <div style={{ background: '#1a1a2e', padding: 6, display: 'flex', justifyContent: 'center', gap: 20 }}>
                {['📊', '👥', '📝', '🗺️', '💰'].map((icon, i) => (
                  <button key={i} onClick={() => setActiveScreen(['dashboard', 'patients', 'vitals', 'navigation', 'payouts'][i])}
                    style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', opacity: activeScreen === ['dashboard', 'patients', 'vitals', 'navigation', 'payouts'][i] ? 1 : 0.5 }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-section" style={{ background: C.bg }}>
        <div className="container">
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, textAlign: 'center' }}>{t('nurse.app.features', 'App Features')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {APP_FEATURES.map(f => (
              <div key={f.title} style={{ padding: 16, borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{f.icon}</div>
                <h3 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{f.title}</h3>
                <p style={{ fontSize: 10, color: '#64748b', margin: 0, lineHeight: 1.3 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
