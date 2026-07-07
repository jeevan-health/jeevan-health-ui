import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import useCartStore from '../../stores/cartStore';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Diagnostics', path: '/diagnostics' },
  { label: 'Health Packages', path: '/services' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const count = useCartStore(s => s.getCount());

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <div className="utility-bar">
        <div className="utility-inner">
          <div className="utility-left">
            <a href="tel:+919700104108"><span>📞</span><span>+91 97001 04108</span></a>
            <a href="mailto:care@jeevanhealthcare.com"><span>✉️</span><span>care@jeevanhealthcare.com</span></a>
          </div>
          <div className="utility-right">
            <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer">
              <span>💬</span><span>WhatsApp</span>
            </a>
            {isAuthenticated ? (
              <Link to="/dashboard"><span>👤</span><span>{user?.name || 'Account'}</span></Link>
            ) : (
              <Link to="/signup"><span>🔑</span><span>Login / Register</span></Link>
            )}
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="header-logo">
            <span>🏥</span>
            <span>Jeevan HealthCare</span>
          </Link>
          <nav>
            <ul className="nav-list">
              {navLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className={`nav-link ${isActive(link.path)}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/diagnostics" className="nav-link nav-cta">Book Now</Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/my-orders" className="cart-btn">
              🧾 <span>Orders</span>
            </Link>
            <button className="cart-btn">
              🛒
              {count > 0 && <span className="cart-count">{count > 9 ? '9+' : count}</span>}
            </button>
            <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 'calc(38px + var(--header-height))', left: 0, right: 0, bottom: 0,
          background: '#fff', zIndex: 999, overflowY: 'auto', padding: 16,
        }}>
          {navLinks.map(link => (
            <Link key={link.label} to={link.path} onClick={() => setMobileOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 8, color: 'var(--primary)', fontWeight: 500, fontSize: 14, borderBottom: '1px solid var(--bg-light)' }}>
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: 16 }}>
            <a href="tel:+919700104108" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', color: 'var(--text-body)', fontSize: 14 }}>
              📞 +91 97001 04108
            </a>
          </div>
        </div>
      )}
    </>
  );
}
