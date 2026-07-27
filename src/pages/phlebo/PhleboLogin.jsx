import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import { isPhleboRole, isAdminRole, isPhleboHostname } from '../../utils/authRoles.js';
import InstallAppButton from '../../components/InstallAppButton.jsx';
import '../auth.css';
import './phlebo-portal.css';

export default function PhleboLogin() {
  const navigate = useNavigate();
  const { user, sendOtp, verifyOtp, logout, loading, error, clearError, isAuthenticated } =
    useAuthStore();

  const [destination, setDestination] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('identify');
  const [devCode, setDevCode] = useState(null);
  const [localError, setLocalError] = useState(null);

  if (isAuthenticated() && isPhleboRole(user?.role)) {
    return <Navigate to="/phlebo" replace />;
  }

  const onSend = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError(null);
    setDevCode(null);
    try {
      const data = await sendOtp({ channel: 'phone', destination: destination.trim() });
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
        channel: 'phone',
        destination: destination.trim(),
        code: code.trim(),
      });
      if (!isPhleboRole(data.user?.role) && !isAdminRole(data.user?.role)) {
        await logout();
        setLocalError(
          'This phone is not enabled for the phlebo portal. Complete hiring and wait for admin promote.',
        );
        setStep('identify');
        setCode('');
        setDevCode(null);
        return;
      }
      navigate('/phlebo', { replace: true });
    } catch {
      /* store */
    }
  };

  return (
    <div className="phlebo-login-page">
      <div className="phlebo-login-card auth-card">
        <div className="phlebo-login-brand">
          <img src="/logo.png" alt="Jeevan HealthCare" />
          <span className="phlebo-login-pill">Phlebo portal</span>
        </div>
        <h1>Field login</h1>
        <p className="auth-lead">
          Sign in with the mobile number admin enabled after hire. Phone OTP only — no password.
          {isPhleboHostname() ? ' · phlebo.jeevanhealthcare.com' : ''}
        </p>

        {step === 'identify' ? (
          <form onSubmit={onSend} className="auth-form">
            <label className="auth-label" htmlFor="phlebo-dest">
              Mobile number
            </label>
            <input
              id="phlebo-dest"
              className="auth-input"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="10-digit mobile"
              inputMode="tel"
              autoComplete="tel"
              required
            />
            {(localError || error) && <div className="auth-error">{localError || error}</div>}
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={onVerify} className="auth-form">
            <p className="auth-muted">OTP sent to {destination}</p>
            {devCode && (
              <p className="auth-dev-code">
                Console OTP: <strong>{devCode}</strong>
              </p>
            )}
            <label className="auth-label" htmlFor="phlebo-otp">
              Enter OTP
            </label>
            <input
              id="phlebo-otp"
              className="auth-input auth-otp"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              required
            />
            {(localError || error) && <div className="auth-error">{localError || error}</div>}
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify & enter'}
            </button>
            <button
              type="button"
              className="btn btn-outline-dark btn-block"
              onClick={() => {
                setStep('identify');
                setCode('');
                setDevCode(null);
              }}
            >
              Change number
            </button>
          </form>
        )}

        <div className="phlebo-login-install">
          <InstallAppButton variant="block" />
        </div>
        <p className="auth-muted phlebo-login-switch">
          <Link to="/">← Phlebo home</Link>
          {' · '}
          Applying? <Link to="/onboarding-phlebotomist">Hire form</Link>
        </p>
      </div>
    </div>
  );
}
