import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { nursingCategories, nursingServices } from '../data/nursingData';
import NursingServiceCard from '../components/NursingServiceCard';

const sortOptions = [
  { value: 'popularity', labelKey: 'nursing.service.listing.sortPopularity', labelDefault: 'Popularity' },
  { value: 'price-low', labelKey: 'nursing.service.listing.sortPriceLow', labelDefault: 'Price: Low to High' },
  { value: 'price-high', labelKey: 'nursing.service.listing.sortPriceHigh', labelDefault: 'Price: High to Low' },
  { value: 'name', labelKey: 'nursing.service.listing.sortName', labelDefault: 'Name: A-Z' },
];

const CATEGORY_COLORS = {};
nursingCategories.forEach(c => { CATEGORY_COLORS[c.id] = c.color; });

const HERO_GRADIENT = 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)';

export default function NursingServiceListing() {
  const t = useT();
  const { category: slug } = useParams();

  const filteredByCat = useMemo(() => {
    if (!slug || slug === 'all') return nursingServices;
    return nursingServices.filter(s => s.category === slug);
  }, [slug]);

  const categories = nursingCategories;
  const allCategoryIds = categories.map(c => c.id);
  const catMeta = slug && slug !== 'all' ? categories.find(c => c.slug === slug || c.id === slug) : null;
  const displayCategory = catMeta || null;

  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  const results = useMemo(() => {
    let list = [...filteredByCat];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    if (activeCat) {
      list = list.filter(s => s.category === activeCat);
    }
    if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [filteredByCat, search, activeCat, sortBy]);

  const totalServices = nursingServices.length;
  const totalCategories = categories.length;
  const totalNurses = 50;

  return (
    <div>
      <div style={{ background: HERO_GRADIENT, padding: '28px 0 32px' }}>
        <div className="container">
          <Link to="/nursing-care" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>
            {t('nursing.service.listing.backToNursing', '← Back to Nursing Care')}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>🩺</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>
                {displayCategory ? displayCategory.name : t('nursing.service.listing.title', 'Nursing Services')}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '2px 0 0' }}>
                {displayCategory ? displayCategory.description : t('nursing.service.listing.subtitle', 'Professional nursing care services at your doorstep')}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{totalServices}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{t('nursing.service.listing.services', 'Services')}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{totalCategories}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{t('nursing.service.listing.categories', 'Categories')}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{totalNurses}+</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{t('nursing.service.listing.nurses', 'Nurses')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-section container" style={{ paddingTop: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <input type="text" placeholder={`${t('nursing.service.listing.search', 'Search')} ${t('nursing.service.listing.services', 'Services')}...`} value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 32px 8px 32px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            <span style={{ position: 'absolute', left: 10, top: 8, fontSize: 13, color: 'var(--text-secondary)' }}>🔍</span>
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 6, top: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#999', padding: '2px 6px', lineHeight: 1 }}>
                ✕
              </button>
            )}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, background: '#fff' }}>
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{t(opt.labelKey, opt.labelDefault)}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          <button onClick={() => setActiveCat('')}
            style={{ padding: '4px 12px', borderRadius: 16, border: `1px solid ${activeCat === '' ? '#7C3AED' : 'var(--border)'}`, background: activeCat === '' ? '#7C3AED15' : '#fff', color: activeCat === '' ? '#7C3AED' : 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', fontWeight: activeCat === '' ? 600 : 400 }}>
            {t('nursing.service.listing.all', 'All')}
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)}
              style={{ padding: '4px 12px', borderRadius: 16, border: `1px solid ${activeCat === cat.id ? cat.color : 'var(--border)'}`, background: activeCat === cat.id ? `${cat.color}15` : '#fff', color: activeCat === cat.id ? cat.color : 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', fontWeight: activeCat === cat.id ? 600 : 400 }}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
          {results.length} {t('nursing.service.listing.servicesFound', 'services found')}
        </p>

        {results.length > 0 ? (
          <div className="grid-3">
            {results.map(s => (
              <NursingServiceCard key={s.id} service={s} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>{t('nursing.service.listing.noServicesFound', 'No services found matching your criteria')}</p>
            <button onClick={() => { setSearch(''); setActiveCat(''); }} className="btn btn-outline" style={{ marginTop: 8 }}>
              {t('nursing.service.listing.clearFilters', 'Clear Filters')}
            </button>
          </div>
        )}
      </div>

      <div className="page-section" style={{ background: 'var(--bg-light)', paddingTop: 24, paddingBottom: 24 }}>
        <div className="container">
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
            {t('nursing.service.listing.browseCategories', 'Browse Categories')}
          </h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <Link key={cat.id} to={`/nursing-care/services/${cat.slug}`}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: `${cat.color}10`, borderRadius: 8, border: `1px solid ${cat.color}30`, textDecoration: 'none', fontSize: 12, color: cat.color, fontWeight: 500, transition: 'all 0.2s' }}>
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
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
