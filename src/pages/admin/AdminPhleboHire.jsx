import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import { isAdminRole } from '../../utils/authRoles.js';
import {
  listApplications,
  updateApplication,
  promoteApplication,
  listRoster,
} from '../../services/phleboService.js';
import './admin-catalog.css';
import './admin-phlebo.css';
import './admin-orders.css';

export default function AdminPhleboHire() {
  const { user, isAuthenticated } = useAuthStore();
  const [tab, setTab] = useState('applications');
  const [apps, setApps] = useState([]);
  const [roster, setRoster] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const loadApps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listApplications({ status: status || undefined, q: q || undefined, limit: 50 });
      setApps(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, [status, q]);

  const loadRoster = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listRoster({ q: q || undefined });
      setRoster(items);
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    if (!isAuthenticated() || !isAdminRole(user?.role)) return;
    if (tab === 'applications') loadApps();
    else loadRoster();
  }, [tab, user, isAuthenticated, loadApps, loadRoster]);

  if (!isAuthenticated() || !isAdminRole(user?.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  const onShortlist = async (id) => {
    setBusyId(id);
    setMsg(null);
    try {
      await updateApplication(id, { status: 'shortlisted' });
      setMsg('Marked shortlisted');
      await loadApps();
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message);
    } finally {
      setBusyId(null);
    }
  };

  const onReject = async (id) => {
    if (!window.confirm('Reject this application?')) return;
    setBusyId(id);
    try {
      await updateApplication(id, { status: 'rejected' });
      await loadApps();
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message);
    } finally {
      setBusyId(null);
    }
  };

  const onPromote = async (id) => {
    if (!window.confirm('Promote to roster and enable phone OTP login?')) return;
    setBusyId(id);
    setMsg(null);
    try {
      const result = await promoteApplication(id);
      setMsg(
        `Hired ${result.phlebotomist?.employeeId} · login phone ${result.login?.phone}` +
          (result.alreadyPromoted ? ' (already on roster)' : ''),
      );
      await loadApps();
      setTab('roster');
      await loadRoster();
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="admin-phlebo">
      <div className="admin-ord-hero">
        <div className="container">
          <p className="admin-ord-eyebrow">Hiring</p>
          <h1>Phlebotomists</h1>
          <p>Review applications, promote to roster, enable field login</p>
        </div>
      </div>

      <div className="container admin-ord-body">
        <div className="admin-phlebo-tabs">
          <button
            type="button"
            className={tab === 'applications' ? 'active' : ''}
            onClick={() => setTab('applications')}
          >
            Applications ({total})
          </button>
          <button
            type="button"
            className={tab === 'roster' ? 'active' : ''}
            onClick={() => setTab('roster')}
          >
            Roster
          </button>
        </div>

        <form
          className="admin-card admin-phlebo-filters"
          onSubmit={(e) => {
            e.preventDefault();
            if (tab === 'applications') loadApps();
            else loadRoster();
          }}
        >
          <label>
            Search
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, phone…" />
          </label>
          {tab === 'applications' && (
            <label>
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All</option>
                <option value="new">new</option>
                <option value="shortlisted">shortlisted</option>
                <option value="hired">hired</option>
                <option value="rejected">rejected</option>
              </select>
            </label>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Filter
          </button>
        </form>

        {error && <div className="admin-ord-error">{error}</div>}
        {msg && <div className="admin-phlebo-ok">{msg}</div>}
        {loading && <p className="muted">Loading…</p>}

        {tab === 'applications' && !loading && (
          <div className="admin-card">
            {!apps.length && <p className="muted">No applications yet.</p>}
            <ul className="admin-phlebo-list">
              {apps.map((a) => (
                <li key={a.id}>
                  <div>
                    <strong>{a.fullName}</strong>
                    <span className={`badge status-${a.status}`}>{a.status}</span>
                    <p>
                      {a.phone}
                      {a.education ? ` · ${a.education}` : ''}
                      {a.preferredLocation ? ` · ${a.preferredLocation}` : ''}
                    </p>
                    <p className="sub">
                      {a.data?.preferredJobs?.length
                        ? a.data.preferredJobs.join(', ')
                        : '—'}
                      {a.createdAt
                        ? ` · ${new Date(a.createdAt).toLocaleString('en-IN')}`
                        : ''}
                    </p>
                  </div>
                  <div className="admin-phlebo-actions">
                    {a.status !== 'hired' && a.status !== 'rejected' && (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline-dark btn-sm"
                          disabled={busyId === a.id}
                          onClick={() => onShortlist(a.id)}
                        >
                          Shortlist
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={busyId === a.id}
                          onClick={() => onPromote(a.id)}
                        >
                          Promote &amp; enable login
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-dark btn-sm"
                          disabled={busyId === a.id}
                          onClick={() => onReject(a.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {a.status === 'hired' && (
                      <span className="sub">On roster · login enabled</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'roster' && !loading && (
          <div className="admin-card">
            {!roster.length && <p className="muted">Roster empty — promote an application.</p>}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Login</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((p) => (
                  <tr key={p.id}>
                    <td className="mono">{p.employeeId}</td>
                    <td>{p.name}</td>
                    <td>{p.phone}</td>
                    <td>{p.status}</td>
                    <td>{p.loginEnabled ? 'OTP ready' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
