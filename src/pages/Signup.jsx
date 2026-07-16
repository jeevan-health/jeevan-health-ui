import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import useAuthStore from '../stores/authStore';
import GoogleSignIn from '../components/GoogleSignIn';
import { sendOtp as sendOtpApi } from '../services/authService';
import { getPostLoginPath } from '../utils/authRoles';

const RESEND_COOLDOWN = 45;

export default function Signup() {
  const t = useT();
  const navigate = useNavigate();
  const { verifyOtp } = useAuthStore();

  /** 'phone' | 'email' */
  const [mode, setMode] = useState('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const [error, setError] = useState('');
  const [channelHint, setChannelHint] = useState('');
  const [cooldown, setCooldown] = useState(0);
  /** Normalized id returned by API after send */
  const [sentTo, setSentTo] = useState('');

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const tmr = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(tmr);
  }, [cooldown]);

  const identifier = mode === 'phone' ? phone : email.trim();
  const displayTarget = mode === 'phone'
    ? `+91 ${sentTo || phone}`
    : (sentTo || email);

  const switchMode = (m) => {
    setMode(m);
    setStep(1);
    setOtp('');
    setError('');
    setDevOtp('');
    setChannelHint('');
    setSentTo('');
  };

  const doSendOtp = useCallback(async () => {
    setError('');
    if (mode === 'phone' && phone.length !== 10) {
      setError(t('signup.error.invalidPhone', 'Enter a valid 10-digit phone number'));
      return;
    }
    if (mode === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError(t('signup.error.invalidEmail', 'Enter a valid email address'));
        return;
      }
    }
    setLoading(true);
    try {
      const { data } = await sendOtpApi(identifier, mode);
      if (data.code) {
        console.log('%c🔑 OTP: ' + data.code, 'background:#0f172a;color:#fbbf24;font-size:14px;padding:4px 8px;border-radius:4px;');
        setDevOtp(data.code);
      } else {
        setDevOtp('');
      }
      setSentTo(data.identifier || identifier);
      if (data.emailFailed || data.provider === 'console-fallback') {
        setChannelHint(
          (data.warning
            ? `Email was NOT sent (${data.warning}). `
            : 'Email was NOT sent (provider error). ')
          + 'Using on-screen code so you are not locked out. Fix Brevo API key / From email on Render.'
        );
      } else if (data.channel === 'console') {
        setChannelHint(t('signup.otp.consoleHint', 'Delivery is in console/dev mode — use the code shown below or server logs. EMAIL_PROVIDER is not set to brevo (or key missing).'));
      } else if (data.channel === 'email') {
        setChannelHint(t('signup.otp.emailHint', 'Check your inbox (and spam) for the login code.'));
      } else {
        setChannelHint(t('signup.otp.smsHint', 'SMS usually arrives within a few seconds.'));
      }
      setStep(2);
      setCooldown(data.retryAfter || RESEND_COOLDOWN);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message
        || t('signup.error.sendOtpFailed', 'Failed to send OTP. Try again.');
      setError(msg);
      if (err.response?.data?.retryAfter) setCooldown(err.response.data.retryAfter);
    } finally {
      setLoading(false);
    }
  }, [mode, phone, email, identifier, t]);

  async function handleSendOtp(e) {
    e.preventDefault();
    await doSendOtp();
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (otp.length < 4) {
      setError(t('signup.error.enterOtp', 'Enter the OTP'));
      return;
    }
    setError('');
    setLoading(true);
    const id = sentTo || identifier;
    const ok = await verifyOtp(id, otp, mode);
    setLoading(false);
    if (ok) {
      navigate(getPostLoginPath(useAuthStore.getState().user?.role), { replace: true });
    } else {
      setError(t('signup.error.invalidOtp', 'Invalid or expired OTP. Try again.'));
    }
  }

  const tabBtn = (id, label) => (
    <button
      type="button"
      key={id}
      onClick={() => switchMode(id)}
      style={{
        flex: 1, padding: '10px 8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        fontSize: 13, fontWeight: mode === id ? 700 : 500,
        color: mode === id ? '#1866C9' : '#64748b',
        background: mode === id ? '#EFF6FF' : 'transparent',
        borderBottom: mode === id ? '2px solid #1866C9' : '2px solid transparent',
        minHeight: 44,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)', padding: 16 }}>
      <div className="card" style={{ maxWidth: 400, width: '100%', padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img
            src="https://www.jeevanhealthcare.com/logo.png"
            alt={t('signup.logo.alt', 'Jeevan HealthCare at Home')}
            style={{ height: 48, marginBottom: 8 }}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
          />
          <div style={{ display: 'none', fontSize: 36, marginBottom: 8 }}>⚕️</div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>{t('signup.welcome.title', 'Welcome to Jeevan HealthCare at Home')}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            {t('signup.welcome.subtitle', 'Login with Google, mobile OTP, or email OTP')}
          </p>
        </div>

        <div style={{
          marginBottom: 14, padding: '10px 12px', borderRadius: 8,
          background: '#fff7ed', border: '1px solid #fed7aa', fontSize: 11,
          color: '#9a3412', lineHeight: 1.45, textAlign: 'left',
        }}
        >
          <strong>One account per browser.</strong>
          {' '}
          Logging in here replaces any admin or staff session in other tabs of this browser.
          To test admin + patient at once, use an Incognito window or a second browser.
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, fontSize: 12, marginBottom: 12 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <GoogleSignIn onError={setError} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: '#e8edf2' }} />
          <span style={{ fontSize: 11, color: 'var(--text-light)' }}>{t('signup.divider.orOtp', 'or continue with OTP')}</span>
          <div style={{ flex: 1, height: 1, background: '#e8edf2' }} />
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', borderBottom: '1px solid #e8edf2', marginBottom: 16 }}>
            {tabBtn('phone', t('signup.tab.phone', '📱 Mobile'))}
            {tabBtn('email', t('signup.tab.email', '✉️ Email'))}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            {mode === 'phone' ? (
              <>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  {t('signup.phone.label', 'Phone Number')}
                </label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ padding: '10px 0', fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder={t('signup.phone.placeholder', '10-digit mobile number')}
                    className="input"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>
                  {t('signup.email.label', 'Email address')}
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('signup.email.placeholder', 'you@example.com')}
                  className="input"
                  required
                />
              </>
            )}
            <button type="submit" className="btn btn-primary btn-block btn-lg mt-4" disabled={loading}>
              {loading
                ? t('signup.phone.sendingOtp', 'Sending OTP...')
                : mode === 'phone'
                  ? t('signup.phone.sendOtp', 'Send OTP on SMS')
                  : t('signup.email.sendOtp', 'Send OTP on Email')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>
              {t('signup.otp.label', 'Enter OTP')}
            </label>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
              {t('signup.otp.sentToGeneric', 'OTP sent to')} <strong>{displayTarget}</strong>
            </p>
            {channelHint && (
              <p style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>{channelHint}</p>
            )}
            {devOtp && (
              <p style={{ fontSize: 11, color: '#b45309', marginBottom: 8, background: '#fffbeb', padding: '8px 10px', borderRadius: 8, border: '1px solid #fde68a' }}>
                {t('signup.otp.devCode', 'Dev code')}: <strong style={{ letterSpacing: 2 }}>{devOtp}</strong>
                <span style={{ display: 'block', marginTop: 2, color: '#92400e' }}>
                  {t('signup.otp.devNote', 'Shown only when server OTP_EXPOSE_CODE is enabled')}
                </span>
              </p>
            )}
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder={t('signup.otp.placeholder', '6-digit OTP')}
              className="input"
              required
            />
            <button type="submit" className="btn btn-primary btn-block btn-lg mt-4" disabled={loading || otp.length < 4}>
              {loading ? t('signup.otp.verifying', 'Verifying...') : t('signup.otp.verifyLogin', 'Verify & Login')}
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 10 }}>
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(''); setError(''); setDevOtp(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}
              >
                {mode === 'phone'
                  ? t('signup.otp.changePhone', '← Change phone')
                  : t('signup.otp.changeEmail', '← Change email')}
              </button>
              <button
                type="button"
                disabled={loading || cooldown > 0}
                onClick={doSendOtp}
                style={{
                  background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 12,
                  color: cooldown > 0 ? '#94a3b8' : 'var(--primary)',
                  cursor: cooldown > 0 ? 'not-allowed' : 'pointer', fontWeight: 600,
                }}
              >
                {cooldown > 0
                  ? t('signup.otp.resendIn', `Resend in ${cooldown}s`).replace(`${cooldown}`, String(cooldown))
                  : t('signup.otp.resend', 'Resend OTP')}
              </button>
            </div>
          </form>
        )}

        <p style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center', marginTop: 16 }}>
          {t('signup.terms', 'By continuing, you agree to our Terms & Privacy Policy')}
        </p>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Link to="/" style={{ fontSize: 12, color: 'var(--primary)' }}>{t('signup.backToHome', '← Back to Home')}</Link>
        </div>
      </div>
    </div>
  );
}
