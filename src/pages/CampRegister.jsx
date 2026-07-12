import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import useAuthStore from '../stores/authStore';
import { sendOtp as sendOtpApi } from '../services/authService';
import { getPostLoginPath } from '../utils/authRoles';
import * as labReportService from '../services/labReportService';
import * as campService from '../services/campService';
import CampInstallPanel from '../components/CampInstallPanel';

/**
 * Camp patient flow: register with email OTP → join camp → install PWA → notifications.
 * Route: /camp or /camp/:slug
 */
export default function CampRegister() {
  const t = useT();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { verifyOtp, isAuthenticated, user } = useAuthStore();

  const [camp, setCamp] = useState(null);
  const [campLoading, setCampLoading] = useState(!!slug);
  const [campError, setCampError] = useState('');
  const [joined, setJoined] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [sentTo, setSentTo] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!slug) {
      setCamp(null);
      setCampLoading(false);
      return undefined;
    }
    let cancelled = false;
    setCampLoading(true);
    campService.getPublicCamp(slug)
      .then(({ data }) => {
        if (!cancelled) {
          setCamp(data.camp);
          setCampError('');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setCamp(null);
          setCampError(err?.response?.data?.error || 'Camp not found');
        }
      })
      .finally(() => {
        if (!cancelled) setCampLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  const joinIfNeeded = useCallback(async () => {
    if (!slug || !isAuthenticated) return;
    try {
      await campService.joinCamp(slug);
      setJoined(true);
    } catch (err) {
      console.warn('camp join failed', err?.response?.data || err.message);
      // Don't block UX — user is still registered as a customer
    }
  }, [slug, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setStep(3);
      joinIfNeeded();
    }
  }, [isAuthenticated, user, joinIfNeeded]);

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
    // join after tokens are in store
    setTimeout(() => joinIfNeeded(), 50);
  };

  const pushApi = {
    getVapidKey: async () => {
      const { data } = await labReportService.getVapidPublicKey();
      return data.publicKey || null;
    },
    saveSubscription: async (sub) => {
      await labReportService.savePushSubscription(sub);
    },
  };

  const title = camp?.name || t('camp.title', 'Camp registration');
  const headline = camp?.headline || t('camp.sub', 'Register with email · Install app · Get report alerts');

  if (campLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F7FF' }}>
        <p style={{ color: '#64748b' }}>Loading camp…</p>
      </div>
    );
  }

  if (slug && campError) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F7FF', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 400, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🏕️</div>
          <h1 style={{ fontSize: 18, margin: '0 0 8px' }}>Camp not available</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>{campError}</p>
          <Link to="/" className="btn btn-primary">Go home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0F5DA8 0%, #1A7AD4 35%, #F0F7FF 35%)', padding: '24px 16px 48px' }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', color: '#fff', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <img src="/logo.png" alt="Jeevan" style={{ height: 44 }} onError={(e) => { e.target.style.display = 'none'; }} />
            {camp?.companyLogo && (
              <>
                <span style={{ opacity: 0.5, fontSize: 18 }}>|</span>
                <img src={camp.companyLogo} alt="" style={{ height: 44, maxWidth: 100, objectFit: 'contain', background: '#fff', borderRadius: 8, padding: 4 }} />
              </>
            )}
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>{title}</h1>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.92 }}>{headline}</p>
          {camp?.location && (
            <p style={{ margin: '6px 0 0', fontSize: 12, opacity: 0.85 }}>📍 {camp.location}</p>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 22, boxShadow: '0 12px 40px rgba(15,23,42,0.12)' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            {['Email', 'OTP', 'App'].map((label, i) => (
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
                {slug && (
                  <p style={{ fontSize: 12, color: '#16a34a', margin: '8px 0 0', fontWeight: 600 }}>
                    {joined ? `Joined ${camp?.name || 'camp'} ✓` : camp?.name ? `Linking to ${camp.name}…` : ''}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: 12 }}>
                <CampInstallPanel
                  pushApi={pushApi}
                  onDone={() => { if (slug) joinIfNeeded(); }}
                />
              </div>

              <button
                type="button"
                className="btn btn-outline btn-block"
                style={{ minHeight: 46 }}
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
