import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { create } from 'zustand';
import useAuthStore from '../stores/authStore';

export const useMobileNavStore = create(set => ({
  open: false,
  setOpen: (v) => set({ open: v }),
  toggle: () => set(s => ({ open: !s.open })),
}));

const NAV_ITEMS = [
  { to: '/', labelKey: 'nav.home', label: 'Home', icon: '🏠' },
  { to: '/diagnostics', labelKey: 'nav.tests', label: 'Diagnostic Tests', icon: '🔬' },
  { to: '/health-packages', labelKey: 'nav.packages', label: 'Health Packages', icon: '📦' },
  { to: '/consult-doctor', labelKey: 'nav.consult', label: 'Consult Doctor', icon: '🩺' },
  { to: '/nursing', labelKey: 'nav.nursing', label: 'Nursing at Home', icon: '👩‍⚕️' },
  { to: '/physiotherapy', labelKey: 'nav.physio', label: 'Physiotherapy', icon: '💪' },
  { to: '/vaccination', labelKey: 'nav.vaccination', label: 'Vaccination', icon: '💉' },
  { to: '/medical-equipment', labelKey: 'nav.equipment', label: 'Medical Equipment', icon: '🏥' },
  { to: '/about', labelKey: 'nav.about', label: 'About Us', icon: 'ℹ️' },
  { to: '/contact', labelKey: 'nav.contact', label: 'Contact', icon: '📞' },
];

const ACCOUNT_ITEMS = [
  { to: '/dashboard', labelKey: 'nav.dashboard', label: 'My Dashboard', icon: '📊' },
  { to: '/dashboard?tab=bookings', labelKey: 'nav.myBookings', label: 'My Bookings', icon: '📅' },
  { to: '/dashboard?tab=health', labelKey: 'nav.myHealth', label: 'Health Score', icon: '🩺' },
  { to: '/dashboard?tab=profile', labelKey: 'nav.myProfile', label: 'Profile & Settings', icon: '👤' },
];

/** Must sit above .mobile-bottom-bar (z-index: 9999) */
const Z_OVERLAY = 10050;
const Z_DRAWER = 10051;

