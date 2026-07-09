import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useDoctorsStore from '../stores/doctorsStore';

const card = { background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'box-shadow 0.2s' };

export default function ConsultDoctor() {
  const doctors = useDoctorsStore(s => s.doctors);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');

  const activeDocs = useMemo(() => doctors.filter(d => d.isActive !== false), [doctors]);

  const allSpecs = useMemo(() => {
    const s = new Set();
    activeDocs.forEach(d => (d.specializations || []).forEach(sp => s.add(sp)));
    return [...s].sort();
  }, [activeDocs]);

  const filtered = useMemo(() => {
    let d = activeDocs;
    if (search) { const q = search.toLowerCase(); d = d.filter(x => (x.name + (x.specializations || []).join(' ') + (x.qualifications || []).join(' ')).toLowerCase().includes(q)); }
    if (specFilter) d = d.filter(x => (x.specializations || []).includes(specFilter));
    return d;
  }, [activeDocs, search, specFilter]);

  return (
    <div className="page-section">
      <div className="container">
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🩺</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Consult a Doctor</h1>
          <p style={{ fontSize: 14, color: '#64748b', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            Book a consultation with top doctors from the comfort of your home. Online, clinic, or home visit — choose what works for you.
          </p>
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'inherit', width: 280, background: '#fff' }} placeholder="🔍 Search by name, specialty..." />
          <select value={specFilter} onChange={e => setSpecFilter(e.target.value)} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'inherit', background: '#fff', width: 200 }}>
            <option value="">All Specialties</option>
            {allSpecs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Doctor Cards */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍⚕️</div>
            <p style={{ fontSize: 14 }}>No doctors available. Check back later.</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {filtered.map(d => (
            <div key={d.id} style={card} onClick={() => navigate(`/book-appointment/${d.id}`)}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #1866C9, #1A7AD4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, flexShrink: 0 }}>{(d.name || '?')[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{d.name}</h3>
                  <div style={{ fontSize: 12, color: '#1866C9', fontWeight: 600, marginBottom: 4 }}>{(d.specializations || []).slice(0, 3).join(', ')}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>{(d.qualifications || []).join(', ')} | {d.experience} yrs exp</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    {d.consultationFee ? `₹${d.consultationFee}/consult` : 'Fee varies'}
                    {(d.consultationModes || []).length > 0 && ` | ${d.consultationModes.map(m => ({online: '🖥️', clinic: '🏥', home: '🚑'})[m] || m).join(' ')}`}
                  </div>
                </div>
              </div>
              {(d.availableDays || []).length > 0 && (
                <div style={{ display: 'flex', gap: 3, marginTop: 12 }}>
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => (
                    <span key={day} style={{ width: 28, height: 22, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, background: (d.availableDays || []).includes(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i]) ? '#dcfce7' : '#f1f5f9', color: (d.availableDays || []).includes(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i]) ? '#166534' : '#94a3b8' }}>{day}</span>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#eef2ff', color: '#1866C9' }}>Book Now →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}