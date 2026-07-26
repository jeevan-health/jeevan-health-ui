import { useEffect, useState } from 'react';
import { detectPwaSurface } from '../pwa/registerPwa.js';
import './pwa-install.css';

const LABELS = {
  patient: { name: 'Jeevan Healthcare', hint: 'Book tests & reports' },
  admin: { name: 'Jeevan Admin', hint: 'Ops on your home screen' },
  phlebo: { name: 'Jeevan Phlebo', hint: 'Duty & jobs offline-ready' },
};

/**
 * Soft install prompt — Android Chrome fires beforeinstallprompt;
 * iOS shows Add to Home Screen tip.
 */
export default function PwaInstallBanner() {
  const [deferred, setDeferred] = useState(null);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('pwa_install_dismiss') === '1';
    } catch {
      return false;
    }
  });
  const [iosTip, setIosTip] = useState(false);
  const surface = detectPwaSurface();
  const label = LABELS[surface] || LABELS.patient;

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS
      window.navigator.standalone === true;
    if (standalone) return;

    const onBip = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    window.addEventListener('beforeinstallprompt', onBip);

    const ua = navigator.userAgent || '';
    const isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    if (isIos && isSafari) setIosTip(true);

    return () => window.removeEventListener('beforeinstallprompt', onBip);
  }, []);

  if (dismissed) return null;
  if (!deferred && !iosTip) return null;

  const onInstall = async () => {
    if (!deferred) return;
    deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {
      /* ignore */
    }
    setDeferred(null);
  };

  const onClose = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('pwa_install_dismiss', '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="pwa-banner" role="region" aria-label="Install app">
      <div className="pwa-banner-text">
        <strong>Install {label.name}</strong>
        <span>
          {deferred
            ? `${label.hint} · works like an app`
            : 'Tap Share → Add to Home Screen'}
        </span>
      </div>
      <div className="pwa-banner-actions">
        {deferred ? (
          <button type="button" className="btn btn-primary pwa-btn" onClick={onInstall}>
            Install
          </button>
        ) : null}
        <button type="button" className="btn btn-outline-dark pwa-btn" onClick={onClose}>
          Not now
        </button>
      </div>
    </div>
  );
}
