import { Link } from 'react-router-dom';
import {
  Stethoscope, Pill, Flask, User, Users as UsersIcon,
  Heart, Syringe, Monitor, Briefcase, Baby, Globe,
  Shield, Clock, Buildings, Info,
} from '@phosphor-icons/react';

const categories = [
  {
    icon: Stethoscope, title: 'Home Healthcare Services', color: '#0A5EB0',
    items: [
      'Doctor Consultation at Home', 'Medicine Delivery at Home',
      'Lab Tests & Diagnostics at Home', 'X-Ray, ECG, EEG at Home',
      'Nursing Care at Home', 'Caregiver Services (Elderly/Patient Care) at Home',
      'Physiotherapy at Home', 'Vaccination at Home (All Age Groups & Travel Vaccines)',
      'Medical Equipment Rental & Sales', 'Home ICU Setup & Monitoring',
    ],
  },
  {
    icon: Briefcase, title: 'Preventive & Corporate Health Services', color: '#4169E1',
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
      'Health Monitors (BP, Glucose, ECG, Pulse Oximetry & More)',
      'Health Insurance Sales & Assistance',
      'Digital Tools & Apps (Symptom Checker, e-Prescriptions, Health Wallet, Reminders)',
      'Smart Home Health Devices (Smart Weighing Scale, Thermometer, CGM, Pill Dispensers)',
      'Health Risk Assessment & Predictive Analytics',
      'Supportive Services Tools (Mental Health Screening, Diet Plans, Wellness Education)',
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
    icon: UsersIcon, title: 'Community & Public Health Engagement', color: '#0A5EB0',
    items: [
      'Free Medical Camps & CSR Activities',
      'Health Awareness & Preventive Screening Drives',
      'Health ID Creation & Ayushman Bharat (ABHA) Integration',
    ],
  },
];

export default function Services() {
  return (
    <section className="page-section">
      <div className="container">
        <h1>Our Complete Range of Services</h1>
        <p>Jeevan HealthCare at Home offers a comprehensive suite of healthcare services delivered safely at your doorstep. Browse our service categories below.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 40 }}>
          {categories.map(cat => (
            <div key={cat.title} style={{
              background: '#fff', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)', overflow: 'hidden',
              boxShadow: 'var(--shadow)',
            }}>
              <div style={{
                background: cat.color, color: '#fff', padding: '16px 24px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <cat.icon size={24} weight="fill" />
                <h3 style={{ color: '#fff', margin: 0, fontSize: 18 }}>{cat.title}</h3>
              </div>
              <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
                {cat.items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', fontSize: 14, color: '#444' }}>
                    <span style={{ color: cat.color, fontSize: 16 }}>•</span> {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to="/contact" className="btn-primary">Book a Service Now</Link>
        </div>
      </div>
    </section>
  );
}
