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

export default function PhlebotomistSchedule() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await phlebotomistService.listJobs();
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load schedule');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Loading schedule…</div>;

  const byDate = {};
  for (const j of jobs) {
    const key = j.collectionDate
      ? new Date(j.collectionDate).toISOString().slice(0, 10)
      : 'unscheduled';
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(j);
  }
  const dates = Object.keys(byDate).sort();

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>📅 Schedule</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px' }}>All assigned home collections by date</p>
      {error && <div style={{ color: '#b91c1c', fontSize: 13, marginBottom: 10 }}>{error}</div>}
      {dates.length === 0 && !error && (
        <div style={{ ...card, textAlign: 'center', color: '#94a3b8', padding: 24 }}>No scheduled collections.</div>
      )}
      {dates.map((d) => (
        <div key={d} style={{ marginBottom: 18 }}>
          <h3 style={{
            fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 8px',
            display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 6, lineHeight: 1.35,
          }}
          >
            <span>
              {d === 'unscheduled'
                ? 'Date TBD'
                : new Date(`${d}T12:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span style={{ fontWeight: 500, color: '#94a3b8' }}>({byDate[d].length})</span>
          </h3>
          {byDate[d].map((j) => (
            <Link key={j.id} to={`/phlebotomist/collections/${j.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={card}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{j.patientName}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{j.collectionTime || 'Time TBD'} · {j.testLabel}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, lineHeight: 1.4, wordBreak: 'break-word' }}>{j.address}</div>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
