import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  House, StackSimple, Info, User, Pill, Flask, Phone,
  Stethoscope, Syringe, Heart, FirstAidKit, Baby, ChartBar,
  SuitcaseSimple, Monitor, Shield, Globe, Buildings, Users as UsersIcon,
  Clock, CaretDown, List, X, Heartbeat,
  Envelope, Clipboard, Brain, Bone, WhatsappLogo, 
} from '@phosphor-icons/react';

const serviceGroups = [
  {
    label: 'Home Healthcare', icon: House,
    items: [
      { icon: Stethoscope, label: 'Doctor Consultation at Home', path: '/doctor-consultation' },
      { icon: User, label: 'Nursing Care', path: '/services' },
      { icon: UsersIcon, label: 'Caregiver Services', path: '/services' },
      { icon: Heart, label: 'Physiotherapy', path: '/services' },
      { icon: Monitor, label: 'Home ICU Setup', path: '/services' },
      { icon: Syringe, label: 'Vaccination', path: '/services' },
      { icon: Pill, label: 'Medicine Delivery', path: '/pharmacy' },
      { icon: Monitor, label: 'Medical Equipment', path: '/services' },
      { icon: Monitor, label: 'X-Ray / ECG / EEG', path: '/diagnostics' },
    ],
  },
  {
    label: 'Diagnostics', icon: Flask,
    items: [
      { icon: Flask, label: 'Individual Lab Tests', path: '/diagnostics' },
      { icon: Clipboard, label: 'Health Checkup Packages', path: '/services' },
      { icon: User, label: 'Home Sample Collection', path: '/diagnostics' },
      { icon: Monitor, label: 'Digital Reports', path: '/diagnostics' },
      { icon: Shield, label: 'Preventive Screening', path: '/services' },
    ],
  },
  {
    label: 'Specialist Care', icon: Heartbeat,
    items: [
      { icon: Heartbeat, label: 'Oncology', path: '/services' },
      { icon: Heart, label: 'Cardiac Rehabilitation', path: '/services' },
      { icon: Brain, label: 'Neurological Rehabilitation', path: '/services' },
      { icon: Bone, label: 'Orthopedic Rehabilitation', path: '/services' },
      { icon: Baby, label: 'Mother & Child Care', path: '/services' },
      { icon: Heart, label: 'Wellness Programs', path: '/services' },
    ],
  },
  {
    label: 'Corporate & Digital Health', icon: SuitcaseSimple,
    items: [
      { icon: SuitcaseSimple, label: 'Corporate Health', path: '/services' },
      { icon: Clock, label: 'Annual Plans', path: '/services' },
      { icon: Shield, label: 'Health Insurance', path: '/services' },
      { icon: Monitor, label: 'EMR / EHR', path: '/services' },
      { icon: Globe, label: 'Health Wallet', path: '/services' },
      { icon: Monitor, label: 'AI Health Tools', path: '/services' },
      { icon: Monitor, label: 'Remote Monitoring', path: '/services' },
      { icon: Shield, label: 'ABHA Integration', path: '/services' },
    ],
  },
];

const navLinks = [
  { label: 'Home', path: '/', icon: House },
  { label: 'About Us', path: '/about', icon: Info },
  { label: 'Services', path: null, icon: StackSimple, hasMega: true },
  { label: 'Doctor Consultation', path: '/doctor-consultation', icon: User },
  { label: 'Diagnostics', path: '/diagnostics', icon: Flask },
  { label: 'Pharmacy', path: '/pharmacy', icon: Pill },
  { label: 'Health Packages', path: '/services', icon: Heartbeat },
  { label: 'Corporate Healthcare', path: '/services', icon: SuitcaseSimple },
  { label: 'Health Insurance', path: '/services', icon: Shield },
  { label: 'Blog', path: '/book-appointment', icon: Globe },
  { label: 'Book Appointment', path: '/book-appointment', icon: Phone },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      {/* Utility Bar */}
      <div className="utility-bar">
        <div className="utility-inner">
          <div className="utility-left">
            <a href="tel:+919700104108"><Phone size={14} weight="fill" /> +91 97001 04108</a>
            <a href="mailto:care@jeevanhealthcare.com"><Envelope size={14} /> care@jeevanhealthcare.com</a>
            <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" className="whatsapp">
              <WhatsappLogo size={14} weight="fill" /> WhatsApp
            </a>
          </div>
          <div className="utility-right">
            <select defaultValue="en">
              <option value="en">🌐 English</option>
              <option value="te">తెలుగు</option>
              <option value="hi">हिन्दी</option>
            </select>
            <Link to="/signup"><User size={14} /> Login / Register</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="header-logo">
            <img src="/logo.png" alt="Jeevan HealthCare" />
          </Link>

          <nav>
            <ul className="nav-list">
              {navLinks.map(link => (
                <li key={link.label}>
                  {link.hasMega ? (
                    <>
                      <button className="nav-link" style={{ background: 'none', cursor: 'pointer' }}>
                        <link.icon size={16} /> {link.label} <CaretDown size={10} weight="bold" />
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
                    </>
                  ) : (
                    <Link to={link.path} className={`nav-link ${isActive(link.path)}`}>
                      <link.icon size={16} /> {link.label}
                    </Link>
                  )}
                </li>
              ))}
              <li><Link to="/book-appointment" className="nav-link nav-cta">Book Appointment</Link></li>
            </ul>
          </nav>

          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 'calc(var(--utility-height) + var(--header-height))', left: 0, right: 0, bottom: 0,
          background: '#fff', zIndex: 999, overflowY: 'auto', padding: '16px 20px',
        }}>
          {navLinks.map(link => (
            <Link key={link.label} to={link.path || '/services'} onClick={() => setMobileOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 8, color: '#0F5DA8', fontWeight: 500, fontSize: 14, borderBottom: '1px solid var(--bg-light)' }}>
              <link.icon size={18} /> {link.label}
            </Link>
          ))}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href="tel:+919700104108" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', color: 'var(--text-body)', fontSize: 14 }}>
              <Phone size={16} /> +91 97001 04108
            </a>
            <a href="mailto:care@jeevanhealthcare.com" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', color: 'var(--text-body)', fontSize: 14 }}>
              <Envelope size={16} /> care@jeevanhealthcare.com
            </a>
          </div>
        </div>
      )}
    </>
  );
}
