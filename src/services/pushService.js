import api from './api.js';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export async function fetchVapidPublicKey() {
  const { data } = await api.get('/push/vapid-public-key');
  return data?.data || { configured: false, publicKey: null };
}

export function notificationPermission() {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission;
}

export async function getExistingPushSubscription() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

/**
 * Request permission, subscribe with VAPID, POST to API.
 * Returns { ok, status, message }
 */
export async function enablePushNotifications() {
  if (typeof window === 'undefined') {
    return { ok: false, status: 'ssr', message: 'Not in browser' };
  }
  if (!window.isSecureContext) {
    return { ok: false, status: 'insecure', message: 'Needs HTTPS or localhost' };
  }
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { ok: false, status: 'unsupported', message: 'Push not supported on this browser' };
  }
  if (typeof Notification === 'undefined') {
    return { ok: false, status: 'unsupported', message: 'Notifications not available' };
  }

  const vapid = await fetchVapidPublicKey();
  if (!vapid.publicKey) {
    return {
      ok: false,
      status: 'not_configured',
      message: 'Push keys not configured on server yet',
    };
  }

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }
  if (permission !== 'granted') {
    return {
      ok: false,
      status: 'denied',
      message: permission === 'denied' ? 'Notifications blocked in browser settings' : 'Permission not granted',
    };
  }

  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapid.publicKey),
    });
  }

  const json = sub.toJSON();
  await api.post('/push/subscribe', {
    origin: window.location.origin,
    endpoint: json.endpoint,
    keys: {
      p256dh: json.keys?.p256dh,
      auth: json.keys?.auth,
    },
  });

  try {
    localStorage.setItem('jh_push_enabled', '1');
  } catch {
    /* ignore */
  }

  return { ok: true, status: 'subscribed', message: 'Alerts enabled' };
}

export async function disablePushNotifications() {
  const sub = await getExistingPushSubscription();
  if (sub) {
    try {
      await api.post('/push/unsubscribe', { endpoint: sub.endpoint });
    } catch {
      /* still unsubscribe locally */
    }
    await sub.unsubscribe();
  }
  try {
    localStorage.removeItem('jh_push_enabled');
  } catch {
    /* ignore */
  }
  return { ok: true };
}
