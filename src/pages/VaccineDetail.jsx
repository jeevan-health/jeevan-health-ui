import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getVaccineBySlug, getCategoryById } from '../data/vaccinationData';

export default function VaccineDetail() {
  const { slug } = useParams();
  const vaccine = getVaccineBySlug(slug);
  const [activeSection, setActiveSection] = useState('overview');

  if (!vaccine) {
    return (
      <div className="page-section container" style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>💉</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Vaccine Not Found</h2>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>The vaccine you are looking for does not exist.</p>
        <Link to="/vaccination/all-vaccines" className="btn btn-primary" style={{ textDecoration: 'none' }}>View All Vaccines</Link>
      </div>
    );
  }

  const category = getCategoryById(vaccine.category);
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'schedule', label: 'Dose Schedule' },
    { id: 'side-effects', label: 'Side Effects' },
    { id: 'faqs', label: 'FAQs' },
  ];

  return (
    <div className="page-section container">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 6, fontSize: 11, color: '#94a3b8', marginBottom: 16, flexWrap: 'wrap' }}>
        <Link to="/vaccination" style={{ color: '#2563eb', textDecoration: 'none' }}>Vaccination</Link>
        <span>/</span>
        {category && <><Link to={`/vaccination?category=${category.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{category.name}</Link><span>/</span></>}
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{vaccine.name}</span>
      </div>

      {/* Desktop: two-column layout */}
      <div className="v-detail-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left Sidebar — Price + Book */}
        <div className="v-detail-sidebar" style={{ position: 'sticky', top: 80 }}>
          <div style={{ padding: 20, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 18, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 12px' }}>💉</div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{vaccine.name}</h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px', lineHeight: 1.4 }}>{vaccine.disease}</p>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#059669', marginBottom: 2 }}>₹{vaccine.price}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>per dose + GST {vaccine.gst}%</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: '#EFF6FF', color: '#2563eb', fontWeight: 600 }}>Age: {vaccine.ageGroup}</span>
              <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: '#F0FDF4', color: '#16a34a', fontWeight: 600 }}>{vaccine.doseCount} Dose{vaccine.doseCount > 1 ? 's' : ''}</span>
              <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: '#FFF7ED', color: '#ea580c', fontWeight: 600 }}>{vaccine.availability}</span>
            </div>
            <Link to={`/vaccination/book?vaccine=${vaccine.slug}`} style={{ display: 'block', height: 48, lineHeight: '48px', borderRadius: 8, background: '#FF3B30', color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 700 }}>Book {vaccine.name}</Link>
          </div>
        </div>

        {/* Right Side — Content */}
        <div className="v-detail-content">
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>{vaccine.name}</h1>
          <p style={{ fontSize: 14, color: '#475569', margin: '0 0 16px', lineHeight: 1.6 }}>{vaccine.fullDescription}</p>

          {/* Section Tabs */}
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', marginBottom: 20, overflowX: 'auto' }}>
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                style={{ padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', color: activeSection === s.id ? '#2563eb' : '#64748b', borderBottom: activeSection === s.id ? '2px solid #2563eb' : '2px solid transparent', whiteSpace: 'nowrap' }}>
                {s.label}
              </button>
            ))}
          </div>

          {activeSection === 'overview' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>What is {vaccine.name}?</h3>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{vaccine.fullDescription}</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>Who Should Take?</h3>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{vaccine.ageRecommendation}</p>
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>Disease Prevented</h3>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{vaccine.disease}</p>
              </div>
            </div>
          )}

          {activeSection === 'benefits' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>Why {vaccine.name} is Required?</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {vaccine.benefits.map(b => (
                  <li key={b} style={{ padding: '10px 14px', marginBottom: 8, borderRadius: 8, background: '#F0FDF4', border: '1px solid #dcfce7', fontSize: 13, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span> {b}
                  </li>
                ))}
              </ul>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '24px 0 8px', color: '#0f172a' }}>Who Should Avoid?</h3>
              {vaccine.whoShouldAvoid.length > 0 ? (
                <ul style={{ padding: '0 0 0 20px' }}>
                  {vaccine.whoShouldAvoid.map((w, i) => <li key={i} style={{ fontSize: 13, color: '#475569', marginBottom: 4 }}>{w}</li>)}
                </ul>
              ) : <p style={{ fontSize: 13, color: '#64748b' }}>No specific contraindications for most individuals.</p>}
            </div>
          )}

          {activeSection === 'schedule' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>Dose Schedule</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {vaccine.schedule.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{d.dose}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Dose {d.dose}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Route: {d.route}</div>
                    </div>
                    <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 600, textAlign: 'right' }}>{d.timing}</div>
                  </div>
                ))}
              </div>
              {vaccine.doseInterval && (
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 12 }}>
                  <strong>Interval:</strong> {vaccine.doseInterval}
                </p>
              )}
            </div>
          )}

          {activeSection === 'side-effects' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>Possible Side Effects</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>Most side effects are mild and resolve on their own within 1-2 days.</p>
              <ul style={{ padding: '0 0 0 20px' }}>
                {vaccine.sideEffects.map((s, i) => (
                  <li key={i} style={{ fontSize: 13, color: '#475569', marginBottom: 6 }}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {activeSection === 'faqs' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>Frequently Asked Questions</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                {vaccine.faqs.map((f, i) => (
                  <div key={i} style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: '0 0 6px' }}>Q: {f.q}</p>
                    <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.6 }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile CTA */}
      <style>{`
        @media (max-width: 768px) {
          .v-detail-layout { grid-template-columns: 1fr !important; }
          .v-detail-sidebar { position: static !important; }
        }
      `}</style>
    </div>
  );
}
