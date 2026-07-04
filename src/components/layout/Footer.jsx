import { Link } from 'react-router-dom';
import { Phone, Envelope, MapPin, FacebookLogo, InstagramLogo, TwitterLogo, YoutubeLogo } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-col footer-brand">
          <img src="/logo.png" alt="Jeevan HealthCare" style={{ height: 32 }} />
          <p>
            India's trusted platform for comprehensive home healthcare services — from doctor consultations to nursing care, diagnostics to wellness. Trusted by 50,000+ families.
          </p>
          <div className="footer-apps">
            <a href="#"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.8.7-1.5 1.5-1.5h9.6l.1.1V3H5v18h9.2v-.1H4.5c-.8 0-1.5-.7-1.5-1.4z"/><path d="M15.5 2.5v4.6h4.6L15.5 2.5z"/></svg> Google Play</a>
            <a href="#"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.04 22.2c-.7.6-1.5.8-2.4.4l-3.7-1.6c-.4.2-.9.3-1.4.3-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6c.7 0 1.3.2 1.9.5l3.7-1.6c.9-.4 1.7-.2 2.4.4l2.1 1.8-1.7 1.5-1.2-1c-.3-.2-.6-.3-1-.2l-3.4 1.5c.5.6.8 1.3.8 2.1 0 .6-.1 1.1-.4 1.5l3.4 1.5c.4.1.7.1 1-.2l1.2-1 1.7 1.5-2.1 1.8z"/></svg> App Store</a>
          </div>
          <div className="footer-social">
            <a href="https://www.facebook.com/JeevanHealthCare" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookLogo size={16} weight="fill" /></a>
            <a href="https://www.instagram.com/jeevanhealthcare/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramLogo size={16} weight="fill" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us / Grievance</Link>
          <Link to="/services">FAQs</Link>
          <Link to="/services">Health Queries</Link>
          <Link to="/services">Terms and Conditions</Link>
          <Link to="/services">Privacy Policy</Link>
          <Link to="/services">Refund Policy</Link>
          <Link to="/blog">Blogs</Link>
        </div>

        {/* Services */}
        <div className="footer-col">
          <h4>Services</h4>
          <Link to="/doctor-consultation">Doctor Consultation</Link>
          <Link to="/pharmacy">Medicine Delivery</Link>
          <Link to="/diagnostics">Lab Tests at Home</Link>
          <Link to="/services">Nursing Care</Link>
          <Link to="/services">Physiotherapy</Link>
          <Link to="/services">Vaccination at Home</Link>
          <Link to="/services">Health Checkups</Link>
          <Link to="/services">Corporate Health</Link>
        </div>

        {/* Top Specialties */}
        <div className="footer-col">
          <h4>Top Specialties</h4>
          <Link to="/doctor-consultation">General Physicians</Link>
          <Link to="/doctor-consultation">Dermatologists</Link>
          <Link to="/doctor-consultation">Pediatricians</Link>
          <Link to="/doctor-consultation">Gynecologists</Link>
          <Link to="/doctor-consultation">Cardiologists</Link>
          <Link to="/doctor-consultation">Dietitians</Link>
          <Link to="/doctor-consultation">ENT Specialists</Link>
          <Link to="/doctor-consultation">Diabetologists</Link>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact & Reach Us</h4>
          <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Phone size={14} /> <a href="tel:+919700104108" style={{ display: 'inline' }}>+91 97001 04108</a>
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Envelope size={14} /> <a href="mailto:care@jeevanhealthcare.com" style={{ display: 'inline' }}>care@jeevanhealthcare.com</a>
          </p>
          <p style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <MapPin size={14} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>10-1-128/1/2/D, 1st Floor, Ali Manor Complex, Ambedkar Nagar, Masab Tank, Hyderabad, Telangana 500004.</span>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Jeevan HealthCare at Home. All rights reserved.</span>
        <span>Trusted by 8 Crore Indians</span>
      </div>
    </footer>
  );
}
