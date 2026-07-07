import React from 'react';
import { Link } from 'react-router-dom';
import { seedTests } from '../data/seedData';
import { getPackagesByAxis } from '../utils/packageGenerator';

const features = [
  { icon: '🏥', title: 'NABL Certified Labs', desc: 'All tests processed in accredited laboratories' },
  { icon: '🚚', title: 'Free Home Collection', desc: 'Trained phlebotomists collect samples at your doorstep' },
  { icon: '📱', title: 'Digital Reports', desc: 'Get reports on WhatsApp, Email & Mobile App' },
  { icon: '⏱️', title: 'Fast Results', desc: 'Most reports delivered within 24-48 hours' },
  { icon: '💰', title: 'Best Prices', desc: 'Affordable rates with regular discounts & offers' },
  { icon: '👨‍⚕️', title: 'Expert Guidance', desc: 'Doctor-reviewed reports with interpretation' },
];

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
      <FeaturesSection />
      <PopularTests popular={popular} />
      <PackagesSection pkgs={pkgs} />
      <HowItWorks />
      <Testimonials />
      <FaqSection />
    </div>
  );
}

function HeroSection() {
  return (
    <div className="hero">
      <div className="container">
        <h1>Your Health, Our Priority</h1>
        <p>Book diagnostic tests from home. Free sample collection by trained phlebotomists. NABL certified labs. Reports delivered digitally.</p>
        <div className="hero-search">
          <input type="text" placeholder="Search for a test (e.g., CBC, HbA1c, Thyroid)..." />
          <Link to="/diagnostics"><button>🔍 Search</button></Link>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/diagnostics" className="btn btn-primary btn-lg">Book a Test</Link>
          <Link to="/services" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>View Packages</Link>
        </div>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <div className="page-section container">
      <h2 className="section-title text-center">Why Choose Jeevan HealthCare?</h2>
      <p className="section-subtitle text-center">India's most trusted diagnostics platform</p>
      <div className="grid-3" style={{ marginTop: 16 }}>
        {features.map(f => (
          <div key={f.title} className="card feature-card">
            <div className="icon" style={{ background: 'var(--primary-light)' }}>{f.icon}</div>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{f.title}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f.desc}</p>
          </div>
        ))}
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
        {pkgs.map(p => (
          <Link key={p.name} to={`/package/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} className="card" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{p.axis} Package</div>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{p.name}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{p.tests.length} tests included</p>
            <div className="footer">
              <div>
                <span className="price">₹{p.offerPrice || p.price}</span>
                {(p.offerPrice && p.offerPrice < p.price) && <span className="mrp">₹{p.price}</span>}
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
