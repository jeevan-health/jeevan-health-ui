import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import useCartStore from '../../stores/cartStore';
import useUploadModal from '../../stores/uploadModalStore';
import { seedTests } from '../../data/seedData';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const count = useCartStore(s => s.getCount());
  const inputRef = useRef();
  const suggestRef = useRef();

  useEffect(() => {
    setMobileOpen(false);
    setShowSuggestions(false);
  }, [location]);

  useEffect(() => {
    if (searchVal.trim().length < 1) { setSuggestions([]); return; }
    const q = searchVal.toLowerCase();
    const matches = seedTests.filter(t =>
      t.name.toLowerCase().includes(q) || (t.category || '').toLowerCase().includes(q)
    ).slice(0, 8);
    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  }, [searchVal]);

  useEffect(() => {
    const handler = (e) => { if (suggestRef.current && !suggestRef.current.contains(e.target) && inputRef.current && !inputRef.current.contains(e.target)) setShowSuggestions(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectTest = (test) => {
    const slug = test.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setSearchVal('');
    setShowSuggestions(false);
    navigate(`/test/${slug}`);
  };

  const handleSearchKey = (e) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      setShowSuggestions(false);
      navigate(`/diagnostics?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 1000, background: '#fff', borderBottom: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div className="header-inner" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', maxWidth: 1200, margin: '0 auto' }}>

        <Link to="/" className="header-logo" style={{ flexShrink: 0 }}>
          <img src="/logo.png" alt="Jeevan HealthCare" style={{ height: 32, display: 'block' }} />
        </Link>

        <div className="hdr-search-wrap" style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f5f6fa', borderRadius: 8, border: '1px solid #e0e3eb' }}>
            <input ref={inputRef} type="text" value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onFocus={() => suggestions.length && setShowSuggestions(true)}
              onKeyDown={handleSearchKey}
              placeholder="Search Tests..."
              style={{ flex: 1, border: 'none', background: 'transparent', padding: '8px 12px', fontSize: 13, outline: 'none', fontFamily: 'inherit', minWidth: 0 }}
            />
            <Link to={searchVal.trim() ? `/diagnostics?q=${encodeURIComponent(searchVal.trim())}` : '/diagnostics'}
              onClick={() => setShowSuggestions(false)}
              style={{ padding: '6px 10px', color: 'var(--primary)', fontWeight: 600, fontSize: 12, textDecoration: 'none' }}>
              🔍
            </Link>
          </div>
          {showSuggestions && (
            <div ref={suggestRef} style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e0e3eb', borderRadius: 8, marginTop: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: 320, overflow: 'auto' }}>
              {suggestions.map(t => (
                <div key={t.id} onClick={() => selectTest(t)}
                  style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t.category}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', whiteSpace: 'nowrap' }}>₹{t.offerPrice || t.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <a href="tel:+919700104108" className="hdr-btn hdr-emergency" title="Emergency Contact" style={{ flexShrink: 0 }}>
          🚨 Emergency
        </a>

        <button onClick={() => useUploadModal.getState().setOpen(true)} className="hdr-btn hdr-upload" style={{ flexShrink: 0, fontFamily: 'inherit', cursor: 'pointer' }}>
          📤 Upload
        </button>

        <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" className="hdr-btn hdr-wa" style={{ flexShrink: 0 }}>
          💬 WhatsApp
        </a>

        <div className="hdr-right" style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <button className="hdr-btn hdr-cart" style={{ position: 'relative', padding: '6px 10px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>
            🛒
            {count > 0 && <span style={{ background: 'var(--primary)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10, lineHeight: '16px', marginLeft: 2 }}>{count > 9 ? '9+' : count}</span>}
          </button>

          {isAuthenticated ? (
            <Link to="/dashboard" className="hdr-btn hdr-login" style={{ padding: '6px 10px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 8, background: '#fff', textDecoration: 'none', color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: 4 }}>
              👤
            </Link>
          ) : (
            <Link to="/signup" className="hdr-btn hdr-login" style={{ padding: '6px 12px', fontSize: 13, background: 'var(--primary)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              👤 Login
            </Link>
          )}

          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', padding: '2px 6px', display: 'none' }}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}
