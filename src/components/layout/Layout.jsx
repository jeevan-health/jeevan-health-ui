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

  const navItems = [
    { to: '/diagnostics', icon: '🔬', label: 'Tests' },
    { to: '/services', icon: '📦', label: 'Packages' },
    { to: '#upload', icon: '📄', label: 'Upload', action: () => useUploadModal.getState().setOpen(true) },
    { to: '#cart', icon: '🛒', label: 'Cart', action: () => useCartStore.getState().setCartOpen(true) },
    { to: isAuth ? '/dashboard' : '/signup', icon: '👤', label: isAuth ? 'Account' : 'Login' },
  ];

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
          const isActive = item.to !== '#' && loc.pathname === item.to;
          if (item.action) {
            return (
              <button key={item.label} onClick={item.action} className={isActive ? 'active' : ''} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'inherit', padding: '6px 12px', borderRadius: 12, fontWeight: isActive ? 600 : 500, WebkitTapHighlightColor: 'transparent' }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          }
          return (
            <Link key={item.label} to={item.to} className={isActive ? 'active' : ''} style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
