import React, { useState, useMemo, useEffect } from 'react';
import { useT } from '../i18n/LanguageProvider';
import { Link, useNavigate } from 'react-router-dom';
import useUploadModal from '../stores/uploadModalStore';
import useCartStore from '../stores/cartStore';
import { seedTests, categoryList, makeSlug, subscribe, ensureLoaded } from '../data/seedData';
import SmartSearch from '../components/layout/SmartSearch';
import TestCard from '../components/TestCard';
import PhysioCrossSell from '../components/PhysioCrossSell';
import VaccineCrossSell from '../components/VaccineCrossSell';
import useCmsStore from '../stores/cmsStore';

export default function Diagnostics() {
  const t = useT();
  const navigate = useNavigate();
  const addItem = useCartStore(s => s.addItem);
  const cmsContent = useCmsStore(s => s.content);
  const diag = cmsContent.diagnostics || {};
  const [search, setSearch] = useState('');
  const [searched, setSearched] = useState(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => { ensureLoaded(); const unsub = subscribe(() => forceUpdate(n => n + 1)); return unsub; }, []);

  const searchResults = useMemo(() => {
    if (!search) return [];
    const q = search.toLowerCase();
    return seedTests.filter(t =>
      t.name.toLowerCase().includes(q) ||
      (t.category || '').toLowerCase().includes(q) ||
      (t.subcategory || '').toLowerCase().includes(q)
    ).slice(0, 12);
  }, [search]);

  const popularCategories = categoryList.slice(0, 6);

  useEffect(() => {
    if (diag.pageTitle) document.title = diag.pageTitle;
  }, [diag.pageTitle]);

  return (
    <div>
      {!search && (
        <div className="diag-hero" style={{ background: 'linear-gradient(135deg, #0b3b2c 0%, #1a6b4a 100%)', padding: '40px 0 48px' }}>
          <div className="container">
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 6px', lineHeight: 1.2 }}>
              {diag.heroHeading || t('diagnostics.hero.heading', 'Find the right health test in 30 seconds')}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: '0 0 20px' }}>
              {diag.heroSubtext || t('diagnostics.hero.subtext', '5000+ diagnostic tests. Free home collection. NABL certified labs.')}
            </p>
            <div style={{ maxWidth: 520 }}>
              <SmartSearch placeholder={t('diagnostics.searchPlaceholder', '🔍 Search tests, health packages & symptoms...')} value={search}
                onChange={setSearch}
                onSubmit={v => { setSearch(v); if (v) setSearched(true); }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              {['Diabetes', 'Thyroid', 'Vitamin D', 'Fever', 'Heart Checkup'].map(s => (
                <button key={s} onClick={() => { setSearch(s); setSearched(true); }}
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 20, padding: '6px 14px', fontSize: 12, cursor: 'pointer', transition: 'background 0.2s' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {search && (
        <div style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border)', padding: '12px 0', position: 'sticky', top: 'var(--header-height)', zIndex: 50 }}>
          <div className="container" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <SmartSearch placeholder={t('diagnostics.searchPlaceholderSmall', '🔍 Search tests...')} value={search}
                onChange={setSearch}
                onSubmit={v => { setSearch(v); if (v) setSearched(true); }} />
            </div>
            <button onClick={() => { setSearch(''); setSearched(false); }}
              style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px 8px' }}>✕</button>
          </div>
        </div>
      )}

      {search && searched && searchResults.length > 0 && (
        <div className="page-section container" style={{ paddingTop: 20 }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>{searchResults.length} {t('diagnostics.test', 'test')}{searchResults.length !== 1 ? 's' : ''} {t('diagnostics.foundFor', 'found for')} "{search}"</p>
          <div className="grid-3">
            {searchResults.map(t => (
              <TestCard key={t.id} test={t} />
            ))}
          </div>
          {seedTests.filter(t =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            (t.category || '').toLowerCase().includes(search.toLowerCase())
          ).length > 12 && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link to={`/tests/${search.toLowerCase().replace(/\s+/g, '-')}`} className="btn btn-outline" style={{ fontSize: 13 }}>
                {t('diagnostics.viewAllResults', 'View all results →')}
              </Link>
            </div>
          )}
        </div>
      )}

      {search && searched && searchResults.length === 0 && (
        <div className="page-section container" style={{ paddingTop: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>{t('diagnostics.noTestsFound', 'No tests found for')} "{search}"</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('diagnostics.noTestsHint', 'Try searching for "Diabetes", "Thyroid", or "Vitamin D"')}</p>
        </div>
      )}

      {!search && !searched && (
        <>
          <div className="page-section container" style={{ paddingTop: 28 }}>
            <div className="diag-presc-banner" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{diag.bannerHeading || t('diagnostics.banner.heading', '📋 Have a prescription?')}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{diag.bannerText || t('diagnostics.banner.text', "Upload your doctor's prescription and we'll recommend the right tests.")}</div>
              </div>
              <button onClick={() => useUploadModal.getState().setOpen(true)} className="btn btn-primary" style={{ background: '#16a34a', border: 'none', fontSize: 12, whiteSpace: 'nowrap' }}>{diag.bannerCta || t('diagnostics.banner.cta', '📤 Upload Prescription')}</button>
            </div>
          </div>

          <div className="page-section" style={{ paddingTop: 0, paddingBottom: 32 }}>
            <div className="container">
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{t('diagnostics.popularCategories', 'Popular Health Categories')}</h2>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>{t('diagnostics.popularCategoriesSub', 'Choose a category to find the right test for your health concern')}</p>
              <div className="cat-card-grid">
                {popularCategories.map(cat => (
                  <Link key={cat.name} to={`/tests/${cat.id}`} className="cat-card" style={{ textDecoration: 'none' }}>
                    <div className="cat-card-icon" style={{ background: `${cat.color}15`, color: cat.color }}>{cat.icon}</div>
                    <div className="cat-card-body">
                      <h3>{cat.name}</h3>
                      <p>{cat.tests.length} {t('diagnostics.tests', 'Tests')}</p>
                      <span className="cat-card-desc">{cat.description}</span>
                    </div>
                    <span className="cat-card-arrow">→</span>
                  </Link>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Link to="/tests/all" className="btn btn-outline" style={{ fontSize: 13 }}>{t('diagnostics.viewAllCategories', 'View All Categories →')}</Link>
              </div>
            </div>
          </div>

          <div className="page-section" style={{ background: 'var(--bg-light)', paddingTop: 32, paddingBottom: 32 }}>
            <div className="container">
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{t('diagnostics.browseByConcern', 'Browse Tests by Health Concern')}</h2>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>{t('diagnostics.browseByConcernSub', 'Find tests recommended for your specific health condition')}</p>
              <div className="concern-grid">
                {categoryList.slice(0, 10).map(cat => (
                  <Link key={cat.name} to={`/tests/${cat.id}`} className="concern-card" style={{ textDecoration: 'none' }}>
                    <span className="concern-icon">{cat.icon}</span>
                    <div>
                      <div className="concern-name">{cat.name}</div>
                      <div className="concern-count">{cat.tests.length} {t('diagnostics.tests', 'tests')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="page-section container" style={{ paddingTop: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{t('diagnostics.mostBooked', 'Most Booked Tests')}</h2>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>{t('diagnostics.mostBookedSub', 'Trusted by thousands of patients for accurate results')}</p>
            <div className="grid-3">
              {seedTests.filter(t => ['Complete Blood Count (CBC)', 'HbA1c', 'Thyroid Profile (T3, T4, TSH)', 'Lipid Profile', 'Vitamin D Total', 'Vitamin B12'].includes(t.name)).map(t => (
                <TestCard key={t.id} test={t} />
              ))}
            </div>
          </div>
        </>
      )}

      {!search && (
        <div className="container" style={{ paddingTop: 0, paddingBottom: 20 }}>
          <PhysioCrossSell source="diagnostics-page" compact={true} />
          <div style={{ marginTop: 8 }}>
            <VaccineCrossSell source="diagnostics-page" compact={true} />
          </div>
        </div>
      )}

      <style>{`
        .diag-hero { margin-top: calc(-1 * var(--header-height, 0px)); padding-top: calc(40px + var(--header-height, 60px)) !important; }
        .cat-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
        .cat-card { display: flex; align-items: center; gap: 14px; background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 18px; transition: all 0.25s; cursor: pointer; }
        .cat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: var(--primary); }
        .cat-card-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
        .cat-card-body { flex: 1; min-width: 0; }
        .cat-card-body h3 { font-size: 14px; font-weight: 600; margin: 0 0 2px; color: var(--text); }
        .cat-card-body p { font-size: 12px; font-weight: 500; color: var(--primary); margin: 0 0 2px; }
        .cat-card-desc { font-size: 11px; color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .cat-card-arrow { font-size: 18px; color: var(--text-secondary); flex-shrink: 0; }
        .concern-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
        .concern-card { display: flex; align-items: center; gap: 12px; background: #fff; border-radius: var(--radius); border: 1px solid var(--border); padding: 14px 16px; transition: all 0.2s; }
        .concern-card:hover { box-shadow: var(--shadow-sm); border-color: var(--primary); }
        .concern-icon { font-size: 22px; width: 36px; text-align: center; flex-shrink: 0; }
        .concern-name { font-size: 13px; font-weight: 600; color: var(--text); }
        .concern-count { font-size: 11px; color: var(--text-secondary); }
        @media (max-width: 768px) {
          .diag-hero { padding: 28px 0 36px !important; padding-top: calc(28px + var(--header-height, 60px)) !important; }
          .diag-hero h1 { font-size: 20px; }
          .cat-card-grid { grid-template-columns: 1fr; }
          .concern-grid { grid-template-columns: 1fr 1fr; }
          .diag-presc-banner { flex-direction: column !important; align-items: stretch !important; text-align: center !important; }
          .diag-presc-banner button { width: 100% !important; }
        }
        @media (max-width: 480px) {
          .concern-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
