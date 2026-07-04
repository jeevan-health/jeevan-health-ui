import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Envelope, Lock, Eye, EyeSlash, ArrowRight } from '@phosphor-icons/react';
import { signup, login } from '../services/authService';
import useAuthStore from '../store/authStore';

export default function Signup() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = isLogin
        ? await login(email, password)
        : await signup(email, password);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);
      navigate(data.user.name ? '/dashboard' : '/profile-setup');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: 'linear-gradient(180deg, #ecfeff 0%, #ffffff 100%)' }}>
      <div className="flex flex-col min-h-full max-w-sm mx-auto">
        <div className="mb-12">
          <h1 className="section-title mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? 'Sign in to your Jeevan HealthCare account' : 'Sign up to start your healthcare journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label>Email Address</label>
            <div className="input flex items-center p-0 overflow-hidden">
              <span className="px-3" style={{ color: 'var(--text-muted)' }}><Envelope size={18} /></span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" className="flex-1 py-3.5 pr-4 outline-none border-none bg-transparent text-base" required
                style={{ color: 'var(--text)' }} />
            </div>
          </div>

          <div>
            <label>Password</label>
            <div className="input flex items-center p-0 overflow-hidden">
              <span className="px-3" style={{ color: 'var(--text-muted)' }}><Lock size={18} /></span>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? 'Enter your password' : 'Create a password (min 6 chars)'}
                className="flex-1 py-3.5 pr-4 outline-none border-none bg-transparent text-base" required minLength={6}
                style={{ color: 'var(--text)' }} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="px-3" style={{ color: 'var(--text-muted)' }}>
                {showPw ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm font-medium" style={{ color: 'var(--red-500)' }}>{error}</p>}

          <button type="submit" disabled={loading || !email || password.length < 6} className="btn btn-primary w-full">
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight size={20} weight="bold" />
          </button>
        </form>

        <p className="text-sm text-center mt-8" style={{ color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-semibold" style={{ color: 'var(--primary)' }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
