import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { create } from 'zustand';

export const useMobileNavStore = create(set => ({
  open: false,
  setOpen: (v) => set({ open: v }),
  toggle: () => set(s => ({ open: !s.open })),
}));

const NAV_ITEMS = [
  { to: '/', labelKey: 'nav.home', label: 'Home', icon: '🏠' },
  { to: '/diagnostics', labelKey: 'nav.tests', label: 'Diagnostic Tests', icon: '🔬' },
  { to: '/nursing', labelKey: 'nav.nursing', label: 'Nursing at Home', icon: '👩‍⚕️' },
  { to: '/physiotherapy', labelKey: 'nav.physio', label: 'Physiotherapy', icon: '💪' },
  { to: '/vaccination', labelKey: 'nav.vaccination', label: 'Vaccination', icon: '💉' },
  { to: '/medical-equipment', labelKey: 'nav.equipment', label: 'Medical Equipment', icon: '🏥' },
  { to: '/health-packages', labelKey: 'nav.packages', label: 'Health Packages', icon: '📦' },
  { to: '/consult-doctor', labelKey: 'nav.consult', label: 'Consult Doctor', icon: '🩺' },
  { to: '/about', labelKey: 'nav.about', label: 'About Us', icon: 'ℹ️' },
  { to: '/contact', labelKey: 'nav.contact', label: 'Contact', icon: '📞' },
];

export default function MobileNav() {
  const open = useMobileNavStore(s => s.open);
  const setOpen = useMobileNavStore(s => s.setOpen);
  const t = useT();
  const drawerRef = useRef(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleTouchStart = (e) => {
    // When drawer is open, allow swipe-to-close from anywhere inside it
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!open) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    if (dx < 0 && drawerRef.current) {
      drawerRef.current.style.transform = `translateX(${Math.max(-280, dx)}px)`;
    }
  };

  const handleTouchEnd = (e) => {
    if (!open) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -60) setOpen(false);
    if (drawerRef.current) drawerRef.current.style.transform = '';
  };

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9997,
          background: 'rgba(0,0,0,0.4)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
      />
      <div
        ref={drawerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 9998,
          width: 280, maxWidth: '80vw',
          background: '#fff',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: open ? 'transform 0.25s ease' : 'transform 0.2s ease-in',
          boxShadow: open ? '2px 0 24px rgba(0,0,0,0.15)' : 'none',
          overflowY: 'auto', WebkitOverflowScrolling: 'touch',
        }}
      >
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #e8edf2', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="Jeevan Health" style={{ height: 28 }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0b3b2c' }}>Jeevan Health</span>
        </div>
        <nav>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 16px', textDecoration: 'none',
                color: '#1e293b', fontSize: 14, fontWeight: 500,
                borderBottom: '1px solid #f1f5f9',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; }}
            >
              <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              {t(item.labelKey, item.label)}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
