import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

function roleRedirect(role) {
  return role !== 'user' ? '/admin' : '/dashboard';
}

export default function Signup() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleConsent, setShowGoogleConsent] = useState(false);
  const { verifyOtp, googleLogin } = useAuthStore();
  const navigate = useNavigate();

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
    if (ok) navigate(roleRedirect(useAuthStore.getState().user?.role), { replace: true });
    else setError('Invalid OTP. Try again.');
  }

  async function handleGoogleLogin() {
    setError('');
    setLoading(true);
    const ok = await googleLogin();
    setLoading(false);
    if (ok) navigate(roleRedirect(useAuthStore.getState().user?.role), { replace: true });
    else setError('Google login failed. Try again.');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)', padding: 16 }}>
      <div className="card" style={{ maxWidth: 400, width: '100%', padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="https://www.jeevanhealthcare.com/logo.png" alt="Jeevan HealthCare" style={{ height: 48, marginBottom: 8 }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
          <div style={{ display: 'none', fontSize: 36, marginBottom: 8 }}>⚕️</div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Welcome to Jeevan HealthCare</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Login to book tests and manage your health</p>
        </div>

        {error && <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, fontSize: 12, marginBottom: 12 }}>{error}</div>}

        {/* Google Login */}
        {showGoogleConsent ? (
          <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Continue with Google</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
              Jeevan HealthCare would like to access your <strong>name, email address, and profile picture</strong> from your Google account for account creation and personalization.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowGoogleConsent(false)} className="btn btn-outline" style={{ flex: 1, fontSize: 12, justifyContent: 'center' }}>Cancel</button>
              <button onClick={handleGoogleLogin} disabled={loading} className="btn btn-primary" style={{ flex: 1, fontSize: 12, justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Signing in...' : 'Allow'}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowGoogleConsent(true)} disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #dadce0', background: '#fff',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: '#3c4043',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16,
              transition: 'all 0.2s', opacity: loading ? 0.6 : 1,
            }}>
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
              <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: '#e8edf2' }} />
          <span style={{ fontSize: 11, color: 'var(--text-light)' }}>or with OTP</span>
          <div style={{ flex: 1, height: 1, background: '#e8edf2' }} />
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Phone Number</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ padding: '10px 0', fontSize: 14, color: 'var(--text-secondary)' }}>+91</span>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter your phone number" className="input" required />
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg mt-4" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Enter OTP</label>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>OTP sent to +91 {phone}</p>
            <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter OTP" className="input" required />
            <button type="submit" className="btn btn-primary btn-block btn-lg mt-4" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button type="button" onClick={() => setStep(1)} style={{ marginTop: 8, background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 12, width: '100%', textAlign: 'center' }}>
              Change phone number
            </button>
          </form>
        )}

        <p style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center', marginTop: 16 }}>
          By continuing, you agree to our Terms & Privacy Policy
        </p>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Link to="/" style={{ fontSize: 12, color: 'var(--primary)' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
