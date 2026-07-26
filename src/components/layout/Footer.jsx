import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/logo.svg" alt="" aria-hidden />
          <p className="footer-copy">
            Complete healthcare at your doorstep. Home sample collection · NABL partner labs · Digital
            reports.
          </p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/diagnostics">Lab tests</Link>
          <Link to="/signup">Login / Sign up</Link>
          <a href="https://jeevanhealthcare.com" rel="noreferrer">
            jeevanhealthcare.com
          </a>
        </nav>
        <p className="footer-copy">© {new Date().getFullYear()} Jeevan HealthCare. All rights reserved.</p>
      </div>
    </footer>
  );
}
