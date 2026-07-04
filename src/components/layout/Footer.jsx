import { Link } from 'react-router-dom';
import { Phone, Envelope, MapPin, FacebookLogo, InstagramLogo, Globe } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Company */}
        <div className="footer-col footer-brand">
          <img src="/logo.png" alt="Jeevan HealthCare" />
          <p>
            India's trusted platform for comprehensive home healthcare services — doctor consultations, nursing care, diagnostics, pharmacy, physiotherapy, vaccinations, and corporate wellness.
          </p>
          <div className="footer-social">
            <a href="https://www.facebook.com/JeevanHealthCare" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookLogo size={16} weight="fill" /></a>
            <a href="https://www.instagram.com/jeevanhealthcare/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramLogo size={16} weight="fill" /></a>
          </div>
        </div>

        {/* Company Links */}
        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/services">Our Services</Link>
          <Link to="/doctor-consultation">Doctors</Link>
          <Link to="/diagnostics">Diagnostics</Link>
          <Link to="/pharmacy">Pharmacy</Link>
          <Link to="/services">Careers</Link>
          <Link to="/blog">Blog</Link>
        </div>

        {/* Compliance */}
        <div className="footer-col">
          <h4>Compliance</h4>
          <p>HIPAA-Compliant Data Handling</p>
          <p>Staff Training in Home Safety Protocols</p>
          <p>Infection Control & Sanitization Assurance</p>
          <h4 style={{ color: '#fff', fontSize: 14, marginTop: 20, marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Legal</h4>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
          <Link to="/medical-disclaimer">Medical Disclaimer</Link>
          <Link to="/refund-policy">Refund Policy</Link>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/services">How It Works</Link>
          <Link to="/diagnostics">Lab Tests</Link>
          <Link to="/services">Health Packages</Link>
          <Link to="/contact">FAQs</Link>
          <Link to="/doctor-consultation">Doctor Consultation</Link>
          <Link to="/pharmacy">Order Medicines</Link>
          <Link to="/services">Corporate Wellness</Link>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact & Reach Us</h4>
          <div className="footer-contact">
            <p><Phone size={14} weight="fill" /> <a href="tel:+919700104108" style={{ display: 'inline' }}>+91 97001 04108</a></p>
            <p><Envelope size={14} /> <a href="mailto:care@jeevanhealthcare.com" style={{ display: 'inline' }}>care@jeevanhealthcare.com</a></p>
            <p><Globe size={14} /> <a href="https://www.jeevanhealthcare.com" target="_blank" style={{ display: 'inline' }}>www.jeevanhealthcare.com</a></p>
            <p><MapPin size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>10-1-128/1/2/D, 1st Floor, Ali Manor Complex, Ambedkar Nagar, Masab Tank, Hyderabad, Telangana 500004.</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <a href="https://share.google/NBt0kr9w42O8b824a" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={14} /> Google Business Profile
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Jeevan HealthCare at Home. All rights reserved.</span>
        <span>Trusted by 50,000+ Families</span>
      </div>
    </footer>
  );
}
