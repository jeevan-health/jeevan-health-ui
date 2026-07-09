import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const ROLE_BADGES = {
  super_admin: { label: 'Super Admin', color: '#EF4444' },
  admin: { label: 'Administrator', color: '#F59E0B' },
  staff: { label: 'Staff', color: '#3B82F6' },
  manager: { label: 'Operations Manager', color: '#10B981' },
};

export default function AdminLogin() {
  const [loginMode, setLoginMode] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPwd, setForgotNewPwd] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [lastLogin, setLastLogin] = useState(null);
  const { verifyOtp, setUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('jh_last_login');
    if (stored) { try { setLastLogin(JSON.parse(stored)); } catch {} }
    const user = useAuthStore.getState().user;
    if (user && user.role !== 'user') navigate('/admin', { replace: true });
  }, []);

  function trackLogin(user) {
    const info = {
      time: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      role: user.role || 'admin',
      location: 'Hyderabad',
      device: navigator.platform || 'Unknown',
    };
    localStorage.setItem('jh_last_login', JSON.stringify(info));
  }

  async function handleEmailLogin(e) {
    e.preventDefault();
    if (!email) { setError('Please enter your admin email'); return; }
    if (!password) { setError('Please enter your password'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    const users = JSON.parse(localStorage.getItem('jh_users') || '[]');
    const found = users.find(u => u.email?.toLowerCase() === email.toLowerCase() && !u.phone);
    if (found && found.role !== 'user') {
      const user = { ...found, id: found.id || Date.now().toString() };
      localStorage.setItem('jh_token', 'mock-token-email');
      localStorage.setItem('jh_user', JSON.stringify(user));
      setUser(user);
      trackLogin(user);
      setShowWelcome(true);
      setTimeout(() => navigate('/admin', { replace: true }), 2000);
    } else if (email === 'admin@jeevanhealthcare.com') {
      const user = { id: Date.now().toString(), name: 'Admin', email, phone: '', role: 'admin' };
      localStorage.setItem('jh_token', 'mock-token-email');
      localStorage.setItem('jh_user', JSON.stringify(user));
      setUser(user);
      trackLogin(user);
      setShowWelcome(true);
      setTimeout(() => navigate('/admin', { replace: true }), 2000);
    } else {
      setError('Unable to sign in. Please check your credentials and try again.');
    }
  }

  async function handleSendOtp(e) {
    e.preventDefault();
    if (phone.length !== 10) { setError('Enter a valid 10-digit phone number'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setStep(2);
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (otp.length < 4) { setError('Enter the OTP'); return; }
    setError('');
    setLoading(true);
    const ok = await verifyOtp(phone, otp);
    setLoading(false);
    if (!ok) { setError('Invalid OTP. Try again.'); return; }
    const user = useAuthStore.getState().user;
    if (user?.role === 'user') { setError('This account does not have admin access.'); return; }
    trackLogin(user);
    setShowWelcome(true);
    setTimeout(() => navigate('/admin', { replace: true }), 2000);
  }

  function handleForgotSubmit(e) {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotStep(2);
  }

  function handleForgotOtp(e) {
    e.preventDefault();
    if (forgotOtp.length < 4) return;
    setForgotStep(3);
  }

  function handleResetPwd(e) {
    e.preventDefault();
    if (forgotNewPwd.length < 6) { setError('Password must be at least 6 characters'); return; }
    setShowForgot(false);
    setForgotStep(1);
    setForgotEmail('');
    setForgotOtp('');
    setForgotNewPwd('');
    setError('');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0c1222', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Left Panel — Branding */}
      <div style={{
        flex: '0 0 420px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 40px', background: 'linear-gradient(135deg, #0b1a33 0%, #0f2744 50%, #0c1222 100%)',
        position: 'relative', overflow: 'hidden', borderRight: '1px solid #1e2d45',
      }}>
        {/* Grid pattern overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {/* Top */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #00D9FF, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff' }}>⚕️</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: -0.3 }}>Jeevan HealthCare</div>
              <div style={{ fontSize: 11, color: '#00D9FF', fontWeight: 500 }}>Operations Command Center</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 1.5, maxWidth: 300 }}>
            Digital Healthcare Operations Platform
          </div>
        </div>

        {/* Middle — Services */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Manage</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: '🧪', label: 'Diagnostics Management' },
              { icon: '🏠', label: 'Home Sample Collection' },
              { icon: '👨‍⚕️', label: 'Doctor Consultation' },
              { icon: '📄', label: 'Reports Management' },
              { icon: '👥', label: 'Patient Care' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 500 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — Trust */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '14px 16px', background: 'rgba(0,217,255,0.04)', borderRadius: 10, border: '1px solid rgba(0,217,255,0.1)' }}>
            {[
              '✓ Secure Healthcare Platform',
              '✓ Role-Based Access Control',
              '✓ Patient Data Protection',
              '✓ Real-Time Operations Dashboard',
            ].map(t => (
              <div key={t} style={{ fontSize: 11, color: '#00D9FF' }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>

          {/* Welcome */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Welcome Back <span style={{ fontSize: 24 }}>👋</span></div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Sign in to your Admin Portal</div>
          </div>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#1e293b', borderRadius: 10, padding: 3 }}>
            {[
              { key: 'email', label: '📧 Email Login' },
              { key: 'otp', label: '📱 Mobile OTP' },
            ].map(t => (
              <button key={t.key} onClick={() => { setLoginMode(t.key); setError(''); setStep(1); }}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s',
                  background: loginMode === t.key ? '#334155' : 'transparent',
                  color: loginMode === t.key ? '#fff' : '#64748b',
                }}>{t.label}</button>
            ))}
          </div>

          {error && <div style={{ padding: '10px 14px', background: '#451a1a', color: '#f87171', borderRadius: 8, fontSize: 12, marginBottom: 16, border: '1px solid #7f1d1d', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 14 }}>⚠️</span>
            <span>{error}</span>
          </div>}

          {/* Email Login Form */}
          {loginMode === 'email' && (
            <form onSubmit={handleEmailLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#cbd5e1' }}>Admin Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@jeevanhealthcare.com"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border 0.15s' }}
                  onFocus={e => e.target.style.borderColor = '#00D9FF'}
                  onBlur={e => e.target.style.borderColor = '#334155'} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#cbd5e1' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{ width: '100%', padding: '11px 38px 11px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border 0.15s' }}
                    onFocus={e => e.target.style.borderColor = '#00D9FF'}
                    onBlur={e => e.target.style.borderColor = '#334155'} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 14, padding: 4,
                  }}>{showPwd ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: '#94a3b8' }}>
                  <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} style={{ width: 14, height: 14, accentColor: '#00D9FF' }} />
                  Remember me
                </label>
                <button type="button" onClick={() => setShowForgot(true)} style={{ background: 'none', border: 'none', color: '#00D9FF', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                  Forgot password?
                </button>
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '12px 0', borderRadius: 8, border: 'none',
                background: 'linear-gradient(135deg, #00D9FF, #3B82F6)', color: '#0f172a',
                cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                opacity: loading ? 0.6 : 1, transition: 'all 0.15s',
              }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Mobile OTP Form */}
          {loginMode === 'otp' && (
            step === 1 ? (
              <form onSubmit={handleSendOtp}>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block', color: '#cbd5e1' }}>Registered Mobile Number</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  <span style={{ padding: '11px 0', fontSize: 14, color: '#64748b', fontWeight: 500 }}>+91</span>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter registered mobile"
                    style={{ flex: 1, padding: '11px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border 0.15s' }}
                    onFocus={e => e.target.style.borderColor = '#00D9FF'}
                    onBlur={e => e.target.style.borderColor = '#334155'} />
                </div>
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '12px 0', borderRadius: 8, border: 'none',
                  background: 'linear-gradient(135deg, #00D9FF, #3B82F6)', color: '#0f172a',
                  cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                  opacity: loading ? 0.6 : 1, transition: 'all 0.15s',
                }}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify}>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block', color: '#cbd5e1' }}>Enter OTP</label>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>OTP sent to +91 {phone}</p>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 20, textAlign: 'center', letterSpacing: 8, transition: 'border 0.15s' }}
                  onFocus={e => e.target.style.borderColor = '#00D9FF'}
                  onBlur={e => e.target.style.borderColor = '#334155'} />
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '12px 0', borderRadius: 8, border: 'none',
                  background: 'linear-gradient(135deg, #00D9FF, #3B82F6)', color: '#0f172a',
                  cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                  opacity: loading ? 0.6 : 1, transition: 'all 0.15s',
                }}>
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
                <button type="button" onClick={() => { setStep(1); setError(''); }} style={{ marginTop: 10, background: 'none', border: 'none', color: '#00D9FF', cursor: 'pointer', fontSize: 12, width: '100%', textAlign: 'center', fontFamily: 'inherit' }}>
                  Change phone number
                </button>
              </form>
            )
          )}

          {/* Security Message */}
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 11, color: '#475569', lineHeight: 1.5 }}>
            🔒 Your healthcare data is protected with secure authentication and role-based access control.
          </div>

          {/* Back to site */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
              ← Back to Main Site
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#1e293b', borderRadius: 16, width: '100%', maxWidth: 400, padding: 28, border: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>🔐 Reset Password</div>
              <button onClick={() => { setShowForgot(false); setForgotStep(1); setForgotEmail(''); setForgotOtp(''); setForgotNewPwd(''); }} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #334155', background: '#0f172a', color: '#64748b', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            {forgotStep === 1 && (
              <form onSubmit={handleForgotSubmit}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#cbd5e1' }}>Registered Email</label>
                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="admin@jeevanhealthcare.com"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} />
                <button type="submit" style={{ width: '100%', padding: '11px 0', borderRadius: 8, border: 'none', background: '#00D9FF', color: '#0f172a', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>Send Reset Code</button>
              </form>
            )}
            {forgotStep === 2 && (
              <form onSubmit={handleForgotOtp}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#cbd5e1' }}>Enter OTP</label>
                <p style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>OTP sent to {forgotEmail}</p>
                <input type="text" value={forgotOtp} onChange={e => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter OTP"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 16, textAlign: 'center', letterSpacing: 6 }} />
                <button type="submit" style={{ width: '100%', padding: '11px 0', borderRadius: 8, border: 'none', background: '#00D9FF', color: '#0f172a', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>Verify</button>
              </form>
            )}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPwd}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#cbd5e1' }}>New Password</label>
                <input type="password" value={forgotNewPwd} onChange={e => setForgotNewPwd(e.target.value)} placeholder="Min 6 characters"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} />
                <button type="submit" style={{ width: '100%', padding: '11px 0', borderRadius: 8, border: 'none', background: '#00D9FF', color: '#0f172a', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>Reset Password</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Post-Login Welcome Overlay */}
      {showWelcome && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(6px)', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ textAlign: 'center', maxWidth: 360 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚕️</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Welcome {useAuthStore.getState().user?.name || 'Admin'} 👋</div>
            <div style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 20, background: 'rgba(0,217,255,0.1)', color: '#00D9FF', fontSize: 11, fontWeight: 600, marginBottom: 16 }}>
              {ROLE_BADGES[useAuthStore.getState().user?.role]?.label || 'Administrator'}
            </div>
            {lastLogin && (
              <div style={{ background: '#1e293b', borderRadius: 12, padding: 14, border: '1px solid #334155', marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Last Login</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, color: '#cbd5e1', textAlign: 'left' }}>
                  <div style={{ color: '#64748b' }}>Time</div><div>{lastLogin.time}</div>
                  <div style={{ color: '#64748b' }}>Location</div><div>{lastLogin.location}</div>
                  <div style={{ color: '#64748b' }}>Device</div><div>{lastLogin.device}</div>
                </div>
              </div>
            )}
            <div style={{ fontSize: 12, color: '#00D9FF' }}>Redirecting to dashboard...</div>
          </div>
        </div>
      )}
    </div>
  );
}
