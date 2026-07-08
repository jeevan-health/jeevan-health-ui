import React from 'react';
import { Link } from 'react-router-dom';
import { seedTests } from '../data/seedData';
import { getPackagesByAxis } from '../utils/packageGenerator';

const testimonials = [
  { name: 'Priya Sharma', text: 'Excellent service! The phlebotomist was on time and very professional. Reports came within 24 hours.', rating: 5 },
  { name: 'Rajesh Kumar', text: 'I have been using Jeevan HealthCare for all my family health checkups. Great prices and reliable reports.', rating: 5 },
  { name: 'Anita Desai', text: 'The home collection service is a lifesaver for my elderly parents. So convenient and safe.', rating: 5 },
];

const faqs = [
  { q: 'How do I book a test?', a: 'Simply search for the test you need, select a convenient time slot, and our phlebotomist will visit your home for sample collection.' },
  { q: 'Is home sample collection free?', a: 'Yes, home sample collection is completely free for all tests and packages booked through our platform.' },
  { q: 'How will I receive my reports?', a: 'Reports are delivered via WhatsApp, Email, and can be downloaded from your account on our website.' },
  { q: 'Are your labs certified?', a: 'All our partner labs are NABL-accredited and use state-of-the-art equipment for accurate results.' },
  { q: 'Can I cancel or reschedule?', a: 'Yes, you can cancel or reschedule your booking up to 2 hours before the scheduled collection time.' },
];

export default function Home() {
  const popular = seedTests.slice(0, 8);
  const pkgs = Object.values(getPackagesByAxis(seedTests)).flat().slice(0, 4);

  return (
    <div>
      <HeroSection />
      <TrustStrip />
      <QuickActions />
      <PopularTests popular={popular} />
      <PackagesSection pkgs={pkgs} />
      <HowItWorks />
      <Testimonials />
      <FaqSection />
    </div>
  );
}

