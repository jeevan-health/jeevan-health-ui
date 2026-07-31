import { Link } from 'react-router-dom';
import './page-shell.css';
import './health-concerns.css';

/** Curated concern → catalog search. No invented clinical advice — search only. */
const CONCERNS = [
  { id: 'diabetes', title: 'Diabetes', q: 'Diabetes', desc: 'Sugar, HbA1c, related panels', icon: '🩸' },
  { id: 'thyroid', title: 'Thyroid', q: 'Thyroid', desc: 'TSH and thyroid panels', icon: '🦋' },
  { id: 'heart', title: 'Heart health', q: 'Lipid', desc: 'Lipid profile and heart markers', icon: '❤️' },
  { id: 'fever', title: 'Fever', q: 'Fever', desc: 'CBC and fever-related tests', icon: '🌡️' },
  { id: 'vitamin', title: 'Vitamins', q: 'Vitamin', desc: 'Vitamin D, B12 and more', icon: '☀️' },
  { id: 'kidney', title: 'Kidney', q: 'Kidney', desc: 'Kidney function tests', icon: '🫘' },
  { id: 'liver', title: 'Liver', q: 'Liver', desc: 'Liver function tests', icon: '🫁' },
  { id: 'women', title: "Women's health", q: 'Women', desc: 'Women-focused panels', icon: '♀️' },
  { id: 'senior', title: 'Senior care', q: 'Senior', desc: 'Age-related checkups', icon: '👴' },
  { id: 'hair', title: 'Hair fall', q: 'Vitamin', desc: 'Common deficiency screens', icon: '💇' },
];

export default function HealthConcerns() {
  return (
    <div className="page-shell hc-page">
      <header className="hc-head">
        <h1>Health Concerns</h1>
        <p>
          Pick a concern to search matching tests in our live catalog. Packages and clinical maps
          will expand when the client content pack is ready.
        </p>
      </header>

      <ul className="hc-grid">
        {CONCERNS.map((c) => (
          <li key={c.id}>
            <Link
              to={`/diagnostics?q=${encodeURIComponent(c.q)}`}
              className="hc-card"
            >
              <span className="hc-icon" aria-hidden>
                {c.icon}
              </span>
              <span className="hc-card-text">
                <strong>{c.title}</strong>
                <span>{c.desc}</span>
              </span>
              <span className="hc-arrow" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="hc-footer-cta">
        <Link to="/diagnostics" className="btn btn-primary">
          Browse all tests
        </Link>
      </div>
    </div>
  );
}
