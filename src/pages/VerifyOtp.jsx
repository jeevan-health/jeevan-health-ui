import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ClockCounterClockwise } from '@phosphor-icons/react';
import { verifyOtp } from '../services/authService';
import useAuthStore from '../store/authStore';

export default function VerifyOtp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((s) => s.setUser);
  const { identifier, type } = location.state || {};

  useEffect(() => {
    if (!identifier) navigate('/signup');
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleSubmit = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await verifyOtp(identifier, code, type);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);
      navigate(data.user.name ? '/dashboard' : '/profile-setup');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: 'linear-gradient(180deg, #ecfeff 0%, #ffffff 100%)' }}>
      <div className="flex flex-col min-h-full max-w-sm mx-auto">
        <div className="mb-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto" style={{ background: 'var(--primary)', color: 'white' }}>
            <ShieldCheck size={36} weight="bold" />
          </div>
          <h1 className="section-title text-center mb-2">Verify OTP</h1>
          <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
            Enter the 6-digit code sent to <span className="font-semibold" style={{ color: 'var(--text)' }}>{identifier}</span>
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-16 text-center text-2xl font-bold rounded-xl outline-none transition-all"
              style={{
                border: `2px solid ${digit ? 'var(--primary)' : 'var(--cyan-200)'}`,
                color: 'var(--text)',
                background: digit ? 'var(--cyan-50)' : 'white',
              }}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm font-medium text-center mb-4" style={{ color: 'var(--red-500)' }}>{error}</p>
        )}

        <button onClick={handleSubmit} disabled={loading || otp.join('').length !== 6} className="btn btn-primary w-full">
          {loading ? 'Verifying...' : 'Verify OTP'}
          <ArrowRight size={20} weight="bold" />
        </button>

        <div className="text-center mt-6">
          {timer > 0 ? (
            <p className="text-sm flex items-center justify-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <ClockCounterClockwise size={16} />
              Resend in {timer}s
            </p>
          ) : (
            <button onClick={() => { setTimer(30); setOtp(['', '', '', '', '', '']); inputs.current[0]?.focus(); }}
              className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
