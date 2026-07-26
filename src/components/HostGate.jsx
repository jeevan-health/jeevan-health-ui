import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  isAdminHostname,
  isAdminPath,
  isAdminRole,
  isPhleboHostname,
  isPhleboPath,
  isPhleboRole,
  getPostLoginPath,
} from '../utils/authRoles.js';
import useAuthStore from '../stores/authStore.js';

/**
 * Host-based surface isolation (single SPA):
 * - admin.* → /admin only
 * - phlebo.* → /phlebo + hire form only
 * - apex → patient app (+ public hire routes)
 */
export default function HostGate({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const path = location.pathname || '/';

    // ── Admin host ──────────────────────────────────────────────
    if (isAdminHostname()) {
      if (isAdminPath(path)) {
        if (path === '/admin/login' && user && isAdminRole(user.role)) {
          navigate('/admin', { replace: true });
        }
        if (user && !isAdminRole(user.role) && path !== '/admin/login') {
          navigate('/admin/login', { replace: true });
        }
        return;
      }
      if (user && isAdminRole(user.role)) {
        navigate(getPostLoginPath(user.role), { replace: true });
      } else {
        navigate('/admin/login', { replace: true });
      }
      return;
    }

    // ── Phlebo host ─────────────────────────────────────────────
    if (isPhleboHostname()) {
      // Allow hire form + phlebo portal paths only
      if (isPhleboPath(path)) {
        // Non-phlebo authed user on portal (not apply form) → login
        if (
          user &&
          !isPhleboRole(user.role) &&
          !isAdminRole(user.role) &&
          path.startsWith('/phlebo') &&
          path !== '/phlebo/login'
        ) {
          navigate('/phlebo/login', { replace: true });
        }
        if (path === '/phlebo/login' && user && isPhleboRole(user.role)) {
          navigate('/phlebo', { replace: true });
        }
        return;
      }
      // Bounce unknown paths
      if (user && isPhleboRole(user.role)) {
        navigate('/phlebo', { replace: true });
      } else {
        navigate('/onboarding-phlebotomist', { replace: true });
      }
    }
  }, [location.pathname, user, navigate]);

  return children;
}
