import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { vaccines, vaccineCategories, getCategoryBySlug } from '../data/vaccinationData';
import VaccineCard from '../components/VaccineCard';

const ageSubcategories = ['Birth', '0-5 Years', '5-18 Years', '18+ Years', '60+ Years', 'Pregnancy'];

export default function VaccineCategoryPage() {
  const t = useT();
  const { slug } = useParams();
  const catMeta = getCategoryBySlug(slug);
  const displayName = slug === 'all' ? t('all.vaccines') : (catMeta ? catMeta.name : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));

  const fullList = slug === 'all' ? vaccines : (catMeta ? vaccines.filter(v => v.category === catMeta.id) : vaccines);

  const subcategories = useMemo(() => {
    return [...new Set(fullList.map(v => v.ageGroup).filter(Boolean))].filter(s => ageSubcategories.some(a => s.includes(a)));
  }, [fullList]);

  const [search, setSearch] = useState('');
  const [activeSubcat, setActiveSubcat] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

  const results = useMemo(() => {
    let list = [...fullList];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(v => v.name.toLowerCase().includes(q) || v.disease?.toLowerCase().includes(q) || v.description?.toLowerCase().includes(q));
    }
    if (activeSubcat) list = list.filter(v => v.ageGroup?.includes(activeSubcat));
    if (availabilityFilter) list = list.filter(v => v.availability === availabilityFilter);
    if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'doses') list.sort((a, b) => a.doseCount - b.doseCount);
    return list;
  }, [fullList, search, activeSubcat, sortBy, availabilityFilter]);

  const catIcon = catMeta ? catMeta.icon : '💉';
  const catColor = catMeta ? catMeta.color : '#0891b2';
  const catDesc = catMeta ? catMeta.description : 'Browse all available vaccines';

  const popularSubs = subcategories.slice(0, 6);

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${catColor} 0%, ${catColor}cc 100%)`, padding: '28px 0 32px' }}>
        <div className="container">
          <Link to="/vaccination" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>{t('back.to.vaccination')}</Link>
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
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{t('vaccines')}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{subcategories.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{t('age.groups', 'Age Groups')}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>💉</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>Vaccines</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 80 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>✓ Home</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{t('available', 'Available')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-section container" style={{ paddingTop: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <input type="text" placeholder={t('search.vaccines.placeholder', 'Search vaccines...')} value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            <span style={{ position: 'absolute', left: 10, top: 8, fontSize: 13, color: 'var(--text-secondary)' }}>🔍</span>
          </div>
          <select value={availabilityFilter} onChange={e => setAvailabilityFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, background: '#fff' }}>
            <option value="">{t('all.availability')}</option>
            <option value="Home & Clinic">{t('home.and.clinic')}</option>
            <option value="Clinic Only">{t('clinic.only')}</option>
            <option value="Home Only">{t('home.only')}</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, background: '#fff' }}>
            <option value="popularity">{t('sort.popularity', 'Popularity')}</option>
            <option value="price-low">{t('sort.price.low', 'Price: Low to High')}</option>
            <option value="price-high">{t('sort.price.high', 'Price: High to Low')}</option>
            <option value="name">{t('sort.name', 'Name: A-Z')}</option>
            <option value="doses">{t('sort.doses', 'Dose Count')}</option>
          </select>
        </div>

        {popularSubs.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            <button onClick={() => setActiveSubcat('')}
              style={{ padding: '4px 12px', borderRadius: 16, border: `1px solid ${activeSubcat === '' ? catColor : 'var(--border)'}`, background: activeSubcat === '' ? `${catColor}15` : '#fff', color: activeSubcat === '' ? catColor : 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', fontWeight: activeSubcat === '' ? 600 : 400 }}>
              {t('all.ages')}
            </button>
            {popularSubs.map(sub => (
              <button key={sub} onClick={() => setActiveSubcat(sub)}
                style={{ padding: '4px 12px', borderRadius: 16, border: `1px solid ${activeSubcat === sub ? catColor : 'var(--border)'}`, background: activeSubcat === sub ? `${catColor}15` : '#fff', color: activeSubcat === sub ? catColor : 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', fontWeight: activeSubcat === sub ? 600 : 400 }}>
                {sub}
              </button>
            ))}
          </div>
        )}

        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>{results.length} {t('vaccines').toLowerCase()} {t('found', 'found')}</p>

        {results.length > 0 ? (
          <div className="grid-3">
            {results.map(v => (
              <VaccineCard key={v.id} vaccine={v} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>{t('no.vaccines.found')}</p>
            <button onClick={() => { setSearch(''); setActiveSubcat(''); setAvailabilityFilter(''); }} className="btn btn-outline" style={{ marginTop: 8 }}>{t('clear.filters')}</button>
          </div>
        )}
      </div>

      {slug !== 'all' && vaccineCategories.length > 1 && (
        <div className="page-section" style={{ background: 'var(--bg-light)', paddingTop: 24, paddingBottom: 24 }}>
          <div className="container">
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{t('browse.other', 'Browse Other Vaccine Categories')}</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {vaccineCategories.filter(c => slug !== c.slug).slice(0, 10).map(cat => (
                <Link key={cat.id} to={`/vaccination/category/${cat.slug}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#fff', borderRadius: 8, border: '1px solid var(--border)', textDecoration: 'none', fontSize: 12, color: 'var(--text)', transition: 'all 0.2s' }}>
                  <span>{cat.icon}</span>
                  <span style={{ fontWeight: 500 }}>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
        @media (max-width: 768px) { .grid-3 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

