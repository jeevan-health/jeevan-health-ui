import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
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
    <div className="min-h-screen bg-white flex flex-col px-6">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h1>
        <p className="text-gray-400 text-sm mb-8">
          Enter the 6-digit code sent to {identifier}
        </p>

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
              className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg outline-none focus:border-blue-500"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || otp.join('').length !== 6}
          className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 mb-4"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <p className="text-center text-sm text-gray-400">
          {timer > 0 ? (
            `Resend OTP in ${timer}s`
          ) : (
            <button
              onClick={() => setTimer(30)}
              className="text-blue-500 font-medium"
            >
              Resend OTP
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
