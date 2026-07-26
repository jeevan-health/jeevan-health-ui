import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isAdminHostname, isAdminPath, isAdminRole, getPostLoginPath } from '../utils/authRoles.js';
import useAuthStore from '../stores/authStore.js';

/**
 * On admin.* host: never show patient marketing.
 * Force users onto /admin/login or /admin/* only.
 */
export default function HostGate({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!isAdminHostname()) return;

    const path = location.pathname || '/';

    // Already on admin surface
    if (isAdminPath(path)) {
      // Logged-in admin on login → go to dashboard
      if (path === '/admin/login' && user && isAdminRole(user.role)) {
        navigate('/admin', { replace: true });
      }
      // Non-admin session on admin host → strip to login
      if (user && !isAdminRole(user.role) && path !== '/admin/login') {
        navigate('/admin/login', { replace: true });
      }
      return;
    }

    // Non-admin path on admin host → bounce
    if (user && isAdminRole(user.role)) {
      navigate(getPostLoginPath(user.role), { replace: true });
    } else {
      navigate('/admin/login', { replace: true });
    }
  }, [location.pathname, user, navigate]);

  return children;
}
