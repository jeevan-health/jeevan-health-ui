/**
 * Role helpers + multi-host surface separation.
 * - admin.jeevanhealthcare.com → ops
 * - phlebo.jeevanhealthcare.com → field portal
 * - apex → patient app + public hire form
 */

export const ADMIN_ROLES = ['admin', 'super_admin'];

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role);
}

export function isPhleboRole(role) {
  return role === 'phlebotomist';
}

/** Default home path after login for a given role (respects current host when possible). */
export function getPostLoginPath(role, hostname = typeof window !== 'undefined' ? window.location.hostname : '') {
  if (isAdminRole(role)) {
    if (isPhleboHostname(hostname)) return 'https://admin.jeevanhealthcare.com/admin';
    return '/admin';
  }
  if (isPhleboRole(role)) {
    if (isAdminHostname(hostname)) return 'https://phlebo.jeevanhealthcare.com/phlebo';
    if (isPhleboHostname(hostname) || isMainHostname(hostname)) return '/phlebo';
    return '/phlebo';
  }
  return '/dashboard';
}

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

/**
 * True when browser host is the phlebotomist portal.
 * phlebo.jeevanhealthcare.com, phlebo.localhost, VITE_PHLEBO_HOST
 */
export function isPhleboHostname(hostname = typeof window !== 'undefined' ? window.location.hostname : '') {
  if (!hostname) return false;
  const h = hostname.toLowerCase();
  if (h === 'phlebo.jeevanhealthcare.com') return true;
  if (h.startsWith('phlebo.')) return true;
  if (import.meta.env.VITE_PHLEBO_HOST && h === String(import.meta.env.VITE_PHLEBO_HOST).toLowerCase()) {
    return true;
  }
  return false;
}

export function isMainHostname(hostname = typeof window !== 'undefined' ? window.location.hostname : '') {
  return !isAdminHostname(hostname) && !isPhleboHostname(hostname);
}

export function isAdminPath(pathname) {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

export function isPhleboPath(pathname) {
  return (
    pathname === '/' || // phlebo host landing only (HostGate checks host first)
    pathname === '/phlebo' ||
    pathname.startsWith('/phlebo/') ||
    pathname === '/onboarding-phlebotomist' ||
    pathname === '/careers/phlebotomist'
  );
}

// jobs path covered by /phlebo/ prefix
