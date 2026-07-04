import { Link } from 'react-router-dom';
import { Flask, Syringe, Microscope, Clock, Shield, Phone } from '@phosphor-icons/react';

export default function Diagnostics() {
  return (
    <section className="page-section">
      <div className="container">
        <h1>Lab Tests & Diagnostics at Home</h1>
        <p>
          Book lab tests from the comfort of your home. Our trained phlebotomists collect samples at your
          doorstep and deliver digital reports within 24-48 hours. Trusted by 50,000+ families.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20, margin: '40px 0' }}>
          {[
            { icon: Flask, title: 'Blood Tests', desc: 'Complete blood count, lipid profile, thyroid, diabetes & more.' },
            { icon: Syringe, title: 'Specialized Panels', desc: 'Cardiac, liver, kidney, hormonal, and vitamin deficiency panels.' },
            { icon: Microscope, title: 'Home Sample Collection', desc: 'Trained professionals collect samples at your doorstep.' },
            { icon: Clock, title: 'Fast Reports', desc: 'Digital reports delivered within 24-48 hours via app & email.' },
            { icon: Shield, title: 'NABL Accredited Labs', desc: 'All tests processed in NABL-accredited partner laboratories.' },
            { icon: Phone, title: 'Health Packages', desc: 'Comprehensive health checkup packages for every age group.' },
          ].map(s => (
            <div key={s.title} className="service-card-mini">
              <div style={{ fontSize: 28, color: 'var(--royal-blue)', marginBottom: 8 }}><s.icon size={28} weight="fill" /></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/contact" className="btn-primary"><Phone size={20} weight="fill" /> Book a Lab Test</Link>
        </div>
      </div>
    </section>
  );
}
