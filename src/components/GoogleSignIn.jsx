import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { useT } from '../i18n/LanguageProvider';
import api from '../services/api';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignIn({ onError }) {
  const t = useT();
  const btnRef = useRef(null);
  const initialized = useRef(false);
  const navigate = useNavigate();
  const setUser = useAuthStore(s => s.setUser);

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
    try {
      const { data } = await api.post('/auth/google', {
        credential: response.credential,
      });

      const { user, accessToken, refreshToken } = data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('jh_token', accessToken);
      localStorage.setItem('jh_user', JSON.stringify(user));

      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      if (onError) onError(t('googleSignIn.failed', 'Google Sign-In failed. Please try again.'));
    }
  }

  if (!CLIENT_ID) return null;

  return (
    <div ref={btnRef} style={{ width: '100%', minHeight: 44, display: 'flex', justifyContent: 'center' }} />
  );
}
