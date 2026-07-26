/**
 * Host-aware PWA bootstrap: pick manifest + theme by hostname, register SW.
 * Three installable apps from one SPA (patient / admin / phlebo origins).
 */
import { captureInstallPrompt } from './installPrompt.js';

export function detectPwaSurface(hostname = typeof window !== 'undefined' ? window.location.hostname : '') {
  const h = String(hostname || '').toLowerCase();
  if (h === 'admin.jeevanhealthcare.com' || h.startsWith('admin.')) return 'admin';
  if (h === 'phlebo.jeevanhealthcare.com' || h.startsWith('phlebo.')) return 'phlebo';
  return 'patient';
}

const SURFACE = {
  patient: {
    manifest: '/manifests/patient.webmanifest',
    theme: '#1866C9',
    appleIcon: '/icons/patient-192.png',
    title: 'Jeevan Healthcare',
  },
  admin: {
    manifest: '/manifests/admin.webmanifest',
    theme: '#0F4A96',
    appleIcon: '/icons/admin-192.png',
    title: 'Jeevan Admin',
  },
  phlebo: {
    manifest: '/manifests/phlebo.webmanifest',
    theme: '#0D9488',
    appleIcon: '/icons/phlebo-192.png',
    title: 'Jeevan Phlebo',
  },
};

export function applyHostPwaMeta() {
  if (typeof document === 'undefined') return detectPwaSurface();
  const surface = detectPwaSurface();
  const cfg = SURFACE[surface];

  let link = document.querySelector('link[rel="manifest"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'manifest';
    document.head.appendChild(link);
  }
  link.href = cfg.manifest;

  let theme = document.querySelector('meta[name="theme-color"]');
  if (!theme) {
    theme = document.createElement('meta');
    theme.name = 'theme-color';
    document.head.appendChild(theme);
  }
  theme.content = cfg.theme;

  let apple = document.querySelector('link[rel="apple-touch-icon"]');
  if (!apple) {
    apple = document.createElement('link');
    apple.rel = 'apple-touch-icon';
    document.head.appendChild(apple);
  }
  apple.href = cfg.appleIcon;

  // Keep document title brand-aligned when landing as PWA
  if (!document.title || document.title.includes('Complete Healthcare')) {
    if (surface === 'admin') document.title = 'Jeevan Admin';
    else if (surface === 'phlebo') document.title = 'Jeevan Phlebo';
    else document.title = 'Jeevan Healthcare';
  }

  document.documentElement.dataset.pwaSurface = surface;
  return surface;
}

export async function registerServiceWorker() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  // Only secure contexts (https / localhost)
  if (!window.isSecureContext) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    return reg;
  } catch (e) {
    console.warn('[pwa] SW register failed', e);
    return null;
  }
}

export function initPwa() {
  const surface = applyHostPwaMeta();
  // Capture install prompt early so Install buttons work even after banner dismiss
  captureInstallPrompt();
  registerServiceWorker();
  return surface;
}
