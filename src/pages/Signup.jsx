import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import GoogleSignIn from '../components/GoogleSignIn';

export default function Signup() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { verifyOtp } = useAuthStore();
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
    if (ok) navigate('/dashboard');
    else setError('Invalid OTP. Try again.');
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
        <GoogleSignIn onError={(msg) => setError(msg)} />

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
