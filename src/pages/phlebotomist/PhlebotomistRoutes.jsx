import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as phlebotomistService from '../../services/phlebotomistService';

const card = {
  background: '#fff',
  borderRadius: 12,
  padding: 14,
  border: '1px solid #e2e8f0',
  marginBottom: 10,
  boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
};

export default function PhlebotomistRoutes() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const today = phlebotomistService.todayIST();
        const { data } = await phlebotomistService.listJobs({ date: today });
        let list = data.jobs || [];
        if (list.length === 0) {
          const all = await phlebotomistService.listJobs();
          list = (all.data.jobs || []).filter((j) =>
            !j.isTerminal
            && j.phleboStatus !== 'sample_collected'
            && j.orderStatus !== 'completed'
          );
        }
        setJobs(list);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load routes');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Loading route…</div>;

  const multiMaps = jobs
    .map((j) => j.address)
    .filter(Boolean)
    .slice(0, 10)
    .map(encodeURIComponent)
    .join('/');

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>🗺️ Today&apos;s route</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px', lineHeight: 1.4 }}>
        Ordered by collection date. Tap Navigate for turn-by-turn directions.
      </p>
      {error && <div style={{ color: '#b91c1c', fontSize: 13, marginBottom: 10 }}>{error}</div>}
      {jobs.length > 1 && (
        <a
          href={`https://www.google.com/maps/dir/${multiMaps}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block', textAlign: 'center', marginBottom: 12, padding: '14px 14px',
            borderRadius: 12, background: '#2563eb', color: '#fff', fontWeight: 700,
            fontSize: 14, textDecoration: 'none', minHeight: 48, boxSizing: 'border-box',
            boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
          }}
        >
          Open multi-stop directions
        </a>
      )}
      {jobs.length === 0 && !error && (
        <div style={{ ...card, textAlign: 'center', color: '#94a3b8', padding: 24 }}>No stops for today.</div>
      )}
      {jobs.map((j, i) => (
        <div key={j.id} style={card}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: '#0d9488', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
              fontSize: 13, flexShrink: 0,
            }}
            >
              {i + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{j.patientName}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2, lineHeight: 1.4, wordBreak: 'break-word' }}>{j.address}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{j.collectionTime || '—'} · {j.testLabel}</div>
              <div style={{ display: 'grid', gridTemplateColumns: j.mapsUrl ? '1fr 1fr' : '1fr', gap: 8, marginTop: 10 }}>
                {j.mapsUrl && (
                  <a
                    href={j.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block', textAlign: 'center', padding: '10px 8px', borderRadius: 10,
                      background: '#eff6ff', color: '#2563eb', fontSize: 13, fontWeight: 700,
                      textDecoration: 'none', minHeight: 40, boxSizing: 'border-box',
                    }}
                  >
                    Navigate
                  </a>
                )}
                <Link
                  to={`/phlebotomist/collections/${j.id}`}
                  style={{
                    display: 'block', textAlign: 'center', padding: '10px 8px', borderRadius: 10,
                    background: '#ecfdf5', color: '#0d9488', fontSize: 13, fontWeight: 700,
                    textDecoration: 'none', minHeight: 40, boxSizing: 'border-box',
                  }}
                >
                  Open job
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
