import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Envelope, Phone, ArrowRight, CaretLeft } from '@phosphor-icons/react';
import api from '../services/api';

export default function Signup() {
  const [identifier, setIdentifier] = useState('');
  const [method, setMethod] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { identifier, type: method });
      navigate('/verify-otp', { state: { identifier, type: method } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: 'linear-gradient(180deg, #ecfeff 0%, #ffffff 100%)' }}>
      <div className="flex flex-col min-h-full max-w-sm mx-auto">
        <button onClick={() => navigate('/onboarding')} className="flex items-center gap-1.5 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          <CaretLeft size={16} /> Back
        </button>

        <div className="mb-8">
          <h1 className="section-title mb-2">Get Started</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Enter your phone number or email to receive an OTP
          </p>
        </div>

        <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
          {/* Method toggle */}
          <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--cyan-100)' }}>
            {[
              { value: 'phone', label: 'Phone', icon: Phone },
              { value: 'email', label: 'Email', icon: Envelope },
            ].map(({ value, label, icon: Icon }) => (
              <button key={value} type="button" onClick={() => { setMethod(value); setIdentifier(''); setError(''); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: method === value ? '#fff' : 'transparent',
                  color: method === value ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: method === value ? 'var(--shadow)' : 'none',
                }}>
                <Icon size={16} className="inline mr-1.5" /> {label}
              </button>
            ))}
          </div>

          <div>
            <label>{method === 'phone' ? 'Phone Number' : 'Email Address'}</label>
            <div className="input flex items-center p-0 overflow-hidden">
              <span className="px-3" style={{ color: 'var(--text-muted)' }}>
                {method === 'phone' ? <Phone size={18} /> : <Envelope size={18} />}
              </span>
              <input type={method === 'phone' ? 'tel' : 'email'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={method === 'phone' ? '+91 98765 43210' : 'you@example.com'}
                className="flex-1 py-3.5 pr-4 outline-none border-none bg-transparent text-base"
                required
                style={{ color: 'var(--text)' }} />
            </div>
          </div>

          {error && <p className="text-sm font-medium" style={{ color: 'var(--red-500)' }}>{error}</p>}

          <button type="submit" disabled={loading || !identifier} className="btn btn-primary w-full">
            {loading ? 'Sending...' : 'Send OTP'}
            <ArrowRight size={20} weight="bold" />
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button onClick={() => navigate('/verify-otp', { state: { identifier: '', type: 'phone' } })}
            className="font-semibold" style={{ color: 'var(--primary)' }}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
