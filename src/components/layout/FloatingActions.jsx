import { useState, useEffect, useCallback, useRef } from 'react';
import useUploadModal from '../../stores/uploadModalStore';

const ACTIONS = [
  { icon: '💬', label: 'Chat on WhatsApp', href: 'https://wa.me/919700104108', color: '#25D366', pulse: true },
  { icon: '📞', label: 'Call Now', href: 'tel:+919700104108', color: '#1866C9', pulse: false },
  { icon: '📄', label: 'Upload Prescription', action: 'upload', color: '#FF9800', pulse: false },
  { icon: '🆘', label: 'Need Help?', action: 'help', color: '#20B7F5', pulse: false },
];

export default function FloatingActions() {
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
    { icon: '🔬', label: 'Book a Test', href: '/diagnostics' },
    { icon: '🔍', label: 'Find a Test', href: '/diagnostics' },
    { icon: '📦', label: 'Health Packages', href: '/services' },
    { icon: '📋', label: 'Report Support', href: '/contact' },
    { icon: '🏠', label: 'Home Collection', href: '/diagnostics' },
    { icon: '👨‍⚕️', label: 'Talk to an Executive', href: 'tel:+919700104108' },
  ];

  return (
    <>
      <div className="fab-container" style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, transition: 'transform 0.3s, opacity 0.3s', transform: visible ? 'translateY(0)' : 'translateY(80px)', opacity: visible ? 1 : 0 }}>
        {showTrust && (
          <div className="fab-trust-badge" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e8edf2', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, animation: 'fabFadeIn 0.3s ease' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#16a34a' }}>🟢 Online Now</div>
              <div style={{ fontSize: 9, color: 'var(--text-secondary)' }}>Avg response: &lt; 2 min</div>
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
          <div onClick={e => e.stopPropagation()} className="fab-help-panel" style={{ position: 'fixed', bottom: 100, right: 24, background: '#fff', borderRadius: 16, padding: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', width: 240, animation: 'fabFadeIn 0.2s ease', zIndex: 9999 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#1a1a1a' }}>💬 Need Help?</div>
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
