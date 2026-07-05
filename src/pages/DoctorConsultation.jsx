import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, Star, Clock, CaretRight } from '@phosphor-icons/react';
import { searchDoctors, getSpecialties } from '../services/doctorService';

const consultTypes = [
  { value: '', label: 'All Types' },
  { value: 'video', label: 'Video Call' },
  { value: 'audio', label: 'Voice Call' },
  { value: 'chat', label: 'Chat' },
  { value: 'home', label: 'Home Visit' },
  { value: 'clinic', label: 'Clinic Visit' },
];

export default function DoctorConsultation() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [consultType, setConsultType] = useState('');
  const navigate = useNavigate();

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.name = search;
      if (specialty) params.specialty = specialty;
      const { data } = await searchDoctors(params);
      setDoctors(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    loadDoctors();
    getSpecialties().then(({ data }) => setSpecialties(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadDoctors, 300);
    return () => clearTimeout(timer);
  }, [search, specialty]);

  return (
    <section className="page-section">
      <div className="container">
        <h1>Consult Top Doctors from Home</h1>
        <p>Video, voice, or chat with verified specialists. No waiting rooms.</p>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '24px 0' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <MagnifyingGlass size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-light)' }} />
            <input type="text" placeholder="Search by doctor name or specialty..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="input" style={{ paddingLeft: 38 }} />
          </div>
          <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="input" style={{ width: 'auto', minWidth: 160 }}>
            <option value="">All Specialties</option>
            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={consultType} onChange={(e) => setConsultType(e.target.value)} className="input" style={{ width: 'auto', minWidth: 140 }}>
            {consultTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><p style={{ color: 'var(--text-light)' }}>Loading doctors...</p></div>
        ) : doctors.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}><p style={{ color: 'var(--text-light)' }}>No doctors found. Try different search criteria.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {doctors.map(doc => (
              <div key={doc.id} style={{
                background: '#fff', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)', padding: 20,
                display: 'flex', gap: 20, alignItems: 'flex-start', cursor: 'pointer',
              }}
                onClick={() => navigate(`/doctor/${doc.id}`)}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', background: 'var(--primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  overflow: 'hidden', position: 'relative',
                }}>
                  {doc.image ? (
                    <img src={doc.image} alt={doc.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }} />
                  ) : null}
                  <div style={{
                    display: doc.image ? 'none' : 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    position: 'absolute', inset: 0,
                    fontSize: 24, fontWeight: 700, color: 'var(--primary)',
                  }}>
                    {doc.name?.charAt(0)}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 16, margin: 0 }}>{doc.name}</h3>
                    <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{doc.qualifications?.join(', ')}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500, marginTop: 2 }}>{doc.specialty}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4, lineHeight: 1.4 }}>{doc.about}</p>
                  <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={14} weight="fill" color="#0B4FA8" /> {doc.rating} ({doc.review_count} reviews)
                    </span>
                    <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={14} /> {doc.experience} yrs exp
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>₹{doc.fees}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {doc.languages?.map(l => (
                      <span key={l} style={{ padding: '2px 8px', background: 'var(--bg-light)', borderRadius: 12, fontSize: 11, color: 'var(--text-light)' }}>{l}</span>
                    ))}
                  </div>
                </div>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                    background: doc.is_available ? '#e8f5e9' : '#fef3e2',
                    color: doc.is_available ? '#2e7d32' : '#e65100',
                  }}>
                    {doc.is_available ? 'Available' : 'Limited'}
                  </span>
                  <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}
                    onClick={(e) => { e.stopPropagation(); navigate(`/doctor/${doc.id}`); }}>
                    Book Now <CaretRight size={14} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
