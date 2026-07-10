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
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <img src="/logo.png" alt="Jeevan HealthCare at Home" />
        </Link>

        <div className="hdr-search-wrap">
          <SmartSearch placeholder="🔍 Search tests, packages, doctors, medicines..." />
        </div>

        <div className="hdr-right">
          <a href="tel:+919700104108" className="hdr-btn hdr-call" title="Call us">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span className="hdr-label">Call</span>
          </a>

          <button onClick={() => useUploadModal.getState().setOpen(true)} className="hdr-btn hdr-upload" title="Upload Prescription">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span className="hdr-label">Upload</span>
          </button>

          <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" className="hdr-btn hdr-wa" title="WhatsApp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            <span className="hdr-label">WhatsApp</span>
          </a>

          <Link to="/consult-doctor" className="hdr-btn hdr-consult" title="Consult Doctor">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="hdr-label">Consult</span>
          </Link>

          <button onClick={() => setCartOpen(true)} className="hdr-btn hdr-cart" title="Cart">
            <div className="hdr-cart-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {count > 0 && <span className="cart-count-badge">{count > 9 ? '9+' : count}</span>}
            </div>
            <span className="hdr-label">Cart</span>
          </button>

          {isAuthenticated ? (
            <Link to="/dashboard" className="hdr-btn hdr-profile" title="Dashboard">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          ) : (
            <Link to="/signup" className="hdr-btn hdr-signup" title="Sign In">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              <span className="hdr-label">Login</span>
            </Link>
          )}
        </div>
      </div>

      <div className="hdr-mobile-search">
        <SmartSearch placeholder="🔍 Search tests, packages, doctors, medicines..." />
      </div>

      <style>{`
        .site-header {
          position: sticky; top: 0; z-index: 1000;
          background: #fff; border-bottom: 1px solid #e8edf2;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .header-inner {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 16px; max-width: 1200; margin: 0 auto;
        }
        .header-logo { flex-shrink: 0; display: flex; align-items: center; }
        .header-logo img { height: 34px; display: block; }
        .hdr-search-wrap { flex: 1; min-width: 0; max-width: 460px; }
        .hdr-right { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }
        .hdr-btn {
          display: flex; align-items: center; gap: 3px;
          padding: 6px 8px; border-radius: 8px;
          text-decoration: none; color: #555;
          font-family: inherit; font-size: 11px; font-weight: 500;
          cursor: pointer; border: none; background: none;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .hdr-btn:hover { background: #f5f5f5; color: #1a1a1a; }
        .hdr-btn svg { flex-shrink: 0; }
        .hdr-label { display: inline; }
        .hdr-signup {
          background: var(--primary, #1866C9) !important; color: #fff !important;
          padding: 6px 12px !important; border-radius: 8px !important;
          font-weight: 600 !important;
        }
        .hdr-signup:hover { opacity: 0.9; }
        .hdr-cart-icon-wrap { position: relative; display: flex; }
        .cart-count-badge {
          position: absolute; top: -6px; right: -6px;
          min-width: 16px; height: 16px; border-radius: 50%;
          background: #EF4444; color: #fff; font-size: 9px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px; box-shadow: 0 1px 3px rgba(239,68,68,0.3);
        }
        .hdr-mobile-search { display: none; padding: 0 12px 8px; }
        @media (max-width: 768px) {
          .header-inner { padding: 6px 10px; gap: 6px; }
          .header-logo img { height: 28px; }
          .hdr-search-wrap { display: none; }
          .hdr-mobile-search { display: block; }
          .hdr-label { display: none; }
          .hdr-btn { padding: 6px; }
          .hdr-signup .hdr-label { display: inline; font-size: 10px; }
          .hdr-signup { padding: 6px 8px !important; }
        }
        @media (min-width: 769px) {
          .hdr-btn.hdr-call { color: #16a34a; }
          .hdr-btn.hdr-wa { color: #25d366; }
          .hdr-btn.hdr-consult { color: #7c3aed; }
        }
      `}</style>
    </header>
  );
}