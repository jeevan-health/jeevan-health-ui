import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { packageList } from '../data/healthPackages';
import useCartStore from '../stores/cartStore';
import useCmsStore from '../stores/cmsStore';

export default function HealthPackages() {
  const addItem = useCartStore(s => s.addItem);
  const cmsContent = useCmsStore(s => s.content);
  const [selectedTarget, setSelectedTarget] = useState('');

  const targets = [...new Set(packageList.map(p => p.target.split('|')[0].trim()))];

  const results = useMemo(() => {
    if (!selectedTarget) return packageList;
    return packageList.filter(p => p.target.includes(selectedTarget));
  }, [selectedTarget]);

  const hero = cmsContent.healthPackages || {};

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #0b3b2c 0%, #1a6b4a 100%)', padding: '32px 0 36px' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 6px' }}>{hero.pageTitle || 'Health Packages'}</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: '0 0 16px' }}>
            {hero.pageSubtitle || 'Curated health checkup packages for every need — comprehensive screening at the best price'}
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button onClick={() => setSelectedTarget('')}
              style={{ padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: `1px solid ${!selectedTarget ? '#4ade80' : 'rgba(255,255,255,0.3)'}`, background: !selectedTarget ? '#4ade80' : 'rgba(255,255,255,0.15)', color: !selectedTarget ? '#0b3b2c' : '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
              All Packages
            </button>
            {targets.map(t => (
              <button key={t} onClick={() => setSelectedTarget(t)}
                style={{ padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: `1px solid ${selectedTarget === t ? '#4ade80' : 'rgba(255,255,255,0.3)'}`, background: selectedTarget === t ? '#4ade80' : 'rgba(255,255,255,0.15)', color: selectedTarget === t ? '#0b3b2c' : '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="page-section container" style={{ paddingTop: 24 }}>
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
                    <span className="pkg-stat-label">Tests</span>
                  </div>
                  <div className="pkg-stat">
                    <span className="pkg-stat-value">⭐ {pkg.rating}</span>
                    <span className="pkg-stat-label">Rating</span>
                  </div>
                  <div className="pkg-stat">
                    <span className="pkg-stat-value">{pkg.reportTime}</span>
                    <span className="pkg-stat-label">Reports</span>
                  </div>
                </div>

                <div className="pkg-tests-preview">
                  {pkg.testsIncluded.slice(0, 5).map((t, i) => (
                    <span key={i} className="pkg-test-tag">✓ {t}</span>
                  ))}
                  {pkg.testsIncluded.length > 5 && (
                    <span className="pkg-test-tag pkg-test-more">+{pkg.testsIncluded.length - 5} more</span>
                  )}
                </div>

                <div className="pkg-footer">
                  <div>
                    <span className="pkg-mrp">MRP: ₹{pkg.mrp.toLocaleString()}</span>
                    <div className="pkg-price">₹{pkg.offerPrice.toLocaleString()}</div>
                    <div className="pkg-discount">{pkg.discount}% OFF</div>
                  </div>
                  <div className="pkg-actions">
                    <Link to={`/package/${pkg.id}`} className="btn btn-outline btn-sm">View Details</Link>
                    <button onClick={() => { addItem({ id: pkg.id, name: pkg.name, price: pkg.mrp, offerPrice: pkg.offerPrice, type: 'package' }); }} className="btn btn-primary btn-sm">Book Now</button>
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