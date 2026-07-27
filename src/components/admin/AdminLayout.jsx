import { useState, useEffect } from 'react';
import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import { isAdminRole } from '../../utils/authRoles.js';
import InstallAppButton from '../InstallAppButton.jsx';
import EnablePushButton from '../EnablePushButton.jsx';
import './admin-layout.css';

export default function AdminLayout() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [toolsOpen, setToolsOpen] = useState(false);

  useEffect(() => {
    if (!toolsOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setToolsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [toolsOpen]);

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  if (!isAdminRole(user?.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div className="admin-top-bar">
          <Link to="/admin" className="admin-brand" onClick={() => setToolsOpen(false)}>
            <img src="/logo.png" alt="Jeevan HealthCare" />
            <span>Admin</span>
          </Link>
          <div className="admin-top-actions">
            <span className="admin-role admin-role--desktop">{user?.role?.replace('_', ' ')}</span>
            <button type="button" className="btn btn-outline-dark admin-logout" onClick={() => logout()}>
              Log out
            </button>
            <button
              type="button"
              className="admin-tools-toggle"
              aria-expanded={toolsOpen}
              aria-controls="admin-tools-panel"
              onClick={() => setToolsOpen((v) => !v)}
            >
              {toolsOpen ? 'Close' : 'More'}
            </button>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Admin">
          <NavLink to="/admin" end onClick={() => setToolsOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/catalog" onClick={() => setToolsOpen(false)}>
            Catalog
          </NavLink>
          <NavLink to="/admin/orders" onClick={() => setToolsOpen(false)}>
            Orders
          </NavLink>
          <NavLink to="/admin/phlebo" onClick={() => setToolsOpen(false)}>
            Phlebo
          </NavLink>
          <NavLink to="/admin/reports" onClick={() => setToolsOpen(false)}>
            Reports
          </NavLink>
        </nav>

        {/* Desktop tools inline */}
        <div className="admin-top-tools admin-top-tools--desktop">
          <InstallAppButton variant="header" />
          <EnablePushButton variant="header" />
        </div>
      </header>

      {/* Mobile tools sheet */}
      {toolsOpen && (
        <div className="admin-tools-sheet" id="admin-tools-panel" role="dialog" aria-label="Admin tools">
          <button
            type="button"
            className="admin-tools-backdrop"
            aria-label="Close tools"
            onClick={() => setToolsOpen(false)}
          />
          <div className="admin-tools-panel">
            <p className="admin-tools-title">Tools</p>
            <p className="admin-tools-meta">
              Signed in as {user?.name || user?.phone || 'admin'} · {user?.role?.replace('_', ' ')}
            </p>
            <div className="admin-tools-stack">
              <InstallAppButton variant="block" />
              <EnablePushButton variant="block" />
              <button
                type="button"
                className="btn btn-outline-dark btn-block"
                onClick={() => {
                  setToolsOpen(false);
                  logout();
                }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
