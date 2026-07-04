import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import useAuthStore from '../store/authStore';
import api from '../services/api';

export default function OtpVerification() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((s) => s.setUser);

  const identifier = location.state?.identifier || '';
  const type = location.state?.type || 'phone';

  useEffect(() => {
    if (!identifier) navigate('/signup');
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (i, val) => {
    if (val && !/^\d$/.test(val)) return;
    const newCode = [...code];
    newCode[i] = val;
    setCode(newCode);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = code.join('');
    if (otp.length !== 6) { setError('Enter the full 6-digit OTP'); return; }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/verify-otp', { identifier, code: otp });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);
      navigate(data.isNew ? '/profile-setup' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/send-otp', { identifier, type });
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
      setError('');
    } catch {
      setError('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: 'linear-gradient(180deg, #ecfeff 0%, #ffffff 100%)' }}>
      <div className="flex flex-col min-h-full max-w-sm mx-auto">
        <button onClick={() => navigate('/signup')} className="flex items-center gap-1.5 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Change {type === 'phone' ? 'Phone' : 'Email'}
        </button>

        <div className="mb-8">
          <h1 className="section-title mb-2">Verify OTP</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Enter the 6-digit code sent to<br />
            <span className="font-semibold" style={{ color: 'var(--primary)' }}>{identifier}</span>
          </p>
        </div>

        <div className="flex gap-3 justify-center mb-8">
          {code.map((digit, i) => (
            <input key={i}
              ref={(el) => inputs.current[i] = el}
              type="text" inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="otp-input" />
          ))}
        </div>

        {error && <p className="text-sm font-medium text-center mb-4" style={{ color: 'var(--red-500)' }}>{error}</p>}

        <button onClick={handleVerify} disabled={loading || code.join('').length !== 6} className="btn btn-primary w-full">
          {loading ? 'Verifying...' : 'Verify OTP'}
          <ArrowRight size={20} weight="bold" />
        </button>

        <button onClick={handleResend} disabled={resending}
          className="text-sm font-semibold text-center mt-6" style={{ color: 'var(--primary)' }}>
          {resending ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
}
