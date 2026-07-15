import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
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

export default function PhlebotomistDashboard() {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [dash, setDash] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [meRes, dashRes] = await Promise.all([
        phlebotomistService.getMe(),
        phlebotomistService.getDashboard(),
      ]);
      setProfile(meRes.data);
      setDash(dashRes.data);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Could not load phlebotomist dashboard. Ensure your account is linked to a roster profile.');
      setDash(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleDuty = async () => {
    setBusy(true);
    try {
      const geo = await getGeo();
      if (dash?.duty?.active) {
        await phlebotomistService.endDuty(geo);
        notify.success('Duty ended');
      } else {
        await phlebotomistService.startDuty(geo);
        notify.success('Duty started — good luck today');
      }
      await load();
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Duty update failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading dashboard…</div>;
  }

  if (error) {
    return (
      <div style={{ ...card, borderColor: '#fecaca', background: '#fef2f2' }}>
        <div style={{ fontWeight: 700, color: '#b91c1c', marginBottom: 8 }}>Access issue</div>
        <p style={{ fontSize: 13, color: '#7f1d1d', margin: '0 0 12px' }}>{error}</p>
        <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
          Logged in as {user?.name || user?.phone}. Admin must hire/promote you and enable phone login.
        </p>
        <button type="button" onClick={load} style={{ marginTop: 12, padding: '8px 14px', borderRadius: 8, border: 'none', background: '#0d9488', color: '#fff', cursor: 'pointer' }}>Retry</button>
      </div>
    );
  }

  const stats = dash?.stats || {};
  const todayJobs = dash?.todayJobs || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
            👋 {profile?.name || user?.name || 'Phlebotomist'}
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
            {profile?.employeeId || '—'} · {profile?.areas || 'Areas TBD'} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={toggleDuty}
          style={{
            padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
            background: dash?.duty?.active ? '#dc2626' : '#059669', color: '#fff',
          }}
        >
          {busy ? '…' : dash?.duty?.active ? '⏹ End duty' : '▶ Start duty'}
        </button>
      </div>

      {dash?.duty?.active && (
        <div style={{ ...card, background: '#ecfdf5', borderColor: '#a7f3d0', fontSize: 13, color: '#065f46' }}>
          Duty active since {dash.duty.startedAt ? new Date(dash.duty.startedAt).toLocaleTimeString('en-IN') : '—'}
        </div>
      )}

      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: 16 }}>
        {[
          { label: "Today's jobs", value: stats.todayTotal ?? 0, color: '#0f172a' },
          { label: 'Pending', value: stats.todayPending ?? 0, color: '#d97706' },
          { label: 'Collected', value: stats.todayCompleted ?? 0, color: '#059669' },
          { label: 'Open assigned', value: stats.assignedOpen ?? 0, color: '#2563eb' },
        ].map((s) => (
          <div key={s.label} style={{ ...card, marginBottom: 0, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <Link to="/phlebotomist/collections" style={{ padding: '10px 14px', borderRadius: 10, background: '#0d9488', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>🧪 My collections</Link>
        <Link to="/phlebotomist/routes" style={{ padding: '10px 14px', borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0', color: '#0f172a', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>🗺️ Routes</Link>
        <Link to="/phlebotomist/schedule" style={{ padding: '10px 14px', borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0', color: '#0f172a', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>📅 Schedule</Link>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px' }}>Today&apos;s collections</h3>
      {todayJobs.length === 0 && (
        <div style={{ ...card, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No collections scheduled for today.</div>
      )}
      {todayJobs.map((j) => (
        <Link key={j.id} to={`/phlebotomist/collections/${j.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{j.patientName}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{j.testLabel}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                  🕘 {j.collectionTime || '—'} · 📍 {j.address}
                </div>
              </div>
              <span style={{
                alignSelf: 'flex-start', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                background: j.phleboStatus === 'sample_collected' ? '#dcfce7' : '#fef3c7',
                color: j.phleboStatus === 'sample_collected' ? '#166534' : '#92400e',
                textTransform: 'capitalize',
              }}
              >
                {(j.phleboStatus || j.orderStatus || 'pending').replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
