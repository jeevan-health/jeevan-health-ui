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
      <div className="header-inner" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', maxWidth: 1200, margin: '0 auto' }}>

        <Link to="/" className="header-logo" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Jeevan HealthCare" style={{ height: 32, display: 'block' }} />
        </Link>

        <div className="hdr-search-wrap" style={{ flex: 1, minWidth: 0, maxWidth: 420 }}>
          <SmartSearch placeholder="🔍 Search tests..." />
        </div>

        <a href="tel:+919700104108" className="hdr-btn hdr-emergency" title="Emergency" style={{ flexShrink: 0 }}>
          🚨
        </a>

        <button onClick={() => useUploadModal.getState().setOpen(true)} className="hdr-btn hdr-upload" style={{ flexShrink: 0, fontFamily: 'inherit', cursor: 'pointer' }}>
          📤
        </button>

        <div className="hdr-right" style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" className="hdr-btn hdr-wa" style={{ flexShrink: 0, padding: '6px 8px' }}>
            💬
          </a>
          <button onClick={() => setCartOpen(true)} className="hdr-btn hdr-cart" style={{ position: 'relative', padding: '6px 8px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>
            🛒
            {count > 0 && <span style={{ background: 'var(--primary)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10, lineHeight: '16px', marginLeft: 2 }}>{count > 9 ? '9+' : count}</span>}
          </button>

          {isAuthenticated ? (
            <Link to="/dashboard" className="hdr-btn hdr-login" style={{ padding: '6px 8px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 8, background: '#fff', textDecoration: 'none', color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: 4 }}>
              👤
            </Link>
          ) : (
            <Link to="/signup" className="hdr-btn hdr-login" style={{ padding: '6px 10px', fontSize: 12, background: 'var(--primary)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
              👤 Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