function HeroSection() {
  const stats = [
    { label: '5000+ Tests', icon: '🔬' },
    { label: 'Free Home Collection', icon: '🚚' },
    { label: 'NABL Certified Labs', icon: '🏥' },
    { label: 'Reports in 24 Hours', icon: '⏱️' },
  ];
  return (
    <div className="hero" style={{ background: 'linear-gradient(135deg, #0B5DA8 0%, #1565C0 50%, #1a73e8 100%)', padding: '40px 16px 48px', overflow: 'hidden' }}>
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
            {stats.map(s => (
              <span key={s.label} style={{ background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                {s.icon} {s.label}
              </span>
            ))}
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1.15, margin: '0 0 6px', letterSpacing: -0.5 }}>
            Book Lab Tests <br /><span style={{ color: '#FFD54F' }}>At Home</span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 20, lineHeight: 1.6, maxWidth: 480 }}>
            India's most trusted diagnostics platform. Free sample collection by trained phlebotomists.
            NABL certified labs. Accurate digital reports delivered to your doorstep.
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <Link to="/diagnostics" className="btn btn-primary btn-lg" style={{ background: '#FF3B30', border: 'none', fontSize: 14, padding: '12px 28px' }}>Book Lab Tests</Link>
            <Link to="/upload-prescription" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#22C55E', borderWidth: 2, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>📄 Upload Prescription</Link>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <Link to="/services" className="btn btn-outline" style={{ color: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.3)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>📦 Book Health Package</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, background: '#fff', borderRadius: 10, padding: '4px 4px 4px 16px', maxWidth: 480 }}>
            <input type="text" placeholder="Search Tests..." style={{ flex: 1, border: 'none', background: 'transparent', padding: '8px 0', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
            <Link to="/diagnostics" style={{ padding: '8px 18px', background: '#0B5DA8', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>🔍 Search</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 16, color: '#FFD54F' }}>★</span>)}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>4.9</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>50,000+ Happy Patients</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, textAlign: 'center', backdropFilter: 'blur(4px)' }}>
            <div style={{ fontSize: 48, marginBottom: 6 }}>👨‍👩‍👧‍👦</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>Family</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Full Family Care</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, textAlign: 'center', backdropFilter: 'blur(4px)' }}>
            <div style={{ fontSize: 48, marginBottom: 6 }}>👨‍⚕️</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>Doctor</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Expert Guidance</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, textAlign: 'center', backdropFilter: 'blur(4px)' }}>
            <div style={{ fontSize: 48, marginBottom: 6 }}>🩺</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>Phlebotomist</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Home Collection</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, textAlign: 'center', backdropFilter: 'blur(4px)' }}>
            <div style={{ fontSize: 48, marginBottom: 6 }}>👴</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>Senior Citizen</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Elderly Care</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustStrip() {
  const items = [
    'NABL Certified', 'Free Home Collection', 'Same Day Collection',
    'Secure Payment', 'Doctor Support', 'Digital Reports', '24x7 Support',
  ];
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
      <div className="container" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        {items.map(item => (
          <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', padding: '4px 10px', background: '#f0fdf4', borderRadius: 6 }}>
            <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 11 }}>✔</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { icon: '🩸', label: 'Book Lab Test', desc: '1000+ tests at home, up to 60% off', path: '/diagnostics', color: '#0B5DA8' },
    { icon: '📦', label: 'Health Packages', desc: 'Full body, diabetes, cardiac & more', path: '/services', color: '#16a34a' },
    { icon: '📤', label: 'Upload Prescription', desc: 'Upload Rx, we recommend the right tests', path: '/upload-prescription', color: '#dc2626' },
    { icon: '👨‍⚕️', label: 'Doctor Consultation', desc: 'Consult top doctors from home', path: '/contact', color: '#7c3aed' },
    { icon: '💊', label: 'Medicine Delivery', desc: 'Medicines delivered to your doorstep', path: '/contact', color: '#e65100' },
    { icon: '🏠', label: 'Home Nursing', desc: 'Trained nurses at home', path: '/contact', color: '#0891b2' },
  ];
  return (
    <div className="page-section" style={{ background: '#f8f9fa' }}>
      <div className="container">
        <div className="grid-3" style={{ gap: 14 }}>
          {actions.map(a => (
            <Link key={a.label} to={a.path}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px',
                background: '#fff', borderRadius: 14, textDecoration: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e8edf2',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.boxShadow = `0 4px 16px ${a.color}20`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf2'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${a.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>
                {a.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 2 }}>{a.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{a.desc}</div>
              </div>
              <span style={{ color: '#ccc', fontSize: 18 }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function PopularTests({ popular }) {
  return (
    <div className="page-section" style={{ background: 'var(--bg-light)' }}>
      <div className="container">
        <h2 className="section-title">Popular Tests</h2>
        <p className="section-subtitle">Most booked diagnostic tests</p>
        <div className="grid-4">
          {popular.map(t => (
            <Link key={t.id} to={`/test/${t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} className="test-card">
              <div>
                <h3>{t.name}</h3>
                <div className="cat">{t.category}</div>
                <div className="desc">{t.description}</div>
              </div>
              <div className="footer">
                <div>
                  <span className="price">₹{t.offerPrice || t.price}</span>
                  {t.offerPrice && <span className="mrp">₹{t.price}</span>}
                </div>
                <span className="badge badge-green">Free Home Collection</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/diagnostics" className="btn btn-outline">View All Tests →</Link>
        </div>
      </div>
    </div>
  );
}

function PackagesSection({ pkgs }) {
  return (
    <div className="page-section container">
      <h2 className="section-title">Health Packages</h2>
      <p className="section-subtitle">Comprehensive health checkup packages</p>
      <div className="grid-4">
        {pkgs.filter(Boolean).map(p => (
          <Link key={p.name} to={`/package/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} className="card" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{p.axis} Package</div>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{p.name}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{p.testCount} tests included</p>
            <div className="footer">
              <div>
                <span className="price">₹{p.bundlePrice}</span>
                {p.totalMrp > p.bundlePrice && <span className="mrp">₹{p.totalMrp}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-4">
        <Link to="/services" className="btn btn-outline">View All Packages →</Link>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { icon: '🔍', title: 'Search Test', desc: 'Search for any diagnostic test or package' },
    { icon: '📅', title: 'Book Slot', desc: 'Choose your preferred date & time' },
    { icon: '🚚', title: 'Home Collection', desc: 'Phlebotomist visits your home for sample' },
    { icon: '📊', title: 'Get Reports', desc: 'Digital reports delivered via WhatsApp/Email' },
  ];
  return (
    <div className="page-section" style={{ background: 'var(--bg-light)' }}>
      <div className="container">
        <h2 className="section-title text-center">How It Works</h2>
        <p className="section-subtitle text-center">4 simple steps to get tested</p>
        <div className="grid-4" style={{ marginTop: 16 }}>
          {steps.map((s, i) => (
            <div key={s.title} className="card text-center" style={{ padding: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, margin: '0 auto 8px' }}>{i + 1}</div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <div className="page-section container">
      <h2 className="section-title text-center">What Our Patients Say</h2>
      <p className="section-subtitle text-center">Trusted by thousands of happy patients</p>
      <div className="grid-3" style={{ marginTop: 16 }}>
        {testimonials.map(t => (
          <div key={t.name} className="card">
            <div style={{ fontSize: 16, marginBottom: 4 }}>{'⭐'.repeat(t.rating)}</div>
            <p style={{ fontSize: 13, fontStyle: 'italic', marginBottom: 12, lineHeight: 1.6 }}>"{t.text}"</p>
            <p style={{ fontSize: 12, fontWeight: 600 }}>- {t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqSection() {
  return (
    <div className="page-section" style={{ background: 'var(--bg-light)' }}>
      <div className="container" style={{ maxWidth: 700, margin: '0 auto' }}>
        <h2 className="section-title text-center">Frequently Asked Questions</h2>
        <p className="section-subtitle text-center">Everything you need to know</p>
        <div style={{ marginTop: 16 }}>
          {faqs.map((faq, i) => (
            <details key={i} style={{ marginBottom: 8, border: '1px solid var(--border)', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
              <summary style={{ padding: '12px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>{faq.q}</summary>
              <p style={{ padding: '0 16px 12px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
