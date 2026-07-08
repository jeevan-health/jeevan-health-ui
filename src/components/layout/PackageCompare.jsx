import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PACKAGES = [
  { name: 'Basic Health Checkup', price: 999, mrp: 2499, tests: 52, badge: null, color: '#0F5DA8',
    features: { 'Blood Tests': true, 'Diabetes Screening': true, 'Thyroid Profile': true, 'Vitamin Tests': false, 'Heart Health Tests': false, 'Liver Function': true, 'Kidney Function': true, 'ECG': false, 'Doctor Consultation': true, 'Home Collection': true, 'Digital Reports': true },
    bestFor: 'Annual Checkup', slug: 'basic-health-checkup' },
  { name: 'Executive Health Checkup', price: 1999, mrp: 4999, tests: 78, badge: 'Most Popular', color: '#16a34a',
    features: { 'Blood Tests': true, 'Diabetes Screening': true, 'Thyroid Profile': true, 'Vitamin Tests': true, 'Heart Health Tests': true, 'Liver Function': true, 'Kidney Function': true, 'ECG': true, 'Doctor Consultation': true, 'Home Collection': true, 'Digital Reports': true },
    bestFor: 'Working Professionals', slug: 'executive-health-checkup' },
  { name: 'Premium Complete Care', price: 3999, mrp: 8999, tests: 110, badge: 'Best Value', color: '#7c3aed',
    features: { 'Blood Tests': true, 'Diabetes Screening': true, 'Thyroid Profile': true, 'Vitamin Tests': true, 'Heart Health Tests': true, 'Liver Function': true, 'Kidney Function': true, 'ECG': true, 'Doctor Consultation': true, 'Home Collection': true, 'Digital Reports': true },
    bestFor: 'Complete Preventive Care', slug: 'premium-complete-care' },
];

const ALL_FEATURES = ['Blood Tests', 'Diabetes Screening', 'Thyroid Profile', 'Vitamin Tests', 'Heart Health Tests', 'Liver Function', 'Kidney Function', 'ECG', 'Doctor Consultation', 'Home Collection', 'Digital Reports'];

export default function PackageCompare() {
  const [onlyDiff, setOnlyDiff] = useState(false);

  const visibleFeatures = onlyDiff
    ? ALL_FEATURES.filter(f => new Set(PACKAGES.map(p => p.features[f])).size > 1)
    : ALL_FEATURES;

  return (
    <div style={{ background: '#F5FAFF', borderRadius: 20, padding: '24px 16px', margin: '24px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>Compare Health Checkup Packages</h2>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>Choose the package that best matches your healthcare needs.</p>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12, cursor: 'pointer' }}>
        <input type="checkbox" checked={onlyDiff} onChange={e => setOnlyDiff(e.target.checked)} style={{ accentColor: '#0F5DA8' }} />
        Show only differences
      </label>

      {/* Desktop Table */}
      <div className="pkg-compare-desktop">
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #e8edf2' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 600 }}>
            <thead>
              <tr style={{ background: '#fff' }}>
                <th style={{ textAlign: 'left', padding: '12px 14px', borderBottom: '2px solid #e8edf2', fontWeight: 700, color: '#1a1a1a' }}>Features</th>
                {PACKAGES.map(p => (
                  <th key={p.name} style={{ textAlign: 'center', padding: '12px 10px', borderBottom: '2px solid #e8edf2', position: 'relative', background: p.badge ? '#f0fdf4' : '#fff' }}>
                    {p.badge && <div style={{ fontSize: 8, fontWeight: 700, color: '#166534', background: '#bbf7d0', padding: '2px 8px', borderRadius: 4, display: 'inline-block', marginBottom: 4 }}>⭐ {p.badge}</div>}
                    <div style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.name}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a', marginTop: 2 }}>₹{p.price}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>₹{p.mrp}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{p.tests} Tests</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleFeatures.map(f => (
                <tr key={f} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '8px 14px', fontWeight: 500, color: '#1a1a1a' }}>{f}</td>
                  {PACKAGES.map(p => (
                    <td key={p.name} style={{ textAlign: 'center', padding: '8px 10px', color: p.features[f] ? '#16a34a' : '#dc2626' }}>
                      {p.features[f] ? '✅' : '❌'}
                    </td>
                  ))}
                </tr>
              ))}
              <tr style={{ background: '#f8f9fa' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, fontSize: 11 }}>Best For</td>
                {PACKAGES.map(p => (
                  <td key={p.name} style={{ textAlign: 'center', padding: '10px', fontSize: 11, color: 'var(--text-secondary)' }}>{p.bestFor}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PACKAGES.length}, 1fr)`, gap: 8, marginTop: 10 }}>
          {PACKAGES.map(p => (
            <Link key={p.name} to={`/package/${p.slug}`} style={{
              textAlign: 'center', padding: '10px', borderRadius: 10, fontSize: 12, fontWeight: 700, textDecoration: 'none',
              background: p.badge ? '#16a34a' : 'var(--primary)', color: '#fff', display: 'block',
            }}>
              {p.badge ? '⭐ Book Now' : 'Book Now'}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="pkg-compare-mobile" style={{ display: 'none', flexDirection: 'column', gap: 12 }}>
        {PACKAGES.map(p => (
          <div key={p.name} style={{
            background: '#fff', borderRadius: 16, border: p.badge ? '2px solid #16a34a' : '1px solid #e8edf2',
            boxShadow: p.badge ? '0 4px 20px rgba(22,163,74,0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
            overflow: 'hidden', position: 'relative',
          }}>
            {p.badge && <div style={{ position: 'absolute', top: 8, right: 8, background: '#16a34a', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 6 }}>⭐ {p.badge}</div>}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #f5f5f5' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: p.color }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 20, fontWeight: 800 }}>₹{p.price}</span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>₹{p.mrp}</span>
                <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 600 }}>{p.tests} Tests</span>
              </div>
            </div>
            <div style={{ padding: '10px 16px' }}>
              {ALL_FEATURES.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', fontSize: 11 }}>
                  <span>{p.features[f] ? '✅' : '❌'}</span>
                  <span style={{ color: p.features[f] ? '#1a1a1a' : 'var(--text-secondary)' }}>{f}</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 6, padding: '4px 0', borderTop: '1px solid #f5f5f5' }}>
                Best for: <strong>{p.bestFor}</strong>
              </div>
            </div>
            <div style={{ padding: '10px 16px 14px' }}>
              <Link to={`/package/${p.slug}`} style={{
                display: 'block', textAlign: 'center', padding: '10px', borderRadius: 10, fontSize: 12, fontWeight: 700, textDecoration: 'none',
                background: p.badge ? '#16a34a' : 'var(--primary)', color: '#fff',
              }}>
                {p.badge ? '⭐ Book Now' : 'Book Now'}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pkg-compare-desktop { display: none !important; }
          .pkg-compare-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
