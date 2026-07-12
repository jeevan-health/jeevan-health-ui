import { Navigate, useLocation } from 'react-router-dom';
import useSettingsStore from '../stores/settingsStore';

/** Paths that stay allowed in reports-only mode */
const ALLOWED_PREFIXES = [
  '/dashboard',
  '/camp',
  '/signup',
  '/contact',
  '/about',
  '/policy',
  '/',
];

/** Paths that must be blocked (booking / checkout flows) */
const BLOCKED_PREFIXES = [
  '/checkout',
  '/consult-doctor',
  '/book-appointment',
  '/my-orders',
  '/nurse-at-home',
  '/nursing',
  '/physiotherapy',
  '/physio',
  '/vaccination',
  '/medical-equipment',
  '/equipment-cart',
];

function isBlockedPath(pathname) {
  // Diagnostics catalog browsing OK; only checkout is hard-blocked via route
  if (pathname === '/checkout' || pathname.startsWith('/checkout/')) return true;
  return BLOCKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Redirect restricted patients away from booking routes.
 */
export default function ReportsOnlyGuard({ children }) {
  const location = useLocation();
  const reportsOnly = useSettingsStore((s) => s.reportsOnly);
  const loaded = useSettingsStore((s) => s.loaded);

  if (!loaded || !reportsOnly) return children;

  if (isBlockedPath(location.pathname)) {
    return <Navigate to="/dashboard?tab=reports&gated=1" replace />;
  }

  return children;
}
