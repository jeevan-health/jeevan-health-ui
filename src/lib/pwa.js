/**
 * PWA install + service worker + web push helpers
 *
 * Install only works when:
 * - HTTPS
 * - Valid web app manifest (served as JSON, not SPA HTML)
 * - Service worker registered
 * - Icons 192 + 512
 * - Chrome/Edge fires `beforeinstallprompt` (not available on iOS Safari)
 */

let deferredInstallPrompt = null;
const installListeners = new Set();
let swRegistrationPromise = null;

export function initPwa() {
  if (typeof window === 'undefined') return;

  // Capture install event as early as possible
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    installListeners.forEach((fn) => fn(true));
    try {
      window.dispatchEvent(new CustomEvent('jeevan-pwa-installable'));
    } catch { /* ignore */ }
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installListeners.forEach((fn) => fn(false));
  });

  if ('serviceWorker' in navigator) {
    swRegistrationPromise = navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        // Nudge update so new SW activates after deploy
        try { reg.update(); } catch { /* ignore */ }
        return reg;
      })
      .catch((err) => {
        console.warn('SW register failed', err);
        return null;
      });
  }
}

export function getSwRegistration() {
  return swRegistrationPromise || Promise.resolve(null);
}

export function canInstallPwa() {
  return !!deferredInstallPrompt;
}

export function onInstallAvailability(fn) {
  installListeners.add(fn);
  fn(!!deferredInstallPrompt);
  return () => installListeners.delete(fn);
}

/**
 * Wait briefly for Chrome to become installable (SW + manifest criteria).
 * Returns true if native install prompt is available.
 */
export async function waitForInstallPrompt(timeoutMs = 8000) {
  if (deferredInstallPrompt) return true;
  if (isStandalonePwa()) return false;

  return new Promise((resolve) => {
    let done = false;
    const finish = (val) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', onPrompt);
      resolve(val);
    };
    const onPrompt = () => finish(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    const timer = setTimeout(() => finish(!!deferredInstallPrompt), timeoutMs);

    // Ensure SW is registered — helps installability
    getSwRegistration().then(() => {
      if (deferredInstallPrompt) finish(true);
    });
  });
}

/**
 * Trigger native install dialog when browser has offered beforeinstallprompt.
 */
export async function promptInstallPwa() {
  if (!deferredInstallPrompt) {
    // One more chance: wait a bit after SW is ready
    await waitForInstallPrompt(2500);
  }
  if (!deferredInstallPrompt) {
    return { ok: false, reason: 'not_available' };
  }
  try {
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installListeners.forEach((fn) => fn(false));
    return { ok: choice.outcome === 'accepted', outcome: choice.outcome };
  } catch (err) {
    return { ok: false, reason: 'error', error: err?.message };
  }
}

export function isStandalonePwa() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
  );
}

export function isIosSafari() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const webkit = /WebKit/.test(ua);
  const notChrome = !/CriOS|FxiOS|EdgiOS/.test(ua);
  return iOS && webkit && notChrome;
}

export function isAndroidChrome() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Android/i.test(ua) && /Chrome/i.test(ua) && !/EdgA|OPR|SamsungBrowser/i.test(ua);
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

/**
 * Subscribe current browser for Web Push (requires logged-in API calls).
 */
export async function subscribeWebPush(api) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { ok: false, reason: 'unsupported' };
  }
  // Ensure SW is ready first
  await getSwRegistration();
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return { ok: false, reason: 'denied' };
  }
  const reg = await navigator.serviceWorker.ready;
  const publicKey = await api.getVapidKey();
  if (!publicKey) return { ok: false, reason: 'no_vapid' };

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }
  await api.saveSubscription(sub.toJSON());
  return { ok: true, subscription: sub.toJSON() };
}

/**
 * One-tap camp flow: wait for installability → native install → notifications.
 */
export async function installAndEnablePush(api, { waitMs = 8000 } = {}) {
  const steps = { install: null, push: null };

  if (isStandalonePwa()) {
    steps.install = { ok: true, reason: 'already_installed' };
  } else if (isIosSafari()) {
    steps.install = { ok: false, reason: 'ios_manual' };
  } else {
    // Wait for Chrome to evaluate manifest + SW (often 1–5s after first visit)
    const ready = canInstallPwa() || await waitForInstallPrompt(waitMs);
    if (ready && canInstallPwa()) {
      steps.install = await promptInstallPwa();
    } else {
      steps.install = { ok: false, reason: 'not_available' };
    }
  }

  await new Promise((r) => setTimeout(r, steps.install?.ok ? 400 : 100));

  try {
    steps.push = await subscribeWebPush(api);
  } catch (err) {
    steps.push = { ok: false, reason: 'error', error: err?.message };
  }

  return steps;
}
