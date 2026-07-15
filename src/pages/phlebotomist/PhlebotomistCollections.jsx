import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import * as phlebotomistService from '../../services/phlebotomistService';
import { notify } from '../../lib/toastBus';

const card = { background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 12 };

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

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading…</div>;
  if (error && !job && orderId) {
    return (
      <div style={card}>
        <p style={{ color: '#b91c1c' }}>{error}</p>
        <button type="button" onClick={() => navigate('/phlebotomist/collections')}>← Back</button>
      </div>
    );
  }

  // Detail view
  if (orderId && job) {
    return (
      <div>
        <button type="button" onClick={() => navigate('/phlebotomist/collections')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: 12, fontFamily: 'inherit' }}>← All collections</button>
        <div style={card}>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>ORD-{job.id}</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: '4px 0' }}>{job.patientName}</h2>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>
            {[job.patientAge != null ? `${job.patientAge} yrs` : null, job.patientGender, job.patientPhone].filter(Boolean).join(' · ')}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{job.testLabel}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>📅 {job.collectionDate ? new Date(job.collectionDate).toLocaleDateString('en-IN') : '—'} · 🕘 {job.collectionTime || '—'}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>📍 {job.address}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0d9488', marginBottom: 12, textTransform: 'capitalize' }}>
            Status: {(job.phleboStatus || job.orderStatus || '—').replace(/_/g, ' ')}
          </div>
          {job.mapsUrl && (
            <a href={job.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginBottom: 12, padding: '8px 12px', borderRadius: 8, background: '#eff6ff', color: '#1d4ed8', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
              🗺️ Navigate in Google Maps
            </a>
          )}
          {job.patientPhone && (
            <a href={`tel:${job.patientPhone}`} style={{ display: 'inline-block', marginLeft: 8, marginBottom: 12, padding: '8px 12px', borderRadius: 8, background: '#f0fdf4', color: '#166534', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
              📞 Call patient
            </a>
          )}
        </div>

        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>Sample details (for collection)</h3>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr', marginBottom: 8 }}>
            <input placeholder="Sample type" value={sample.sampleType} onChange={(e) => setSample((s) => ({ ...s, sampleType: e.target.value }))} style={{ padding: 8, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <input placeholder="Tube type (e.g. Purple EDTA)" value={sample.tubeType} onChange={(e) => setSample((s) => ({ ...s, tubeType: e.target.value }))} style={{ padding: 8, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <input placeholder="Barcode" value={sample.barcode} onChange={(e) => setSample((s) => ({ ...s, barcode: e.target.value }))} style={{ padding: 8, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, gridColumn: '1 / -1' }} />
          </div>
          <textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '100%', minHeight: 56, padding: 8, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </div>

        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 10px' }}>Update status</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {phlebotomistService.JOB_STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                disabled={busy}
                onClick={() => setStatus(s.value)}
                style={{
                  padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  background: job.phleboStatus === s.value ? '#0d9488' : '#fff',
                  color: job.phleboStatus === s.value ? '#fff' : '#334155',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {job.events?.length > 0 && (
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>Timeline</h3>
            {job.events.map((e) => (
              <div key={e.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9', color: '#475569' }}>
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
      <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>🧪 My collections</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{jobs.length} assigned job(s)</p>
      {error && <div style={{ color: '#b91c1c', fontSize: 13, marginBottom: 12 }}>{error}</div>}
      {jobs.length === 0 && !error && (
        <div style={{ ...card, textAlign: 'center', color: '#94a3b8' }}>No jobs assigned yet. Admin assigns diagnostic orders to you.</div>
      )}
      {jobs.map((j) => (
        <Link key={j.id} to={`/phlebotomist/collections/${j.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{j.patientName}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{j.testLabel}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                  ORD-{j.id} · {j.collectionDate ? new Date(j.collectionDate).toLocaleDateString('en-IN') : '—'} {j.collectionTime || ''}
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'capitalize', color: '#0d9488' }}>
                {(j.phleboStatus || j.orderStatus || '').replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
