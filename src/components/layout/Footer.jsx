import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>🏥 Jeevan HealthCare</h3>
          <p>India's most trusted diagnostics platform. NABL-accredited labs, free home collection, and accurate reports delivered digitally to your doorstep.</p>
        </div>
        <div className="footer-col">
          <h4>Tests</h4>
          <Link to="/test/complete-blood-count-cbc">CBC</Link>
          <Link to="/test/hba1c">HbA1c</Link>
          <Link to="/test/thyroid-profile-t3-t4-tsh">Thyroid Profile</Link>
          <Link to="/test/lipid-profile">Lipid Profile</Link>
          <Link to="/test/vitamin-d-25-hydroxy">Vitamin D</Link>
          <Link to="/test/vitamin-b12">Vitamin B12</Link>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/diagnostics">Book a Test</Link>
          <Link to="/services">Health Packages</Link>
          <Link to="/my-orders">My Orders</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href="tel:+919700104108">📞 +91 97001 04108</a>
          <a href="mailto:care@jeevanhealthcare.com">✉️ care@jeevanhealthcare.com</a>
          <a href="https://wa.me/919700104108" target="_blank" rel="noopener">💬 WhatsApp</a>
          <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Mon-Sat 6AM-10PM</p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Jeevan HealthCare. All rights reserved.
      </div>
    </footer>
  );
}
