import { useEffect, useState } from 'react';
import { detectPwaSurface } from '../pwa/registerPwa.js';
import {
  subscribeInstallPrompt,
  promptInstall,
  isStandaloneDisplay,
  isIosSafari,
} from '../pwa/installPrompt.js';
import './install-app-button.css';

const COPY = {
  patient: {
    label: 'Install app',
    title: 'Install Jeevan Healthcare',
    body: 'Add Jeevan Healthcare to your home screen for quick access to tests, orders, and reports.',
  },
  admin: {
    label: 'Install Admin app',
    title: 'Install Jeevan Admin',
    body: 'Add Jeevan Admin as an app for faster ops access (catalog, orders, phlebo, reports).',
  },
  phlebo: {
    label: 'Install Phlebo app',
    title: 'Install Jeevan Phlebo',
    body: 'Add Jeevan Phlebo to your home screen for duty, jobs, and field collections.',
  },
};

/**
 * Always-visible install entry (header / nav).
 * - Chromium: uses deferred beforeinstallprompt
 * - iOS / others: shows how-to modal (Add to Home Screen)
 * - Already installed (standalone): hidden
 */
export default function InstallAppButton({ variant = 'default', className = '' }) {
  const [canPrompt, setCanPrompt] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const surface = detectPwaSurface();
  const copy = COPY[surface] || COPY.patient;

  useEffect(() => {
    setStandalone(isStandaloneDisplay());
    return subscribeInstallPrompt((d) => setCanPrompt(Boolean(d)));
  }, []);

  if (standalone) return null;

  const onClick = async () => {
    if (canPrompt) {
      setBusy(true);
      const result = await promptInstall();
      setBusy(false);
      if (result === 'unavailable') setOpen(true);
      return;
    }
    // iOS / Firefox / no bip yet — show instructions
    setOpen(true);
  };

  const btnClass =
    variant === 'header'
      ? `install-app-btn install-app-btn--header ${className}`
      : variant === 'block'
        ? `btn btn-outline-dark install-app-btn install-app-btn--block ${className}`
        : `btn btn-outline-dark install-app-btn ${className}`;

  return (
    <>
      <button
        type="button"
        className={btnClass}
        onClick={onClick}
        disabled={busy}
        aria-label={copy.label}
        title={copy.label}
      >
        <span className="install-app-icon" aria-hidden>
          ⬇
        </span>
        <span className="install-app-label">{busy ? 'Opening…' : copy.label}</span>
      </button>

      {open && (
        <div className="install-modal-root" role="dialog" aria-modal="true" aria-labelledby="install-modal-title">
          <button type="button" className="install-modal-backdrop" aria-label="Close" onClick={() => setOpen(false)} />
          <div className="install-modal">
            <h2 id="install-modal-title">{copy.title}</h2>
            <p>{copy.body}</p>
            {isIosSafari() ? (
              <ol className="install-steps">
                <li>
                  Tap the <strong>Share</strong> button
                  <span className="install-share" aria-hidden>
                    ⎋
                  </span>{' '}
                  in Safari
                </li>
                <li>
                  Scroll and tap <strong>Add to Home Screen</strong>
                </li>
                <li>
                  Tap <strong>Add</strong> — look for the{' '}
                  {surface === 'admin' ? 'blue' : surface === 'phlebo' ? 'teal' : 'Jeevan'} app icon
                </li>
              </ol>
            ) : canPrompt ? (
              <p className="muted">Use the system install dialog that just opened, or try again.</p>
            ) : (
              <ol className="install-steps">
                <li>
                  Open the browser menu (⋮ or ⋯)
                </li>
                <li>
                  Tap <strong>Install app</strong> / <strong>Add to Home screen</strong>
                </li>
                <li>Confirm — this site installs as its own app with a unique icon</li>
              </ol>
            )}
            <div className="install-modal-actions">
              {canPrompt && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={async () => {
                    setBusy(true);
                    await promptInstall();
                    setBusy(false);
                    setOpen(false);
                  }}
                >
                  Install now
                </button>
              )}
              <button type="button" className="btn btn-outline-dark" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
