import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/admin/orders', label: 'Orders', icon: '📋' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/catalog', label: 'Catalog', icon: '🧪' },
  { path: '/admin/coupons', label: 'Coupons', icon: '🏷️' },
  { path: '/admin/contacts', label: 'Contacts', icon: '✉️' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  const isActive = (item) => item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 240, background: '#0f172a', color: '#fff',
        transition: 'width 0.2s', display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
      }}>
        <div style={{ padding: collapsed ? '12px 8px' : '16px 20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 10, justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18, padding: 4 }}>☰</button>
          {!collapsed && <span style={{ fontWeight: 700, fontSize: 15 }}>Jeevan Admin</span>}
        </div>
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '10px 0' : '10px 20px',
              color: isActive(item) ? '#00D9FF' : '#94a3b8', textDecoration: 'none', fontSize: 13,
              background: isActive(item) ? 'rgba(0,217,255,0.08)' : 'transparent',
              borderLeft: isActive(item) ? '2px solid #00D9FF' : '2px solid transparent',
              justifyContent: collapsed ? 'center' : 'flex-start',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div style={{ padding: collapsed ? '8px' : '12px 20px', borderTop: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>A</div>
            {!collapsed && <div style={{ fontSize: 12, overflow: 'hidden' }}><div style={{ fontWeight: 600, color: '#e2e8f0' }}>{user?.name || 'Admin'}</div><div style={{ color: '#64748b', fontSize: 10, textTransform: 'capitalize' }}>{user?.role || 'admin'}</div></div>}
          </div>
          {!collapsed && (
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => navigate('/dashboard')} style={{ flex: 1, padding: '6px 0', background: '#1e293b', border: 'none', color: '#94a3b8', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>Site</button>
              <button onClick={() => { logout(); navigate('/'); }} style={{ flex: 1, padding: '6px 0', background: '#1e293b', border: 'none', color: '#ef4444', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>Logout</button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowX: 'hidden', padding: 0 }}>
        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{NAV_ITEMS.find(i => isActive(i))?.label || 'Admin'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#64748b' }}>
            <Link to="/" style={{ color: '#1866C9', textDecoration: 'none' }}>← Back to Site</Link>
          </div>
        </div>
        <div style={{ padding: 24 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
