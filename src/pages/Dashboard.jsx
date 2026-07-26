import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore.js';
import './page-shell.css';
import './dashboard.css';

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/signup" replace />;
  }

  const first = user?.name?.split(' ')[0];

  return (
    <div className="page-shell dash">
      <div className="dash-welcome">
        <div className="dash-avatar" aria-hidden>
          {(first || user?.phone || 'U').slice(0, 1).toUpperCase()}
        </div>
        <div>
          <h1>Hello{first ? `, ${first}` : ''}</h1>
          <p>You&apos;re signed in to Jeevan HealthCare</p>
        </div>
      </div>

      <div className="dash-card">
        <h2>Account</h2>
        <dl className="dash-dl">
          <div>
            <dt>Name</dt>
            <dd>{user?.name || '—'}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{user?.phone || '—'}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user?.email || '—'}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd className="dash-role">{user?.role}</dd>
          </div>
        </dl>
      </div>

      <div className="dash-card dash-soon">
        <h2>Coming next</h2>
        <ul>
          <li>Search &amp; book lab tests</li>
          <li>My orders &amp; collection status</li>
          <li>Digital reports</li>
        </ul>
      </div>

      <div className="dash-actions">
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
