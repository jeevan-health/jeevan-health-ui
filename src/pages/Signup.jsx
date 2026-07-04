import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeviceMobile, Envelope, ArrowRight, ShieldCheck } from '@phosphor-icons/react';
import { sendOtp } from '../services/authService';

export default function Signup() {
  const [identifier, setIdentifier] = useState('');
  const [type, setType] = useState('phone');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendOtp(identifier, type);
      navigate('/verify-otp', { state: { identifier, type } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: 'linear-gradient(180deg, #ecfeff 0%, #ffffff 100%)' }}>
      <div className="flex flex-col min-h-full max-w-sm mx-auto">
        <div className="mb-12">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'var(--primary)', color: 'white' }}>
            <ShieldCheck size={32} weight="bold" />
          </div>
          <h1 className="section-title mb-2">Welcome to</h1>
          <h2 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Jeevan HealthCare</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>Your health is our priority. Enter your details to get started.</p>
        </div>

        <div className="flex mb-6 rounded-xl p-1.5" style={{ background: 'var(--cyan-100)' }}>
          {[
            { key: 'phone', icon: DeviceMobile, label: 'Phone' },
            { key: 'email', icon: Envelope, label: 'Email' },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => { setType(key); setIdentifier(''); }}
              className="flex-1 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{
                background: type === key ? 'white' : 'transparent',
                color: type === key ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: type === key ? 'var(--shadow)' : 'none',
              }}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label>{type === 'phone' ? 'Mobile Number' : 'Email Address'}</label>
            {type === 'phone' ? (
              <div className="flex items-center input p-0 overflow-hidden">
                <span className="px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>+91</span>
                <input
                  type="tel"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter mobile number"
                  className="flex-1 py-3.5 pr-4 outline-none border-none bg-transparent text-base"
                  maxLength={10}
                  style={{ color: 'var(--text)' }}
                />
              </div>
            ) : (
              <input
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email address"
                className="input"
              />
            )}
          </div>

          <label className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <input type="checkbox" className="w-5 h-5 rounded" style={{ accentColor: 'var(--primary)' }} />
            Send updates via WhatsApp
          </label>

          {error && <p className="text-sm font-medium" style={{ color: 'var(--red-500)' }}>{error}</p>}

          <button type="submit" disabled={loading || !identifier} className="btn btn-primary w-full">
            {loading ? 'Sending...' : 'Send OTP'}
            <ArrowRight size={20} weight="bold" />
          </button>
        </form>
      </div>
    </div>
  );
}
