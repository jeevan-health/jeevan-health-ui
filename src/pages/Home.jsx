import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPopularTests, formatInr } from '../services/diagnosticsService.js';
import useCartStore from '../stores/cartStore.js';
import './home.css';

const trustStats = [
  { icon: '🧪', label: '5000+', sub: 'Tests available' },
  { icon: '🏠', label: 'Home', sub: 'Collection' },
  { icon: '🏅', label: 'NABL', sub: 'Certified labs' },
  { icon: '⏱', label: '24–48 hr', sub: 'Reports' },
];

const concernChips = [
  { label: 'Diabetes', q: 'Diabetes' },
  { label: 'Thyroid', q: 'Thyroid' },
  { label: 'Fever', q: 'Fever' },
  { label: 'Vitamins', q: 'Vitamin' },
  { label: 'Heart', q: 'Lipid' },
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
    desc: 'Most routine tests reported within 24–48 hours.',
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
  const heroCtasRef = useRef(null);
  const [showSticky, setShowSticky] = useState(false);
  const [popular, setPopular] = useState([]);
  const [popularLoading, setPopularLoading] = useState(true);
  const addTest = useCartStore((s) => s.addTest);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    const el = heroCtasRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShowSticky(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: '-8px 0px 0px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setPopularLoading(true);
    getPopularTests(10)
      .then((items) => {
        if (!cancelled) setPopular(items || []);
      })
      .catch(() => {
        if (!cancelled) setPopular([]);
      })
      .finally(() => {
        if (!cancelled) setPopularLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
            Healthcare testing at your doorstep
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
            Healthcare Testing
            <br />
            At Your Doorstep
          </h1>
          <p className="home-hero-sub">
            5000+ tests · NABL labs · Free home collection · Digital reports in 24–48 hours.
          </p>

          <div className="home-hero-ctas" ref={heroCtasRef}>
            <Link to="/diagnostics" className="btn btn-accent home-hero-cta-primary">
              Book Test
            </Link>
            <Link to="/upload-prescription" className="btn btn-outline home-hero-cta-secondary">
              Upload Prescription
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
              placeholder="Search test, package, disease, symptoms…"
              autoComplete="off"
              enterKeyHint="search"
            />
          </form>

          <div className="home-concern-chips" aria-label="Popular concerns">
            {concernChips.map((c) => (
              <Link
                key={c.label}
                to={`/diagnostics?q=${encodeURIComponent(c.q)}`}
                className="home-concern-chip"
              >
                {c.label}
              </Link>
            ))}
            <Link to="/health-concerns" className="home-concern-chip home-concern-chip-more">
              All concerns
            </Link>
          </div>

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

      {/* Trust strip */}
      <section className="home-trust-strip" aria-label="Trust metrics">
        <div className="container home-trust-inner">
          <div>
            <strong>Home collection</strong>
            <span>Doorstep phlebotomy</span>
          </div>
          <div>
            <strong>5000+ tests</strong>
            <span>Live catalog</span>
          </div>
          <div>
            <strong>NABL labs</strong>
            <span>Quality partner labs</span>
          </div>
          <div>
            <strong>24–48 hr</strong>
            <span>Typical reports</span>
          </div>
        </div>
      </section>

      {/* Popular tests rail — live API only */}
      <section className="home-section">
        <div className="container">
          <div className="home-section-head">
            <h2 className="home-section-title">Popular tests</h2>
            <Link to="/diagnostics?filter=popular" className="home-section-link">
              View all
            </Link>
          </div>
          {popularLoading ? (
            <p className="home-rail-muted">Loading popular tests…</p>
          ) : popular.length === 0 ? (
            <p className="home-rail-muted">
              Catalog will appear here once tests are published.{' '}
              <Link to="/diagnostics">Browse diagnostics</Link>
            </p>
          ) : (
            <ul className="home-test-rail">
              {popular.map((t) => (
                <li key={t.id} className="home-test-card">
                  <Link to={`/tests/${encodeURIComponent(t.jhcCode)}`} className="home-test-card-main">
                    <strong>{t.name}</strong>
                    <span className="home-test-code">{t.jhcCode}</span>
                    <span className="home-test-price">
                      {t.marketMrp != null && t.marketMrp > t.price ? (
                        <span className="home-test-mrp">{formatInr(t.marketMrp)}</span>
                      ) : null}
                      {formatInr(t.price)}
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="btn btn-accent home-test-add"
                    onClick={() => {
                      addTest(t);
                      setAddedId(t.id);
                    }}
                  >
                    {addedId === t.id ? 'Added ✓' : 'Add'}
                  </button>
                </li>
              ))}
            </ul>
          )}
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

      {showSticky ? (
        <div className="home-sticky-cta" role="region" aria-label="Quick actions">
          <div className="home-sticky-cta-inner">
            <Link to="/diagnostics" className="btn btn-accent">
              Book Test
            </Link>
            <Link to="/upload-prescription" className="btn btn-outline-dark">
              Prescription
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
