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
    // Landing `/` = home with Field login. Hire form is opt-in only.
    if (isPhleboHostname()) {
      const allowed = path === '/' || isPhleboPath(path);

      if (allowed) {
        // Customer token on field routes → force field login
        if (
          user &&
          !isPhleboRole(user.role) &&
          !isAdminRole(user.role) &&
          path.startsWith('/phlebo') &&
          path !== '/phlebo/login'
        ) {
          navigate('/phlebo/login', { replace: true });
          return;
        }
        // Already hired → skip login page into dashboard
        if (path === '/phlebo/login' && user && (isPhleboRole(user.role) || isAdminRole(user.role))) {
          navigate('/phlebo', { replace: true });
        }
        return;
      }

      // Unknown path → landing (login-first), never default to hire form
      if (user && (isPhleboRole(user.role) || isAdminRole(user.role))) {
        navigate('/phlebo', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [location.pathname, user, navigate]);

  return children;
}
