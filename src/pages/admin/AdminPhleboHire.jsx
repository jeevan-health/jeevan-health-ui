import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import { isAdminRole } from '../../utils/authRoles.js';
import {
  listApplications,
  updateApplication,
  promoteApplication,
  listRoster,
  resendAssessment,
  extendAssessment,
  overrideAssessment,
} from '../../services/phleboService.js';
import './admin-catalog.css';
import './admin-phlebo.css';
import './admin-orders.css';

function assessBadge(a) {
  const ass = a?.assessment;
  if (!ass) return { cls: 'assess-none', text: 'No assessment' };
  const st = ass.status;
  if (st === 'passed') {
    return {
      cls: 'assess-passed',
      text: `Passed ${ass.score != null ? `${ass.score}/${ass.maxScore || 50}` : ''}`.trim(),
    };
  }
  if (st === 'failed') {
    return {
      cls: 'assess-failed',
      text: `Failed ${ass.score != null ? `${ass.score}/${ass.maxScore || 50}` : ''}`.trim(),
    };
  }
  if (st === 'overridden') {
    const out = ass.resultDetail?.overrideOutcome || 'override';
    return { cls: 'assess-override', text: `Overridden (${out})` };
  }
  if (st === 'expired') return { cls: 'assess-expired', text: 'Expired' };
  return { cls: 'assess-pending', text: 'Assessment pending' };
}

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

  const onResend = async (id) => {
    setBusyId(id);
    setMsg(null);
    setError(null);
    try {
      const data = await resendAssessment(id);
      setMsg(
        data.emailQueued
          ? 'Assessment invite re-sent by email (new deadline).'
          : 'Assessment link refreshed (no email on file / queued).',
      );
      await loadApps();
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message);
    } finally {
      setBusyId(null);
    }
  };

  const onExtend = async (id) => {
    setBusyId(id);
    setMsg(null);
    try {
      await extendAssessment(id, 24);
      setMsg('Deadline extended by 24 hours');
      await loadApps();
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message);
    } finally {
      setBusyId(null);
    }
  };

  const onOverride = async (id, outcome) => {
    const note = window.prompt(
      outcome === 'waived'
        ? 'Note for waiving assessment (required for audit):'
        : outcome === 'passed'
          ? 'Note for override pass:'
          : 'Note for override fail:',
      '',
    );
    if (note === null) return;
    setBusyId(id);
    setMsg(null);
    try {
      await overrideAssessment(id, { outcome, note: note || null });
      setMsg(`Assessment overridden: ${outcome}`);
      await loadApps();
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
          <p>Applications · competency assessment · promote to roster</p>
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
              {apps.map((a) => {
                const badge = assessBadge(a);
                const canPromote = a.assessmentCanPromote || a.assessment?.canPromote;
                const ass = a.assessment;
                return (
                  <li key={a.id}>
                    <div>
                      <strong>{a.fullName}</strong>
                      <span className={`badge status-${a.status}`}>{a.status}</span>
                      <span className={`badge ${badge.cls}`}>{badge.text}</span>
                      <p>
                        {a.phone}
                        {a.email ? ` · ${a.email}` : ''}
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
                      {ass?.deadlineAt && ass.status === 'pending' && (
                        <p className="sub">
                          Assessment due{' '}
                          {new Date(ass.deadlineAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                      {ass?.band && (ass.status === 'passed' || ass.status === 'failed') && (
                        <p className="sub">Band: {ass.band.replace('_', ' ')}</p>
                      )}
                      {ass?.overrideNote && (
                        <p className="sub">Override note: {ass.overrideNote}</p>
                      )}
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
                            disabled={busyId === a.id || !canPromote}
                            title={
                              canPromote
                                ? 'Hire to roster'
                                : 'Requires passed assessment or admin override (waive/pass)'
                            }
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
                          {ass && (ass.status === 'pending' || ass.status === 'expired') && (
                            <>
                              <button
                                type="button"
                                className="btn btn-outline-dark btn-sm"
                                disabled={busyId === a.id}
                                onClick={() => onResend(a.id)}
                              >
                                Resend assessment
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-dark btn-sm"
                                disabled={busyId === a.id}
                                onClick={() => onExtend(a.id)}
                              >
                                +24h deadline
                              </button>
                            </>
                          )}
                          {ass && ass.status !== 'overridden' && a.status !== 'hired' && (
                            <>
                              <button
                                type="button"
                                className="btn btn-outline-dark btn-sm"
                                disabled={busyId === a.id}
                                onClick={() => onOverride(a.id, 'waived')}
                              >
                                Override waive
                              </button>
                              {ass.status === 'failed' && (
                                <button
                                  type="button"
                                  className="btn btn-outline-dark btn-sm"
                                  disabled={busyId === a.id}
                                  onClick={() => onOverride(a.id, 'passed')}
                                >
                                  Override pass
                                </button>
                              )}
                            </>
                          )}
                        </>
                      )}
                      {a.status === 'hired' && (
                        <span className="sub">On roster · login enabled</span>
                      )}
                    </div>
                  </li>
                );
              })}
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
