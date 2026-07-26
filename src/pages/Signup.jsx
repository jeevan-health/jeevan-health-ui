import { Link } from 'react-router-dom';

export default function Signup() {
  return (
    <div className="container" style={{ padding: '40px 16px', maxWidth: 480 }}>
      <h1 style={{ color: 'var(--text-dark)', marginBottom: 8, fontSize: '1.5rem' }}>
        Login / Sign up
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Secure customer login is next in Phase 1 (email OTP, phone OTP, Google). The foundation is
        live — auth ships in the next slice.
      </p>
      <div
        style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 24,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <p style={{ marginBottom: 16, fontSize: 14 }}>Coming in Phase 1:</p>
        <ul style={{ paddingLeft: 18, color: 'var(--text-body)', fontSize: 14, lineHeight: 1.7 }}>
          <li>Email OTP (Brevo)</li>
          <li>Phone OTP (console until SMS unparked)</li>
          <li>Google Sign-In</li>
        </ul>
        <Link to="/diagnostics" className="btn btn-primary btn-block" style={{ marginTop: 20 }}>
          Browse tests for now
        </Link>
      </div>
    </div>
  );
}
