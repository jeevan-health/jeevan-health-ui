import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as phlebotomistService from '../../services/phlebotomistService';

const card = { background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', marginBottom: 12 };

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

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading schedule…</div>;

  // Group by date
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
      <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>📅 Schedule</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>All assigned home collections by date</p>
      {error && <div style={{ color: '#b91c1c', fontSize: 13 }}>{error}</div>}
      {dates.length === 0 && !error && (
        <div style={{ ...card, textAlign: 'center', color: '#94a3b8' }}>No scheduled collections.</div>
      )}
      {dates.map((d) => (
        <div key={d} style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
            {d === 'unscheduled' ? 'Date TBD' : new Date(d + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            <span style={{ fontWeight: 500, color: '#94a3b8', marginLeft: 8 }}>({byDate[d].length})</span>
          </h3>
          {byDate[d].map((j) => (
            <Link key={j.id} to={`/phlebotomist/collections/${j.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={card}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{j.patientName}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{j.collectionTime || 'Time TBD'} · {j.testLabel}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{j.address}</div>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
