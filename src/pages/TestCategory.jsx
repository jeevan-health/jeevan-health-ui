import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import { seedTests, categoryList, getCategoryBySlug, makeSlug } from '../data/seedData';
import useCmsStore from '../stores/cmsStore';

export default function TestCategory() {
  const { category: slug } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(s => s.addItem);
  const diag = useCmsStore(s => s.content.diagnostics || {});

  const catMeta = getCategoryBySlug(slug);
  const displayName = slug === 'all' ? 'All Tests' : (catMeta ? catMeta.name : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));

  const allCategoryNames = categoryList.map(c => c.name);
  const fullList = slug === 'all' ? seedTests : (catMeta ? seedTests.filter(t => t.category === catMeta.name) : seedTests.filter(t =>
    t.name.toLowerCase().includes(slug.replace(/-/g, ' ')) ||
    (t.category || '').toLowerCase().includes(slug.replace(/-/g, ' '))
  ));

  const subcategories = useMemo(() => {
    return [...new Set(fullList.map(t => t.subcategory).filter(Boolean))];
  }, [fullList]);

  const [search, setSearch] = useState('');
  const [activeSubcat, setActiveSubcat] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  const results = useMemo(() => {
    let list = [...fullList];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    if (activeSubcat) list = list.filter(t => t.subcategory === activeSubcat);
    if (sortBy === 'price-low') list.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
    else if (sortBy === 'price-high') list.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [fullList, search, activeSubcat, sortBy]);

  const catIcon = catMeta ? catMeta.icon : '🔬';
  const catColor = catMeta ? catMeta.color : 'var(--primary)';
  const catDesc = catMeta ? catMeta.description : 'Browse all available diagnostic tests';

  if (!catMeta && slug !== 'all') {
    const slugTest = seedTests.find(t => makeSlug(t.name) === slug);
    if (slugTest) {
      navigate(`/test/${slug}`, { replace: true });
      return null;
    }
  }

  const popularSubs = subcategories.slice(0, 6);

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${catColor} 0%, ${catColor}cc 100%)`, padding: '28px 0 32px' }}>
        <div className="container">
          <Link to="/diagnostics" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>← Back to Diagnostics</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>{catIcon}</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>{displayName}</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '2px 0 0' }}>{catDesc}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{fullList.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>Tests</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{subcategories.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>Categories</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>⏱ 24h</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>Avg Report</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>✓ Free</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>Home Pickup</div>
            </div>
          </div>
        </div>
      </div>

      {fullList.length >= 3 && !catMeta?.name?.startsWith('Full') && (
        <div className="page-section" style={{ background: 'var(--bg-light)', paddingTop: 20, paddingBottom: 20 }}>
          <div className="container">
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Recommended for You</h2>
            <div className="grid-3">
              {fullList.filter(t => !t.name.toLowerCase().includes('panel') && !t.name.toLowerCase().includes('profile')).slice(0, 3).map(t => (
                <div key={t.id} className="test-card" style={{ borderLeft: `4px solid ${catColor}` }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <h3>{t.name}</h3>
                      <span className="badge" style={{ background: `${catColor}15`, color: catColor, fontSize: 10 }}>Popular</span>
                    </div>
                    <div className="desc">{t.description}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>
                      <span>🩸 {t.category}</span>
                      <span>⏱ {t.report_time || '24 hrs'}</span>
                      <span>{t.fasting_required ? '🌙 Fasting' : '🍽 No Fasting'}</span>
                    </div>
                  </div>
                  <div className="footer" style={{ marginTop: 10 }}>
                    <div>
                      <span className="price">₹{t.offerPrice || t.price}</span>
                      {(t.mrp && t.mrp !== (t.offerPrice || t.price)) && <span className="mrp">₹{t.mrp}</span>}
                      <div style={{ fontSize: 10, color: 'var(--secondary)', fontWeight: 600, marginTop: 1 }}>{diag.freeHomeCollectionTag || 'Free Home Collection'}</div>
                    </div>
                    <button onClick={() => { addItem({ id: t.id, name: t.name, price: t.price, offerPrice: t.offerPrice, type: 'test' }); navigate('/checkout'); }} className="btn btn-primary btn-sm">Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="page-section container" style={{ paddingTop: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <input type="text" placeholder={`Search ${displayName}...`} value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            <span style={{ position: 'absolute', left: 10, top: 8, fontSize: 13, color: 'var(--text-secondary)' }}>🔍</span>
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, background: '#fff' }}>
            <option value="popularity">Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>

        {popularSubs.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            <button onClick={() => setActiveSubcat('')}
              style={{ padding: '4px 12px', borderRadius: 16, border: `1px solid ${activeSubcat === '' ? catColor : 'var(--border)'}`, background: activeSubcat === '' ? `${catColor}15` : '#fff', color: activeSubcat === '' ? catColor : 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', fontWeight: activeSubcat === '' ? 600 : 400 }}>
              All
            </button>
            {popularSubs.map(sub => (
              <button key={sub} onClick={() => setActiveSubcat(sub)}
                style={{ padding: '4px 12px', borderRadius: 16, border: `1px solid ${activeSubcat === sub ? catColor : 'var(--border)'}`, background: activeSubcat === sub ? `${catColor}15` : '#fff', color: activeSubcat === sub ? catColor : 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', fontWeight: activeSubcat === sub ? 600 : 400 }}>
                {sub}
              </button>
            ))}
          </div>
        )}

        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>{results.length} test{results.length !== 1 ? 's' : ''} found</p>

        {results.length > 0 ? (
          <div className="grid-3">
            {results.map(t => (
              <div key={t.id} className="test-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <h3>{t.name}</h3>
                    <span className="badge badge-primary" style={{ fontSize: 10, whiteSpace: 'nowrap' }}>{t.category}</span>
                  </div>
                  <div className="desc">{t.description}</div>
                  <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>
                    <span>⏱ {t.report_time || '24 hrs'}</span>
                    <span>{t.fasting_required ? '🌙 Fasting Required' : '🍽 No Fasting'}</span>
                  </div>
                </div>
                <div className="footer" style={{ marginTop: 12 }}>
                  <div>
                    <span className="price">₹{t.offerPrice || t.price}</span>
                    {(t.mrp && t.mrp !== (t.offerPrice || t.price)) && <span className="mrp">₹{t.mrp}</span>}
                    <div style={{ fontSize: 10, color: 'var(--secondary)', fontWeight: 600, marginTop: 2 }}>{diag.freeHomeCollectionTag || 'Free Home Collection'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/test/${makeSlug(t.name)}`} className="btn btn-outline btn-sm">Details</Link>
                    <button onClick={() => { addItem({ id: t.id, name: t.name, price: t.price, offerPrice: t.offerPrice, type: 'test' }); navigate('/checkout'); }} className="btn btn-primary btn-sm">Book</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>No tests found matching your criteria</p>
            <button onClick={() => { setSearch(''); setActiveSubcat(''); }} className="btn btn-outline" style={{ marginTop: 8 }}>Clear Filters</button>
          </div>
        )}
      </div>

      {slug !== 'all' && allCategoryNames.length > 1 && (
        <div className="page-section" style={{ background: 'var(--bg-light)', paddingTop: 24, paddingBottom: 24 }}>
          <div className="container">
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Browse Other Categories</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {allCategoryNames.filter(n => (!catMeta || n !== catMeta.name)).slice(0, 8).map(name => {
                const meta = categoryList.find(c => c.name === name);
                return (
                  <Link key={name} to={`/tests/${meta?.id || makeSlug(name)}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#fff', borderRadius: 8, border: '1px solid var(--border)', textDecoration: 'none', fontSize: 12, color: 'var(--text)', transition: 'all 0.2s' }}>
                    <span>{meta?.icon || '🔬'}</span>
                    <span style={{ fontWeight: 500 }}>{name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .test-card { background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 20px; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); display: flex; flex-direction: column; }
        .test-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-6px) scale(1.02); }
        .test-card h3 { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
        .test-card .desc { font-size: 12px; color: var(--text-secondary); margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .test-card .footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; gap: 8px; }
        .test-card .price { font-size: 16px; font-weight: 700; color: var(--brand-secondary); }
        .test-card .mrp { font-size: 11px; color: var(--text-secondary); text-decoration: line-through; margin-left: 4px; }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
        @media (max-width: 768px) {
          .grid-3 { grid-template-columns: 1fr; }
          .test-card { padding: 16px; }
          .test-card:hover { transform: none; }
        }
        @media (max-width: 480px) {
          .test-card { padding: 12px; }
          .test-card h3 { font-size: 13px; }
          .test-card .price { font-size: 14px; }
        }
      `}</style>
    </div>
  );
}