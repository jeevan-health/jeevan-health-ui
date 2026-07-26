import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import { isPhleboRole, isAdminRole } from '../../utils/authRoles.js';
import { getPhleboDashboard } from '../../services/phleboService.js';
import './phlebo-portal.css';

export default function PhleboDashboard() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) return;
    getPhleboDashboard()
      .then(setData)
      .catch((e) => setError(e?.response?.data?.error?.message || e.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user?.id]);

  if (!isAuthenticated()) {
    return <Navigate to="/phlebo/login" replace />;
  }
  if (!isPhleboRole(user?.role) && !isAdminRole(user?.role)) {
    return <Navigate to="/phlebo/login" replace />;
  }

  const p = data?.phlebotomist;

  return (
    <div className="phlebo-dash">
      <header className="phlebo-top">
        <div className="phlebo-top-inner">
          <div className="phlebo-brand">
            <img src="/logo.png" alt="" />
            <span>Phlebo</span>
          </div>
          <button type="button" className="btn btn-outline-dark" onClick={() => logout()}>
            Log out
          </button>
        </div>
      </header>

      <main className="container phlebo-dash-main">
        <p className="phlebo-eyebrow">Field portal · Phase 4</p>
        <h1>Hello{p?.name || user?.name ? `, ${p?.name || user?.name}` : ''}</h1>
        {loading && <p className="muted">Loading profile…</p>}
        {error && <div className="phlebo-error">{error}</div>}

        {p && (
          <div className="phlebo-card">
            <h2>Your roster profile</h2>
            <dl>
              <div>
                <dt>Employee ID</dt>
                <dd>{p.employeeId}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{p.phone}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{p.status}</dd>
              </div>
              <div>
                <dt>Areas</dt>
                <dd>{p.areas || p.preferredAreas || '—'}</dd>
              </div>
              <div>
                <dt>Qualification</dt>
                <dd>{p.qualification || '—'}</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="phlebo-card muted-card">
          <h2>Today&apos;s collections</h2>
          <p>
            {data?.message ||
              'Job assignment, duty start, and sample workflow ship in Phase 5 (field ops).'}
          </p>
          <div className="phlebo-stats">
            <div>
              <strong>{data?.stats?.todayTotal ?? 0}</strong>
              <span>Assigned</span>
            </div>
            <div>
              <strong>{data?.stats?.todayPending ?? 0}</strong>
              <span>Open</span>
            </div>
            <div>
              <strong>{data?.stats?.todayCompleted ?? 0}</strong>
              <span>Done</span>
            </div>
          </div>
        </div>

        <p className="muted">
          Portal host: <code>phlebo.jeevanhealthcare.com</code> · Apply link:{' '}
          <Link to="/onboarding-phlebotomist">hire form</Link>
        </p>
      </main>
    </div>
  );
}
