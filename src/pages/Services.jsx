import { Link } from 'react-router-dom';
import {
  Stethoscope, Pill, Flask, User, Users as UsersIcon,
  Heart, Syringe, Monitor, SuitcaseSimple, Baby, Globe,
  Shield, Clock, Buildings, Sparkle, CheckCircle, Phone, WhatsappLogo,
  MagnifyingGlass, Truck, FileText, ArrowRight,
} from '@phosphor-icons/react';

const quickActions = [
  { icon: Stethoscope, label: 'Doctor Consultation', desc: 'Consult top doctors from home', path: '/doctor-consultation', color: '#0F5DA8', tag: 'Available' },
  { icon: Flask, label: 'Lab Tests', desc: '1000+ tests at home, up to 60% off', path: '/diagnostics', color: '#22C55E', tag: 'Popular' },
  { icon: Heart, label: 'Health Packages', desc: 'Full body, diabetes, cardiac & more', path: '/health-packages', color: '#e53935', tag: 'Save 60%' },
  { icon: Pill, label: 'Pharmacy', desc: 'Medicines delivered in 2 hrs', path: '/pharmacy', color: '#7c3aed', tag: 'Express' },
  { icon: User, label: 'Nursing Care', desc: 'Trained nurses at home', path: '/book-appointment', color: '#0891b2', tag: 'New' },
  { icon: Heart, label: 'Physiotherapy', desc: 'Rehab & recovery at home', path: '/book-appointment', color: '#059669', tag: 'Book' },
  { icon: Syringe, label: 'Vaccination', desc: 'All age groups & travel', path: '/book-appointment', color: '#2563eb', tag: 'Home' },
  { icon: Monitor, label: 'Medical Equipment', desc: 'Rent or buy', path: '/book-appointment', color: '#e65100', tag: 'Rent' },
];

const categories = [
  {
    icon: Stethoscope, title: 'Home Healthcare Services', color: '#0F5DA8',
    items: [
      'Doctor Consultation at Home', 'Medicine Delivery at Home',
      'Lab Tests & Diagnostics at Home', 'X-Ray, ECG, EEG at Home',
      'Nursing Care at Home', 'Caregiver Services (Elderly/Patient Care) at Home',
      'Physiotherapy at Home', 'Vaccination at Home (All Age Groups & Travel Vaccines)',
      'Medical Equipment Rental & Sales', 'Home ICU Setup & Monitoring',
    ],
  },
  {
    icon: SuitcaseSimple, title: 'Preventive & Corporate Health Services', color: '#4169E1',
    items: [
      'Pre & Post Employment Health Checkups',
      'Corporate & Occupational Health Services',
      'Health Checkup Packages (Basic, Advanced, Executive & Disease-Specific)',
      'Subscription-Based & Annual Health Plans',
    ],
  },
  {
    icon: Monitor, title: 'Digital Health Tools & Technology', color: '#2563eb',
    items: [
      'Real-Time Service Booking & Tracking via App',
      'Integration with Health Records (EMR/EHR)',
      'Health Trackers & Remote Monitoring Devices',
      'Health Insurance Sales & Assistance',
      'Symptom Checker, e-Prescriptions, Health Wallet, Reminders',
      'Smart Home Health Devices (Smart Weighing Scale, Thermometer, CGM, Pill Dispensers)',
    ],
  },
  {
    icon: Baby, title: 'Mother & Child Care Services', color: '#0891b2',
    items: [
      'Postnatal & Neonatal Care at Home',
      'Pediatric Consultations & Vaccinations at Home',
      'Lactation Consultation',
    ],
  },
  {
    icon: Heart, title: 'Wellness & Lifestyle Management', color: '#059669',
    items: [
      'Yoga & Meditation Sessions at Home',
      'Dietitian/Nutritionist Consultations',
      'Lifestyle Disease Reversal Programs (Diabetes, Obesity, Hypertension)',
      'Smoking Cessation Programs',
    ],
  },
  {
    icon: User, title: 'Specialist Services at Home', color: '#7c3aed',
    items: [
      'Oncology Care (Chemo Coordination, Palliative Support)',
      'Orthopaedic Rehab & Joint Care',
      'Neurological Rehab (Stroke, Parkinson\'s, Dementia)',
      'Cardiac Rehab Programs',
    ],
  },
  {
    icon: Globe, title: 'Travel & Concierge Healthcare', color: '#0891b2',
    items: [
      'Pre-Travel Health Consultations & Vaccinations',
      'Medical Assistance for NRIs / Visiting Family',
      'Hotel/Apartment-Based Health Services (for corporate or premium clients)',
    ],
  },
  {
    icon: Buildings, title: 'B2B & Institutional Services', color: '#dc2626',
    items: [
      'Industrial Medical Camps',
      'Employee Wellness Programs',
      'School/College Health Programs (Annual Checks, Vaccinations, Awareness)',
      'Insurance TPA Coordination & Claim Support',
    ],
  },
  {
    icon: UsersIcon, title: 'Community & Public Health Engagement', color: '#0F5DA8',
    items: [
      'Free Medical Camps & CSR Activities',
      'Health Awareness & Preventive Screening Drives',
      'Health ID Creation & Ayushman Bharat (ABHA) Integration',
    ],
  },
];

