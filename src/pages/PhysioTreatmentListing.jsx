import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import TreatmentCard from '../components/TreatmentCard';
import { physioCategories, physioPackages } from '../data/physiotherapyData';

export default function PhysioTreatmentListing() {
  const t = useT();

  const treatments = physioCategories.flatMap(cat =>
    cat.conditions.slice(0, 6).map((condition, i) => ({
      slug: condition.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: condition,
      category: cat.name,
      categorySlug: cat.slug,
      icon: cat.icon,
      color: cat.color,
      description: cat.description,
      conditions: cat.conditions.slice(0, 3),
      treatments: cat.treatments?.slice(0, 3) || [],
      price: physioPackages.find(p => p.popular)?.price || 2499,
      originalPrice: physioPackages.find(p => p.popular)?.originalPrice || 3499,
      sessions: physioPackages.find(p => p.popular)?.sessions || 5,
      duration: '45 min',
      popular: i === 0,
    }))
  );

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  const filtered = useMemo(() => {
    let list = [...treatments];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    if (activeCategory) list = list.filter(t => t.categorySlug === activeCategory);
    if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [treatments, search, activeCategory, sortBy]);

  const accentColor = '#0d9488';

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)', padding: '28px 0 32px' }}>
        <div className="container">
          <Link to="/physiotherapy" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>
            {t('physio.treatments.backLink', '← Back to Physiotherapy')}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>💪</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>
                {t('physio.treatments.title', 'Physiotherapy Treatments')}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '2px 0 0' }}>
                {t('physio.treatments.subtitle', 'Professional physiotherapy services tailored to your recovery needs')}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{treatments.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{t('physio.treatments.treatments', 'Treatments')}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{physioCategories.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{t('physio.treatments.categories', 'Categories')}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{t('physio.treatments.avgSession', '⏱ 45 min')}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{t('physio.treatments.avgSessionLabel', 'Avg Session')}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{t('physio.treatments.homeVisit', '✓ Home')}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{t('physio.treatments.homeVisitLabel', 'Home Visit')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-section container" style={{ paddingTop: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <input type="text"
              placeholder={t('physio.treatments.searchPlaceholder', 'Search treatments...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            <span style={{ position: 'absolute', left: 10, top: 8, fontSize: 13, color: 'var(--text-secondary)' }}>🔍</span>
            {search && (
              <button onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 8, top: 7, background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: 'var(--text-secondary)', padding: 0, lineHeight: 1 }}>
                ✕
              </button>
            )}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, background: '#fff' }}>
            <option value="popularity">{t('physio.treatments.sortPopularity', 'Popularity')}</option>
            <option value="price-low">{t('physio.treatments.sortPriceLow', 'Price: Low to High')}</option>
            <option value="price-high">{t('physio.treatments.sortPriceHigh', 'Price: High to Low')}</option>
            <option value="name">{t('physio.treatments.sortName', 'Name A-Z')}</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: 4 }}>
          <button onClick={() => setActiveCategory('')}
            style={{ padding: '4px 12px', borderRadius: 16, border: `1px solid ${activeCategory === '' ? accentColor : 'var(--border)'}`, background: activeCategory === '' ? `${accentColor}15` : '#fff', color: activeCategory === '' ? accentColor : 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', fontWeight: activeCategory === '' ? 600 : 400, flexShrink: 0 }}>
            {t('physio.treatments.all', 'All')}
          </button>
          {physioCategories.map(cat => (
            <button key={cat.slug} onClick={() => setActiveCategory(cat.slug)}
              style={{ padding: '4px 12px', borderRadius: 16, border: `1px solid ${activeCategory === cat.slug ? (cat.color || accentColor) : 'var(--border)'}`, background: activeCategory === cat.slug ? `${cat.color || accentColor}15` : '#fff', color: activeCategory === cat.slug ? (cat.color || accentColor) : 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', fontWeight: activeCategory === cat.slug ? 600 : 400, flexShrink: 0 }}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
          {filtered.length} {t('physio.treatments.treatmentsFound', 'treatments found')}
        </p>

        {filtered.length > 0 ? (
          <div className="grid-3">
            {filtered.map(t => (
              <TreatmentCard key={t.slug} treatment={t} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
              {t('physio.treatments.noTreatmentsFound', 'No treatments found matching your search')}
            </p>
            <button onClick={() => { setSearch(''); setActiveCategory(''); }}
              className="btn btn-outline" style={{ marginTop: 8 }}>
              {t('physio.treatments.clearFilters', 'Clear Filters')}
            </button>
          </div>
        )}
      </div>

      <div className="page-section" style={{ background: 'var(--bg-light)', paddingTop: 24, paddingBottom: 24 }}>
        <div className="container">
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
            {t('physio.treatments.browseCategories', 'Browse Categories')}
          </h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {physioCategories.map(cat => (
              <Link key={cat.slug} to={`/physiotherapy/category/${cat.slug}`}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#fff', borderRadius: 8, border: '1px solid var(--border)', textDecoration: 'none', fontSize: 12, color: 'var(--text)', transition: 'all 0.2s' }}>
                <span>{cat.icon}</span>
                <span style={{ fontWeight: 500 }}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
        @media (max-width: 768px) {
          .grid-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
