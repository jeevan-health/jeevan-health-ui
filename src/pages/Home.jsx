import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill, Stethoscope, Flask, Shield, Heart, Monitor,
  Baby, User, Syringe, FirstAidKit, Clock, Heartbeat,
  Phone, Star, Truck, Microscope, Clipboard, Buildings,
  Brain, Eye, Tooth, Ear, Bone, Users, Sparkle,
  ChatCircle, CheckCircle, CaretRight, CaretLeft, Globe, SuitcaseSimple,
} from '@phosphor-icons/react';

const services = [
  { icon: Stethoscope, title: 'Doctor Consultation', tag: 'BOOK NOW', path: '/doctor-consultation' },
  { icon: Flask, title: 'Lab Tests', tag: 'AT HOME', path: '/diagnostics' },
  { icon: Heartbeat, title: 'Health Packages', tag: 'EXPLORE', path: '/services' },
  { icon: Pill, title: 'Pharmacy', tag: 'ORDER NOW', path: '/pharmacy' },
  { icon: User, title: 'Nursing Care', tag: 'AT HOME', path: '/services' },
  { icon: Heart, title: 'Physiotherapy', tag: 'BOOK NOW', path: '/services' },
  { icon: Users, title: 'Elder Care', tag: 'COMPASSIONATE', path: '/services' },
  { icon: Syringe, title: 'Vaccination', tag: 'AT HOME', path: '/services' },
  { icon: Monitor, title: 'Home ICU', tag: 'SETUP', path: '/services' },
  { icon: FirstAidKit, title: 'Medical Equipment', tag: 'RENT / BUY', path: '/services' },
  { icon: SuitcaseSimple, title: 'Corporate Healthcare', tag: 'FOR BUSINESS', path: '/services' },
  { icon: Shield, title: 'Health Insurance', tag: 'EXPLORE PLANS', path: '/services' },
];

const whyChoose = [
  { icon: Shield, title: 'Certified Professionals', desc: 'All doctors, nurses, and therapists are background-verified and licensed.' },
  { icon: Microscope, title: 'NABL Partner Labs', desc: 'Tests processed in NABL-accredited laboratories for accuracy.' },
  { icon: Truck, title: 'Home Collection', desc: 'Free sample collection from your doorstep at your preferred time.' },
  { icon: Star, title: 'Affordable Pricing', desc: 'Transparent pricing with 60% off on diagnostic tests.' },
  { icon: Clock, title: '24×7 Support', desc: 'Round-the-clock care coordinators for appointments & emergencies.' },
  { icon: Monitor, title: 'Digital Reports', desc: 'Instant digital reports delivered via app, email, and web.' },
  { icon: Shield, title: 'Secure Patient Data', desc: 'HIPAA-compliant data handling with end-to-end encryption.' },
  { icon: Clipboard, title: 'Real-Time Tracking', desc: 'Live tracking of sample collection, service delivery, and reports.' },
];

const healthPackages = [
  { name: 'Basic Health Checkup', tests: '30+ Tests', price: 999, oldPrice: 2499 },
  { name: 'Essential Wellness', tests: '45+ Tests', price: 1499, oldPrice: 3749 },
  { name: 'Executive Health', tests: '60+ Tests', price: 2499, oldPrice: 6249 },
  { name: 'Full Body Checkup', tests: '85+ Tests', price: 3999, oldPrice: 9999 },
  { name: 'Diabetes Care Package', tests: '25+ Tests', price: 1299, oldPrice: 3249 },
  { name: 'Cardiac Health Check', tests: '35+ Tests', price: 1999, oldPrice: 4999 },
  { name: 'Liver Function Panel', tests: '15+ Tests', price: 899, oldPrice: 2249 },
  { name: 'Kidney Health Check', tests: '20+ Tests', price: 1099, oldPrice: 2749 },
  { name: 'Women\'s Wellness', tests: '40+ Tests', price: 1799, oldPrice: 4499 },
  { name: 'Men\'s Wellness', tests: '35+ Tests', price: 1599, oldPrice: 3999 },
  { name: 'Senior Citizen Care', tests: '50+ Tests', price: 2199, oldPrice: 5499 },
  { name: 'Child Health Check', tests: '20+ Tests', price: 799, oldPrice: 1999 },
  { name: 'Pregnancy Wellness', tests: '30+ Tests', price: 2499, oldPrice: 6249 },
  { name: 'Cancer Screening', tests: '20+ Tests', price: 4999, oldPrice: 12499 },
  { name: 'Corporate Checkup', tests: 'Customizable', price: 599, oldPrice: 1499 },
];

