import { useEffect, useState } from 'react';
import { detectPwaSurface } from '../pwa/registerPwa.js';
import {
  subscribeInstallPrompt,
  promptInstall,
  isStandaloneDisplay,
  isIosSafari,
} from '../pwa/installPrompt.js';
import './pwa-install.css';

const LABELS = {
  patient: { name: 'Jeevan Healthcare', hint: 'Book tests & reports' },
  admin: { name: 'Jeevan Admin', hint: 'Ops on your home screen' },
  phlebo: { name: 'Jeevan Phlebo', hint: 'Duty & jobs offline-ready' },
};

/**
 * Soft bottom banner only. Dismiss hides this strip for the session;
 * permanent Install buttons remain in headers via InstallAppButton.
 */
export default function PwaInstallBanner() {
  const [canPrompt, setCanPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('pwa_install_dismiss') === '1';
    } catch {
      return false;
    }
  });
  const [iosTip, setIosTip] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const surface = detectPwaSurface();
  const label = LABELS[surface] || LABELS.patient;

  useEffect(() => {
    setStandalone(isStandaloneDisplay());
    if (isIosSafari() && !isStandaloneDisplay()) setIosTip(true);
    return subscribeInstallPrompt((d) => setCanPrompt(Boolean(d)));
  }, []);

  if (standalone || dismissed) return null;
  if (!canPrompt && !iosTip) return null;

  const onInstall = async () => {
    if (canPrompt) await promptInstall();
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
          {canPrompt
            ? `${label.hint} · works like an app`
            : 'Tap Share → Add to Home Screen (or use Install app in the header)'}
        </span>
      </div>
      <div className="pwa-banner-actions">
        {canPrompt ? (
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
