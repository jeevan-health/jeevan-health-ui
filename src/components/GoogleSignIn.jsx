import { useEffect, useRef, useState } from 'react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/**
 * Google Identity Services button. No-ops with a note if client id is missing.
 */
export default function GoogleSignIn({ onCredential, disabled }) {
  const btnRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!CLIENT_ID) return undefined;

    const init = () => {
      if (!window.google?.accounts?.id || !btnRef.current) return;
      try {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => {
            if (response?.credential) onCredential?.(response.credential);
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        btnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(btnRef.current, {
          theme: 'outline',
          size: 'large',
          width: btnRef.current.offsetWidth || 320,
          text: 'continue_with',
          shape: 'pill',
        });
        setReady(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Google init failed');
      }
    };

    if (window.google?.accounts?.id) {
      init();
      return undefined;
    }

    const existing = document.querySelector('script[data-google-gis]');
    if (existing) {
      existing.addEventListener('load', init);
      return () => existing.removeEventListener('load', init);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleGis = '1';
    script.onload = init;
    script.onerror = () => setError('Failed to load Google Sign-In');
    document.head.appendChild(script);
    return undefined;
  }, [onCredential]);

  if (!CLIENT_ID) {
    return (
      <p className="auth-muted" style={{ textAlign: 'center', fontSize: 13 }}>
        Google Sign-In will appear when <code>VITE_GOOGLE_CLIENT_ID</code> is set at build time.
      </p>
    );
  }

  return (
    <div>
      <div ref={btnRef} style={{ minHeight: 44, display: 'flex', justifyContent: 'center', opacity: disabled ? 0.5 : 1 }} />
      {error && <p className="auth-error">{error}</p>}
      {!ready && !error && (
        <p className="auth-muted" style={{ textAlign: 'center', fontSize: 13 }}>
          Loading Google…
        </p>
      )}
    </div>
  );
}
