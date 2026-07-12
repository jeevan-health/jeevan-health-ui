import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import useAuthStore from '../stores/authStore';
import { sendOtp as sendOtpApi } from '../services/authService';
import { getPostLoginPath } from '../utils/authRoles';
import {
  canInstallPwa,
  onInstallAvailability,
  promptInstallPwa,
  isStandalonePwa,
  subscribeWebPush,
} from '../lib/pwa';
import * as labReportService from '../services/labReportService';

/**
 * Camp patient flow: register with email OTP → install PWA → enable notifications.
 * Staff shows /admin/camp-qr which points here.
 */
export default function CampRegister() {
  const t = useT();
  const navigate = useNavigate();
  const { verifyOtp, isAuthenticated, user } = useAuthStore();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [sentTo, setSentTo] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [installReady, setInstallReady] = useState(false);
  const [pushStatus, setPushStatus] = useState('');

  useEffect(() => onInstallAvailability(setInstallReady), []);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setStep(3);
    }
  }, [isAuthenticated, user]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t('camp.err.email', 'Enter a valid email address'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await sendOtpApi(email.trim(), 'email');
      setSentTo(data.identifier || email.trim());
      if (data.code) setDevOtp(data.code);
      else setDevOtp('');
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError(t('camp.err.otp', 'Enter the OTP from your email'));
      return;
    }
    setError('');
    setLoading(true);
    const ok = await verifyOtp(sentTo || email.trim(), otp, 'email');
    setLoading(false);
    if (!ok) {
      setError(t('camp.err.badOtp', 'Invalid or expired OTP'));
      return;
    }
    setStep(3);
  };

  const handleInstall = async () => {
    const res = await promptInstallPwa();
    if (!res.ok && res.reason === 'not_available') {
      setError(t('camp.install.manual', 'Use browser menu → “Add to Home Screen” / Install app'));
    }
  };

  const handleEnablePush = async () => {
    setPushStatus('');
    setError('');
    try {
      const res = await subscribeWebPush({
        getVapidKey: async () => {
          const { data } = await labReportService.getVapidPublicKey();
          return data.publicKey || null;
        },
        saveSubscription: async (sub) => {
          await labReportService.savePushSubscription(sub);
        },
      });
      if (res.ok) setPushStatus(t('camp.push.ok', 'Notifications enabled — we will alert you when your report is ready.'));
      else if (res.reason === 'denied') setError(t('camp.push.denied', 'Notifications blocked. Enable them in browser settings.'));
      else if (res.reason === 'no_vapid') setError(t('camp.push.novapid', 'Push not configured on server yet (VAPID keys). Email reports still work.'));
      else setError(t('camp.push.unsupported', 'Push not supported on this device/browser.'));
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not enable notifications');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0F5DA8 0%, #1A7AD4 35%, #F0F7FF 35%)', padding: '24px 16px 48px' }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', color: '#fff', marginBottom: 20 }}>
          <img src="/logo.png" alt="" style={{ height: 48, marginBottom: 8 }} onError={e => { e.target.style.display = 'none'; }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>{t('camp.title', 'Camp registration')}</h1>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.92 }}>
            {t('camp.sub', 'Register with email · Install app · Get report alerts')}
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 22, boxShadow: '0 12px 40px rgba(15,23,42,0.12)' }}>
          {/* Steps */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            {['Email', 'OTP', 'Install'].map((label, i) => (
              <div key={label} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: 4, borderRadius: 4, marginBottom: 6,
                  background: step > i ? '#16a34a' : step === i + 1 ? '#1866C9' : '#e2e8f0',
                }}
                />
                <span style={{ fontSize: 10, fontWeight: 600, color: step === i + 1 ? '#1866C9' : '#94a3b8' }}>{label}</span>
              </div>
            ))}
          </div>

          {error && (
            <div style={{ padding: '10px 12px', background: '#FEF2F2', color: '#b91c1c', borderRadius: 8, fontSize: 12, marginBottom: 12 }}>{error}</div>
          )}

          {step === 1 && (
            <form onSubmit={handleSend}>
              <p style={{ fontSize: 13, color: '#475569', margin: '0 0 12px', lineHeight: 1.5 }}>
                {t('camp.email.help', 'Enter the email where you want to receive your lab report PDF.')}
              </p>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</label>
              <input
                type="email"
                className="input"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{ width: '100%', marginBottom: 14 }}
              />
              <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ minHeight: 48 }}>
                {loading ? 'Sending…' : t('camp.email.send', 'Send OTP to email')}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify}>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 10px' }}>
                OTP sent to <strong>{sentTo || email}</strong>
              </p>
              {devOtp && (
                <p style={{ fontSize: 12, background: '#fffbeb', padding: 8, borderRadius: 8, marginBottom: 10 }}>
                  Dev code: <strong>{devOtp}</strong>
                </p>
              )}
              <input
                type="text"
                inputMode="numeric"
                className="input"
                autoComplete="one-time-code"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit OTP"
                required
                style={{ width: '100%', marginBottom: 14 }}
              />
              <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ minHeight: 48 }}>
                {loading ? 'Verifying…' : t('camp.otp.verify', 'Verify & continue')}
              </button>
              <button type="button" onClick={() => { setStep(1); setOtp(''); }} style={{ marginTop: 10, width: '100%', border: 'none', background: 'none', color: '#1866C9', fontSize: 12, cursor: 'pointer' }}>
                Change email
              </button>
            </form>
          )}

          {step === 3 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 36, marginBottom: 6 }}>✅</div>
                <h2 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 4px' }}>
                  {t('camp.done.title', 'You are registered')}
                </h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                  {user?.email || sentTo || email}
                </p>
              </div>

              {!isStandalonePwa() && (
                <div style={{ padding: 14, borderRadius: 12, background: '#F0F7FF', border: '1px solid #dbeafe', marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>📱 {t('camp.install.title', 'Install the app')}</div>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px', lineHeight: 1.45 }}>
                    {t('camp.install.help', 'Install Jeevan on your home screen to get report notifications and open reports quickly.')}
                  </p>
                  {installReady ? (
                    <button type="button" className="btn btn-primary btn-block" onClick={handleInstall} style={{ minHeight: 46 }}>
                      {t('camp.install.cta', 'Install app')}
                    </button>
                  ) : (
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                      {t('camp.install.manual2', 'Browser menu → Add to Home Screen / Install app')}
                    </p>
                  )}
                </div>
              )}

              {isStandalonePwa() && (
                <p style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, textAlign: 'center', marginBottom: 12 }}>
                  App installed ✓
                </p>
              )}

              <div style={{ padding: 14, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>🔔 {t('camp.push.title', 'Report alerts')}</div>
                <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px' }}>
                  {t('camp.push.help', 'Allow notifications so we can tell you when your lab report is ready.')}
                </p>
                <button type="button" className="btn btn-outline btn-block" onClick={handleEnablePush} style={{ minHeight: 44 }}>
                  {t('camp.push.cta', 'Enable notifications')}
                </button>
                {pushStatus && <p style={{ fontSize: 12, color: '#166534', margin: '10px 0 0' }}>{pushStatus}</p>}
              </div>

              <button
                type="button"
                className="btn btn-primary btn-block"
                style={{ minHeight: 48 }}
                onClick={() => navigate(getPostLoginPath(user?.role) || '/dashboard?tab=reports')}
              >
                {t('camp.openDashboard', 'Open my reports')}
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12 }}>← Home</Link>
        </p>
      </div>
    </div>
  );
}
