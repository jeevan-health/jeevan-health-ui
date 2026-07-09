import React, { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import useUploadModal from '../stores/uploadModalStore';
import useCartStore from '../stores/cartStore';
import { seedTests } from '../data/seedData';
import SmartSearch from '../components/layout/SmartSearch';

const CATS = [...new Set(seedTests.map(t => t.category))].filter(Boolean);

export default function Diagnostics() {
  const navigate = useNavigate();
  const addItem = useCartStore(s => s.addItem);
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [category, setCategory] = useState(params.get('cat') || '');
  const [priceRange, setPriceRange] = useState('');

  const results = useMemo(() => {
    return seedTests.filter(t => {
      if (search) {
        const q = search.toLowerCase();
        if (!t.name.toLowerCase().includes(q) && !(t.category || '').toLowerCase().includes(q)) return false;
      }
      if (category && t.category !== category) return false;
      if (priceRange) {
        const p = t.offerPrice || t.price;
        if (priceRange === 'budget' && p > 500) return false;
        if (priceRange === 'mid' && (p < 500 || p > 1500)) return false;
        if (priceRange === 'premium' && p < 1500) return false;
      }
      return true;
    });
  }, [search, category, priceRange]);

  return (
    <div>
      <div style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border)', padding: '20px 0', position: 'sticky', top: 'var(--header-height)', zIndex: 50 }}>
        <div className="container">
          <div className="diag-filters" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <SmartSearch placeholder="🔍 Search tests..." value={search}
                onChange={v => { setSearch(v); setParams(v ? { q: v } : {}); }}
                onSubmit={v => { setSearch(v); setParams(v ? { q: v } : {}); }} />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="select" style={{ width: 'auto', minWidth: 140 }}>
              <option value="">All Categories</option>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={priceRange} onChange={e => setPriceRange(e.target.value)} className="select" style={{ width: 'auto', minWidth: 120 }}>
              <option value="">All Prices</option>
              <option value="budget">Under ₹500</option>
              <option value="mid">₹500 - ₹1500</option>
              <option value="premium">Above ₹1500</option>
            </select>
          </div>
        </div>
      </div>

      <div className="page-section container">
        <div className="diag-presc-banner" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>📋 Have a prescription?</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Upload your doctor's prescription and we'll recommend the right tests.</div>
          </div>
          <button onClick={() => useUploadModal.getState().setOpen(true)} className="btn btn-primary" style={{ background: '#16a34a', border: 'none', fontSize: 12, whiteSpace: 'nowrap' }}>📤 Upload Prescription</button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>{results.length} test{results.length !== 1 ? 's' : ''} found</p>
        <div className="grid-3">
          {results.map(t => (
            <div key={t.id} className="test-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <h3>{t.name}</h3>
                  <span className="badge badge-primary">{t.category}</span>
                </div>
                <div className="desc">{t.description}</div>
              </div>
              <div className="footer" style={{ marginTop: 12 }}>
                <div>
                  <span className="price">₹{t.offerPrice || t.price}</span>
                  {t.offerPrice && <span className="mrp">₹{t.price}</span>}
                  <div style={{ fontSize: 10, color: 'var(--secondary)', fontWeight: 600, marginTop: 2 }}>Free Home Collection</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Link to={`/test/${t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} className="btn btn-outline btn-sm">Details</Link>
                  <button onClick={() => { addItem({ id: t.id, name: t.name, price: t.price || t.mrp, offerPrice: t.offerPrice, type: 'test' }); navigate('/checkout'); }} className="btn btn-primary btn-sm">Book</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .diag-filters { flex-direction: column !important; }
          .diag-filters > div { min-width: 0 !important; width: 100% !important; }
          .diag-filters select { width: 100% !important; min-width: 0 !important; }
          .diag-presc-banner { flex-direction: column !important; align-items: stretch !important; text-align: center !important; }
          .diag-presc-banner button { width: 100% !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
