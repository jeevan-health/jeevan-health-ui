import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import { isAdminRole, isAdminHostname } from '../../utils/authRoles.js';
import '../auth.css';
import './admin-login.css';

/**
 * Dedicated admin / super_admin login.
 * Rejects customer accounts so they cannot enter the ops surface.
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, sendOtp, verifyOtp, logout, loading, error, clearError, isAuthenticated } =
    useAuthStore();

  const [channel, setChannel] = useState('phone');
  const [destination, setDestination] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('identify');
  const [devCode, setDevCode] = useState(null);
  const [localError, setLocalError] = useState(null);

  // Already admin → hub
  if (isAuthenticated() && isAdminRole(user?.role)) {
    return <Navigate to="/admin" replace />;
  }

  const onSend = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError(null);
    setDevCode(null);
    try {
      const data = await sendOtp({ channel, destination: destination.trim() });
      setStep('otp');
      if (data.code) setDevCode(data.code);
    } catch {
      /* store */
    }
  };

  const onVerify = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError(null);
    try {
      const data = await verifyOtp({
        channel,
        destination: destination.trim(),
        code: code.trim(),
      });
      if (!isAdminRole(data.user?.role)) {
        await logout();
        setLocalError('This account is not an admin. Use the patient app to sign in.');
        setStep('identify');
        setCode('');
        setDevCode(null);
        return;
      }
      navigate('/admin', { replace: true });
    } catch {
      /* store */
    }
  };

  const onPatient = isAdminHostname() ? null : (
    <p className="auth-muted admin-login-switch">
      Patient? <Link to="/signup">Go to customer login</Link>
    </p>
  );

  return (
    <div className="admin-login-page">
      <div className="admin-login-card auth-card">
        <div className="admin-login-brand">
          <img src="/logo.png" alt="Jeevan HealthCare" />
          <span className="admin-login-pill">Admin portal</span>
        </div>
        <h1>Staff sign in</h1>
        <p className="auth-lead">
          For <strong>admin</strong> and <strong>super admin</strong> only. Phone OTP (on-screen until
          SMS is live) or email OTP.
        </p>

        {step === 'identify' && (
          <form onSubmit={onSend} className="auth-form">
            <div className="auth-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                className={channel === 'phone' ? 'active' : ''}
                onClick={() => setChannel('phone')}
              >
                Mobile
              </button>
              <button
                type="button"
                role="tab"
                className={channel === 'email' ? 'active' : ''}
                onClick={() => setChannel('email')}
              >
                Email
              </button>
            </div>

            <label className="auth-label" htmlFor="admin-dest">
              {channel === 'phone' ? 'Admin mobile' : 'Admin email'}
            </label>
            <input
              id="admin-dest"
              className="auth-input"
              type={channel === 'phone' ? 'tel' : 'email'}
              placeholder={channel === 'phone' ? '10-digit mobile' : 'you@jeevanhealthcare.com'}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              autoComplete={channel === 'phone' ? 'tel' : 'email'}
            />

            {(error || localError) && <p className="auth-error">{localError || error}</p>}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
            {onPatient}
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={onVerify} className="auth-form">
            <p className="auth-muted">
              Code for <strong>{destination}</strong>
            </p>
            {devCode && (
              <div className="auth-dev-code" role="status">
                Your code: <strong>{devCode}</strong>
              </div>
            )}
            <label className="auth-label" htmlFor="admin-otp">
              Enter OTP
            </label>
            <input
              id="admin-otp"
              className="auth-input auth-otp"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              inputMode="numeric"
              required
            />
            {(error || localError) && <p className="auth-error">{localError || error}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={loading || code.length < 6}>
              {loading ? 'Verifying…' : 'Sign in to admin'}
            </button>
            <button
              type="button"
              className="btn btn-outline-dark btn-block"
              onClick={() => {
                setStep('identify');
                setCode('');
                setDevCode(null);
                clearError();
                setLocalError(null);
              }}
            >
              Change number / email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
