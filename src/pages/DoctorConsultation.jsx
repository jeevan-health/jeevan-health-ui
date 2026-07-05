import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Star, Clock, CaretRight, House, VideoCamera, Phone,
  Heartbeat, Brain, Monitor, Bone, Baby, User, Ear, Eye,
  Shield, Syringe, FirstAidKit, Heart,
} from '@phosphor-icons/react';
import { searchDoctors } from '../services/doctorService';

const consultTypes = [
  { value: 'home', label: 'Home Visit', icon: House },
  { value: 'video', label: 'Video Consultation', icon: VideoCamera },
  { value: 'clinic', label: 'Clinic Visit', icon: Phone },
];

const allSpecialties = [
  { name: 'Cardiologist', icon: Heartbeat },
  { name: 'Neurologist', icon: Brain },
  { name: 'Pulmonologist', icon: Monitor },
  { name: 'Orthopedic Surgeon', icon: Bone },
  { name: 'Pediatrician', icon: Baby },
  { name: 'Gynecologist', icon: User },
  { name: 'Psychiatrist', icon: Brain },
  { name: 'Dermatologist', icon: User },
  { name: 'ENT Specialist', icon: Ear },
  { name: 'Ophthalmologist', icon: Eye },
  { name: 'Endocrinologist', icon: User },
  { name: 'Diabetologist', icon: User },
  { name: 'Gastroenterologist', icon: User },
  { name: 'Hepatologist', icon: Shield },
  { name: 'Nephrologist', icon: User },
  { name: 'Urologist', icon: User },
  { name: 'Oncologist', icon: Shield },
  { name: 'Rheumatologist', icon: Bone },
  { name: 'Radiologist', icon: Monitor },
  { name: 'Anesthesiologist', icon: Shield },
  { name: 'General Surgeon', icon: Syringe },
  { name: 'Plastic Surgeon', icon: User },
  { name: 'Vascular Surgeon', icon: Heartbeat },
  { name: 'Infectious Disease Specialist', icon: Shield },
  { name: 'Geriatrician', icon: User },
  { name: 'Fertility Specialist', icon: Baby },
  { name: 'Neonatologist', icon: Baby },
  { name: 'Pain Management Specialist', icon: FirstAidKit },
  { name: 'Emergency Medicine Specialist', icon: Syringe },
  { name: 'Critical Care Specialist', icon: Heart },
];

export default function DoctorConsultation() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialty, setSpecialty] = useState('');
  const [consultType, setConsultType] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const urlSpecialty = searchParams.get('specialty') || '';
    const urlType = searchParams.get('type') || '';
    setSpecialty(urlSpecialty);
    setConsultType(urlType);
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (specialty) params.specialty = specialty;
      const { data } = await searchDoctors(params);
      setDoctors(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [specialty]);

  const handleSpecialtyClick = (s) => {
    const next = specialty === s ? '' : s;
    setSpecialty(next);
    setSearchParams(next ? { specialty: next } : {});
  };

  const handleTypeClick = (t) => {
    const next = consultType === t ? '' : t;
    setConsultType(next);
  };

  return (
    <section className="page-section">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <h1 style={{ margin: 0 }}>Consult Top Doctors from Home</h1>
          <button onClick={() => { setSpecialty(''); setSearchParams({}); }}
            style={{ background: 'none', border: 'none', color: '#0B4FA8', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            View All Doctors
          </button>
        </div>
        <p style={{ marginTop: 4 }}>Video, voice, or chat with verified specialists. No waiting rooms.</p>

        {/* Consultation Type Chips */}
        <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
          {consultTypes.map(t => (
            <button key={t.value} onClick={() => handleTypeClick(t.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 18px', borderRadius: 50, fontSize: 13, fontWeight: 600,
                background: consultType === t.value ? '#0B4FA8' : '#fff',
                color: consultType === t.value ? '#fff' : 'var(--text-body)',
                border: `1px solid ${consultType === t.value ? '#0B4FA8' : 'var(--border)'}`,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              }}>
              <t.icon size={16} weight={consultType === t.value ? 'fill' : 'regular'} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Specialty Chips */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          {allSpecialties.map(s => (
            <button key={s.name} onClick={() => handleSpecialtyClick(s.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 16px', borderRadius: 50, fontSize: 12, fontWeight: 500,
                background: specialty === s.name ? '#0B4FA8' : '#f5f7fa',
                color: specialty === s.name ? '#fff' : 'var(--text-body)',
                border: `1px solid ${specialty === s.name ? '#0B4FA8' : 'transparent'}`,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              }}>
              <s.icon size={16} weight={specialty === s.name ? 'fill' : 'regular'} />
              {s.name}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><p style={{ color: 'var(--text-light)' }}>Loading doctors...</p></div>
        ) : doctors.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}><p style={{ color: 'var(--text-light)' }}>No doctors found. Try different search criteria.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: 16, marginTop: 20 }}>
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
