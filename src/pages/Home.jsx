import { Link, useNavigate } from 'react-router-dom';
import './home.css';

const trustStats = [
  { icon: '🧪', label: '5000+', sub: 'Tests' },
  { icon: '🏠', label: 'Free Home', sub: 'Collection' },
  { icon: '🏅', label: 'NABL Certified', sub: 'Labs' },
  { icon: '⏱', label: 'Reports in', sub: '24 Hours' },
];

const whyItems = [
  {
    icon: '🏠',
    title: 'Free home collection',
    desc: 'Trained phlebotomists visit your doorstep at your preferred slot.',
  },
  {
    icon: '🔬',
    title: 'NABL partner labs',
    desc: 'Samples processed at accredited labs with quality controls.',
  },
  {
    icon: '📱',
    title: 'Digital reports',
    desc: 'PDF reports on email and your dashboard — no paper chase.',
  },
  {
    icon: '⚡',
    title: 'Fast turnaround',
    desc: 'Most routine tests reported within 24 hours.',
  },
];

const steps = [
  {
    title: 'Search & book',
    desc: 'Pick tests from the catalog and choose a home collection slot.',
  },
  {
    title: 'Sample at home',
    desc: 'A phlebotomist collects your sample safely at your address.',
  },
  {
    title: 'Get reports',
    desc: 'Receive digital PDFs by email and in your Jeevan account.',
  },
];

export default function Home() {
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get('q');
    navigate(q ? `/diagnostics?q=${encodeURIComponent(String(q))}` : '/diagnostics');
  };

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-inner">
          <p className="home-hero-eyebrow">
            <span className="home-hero-eyebrow-dot" aria-hidden />
            Trusted diagnostics at your doorstep
          </p>

          <div className="home-hero-stats" aria-label="Highlights">
            {trustStats.map((s) => (
              <div key={s.label} className="home-hero-stat">
                <span className="home-hero-stat-icon" aria-hidden>
                  {s.icon}
                </span>
                <span className="home-hero-stat-label">{s.label}</span>
                <span className="home-hero-stat-sub">{s.sub}</span>
              </div>
            ))}
          </div>

          <h1>
            Your Health, Our Priority
            <br />
            Trusted Diagnostics at Your Doorstep
          </h1>
          <p className="home-hero-sub">
            Book lab tests from home with free sample collection. 5000+ tests, NABL certified labs,
            reports in 24 hours.
          </p>

          <div className="home-hero-ctas">
            <Link to="/diagnostics" className="btn btn-accent home-hero-cta-primary">
              Book Lab Tests
            </Link>
            <Link to="/signup" className="btn btn-outline home-hero-cta-secondary">
              Login / Sign up
            </Link>
          </div>

          <form className="home-hero-search" onSubmit={onSearch}>
            <label className="sr-only" htmlFor="hero-search">
              Search tests
            </label>
            <input
              id="hero-search"
              name="q"
              type="search"
              placeholder="Search tests, symptoms, diseases…"
              autoComplete="off"
              enterKeyHint="search"
            />
          </form>

          <div className="home-hero-proof">
            <div className="home-hero-stars" aria-hidden>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
            <span className="home-hero-rating">4.9</span>
            <span className="home-hero-proof-sep" aria-hidden />
            <span className="home-hero-rating-label">Trusted home collection · Hyderabad</span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <h2 className="home-section-title">How it works</h2>
          <ol className="home-steps">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="home-step-num" aria-hidden>
                  {i + 1}
                </span>
                <div>
                  <strong>{s.title}</strong>
                  <p>{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <h2 className="home-section-title">Careers</h2>
          <p className="home-careers-lead">
            Hiring phlebotomists for camps &amp; home sample collection.
          </p>
          <Link to="/onboarding-phlebotomist" className="btn btn-primary">
            Apply as phlebotomist
          </Link>
          <p className="home-careers-note">
            Field portal after hire: <strong>phlebo.jeevanhealthcare.com</strong>
          </p>
        </div>
      </section>

      <section className="home-section home-section-alt">
        <div className="container">
          <h2 className="home-section-title">Why Jeevan HealthCare</h2>
          <div className="home-why-grid">
            {whyItems.map((item) => (
              <article key={item.title} className="home-why-card">
                <span className="home-why-icon" aria-hidden>
                  {item.icon}
                </span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
          <div className="home-section-cta">
            <Link to="/diagnostics" className="btn btn-primary btn-lg">
              Browse lab tests
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA — client pattern */}
      <div className="home-sticky-cta" role="region" aria-label="Quick actions">
        <div className="home-sticky-cta-inner">
          <Link to="/diagnostics" className="btn btn-accent">
            Book Lab Test
          </Link>
          <Link to="/signup" className="btn btn-outline-dark">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
