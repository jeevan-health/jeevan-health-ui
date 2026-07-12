import { useEffect, useState } from 'react';
import {
  canInstallPwa,
  onInstallAvailability,
  isStandalonePwa,
  promptInstallPwa,
  waitForInstallPrompt,
  getInstallStrategy,
  openInSystemBrowser,
  isInAppBrowser,
} from '../lib/pwa';

/**
 * Compact install CTA for header / dashboard.
 * Hidden when already running as installed PWA.
 */
export default function InstallAppButton({ variant = 'header', className = '' }) {
  const [ready, setReady] = useState(canInstallPwa());
  const [standalone, setStandalone] = useState(isStandalonePwa());
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState('');

  useEffect(() => onInstallAvailability(setReady), []);
  useEffect(() => {
    setStandalone(isStandalonePwa());
  }, []);

  if (standalone) return null;

  const handleClick = async () => {
    setBusy(true);
    setHint('');
    try {
      if (isInAppBrowser()) {
        openInSystemBrowser();
        setHint('Open in Chrome, then install from the menu.');
        return;
      }
      if (!canInstallPwa()) {
        await waitForInstallPrompt(5000);
      }
      if (canInstallPwa()) {
        const res = await promptInstallPwa();
        if (res.ok) {
          setStandalone(true);
          setHint('App installed');
          return;
        }
        if (res.outcome === 'dismissed') {
          setHint('Install cancelled');
          return;
        }
      }
      const s = getInstallStrategy();
      if (s.mode === 'ios_guide') {
        setHint('iPhone: Share → Add to Home Screen');
      } else if (s.mode === 'android_guide') {
        setHint('Chrome menu ⋮ → Install app');
      } else {
        setHint('Use browser menu → Install app');
      }
    } finally {
      setBusy(false);
      setReady(canInstallPwa());
    }
  };

  if (variant === 'header') {
    return (
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={handleClick}
          disabled={busy}
          className={`hdr-btn hdr-install ${className}`}
          title="Install app"
          aria-label="Install Jeevan HealthCare app"
          style={{
            color: ready ? '#0F5DA8' : '#555',
            fontWeight: ready ? 700 : 500,
          }}
        >
          <span style={{ fontSize: 15, lineHeight: 1 }} aria-hidden>📲</span>
          <span className="hdr-label">App</span>
        </button>
        {hint && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 6,
            background: '#0f172a',
            color: '#fff',
            fontSize: 11,
            padding: '6px 10px',
            borderRadius: 8,
            whiteSpace: 'nowrap',
            zIndex: 50,
            maxWidth: 220,
          }}
          >
            {hint}
          </div>
        )}
      </div>
    );
  }

  // card / dashboard variant
  return (
    <div style={{
      padding: 12,
      borderRadius: 12,
      background: 'linear-gradient(135deg, #F0F7FF, #f0fdf4)',
      border: '1px solid #dbeafe',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
    }}
    >
      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>📲 Install Jeevan HealthCare</div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
          Faster access to lab reports & alerts
        </div>
        {hint && <div style={{ fontSize: 11, color: '#166534', marginTop: 4 }}>{hint}</div>}
      </div>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={handleClick}
        disabled={busy}
        style={{ minHeight: 40, whiteSpace: 'nowrap' }}
      >
        {busy ? '…' : ready ? 'Install app' : 'Add to phone'}
      </button>
    </div>
  );
}
