import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore.js';

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/signup" replace />;
  }

  return (
    <div className="container" style={{ padding: '28px 16px 48px', maxWidth: 640 }}>
      <h1 style={{ color: 'var(--text-dark)', fontSize: '1.5rem', marginBottom: 8 }}>
        Welcome{user?.name ? `, ${user.name}` : ''}
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
        You&apos;re signed in. Bookings, orders, and reports land in the next phases.
      </p>

      <div
        style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <p style={{ fontSize: 14, marginBottom: 6 }}>
          <strong>Phone:</strong> {user?.phone || '—'}
        </p>
        <p style={{ fontSize: 14, marginBottom: 6 }}>
          <strong>Email:</strong> {user?.email || '—'}
        </p>
        <p style={{ fontSize: 14 }}>
          <strong>Role:</strong> {user?.role}
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <Link to="/diagnostics" className="btn btn-primary">
          Browse tests
        </Link>
        <button type="button" className="btn btn-outline-dark" onClick={() => logout()}>
          Log out
        </button>
      </div>
    </div>
  );
}
