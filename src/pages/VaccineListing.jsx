import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { vaccines, vaccineCategories } from '../data/vaccinationData';

export default function VaccineListing() {
  const [filters, setFilters] = useState({ category: '', ageGroup: '', search: '' });

  const filtered = useMemo(() => {
    return vaccines.filter(v => {
      if (filters.category && v.category !== filters.category) return false;
      if (filters.ageGroup && v.ageGroup !== filters.ageGroup && !v.ageGroup.includes(filters.ageGroup)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return v.name.toLowerCase().includes(q) || v.disease.toLowerCase().includes(q) || v.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="page-section container">
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>All Vaccines</h1>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Comprehensive vaccination list — find the right vaccine for you and your family</p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <input type="text" placeholder="Search vaccines..." value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
        <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
          <option value="">All Categories</option>
          {vaccineCategories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {filtered.map(v => (
          <Link key={v.id} to={`/vaccination/${v.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>💉</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{v.disease}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#EFF6FF', color: '#2563eb', fontWeight: 600 }}>Age: {v.ageGroup}</span>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#F0FDF4', color: '#16a34a', fontWeight: 600 }}>{v.doseCount} Dose{v.doseCount > 1 ? 's' : ''}</span>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#FFF7ED', color: '#ea580c', fontWeight: 600 }}>{v.availability}</span>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, lineHeight: 1.4, flex: 1 }}>{v.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
                <span style={{ fontWeight: 700, color: '#059669', fontSize: 16 }}>₹{v.price}<span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}> /dose</span></span>
                <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>View Details →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8', padding: 32 }}>No vaccines match your filters. Try a different search.</p>
      )}
    </div>
  );
}
