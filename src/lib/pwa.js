/**
 * PWA install + service worker + web push helpers
 *
 * Real-world camp note:
 * - Native install dialog ONLY on Chromium after beforeinstallprompt
 * - iOS Safari: Add to Home Screen only (no API)
 * - Camera / WhatsApp / Instagram in-app browsers: almost never installable — open Chrome
 */

let deferredInstallPrompt = null;
const installListeners = new Set();
let swRegistrationPromise = null;

export function initPwa() {
  if (typeof window === 'undefined') return;

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

export async function waitForInstallPrompt(timeoutMs = 12000) {
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
    getSwRegistration().then(() => {
      if (deferredInstallPrompt) finish(true);
    });
  });
}

export async function promptInstallPwa() {
  if (!deferredInstallPrompt) {
    await waitForInstallPrompt(3000);
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

export function isIos() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(ua)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function isIosSafari() {
  if (!isIos()) return false;
  const ua = navigator.userAgent || '';
  const webkit = /WebKit/.test(ua);
  const notOther = !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(ua);
  return webkit && notOther;
}

export function isAndroid() {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '');
}

export function isAndroidChrome() {
  if (!isAndroid()) return false;
  const ua = navigator.userAgent || '';
  return /Chrome/i.test(ua) && !/EdgA|OPR|SamsungBrowser|UCBrowser|YaBrowser/i.test(ua);
}

/** WhatsApp / Instagram / Facebook / etc. — PWA install almost never works here */
export function isInAppBrowser() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  if (/FBAN|FBAV|FB_IAB|Instagram|Line\/|LinkedInApp|Twitter|MicroMessenger|Snapchat|Pinterest|TikTok|Bytedance|musical_ly|GSA\/|WhatsApp/i.test(ua)) {
    return true;
  }
  // Android WebView
  if (isAndroid() && /(\bwv\b|; wv\)|Version\/[\d.]+.*Chrome\/[.0-9]* Mobile)/i.test(ua) && !/Chrome\/[.0-9]+ Mobile Safari/i.test(ua)) {
    // many WebViews still claim Chrome — wv token is the signal
    if (/\bwv\b/.test(ua)) return true;
  }
  return false;
}

/**
 * Best install strategy for current browser (for camp UX).
 * @returns {{
 *   mode: 'standalone'|'native'|'open_chrome'|'ios_guide'|'android_guide'|'desktop_guide',
 *   canNativeInstall: boolean,
 *   label: string,
 *   hint: string
 * }}
 */
export function getInstallStrategy() {
  if (isStandalonePwa()) {
    return {
      mode: 'standalone',
      canNativeInstall: false,
      label: 'Enable report alerts',
      hint: 'App is installed. Turn on notifications so we can tell you when the lab report is ready.',
    };
  }
  if (isInAppBrowser()) {
    return {
      mode: 'open_chrome',
      canNativeInstall: false,
      label: isAndroid() ? 'Open in Chrome' : 'Open in Safari / Chrome',
      hint: 'You opened this inside another app. Install works best in Chrome (Android) or Safari (iPhone).',
    };
  }
  if (isIos()) {
    return {
      mode: 'ios_guide',
      canNativeInstall: false,
      label: 'Add Jeevan to Home Screen',
      hint: 'On iPhone, apps are added from the Share menu (Apple does not allow a direct install button).',
    };
  }
  if (canInstallPwa()) {
    return {
      mode: 'native',
      canNativeInstall: true,
      label: 'Install Jeevan app',
      hint: 'One tap installs Jeevan on your phone like a normal app.',
    };
  }
  if (isAndroid()) {
    return {
      mode: 'android_guide',
      canNativeInstall: false,
      label: 'Add Jeevan to Home Screen',
      hint: 'Pin Jeevan to your home screen so reports open in one tap.',
    };
  }
  return {
    mode: 'desktop_guide',
    canNativeInstall: false,
    label: 'Install Jeevan',
    hint: 'Install from the browser menu, or continue on your phone for the best camp experience.',
  };
}

/**
 * Open current page in system Chrome (Android Intent). Critical when QR opens in-app WebView.
 */
export function openInSystemBrowser() {
  if (typeof window === 'undefined') return { ok: false };
  const href = window.location.href;
  if (isAndroid()) {
    const withoutScheme = href.replace(/^https?:\/\//i, '');
    const intentUrl =
      `intent://${withoutScheme}#Intent;scheme=https;package=com.android.chrome;`
      + `S.browser_fallback_url=${encodeURIComponent(href)};end`;
    window.location.href = intentUrl;
    return { ok: true, method: 'android_intent' };
  }
  // iOS / desktop — try opening in new window; user may need to use "Open in Safari"
  try {
    window.open(href, '_blank', 'noopener,noreferrer');
    return { ok: true, method: 'window_open' };
  } catch {
    return { ok: false };
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export async function subscribeWebPush(api) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { ok: false, reason: 'unsupported' };
  }
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
 * Smart camp install: try native prompt when available; never treat guides as "failure".
 */
export async function installAndEnablePush(api, { waitMs = 10000 } = {}) {
  const steps = { install: null, push: null, strategy: getInstallStrategy() };

  if (isStandalonePwa()) {
    steps.install = { ok: true, reason: 'already_installed' };
  } else if (steps.strategy.mode === 'open_chrome') {
    steps.install = { ok: false, reason: 'in_app_browser' };
  } else if (steps.strategy.mode === 'ios_guide') {
    steps.install = { ok: false, reason: 'ios_guide' };
  } else {
    const ready = canInstallPwa() || await waitForInstallPrompt(waitMs);
    if (ready && canInstallPwa()) {
      steps.install = await promptInstallPwa();
      steps.strategy = getInstallStrategy();
    } else if (isAndroid()) {
      steps.install = { ok: false, reason: 'android_guide' };
    } else {
      steps.install = { ok: false, reason: 'desktop_guide' };
    }
  }

  // Only request push after install attempt (or if already installed / guides shown)
  const skipPush = steps.install?.reason === 'in_app_browser';
  if (!skipPush) {
    await new Promise((r) => setTimeout(r, steps.install?.ok ? 350 : 80));
    try {
      steps.push = await subscribeWebPush(api);
    } catch (err) {
      steps.push = { ok: false, reason: 'error', error: err?.message };
    }
  }

  return steps;
}
