import { Link } from 'react-router-dom';
import {
  Phone, Envelope, MapPin, FacebookLogo, InstagramLogo,
  Shield, BookBookmark, FileText, ClipboardText, Question,
} from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-col">
          <img src="/logo.png" alt="Jeevan HealthCare" style={{ height: 40, marginBottom: 16, filter: 'brightness(0) invert(1)' }} />
          <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
            India's trusted platform for comprehensive home healthcare services — from doctor consultations to nursing care, diagnostics to wellness.
          </p>
          <div className="footer-social">
            <a href="https://www.facebook.com/JeevanHealthCare" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookLogo size={18} weight="fill" /></a>
            <a href="https://www.instagram.com/jeevanhealthcare/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramLogo size={18} weight="fill" /></a>
            <a href="tel:+919700104108" aria-label="Phone"><Phone size={18} weight="fill" /></a>
            <a href="mailto:care@jeevanhealthcare.com" aria-label="Email"><Envelope size={18} weight="fill" /></a>
          </div>
        </div>

        {/* Compliance */}
        <div className="footer-col">
          <h4><Shield size={14} weight="fill" /> Compliance & Safety</h4>
          <p>HIPAA-Compliant Data Handling</p>
          <p>Staff Training in Home Safety Protocols</p>
          <p>Infection Control & Sanitization Assurance</p>
          <h4 style={{ marginTop: 20 }}><BookBookmark size={14} /> Legal</h4>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
          <Link to="/medical-disclaimer">Medical Disclaimer</Link>
          <Link to="/refund-policy">Refund Policy</Link>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4><ClipboardText size={14} /> Quick Links</h4>
          <Link to="/services">How It Works</Link>
          <Link to="/diagnostics">Lab Tests</Link>
          <Link to="/services">Health Packages</Link>
          <Link to="/contact">FAQs</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4><Phone size={14} weight="fill" /> Contact & Reach Us</h4>
          <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Phone size={14} /> Call / WhatsApp: <a href="tel:+919700104108" style={{ display: 'inline', fontWeight: 600 }}>+91 97001 04108</a>
          </p>
          <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Envelope size={14} /> <a href="mailto:care@jeevanhealthcare.com" style={{ display: 'inline' }}>care@jeevanhealthcare.com</a>
          </p>
          <p style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <MapPin size={14} style={{ flexShrink: 0, marginTop: 3 }} />
            <span>10-1-128/1/2/D, 1st Floor, Ali Manor Complex, Ambedkar Nagar, Masab Tank, Hyderabad, Telangana 500004.</span>
          </p>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <a href="https://share.google/NBt0kr9w42O8b824a" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={14} /> Google My Business
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Jeevan HealthCare at Home. All rights reserved.</span>
        <span>Built with care for better health.</span>
      </div>
    </footer>
  );
}
