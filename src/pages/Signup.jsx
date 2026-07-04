import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-white flex flex-col px-6">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to</h1>
        <h2 className="text-xl font-semibold text-blue-500 mb-1">Jeevan HealthCare</h2>
        <p className="text-gray-400 text-sm mb-8">Your health is our priority</p>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setType('phone')}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${type === 'phone' ? 'bg-white shadow text-blue-500' : 'text-gray-500'}`}
          >
            Phone
          </button>
          <button
            onClick={() => setType('email')}
            className={`flex-1 py-2 rounded-md text-sm font-medium ${type === 'email' ? 'bg-white shadow text-blue-500' : 'text-gray-500'}`}
          >
            Email
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">
              {type === 'phone' ? 'Mobile Number' : 'Email Address'}
            </label>
            {type === 'phone' ? (
              <div className="flex items-center border border-gray-300 rounded-lg px-3">
                <span className="text-gray-500 text-sm mr-2">+91</span>
                <input
                  type="tel"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter mobile number"
                  className="flex-1 py-3 outline-none text-sm"
                  maxLength={10}
                />
              </div>
            ) : (
              <input
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email address"
                className="w-full border border-gray-300 rounded-lg px-3 py-3 outline-none text-sm"
              />
            )}
          </div>

          <label className="flex items-center gap-2 mb-6">
            <input type="checkbox" className="rounded text-blue-500" />
            <span className="text-xs text-gray-400">Send updates via WhatsApp</span>
          </label>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading || !identifier}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}
