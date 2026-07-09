import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

export default function AdminLogin() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { verifyOtp } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const user = useAuthStore.getState().user;
    if (user && user.role !== 'user') navigate('/admin', { replace: true });
  }, []);

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
    navigate('/admin', { replace: true });
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: 16 }}>
      <div style={{ maxWidth: 400, width: '100%', background: '#1e293b', borderRadius: 16, padding: 32, border: '1px solid #334155' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⚕️</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Admin Portal</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Jeevan HealthCare Admin</p>
        </div>

        {error && <div style={{ padding: '10px 14px', background: '#451a1a', color: '#f87171', borderRadius: 8, fontSize: 12, marginBottom: 12, border: '1px solid #7f1d1d' }}>{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block', color: '#cbd5e1' }}>Admin Phone Number</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ padding: '10px 0', fontSize: 14, color: '#64748b' }}>+91</span>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter admin phone" required style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg mt-4" disabled={loading} style={{ background: '#00D9FF', color: '#0f172a', fontWeight: 700 }}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block', color: '#cbd5e1' }}>Enter OTP</label>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>OTP sent to +91 {phone}</p>
            <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter OTP" required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            <button type="submit" className="btn btn-primary btn-block btn-lg mt-4" disabled={loading} style={{ background: '#00D9FF', color: '#0f172a', fontWeight: 700 }}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button type="button" onClick={() => setStep(1)} style={{ marginTop: 8, background: 'none', border: 'none', color: '#00D9FF', cursor: 'pointer', fontSize: 12, width: '100%', textAlign: 'center', fontFamily: 'inherit' }}>
              Change phone number
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>← Back to Main Site</button>
        </div>
      </div>
    </div>
  );
}
