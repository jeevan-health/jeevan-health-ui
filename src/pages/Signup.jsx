import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore.js';
import GoogleSignIn from '../components/GoogleSignIn.jsx';
import { getPostLoginPath, isAdminRole } from '../utils/authRoles.js';
import './auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, loginWithGoogle, loading, error, clearError, user, logout } =
    useAuthStore();

  const [channel, setChannel] = useState('phone'); // phone | email
  const [destination, setDestination] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('identify'); // identify | otp
  const [devCode, setDevCode] = useState(null);
  const [info, setInfo] = useState(null);

  if (user) {
    const home = getPostLoginPath(user.role);
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>You&apos;re signed in</h1>
          <p className="auth-lead">
            {user.name || user.phone || user.email}
            <br />
            <span className="auth-muted">Role: {user.role}</span>
          </p>
          <div className="auth-actions">
            <Link to={home} className="btn btn-primary btn-block">
              {isAdminRole(user.role) ? 'Go to admin' : 'Go to dashboard'}
            </Link>
            <button type="button" className="btn btn-outline-dark btn-block" onClick={() => logout()}>
              Log out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const onSend = async (e) => {
    e.preventDefault();
    clearError();
    setInfo(null);
    setDevCode(null);
    try {
      const data = await sendOtp({ channel, destination: destination.trim() });
      setStep('otp');
      setInfo(data.message || 'OTP sent');
      if (data.code) setDevCode(data.code);
    } catch {
      /* store sets error */
    }
  };

  const onVerify = async (e) => {
    e.preventDefault();
    clearError();
    try {
      const data = await verifyOtp({
        channel,
        destination: destination.trim(),
        code: code.trim(),
        name: name.trim() || undefined,
      });
      navigate(getPostLoginPath(data.user?.role), { replace: true });
    } catch {
      /* store sets error */
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Login / Sign up</h1>
        <p className="auth-lead">Secure OTP login for customers. No password needed.</p>

        {step === 'identify' && (
          <form onSubmit={onSend} className="auth-form">
            <div className="auth-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                className={channel === 'phone' ? 'active' : ''}
                aria-selected={channel === 'phone'}
                onClick={() => {
                  setChannel('phone');
                  clearError();
                }}
              >
                Mobile
              </button>
              <button
                type="button"
                role="tab"
                className={channel === 'email' ? 'active' : ''}
                aria-selected={channel === 'email'}
                onClick={() => {
                  setChannel('email');
                  clearError();
                }}
              >
                Email
              </button>
            </div>

            <label className="auth-label" htmlFor="dest">
              {channel === 'phone' ? 'Mobile number' : 'Email address'}
            </label>
            <input
              id="dest"
              className="auth-input"
              type={channel === 'phone' ? 'tel' : 'email'}
              inputMode={channel === 'phone' ? 'numeric' : 'email'}
              autoComplete={channel === 'phone' ? 'tel' : 'email'}
              placeholder={channel === 'phone' ? '10-digit mobile' : 'you@example.com'}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />

            <label className="auth-label" htmlFor="name">
              Name <span className="auth-muted">(optional)</span>
            </label>
            <input
              id="name"
              className="auth-input"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Sending…' : 'Send OTP'}
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <GoogleSignIn
              disabled={loading}
              onCredential={async (credential) => {
                clearError();
                try {
                  const data = await loginWithGoogle(credential);
                  navigate(getPostLoginPath(data.user?.role), { replace: true });
                } catch {
                  /* store */
                }
              }}
            />
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={onVerify} className="auth-form">
            <p className="auth-muted">
              Code sent to <strong>{destination}</strong>
            </p>
            {info && <p className="auth-info">{info}</p>}
            {devCode && (
              <div className="auth-dev-code" role="status">
                Your code: <strong>{devCode}</strong>
                <span> (on-screen until SMS is enabled / console email)</span>
              </div>
            )}

            <label className="auth-label" htmlFor="otp">
              Enter 6-digit OTP
            </label>
            <input
              id="otp"
              className="auth-input auth-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="••••••"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading || code.length < 6}>
              {loading ? 'Verifying…' : 'Verify & continue'}
            </button>

            <button
              type="button"
              className="btn btn-outline-dark btn-block"
              disabled={loading}
              onClick={() => {
                setStep('identify');
                setCode('');
                setDevCode(null);
                clearError();
              }}
            >
              Change {channel === 'phone' ? 'number' : 'email'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