const doctorSpecs = [
  { icon: Heartbeat, name: 'Cardiologist' },
  { icon: Brain, name: 'Neurologist' },
  { icon: Monitor, name: 'Pulmonologist' },
  { icon: Bone, name: 'Orthopedic Surgeon' },
  { icon: Baby, name: 'Pediatrician' },
  { icon: User, name: 'Gynecologist' },
  { icon: Brain, name: 'Psychiatrist' },
  { icon: User, name: 'Dermatologist' },
  { icon: Ear, name: 'ENT Specialist' },
  { icon: Eye, name: 'Ophthalmologist' },
  { icon: User, name: 'Endocrinologist' },
  { icon: User, name: 'Diabetologist' },
  { icon: User, name: 'Gastroenterologist' },
  { icon: Shield, name: 'Hepatologist' },
  { icon: User, name: 'Nephrologist' },
  { icon: User, name: 'Urologist' },
  { icon: Shield, name: 'Oncologist' },
  { icon: Bone, name: 'Rheumatologist' },
  { icon: Monitor, name: 'Radiologist' },
  { icon: Shield, name: 'Anesthesiologist' },
  { icon: User, name: 'General Surgeon' },
  { icon: User, name: 'Plastic Surgeon' },
  { icon: Heartbeat, name: 'Vascular Surgeon' },
  { icon: Shield, name: 'Infectious Disease Specialist' },
  { icon: User, name: 'Geriatrician' },
  { icon: Baby, name: 'Fertility Specialist' },
  { icon: Baby, name: 'Neonatologist' },
  { icon: FirstAidKit, name: 'Pain Management Specialist' },
  { icon: Syringe, name: 'Emergency Medicine Specialist' },
  { icon: Heartbeat, name: 'Critical Care Specialist' },
];

const equipment = [
  { name: 'Hospital Beds', icon: Monitor },
  { name: 'Oxygen Concentrators', icon: Monitor },
  { name: 'Wheelchairs', icon: Monitor },
  { name: 'CPAP / BiPAP', icon: Monitor },
  { name: 'Patient Monitors', icon: Heartbeat },
  { name: 'Suction Machines', icon: Monitor },
  { name: 'Nebulizers', icon: Monitor },
  { name: 'Walking Aids', icon: Monitor },
];

const aiCapabilities = [
  { icon: Clipboard, title: 'Symptom Checker', desc: 'Enter your symptoms and get AI-powered recommendations.' },
  { icon: Flask, title: 'Test Recommendations', desc: 'AI suggests the right tests based on your profile.' },
  { icon: Heartbeat, title: 'Health Package Suggestions', desc: 'Personalized package recommendations for your needs.' },
  { icon: Star, title: 'Diet Advice', desc: 'AI-driven nutrition and diet recommendations.' },
  { icon: Shield, title: 'Preventive Health Tips', desc: 'Proactive health tips based on your risk factors.' },
];

const techFeatures = [
  { icon: Clipboard, title: 'Online Booking' },
  { icon: Truck, title: 'Live Service Tracking' },
  { icon: Monitor, title: 'Digital Reports' },
  { icon: Shield, title: 'EMR / EHR' },
  { icon: Shield, title: 'ABHA Integration' },
  { icon: Globe, title: 'Health Wallet' },
  { icon: Monitor, title: 'Remote Monitoring' },
  { icon: Users, title: 'Family Health Management' },
];

const testimonials = [
  { name: 'Suresh Kumar', text: 'Excellent service! The nurse was very professional and caring. Highly recommend Jeevan HealthCare for home healthcare needs.', rating: 5 },
  { name: 'Priya Sharma', text: 'Got my lab tests done at home. So convenient! The phlebotomist was on time and very gentle. Reports came within 24 hours.', rating: 5 },
  { name: 'Ramesh Reddy', text: 'Booked a doctor consultation online. The doctor was very thorough and prescribed medicines which were delivered within 2 hours!', rating: 5 },
  { name: 'Lakshmi Devi', text: 'The physiotherapy sessions at home have been a blessing for my father. Professional therapist, great results.', rating: 4 },
];

