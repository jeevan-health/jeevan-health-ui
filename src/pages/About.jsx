import { Shield, Users, Heart, Star, Target, Eye } from '@phosphor-icons/react';

export default function About() {
  return (
    <section className="page-section">
      <div className="container">
        <h1>About Jeevan HealthCare at Home</h1>
        <p>
          Jeevan HealthCare at Home is a trusted healthcare platform dedicated to delivering comprehensive medical services
          safely and professionally at your doorstep. We believe that quality healthcare should be accessible, convenient,
          and compassionate — no matter where you are.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24, margin: '40px 0' }}>
          {[
            { icon: Target, title: 'Our Mission', desc: 'To make quality healthcare accessible to every Indian family through innovative home-based medical services that combine clinical excellence with compassionate care.' },
            { icon: Eye, title: 'Our Vision', desc: 'To become India\'s most trusted home healthcare platform — empowering millions to receive world-class medical care in the comfort of their homes.' },
            { icon: Heart, title: 'Our Values', desc: 'Compassion, integrity, innovation, and excellence guide everything we do. Every patient deserves respect, dignity, and the best possible care.' },
          ].map(item => (
            <div key={item.title} className="service-card-mini" style={{ padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 40, color: 'var(--royal-blue)', marginBottom: 16 }}><item.icon size={40} weight="fill" /></div>
              <h3 style={{ color: 'var(--medical-blue)' }}>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: 'var(--medical-blue)', marginTop: 48, marginBottom: 20 }}>Why Choose Us?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
          {[
            { icon: Shield, title: 'Verified Professionals', desc: 'All our doctors, nurses, and therapists are background-verified and trained for in-home care.' },
            { icon: Users, title: 'Personalized Care Plans', desc: 'Every patient receives a customized care plan tailored to their specific health needs and preferences.' },
            { icon: Star, title: 'Quality Assured', desc: 'We maintain the highest standards of medical care, infection control, and patient safety protocols.' },
            { icon: Heart, title: '24/7 Availability', desc: 'Our care coordinators are available round-the-clock to assist with appointments, queries, and emergencies.' },
          ].map(item => (
            <div key={item.title} className="service-card-mini">
              <div style={{ fontSize: 24, color: 'var(--royal-blue)', marginBottom: 8 }}><item.icon size={24} weight="fill" /></div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
