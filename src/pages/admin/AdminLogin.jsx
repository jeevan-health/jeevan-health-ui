import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { useT } from '../../i18n/LanguageProvider';
import { sendOtp as sendOtpApi, login as emailLoginApi } from '../../services/authService';
import { isAdminRole, getPostLoginPath } from '../../utils/authRoles';

export default function AdminLogin() {
  const t = useT();
  const ROLE_BADGES = {
    super_admin: { label: t('admin.login.super_admin', 'Super Admin'), color: '#DC2626' },
    admin: { label: t('admin.login.administrator', 'Administrator'), color: '#D97706' },
    staff: { label: t('admin.login.staff', 'Staff'), color: '#2563EB' },
    manager: { label: t('admin.login.ops_manager', 'Operations Manager'), color: '#059669' },
  };
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
  const [devOtp, setDevOtp] = useState('');
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
    if (user && isAdminRole(user.role)) navigate('/admin', { replace: true });
    else if (user && useAuthStore.getState().isAuthenticated) {
      // Logged-in non-admin should not sit on admin login
      navigate(getPostLoginPath(user.role), { replace: true });
    }
  }, []);

  function trackLogin(user) {
    const info = {
      time: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      role: user.role || 'admin',
      location: t('admin.login.location_hyderabad', 'Hyderabad'),
      device: navigator.platform || t('admin.login.unknown_device', 'Unknown'),
    };
    localStorage.setItem('jh_last_login', JSON.stringify(info));
  }

  async function handleEmailLogin(e) {
    e.preventDefault();
    if (!email) { setError(t('admin.login.err_no_email', 'Please enter your admin email')); return; }
    if (!password) { setError(t('admin.login.err_no_password', 'Please enter your password')); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await emailLoginApi(email, password);
      const { user, accessToken, refreshToken } = data;
      const role = user?.role || 'user';
      if (!isAdminRole(role)) {
        setLoading(false);
        setError(t('admin.login.err_no_admin_access', 'This account does not have admin access. Use the patient login instead.'));
        return;
      }
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('jh_token', accessToken);
      localStorage.setItem('jh_user', JSON.stringify(user));
      setUser(user);
      trackLogin(user);
      setShowWelcome(true);
      setTimeout(() => navigate('/admin', { replace: true }), 2000);
    } catch {
      setError(t('admin.login.err_invalid_credentials', 'Unable to sign in. Please check your credentials and try again.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp(e) {
    e.preventDefault();
    if (phone.length !== 10) { setError(t('admin.login.err_invalid_phone', 'Enter a valid 10-digit phone number')); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await sendOtpApi(phone, 'phone');
      if (data.code) { console.log('%c🔑 OTP: ' + data.code, 'background:#0f172a;color:#fbbf24;font-size:14px;padding:4px 8px;border-radius:4px;'); setDevOtp(data.code); }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || t('admin.login.err_send_otp', 'Failed to send OTP. Try again.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (otp.length < 4) { setError(t('admin.login.err_enter_otp', 'Enter the OTP')); return; }
    setError('');
    setLoading(true);
    const ok = await verifyOtp(phone, otp, 'phone');
    setLoading(false);
    if (!ok) { setError(t('admin.login.err_invalid_otp', 'Invalid OTP. Try again.')); return; }
    const user = useAuthStore.getState().user;
    if (!isAdminRole(user?.role)) {
      setError(t('admin.login.err_no_admin_access', 'This account does not have admin access. Use the patient login instead.'));
      // Clear accidental patient session from admin login attempt
      useAuthStore.getState().logout?.();
      return;
    }
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
    if (forgotNewPwd.length < 6) { setError(t('admin.login.err_password_length', 'Password must be at least 6 characters')); return; }
    setShowForgot(false);
    setForgotStep(1);
    setForgotEmail('');
    setForgotOtp('');
    setForgotNewPwd('');
    setError('');
  }

  return (
    <div className="admin-login-page" style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #FFFFFF 0%, #F3FAFF 40%, #E8F6FF 100%)', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @media (max-width: 900px) {
          .admin-login-brand { display: none !important; }
          .admin-login-form-wrap { padding: 16px 16px 32px !important; }
          .admin-login-page { flex-direction: column !important; }
        }
      `}</style>
      {/* Left Panel — Branding (desktop only) */}
      <div className="admin-login-brand" style={{
        flex: '0 0 420px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 40px', background: 'linear-gradient(135deg, #0F5DA8 0%, #1A7AD4 40%, #20B7F5 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Medical cross grid pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div style={{ position: 'absolute', right: -60, top: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', left: -40, bottom: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        {/* Top */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', backdropFilter: 'blur(8px)' }}>⚕️</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: -0.3 }}>{t('admin.login.brand_name', 'Jeevan HealthCare at Home')}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{t('admin.login.ops_center', 'Operations Command Center')}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 8, lineHeight: 1.6, maxWidth: 300 }}>
            {t('admin.login.digital_platform', 'Digital Healthcare Operations Platform')}
          </div>
        </div>

        {/* Middle — Services */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>{t('admin.login.manage', 'Manage')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { icon: '🧪', label: t('admin.login.diagnostics_mgmt', 'Diagnostics Management') },
              { icon: '🏠', label: t('admin.login.home_collection', 'Home Sample Collection') },
              { icon: '👨‍⚕️', label: t('admin.login.doctor_consultation', 'Doctor Consultation') },
              { icon: '📄', label: t('admin.login.reports_mgmt', 'Reports Management') },
              { icon: '👥', label: t('admin.login.patient_care', 'Patient Care') },
              { icon: '📊', label: t('admin.login.healthcare_analytics', 'Healthcare Analytics') },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: 15 }}>{s.icon}</span>
                <span style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — Trust */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '12px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)' }}>
            {[
              t('admin.login.secure_platform', '✓ Secure Healthcare Platform'),
              t('admin.login.role_access', '✓ Role-Based Access Control'),
              t('admin.login.data_protection', '✓ Patient Data Protection'),
              t('admin.login.real_time_dash', '✓ Real-Time Operations Dashboard'),
            ].map(txt => (
              <div key={txt} style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{txt}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login */}
      <div className="admin-login-form-wrap" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>

          {/* Welcome */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1866C9', marginBottom: 8 }}>Jeevan Admin</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{t('admin.login.welcome_back', 'Welcome Back')}</div>
            <div style={{ fontSize: 14, color: '#64748B' }}>{t('admin.login.sign_in_prompt', 'Sign in to Jeevan HealthCare at Home Admin Portal')}</div>
          </div>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#F1F5F9', borderRadius: 10, padding: 3 }}>
            {[
              { key: 'email', label: t('admin.login.email_login_tab', '📧 Email Login') },
              { key: 'otp', label: t('admin.login.mobile_otp_tab', '📱 Mobile OTP') },
            ].map(t => (
              <button key={t.key} onClick={() => { setLoginMode(t.key); setError(''); setStep(1); }}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s',
                  background: loginMode === t.key ? '#fff' : 'transparent',
                  color: loginMode === t.key ? '#0F5DA8' : '#64748B',
                  boxShadow: loginMode === t.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}>{t.label}</button>
            ))}
          </div>

          {error && <div style={{ padding: '10px 14px', background: '#FEF2F2', color: '#DC2626', borderRadius: 8, fontSize: 12, marginBottom: 16, border: '1px solid #FECACA', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
            <span>{error}</span>
          </div>}

          {/* Email Login Form */}
          {loginMode === 'email' && (
            <form onSubmit={handleEmailLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>{t('admin.login.email_label', 'Email Address')}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={t('admin.login.email_placeholder', 'admin@jeevanhealthcare.com')}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'all 0.15s' }}
                  onFocus={e => { e.target.style.borderColor = '#0F5DA8'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(15,93,168,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>{t('admin.login.password_label', 'Password')}</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder={t('admin.login.password_placeholder', 'Enter password')}
                    style={{ width: '100%', padding: '11px 38px 11px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'all 0.15s' }}
                    onFocus={e => { e.target.style.borderColor = '#0F5DA8'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(15,93,168,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none'; }} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 14, padding: 4,
                  }}>{showPwd ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: '#64748B' }}>
                  <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} style={{ width: 14, height: 14, accentColor: '#0F5DA8' }} />
                  {t('admin.login.remember_me', 'Remember me')}
                </label>
                <button type="button" onClick={() => setShowForgot(true)} style={{ background: 'none', border: 'none', color: '#0F5DA8', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>
                  {t('admin.login.forgot_password', 'Forgot password?')}
                </button>
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '12px 0', borderRadius: 8, border: 'none',
                background: 'linear-gradient(135deg, #0F5DA8, #1A7AD4)', color: '#fff',
                cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                opacity: loading ? 0.6 : 1, transition: 'all 0.15s', letterSpacing: 0.3,
              }}>
                {loading ? t('admin.login.signing_in', 'Signing in...') : t('admin.login.sign_in', 'Sign In')}
              </button>
            </form>
          )}

          {/* Mobile OTP Form */}
          {loginMode === 'otp' && (
            step === 1 ? (
              <form onSubmit={handleSendOtp}>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block', color: '#334155' }}>{t('admin.login.registered_mobile', 'Registered Mobile Number')}</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  <span style={{ padding: '11px 0', fontSize: 14, color: '#64748B', fontWeight: 500 }}>+91</span>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder={t('admin.login.enter_mobile', 'Enter registered mobile')}
                    style={{ flex: 1, padding: '11px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'all 0.15s' }}
                    onFocus={e => { e.target.style.borderColor = '#0F5DA8'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(15,93,168,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '12px 0', borderRadius: 8, border: 'none',
                  background: 'linear-gradient(135deg, #0F5DA8, #1A7AD4)', color: '#fff',
                  cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                  opacity: loading ? 0.6 : 1, transition: 'all 0.15s', letterSpacing: 0.3,
                }}>
                  {loading ? t('admin.login.sending_otp', 'Sending OTP...') : t('admin.login.send_otp', 'Send OTP')}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify}>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block', color: '#334155' }}>{t('admin.login.enter_otp', 'Enter OTP')}</label>
                <p style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>{t('admin.login.otp_sent_to', 'OTP sent to')} +91 {phone}</p>
                {devOtp && <p style={{ fontSize: 11, color: '#f59e0b', marginBottom: 8, background: '#fffbeb', padding: '4px 8px', borderRadius: 4 }}>Dev OTP: <strong>{devOtp}</strong></p>}
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder={t('admin.login.enter_6_digit_otp', 'Enter 6-digit OTP')}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 20, textAlign: 'center', letterSpacing: 8, transition: 'all 0.15s' }}
                  onFocus={e => { e.target.style.borderColor = '#0F5DA8'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(15,93,168,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none'; }} />
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '12px 0', borderRadius: 8, border: 'none',
                  background: 'linear-gradient(135deg, #0F5DA8, #1A7AD4)', color: '#fff',
                  cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                  opacity: loading ? 0.6 : 1, transition: 'all 0.15s', letterSpacing: 0.3,
                }}>
                  {loading ? t('admin.login.verifying', 'Verifying...') : t('admin.login.verify_login', 'Verify & Login')}
                </button>
                <button type="button" onClick={() => { setStep(1); setError(''); }} style={{ marginTop: 10, background: 'none', border: 'none', color: '#0F5DA8', cursor: 'pointer', fontSize: 12, width: '100%', textAlign: 'center', fontFamily: 'inherit', fontWeight: 600 }}>
                  {t('admin.login.change_phone', 'Change phone number')}
                </button>
              </form>
            )
          )}

          {/* Security Trust Section */}
          <div style={{ marginTop: 20, padding: '14px 16px', background: '#F0F7FF', borderRadius: 10, border: '1px solid #DBEAFE' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0F5DA8', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              🔒 {t('admin.login.secure_platform_title', 'Secure Healthcare Platform')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11, color: '#475569', lineHeight: 1.6 }}>
              <div>{t('admin.login.protected_data', '✓ Protected Patient Data with encryption')}</div>
              <div>{t('admin.login.role_control', '✓ Role-Based Access Control')}</div>
              <div>{t('admin.login.authorized_personnel', '✓ Authorized Personnel Only')}</div>
            </div>
          </div>

          {/* Back to site */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
              {t('admin.login.back_to_main_site', '← Back to Main Site')}
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>🔐 {t('admin.login.reset_password', 'Reset Password')}</div>
              <button onClick={() => { setShowForgot(false); setForgotStep(1); setForgotEmail(''); setForgotOtp(''); setForgotNewPwd(''); }} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#64748B', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            {forgotStep === 1 && (
              <form onSubmit={handleForgotSubmit}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>{t('admin.login.registered_email', 'Registered Email')}</label>
                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder={t('admin.login.email_placeholder', 'admin@jeevanhealthcare.com')}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} />
                <button type="submit" style={{ width: '100%', padding: '11px 0', borderRadius: 8, border: 'none', background: '#0F5DA8', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>{t('admin.login.send_reset_code', 'Send Reset Code')}</button>
              </form>
            )}
            {forgotStep === 2 && (
              <form onSubmit={handleForgotOtp}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>{t('admin.login.enter_otp', 'Enter OTP')}</label>
                <p style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>{t('admin.login.otp_sent_to_email', 'OTP sent to')} {forgotEmail}</p>
                <input type="text" value={forgotOtp} onChange={e => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder={t('admin.login.enter_otp_placeholder', 'Enter OTP')}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 16, textAlign: 'center', letterSpacing: 6 }} />
                <button type="submit" style={{ width: '100%', padding: '11px 0', borderRadius: 8, border: 'none', background: '#0F5DA8', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>{t('admin.login.verify', 'Verify')}</button>
              </form>
            )}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPwd}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: '#334155' }}>{t('admin.login.new_password', 'New Password')}</label>
                <input type="password" value={forgotNewPwd} onChange={e => setForgotNewPwd(e.target.value)} placeholder={t('admin.login.min_6_chars', 'Min 6 characters')}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} />
                <button type="submit" style={{ width: '100%', padding: '11px 0', borderRadius: 8, border: 'none', background: '#0F5DA8', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>{t('admin.login.reset_password_btn', 'Reset Password')}</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Post-Login Welcome Overlay */}
      {showWelcome && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(6px)', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ textAlign: 'center', maxWidth: 360, background: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚕️</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{t('admin.login.welcome_user', 'Welcome')} {useAuthStore.getState().user?.name || 'Admin'} 👋</div>
            <div style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 20, background: '#F0F7FF', color: '#0F5DA8', fontSize: 11, fontWeight: 600, marginBottom: 16 }}>
              {ROLE_BADGES[useAuthStore.getState().user?.role]?.label || 'Administrator'}
            </div>
            {lastLogin && (
              <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 14, border: '1px solid #E2E8F0', marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('admin.login.last_login', 'Last Login')}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, color: '#334155', textAlign: 'left' }}>
                  <div style={{ color: '#64748B' }}>{t('admin.login.time', 'Time')}</div><div style={{ fontWeight: 600 }}>{lastLogin.time}</div>
                  <div style={{ color: '#64748B' }}>{t('admin.login.location', 'Location')}</div><div style={{ fontWeight: 600 }}>{lastLogin.location}</div>
                  <div style={{ color: '#64748B' }}>{t('admin.login.device', 'Device')}</div><div style={{ fontWeight: 600 }}>{lastLogin.device}</div>
                </div>
              </div>
            )}
            <div style={{ fontSize: 12, color: '#0F5DA8', fontWeight: 500 }}>{t('admin.login.redirecting', 'Redirecting to dashboard...')}</div>
          </div>
        </div>
      )}

      <style>{`@media (max-width: 768px) { div[class*="left-panel"] { display: none !important; } }`}</style>
    </div>
  );
}