const blogs = [
  { title: 'Testing Pregnancy At Home? Here\'s Everything About Pregnancy Test Kits', date: '08.06.26', author: 'Jeevan HealthCare' },
  { title: 'What are the best sources of probiotics for diabetics?', date: '30.05.26', author: 'Jeevan HealthCare' },
  { title: 'Can Diabetes Be Diagnosed Without Symptoms?', date: '24.05.26', author: 'Jeevan HealthCare' },
  { title: 'How To Bring Down The HbA1c Level?', date: '19.05.26', author: 'Jeevan HealthCare' },
  { title: 'Hypothyroidism Diet: Foods To Eat And Avoid', date: '02.05.26', author: 'Jeevan HealthCare' },
  { title: 'A Complete Guide To Constipation', date: '28.04.26', author: 'Jeevan HealthCare' },
];

const faqs = [
  { q: 'How do I book a doctor consultation?', a: 'You can book through our website or call +91 97001 04108. Choose your preferred specialty and time slot.' },
  { q: 'How are lab tests conducted at home?', a: 'A trained phlebotomist visits your home at the scheduled time, collects samples, and processes them at our NABL-accredited partner labs.' },
  { q: 'How long does medicine delivery take?', a: 'We deliver medicines within 2-4 hours in select areas. Standard delivery takes 24 hours.' },
  { q: 'Are your healthcare professionals verified?', a: 'Yes, all our doctors, nurses, and therapists undergo thorough background verification and are licensed professionals.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets.' },
  { q: 'Can I cancel or reschedule an appointment?', a: 'Yes, you can cancel or reschedule up to 2 hours before the appointment at no charge.' },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [pkgIndex, setPkgIndex] = useState(0);
  const pkgGroup = 5;

  return (
    <>
      {/* 1. Hero Banner */}
      <section className="banner-carousel">
        <div className="banner-slide">
          <div style={{
            background: 'linear-gradient(135deg, #0F5DA8 0%, #0C6BC4 50%, #0B7DE5 100%)',
            padding: '48px 40px', borderRadius: 'var(--radius-lg)',
            width: '100%', maxWidth: 1240, margin: '0 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 24, position: 'relative', overflow: 'hidden',
          }}>
            <img src="/logo.png" alt="" style={{ position: 'absolute', right: -20, top: -20, height: 200, opacity: 0.06, filter: 'brightness(0) invert(1)', pointerEvents: 'none' }} />
            <div style={{ color: '#fff', maxWidth: 560, position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.15)', borderRadius: 50,
                padding: '5px 14px 5px 5px', fontSize: 12, marginBottom: 14,
              }}>
                <span style={{ background: '#00D4FF', borderRadius: 50, padding: '2px 10px', fontWeight: 700, color: '#0a4a8a' }}>
                  Most booked today
                </span>
                <span style={{ color: 'rgba(255,255,255,0.85)' }}>Full Body Checkup — 60% off</span>
              </div>
              <h1 style={{ color: '#fff', fontSize: 36, marginBottom: 12, lineHeight: 1.2 }}>
                Complete Healthcare<br />at Your Doorstep
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
                Book doctors, diagnostics, pharmacy, nursing, physiotherapy, vaccinations, and more — all from one trusted platform.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/book-appointment" className="btn-primary"><Phone size={18} weight="fill" /> Book Appointment</Link>
                <Link to="/diagnostics" className="btn-primary" style={{ background: 'rgba(255,255,255,0.2)' }}><Flask size={18} /> Book Lab Test</Link>
                <Link to="/pharmacy" className="btn-primary" style={{ background: 'rgba(255,255,255,0.2)' }}><Pill size={18} /> Order Medicines</Link>
                <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ background: '#25d366', boxShadow: '0 3px 12px rgba(37,211,102,0.3)' }}>
                  WhatsApp Now
                </a>
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
                {['Home Healthcare', 'NABL Partner Labs', 'Certified Professionals', 'Digital Reports'].map(b => (
                  <span key={b} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.8)' }}>
                    <CheckCircle size={14} weight="fill" color="#25d366" /> {b}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
              {[
                { label: 'Doctor available', time: 'in 30–60 mins' },
                { label: 'Home sample collection', time: 'in 30 mins' },
              ].map(item => (
                <div key={item.label} style={{
                  background: 'rgba(255,255,255,0.1)', borderRadius: 10,
                  padding: '12px 16px', backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}>
                  <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Actions */}
      <section className="section">
        <div className="container">
          <div className="service-grid">
            {services.map(s => (
              <Link key={s.title} to={s.path} className="service-card">
                <div className="icon"><s.icon size={28} weight="fill" /></div>
                <h3>{s.title}</h3>
                <p>{s.tag}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Choose Jeevan */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center' }}>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Why Choose Jeevan HealthCare?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {whyChoose.map(item => (
              <div key={item.title} className="info-card" style={{ textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: 28, color: '#0F5DA8', marginBottom: 8 }}><item.icon size={28} weight="fill" /></div>
                <h3 style={{ fontSize: 14, marginBottom: 4 }}>{item.title}</h3>
                <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Diagnostics Section */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: 12 }}>Lab Tests & Diagnostics at Home</h2>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 20, lineHeight: 1.6 }}>
                Search from 2,000+ tests, book online, and get free home sample collection. Digital reports delivered within 24-48 hours.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
                {['Search 2,000+ Tests', 'Browse by Category', 'Popular Tests', 'Health Packages', 'Home Collection', 'Digital Reports'].map(b => (
                  <span key={b} style={{
                    padding: '4px 12px', background: '#e8f0fe', borderRadius: 20,
                    fontSize: 12, color: '#0F5DA8', fontWeight: 500,
                  }}>{b}</span>
                ))}
              </div>
              <Link to="/diagnostics" className="btn-primary">Book a Lab Test</Link>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #e8f0fe, #d4e4f7)',
              borderRadius: 'var(--radius-lg)', padding: 32, textAlign: 'center',
            }}>
              <Flask size={64} color="#0F5DA8" opacity="0.3" weight="fill" />
              <div style={{ fontSize: 48, fontWeight: 800, color: '#0F5DA8', marginTop: 12 }}>2,000+</div>
              <div style={{ fontSize: 14, color: '#555' }}>Lab Tests Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Health Packages */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Health Packages</h2>
            <Link to="/services" className="section-link">View All Packages</Link>
          </div>
          <div style={{ position: 'relative' }}>
            <div className="scroll-row">
              {healthPackages.map(pkg => (
                <div key={pkg.name} className="test-card">
                  <h4 style={{ fontSize: 13 }}>{pkg.name}</h4>
                  <div className="tests-count">{pkg.tests}</div>
                  <div className="pricing">
                    <span className="price-current">₹{pkg.price}</span>
                    <span className="price-old">₹{pkg.oldPrice}</span>
                    <span className="discount">60% off</span>
                  </div>
                  <button className="add-btn">Book Now</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* 8. Home Healthcare Programs */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Home Healthcare Programs</h2>
            <Link to="/services" className="section-link">Learn More</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {['Post Surgery Care', 'Elder Care', 'Cancer Care', 'Stroke Rehabilitation', 'Dementia Care', 'Parkinson\'s Care', 'Home ICU Setup', 'Mother & Child Care'].map(prog => (
              <Link key={prog} to="/services" style={{
                padding: '16px 20px', background: '#fff', borderRadius: 'var(--radius)',
                border: '1px solid var(--border)', fontSize: 13, fontWeight: 500,
                color: 'var(--text-dark)', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0F5DA8'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Heart size={16} color="#0F5DA8" /> {prog}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Medical Equipment */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Medical Equipment — Rent or Purchase</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ padding: '4px 12px', background: '#0F5DA8', color: '#fff', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>Rent</span>
              <span style={{ padding: '4px 12px', background: '#00D4FF', color: '#0a4a8a', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>Purchase</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
            {equipment.map(item => (
              <Link key={item.name} to="/services" style={{
                padding: '14px', background: '#fff', borderRadius: 'var(--radius)',
                border: '1px solid var(--border)', textAlign: 'center', fontSize: 13, fontWeight: 500,
                color: 'var(--text-dark)', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0F5DA8'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <item.icon size={24} color="#0F5DA8" style={{ marginBottom: 6 }} />
                <div>{item.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Pharmacy */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: 24, marginBottom: 8 }}>Pharmacy — Medicines Delivered to Your Doorstep</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 20, maxWidth: 600, margin: '0 auto 20px' }}>
            Search medicines, upload prescriptions, order OTC products, health supplements, and medical consumables. Express delivery in 2 hours.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/pharmacy" className="btn-primary" style={{ background: '#fff', color: '#0F5DA8' }}>Search Medicines</Link>
            <Link to="/pharmacy" className="btn-primary" style={{ background: 'rgba(255,255,255,0.2)' }}>Upload Prescription</Link>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
            {['OTC Products', 'Health Supplements', 'Medical Consumables', 'Refill Orders'].map(b => (
              <span key={b} style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle size={14} weight="fill" color="#25d366" /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Corporate Healthcare */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: 12 }}>Corporate Healthcare Solutions</h2>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 20, lineHeight: 1.6 }}>
                Empower your workforce with customizable health checkups, occupational health, vaccination drives, and subscription plans — seamlessly integrated with digital tools and compliance.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {['Employee Wellness Programs', 'Industrial Medical Camps', 'Executive Health Checkups', 'Occupational Health Services', 'Vaccination Drives', 'School & College Programs'].map(s => (
                  <span key={s} style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={16} weight="fill" color="#0F5DA8" /> {s}
                  </span>
                ))}
              </div>
              <Link to="/services" className="btn-primary">Request a Demo</Link>
            </div>
            <div style={{
              background: '#e8f0fe', borderRadius: 'var(--radius-lg)',
              padding: 32, textAlign: 'center',
            }}>
              <Buildings size={64} color="#0F5DA8" opacity="0.3" weight="fill" />
              <div style={{ fontSize: 14, color: '#555', marginTop: 12, lineHeight: 1.6 }}>
                Trusted by leading organizations for employee healthcare needs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Health Insurance */}
      <section className="section">
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', borderRadius: 'var(--radius-lg)',
            padding: '40px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20,
          }}>
            <div style={{ color: '#fff' }}>
              <h2 style={{ color: '#fff', fontSize: 22, marginBottom: 8 }}>Health Insurance Made Simple</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, maxWidth: 500 }}>
                Compare plans, buy insurance, get claims support, and cashless assistance — all from one platform.
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
                {['Compare Plans', 'Buy Insurance', 'Claims Support', 'Cashless Assistance', 'Renew Policy'].map(b => (
                  <span key={b} style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle size={14} weight="fill" /> {b}
                  </span>
                ))}
              </div>
            </div>
            <Link to="/services" className="btn-primary" style={{ background: '#fff', color: '#0F5DA8' }}>
              Explore Plans
            </Link>
          </div>
        </div>
      </section>

      {/* 13. AI Health Assistant */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center' }}>
            <h2 className="section-title" style={{ textAlign: 'center' }}>AI Health Assistant</h2>
          </div>
          <p style={{ textAlign: 'center', color: '#888', fontSize: 14, maxWidth: 600, margin: '0 auto 24px' }}>
            Powered by artificial intelligence to help you make informed health decisions
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {aiCapabilities.map(item => (
              <div key={item.title} className="info-card" style={{ textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: 28, color: '#0F5DA8', marginBottom: 8 }}><item.icon size={28} weight="fill" /></div>
                <h3 style={{ fontSize: 14, marginBottom: 4 }}>{item.title}</h3>
                <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Technology Platform */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center' }}>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Our Technology Platform</h2>
          </div>
          <p style={{ textAlign: 'center', color: '#888', fontSize: 14, maxWidth: 600, margin: '0 auto 24px' }}>
            A seamless digital healthcare experience powered by cutting-edge technology
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
            {techFeatures.map(f => (
              <div key={f.title} style={{
                padding: '16px', background: '#fff', borderRadius: 'var(--radius)',
                border: '1px solid var(--border)', textAlign: 'center', fontSize: 13, fontWeight: 500,
                color: 'var(--text-dark)',
              }}>
                <f.icon size={24} color="#0F5DA8" style={{ marginBottom: 6 }} />
                <div>{f.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. Testimonials */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center' }}>
            <h2 className="section-title" style={{ textAlign: 'center' }}>What Our Patients Say</h2>
          </div>
          <div className="scroll-row">
            {testimonials.map(t => (
              <div key={t.name} className="blog-card" style={{ width: 300 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#0F5DA8' }}>{t.name}</div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} weight={i < t.rating ? 'fill' : 'regular'} color={i < t.rating ? '#0F5DA8' : '#ddd'} />
                  ))}
                </div>
                <p style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16. Blog */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Health Blogs & Articles</h2>
            <Link to="/book-appointment" className="section-link">View All</Link>
          </div>
          <div className="scroll-row">
            {blogs.map(blog => (
              <div key={blog.title} className="blog-card">
                <div className="meta">{blog.author} — {blog.date}</div>
                <h4>{blog.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 18. FAQ */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center' }}>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 'var(--radius)',
                border: '1px solid var(--border)', marginBottom: 8, overflow: 'hidden',
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', padding: '14px 18px', textAlign: 'left', fontSize: 14,
                  fontWeight: 600, color: 'var(--text-dark)', background: 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  {faq.q}
                  <CaretRight size={14} weight="bold" style={{
                    transform: openFaq === i ? 'rotate(90deg)' : 'rotate(0)',
                    transition: 'transform 0.2s', flexShrink: 0,
                  }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 18px 14px', fontSize: 13, color: '#666', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}


