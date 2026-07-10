import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { searchTests, getPopularSearches } from '../../utils/searchIntelligence';
import { packageList } from '../../data/healthPackages';
import { useT } from '../../i18n/LanguageProvider';

export default function SmartSearch({ placeholder, onSearch, autoFocus, value: externalValue, onChange: externalOnChange, onSubmit: externalOnSubmit }) {
  const isControlled = externalValue !== undefined;
  const [internalQuery, setInternalQuery] = useState('');
  const query = isControlled ? externalValue : internalQuery;
  const setQuery = isControlled ? externalOnChange || (() => {}) : setInternalQuery;
  const [results, setResults] = useState([]);
  const [popular, setPopular] = useState([]);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const t = useT();
  const ref = useRef();
  const navigate = useNavigate();

  const pkgResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return packageList.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.conditions?.some(c => c.toLowerCase().includes(q)) ||
      p.benefits?.some(b => b.toLowerCase().includes(q))
    ).slice(0, 4);
  }, [query]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 1) { setResults([]); setPopular([]); setOpen(false); return; }
    const r = searchTests(q);
    setResults(r);
    setPopular(getPopularSearches(q));
    setOpen(true);
    setFocusIndex(-1);
  }, [query]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = useCallback((slug) => {
    setOpen(false);
    if (!isControlled) setInternalQuery('');
    if (onSearch) onSearch(slug);
    else navigate(`/test/${slug}`);
  }, [navigate, onSearch, isControlled]);

  const handleKey = (e) => {
    const items = [...results.map(r => r.test?.slug || r.symptom), ...popular.map(p => p)];
    if (e.key === 'Enter' && focusIndex < 0) {
      if (externalOnSubmit) externalOnSubmit(query);
      else if (query.trim()) navigate(`/diagnostics?q=${encodeURIComponent(query.trim())}`);
      return;
    }
    if (!items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIndex(i => Math.min(i + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusIndex(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter' && focusIndex >= 0) {
      const val = items[focusIndex];
      if (focusIndex < results.length) { select(val); }
      else { navigate(`/diagnostics?q=${encodeURIComponent(query)}`); setOpen(false); }
    }
  };

  const handleChange = (val) => {
    if (isControlled && externalOnChange) externalOnChange(val);
    else if (!isControlled) setInternalQuery(val);
  };

  const slugify = (name) => name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '';

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <div style={{ display: 'flex', border: '2px solid #d0d5dd', borderRadius: 10, overflow: 'hidden', background: '#fff', transition: 'border-color 0.2s' }}>
        <input type="text" value={query} onChange={e => handleChange(e.target.value)}
          onKeyDown={handleKey} onFocus={() => query.trim() && setOpen(true)} autoFocus={autoFocus}
          placeholder={placeholder || t('smartSearch.placeholder', '🔍 Search tests, symptoms, diseases...')}
          style={{ flex: 1, border: 'none', padding: '9px 8px 9px 12px', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
        {query && <button onClick={() => { handleChange(''); setOpen(false); }} style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', fontSize: 16, color: '#999' }}>✕</button>}
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #e8edf2', zIndex: 9999, maxHeight: 420, overflow: 'auto' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e8edf2', padding: '6px 8px', gap: 4, background: '#fafafa', position: 'sticky', top: 0, zIndex: 1 }}>
              {[
                { key: 'all', label: `${t('smartSearch.filterAll', 'All')} (${results.length + pkgResults.length})` },
                { key: 'tests', label: `${t('smartSearch.filterIndividual', 'Individual')} (${results.length})` },
                { key: 'packages', label: `${t('smartSearch.filterPackages', 'Packages')} (${pkgResults.length})` },
              ].map(tab => (
              <button key={tab.key} onClick={() => setFilter(tab.key)}
                style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: filter === tab.key ? '#1866C9' : 'transparent', color: filter === tab.key ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {filter === 'tests' && results.length === 0 && (
            <div style={{ padding: 16, fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>{t('smartSearch.noTests', 'No tests found. Try searching for a symptom or disease.')}</div>
          )}
          {filter === 'all' && results.length === 0 && pkgResults.length === 0 && (
            <div style={{ padding: 16, fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>{t('smartSearch.noResults', 'No tests or packages found. Try a different search term.')}</div>
          )}
          {filter === 'packages' && pkgResults.length === 0 && (
            <div style={{ padding: 16, fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>{t('smartSearch.noPackages', 'No packages found. Try a different search term.')}</div>
          )}

          {(filter === 'all' || filter === 'packages') && pkgResults.length > 0 && (
            <div>
              {filter !== 'packages' && <div style={{ padding: '6px 14px', fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', background: '#f8fafc' }}>{t('smartSearch.healthPackages', 'Health Packages')}</div>}
              {pkgResults.map(pkg => (
                <Link key={pkg.slug} to={`/package/${pkg.slug}`} onClick={() => { setOpen(false); if (!isControlled) setInternalQuery(''); }}
                  style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ fontSize: 16 }}>📦</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{pkg.name}</div>
                    <div style={{ fontSize: 10, color: '#16a34a', fontWeight: 600 }}>₹{pkg.offerPrice} · {pkg.testCount} tests · {pkg.discount}% off</div>
                  </div>
                  <span style={{ fontSize: 10, color: '#1866C9', fontWeight: 600 }}>{t('smartSearch.view', 'View →')}</span>
                </Link>
              ))}
            </div>
          )}

          {(filter === 'all' || filter === 'tests') && results.map((r, i) => {
            if (r.matchType === 'symptom') {
              return (
                <div key={`sym-${r.symptom}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ padding: '10px 14px', background: '#FFF8E1', fontSize: 12, fontWeight: 600, color: '#E65100', display: 'flex', alignItems: 'center', gap: 6 }}>
                    🤒 "{r.symptom}" — {t('smartSearch.recommendedTests', 'Recommended Tests')}:
                  </div>
                  {r.tests.slice(0, 4).map(t => {
                    const slug = slugify(t.name);
                    return (
                      <div key={t.name} onClick={() => select(slug)} style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: i === focusIndex ? '#F5FAFF' : 'transparent' }}
                        onMouseEnter={() => setFocusIndex(i)}>
                        <span>🧪</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{t.name}</div>
                          <div style={{ fontSize: 10, color: '#16a34a', fontWeight: 600 }}>₹{t.offerPrice || t.price}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }
            const slug = r.test?.slug || slugify(r.test?.name);
            return (
              <div key={r.test?.id || i} onClick={() => select(slug)} style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', background: i === focusIndex ? '#F5FAFF' : 'transparent' }}
                onMouseEnter={() => setFocusIndex(i)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>🩸</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{r.test?.name}</span>
                  {r.matchType === 'exact' && <span style={{ fontSize: 9, background: '#E8F1FC', color: '#1866C9', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>{t('smartSearch.bestMatch', 'Best Match')}</span>}
                </div>
                {r.aliases?.length > 0 && (
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    {t('smartSearch.alsoCalled', 'Also called')}: {r.aliases.slice(0, 4).map(a => <span key={a} style={{ background: '#f5f5f5', padding: '1px 6px', borderRadius: 3, marginRight: 3 }}>{a}</span>)}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>₹{r.test?.offerPrice || r.test?.price}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>⏱ {r.test?.report_time}</span>
                  {r.test?.fasting_required && <span style={{ color: '#E65100' }}>🕐 {t('smartSearch.fasting', 'Fasting')}</span>}
                  {!r.test?.fasting_required && <span style={{ color: '#16a34a' }}>✅ {t('smartSearch.noFasting', 'No Fasting')}</span>}
                </div>
                {r.diseases?.length > 0 && (
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginTop: 4 }}>
                    {r.diseases.slice(0, 3).map(d => <span key={d} style={{ fontSize: 9, background: '#FEF2F2', color: '#dc2626', padding: '1px 6px', borderRadius: 3 }}>🦠 {d}</span>)}
                  </div>
                )}
              </div>
            );
          })}
          {popular.length > 0 && (
            <div style={{ borderTop: '1px solid #f0f0f0', padding: '8px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>{t('smartSearch.popularSearches', 'Popular Searches')}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {popular.map(p => (
                  <span key={p} onClick={() => navigate(`/diagnostics?q=${encodeURIComponent(p)}`)} style={{ fontSize: 10, background: '#f5f5f5', padding: '3px 8px', borderRadius: 6, cursor: 'pointer', color: '#1866C9' }}>
                    🔹 {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
