import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { useT } from '../../i18n/LanguageProvider';

const NAV = [
  { path: '/phlebotomist', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/phlebotomist/collections', label: 'My Collections', icon: '🧪' },
  { path: '/phlebotomist/routes', label: 'Routes', icon: '🗺️' },
  { path: '/phlebotomist/schedule', label: 'Schedule', icon: '📅' },
];

export default function PhlebotomistLayout() {
  const t = useT();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  const isActive = (item) => item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🚑</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{t('phlebotomist.portal', 'Phlebotomist')}</span>
        </div>
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {NAV.map(item => {
            const labels = { Dashboard: t('phlebotomist.navDashboard', 'Dashboard'), 'My Collections': t('phlebotomist.navCollections', 'My Collections'), Routes: t('phlebotomist.navRoutes', 'Routes'), Schedule: t('phlebotomist.navSchedule', 'Schedule') };
            return (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px',
              color: isActive(item) ? '#059669' : '#475569',
              textDecoration: 'none', fontSize: 13,
              background: isActive(item) ? '#ecfdf5' : 'transparent',
              borderLeft: isActive(item) ? '3px solid #059669' : '3px solid transparent',
              fontWeight: isActive(item) ? 600 : 400,
            }}>
              <span>{item.icon}</span>
              <span>{labels[item.label]}</span>
            </Link>
            );
          })}
        </nav>
        <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', background: '#fafbfc' }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{user?.name || t('phlebotomist.phlebotomist', 'Phlebotomist')}</div>
          <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#ef4444', width: '100%' }}>{t('phlebotomist.logout', 'Logout')}</button>
        </div>
      </div>
      {/* Main */}
      <div style={{ flex: 1, padding: 24, overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}