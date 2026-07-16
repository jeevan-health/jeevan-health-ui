import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import * as phlebotomistService from '../../services/phlebotomistService';
import { notify } from '../../lib/toastBus';

const card = {
  background: '#fff',
  borderRadius: 12,
  padding: 14,
  border: '1px solid #e2e8f0',
  marginBottom: 10,
  boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
};

const field = {
  width: '100%',
  padding: '12px 12px',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  fontSize: 16, // prevents iOS zoom
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  background: '#fff',
};

function getGeo() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve({});
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve({}),
      { timeout: 8000 }
    );
  });
}

export default function PhlebotomistCollections() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState('');
  const [sample, setSample] = useState({ tubeType: '', barcode: '', sampleType: 'Blood' });

  const loadList = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await phlebotomistService.listJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadJob = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await phlebotomistService.getJob(id);
      setJob(data.job);
    } catch (err) {
      setError(err?.response?.data?.error || 'Job not found');
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (orderId) loadJob(orderId);
    else loadList();
  }, [orderId, loadJob, loadList]);

  const setStatus = async (status) => {
    if (!job) return;
    setBusy(true);
    try {
      const geo = await getGeo();
      const body = {
        status,
        ...geo,
        notes: notes || undefined,
        sampleData: status === 'sample_collected' ? sample : undefined,
      };
      const { data } = await phlebotomistService.updateJobStatus(job.id, body);
      setJob(data.job);
      notify.success(`Updated → ${status.replace(/_/g, ' ')}`);
      setNotes('');
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Update failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Loading…</div>;
  if (error && !job && orderId) {
    return (
      <div style={card}>
        <p style={{ color: '#b91c1c', margin: '0 0 12px' }}>{error}</p>
        <button
          type="button"
          onClick={() => navigate('/phlebotomist/collections')}
          style={{
            width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #e2e8f0',
            background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, minHeight: 44,
          }}
        >
          ← Back to list
        </button>
      </div>
    );
  }

  // Detail view
  if (orderId && job) {
    const statuses = phlebotomistService.JOB_STATUSES || [];
    return (
      <div>
        <button
          type="button"
          onClick={() => navigate('/phlebotomist/collections')}
          style={{
            background: '#fff', border: '1px solid #e2e8f0', color: '#475569', cursor: 'pointer',
            marginBottom: 12, fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            padding: '10px 14px', borderRadius: 10, minHeight: 40,
          }}
        >
          ← All collections
        </button>

        <div style={card}>
          <div style={{ fontSize: 11, color: '#94a3b8', letterSpacing: 0.3 }}>ORD-{job.id}</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: '4px 0 6px', color: '#0f172a', lineHeight: 1.25 }}>
            {job.patientName}
          </h2>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10, lineHeight: 1.4 }}>
            {[job.patientAge != null ? `${job.patientAge} yrs` : null, job.patientGender, job.patientPhone].filter(Boolean).join(' · ')}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#0f172a' }}>{job.testLabel}</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>
            📅 {job.collectionDate ? new Date(job.collectionDate).toLocaleDateString('en-IN') : '—'} · 🕘 {job.collectionTime || '—'}
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10, lineHeight: 1.45, wordBreak: 'break-word' }}>
            📍 {job.address}
          </div>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#0f766e',
            background: '#ecfdf5', padding: '4px 10px', borderRadius: 999, textTransform: 'capitalize',
            marginBottom: 12,
          }}
          >
            {(job.phleboStatus || job.orderStatus || '—').replace(/_/g, ' ')}
          </div>

          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr' }}>
            {job.mapsUrl && (
              <a
                href={job.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', textAlign: 'center', padding: '14px 12px', borderRadius: 10,
                  background: '#eff6ff', color: '#1d4ed8', fontSize: 14, fontWeight: 700,
                  textDecoration: 'none', minHeight: 48, boxSizing: 'border-box',
                }}
              >
                🗺️ Navigate in Google Maps
              </a>
            )}
            {job.patientPhone && (
              <a
                href={`tel:${job.patientPhone}`}
                style={{
                  display: 'block', textAlign: 'center', padding: '14px 12px', borderRadius: 10,
                  background: '#f0fdf4', color: '#166534', fontSize: 14, fontWeight: 700,
                  textDecoration: 'none', minHeight: 48, boxSizing: 'border-box',
                }}
              >
                📞 Call patient
              </a>
            )}
          </div>
        </div>

        <div style={card}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>Sample details</h3>
          <div style={{ display: 'grid', gap: 10, marginBottom: 10 }}>
            <input
              placeholder="Sample type"
              value={sample.sampleType}
              onChange={(e) => setSample((s) => ({ ...s, sampleType: e.target.value }))}
              style={field}
            />
            <input
              placeholder="Tube type (e.g. Purple EDTA)"
              value={sample.tubeType}
              onChange={(e) => setSample((s) => ({ ...s, tubeType: e.target.value }))}
              style={field}
            />
            <input
              placeholder="Barcode"
              value={sample.barcode}
              onChange={(e) => setSample((s) => ({ ...s, barcode: e.target.value }))}
              style={field}
            />
            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ ...field, minHeight: 72, resize: 'vertical' }}
            />
          </div>
        </div>

        <div style={card}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>Update status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {statuses.map((s) => {
              const active = job.phleboStatus === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  disabled={busy}
                  onClick={() => setStatus(s.value)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: 10,
                    border: active ? 'none' : '1px solid #e2e8f0',
                    cursor: busy ? 'wait' : 'pointer',
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    background: active ? '#0d9488' : '#fff',
                    color: active ? '#fff' : '#334155',
                    minHeight: 48,
                    lineHeight: 1.25,
                    gridColumn: s.value === 'sample_collected' || s.value === 'failed' || s.value === 'cancelled' ? '1 / -1' : undefined,
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {job.events?.length > 0 && (
          <div style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>Timeline</h3>
            {job.events.map((e) => (
              <div key={e.id} style={{ fontSize: 12, padding: '8px 0', borderBottom: '1px solid #f1f5f9', color: '#475569', lineHeight: 1.4 }}>
                <strong style={{ textTransform: 'capitalize' }}>{e.status.replace(/_/g, ' ')}</strong>
                {' · '}
                {e.createdAt ? new Date(e.createdAt).toLocaleString('en-IN') : ''}
                {e.notes ? ` — ${e.notes}` : ''}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // List
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>🧪 My collections</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px' }}>{jobs.length} assigned job(s)</p>
      {error && <div style={{ color: '#b91c1c', fontSize: 13, marginBottom: 12 }}>{error}</div>}
      {jobs.length === 0 && !error && (
        <div style={{ ...card, textAlign: 'center', color: '#94a3b8', padding: 24 }}>
          No jobs assigned yet. Admin assigns diagnostic orders to you.
        </div>
      )}
      {jobs.map((j) => (
        <Link key={j.id} to={`/phlebotomist/collections/${j.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{j.patientName}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{j.testLabel}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
                  ORD-{j.id} · {j.collectionDate ? new Date(j.collectionDate).toLocaleDateString('en-IN') : '—'} {j.collectionTime || ''}
                </div>
              </div>
              <span style={{
                flexShrink: 0, fontSize: 10, fontWeight: 700, textTransform: 'capitalize',
                color: '#0d9488', background: '#ecfdf5', padding: '4px 8px', borderRadius: 6,
                maxWidth: 90, textAlign: 'center', lineHeight: 1.2,
              }}
              >
                {(j.phleboStatus || j.orderStatus || '').replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
