/**
 * Shows once after another browser tab replaced the shared login session.
 * Same origin = one account at a time (localStorage).
 */
import { useEffect, useState } from 'react';
import { SESSION_SWITCH_KEY } from '../stores/authStore';

export default function SessionSwitchBanner() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_SWITCH_KEY);
      if (!raw) return;
      sessionStorage.removeItem(SESSION_SWITCH_KEY);
      const parsed = JSON.parse(raw);
      if (!parsed || Date.now() - (parsed.at || 0) > 60_000) return;
      setInfo(parsed);
      const t = setTimeout(() => setInfo(null), 9000);
      return () => clearTimeout(t);
    } catch {
      /* ignore */
    }
  }, []);

  if (!info) return null;

  const roleLabel = (info.role || 'user').replace(/_/g, ' ');

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        maxWidth: 'min(440px, calc(100vw - 24px))',
        background: '#0f172a',
        color: '#f8fafc',
        padding: '12px 16px',
        borderRadius: 12,
        boxShadow: '0 8px 28px rgba(15,23,42,0.28)',
        fontSize: 13,
        lineHeight: 1.45,
        fontFamily: 'inherit',
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Session updated in another tab</div>
      <div style={{ opacity: 0.92 }}>
        This browser is now signed in as <strong>{info.name}</strong>
        {' '}
        (
        {roleLabel}
        ). Only one account can be active at a time — use Incognito or a different browser for a second role.
      </div>
      <button
        type="button"
        onClick={() => setInfo(null)}
        style={{
          marginTop: 8,
          background: 'transparent',
          border: '1px solid rgba(248,250,252,0.35)',
          color: '#fff',
          borderRadius: 8,
          padding: '4px 10px',
          cursor: 'pointer',
          fontSize: 12,
          fontFamily: 'inherit',
        }}
      >
        Dismiss
      </button>
    </div>
  );
}
