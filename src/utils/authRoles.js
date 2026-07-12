/**
 * Role helpers for patient vs admin surface separation (Phase 1).
 * Host helpers prepare admin.jeevanhealthcare.com without a second app.
 */

/** Roles that may use /admin and admin API (matches backend adminAuth). */
export const ADMIN_ROLES = ['admin', 'super_admin'];

/** Field / ops portals (not patient, not admin CMS). */
export const FIELD_ROLE_PATHS = {
  phlebotomist: '/phlebotomist',
  doctor: '/doctor',
  nurse: '/nurse',
  caregiver: '/caregiver',
  physiotherapist: '/physio',
  radiologist: '/radiology',
  pharmacy: '/pharmacy',
  emergency: '/emergency',
  dispatch: '/dispatch',
  corporate: '/corporate',
  training_officer: '/training',
  it_support: '/it-support',
  call_center: '/call-center',
  sales_marketing: '/sales',
  finance: '/finance',
  bi_analyst: '/analytics',
  qa_compliance: '/qa',
  inventory: '/inventory',
  telemedicine: '/telemedicine',
  legal: '/legal',
  marketing_content: '/content',
  emergency_coordinator: '/emergency-coordinator',
};

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role);
}

export function isFieldRole(role) {
  return Boolean(role && FIELD_ROLE_PATHS[role]);
}

/** Default home path after login for a given role. */
export function getPostLoginPath(role) {
  if (isAdminRole(role)) return '/admin';
  if (FIELD_ROLE_PATHS[role]) return FIELD_ROLE_PATHS[role];
  return '/dashboard';
}

/**
 * True when the browser host is the admin portal host.
 * Works for admin.jeevanhealthcare.com and local admin.localhost / admin.127.0.0.1
 */
export function isAdminHostname(hostname = typeof window !== 'undefined' ? window.location.hostname : '') {
  if (!hostname) return false;
  const h = hostname.toLowerCase();
  if (h === 'admin.jeevanhealthcare.com') return true;
  if (h.startsWith('admin.')) return true;
  // Optional: Vite env override for preview deploys
  if (import.meta.env.VITE_ADMIN_HOST && h === String(import.meta.env.VITE_ADMIN_HOST).toLowerCase()) {
    return true;
  }
  return false;
}

/** Paths that belong to the admin portal (including login). */
export function isAdminPath(pathname) {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}
