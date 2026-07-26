/**
 * Shared beforeinstallprompt capture for the whole SPA.
 * Banner dismiss must not lose the deferred event — Install buttons use this store.
 */

let deferred = null;
const listeners = new Set();

function emit() {
  for (const fn of listeners) {
    try {
      fn(deferred);
    } catch {
      /* ignore */
    }
  }
}

export function getDeferredInstall() {
  return deferred;
}

export function subscribeInstallPrompt(fn) {
  listeners.add(fn);
  fn(deferred);
  return () => listeners.delete(fn);
}

export function clearDeferredInstall() {
  deferred = null;
  emit();
}

export function isStandaloneDisplay() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari
    window.navigator.standalone === true
  );
}

export function isIosSafari() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isIos =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|Chrome|Android/.test(ua);
  // Chrome on iOS uses CriOS — still needs share sheet
  const isIosBrowser = isIos;
  return isIosBrowser && (isSafari || /CriOS|FxiOS/.test(ua) || true);
}

/** Call once at app boot (from initPwa or main). */
export function captureInstallPrompt() {
  if (typeof window === 'undefined') return;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    emit();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    emit();
  });
}

/**
 * Trigger native install UI when available.
 * @returns {'prompted'|'accepted'|'dismissed'|'unavailable'}
 */
export async function promptInstall() {
  if (!deferred) return 'unavailable';
  try {
    deferred.prompt();
    const choice = await deferred.userChoice;
    deferred = null;
    emit();
    return choice?.outcome === 'accepted' ? 'accepted' : 'dismissed';
  } catch {
    deferred = null;
    emit();
    return 'unavailable';
  }
}
