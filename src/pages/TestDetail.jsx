import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getTest, formatInr } from '../services/diagnosticsService.js';
import useCartStore from '../stores/cartStore.js';
import './test-detail.css';

/** Stable accent from jhc code — visual variety without inventing clinical content */
function accentFromCode(code) {
  const s = String(code || 'JHC');
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const hues = [210, 188, 168, 196, 222, 175, 200, 230];
  const hue = hues[h % hues.length];
  return {
    hue,
    header: `linear-gradient(135deg, hsl(${hue}, 72%, 38%) 0%, hsl(${hue + 18}, 70%, 48%) 55%, hsl(${hue + 30}, 80%, 52%) 100%)`,
    soft: `hsl(${hue}, 55%, 94%)`,
    border: `hsl(${hue}, 50%, 72%)`,
  };
}

function Section({ title, children }) {
  if (children == null || children === false || children === '') return null;
  return (
    <section className="td-section">
      <h2>{title}</h2>
      <div className="td-section-body">{children}</div>
    </section>
  );
}

export default function TestDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const addTest = useCartStore((s) => s.addTest);
  const cartCount = useCartStore((s) => s.count());
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setAdded(false);
    getTest(code)
      .then((t) => {
        if (!cancelled) setTest(t);
      })
      .catch((e) => {
        if (!cancelled) {
          setTest(null);
          setError(e?.response?.data?.error?.message || e.message || 'Test not found');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  const accent = useMemo(() => accentFromCode(test?.jhcCode || code), [test?.jhcCode, code]);

  const onAdd = () => {
    if (!test) return;
    addTest(test);
    setAdded(true);
  };

  if (loading) {
    return (
      <div className="td-page">
        <div className="container td-loading">Loading test…</div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="td-page">
        <div className="container td-empty">
          <h1>Test not found</h1>
          <p>{error || 'This test is not in the live catalog.'}</p>
          <Link to="/diagnostics" className="btn btn-primary">
            Browse diagnostics
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = test.marketMrp != null && test.marketMrp > test.price;

  return (
    <div className="td-page">
      <header className="td-hero" style={{ background: accent.header }}>
        <div className="container">
          <button type="button" className="td-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <p className="td-code">{test.jhcCode}</p>
          <h1>{test.name}</h1>
          <div className="td-price-row">
            {hasDiscount ? <span className="td-mrp">{formatInr(test.marketMrp)}</span> : null}
            <span className="td-price">{formatInr(test.price)}</span>
          </div>
          <div className="td-badges">
            {test.homeCollection ? <span className="td-badge">Home collection available</span> : null}
            {test.reportTime ? <span className="td-badge">Report: {test.reportTime}</span> : null}
            {test.fastingRequired ? <span className="td-badge">Fasting required</span> : null}
            {test.category ? <span className="td-badge">{test.category}</span> : null}
          </div>
        </div>
      </header>

      <div className="container td-body">
        <Section title="About this test">
          {test.description ? (
            <p>{test.description}</p>
          ) : (
            <p className="td-muted">
              {test.name} is available for home collection through Jeevan HealthCare. Full clinical
              write-up will appear here when content is published.
            </p>
          )}
        </Section>

        <Section title="Preparation">
          {test.preparation ? (
            <p>{test.preparation}</p>
          ) : (
            <p className="td-muted">
              {test.fastingRequired
                ? 'Fasting is required. Follow the instructions shared at booking.'
                : 'No special preparation listed. Follow any notes on your booking confirmation.'}
            </p>
          )}
        </Section>

        <Section title="Sample details">
          <ul className="td-meta-list">
            <li>
              <strong>Sample type</strong>
              <span>{test.sampleType || 'As per lab protocol'}</span>
            </li>
            <li>
              <strong>Home collection</strong>
              <span>{test.homeCollection ? 'Yes' : 'Lab visit may be required'}</span>
            </li>
            <li>
              <strong>Fasting</strong>
              <span>{test.fastingRequired ? 'Required' : 'Not required'}</span>
            </li>
            <li>
              <strong>Report time</strong>
              <span>{test.reportTime || 'Shared after processing'}</span>
            </li>
          </ul>
        </Section>

        {test.category || test.subcategory ? (
          <Section title="Category">
            <p>
              {[test.category, test.subcategory].filter(Boolean).join(' · ')}
            </p>
          </Section>
        ) : null}

        <div className="td-note" style={{ background: accent.soft, borderColor: accent.border }}>
          <strong>Book with confidence</strong>
          <p>
            Free home collection · NABL partner labs · Digital reports in your account and email.
          </p>
        </div>

        <div className="td-actions">
          <button type="button" className="btn btn-accent btn-block" onClick={onAdd}>
            {added ? 'Added to cart ✓' : 'Add to cart'}
          </button>
          {added || cartCount > 0 ? (
            <button type="button" className="btn btn-primary btn-block" onClick={() => setDrawerOpen(true)}>
              View cart {cartCount > 0 ? `(${cartCount})` : ''}
            </button>
          ) : null}
          <Link to="/checkout" className="btn btn-outline-dark btn-block">
            Go to checkout
          </Link>
          <Link to="/diagnostics" className="td-more-link">
            Browse more tests
          </Link>
        </div>
      </div>
    </div>
  );
}
