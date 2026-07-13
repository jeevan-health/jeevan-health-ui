import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { useT } from '../i18n/LanguageProvider';
import api from '../services/api';
import { getPostLoginPath } from '../utils/authRoles';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignIn({ onError }) {
  const t = useT();
  const btnRef = useRef(null);
  const initialized = useRef(false);
  const busyRef = useRef(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;
    if (initialized.current) return;
    if (typeof window.google?.accounts?.id === 'undefined') {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = initGIS;
      document.head.appendChild(s);
    } else {
      initGIS();
    }
    initialized.current = true;
  }, []);

  function initGIS() {
    if (!window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse,
      cancel_on_tap_outside: false,
      context: 'signin',
      ux_mode: 'popup',
    });
    if (btnRef.current) {
      window.google.accounts.id.renderButton(btnRef.current, {
        type: 'standard',
        shape: 'rectangular',
        theme: 'outline',
        text: 'continue_with',
        size: 'large',
        width: btnRef.current.offsetWidth || 328,
        logo_alignment: 'left',
      });
    }
  }

  async function handleCredentialResponse(response) {
    // Guard against double-submit while API + navigation run
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      const { data } = await api.post('/auth/google', {
        credential: response.credential,
      });

      const { user, accessToken, refreshToken } = data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('jh_token', accessToken);
      localStorage.setItem('jh_user', JSON.stringify(user));
      if (user?.id != null) localStorage.setItem('jh_auth_uid', String(user.id));

      setUser(user);
      // Keep overlay up until route change unmounts this page
      navigate(getPostLoginPath(user?.role), { replace: true });
    } catch (err) {
      busyRef.current = false;
      setBusy(false);
      if (onError) onError(t('googleSignIn.failed', 'Google Sign-In failed. Please try again.'));
    }
  }

  if (!CLIENT_ID) return null;

  return (
    <>
      {busy && (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 20000,
            background: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '28px 32px',
            maxWidth: 320,
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(15,23,42,0.2)',
          }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                margin: '0 auto 14px',
                border: '3px solid #dbeafe',
                borderTopColor: '#1866C9',
                borderRadius: '50%',
                animation: 'jhGoogleSpin 0.75s linear infinite',
              }}
            />
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', marginBottom: 6 }}>
              {t('googleSignIn.signingIn', 'Signing you in…')}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.45 }}>
              {t('googleSignIn.signingInHint', 'Please wait — opening your dashboard.')}
            </div>
          </div>
        </div>
      )}
      <div
        ref={btnRef}
        style={{
          width: '100%',
          minHeight: 44,
          display: 'flex',
          justifyContent: 'center',
          opacity: busy ? 0.45 : 1,
          pointerEvents: busy ? 'none' : 'auto',
        }}
      />
      <style>{`
        @keyframes jhGoogleSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
