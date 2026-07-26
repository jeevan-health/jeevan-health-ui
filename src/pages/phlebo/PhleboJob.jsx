import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import { isPhleboRole, isAdminRole } from '../../utils/authRoles.js';
import { getPhleboJob, updatePhleboJobStatus } from '../../services/phleboService.js';
import { formatInr } from '../../services/ordersService.js';
import './phlebo-portal.css';

const ACTION_LABEL = {
  accepted: 'Accept job',
  reached: 'Mark reached',
  patient_verified: 'Verify patient',
  sample_collected: 'Sample collected',
  sample_rejected: 'Reject sample',
  failed: 'Mark failed',
  cancelled: 'Cancel job',
};

export default function PhleboJob() {
  const { orderId } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [job, setJob] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [barcode, setBarcode] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPhleboJob(orderId);
      setJob(data.job);
      setEvents(data.events || []);
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (isAuthenticated()) load();
  }, [isAuthenticated, load]);

  if (!isAuthenticated()) return <Navigate to="/phlebo/login" replace />;
  if (!isPhleboRole(user?.role) && !isAdminRole(user?.role)) {
    return <Navigate to="/phlebo/login" replace />;
  }

  const onAdvance = async (status) => {
    setBusy(true);
    setError(null);
    try {
      const payload = { status, notes: notes || null, sampleData: {} };
      if (status === 'patient_verified') {
        payload.sampleData.verification = { phoneLast4: phoneLast4 || undefined };
        payload.verification = { phoneLast4 };
      }
      if (status === 'sample_collected') {
        payload.sampleData.barcode = barcode || undefined;
        payload.sampleData.sampleType = 'Blood';
      }
      const updated = await updatePhleboJobStatus(orderId, payload);
      setJob(updated);
      setNotes('');
      setBarcode('');
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
          <Link to="/phlebo" className="phlebo-brand">
            ← Jobs
          </Link>
        </div>
      </header>

      <main className="container phlebo-dash-main">
        {loading && <p className="muted">Loading job…</p>}
        {error && <div className="phlebo-error">{error}</div>}

        {job && (
          <>
            <p className="phlebo-eyebrow">Job detail</p>
            <h1 className="code">{job.orderCode}</h1>
            <p>
              <span className={`badge ph-${job.phleboStatus}`}>{job.phleboStatus}</span>
              {' · '}
              order {job.status}
            </p>

            <div className="phlebo-card">
              <h2>Patient</h2>
              <p>
                <strong>{job.patientName}</strong>
                {job.patientAge != null ? ` · ${job.patientAge} yrs` : ''}
                {job.patientGender ? ` · ${job.patientGender}` : ''}
              </p>
              <p className="sub">{job.patientPhone}</p>
              <p>
                {job.addressLine1}
                {job.landmark ? `, ${job.landmark}` : ''}
                <br />
                {job.city}
                {job.pincode ? ` ${job.pincode}` : ''}
              </p>
              <p className="sub">
                {job.collectionDate || 'Date TBC'}
                {job.collectionSlot ? ` · ${job.collectionSlot}` : ''}
              </p>
            </div>

            <div className="phlebo-card">
              <h2>Tests · {formatInr(job.total)}</h2>
              <ul className="phlebo-tests">
                {(job.items || []).map((it) => (
                  <li key={it.id}>
                    {it.testName} <em>{it.jhcCode}</em> ×{it.quantity}
                  </li>
                ))}
              </ul>
              <p className="sub">Payment: {job.paymentMode} / {job.paymentStatus}</p>
            </div>

            {!job.terminal && (
              <div className="phlebo-card">
                <h2>Update status</h2>
                <label>
                  Notes / reason
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Required for fail / reject / cancel"
                  />
                </label>
                {(job.allowedNext || []).includes('patient_verified') && (
                  <label>
                    Patient phone last 4 (optional verify)
                    <input
                      value={phoneLast4}
                      onChange={(e) => setPhoneLast4(e.target.value)}
                      maxLength={4}
                      inputMode="numeric"
                    />
                  </label>
                )}
                {(job.allowedNext || []).includes('sample_collected') && (
                  <label>
                    Sample barcode (or reason in notes)
                    <input value={barcode} onChange={(e) => setBarcode(e.target.value)} />
                  </label>
                )}
                <div className="phlebo-actions">
                  {(job.allowedNext || []).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={
                        s === 'failed' || s === 'cancelled' || s === 'sample_rejected'
                          ? 'btn btn-outline-dark'
                          : 'btn btn-primary'
                      }
                      disabled={busy}
                      onClick={() => onAdvance(s)}
                    >
                      {ACTION_LABEL[s] || s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {job.terminal && (
              <div className="phlebo-card">
                <p>Job closed ({job.phleboStatus}).</p>
              </div>
            )}

            {events.length > 0 && (
              <div className="phlebo-card">
                <h2>Timeline</h2>
                <ul className="phlebo-timeline">
                  {events.map((e) => (
                    <li key={e.id}>
                      <strong>{e.status}</strong>
                      <span className="sub">
                        {e.createdAt
                          ? new Date(e.createdAt).toLocaleString('en-IN')
                          : ''}
                      </span>
                      {e.notes ? <p className="sub">{e.notes}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
