/**
 * PWA install + service worker + web push helpers
 */

let deferredInstallPrompt = null;
const installListeners = new Set();

export function initPwa() {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    installListeners.forEach((fn) => fn(true));
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installListeners.forEach((fn) => fn(false));
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW register failed', err);
      });
    });
  }
}

export function canInstallPwa() {
  return !!deferredInstallPrompt;
}

export function onInstallAvailability(fn) {
  installListeners.add(fn);
  fn(!!deferredInstallPrompt);
  return () => installListeners.delete(fn);
}

export async function promptInstallPwa() {
  if (!deferredInstallPrompt) {
    return { ok: false, reason: 'not_available' };
  }
  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installListeners.forEach((fn) => fn(false));
  return { ok: choice.outcome === 'accepted', outcome: choice.outcome };
}

export function isStandalonePwa() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
  );
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
 * @param {{ getVapidKey: () => Promise<string|null>, saveSubscription: (sub: PushSubscriptionJSON) => Promise<void> }} api
 */
export async function subscribeWebPush(api) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { ok: false, reason: 'unsupported' };
  }
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
