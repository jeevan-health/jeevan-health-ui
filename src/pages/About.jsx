import React from 'react';

export default function About() {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: '#fff', padding: '48px 16px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>About Jeevan HealthCare</h1>
          <p style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.7 }}>
            Making quality diagnostics accessible to every Indian.
          </p>
        </div>
      </div>

      <div className="page-section container" style={{ maxWidth: 800 }}>
        <div className="grid-2" style={{ marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Our Mission</h2>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              At Jeevan HealthCare, we believe that access to accurate diagnostic testing is a fundamental right.
              We bridge the gap between patients and quality healthcare by providing convenient, affordable, and reliable
              diagnostic services right at your doorstep.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Our Vision</h2>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              To become India's most trusted healthcare companion by leveraging technology to make diagnostic testing
              seamless, transparent, and accessible to everyone, everywhere.
            </p>
          </div>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', marginBottom: 16 }}>Why Choose Us?</h2>
        <div className="grid-2">
          {[
            { title: 'NABL Accredited Labs', desc: 'All tests are processed in NABL-accredited laboratories with stringent quality controls.' },
            { title: 'Free Home Collection', desc: 'Trained and experienced phlebotomists collect samples from your home at no extra cost.' },
            { title: 'Digital Reports', desc: 'Reports are delivered directly to your WhatsApp, Email, and can be accessed anytime from your account.' },
            { title: 'Affordable Pricing', desc: 'We offer the best prices on all diagnostic tests with regular discounts and health packages.' },
            { title: 'Fast Turnaround', desc: 'Most test reports are delivered within 24-48 hours of sample collection.' },
            { title: 'Expert Review', desc: 'All reports are reviewed by qualified doctors to ensure accurate interpretation.' },
          ].map(item => (
            <div key={item.title} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{item.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32, padding: 24, background: 'var(--bg-light)', borderRadius: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ready to get started?</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Book your first test today and experience the Jeevan HealthCare difference.</p>
          <a href="/diagnostics" className="btn btn-primary btn-lg">Book a Test</a>
        </div>
      </div>
    </div>
  );
}
