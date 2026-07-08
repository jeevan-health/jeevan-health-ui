import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useDashboardStore from '../stores/dashboardStore';
import useAuthStore from '../stores/authStore';

const navItems = [
  { key: 'overview', label: 'Dashboard', icon: '🏠' },
  { key: 'bookings', label: 'Bookings', icon: '📅' },
  { key: 'reports', label: 'Reports', icon: '🧪' },
  { key: 'appointments', label: 'Appointments', icon: '👨‍⚕️' },
  { key: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { key: 'wallet', label: 'Wallet', icon: '💳' },
  { key: 'invoices', label: 'Invoices', icon: '📄' },
  { key: 'abha', label: 'ABHA ID', icon: '🆔' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
];

function Section({ id, title, icon, children, active }) {
  if (active !== 'overview' && active !== id) return null;
  return (
    <div id={id} style={{ marginBottom: 24 }}>
      {title && (
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span>{icon}</span>} {title}
        </h2>
      )}
      {children}
    </div>
  );
}

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
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [familyForm, setFamilyForm] = useState({ name: '', relation: '', age: '', gender: '' });
  const [fullReportIndex, setFullReportIndex] = useState(null);

  const store = useDashboardStore();
  const logout = useAuthStore(s => s.logout);
  const p = store.profile;
  const reports = store.reports;
  const family = store.family;
  const upcoming = store.upcomingBookings;
  const appointments = store.appointments;
  const invoices = store.invoices;
  const wallet = store.wallet;
  const abha = store.abha;
  const notifs = store.notifications;
  const prescriptions = store.savedPrescriptions;
  const activeOrders = store.activeOrders;

  const addFamily = () => {
    if (!familyForm.name || !familyForm.relation || !familyForm.age) return;
    store.addFamilyMember({ ...familyForm, age: parseInt(familyForm.age), bloodGroup: '--', lastCheckup: 'N/A', abhaId: '', gender: familyForm.gender || 'Not specified' });
    setFamilyForm({ name: '', relation: '', age: '', gender: '' });
    setShowFamilyModal(false);
  };

  const renderNav = (vertical) => (
    <nav style={vertical ? { display: 'flex', flexDirection: 'column', gap: 2 } : { display: 'flex', gap: 0, overflowX: 'auto' }}>
      {navItems.map(item => (
        <button key={item.key} onClick={() => setActiveSection(item.key)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: vertical ? '10px 20px' : '10px 14px',
            fontSize: 13, fontWeight: activeSection === item.key ? 600 : 500,
            color: activeSection === item.key ? '#1866C9' : 'var(--text-body)',
            background: activeSection === item.key ? '#e8f0fe' : 'transparent',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            whiteSpace: 'nowrap', borderRadius: vertical ? 0 : 0, textAlign: 'left', width: vertical ? '100%' : 'auto',
            borderRight: vertical && activeSection === item.key ? '3px solid #1866C9' : '3px solid transparent',
            borderBottom: !vertical && activeSection === item.key ? '2px solid #1866C9' : '2px solid transparent',
          }}>
          <span>{item.icon}</span> <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1866C9' }}>My Health</div>
          </div>
          {renderNav(true)}
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)' }}>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: '#dc2626', padding: '4px 0' }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">

        {/* ===== HEADER ===== */}
        <div className="dash-header-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div className="dash-header-left" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #1866C9, #0F4A96)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: '#fff', fontWeight: 700, flexShrink: 0 }}>
              {p.name.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>👋 Welcome Back, {p.name}</h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0' }}>{p.greeting}</p>
              <p style={{ fontSize: 12, color: 'var(--text-light)' }}>Last Health Check: <strong>{p.lastCheckup}</strong></p>
            </div>
          </div>
          <div className="dash-header-right" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div className="dash-score-ring" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <HealthScoreRing score={p.healthScore} />
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Health Score</div>
                <div className="dash-score-text" style={{ fontSize: 22, fontWeight: 800, color: p.healthScore >= 80 ? '#16a34a' : '#eab308' }}>{p.healthScore}/100</div>
              </div>
            </div>
            <div className="dash-actions" style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => navigate('/diagnostics')} className="btn btn-primary btn-sm">📋 Book a Test</button>
              <button onClick={() => navigate('/upload-prescription')} className="btn btn-outline btn-sm">📤 Upload Prescription</button>
            </div>
          </div>
        </div>

        {/* Mobile Tab Nav */}
        <div style={{ display: 'none', marginBottom: 16, background: '#fff', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }} className="dash-mobile-nav">
          {renderNav(false)}
        </div>

        {/* ===== OVERVIEW CARDS ===== */}
        {activeSection === 'overview' && (
          <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
            {[
              { icon: '📅', label: 'Upcoming Bookings', value: upcoming.length, color: '#2563eb', bg: '#dbeafe' },
              { icon: '🧪', label: 'Reports Available', value: reports.length, color: '#16a34a', bg: '#dcfce7' },
              { icon: '👨‍👩‍👧‍👦', label: 'Family Members', value: family.length, color: '#c2410c', bg: '#fed7aa' },
              { icon: '📦', label: 'Active Orders', value: activeOrders, color: '#7c3aed', bg: '#ede9fe' },
            ].map(card => (
              <div key={card.label} className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setActiveSection(card.icon === '📅' ? 'bookings' : card.icon === '🧪' ? 'reports' : card.icon === '👨‍👩‍👧‍👦' ? 'family' : 'wallet')}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{card.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: card.color }}>{card.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{card.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ===== UPCOMING BOOKINGS ===== */}
        <Section id="bookings" title="Upcoming Bookings" icon="📅" active={activeSection}>
          {upcoming.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📅</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>No upcoming bookings</p>
              <button onClick={() => navigate('/diagnostics')} className="btn btn-primary btn-sm">Book a Test</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcoming.map(b => (
                <div key={b.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                      🧪 {b.test}
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                      <span>📅 {b.date}</span>
                      <span>🕘 {b.time}</span>
                      <span>📍 {b.location}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <Badge variant={b.status === 'Confirmed' ? 'green' : 'yellow'}>{b.status} ✅</Badge>
                    <button className="btn btn-outline btn-sm">View Details</button>
                    <button className="btn btn-outline btn-sm">Reschedule</button>
                    <button className="btn btn-outline btn-sm" style={{ color: '#dc2626', borderColor: '#fecaca' }}>Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => navigate('/diagnostics')} className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>+ Book New Test</button>
        </Section>

        {/* ===== MY REPORTS ===== */}
        <Section id="reports" title="My Reports" icon="🧪" active={activeSection}>
          {/* Filter/search bar */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <input placeholder="Search reports..." className="input" style={{ maxWidth: 260, fontSize: 12 }} />
            <select className="select" style={{ maxWidth: 140, fontSize: 12 }}>
              <option>All Reports</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reports.map((r, i) => (
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
                    <button className="btn btn-outline btn-sm" onClick={() => setFullReportIndex(fullReportIndex === i ? null : i)}>View</button>
                    <button className="btn btn-outline btn-sm">📥 PDF</button>
                    <button className="btn btn-outline btn-sm">📤 Share</button>
                  </div>
                </div>

                {/* Inline report details */}
                {fullReportIndex === i && (
                  <div style={{ marginTop: 12, padding: 12, background: '#f8f9fa', borderRadius: 10, fontSize: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <span>Test Values</span>
                      <button className="btn btn-outline btn-sm">📈 View Trend</button>
                    </div>
                    <div style={{ display: 'grid', gap: 6 }}>
                      {Object.entries(r.values).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: '#fff', borderRadius: 6, border: '1px solid #e8edf2' }}>
                          <span style={{ fontWeight: 500, flex: 1 }}>{key}</span>
                          <span style={{ fontWeight: 700, color: val.flag === 'high' || val.flag === 'low' ? '#dc2626' : '#16a34a', marginRight: 12 }}>{val.value} {val.unit}</span>
                          <span style={{ color: 'var(--text-light)', fontSize: 10 }}>Range: {val.range}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                      <button className="btn btn-outline btn-sm">📥 Download All as ZIP</button>
                      <button className="btn btn-outline btn-sm" style={{ color: '#16a34a', borderColor: '#bbf7d0' }}>🩺 Share with Doctor</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* ===== INVOICES ===== */}
        <Section id="invoices" title="Invoices & Payments" icon="📄" active={activeSection}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {invoices.map(inv => (
              <div key={inv.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{inv.package}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {inv.id} · {inv.date}
                  </div>
                  {inv.gst && <div style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 2 }}>{inv.gst}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1866C9' }}>₹{inv.amount}</div>
                  <Badge variant="green">Paid ✅</Badge>
                  <button className="btn btn-outline btn-sm">📄 Invoice</button>
                  <button className="btn btn-outline btn-sm">🧾 Receipt</button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== FAMILY MEMBERS ===== */}
        <Section id="family" title="Family Members" icon="👨‍👩‍👧‍👦" active={activeSection}>
          <div className="dash-family-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {family.map(m => (
              <div key={m.id} className="card" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: m.relation === 'Self' ? 'linear-gradient(135deg, #1866C9, #0F4A96)' : '#e8edf2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: m.relation === 'Self' ? '#fff' : '#64748b' }}>
                    {m.relation === 'Self' ? '👤' : m.gender === 'Female' ? '👩' : m.gender === 'Male' ? '👦' : '👤'}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{m.relation} · {m.age} yrs · {m.bloodGroup}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Last Checkup: {m.lastCheckup}
                </div>
                {m.abhaId && (
                  <div style={{ fontSize: 10, color: '#1866C9', background: '#e8f0fe', padding: '2px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 8 }}>
                    ABHA: {m.abhaId}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-outline btn-sm">View Records</button>
                  <button className="btn btn-outline btn-sm">Book Test</button>
                </div>
              </div>
            ))}

            {/* Add Member Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderStyle: 'dashed' }} onClick={() => setShowFamilyModal(true)}>
              <div style={{ fontSize: 32, marginBottom: 8, color: '#1866C9' }}>+</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1866C9' }}>Add Member</div>
            </div>
          </div>

          {/* Family Modal */}
          {showFamilyModal && (
            <div className="panel-overlay" onClick={() => setShowFamilyModal(false)}>
              <div className="panel" onClick={e => e.stopPropagation()}>
                <div className="panel-header">
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>Add Family Member</h3>
                  <button onClick={() => setShowFamilyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
                </div>
                <div className="panel-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input className="input" placeholder="Full Name" value={familyForm.name} onChange={e => setFamilyForm(p => ({ ...p, name: e.target.value }))} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <select className="select" value={familyForm.relation} onChange={e => setFamilyForm(p => ({ ...p, relation: e.target.value }))}>
                        <option value="">Relation</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Sibling">Sibling</option>
                      </select>
                      <input className="input" type="number" placeholder="Age" value={familyForm.age} onChange={e => setFamilyForm(p => ({ ...p, age: e.target.value }))} />
                    </div>
                    <select className="select" value={familyForm.gender} onChange={e => setFamilyForm(p => ({ ...p, gender: e.target.value }))}>
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <button onClick={addFamily} className="btn btn-primary btn-block">Add Member</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* ===== APPOINTMENTS ===== */}
        <Section id="appointments" title="Appointments" icon="👨‍⚕️" active={activeSection}>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Upcoming</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {appointments.filter(a => a.status === 'Upcoming').map(a => (
              <div key={a.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>🩺 {a.doctor}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.specialty} · {a.mode}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>📅 {a.date} · 🕘 {a.time}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {a.link && <button className="btn btn-green btn-sm">🔗 Join Meeting</button>}
                  <button className="btn btn-outline btn-sm">Reschedule</button>
                </div>
              </div>
            ))}
            {appointments.filter(a => a.status === 'Upcoming').length === 0 && (
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>No upcoming appointments</p>
            )}
          </div>

          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Past Appointments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {appointments.filter(a => a.status === 'Completed').map(a => (
              <div key={a.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>🩺 {a.doctor}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.specialty} · {a.mode} · {a.date}</div>
                  </div>
                  <Badge variant="green">Completed ✓</Badge>
                </div>
                {a.diagnosis && (
                  <div style={{ marginTop: 8, padding: 10, background: '#f8f9fa', borderRadius: 8, fontSize: 12 }}>
                    <div><strong>Diagnosis:</strong> {a.diagnosis}</div>
                    <div style={{ marginTop: 4 }}><strong>Prescription:</strong> {a.prescription}</div>
                    {a.followUp && <div style={{ marginTop: 4 }}><strong>Follow-up:</strong> {a.followUp}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* ===== HEALTH WALLET ===== */}
        <Section id="wallet" title="Health Wallet" icon="💳" active={activeSection}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            <div className="card" style={{ background: 'linear-gradient(135deg, #1866C9, #0F4A96)', color: '#fff', border: 'none' }}>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Wallet Balance</div>
              <div style={{ fontSize: 32, fontWeight: 800, margin: '4px 0' }}>₹{wallet.balance}</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>Use for test bookings & health services</div>
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Available Coupons</div>
              {wallet.coupons.map(c => (
                <div key={c.code} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>{c.code}</strong> — ₹{c.discount} off</span>
                  <span style={{ color: 'var(--text-light)' }}>Min ₹{c.minOrder}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Rewards Earned</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#E65100' }}>{wallet.rewardsPoints} pts</div>
              <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>Redeem Now</button>
            </div>
          </div>
        </Section>

        {/* ===== ABHA HEALTH ID ===== */}
        <Section id="abha" title="ABHA Health ID" icon="🆔" active={activeSection}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4, #fff)', border: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>🆔</span>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>ABHA Health ID</h3>
                </div>
                <Badge variant="green">Connected ✅</Badge>
                <div style={{ fontSize: 13, marginTop: 8 }}>
                  <strong>ABHA Number:</strong> {abha.number}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Linked Records: {abha.linkedRecords}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button className="btn btn-outline btn-sm">Manage</button>
                <button className="btn btn-outline btn-sm">Update</button>
                <button className="btn btn-outline btn-sm">Link Records</button>
              </div>
            </div>
            <div style={{ marginTop: 12, padding: 10, background: '#f0fdf4', borderRadius: 8, fontSize: 11, color: '#16a34a' }}>
              ✅ Digital health records · Easy sharing with healthcare providers · Unified medical history
            </div>
          </div>
        </Section>

        {/* ===== HEALTH TRENDS & SCORE (shown in overview) ===== */}
        {activeSection === 'overview' && (
          <>
            <div className="dash-section-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12, marginBottom: 24 }}>
              {/* Health Trends */}
              <div className="card">
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  📈 Health Trends
                </h3>
                {store.healthTrends.hba1c.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <span>HbA1c</span>
                      <span>
                        <TrendArrow value={store.healthTrends.hba1c[store.healthTrends.hba1c.length - 1].value} prev={store.healthTrends.hba1c[store.healthTrends.hba1c.length - 2]?.value} />
                        {' '}{store.healthTrends.hba1c[store.healthTrends.hba1c.length - 1].value}%
                      </span>
                    </div>
                    <div className="dash-trend-svg"><TrendMiniBar values={store.healthTrends.hba1c} color="#1866C9" /></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-light)', marginTop: 2 }}>
                      {store.healthTrends.hba1c.map((h, i) => (
                        <span key={i}>{h.date}</span>
                      ))}
                    </div>
                  </div>
                )}
                <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>View All Trends</button>
              </div>

              {/* Health Score Breakdown */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>❤️</span>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Health Score</h3>
                    <div style={{ fontSize: 22, fontWeight: 800, color: p.healthScore >= 80 ? '#16a34a' : '#eab308' }}>{p.healthScore}/100</div>
                  </div>
                </div>
                {[
                  { label: 'Blood Health', score: 90, color: '#22C55E' },
                  { label: 'Heart Health', score: 85, color: '#1866C9' },
                  { label: 'Diabetes Risk', score: 70, color: '#EAB308', invert: true },
                ].map(item => (
                  <div key={item.label} style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
                      <span>{item.label}</span>
                      <span style={{ fontWeight: 600, color: item.invert ? (item.score > 50 ? '#dc2626' : '#16a34a') : item.color }}>
                        {item.invert ? `${100 - item.score}%` : `${item.score}%`}
                      </span>
                    </div>
                    <div style={{ height: 6, background: '#e8edf2', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${item.invert ? 100 - item.score : item.score}%`, height: '100%', background: item.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
                <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>View Details</button>
              </div>
            </div>

            {/* Notifications + Prescriptions + Recommendations */}
            <div className="dash-section-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
              {/* Notifications */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    🔔 Notifications
                    {store.unreadCount() > 0 && (
                      <span style={{ background: '#dc2626', color: '#fff', fontSize: 10, padding: '1px 6px', borderRadius: 8 }}>{store.unreadCount()}</span>
                    )}
                  </h3>
                  <button onClick={() => setShowNotifs(!showNotifs)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#1866C9', fontFamily: 'inherit' }}>
                    {showNotifs ? 'Hide' : 'View All'}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(showNotifs ? notifs : notifs.slice(0, 3)).map(n => (
                    <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12, opacity: n.read ? 0.6 : 1 }}>
                      <span style={{ fontSize: 16 }}>
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
                  📋 Saved Prescriptions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {prescriptions.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>🩺 {p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{p.date} · {p.medicines}</div>
                      </div>
                      <button className="btn btn-outline btn-sm">View</button>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/upload-prescription')} className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>📤 Upload New</button>
              </div>

              {/* Recommended for You */}
              <div className="card" style={{ background: 'linear-gradient(135deg, #FFF8E1, #fff)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  ⭐ Recommended for You
                </h3>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>Based on your health history</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { name: 'Vitamin B12', price: 499, why: 'Your last Vitamin D was low' },
                    { name: 'Lipid Profile', price: 599, why: 'Annual heart health check' },
                    { name: 'Annual Health Checkup', price: 2499, why: 'Complete wellness review' },
                  ].map(rec => (
                    <div key={rec.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: '#fff', borderRadius: 10, border: '1px solid #e8edf2' }}>
                      <span style={{ fontSize: 20 }}>🧪</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{rec.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{rec.why}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1866C9', marginTop: 1 }}>₹{rec.price}</div>
                      </div>
                      <button onClick={() => navigate('/diagnostics')} className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>Book Now</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ===== SETTINGS ===== */}
        <Section id="settings" title="Settings" icon="⚙️" active={activeSection}>
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Profile Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { label: 'Full Name', value: p.name },
                { label: 'Phone', value: p.phone },
                { label: 'Email', value: p.email },
                { label: 'Blood Group', value: p.bloodGroup },
                { label: 'Date of Birth', value: p.dob },
                { label: 'Gender', value: p.gender },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{f.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{f.value}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>Edit Profile</button>
          </div>
        </Section>

      </main>

      <style>{`
        @media (max-width: 768px) {
          .dash-sidebar { display: none !important; }
          .dash-mobile-nav { display: block !important; }
          .dash-main { padding: 12px 10px !important; padding-bottom: 80px !important; }
          .dash-main h1 { font-size: 17px !important; }
          .dash-main .dash-header-wrap { flex-direction: column !important; align-items: stretch !important; }
          .dash-main .dash-header-left { width: 100% !important; }
          .dash-main .dash-header-right { width: 100% !important; justify-content: space-between !important; }
          .dash-main .dash-score-ring svg { width: 56px !important; height: 56px !important; }
          .dash-main .dash-score-text { font-size: 16px !important; }
          .dash-main .dash-actions { flex-direction: row !important; }
          .dash-main .dash-actions button { flex: 1 !important; font-size: 11px !important; padding: 8px 12px !important; white-space: nowrap !important; }
          .dash-main .overview-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dash-main .overview-grid > div { padding: 14px 10px !important; }
          .dash-main .overview-grid > div > div:nth-child(1) { font-size: 22px !important; }
          .dash-main .overview-grid > div > div:nth-child(2) { font-size: 20px !important; }
          .dash-main .card { padding: 14px !important; border-radius: 16px !important; }
          .dash-main .card h2, .dash-main .card h3 { font-size: 13px !important; }
          .dash-mobile-nav button { padding: 8px 8px !important; font-size: 11px !important; gap: 4px !important; }
          .dash-mobile-nav button span:last-child { font-size: 10px !important; }
          .dash-section-grid-2 { grid-template-columns: 1fr !important; }
          .dash-trend-svg svg { width: 100% !important; height: auto !important; }
          .dash-family-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .dash-main .dash-score-ring { display: none !important; }
          .dash-main .overview-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          .dash-main .dash-actions { flex-direction: column !important; }
          .dash-main .dash-header-right { flex-direction: column !important; align-items: stretch !important; gap: 8px !important; }
          .dash-family-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
