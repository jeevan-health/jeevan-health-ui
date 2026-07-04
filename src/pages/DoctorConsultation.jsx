import { Link } from 'react-router-dom';
import { Stethoscope, User, Phone, Clock, Shield, ChatCircle } from '@phosphor-icons/react';

export default function DoctorConsultation() {
  return (
    <section className="page-section">
      <div className="container">
        <h1>Doctor Consultation at Home</h1>
        <p>
          Consult with top specialists from the comfort of your home. Our experienced doctors are available via
          chat, voice, or video call — no travel, no waiting rooms, no hassle.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20, margin: '40px 0' }}>
          {[
            { icon: User, title: 'General Physicians', desc: 'For common illnesses, fever, infections, and routine health concerns.' },
            { icon: Stethoscope, title: 'Specialists', desc: 'Cardiologists, dermatologists, neurologists, orthopedics & more.' },
            { icon: ChatCircle, title: 'Online Consultation', desc: 'Chat, voice, or video call — choose what\'s most convenient for you.' },
            { icon: Clock, title: 'Same-Day Appointments', desc: 'Book in the morning, consult by evening. Urgent needs prioritized.' },
            { icon: Shield, title: 'Verified Doctors', desc: 'All our doctors are MBBS, MD, or equivalent certified professionals.' },
            { icon: Phone, title: 'Follow-Up Care', desc: 'Seamless follow-ups with digital prescriptions and health records.' },
          ].map(s => (
            <div key={s.title} className="service-card-mini">
              <div style={{ fontSize: 28, color: 'var(--royal-blue)', marginBottom: 8 }}><s.icon size={28} weight="fill" /></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/contact" className="btn-primary"><Phone size={20} weight="fill" /> Book a Doctor Consultation</Link>
        </div>
      </div>
    </section>
  );
}
