import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore.js';
import { listMyReports, downloadReport, savePdfBase64 } from '../services/reportsService.js';
import './reports.css';

export default function Reports() {
  const { isAuthenticated } = useAuthStore();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReports(await listMyReports());
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) load();
  }, [isAuthenticated, load]);

  if (!isAuthenticated()) {
    return <Navigate to="/signup" replace state={{ from: '/reports' }} />;
  }

  const onDownload = async (id, fileName) => {
    setBusyId(id);
    setError(null);
    try {
      const data = await downloadReport(id);
      savePdfBase64(data.fileName || fileName, data.contentBase64);
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message || 'Download failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="reports-page">
      <div className="container">
        <header className="reports-head">
          <div>
            <h1>Lab reports</h1>
            <p className="muted">PDF reports emailed when ready · download anytime</p>
          </div>
          <Link to="/my-orders" className="btn btn-outline-dark">
            My orders
          </Link>
        </header>

        {error && <div className="reports-error">{error}</div>}
        {loading && <p className="muted">Loading reports…</p>}

        {!loading && !reports.length && (
          <div className="reports-empty">
            <p>No reports yet.</p>
            <p className="muted">After sample collection, reports appear here and in your email when the lab uploads them.</p>
            <Link to="/diagnostics" className="btn btn-primary">
              Book tests
            </Link>
          </div>
        )}

        <ul className="reports-list">
          {reports.map((r) => (
            <li key={r.id} className="reports-card">
              <div>
                <strong>{r.testLabel || r.fileName}</strong>
                <p className="muted">
                  {r.fileName}
                  {r.createdAt
                    ? ` · ${new Date(r.createdAt).toLocaleString('en-IN')}`
                    : ''}
                </p>
                {r.emailStatus ? (
                  <p className="sub">Email: {r.emailStatus}</p>
                ) : null}
              </div>
              <button
                type="button"
                className="btn btn-primary"
                disabled={busyId === r.id}
                onClick={() => onDownload(r.id, r.fileName)}
              >
                {busyId === r.id ? '…' : 'Download PDF'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
