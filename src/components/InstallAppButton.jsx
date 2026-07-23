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
  isIos,
  isAndroid,
} from '../lib/pwa';

/**
 * Compact install CTA for header / dashboard.
 * Hidden when already running as installed PWA.
 * Shows a step-by-step guide when native prompt is unavailable (common on iOS / first visit).
 */
export default function InstallAppButton({ variant = 'header', className = '' }) {
  const [ready, setReady] = useState(canInstallPwa());
  const [standalone, setStandalone] = useState(isStandalonePwa());
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => onInstallAvailability(setReady), []);
  useEffect(() => {
    setStandalone(isStandalonePwa());
  }, []);

  if (standalone) return null;

  const strategy = getInstallStrategy();

  const handleClick = async () => {
    setBusy(true);
    setHint('');
    try {
      if (isInAppBrowser()) {
        openInSystemBrowser();
        setHint('Open in Chrome, then tap Install.');
        setShowGuide(true);
        return;
      }
      if (!canInstallPwa()) {
        await waitForInstallPrompt(4000);
      }
      if (canInstallPwa()) {
        const res = await promptInstallPwa();
        if (res.ok) {
          setStandalone(true);
          setHint('App installed');
          setShowGuide(false);
          return;
        }
        if (res.outcome === 'dismissed') {
          setHint('Install cancelled — you can try again anytime');
          return;
        }
      }
      // Native prompt not available — show explicit guide (fixes “button does nothing”)
      setShowGuide(true);
      const s = getInstallStrategy();
      if (s.mode === 'ios_guide') {
        setHint('iPhone: use Share → Add to Home Screen');
      } else if (s.mode === 'android_guide') {
        setHint('Chrome menu ⋮ → Install app / Add to Home screen');
      } else {
        setHint('Use browser menu → Install app');
      }
    } finally {
      setBusy(false);
      setReady(canInstallPwa());
    }
  };

  const guideSteps = isIos()
    ? [
      'Tap the Share button (□↑) at the bottom of Safari',
      'Scroll and tap “Add to Home Screen”',
      'Tap Add — Jeevan opens like a normal app',
    ]
    : isAndroid()
      ? [
        'Tap the Chrome menu (⋮) at the top right',
        'Tap “Install app” or “Add to Home screen”',
        'Confirm Install — then open Jeevan from your home screen',
      ]
      : [
        'Open this site in Chrome or Edge',
        'Use the browser menu → Install Jeevan HealthCare',
        'Or look for the install icon in the address bar',
      ];

  const guideModal = showGuide ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="How to install Jeevan app"
      onClick={() => setShowGuide(false)}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 12000,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 400,
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>📲 Add Jeevan to your phone</h3>
          <button
            type="button"
            onClick={() => setShowGuide(false)}
            style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#64748b', lineHeight: 1 }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p style={{ margin: '0 0 12px', fontSize: 13, color: '#64748b', lineHeight: 1.45 }}>
          {strategy.hint || 'Install for faster access to lab reports and collection alerts.'}
        </p>
        <ol style={{ margin: '0 0 16px', paddingLeft: 18, fontSize: 13, color: '#0f172a', lineHeight: 1.55 }}>
          {guideSteps.map((step) => (
            <li key={step} style={{ marginBottom: 6 }}>{step}</li>
          ))}
        </ol>
        {canInstallPwa() && (
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', minHeight: 44, marginBottom: 8 }}
            onClick={async () => {
              const res = await promptInstallPwa();
              if (res.ok) {
                setStandalone(true);
                setShowGuide(false);
              }
            }}
          >
            Install now
          </button>
        )}
        {isInAppBrowser() && (
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', minHeight: 44, marginBottom: 8 }}
            onClick={() => openInSystemBrowser()}
          >
            Open in Chrome / Safari
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowGuide(false)}
          style={{
            width: '100%', minHeight: 40, borderRadius: 10, border: '1px solid #e2e8f0',
            background: '#fff', fontFamily: 'inherit', fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}
        >
          Got it
        </button>
      </div>
    </div>
  ) : null;

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
            maxWidth: 240,
          }}
          >
            {hint}
          </div>
        )}
        {guideModal}
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
      {guideModal}
    </div>
  );
}
