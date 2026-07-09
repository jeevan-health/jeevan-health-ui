import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import useCartStore from '../../stores/cartStore';
import useUploadModal from '../../stores/uploadModalStore';
import SmartSearch from './SmartSearch';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const count = useCartStore(s => s.getCount());
  const setCartOpen = useCartStore(s => s.setCartOpen);

  return (
    <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 1000, background: '#fff', borderBottom: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      {/* Desktop / mobile row 1: logo + icons */}
      <div className="header-inner" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <button className="mobile-toggle" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, display: 'none', padding: 8 }}>
          ☰
        </button>

        <Link to="/" className="header-logo" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Jeevan HealthCare" style={{ height: 32, display: 'block' }} />
        </Link>

        <div className="hdr-search-wrap" style={{ flex: 1, minWidth: 0, maxWidth: 420 }}>
          <SmartSearch placeholder="Search tests..." />
        </div>

        <div className="hdr-right" style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <a href="tel:+919700104108" className="hdr-btn hdr-emergency" title="Emergency" style={{ flexShrink: 0 }}>
            🚨
          </a>
          <button onClick={() => useUploadModal.getState().setOpen(true)} className="hdr-btn hdr-upload" style={{ flexShrink: 0, fontFamily: 'inherit', cursor: 'pointer' }}>
            📤
          </button>
          <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" className="hdr-btn hdr-wa" style={{ flexShrink: 0 }}>
            💬
          </a>
          <button onClick={() => setCartOpen(true)} className="hdr-btn hdr-cart" style={{ position: 'relative', flexShrink: 0, fontFamily: 'inherit', cursor: 'pointer' }}>
            🛒
            {count > 0 && <span className="cart-count-badge" style={{ position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: '50%', background: '#EF4444', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{count > 9 ? '9+' : count}</span>}
          </button>
          {isAuthenticated ? (
            <Link to="/dashboard" className="hdr-btn hdr-login" style={{ flexShrink: 0, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              👤
            </Link>
          ) : (
            <Link to="/signup" className="hdr-btn hdr-login" style={{ flexShrink: 0, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: '#fff', fontWeight: 600 }}>
              👤
            </Link>
          )}
        </div>
      </div>
      {/* Mobile row 2: Search bar (hidden on desktop) */}
      <div className="hdr-mobile-search" style={{ display: 'none', padding: '4px 12px 8px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <SmartSearch placeholder="Search tests, symptoms, diseases..." />
      </div>
    </header>
  );
}