export default function MobileNav() {
  const open = useMobileNavStore(s => s.open);
  const setOpen = useMobileNavStore(s => s.setOpen);
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const drawerRef = useRef(null);
  const touchStartX = useRef(0);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    // Hide bottom tab bar while menu is open so nothing covers Logout
    document.body.classList.toggle('mobile-nav-open', open);
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-nav-open');
    };
  }, [open]);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search, setOpen]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!open) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    if (dx < 0 && drawerRef.current) {
      drawerRef.current.style.transform = `translateX(${Math.max(-300, dx)}px)`;
    }
  };

  const handleTouchEnd = (e) => {
    if (!open) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -60) setOpen(false);
    if (drawerRef.current) drawerRef.current.style.transform = '';
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/', { replace: true });
  };

  const close = () => setOpen(false);

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    const path = to.split('?')[0];
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const displayName = user?.name || user?.phone || user?.email || t('nav.guest', 'Guest');
  const initial = String(displayName).charAt(0).toUpperCase();

  const linkStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '13px 16px',
    textDecoration: 'none',
    color: active ? '#1866C9' : '#1e293b',
    fontSize: 14,
    fontWeight: active ? 700 : 500,
    background: active ? '#E8F0FE' : 'transparent',
    borderBottom: '1px solid #f1f5f9',
    WebkitTapHighlightColor: 'transparent',
    minHeight: 48,
  });

  const logoutBtnStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '13px 14px',
    borderRadius: 12,
    border: '1.5px solid #fecaca',
    background: '#FEF2F2',
    color: '#dc2626',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    minHeight: 48,
    WebkitTapHighlightColor: 'transparent',
    boxSizing: 'border-box',
  };

  return (
    <>
      <div
        onClick={close}
        aria-hidden={!open}
        style={{
          position: 'fixed', inset: 0, zIndex: Z_OVERLAY,
          background: 'rgba(15, 23, 42, 0.5)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.menu', 'Menu')}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: Z_DRAWER,
          width: 300, maxWidth: '86vw',
          background: '#fff',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: open ? 'transform 0.25s ease' : 'transform 0.2s ease-in',
          boxShadow: open ? '4px 0 28px rgba(15, 23, 42, 0.2)' : 'none',
          display: 'flex', flexDirection: 'column',
          // Keep drawer above bottom safe area; logout sits in flex footer inside
          height: '100dvh',
          maxHeight: '100dvh',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '14px 14px 12px',
          borderBottom: '1px solid #e8edf2',
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'linear-gradient(135deg, #F0F7FF 0%, #fff 70%)',
          flexShrink: 0,
        }}>
          <img src="/logo.png" alt="" style={{ height: 28 }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0F5DA8', flex: 1 }}>
            {t('nav.brand', 'Jeevan Health')}
          </span>
          <button
            type="button"
            onClick={close}
            aria-label={t('nav.close', 'Close menu')}
            style={{
              width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0',
              background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#64748b', fontSize: 18, lineHeight: 1,
              fontFamily: 'inherit', WebkitTapHighlightColor: 'transparent',
            }}
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {/* Account card */}
          <div style={{ padding: '14px 14px 8px' }}>
            {isAuthenticated ? (
              <div style={{
                background: 'linear-gradient(135deg, #0F5DA8 0%, #1866C9 55%, #1A7AD4 100%)',
                borderRadius: 14, padding: '14px 14px 12px', color: '#fff',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 18, flexShrink: 0,
                  }}>
                    {initial}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {displayName}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
                      {user?.phone || user?.email || t('nav.signedIn', 'Signed in')}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  {ACCOUNT_ITEMS.slice(0, 2).map(item => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={close}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
                        padding: '9px 8px', borderRadius: 10, background: 'rgba(255,255,255,0.14)',
                        border: '1px solid rgba(255,255,255,0.18)', color: '#fff',
                        textDecoration: 'none', fontSize: 11, fontWeight: 600,
                        WebkitTapHighlightColor: 'transparent', minHeight: 40,
                      }}
                    >
                      <span aria-hidden>{item.icon}</span>
                      {t(item.labelKey, item.label)}
                    </Link>
                  ))}
                </div>
                {/* Logout right under account actions — always visible without scrolling */}
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    ...logoutBtnStyle,
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  }}
                >
                  <span aria-hidden>🚪</span>
                  {t('nav.logout', 'Logout')}
                </button>
              </div>
            ) : (
              <div style={{
                background: '#F8FAFC', border: '1px solid #e8edf2', borderRadius: 14,
                padding: '14px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  {t('nav.welcomeGuest', 'Welcome to Jeevan Health')}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12, lineHeight: 1.45 }}>
                  {t('nav.signInHint', 'Sign in to book tests, track reports & manage family health.')}
                </div>
                <Link
                  to="/signup"
                  onClick={close}
                  style={{
                    display: 'block', textAlign: 'center', padding: '11px 14px',
                    borderRadius: 10, background: '#1866C9', color: '#fff',
                    textDecoration: 'none', fontSize: 13, fontWeight: 700,
                    minHeight: 44, lineHeight: '22px',
                  }}
                >
                  {t('nav.loginSignup', 'Login / Sign Up')}
                </Link>
              </div>
            )}
          </div>

          {/* Account links (authenticated) */}
          {isAuthenticated && (
            <nav aria-label={t('nav.accountSection', 'Account')}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase',
                letterSpacing: 0.5, padding: '10px 16px 4px',
              }}>
                {t('nav.accountSection', 'My Account')}
              </div>
              {ACCOUNT_ITEMS.map(item => (
                <Link key={item.to} to={item.to} onClick={close} style={linkStyle(isActive(item.to))}>
                  <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }} aria-hidden>{item.icon}</span>
                  {t(item.labelKey, item.label)}
                </Link>
              ))}
            </nav>
          )}

          {/* Browse */}
          <nav aria-label={t('nav.browseSection', 'Browse')}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase',
              letterSpacing: 0.5, padding: '12px 16px 4px',
            }}>
              {t('nav.browseSection', 'Services')}
            </div>
            {NAV_ITEMS.map(item => (
              <Link key={item.to} to={item.to} onClick={close} style={linkStyle(isActive(item.to))}>
                <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }} aria-hidden>{item.icon}</span>
                {t(item.labelKey, item.label)}
              </Link>
            ))}
          </nav>

          {/* Support strip */}
          <div style={{ padding: '14px 16px 12px', display: 'flex', gap: 8 }}>
            <a
              href="tel:+919700104108"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px', borderRadius: 10, background: '#F0FDF4', color: '#16a34a',
                textDecoration: 'none', fontSize: 12, fontWeight: 600, border: '1px solid #bbf7d0',
                minHeight: 42,
              }}
            >
              📞 {t('nav.call', 'Call')}
            </a>
            <a
              href="https://wa.me/919700104108"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px', borderRadius: 10, background: '#ECFDF5', color: '#059669',
                textDecoration: 'none', fontSize: 12, fontWeight: 600, border: '1px solid #a7f3d0',
                minHeight: 42,
              }}
            >
              💬 {t('nav.whatsapp', 'WhatsApp')}
            </a>
          </div>
        </div>

        {/* Sticky footer Logout — always on screen, above bottom bar */}
        <div style={{
          flexShrink: 0,
          borderTop: '1px solid #e8edf2',
          padding: '12px 14px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
          background: '#fff',
          boxShadow: '0 -6px 20px rgba(15, 23, 42, 0.08)',
        }}>
          {isAuthenticated ? (
            <button type="button" onClick={handleLogout} style={logoutBtnStyle}>
              <span aria-hidden>🚪</span>
              {t('nav.logout', 'Logout')}
            </button>
          ) : (
            <Link
              to="/signup"
              onClick={close}
              style={{
                ...logoutBtnStyle,
                background: '#1866C9',
                border: 'none',
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              {t('nav.loginSignup', 'Login / Sign Up')}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
