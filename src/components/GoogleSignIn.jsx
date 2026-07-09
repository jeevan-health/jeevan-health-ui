import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const CLIENT_ID = '9700104108-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com';

export default function GoogleSignIn({ onError }) {
  const btnRef = useRef(null);
  const initialized = useRef(false);
  const navigate = useNavigate();
  const setUser = useAuthStore(s => s.setUser);

  useEffect(() => {
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
      const payload = parseJwt(response.credential);
      const user = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        phone: '',
        avatar: payload.picture,
        provider: 'google',
      };
      localStorage.setItem('jh_token', response.credential);
      localStorage.setItem('jh_user', JSON.stringify(user));
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      if (onError) onError('Google Sign-In failed. Please try again.');
    }
  }

  return (
    <div ref={btnRef} style={{ width: '100%', minHeight: 44, display: 'flex', justifyContent: 'center' }} />
  );
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
  return JSON.parse(jsonPayload);
}
