import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  searchTests,
  getMeta,
  getPopularTests,
  formatInr,
} from '../services/diagnosticsService.js';
import useCartStore from '../stores/cartStore.js';
import './diagnostics.css';

const QUICK = ['Diabetes', 'Thyroid', 'Vitamin', 'CBC', 'Fever', 'Lipid'];

export default function Diagnostics() {
  const [params, setParams] = useSearchParams();
  const qParam = params.get('q') || '';
  const filter = params.get('filter') || '';
  const categoryParam = params.get('category') || '';

  const [q, setQ] = useState(qParam);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalActive, setTotalActive] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const addTest = useCartStore((s) => s.addTest);
  const cartCount = useCartStore((s) => s.count());
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);

  const load = useCallback(async (query, category, mode) => {
    setLoading(true);
    setError(null);
    try {
      if (mode === 'popular') {
        const [popular, meta] = await Promise.all([
          getPopularTests(30),
          getMeta().catch(() => ({ totalActive: null, categories: [] })),
        ]);
        setItems(popular || []);
        setTotal((popular || []).length);
        if (meta?.totalActive != null) setTotalActive(meta.totalActive);
        if (meta?.categories) setCategories(meta.categories);
      } else {
        const [res, meta] = await Promise.all([
          searchTests({ q: query, category: category || undefined, limit: 60 }),
          getMeta().catch(() => ({ totalActive: null, categories: [] })),
        ]);
        setItems(res.items || []);
        setTotal(res.total || 0);
        if (meta?.totalActive != null) setTotalActive(meta.totalActive);
        if (meta?.categories) setCategories(meta.categories);
      }
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message || 'Failed to load tests');
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setQ(qParam);
    load(qParam, categoryParam, filter);
  }, [qParam, categoryParam, filter, load]);

  const onSearch = (e) => {
    e.preventDefault();
    const next = q.trim();
    const nextParams = {};
    if (next) nextParams.q = next;
    if (categoryParam) nextParams.category = categoryParam;
    setParams(nextParams);
  };

  const setFilterMode = (mode) => {
    if (mode === 'popular') {
      setParams({ filter: 'popular' });
      return;
    }
    setParams({});
  };

  const setCategory = (cat) => {
    if (!cat) {
      setParams(qParam ? { q: qParam } : {});
      return;
    }
    const next = { category: cat };
    if (qParam) next.q = qParam;
    setParams(next);
  };

  const title =
    filter === 'popular'
      ? 'Popular tests'
      : categoryParam
        ? categoryParam
        : 'Diagnostics';

  return (
    <div className="diag-page">
      <div className="diag-hero">
        <div className="container">
          <h1>{title}</h1>
          <p>
            Search our catalog and book home collection.
            {totalActive != null ? (
              <>
                {' '}
                <strong>{totalActive.toLocaleString('en-IN')}</strong> tests live.
              </>
            ) : null}
            {cartCount > 0 ? (
              <>
                {' '}
                ·{' '}
                <Link to="/checkout" style={{ color: '#fff', fontWeight: 800 }}>
                  Cart ({cartCount})
                </Link>
              </>
            ) : null}
          </p>
          <form className="diag-search" onSubmit={onSearch}>
            <label className="sr-only" htmlFor="diag-q">
              Search tests
            </label>
            <input
              id="diag-q"
              type="search"
              placeholder="Search test, disease, symptoms…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
          <div className="diag-chips">
            <button
              type="button"
              className={`diag-chip${filter !== 'popular' && !categoryParam ? ' active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All tests
            </button>
            <button
              type="button"
              className={`diag-chip${filter === 'popular' ? ' active' : ''}`}
              onClick={() => setFilterMode('popular')}
            >
              Popular
            </button>
            {QUICK.map((chip) => (
              <button
                key={chip}
                type="button"
                className="diag-chip"
                onClick={() => {
                  setQ(chip);
                  setParams({ q: chip });
                }}
              >
                {chip}
              </button>
            ))}
            {cartCount > 0 && (
              <button type="button" className="diag-chip cart" onClick={() => setDrawerOpen(true)}>
                Cart ({cartCount})
              </button>
            )}
          </div>
          {categories.length > 0 ? (
            <div className="diag-chips diag-cats" aria-label="Categories">
              {categories.slice(0, 12).map((c) => (
                <button
                  key={c.category}
                  type="button"
                  className={`diag-chip${categoryParam === c.category ? ' active' : ''}`}
                  onClick={() =>
                    setCategory(categoryParam === c.category ? '' : c.category)
                  }
                >
                  {c.category}
                  {c.count != null ? ` (${c.count})` : ''}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="container diag-body">
        {error && <div className="diag-error">{error}</div>}

        {loading && <p className="diag-muted">Loading catalog…</p>}

        {!loading && !error && total === 0 && (
          <div className="diag-empty">
            <div className="diag-empty-icon" aria-hidden>
              🔬
            </div>
            <h2>{qParam ? `No matches for “${qParam}”` : 'Catalog is empty'}</h2>
            <p>
              {qParam
                ? 'Try another name or JHC code.'
                : 'An admin can upload the Excel test list from Admin → Catalog.'}
            </p>
            <Link to="/" className="btn btn-outline-dark">
              Back home
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            <p className="diag-count">
              Showing {items.length}
              {filter === 'popular' ? '' : ` of ${total.toLocaleString('en-IN')}`}
              {qParam ? ` for “${qParam}”` : ''}
              {filter === 'popular' ? ' · popular' : ''}
            </p>
            <ul className="diag-list">
              {items.map((t) => (
                <li key={t.id} className="diag-card-wrap">
                  <Link
                    to={`/tests/${encodeURIComponent(t.jhcCode)}`}
                    className="diag-card"
                  >
                    <div className="diag-card-main">
                      <strong>{t.name}</strong>
                      <span className="diag-code">{t.jhcCode}</span>
                      {t.homeCollection && (
                        <span className="diag-badge">Home collection</span>
                      )}
                    </div>
                    <div className="diag-card-price">
                      {t.marketMrp != null && t.marketMrp > t.price && (
                        <span className="diag-mrp">{formatInr(t.marketMrp)}</span>
                      )}
                      <span className="diag-offer">{formatInr(t.price)}</span>
                    </div>
                  </Link>
                  <button
                    type="button"
                    className="diag-add-btn"
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
          </>
        )}
      </div>
    </div>
  );
}
