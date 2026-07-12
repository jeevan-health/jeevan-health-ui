import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { packageList, ensurePackagesLoaded, subscribePackages } from '../data/healthPackages';
import useCartStore from '../stores/cartStore';
import useCmsStore from '../stores/cmsStore';
import { useT } from '../i18n/LanguageProvider';

export default function HealthPackages() {
  const t = useT();
  const navigate = useNavigate();
  const addItem = useCartStore(s => s.addItem);
  const cmsContent = useCmsStore(s => s.content);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    ensurePackagesLoaded();
    return subscribePackages(() => forceUpdate((n) => n + 1));
  }, []);

  const targets = useMemo(
    () => [...new Set(packageList.map(p => (p.target || '').split('|')[0].trim()).filter(Boolean))],
    [packageList.length]
  );

  const results = useMemo(() => {
    if (!selectedTarget) return packageList;
    return packageList.filter(p => (p.target || '').includes(selectedTarget));
  }, [selectedTarget, packageList.length]);

  const hero = cmsContent.healthPackages || {};

  const bookPackage = (pkg) => {
    addItem({
      id: pkg.id || pkg.slug,
      name: pkg.name,
      price: pkg.mrp,
      offerPrice: pkg.offerPrice,
      type: 'package',
      testCount: pkg.testCount,
    });
    navigate('/checkout');
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #0b3b2c 0%, #1a6b4a 100%)', padding: '32px 0 36px' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 6px' }}>{hero.pageTitle || t('healthPackages.pageTitle', 'Health Packages')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: '0 0 8px' }}>
            {hero.pageSubtitle || t('healthPackages.pageSubtitle', 'Curated health checkup packages for every need — comprehensive screening at the best price')}
          </p>
          {packageList.length > 0 && (
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 600, margin: '0 0 16px' }}>
              {packageList.length} {t('healthPackages.liveCount', 'packages available')}
            </p>
          )}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setSelectedTarget('')}
              style={{ padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: `1px solid ${!selectedTarget ? '#4ade80' : 'rgba(255,255,255,0.3)'}`, background: !selectedTarget ? '#4ade80' : 'rgba(255,255,255,0.15)', color: !selectedTarget ? '#0b3b2c' : '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
              {t('healthPackages.allPackages', 'All Packages')}
            </button>
            {targets.map(tg => (
              <button type="button" key={tg} onClick={() => setSelectedTarget(tg)}
                style={{ padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: `1px solid ${selectedTarget === tg ? '#4ade80' : 'rgba(255,255,255,0.3)'}`, background: selectedTarget === tg ? '#4ade80' : 'rgba(255,255,255,0.15)', color: selectedTarget === tg ? '#0b3b2c' : '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                {tg}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="page-section container" style={{ paddingTop: 24 }}>
        {packageList.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 40 }}>
            {t('healthPackages.loading', 'Loading packages…')}
          </p>
        )}
        <div className="pkg-grid">
          {results.map(pkg => (
            <div key={pkg.id} className="pkg-card" style={{ borderTop: `4px solid ${pkg.color}` }}>
              <div className="pkg-badge">{pkg.icon}</div>
              <div className="pkg-body">
                <h3>{pkg.name}</h3>
                <p className="pkg-target">{pkg.target}</p>
                <p className="pkg-desc">{pkg.description}</p>

                <div className="pkg-stats">
                  <div className="pkg-stat">
                    <span className="pkg-stat-value">{pkg.testCount}</span>
                    <span className="pkg-stat-label">{t('healthPackages.tests', 'Tests')}</span>
                  </div>
                  <div className="pkg-stat">
                    <span className="pkg-stat-value">⭐ {pkg.rating}</span>
                    <span className="pkg-stat-label">{t('healthPackages.rating', 'Rating')}</span>
                  </div>
                  <div className="pkg-stat">
                    <span className="pkg-stat-value">{pkg.reportTime}</span>
                    <span className="pkg-stat-label">{t('healthPackages.reports', 'Reports')}</span>
                  </div>
                </div>

                <div className="pkg-tests-preview">
                  {(pkg.testsIncluded || []).slice(0, 5).map((tn, i) => (
                    <span key={i} className="pkg-test-tag">✓ {tn}</span>
                  ))}
                  {(pkg.testsIncluded || []).length > 5 && (
                    <span className="pkg-test-tag pkg-test-more">+{(pkg.testsIncluded || []).length - 5} {t('healthPackages.more', 'more')}</span>
                  )}
                </div>

                <div className="pkg-footer">
                  <div>
                    <span className="pkg-mrp">{t('healthPackages.mrp', 'MRP')}: ₹{(pkg.mrp || 0).toLocaleString()}</span>
                    <div className="pkg-price">₹{(pkg.offerPrice || 0).toLocaleString()}</div>
                    {pkg.discount > 0 && <div className="pkg-discount">{pkg.discount}% {t('healthPackages.off', 'OFF')}</div>}
                  </div>
                  <div className="pkg-actions">
                    <Link to={`/package/${pkg.id || pkg.slug}`} className="btn btn-outline btn-sm">{t('healthPackages.viewDetails', 'View Details')}</Link>
                    <button type="button" onClick={() => bookPackage(pkg)} className="btn btn-primary btn-sm">{t('healthPackages.bookNow', 'Book Now')}</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .pkg-grid { display: flex; flex-direction: column; gap: 16px; }
        .pkg-card { background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; transition: all 0.25s; }
        .pkg-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
        .pkg-badge { font-size: 28px; padding: 12px 16px 0; }
        .pkg-body { padding: 8px 16px 16px; }
        .pkg-body h3 { font-size: 16px; font-weight: 700; margin: 0 0 2px; }
        .pkg-target { font-size: 11px; color: var(--primary); font-weight: 600; margin: 0 0 6px; }
        .pkg-desc { font-size: 12px; color: var(--text-secondary); margin: 0 0 10px; line-height: 1.5; }
        .pkg-stats { display: flex; gap: 16px; margin-bottom: 10px; }
        .pkg-stat { display: flex; flex-direction: column; }
        .pkg-stat-value { font-size: 13px; font-weight: 700; color: var(--text); }
        .pkg-stat-label { font-size: 10px; color: var(--text-secondary); }
        .pkg-tests-preview { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
        .pkg-test-tag { font-size: 10px; color: var(--text-secondary); padding: 2px 6px; background: #f5f5f5; border-radius: 4px; }
        .pkg-test-more { color: var(--primary); font-weight: 600; background: #e8f0fe; }
        .pkg-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding-top: 10px; border-top: 1px solid var(--border); }
        .pkg-mrp { font-size: 11px; color: var(--text-secondary); text-decoration: line-through; }
        .pkg-price { font-size: 22px; font-weight: 800; color: #e53935; line-height: 1.1; }
        .pkg-discount { font-size: 11px; font-weight: 700; color: #2e7d32; }
        .pkg-actions { display: flex; gap: 6px; }
        @media (max-width: 768px) {
          .pkg-footer { flex-direction: column; align-items: stretch; }
          .pkg-actions { justify-content: stretch; }
          .pkg-actions a, .pkg-actions button { flex: 1; text-align: center; }
        }
      `}</style>
    </div>
  );
}
