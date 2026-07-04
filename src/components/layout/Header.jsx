import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  House, StackSimple, Info, User, Pill, Flask, Phone,
  Stethoscope, Syringe, Heart, FirstAidKit, Baby, ChartBar,
  Briefcase, Monitor, Shield, Globe, Buildings, Users as UsersIcon,
  Clock, CaretDown, List, X, Heartbeat,
} from '@phosphor-icons/react';

const serviceGroups = [
  {
    label: 'Home Healthcare', icon: House,
    items: [
      { icon: Stethoscope, label: 'Doctor Consultation at Home', path: '/doctor-consultation' },
      { icon: Pill, label: 'Medicine Delivery at Home', path: '/pharmacy' },
      { icon: Flask, label: 'Lab Tests & Diagnostics at Home', path: '/diagnostics' },
      { icon: Monitor, label: 'X-Ray, ECG, EEG at Home', path: '/diagnostics' },
      { icon: User, label: 'Nursing Care at Home', path: '/services' },
      { icon: UsersIcon, label: 'Caregiver Services at Home', path: '/services' },
      { icon: Heart, label: 'Physiotherapy at Home', path: '/services' },
      { icon: Syringe, label: 'Vaccination at Home', path: '/services' },
      { icon: Monitor, label: 'Medical Equipment Rental', path: '/services' },
      { icon: Monitor, label: 'Home ICU Setup', path: '/services' },
    ],
  },
  {
    label: 'Preventive & Corporate', icon: Briefcase,
    items: [
      { icon: User, label: 'Employment Health Checkups', path: '/services' },
      { icon: Briefcase, label: 'Corporate & Occupational Health', path: '/services' },
      { icon: Monitor, label: 'Health Checkup Packages', path: '/services' },
      { icon: Clock, label: 'Annual Health Plans', path: '/services' },
    ],
  },
  {
    label: 'Mother & Child / Wellness', icon: Baby,
    items: [
      { icon: Baby, label: 'Postnatal & Neonatal Care', path: '/services' },
      { icon: Baby, label: 'Pediatric Consultations', path: '/services' },
      { icon: Heart, label: 'Yoga & Meditation Sessions', path: '/services' },
      { icon: User, label: 'Dietitian Consultations', path: '/services' },
      { icon: ChartBar, label: 'Lifestyle Disease Reversal', path: '/services' },
      { icon: Shield, label: 'Smoking Cessation', path: '/services' },
    ],
  },
  {
    label: 'Specialist & Digital', icon: Globe,
    items: [
      { icon: Heartbeat, label: 'Oncology / Cardiac Rehab', path: '/services' },
      { icon: Globe, label: 'Pre-Travel Health', path: '/services' },
      { icon: Monitor, label: 'Digital Health Tools & Apps', path: '/services' },
      { icon: Shield, label: 'Health Insurance Assistance', path: '/services' },
      { icon: Buildings, label: 'B2B & Institutional Services', path: '/services' },
      { icon: UsersIcon, label: 'Community Health Camps', path: '/services' },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <img src="/logo.png" alt="Jeevan HealthCare" />
        </Link>

        <nav>
          <ul className="nav-list">
            <li><Link to="/" className={`nav-link ${isActive('/')}`}><House size={16} /> Home</Link></li>
            <li><Link to="/about" className={`nav-link ${isActive('/about')}`}><Info size={16} /> About Us</Link></li>
            <li>
              <button className="nav-link" style={{ background: 'none', cursor: 'pointer' }}>
                <StackSimple size={16} /> Services <CaretDown size={12} weight="bold" />
              </button>
              <div className="mega-menu">
                {serviceGroups.map(group => (
                  <div key={group.label} className="mega-group">
                    <h4><group.icon size={14} /> {group.label}</h4>
                    {group.items.map(item => (
                      <Link key={item.label} to={item.path}>
                        <item.icon size={16} /> {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </li>
            <li><Link to="/doctor-consultation" className={`nav-link ${isActive('/doctor-consultation')}`}><User size={16} /> Doctors</Link></li>
            <li><Link to="/pharmacy" className={`nav-link ${isActive('/pharmacy')}`}><Pill size={16} /> Medicines</Link></li>
            <li><Link to="/diagnostics" className={`nav-link ${isActive('/diagnostics')}`}><Flask size={16} /> Lab Tests</Link></li>
            <li><Link to="/contact" className="nav-link nav-cta"><Phone size={16} weight="fill" /> Contact Us</Link></li>
          </ul>
        </nav>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
        </button>
      </div>

      {mobileOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: '12px 20px', maxHeight: '70vh', overflowY: 'auto' }}>
          {[
            { label: 'Home', path: '/', icon: House },
            { label: 'About Us', path: '/about', icon: Info },
            { label: 'Services', path: '/services', icon: StackSimple },
            { label: 'Doctors', path: '/doctor-consultation', icon: User },
            { label: 'Medicines', path: '/pharmacy', icon: Pill },
            { label: 'Lab Tests', path: '/diagnostics', icon: Flask },
            { label: 'Contact Us', path: '/contact', icon: Phone },
          ].map(link => (
            <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#0A5EB0', fontWeight: 500, fontSize: 14 }}>
              <link.icon size={18} /> {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
