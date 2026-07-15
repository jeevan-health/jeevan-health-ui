import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as phlebotomistService from '../../services/phlebotomistService';

const card = { background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 12 };

export default function PhlebotomistRoutes() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const { data } = await phlebotomistService.listJobs({ date: today });
        // If no date filter match, show all open jobs ordered
        let list = data.jobs || [];
        if (list.length === 0) {
          const all = await phlebotomistService.listJobs();
          list = (all.data.jobs || []).filter((j) => j.phleboStatus !== 'sample_collected' && j.orderStatus !== 'completed');
        }
        setJobs(list);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load routes');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading route…</div>;

  const multiMaps = jobs
    .map((j) => j.address)
    .filter(Boolean)
    .slice(0, 10)
    .map(encodeURIComponent)
    .join('/');

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>🗺️ Today&apos;s route</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
        Ordered by collection date. Tap Navigate for turn-by-turn directions.
      </p>
      {error && <div style={{ color: '#b91c1c', fontSize: 13 }}>{error}</div>}
      {jobs.length > 1 && (
        <a
          href={`https://www.google.com/maps/dir/${multiMaps}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', marginBottom: 12, padding: '10px 14px', borderRadius: 10, background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}
        >
          Open multi-stop directions
        </a>
      )}
      {jobs.length === 0 && !error && (
        <div style={{ ...card, textAlign: 'center', color: '#94a3b8' }}>No stops for today.</div>
      )}
      {jobs.map((j, i) => (
        <div key={j.id} style={card}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: '#0d9488', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0,
            }}
            >
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{j.patientName}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{j.address}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{j.collectionTime || '—'} · {j.testLabel}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {j.mapsUrl && (
                  <a href={j.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>Navigate</a>
                )}
                <Link to={`/phlebotomist/collections/${j.id}`} style={{ fontSize: 12, fontWeight: 600, color: '#0d9488' }}>Open job</Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
