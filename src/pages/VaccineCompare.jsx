import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { vaccines, vaccineCategories } from '../data/vaccinationData';

const fields = [
  { key: 'name', label: 'Vaccine Name', emoji: '💉' },
  { key: 'brand', label: 'Brand', emoji: '🏷️' },
  { key: 'manufacturer', label: 'Manufacturer', emoji: '🏭' },
  { key: 'disease', label: 'Disease Prevented', emoji: '🦠' },
  { key: 'ageGroup', label: 'Age Group', emoji: '👤' },
  { key: 'doseCount', label: 'Doses', emoji: '💊' },
  { key: 'doseInterval', label: 'Dose Interval', emoji: '📅' },
  { key: 'price', label: 'Price (per dose)', emoji: '💰' },
  { key: 'availability', label: 'Availability', emoji: '🏠' },
  { key: 'ageRecommendation', label: 'Recommendation', emoji: '📋' },
];

export default function VaccineCompare() {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const filtered = useMemo(() => {
    let list = [...vaccines];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(v => v.name.toLowerCase().includes(q) || v.disease.toLowerCase().includes(q));
    }
    if (catFilter) list = list.filter(v => v.category === catFilter);
    return list.filter(v => !selected.some(s => s.id === v.id));
  }, [search, catFilter, selected]);

  const addVaccine = (v) => {
    if (selected.length >= 4) return;
    setSelected([...selected, v]);
    setSearch('');
  };

  const removeVaccine = (id) => {
    setSelected(selected.filter(s => s.id !== id));
  };

  const getCellValue = (v, key) => {
    if (key === 'price') return `₹${v.price}`;
    if (key === 'doseCount') return `${v.doseCount} dose${v.doseCount > 1 ? 's' : ''}`;
    if (key === 'availability') {
      return v.availability === 'Home & Clinic' ? '🏠 Home & Clinic' : v.availability === 'Clinic Only' ? '🏥 Clinic Only' : v.availability;
    }
    return v[key] || '-';
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #7c3aedcc 100%)', padding: '28px 0 32px' }}>
        <div className="container">
          <Link to="/vaccination" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>← Back to Vaccination</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>📊</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>Compare Vaccines</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '2px 0 0' }}>Select 2-4 vaccines to compare side-by-side</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-section container" style={{ paddingTop: 20 }}>
        {/* Selected vaccines */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', minHeight: 80 }}>
          {selected.length === 0 ? (
            <div style={{ flex: 1, padding: 20, borderRadius: 10, border: '2px dashed #d0d5dd', textAlign: 'center', background: '#f8fafc' }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Search and select 2-4 vaccines below to compare</span>
            </div>
          ) : (
            selected.map(v => (
              <div key={v.id} style={{ flex: '1 1 160px', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', position: 'relative' }}>
                <button onClick={() => removeVaccine(v.id)}
                  style={{ position: 'absolute', top: 4, right: 6, border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: '#94a3b8', fontFamily: 'inherit', lineHeight: 1 }}>×</button>
                <div style={{ fontSize: 22, marginBottom: 4 }}>💉</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{v.name}</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{v.disease}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#059669', marginTop: 4 }}>₹{v.price}</div>
              </div>
            ))
          )}
        </div>

        {/* Search & add */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vaccines to add..."
              style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} disabled={selected.length >= 4} />
            <span style={{ position: 'absolute', left: 10, top: 8, fontSize: 12, color: '#94a3b8' }}>🔍</span>
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
            <option value="">All Categories</option>
            {vaccineCategories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          {selected.length >= 4 && <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 600 }}>Max 4 vaccines</span>}
        </div>

        {/* Search results dropdown */}
        {search && filtered.length > 0 && (
          <div style={{ marginBottom: 16, borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden', background: '#fff', maxHeight: 240, overflowY: 'auto' }}>
            {filtered.slice(0, 10).map(v => (
              <div key={v.id} onClick={() => addVaccine(v)}
                style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{v.name}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{v.disease} · {v.ageGroup}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>₹{v.price}</div>
                  <span style={{ fontSize: 10, color: '#7c3aed', fontWeight: 600 }}>+ Add</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comparison table */}
        {selected.length >= 2 && (
          <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 600 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap', minWidth: 140 }}>Details</th>
                  {selected.map(v => (
                    <th key={v.id} style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', borderLeft: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 22, marginBottom: 2 }}>💉</div>
                      {v.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.map(f => (
                  <tr key={f.key} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap', background: '#fafbfc' }}>
                      <span style={{ marginRight: 6 }}>{f.emoji}</span>{f.label}
                    </td>
                    {selected.map(v => {
                      const val = getCellValue(v, f.key);
                      const isHighlight = f.key === 'price' && selected.every(s => s.price >= v.price);
                      return (
                        <td key={v.id} style={{
                          padding: '10px 12px', textAlign: 'center', color: '#0f172a', borderLeft: '1px solid #e2e8f0',
                          background: f.key === 'price' && v.price === Math.min(...selected.map(s => s.price)) ? '#f0fdf4' : 'transparent',
                          fontWeight: f.key === 'price' && v.price === Math.min(...selected.map(s => s.price)) ? 700 : 400,
                        }}>
                          {val}
                          {f.key === 'price' && v.price === Math.min(...selected.map(s => s.price)) && <span style={{ fontSize: 9, color: '#16a34a', display: 'block', marginTop: 2 }}>✓ Lowest Price</span>}
                          {f.key === 'doseCount' && v.doseCount === Math.min(...selected.map(s => s.doseCount)) && <span style={{ fontSize: 9, color: '#16a34a', display: 'block', marginTop: 2 }}>✓ Fewer doses</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selected.length > 0 && selected.length < 2 && (
          <div style={{ textAlign: 'center', padding: 30, borderRadius: 10, border: '1px solid #fef3c7', background: '#fffbeb' }}>
            <p style={{ fontSize: 12, color: '#92400e', margin: 0 }}>Add at least 1 more vaccine to see comparison</p>
          </div>
        )}
      </div>
    </div>
  );
}