export default function Services() {
  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0F5DA8 0%, #1565C0 50%, #1a73e8 100%)', padding: '28px 16px 32px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 8px', letterSpacing: -0.5 }}>
            Complete Healthcare at Your Doorstep
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '0 0 16px', lineHeight: 1.5 }}>
            Doctor consultations, lab tests, pharmacy, nursing, physiotherapy, vaccinations & more — all from one trusted platform.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/diagnostics" style={{ padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#FF3B30', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Flask size={14} weight="fill" /> Book Lab Test
            </Link>
            <Link to="/doctor-consultation" style={{ padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Stethoscope size={14} /> Consult Doctor
            </Link>
            <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#25d366', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <WhatsappLogo size={14} weight="fill" /> WhatsApp
            </a>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
            {['NABL Labs', 'Free Home Collection', 'Digital Reports', '24×7 Support'].map(b => (
              <span key={b} style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <CheckCircle size={9} weight="fill" color="#81C784" /> {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ maxWidth: 720, margin: '-16px auto 0', padding: '0 16px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
          {quickActions.map((q, i) => (
            <Link key={i} to={q.path} style={{
              background: '#fff', borderRadius: 14, padding: '14px 12px', textDecoration: 'none',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e8edf2',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = q.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf2'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${q.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <q.icon size={20} color={q.color} weight="fill" />
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>{q.label}</div>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#fff', background: q.color, padding: '1px 8px', borderRadius: 6 }}>{q.tag}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>All Services</h2>
            <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>Comprehensive healthcare, delivered to your home</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {categories.map(cat => (
              <div key={cat.title} style={{
                background: '#fff', borderRadius: 14,
                border: '1px solid #e8edf2', overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  background: cat.color, color: '#fff', padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <cat.icon size={18} weight="fill" />
                  <h3 style={{ color: '#fff', margin: 0, fontSize: 14, fontWeight: 700 }}>{cat.title}</h3>
                </div>
                <div style={{ padding: '10px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 4 }}>
                  {cat.items.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 6px', fontSize: 12, color: '#444' }}>
                      <CheckCircle size={10} weight="fill" color={cat.color} /> {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '32px 16px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Need help choosing a service?</h3>
        <p style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 16 }}>Call us or WhatsApp for free guidance</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="tel:+919700104108" style={{ padding: '10px 24px', borderRadius: 10, fontWeight: 700, fontSize: 13, background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Phone size={16} weight="fill" /> Call +91 97001 04108
          </a>
          <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" style={{ padding: '10px 24px', borderRadius: 10, fontWeight: 700, fontSize: 13, background: '#25d366', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <WhatsappLogo size={16} weight="fill" /> WhatsApp Now
          </a>
        </div>
      </div>
    </div>
  );
}
