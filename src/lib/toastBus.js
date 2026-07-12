/**
 * Module-level toast so any file (stores, handlers) can notify without React hooks.
 * ToastProvider registers the real implementation on mount.
 */

let _toast = null;

export function registerToast(fn) {
  _toast = fn;
}

/** @param {string} message @param {'success'|'error'|'info'|'warning'|object} [typeOrOpts] */
export function toast(message, typeOrOpts = 'info') {
  if (typeof _toast === 'function') {
    _toast(message, typeOrOpts);
    return;
  }
  // Fallback before provider mounts
  if (typeof console !== 'undefined') console.info('[toast]', message);
}

export const notify = {
  success: (m, d) => toast(m, { type: 'success', duration: d }),
  error: (m, d) => toast(m, { type: 'error', duration: d || 5000 }),
  info: (m, d) => toast(m, { type: 'info', duration: d }),
  warning: (m, d) => toast(m, { type: 'warning', duration: d }),
};
