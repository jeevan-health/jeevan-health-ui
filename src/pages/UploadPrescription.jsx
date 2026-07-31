import { Link } from 'react-router-dom';
import './page-shell.css';
import './upload-prescription.css';

const WA = 'https://wa.me/919700104108';
const TEL = 'tel:+919700104108';
const MAIL = 'mailto:support@jeevanhealthcare.com?subject=Prescription%20upload';

/**
 * Entry point only — OCR → match → cart is roadmap (Phase 16).
 * Do not fake processing success.
 */
export default function UploadPrescription() {
  return (
    <div className="page-shell up-page">
      <header className="up-head">
        <p className="up-eyebrow">Coming soon</p>
        <h1>Upload prescription</h1>
        <p>
          Soon you will upload a prescription image or PDF, we will match tests from the Jeevan
          master list, and build your cart automatically.
        </p>
      </header>

      <div className="up-card">
        <h2>What will work</h2>
        <ol>
          <li>Upload image or PDF</li>
          <li>Extract test names (OCR)</li>
          <li>Match JHC master catalog</li>
          <li>Review prices and confirm booking</li>
        </ol>
      </div>

      <div className="up-card up-card-alt">
        <h2>Book today without OCR</h2>
        <p>Search our live catalog and add tests yourself — same checkout and home collection.</p>
        <div className="up-actions">
          <Link to="/diagnostics" className="btn btn-accent">
            Book tests now
          </Link>
          <Link to="/health-concerns" className="btn btn-outline-dark">
            Browse by concern
          </Link>
        </div>
      </div>

      <div className="up-card">
        <h2>Need help with a prescription?</h2>
        <p>Share it with our team and we will help you book.</p>
        <div className="up-actions">
          <a href={WA} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href={TEL} className="btn btn-outline-dark">
            Call us
          </a>
          <a href={MAIL} className="btn btn-outline-dark">
            Email
          </a>
        </div>
      </div>
    </div>
  );
}
