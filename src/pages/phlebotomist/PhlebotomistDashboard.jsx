import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
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
    return <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Loading dashboard…</div>;
  }

  if (error) {
    return (
      <div style={{ ...card, borderColor: '#fecaca', background: '#fef2f2' }}>
        <div style={{ fontWeight: 700, color: '#b91c1c', marginBottom: 8 }}>Access issue</div>
        <p style={{ fontSize: 13, color: '#7f1d1d', margin: '0 0 12px', lineHeight: 1.5 }}>{error}</p>
        <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.45 }}>
          Logged in as {user?.name || user?.phone}. Admin must hire/promote you and enable phone login.
        </p>
        <button
          type="button"
          onClick={load}
          style={{
            marginTop: 14, width: '100%', padding: '12px 14px', borderRadius: 10,
            border: 'none', background: '#0d9488', color: '#fff', cursor: 'pointer',
            fontWeight: 600, fontSize: 14, fontFamily: 'inherit', minHeight: 44,
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = dash?.stats || {};
  const todayJobs = dash?.todayJobs || [];

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', lineHeight: 1.25 }}>
          👋 {profile?.name || user?.name || 'Phlebotomist'}
        </h2>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px', lineHeight: 1.4, wordBreak: 'break-word' }}>
          {profile?.employeeId || '—'} · {profile?.areas || 'Areas TBD'} · {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={toggleDuty}
          style={{
            width: '100%',
            padding: '14px 18px',
            borderRadius: 12,
            border: 'none',
            cursor: busy ? 'wait' : 'pointer',
            fontWeight: 700,
            fontSize: 15,
            fontFamily: 'inherit',
            background: dash?.duty?.active ? '#dc2626' : '#059669',
            color: '#fff',
            minHeight: 48,
            boxShadow: dash?.duty?.active
              ? '0 2px 8px rgba(220,38,38,0.25)'
              : '0 2px 8px rgba(5,150,105,0.25)',
          }}
        >
          {busy ? '…' : dash?.duty?.active ? '⏹ End duty' : '▶ Start duty'}
        </button>
      </div>

      {dash?.duty?.active && (
        <div style={{ ...card, background: '#ecfdf5', borderColor: '#a7f3d0', fontSize: 13, color: '#065f46', fontWeight: 600 }}>
          Duty active since {dash.duty.startedAt ? new Date(dash.duty.startedAt).toLocaleTimeString('en-IN') : '—'}
        </div>
      )}

      <div style={{
        display: 'grid',
        gap: 8,
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        marginBottom: 14,
      }}
      >
        {[
          { label: "Today's jobs", value: stats.todayTotal ?? 0, color: '#0f172a' },
          { label: 'Pending', value: stats.todayPending ?? 0, color: '#d97706' },
          { label: 'Collected', value: stats.todayCompleted ?? 0, color: '#059669' },
          { label: 'Open assigned', value: stats.assignedOpen ?? 0, color: '#2563eb' },
        ].map((s) => (
          <div key={s.label} style={{ ...card, marginBottom: 0, textAlign: 'center', padding: '12px 8px' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, lineHeight: 1.2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr', marginBottom: 16 }}>
        <Link
          to="/phlebotomist/collections"
          style={{
            display: 'block', textAlign: 'center', padding: '12px 14px', borderRadius: 10,
            background: '#0d9488', color: '#fff', textDecoration: 'none', fontSize: 14,
            fontWeight: 700, minHeight: 44, boxSizing: 'border-box', lineHeight: '20px',
          }}
        >
          🧪 My collections
        </Link>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Link
            to="/phlebotomist/routes"
            style={{
              display: 'block', textAlign: 'center', padding: '12px 10px', borderRadius: 10,
              background: '#fff', border: '1px solid #e2e8f0', color: '#0f172a', textDecoration: 'none',
              fontSize: 13, fontWeight: 600, minHeight: 44, boxSizing: 'border-box',
            }}
          >
            🗺️ Routes
          </Link>
          <Link
            to="/phlebotomist/schedule"
            style={{
              display: 'block', textAlign: 'center', padding: '12px 10px', borderRadius: 10,
              background: '#fff', border: '1px solid #e2e8f0', color: '#0f172a', textDecoration: 'none',
              fontSize: 13, fontWeight: 600, minHeight: 44, boxSizing: 'border-box',
            }}
          >
            📅 Schedule
          </Link>
        </div>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>Today&apos;s collections</h3>
      {todayJobs.length === 0 && (
        <div style={{ ...card, textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 20 }}>
          No collections scheduled for today.
        </div>
      )}
      {todayJobs.map((j) => (
        <Link key={j.id} to={`/phlebotomist/collections/${j.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ ...card, WebkitTapHighlightColor: 'transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{j.patientName}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{j.testLabel}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, lineHeight: 1.4, wordBreak: 'break-word' }}>
                  🕘 {j.collectionTime || '—'} · 📍 {j.address}
                </div>
              </div>
              <span style={{
                flexShrink: 0, fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 6,
                background: j.phleboStatus === 'sample_collected' ? '#dcfce7' : '#fef3c7',
                color: j.phleboStatus === 'sample_collected' ? '#166534' : '#92400e',
                textTransform: 'capitalize', maxWidth: 96, textAlign: 'center', lineHeight: 1.2,
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
