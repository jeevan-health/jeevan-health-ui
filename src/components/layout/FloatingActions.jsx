import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import useUploadModal from '../../stores/uploadModalStore';
import { useT } from '../../i18n/LanguageProvider';

/** Mobile: clear bottom nav; on test pages also clear sticky Book Now bar */
function useFabBottomOffset() {
  const { pathname } = useLocation();
  return useMemo(() => {
    const onTestDetail = pathname.startsWith('/test/');
    // bottom nav ~64px + safe-area; sticky book bar ~64px on test pages
    if (onTestDetail) {
      return {
        bottom: 'calc(148px + env(safe-area-inset-bottom, 0px))',
        helpBottom: 'calc(160px + env(safe-area-inset-bottom, 0px))',
      };
    }
    return {
      bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
      helpBottom: 'calc(92px + env(safe-area-inset-bottom, 0px))',
    };
  }, [pathname]);
}

export default function FloatingActions() {
  const t = useT();
  const { bottom, helpBottom } = useFabBottomOffset();
  const ACTIONS = [
    { icon: '💬', label: t('floating.chatWhatsApp', 'Chat on WhatsApp'), href: 'https://wa.me/919700104108', color: '#25D366', pulse: true },
    { icon: '📞', label: t('floating.callNow', 'Call Now'), href: 'tel:+919700104108', color: '#1866C9', pulse: false },
    { icon: '📄', label: t('floating.uploadRx', 'Upload Prescription'), action: 'upload', color: '#FF9800', pulse: false },
    { icon: '🆘', label: t('floating.needHelp', 'Need Help?'), action: 'help', color: '#20B7F5', pulse: false },
  ];
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [showTrust, setShowTrust] = useState(false);
  const lastScrollY = useRef(0);
  const setOpen = useUploadModal(s => s.setOpen);

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;
      if (sy > lastScrollY.current && sy > 200) setVisible(false);
      else if (sy < lastScrollY.current) setVisible(true);
      lastScrollY.current = sy;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!expanded) { setShowHelpPanel(false); return; }
    const t = setTimeout(() => setShowTrust(true), 200);
    return () => clearTimeout(t);
  }, [expanded]);

  const handleAction = (a) => {
    if (a.action === 'upload') { setExpanded(false); setOpen(true); }
    else if (a.action === 'help') setShowHelpPanel(p => !p);
    else { setExpanded(false); if (a.href) window.open(a.href, '_blank'); }
  };

  const helpItems = [
    { icon: '🔬', label: t('floating.bookTest', 'Book a Test'), href: '/diagnostics' },
    { icon: '🔍', label: t('floating.findTest', 'Find a Test'), href: '/diagnostics' },
    { icon: '📦', label: t('floating.healthPackages', 'Health Packages'), href: '/services' },
    { icon: '📋', label: t('floating.reportSupport', 'Report Support'), href: '/contact' },
    { icon: '🏠', label: t('floating.homeCollection', 'Home Collection'), href: '/diagnostics' },
    { icon: '👨‍⚕️', label: t('floating.talkExecutive', 'Talk to an Executive'), href: 'tel:+919700104108' },
  ];

  return (
    <>
      <div
        className="fab-container"
        style={{
          position: 'fixed',
          // Desktop default; mobile overridden by CSS + path-aware bottom
          bottom: 24,
          right: 24,
          zIndex: 9200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 10,
          transition: 'transform 0.3s, opacity 0.3s, bottom 0.2s',
          transform: visible ? 'translateY(0)' : 'translateY(80px)',
          opacity: visible ? 1 : 0,
          // Inline CSS variable so mobile media query / path can use it
          ['--fab-bottom']: bottom,
          ['--fab-help-bottom']: helpBottom,
        }}
      >
        {showTrust && (
          <div className="fab-trust-badge" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e8edf2', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, animation: 'fabFadeIn 0.3s ease' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#16a34a' }}>🟢 {t('floating.onlineNow', 'Online Now')}</div>
              <div style={{ fontSize: 9, color: 'var(--text-secondary)' }}>{t('floating.avgResponse', 'Avg response:')} &lt; 2 min</div>
            </div>
          </div>
        )}

        {expanded && ACTIONS.map((a, i) => (
          <div key={a.label} className="fab-item" style={{ display: 'flex', alignItems: 'center', gap: 8, animation: `fabSlideIn 0.2s ease ${i * 0.05}s both` }}>
            <span className="fab-label" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, color: '#1a1a1a', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e8edf2', whiteSpace: 'nowrap' }}>
              {a.pulse && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block', marginRight: 4 }} />}
              {a.label}
            </span>
            {a.href && !a.action ? (
              <a href={a.href} target="_blank" rel="noopener noreferrer" className="fab-btn" style={{ background: a.color }}>{a.icon}</a>
            ) : (
              <button onClick={() => handleAction(a)} className="fab-btn" style={{ background: a.color, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{a.icon}</button>
            )}
          </div>
        ))}

        <button onClick={() => setExpanded(e => !e)} className="fab-main-btn" style={{
          width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #1866C9, #0F4A96)', color: '#fff', border: 'none',
          boxShadow: '0 4px 16px rgba(24, 102, 201,0.35)', cursor: 'pointer', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s', fontFamily: 'inherit',
        }}>
          {expanded ? '✕' : '+'}
        </button>
      </div>

      {showHelpPanel && (
        <div onClick={() => setShowHelpPanel(false)} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.3)' }}>
          <div onClick={e => e.stopPropagation()} className="fab-help-panel" style={{ position: 'fixed', bottom: helpBottom, right: 24, background: '#fff', borderRadius: 16, padding: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', width: 240, animation: 'fabFadeIn 0.2s ease', zIndex: 9200 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#1a1a1a' }}>💬 {t('floating.needHelpPanel', 'Need Help?')}</div>
            {helpItems.map(item => (
              <a key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', textDecoration: 'none', color: 'var(--text-body)', fontSize: 12, borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
