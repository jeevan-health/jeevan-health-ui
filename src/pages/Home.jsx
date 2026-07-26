import { Link } from 'react-router-dom';
import './home.css';

const trustChips = [
  { icon: '🧪', title: '5000+', sub: 'Tests' },
  { icon: '🏠', title: 'Free Home', sub: 'Collection' },
  { icon: '🏅', title: 'NABL Certified', sub: 'Labs' },
  { icon: '⏱', title: 'Reports in', sub: '24 Hours' },
];

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-inner">
          <p className="hero-badge">
            <span className="dot" aria-hidden />
            Trusted diagnostics at your doorstep
          </p>

          <div className="trust-grid">
            {trustChips.map((c) => (
              <div key={c.title} className="trust-card">
                <span className="trust-icon" aria-hidden>
                  {c.icon}
                </span>
                <div>
                  <strong>{c.title}</strong>
                  <span>{c.sub}</span>
                </div>
              </div>
            ))}
          </div>

          <h1>
            Your Health, Our Priority
            <br />
            Trusted Diagnostics at Your Doorstep
          </h1>
          <p className="hero-lead">
            Book lab tests from home with free sample collection. NABL certified labs, digital reports
            delivered to your phone and email.
          </p>

          <div className="hero-actions">
            <Link to="/diagnostics" className="btn btn-accent btn-lg">
              Book Lab Tests
            </Link>
            <Link to="/signup" className="btn btn-outline btn-lg">
              Login / Sign up
            </Link>
          </div>

          <div className="hero-search">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = new FormData(e.currentTarget).get('q');
                window.location.href = q
                  ? `/diagnostics?q=${encodeURIComponent(String(q))}`
                  : '/diagnostics';
              }}
            >
              <label className="sr-only" htmlFor="hero-q">
                Search tests
              </label>
              <input
                id="hero-q"
                name="q"
                type="search"
                placeholder="Search tests, symptoms, diseases…"
                autoComplete="off"
              />
            </form>
          </div>

          <p className="hero-social-proof">★ 4.9 · Trusted home collection across Hyderabad</p>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <h2>How it works</h2>
          <ol className="steps">
            <li>
              <strong>Search & book</strong>
              <span>Pick tests from our catalog and choose a home collection slot.</span>
            </li>
            <li>
              <strong>Phlebo visits</strong>
              <span>A trained phlebotomist collects your sample at home.</span>
            </li>
            <li>
              <strong>Get reports</strong>
              <span>Digital PDF reports via email and your dashboard.</span>
            </li>
          </ol>
          <Link to="/diagnostics" className="btn btn-primary" style={{ marginTop: 20 }}>
            Browse tests
          </Link>
        </div>
      </section>
    </div>
  );
}
