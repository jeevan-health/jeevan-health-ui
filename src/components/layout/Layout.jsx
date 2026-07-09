import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import UploadModal from './UploadModal';
import FloatingActions from './FloatingActions';
import CartDrawer from './CartDrawer';
import useAuthStore from '../../stores/authStore';
import useUploadModal from '../../stores/uploadModalStore';
import useCartStore from '../../stores/cartStore';

export default function Layout() {
  const loc = useLocation();
  const isAuth = useAuthStore(s => s.isAuthenticated);
  const params = new URLSearchParams(loc.search);

  const navItems = [
    { to: '/', icon: '🏠', label: 'Home', match: '/' },
    { to: '/diagnostics', icon: '🔬', label: 'Tests', match: '/diagnostics' },
    { to: isAuth ? '/dashboard?tab=bookings' : '/signup', icon: '📅', label: 'Bookings', match: '/dashboard', tab: 'bookings' },
    { to: isAuth ? '/dashboard?tab=health' : '/signup', icon: '🩺', label: 'Health', match: '/dashboard', tab: 'health' },
    { to: isAuth ? '/dashboard?tab=profile' : '/signup', icon: '👤', label: 'Profile', match: '/dashboard', tab: 'profile' },
  ];

  const isActiveTab = (item) => {
    if (item.to === '/') return loc.pathname === '/';
    if (item.match === '/dashboard') {
      if (item.tab) return loc.pathname.startsWith('/dashboard') && params.get('tab') === item.tab;
      return loc.pathname.startsWith('/dashboard');
    }
    return loc.pathname.startsWith(item.match);
  };

  return (
    <>
      <Header />
      <main className="page-content">
        <div className="app-page">
          <Outlet />
        </div>
      </main>
      <Footer />
      <UploadModal />
      <CartDrawer />
      <FloatingActions />
      <div className="mobile-bottom-bar">
        {navItems.map(item => {
          const active = isActiveTab(item);
          return (
            <Link key={item.label} to={item.to} className={`mbb-item${active ? ' active' : ''}`} style={{ textDecoration: 'none', color: active ? '#1866C9' : '#8E8E93', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, padding: '4px 0', fontFamily: 'inherit', fontSize: 10, fontWeight: active ? 600 : 500, WebkitTapHighlightColor: 'transparent', position: 'relative', transition: 'color 0.2s' }}>
              <span style={{ fontSize: 22, lineHeight: 1.2 }}>{item.icon}</span>
              <span style={{ lineHeight: 1.2 }}>{item.label}</span>
              {active && <span style={{ position: 'absolute', top: 2, width: 4, height: 4, borderRadius: '50%', background: '#1866C9' }} />}
            </Link>
          );
        })}
      </div>
    </>
  );
}
