/**
 * Role helpers for patient vs admin surface separation.
 * Host helpers prepare admin.jeevanhealthcare.com without a second app.
 */

export const ADMIN_ROLES = ['admin', 'super_admin'];

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role);
}

/** Default home path after login for a given role. */
export function getPostLoginPath(role) {
  if (isAdminRole(role)) return '/admin';
  return '/dashboard';
}

/**
 * True when the browser host is the admin portal host.
 * admin.jeevanhealthcare.com, admin.localhost, VITE_ADMIN_HOST
 */
export function isAdminHostname(hostname = typeof window !== 'undefined' ? window.location.hostname : '') {
  if (!hostname) return false;
  const h = hostname.toLowerCase();
  if (h === 'admin.jeevanhealthcare.com') return true;
  if (h.startsWith('admin.')) return true;
  if (import.meta.env.VITE_ADMIN_HOST && h === String(import.meta.env.VITE_ADMIN_HOST).toLowerCase()) {
    return true;
  }
  return false;
}

/** Paths that belong to the admin portal (including login). */
export function isAdminPath(pathname) {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}
