import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import { isAdminRole } from '../../utils/authRoles.js';
import InstallAppButton from '../InstallAppButton.jsx';
import EnablePushButton from '../EnablePushButton.jsx';
import './admin-layout.css';

export default function AdminLayout() {
  const { user, logout, isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  if (!isAdminRole(user?.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div className="admin-top-inner">
          <Link to="/admin" className="admin-brand">
            <img src="/logo.png" alt="Jeevan HealthCare" />
            <span>Admin</span>
          </Link>
          <nav className="admin-nav" aria-label="Admin">
            <NavLink to="/admin" end>
              Dashboard
            </NavLink>
            <NavLink to="/admin/catalog">Catalog</NavLink>
            <NavLink to="/admin/orders">Orders</NavLink>
            <NavLink to="/admin/phlebo">Phlebo</NavLink>
            <NavLink to="/admin/reports">Reports</NavLink>
          </nav>
          <div className="admin-top-user">
            <InstallAppButton variant="header" />
            <EnablePushButton variant="header" />
            <span className="admin-role">{user?.role?.replace('_', ' ')}</span>
            <button type="button" className="btn btn-outline-dark admin-logout" onClick={() => logout()}>
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
