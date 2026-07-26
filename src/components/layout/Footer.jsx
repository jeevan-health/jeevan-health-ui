import { Link } from 'react-router-dom';

const WA = 'https://wa.me/919700104108';
const TEL = 'tel:+919700104108';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/logo.png" alt="Jeevan HealthCare at Home" width="200" height="48" />
          <p className="footer-copy">
            Complete healthcare at your doorstep. Free home sample collection · NABL partner labs ·
            Digital reports on email &amp; app.
          </p>
        </div>

        <nav className="footer-links" aria-label="Footer">
          <Link to="/diagnostics">Lab tests</Link>
          <Link to="/signup">Login</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        <div className="footer-contact">
          <a href={TEL}>📞 +91 97001 04108</a>
          <a href={WA} target="_blank" rel="noopener noreferrer">
            💬 WhatsApp
          </a>
        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} Jeevan HealthCare. An ISO 9001:2015 Certified Company. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
