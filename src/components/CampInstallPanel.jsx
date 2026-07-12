import { useEffect, useState } from 'react';
import {
  canInstallPwa,
  onInstallAvailability,
  isStandalonePwa,
  getInstallStrategy,
  openInSystemBrowser,
  promptInstallPwa,
  subscribeWebPush,
  waitForInstallPrompt,
} from '../lib/pwa';

/**
 * Camp-friendly install UX — never sounds broken.
 * Paths: native prompt | open Chrome (in-app) | iOS guide | Android guide | notifications.
 */
export default function CampInstallPanel({ pushApi, onDone }) {
  const [installReady, setInstallReady] = useState(canInstallPwa());
  const [strategy, setStrategy] = useState(() => getInstallStrategy());
  const [busy, setBusy] = useState(false);
  const [waitingNative, setWaitingNative] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [pushOn, setPushOn] = useState(false);
  const [installed, setInstalled] = useState(isStandalonePwa());

  // Keep strategy fresh when browser becomes installable
  useEffect(() => onInstallAvailability((ready) => {
    setInstallReady(ready);
    setStrategy(getInstallStrategy());
  }), []);

  // On mount: quietly wait for Chrome install prompt (no scary messages)
  useEffect(() => {
    if (installed || installReady) return undefined;
    let cancelled = false;
    setWaitingNative(true);
    waitForInstallPrompt(12000).then((ok) => {
      if (cancelled) return;
      setWaitingNative(false);
      if (ok) {
        setInstallReady(true);
        setStrategy(getInstallStrategy());
      }
    });
    return () => { cancelled = true; };
  }, [installed, installReady]);

  const refresh = () => {
    setInstalled(isStandalonePwa());
    setStrategy(getInstallStrategy());
    setInstallReady(canInstallPwa());
  };

  const enablePush = async () => {
    setError('');
    try {
      const res = await subscribeWebPush(pushApi);
      if (res.ok) {
        setPushOn(true);
        setStatus('You will get a notification when your report is ready.');
        onDone?.({ push: true });
        return true;
      }
      if (res.reason === 'denied') {
        setError('Notifications are blocked. Enable them in phone Settings → Apps → Chrome → Notifications.');
      } else if (res.reason === 'no_vapid') {
        setStatus('App ready. Email will still deliver your PDF report.');
      } else if (res.reason === 'unsupported') {
        setError('This browser cannot show notifications. You will still get the report by email.');
      } else {
        setError('Could not enable notifications. Email report will still work.');
      }
      return false;
    } catch {
      setError('Could not enable notifications. Email report will still work.');
      return false;
    }
  };

  const handlePrimary = async () => {
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const s = getInstallStrategy();
      setStrategy(s);

      // 1) In-app browser → open Chrome
      if (s.mode === 'open_chrome') {
        openInSystemBrowser();
        setStatus('Opening in Chrome… If nothing happens, open Chrome and visit this same link.');
        setShowGuide(true);
        return;
      }

      // 2) Native install available
      if (canInstallPwa() || s.mode === 'native') {
        if (!canInstallPwa()) {
          setWaitingNative(true);
          await waitForInstallPrompt(8000);
          setWaitingNative(false);
        }
        if (canInstallPwa()) {
          const inst = await promptInstallPwa();
          if (inst.ok || inst.outcome === 'accepted') {
            setInstalled(true);
            setStatus('App installed. Enabling alerts…');
            await enablePush();
            onDone?.({ installed: true });
            return;
          }
          if (inst.outcome === 'dismissed') {
            setStatus('No problem — you can still turn on alerts and get the report by email.');
            setShowGuide(true);
            return;
          }
        }
        // Fall through to friendly guide (not an error)
        setStrategy(getInstallStrategy().mode === 'native'
          ? { ...getInstallStrategy(), mode: 'android_guide', label: 'Add Jeevan to Home Screen', hint: 'Pin Jeevan to your home screen so reports open in one tap.' }
          : getInstallStrategy());
        setShowGuide(true);
        setStatus('Use the steps below to pin Jeevan to your phone — takes about 10 seconds.');
        return;
      }

      // 3) iOS / Android / desktop guides
      if (s.mode === 'ios_guide' || s.mode === 'android_guide' || s.mode === 'desktop_guide') {
        setShowGuide(true);
        setStatus(
          s.mode === 'ios_guide'
            ? 'Follow the 3 steps below (required on iPhone).'
            : 'Follow the steps below to add Jeevan to your home screen.'
        );
        return;
      }

      // 4) Already installed → push only
      if (s.mode === 'standalone') {
        await enablePush();
      }
    } finally {
      refresh();
      setBusy(false);
    }
  };

  const handlePushOnly = async () => {
    setBusy(true);
    setError('');
    try {
      await enablePush();
    } finally {
      setBusy(false);
    }
  };

  const primaryLabel = (() => {
    if (busy) return waitingNative ? 'Preparing…' : 'Working…';
    if (installed || strategy.mode === 'standalone') return '🔔 Enable report alerts';
    if (installReady) return '📲 Install Jeevan app';
    if (strategy.mode === 'open_chrome') return isAndroidLike(strategy) ? '🌐 Open in Chrome to install' : '🌐 Open in browser to install';
    if (strategy.mode === 'ios_guide') return '📲 Show Home Screen steps';
    return '📲 Add Jeevan to my phone';
  })();

  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'linear-gradient(135deg, #F0F7FF, #f0fdf4)', border: '1px solid #dbeafe' }}>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>
        📱 Get the app for report alerts
      </div>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px', lineHeight: 1.5 }}>
        {strategy.hint}
      </p>

      {waitingNative && !installReady && !showGuide && (
        <p style={{ fontSize: 11, color: '#1866C9', margin: '0 0 10px' }}>
          Preparing install on your phone…
        </p>
      )}

      {installReady && !installed && (
        <p style={{ fontSize: 11, color: '#166534', background: '#f0fdf4', padding: 8, borderRadius: 8, marginBottom: 10, fontWeight: 600 }}>
          Ready — tap below for the install popup.
        </p>
      )}

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={handlePrimary}
        disabled={busy}
        style={{ minHeight: 50, fontWeight: 700, fontSize: 15 }}
      >
        {primaryLabel}
      </button>

      {/* Friendly guided steps — intentional, not an error */}
      {showGuide && strategy.mode === 'ios_guide' && (
        <GuideCard title="iPhone — Add to Home Screen">
          <Step n={1} text="Tap the Share button at the bottom of Safari (square with ↑)." />
          <Step n={2} text="Scroll and tap “Add to Home Screen”." />
          <Step n={3} text="Tap Add. Open the new Jeevan icon, then tap “Enable report alerts” below." />
        </GuideCard>
      )}

      {showGuide && strategy.mode === 'android_guide' && (
        <GuideCard title="Android — Add to Home Screen">
          <Step n={1} text="Tap the menu ⋮ at the top-right of Chrome." />
          <Step n={2} text="Tap “Install app” or “Add to Home screen”." />
          <Step n={3} text="Confirm Install. Open the Jeevan icon, then enable alerts." />
        </GuideCard>
      )}

      {showGuide && strategy.mode === 'open_chrome' && (
        <GuideCard title="Almost there">
          <Step n={1} text="Tap “Open in Chrome” above (or menu → Open in Chrome / Browser)." />
          <Step n={2} text="In Chrome, sign in again if needed, then Install app." />
          <Step n={3} text="You will still get your lab report by email either way." />
        </GuideCard>
      )}

      {showGuide && strategy.mode === 'desktop_guide' && (
        <GuideCard title="Install on this computer">
          <Step n={1} text="In Chrome/Edge, open the browser menu or the install icon in the address bar." />
          <Step n={2} text="Choose “Install Jeevan HealthCare”." />
          <Step n={3} text="At the camp, patients should use their phone for the best experience." />
        </GuideCard>
      )}

      <button
        type="button"
        className="btn btn-outline btn-block"
        onClick={handlePushOnly}
        disabled={busy || pushOn}
        style={{ minHeight: 44, marginTop: 10 }}
      >
        {pushOn ? '✓ Alerts enabled' : '🔔 Enable report alerts (without waiting)'}
      </button>

      <p style={{ fontSize: 11, color: '#94a3b8', margin: '10px 0 0', lineHeight: 1.4, textAlign: 'center' }}>
        Your registration is already complete. Report PDF is always emailed — install is for faster alerts.
      </p>

      {status && (
        <p style={{ fontSize: 12, color: '#166534', margin: '10px 0 0', lineHeight: 1.4 }}>{status}</p>
      )}
      {error && (
        <p style={{ fontSize: 12, color: '#b91c1c', margin: '10px 0 0', lineHeight: 1.4 }}>{error}</p>
      )}
    </div>
  );
}

function isAndroidLike() {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '');
}

function GuideCard({ title, children }) {
  return (
    <div style={{
      marginTop: 12,
      padding: 12,
      borderRadius: 10,
      background: '#fff',
      border: '1px solid #e2e8f0',
    }}
    >
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#0f172a' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  );
}

function Step({ n, text }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span style={{
        flexShrink: 0,
        width: 22,
        height: 22,
        borderRadius: 999,
        background: '#1866C9',
        color: '#fff',
        fontSize: 12,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        {n}
      </span>
      <span style={{ fontSize: 12, color: '#475569', lineHeight: 1.45 }}>{text}</span>
    </div>
  );
}
