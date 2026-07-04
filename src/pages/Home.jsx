import { Link } from 'react-router-dom';
import {
  Stethoscope, Pill, Flask, Heart, FirstAidKit, User,
  Clipboard, Syringe, Baby, Shield, Phone, ArrowRight,
  Star, Users as UsersIcon,
} from '@phosphor-icons/react';

const highlights = [
  { icon: Stethoscope, title: 'Doctor Consultation', desc: 'Chat, voice, or video call with top specialists at home' },
  { icon: Pill, title: 'Medicine Delivery', desc: 'Order prescriptions delivered to your doorstep in hours' },
  { icon: Flask, title: 'Lab Tests at Home', desc: 'Free home sample collection & digital reports' },
  { icon: Heart, title: 'Physiotherapy', desc: 'Expert physiotherapists for rehab & pain management' },
  { icon: FirstAidKit, title: 'Nursing Care', desc: 'Skilled nursing for wound care, post-surgery & more' },
  { icon: User, title: 'Elderly Care', desc: 'Compassionate caregivers for your loved ones' },
];

const stats = [
  { value: '50+', label: 'Cities Covered' },
  { value: '500+', label: 'Expert Doctors' },
  { value: '50K+', label: 'Happy Families' },
  { value: '4.8', label: 'App Rating' },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="section-hero" style={{ textAlign: 'center' }}>
        <div className="container">
          <img src="/logo.png" alt="Jeevan HealthCare" style={{ height: 64, marginBottom: 24, filter: 'brightness(0) invert(1)' }} />
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', marginBottom: 16 }}>
            Complete Healthcare<br />at Your Doorstep
          </h1>
          <p style={{ fontSize: 18, maxWidth: 700, margin: '0 auto 32px', opacity: 0.92 }}>
            From doctor consultations to nursing care, lab tests to medicine delivery — we bring 12+ professional healthcare services home.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary">
              <Phone size={20} weight="fill" /> Book Now
            </Link>
            <Link to="/services" className="btn-primary" style={{ background: 'rgba(255,255,255,0.15)', boxShadow: 'none' }}>
              Explore Services <ArrowRight size={20} weight="bold" />
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{s.value}</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-light">
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--medical-blue)' }}>Our Healthcare Services</h2>
          <p className="section-subtitle">Everything your family needs for complete home healthcare</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {highlights.map(s => (
              <div key={s.title} className="service-card-mini">
                <div className="icon" style={{ color: 'var(--royal-blue)' }}><s.icon size={28} weight="fill" /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/services" className="btn-primary">View All Services <ArrowRight size={18} weight="bold" /></Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section-white">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ color: 'var(--medical-blue)' }}>Why Families Trust Jeevan HealthCare</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24, marginTop: 40 }}>
            {[
              { icon: Shield, title: 'Verified Professionals', desc: 'All doctors, nurses, and therapists are background-verified.' },
              { icon: UsersIcon, title: 'Personalized Care', desc: 'Customized healthcare plans for every age and need.' },
              { icon: Clipboard, title: '24/7 Support', desc: 'Round-the-clock care coordinators for appointments & emergencies.' },
            ].map(item => (
              <div key={item.title} className="service-card-mini" style={{ padding: 32 }}>
                <div style={{ fontSize: 32, color: 'var(--royal-blue)', marginBottom: 12 }}><item.icon size={32} weight="fill" /></div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 20px', background: 'linear-gradient(135deg, var(--medical-blue), var(--royal-blue))', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: '#fff', fontSize: 32, marginBottom: 12 }}>Ready to Get Started?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 28, maxWidth: 600, margin: '0 auto 28px' }}>
            Join 50,000+ families who trust Jeevan HealthCare for their home healthcare needs.
          </p>
          <Link to="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--medical-blue)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <Phone size={20} weight="fill" /> Book Your Appointment
          </Link>
        </div>
      </section>
    </>
  );
}
