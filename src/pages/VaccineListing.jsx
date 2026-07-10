import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { vaccines, vaccineCategories } from '../data/vaccinationData';

const BADGES = ['Most Booked', 'Recommended', 'Popular'];

export default function VaccineListing() {
  const t = useT();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('');
  const [activeAge, setActiveAge] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  const ageGroups = ['0-1 Year', '1-5 Years', '5-18 Years', '18+ Years', '50+ Years'];

  const filtered = useMemo(() => {
    let list = [...vaccines];
    const q = search.toLowerCase();
    if (q) list = list.filter(v => v.name.toLowerCase().includes(q) || v.disease.toLowerCase().includes(q) || v.description?.toLowerCase().includes(q));
    if (activeCat) list = list.filter(v => v.category === activeCat);
    if (activeAge) list = list.filter(v => v.ageGroup === activeAge || v.ageGroup.includes(activeAge));
    if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search, activeCat, activeAge, sortBy]);

  const activeColor = vaccineCategories.find(c => c.id === activeCat)?.color || '#2563eb';

  return (
    <div className="page-section">
      <div style={{
        background: 'linear-gradient(135deg, #0D47A1, #1976D2)', color: '#fff', padding: '40px 0 36px', marginTop: 'calc(-1 * var(--header-height, 0px))',
        paddingTop: 'calc(40px + var(--header-height, 60px))',
      }}>
        <div className="container">
          <Link to="/vaccination" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
            ← {t('back.to.vaccination', 'Back to Vaccination')}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 32 }}>💉</span>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{t('all.vaccines', 'All Vaccines')}</h1>
              <p style={{ fontSize: 13, opacity: 0.85, margin: '2px 0 0' }}>{t('vaccine.listing.subtitle', 'Complete vaccination list — find the right vaccine for you and your family')}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 12 }}>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.15)', fontWeight: 600 }}>{vaccines.length} Vaccines</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.15)', fontWeight: 600 }}>{vaccineCategories.length} Categories</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.15)', fontWeight: 600 }}>🚚 Free Home Visit</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.15)', fontWeight: 600 }}>🔬 Govt Certified</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: 8, fontSize: 14, opacity: 0.4 }}>🔍</span>
            <input type="text" placeholder={t('search.vaccines.placeholder', 'Search vaccines...')} value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: 7, border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, opacity: 0.4 }}>✕</button>}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
            <option value="popularity">{t('sort.popularity', 'Popularity')}</option>
            <option value="price-low">{t('sort.priceLow', 'Price: Low to High')}</option>
            <option value="price-high">{t('sort.priceHigh', 'Price: High to Low')}</option>
            <option value="name">{t('sort.name', 'Name A-Z')}</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10, overflowX: 'auto', paddingBottom: 4 }}>
          <button onClick={() => setActiveCat('')}
            style={{ padding: '4px 14px', borderRadius: 16, border: `1px solid ${!activeCat ? activeColor : '#d0d5dd'}`, background: !activeCat ? `${activeColor}15` : '#fff', color: !activeCat ? activeColor : '#64748b', fontSize: 11, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {t('all.categories', 'All Categories')}
          </button>
          {vaccineCategories.map(c => (
            <button key={c.id} onClick={() => setActiveCat(activeCat === c.id ? '' : c.id)}
              style={{ padding: '4px 14px', borderRadius: 16, border: `1px solid ${activeCat === c.id ? c.color : '#d0d5dd'}`, background: activeCat === c.id ? `${c.color}15` : '#fff', color: activeCat === c.id ? c.color : '#64748b', fontSize: 11, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          <button onClick={() => setActiveAge('')}
            style={{ padding: '3px 12px', borderRadius: 12, border: `1px solid ${!activeAge ? '#64748b' : '#d0d5dd'}`, background: !activeAge ? '#f1f5f9' : '#fff', color: '#64748b', fontSize: 10, cursor: 'pointer', fontWeight: 500 }}>
            {t('all.ages', 'All Ages')}
          </button>
          {ageGroups.map(a => (
            <button key={a} onClick={() => setActiveAge(activeAge === a ? '' : a)}
              style={{ padding: '3px 12px', borderRadius: 12, border: `1px solid ${activeAge === a ? '#2563eb' : '#d0d5dd'}`, background: activeAge === a ? '#EFF6FF' : '#fff', color: activeAge === a ? '#2563eb' : '#64748b', fontSize: 10, cursor: 'pointer', fontWeight: 500 }}>
              {a}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>
          {t('results.count', 'Showing')} {filtered.length} {t('vaccines.found', 'vaccines')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map((v, i) => {
            const cat = vaccineCategories.find(c => c.id === v.category);
            const color = cat?.color || '#2563eb';
            const badgeText = BADGES[i % BADGES.length];
            return (
              <div key={v.id} onClick={() => navigate(`/vaccination/${v.slug}`)} style={{ borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s', display: 'flex', flexDirection: 'column' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)`, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>💉</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 0.5, color: '#fff' }}>{cat?.name || v.category}</span>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.25)', color: '#fff' }}>{badgeText}</span>
                </div>
                <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{v.disease}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#EFF6FF', color: '#2563eb', fontWeight: 600 }}>Age: {v.ageGroup}</span>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#F0FDF4', color: '#16a34a', fontWeight: 600 }}>{v.doseCount} Dose{v.doseCount > 1 ? 's' : ''}</span>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#FFF7ED', color: '#ea580c', fontWeight: 600 }}>{v.availability}</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 0, lineHeight: 1.4, flex: 1 }}>{v.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: 8, marginTop: 8 }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#059669', fontSize: 16 }}>₹{v.price}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400, marginLeft: 2 }}>/ {t('per.dose', 'dose')}</span>
                    </div>
                    <button onClick={e => { e.stopPropagation(); navigate(`/vaccination/${v.slug}`); }}
                      style={{ fontSize: 11, color: '#fff', fontWeight: 600, background: color, border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer' }}>
                      {t('book.now', 'Book Now')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>💉</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{t('no.vaccines.found.title', 'No vaccines found')}</p>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{t('no.vaccines.found.desc', 'Try adjusting your search or filters')}</p>
            <button onClick={() => { setSearch(''); setActiveCat(''); setActiveAge(''); }} style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, background: 'none', border: '1px solid #2563eb', padding: '6px 16px', borderRadius: 8, cursor: 'pointer' }}>
              {t('clear.filters', 'Clear Filters')}
            </button>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{t('browse.categories', 'Browse Vaccine Categories')}</h3>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {vaccineCategories.map(c => (
              <Link key={c.id} to={`/vaccination/category/${c.slug}`}
                style={{ padding: '5px 14px', borderRadius: 16, border: `1px solid ${c.color}`, color: c.color, fontSize: 11, fontWeight: 600, textDecoration: 'none', background: `${c.color}06` }}>
                {c.icon} {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .page-section { padding: 0; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
      `}</style>
    </div>
  );
}
