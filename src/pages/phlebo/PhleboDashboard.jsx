import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import { isPhleboRole, isAdminRole } from '../../utils/authRoles.js';
import {
  getPhleboDashboard,
  startDuty,
  endDuty,
} from '../../services/phleboService.js';
import { formatInr } from '../../services/ordersService.js';
import InstallAppButton from '../../components/InstallAppButton.jsx';
import EnablePushButton from '../../components/EnablePushButton.jsx';
import './phlebo-portal.css';

export default function PhleboDashboard() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await getPhleboDashboard();
      setData(d);
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) return;
    load();
  }, [isAuthenticated, user?.id, load]);

  if (!isAuthenticated()) {
    return <Navigate to="/phlebo/login" replace />;
  }
  if (!isPhleboRole(user?.role) && !isAdminRole(user?.role)) {
    return <Navigate to="/phlebo/login" replace />;
  }

  const p = data?.phlebotomist;
  const duty = data?.duty;
  const jobs = data?.jobs || [];

  const onStartDuty = async () => {
    setBusy(true);
    setError(null);
    try {
      await startDuty({});
      await load();
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message);
    } finally {
      setBusy(false);
    }
  };

  const onEndDuty = async () => {
    if (!window.confirm('End duty for today?')) return;
    setBusy(true);
    setError(null);
    try {
      await endDuty({});
      await load();
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="phlebo-dash">
      <header className="phlebo-top">
        <div className="phlebo-top-inner">
          <div className="phlebo-brand">
            <img src="/logo.png" alt="" />
            <span>Phlebo field</span>
          </div>
          <div className="phlebo-top-actions">
            <InstallAppButton variant="header" />
            <EnablePushButton variant="header" />
            <button type="button" className="btn btn-outline-dark" onClick={() => logout()}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="container phlebo-dash-main">
        <p className="phlebo-eyebrow">Field portal · {data?.today || 'today IST'}</p>
        <h1>Hello{p?.name || user?.name ? `, ${p?.name || user?.name}` : ''}</h1>
        {p?.employeeId ? <p className="muted">{p.employeeId}</p> : null}

        {loading && <p className="muted">Loading…</p>}
        {error && <div className="phlebo-error">{error}</div>}

        <div className="phlebo-card duty-card">
          <h2>Duty</h2>
          {duty?.active ? (
            <>
              <p className="duty-on">On duty since {new Date(duty.startedAt).toLocaleTimeString('en-IN')}</p>
              <p className="muted">Collections this duty: {duty.collectionsCount || 0}</p>
              <button type="button" className="btn btn-outline-dark" disabled={busy} onClick={onEndDuty}>
                End duty
              </button>
            </>
          ) : (
            <>
              <p className="muted">Start duty before running routes.</p>
              <button type="button" className="btn btn-primary" disabled={busy} onClick={onStartDuty}>
                {busy ? 'Starting…' : 'Start duty'}
              </button>
            </>
          )}
        </div>

        <div className="phlebo-stats">
          <div>
            <strong>{data?.stats?.todayTotal ?? 0}</strong>
            <span>Jobs</span>
          </div>
          <div>
            <strong>{data?.stats?.todayPending ?? 0}</strong>
            <span>Open</span>
          </div>
          <div>
            <strong>{data?.stats?.todayCompleted ?? 0}</strong>
            <span>Collected</span>
          </div>
        </div>

        <div className="phlebo-card">
          <h2>Today&apos;s jobs</h2>
          {!jobs.length && <p className="muted">No jobs assigned yet. Admin assigns from Orders.</p>}
          <ul className="phlebo-job-list">
            {jobs.map((j) => (
              <li key={j.id}>
                <Link to={`/phlebo/jobs/${j.id}`} className="phlebo-job-link">
                  <div>
                    <strong className="code">{j.orderCode}</strong>
                    <span className={`badge ph-${j.phleboStatus}`}>{j.phleboStatus || '—'}</span>
                  </div>
                  <p>
                    {j.patientName} · {j.patientPhone}
                  </p>
                  <p className="sub">
                    {j.addressLine1}
                    {j.city ? `, ${j.city}` : ''}
                    {j.collectionSlot ? ` · ${j.collectionSlot}` : ''}
                  </p>
                  <p className="sub">
                    {(j.items || []).map((i) => i.testName).join(', ') || 'Tests'} · {formatInr(j.total)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
