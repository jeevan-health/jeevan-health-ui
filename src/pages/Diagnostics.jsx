import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchTests, getMeta, formatInr } from '../services/diagnosticsService.js';
import useCartStore from '../stores/cartStore.js';
import './diagnostics.css';

export default function Diagnostics() {
  const [params, setParams] = useSearchParams();
  const qParam = params.get('q') || '';

  const [q, setQ] = useState(qParam);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalActive, setTotalActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const addTest = useCartStore((s) => s.addTest);
  const cartCount = useCartStore((s) => s.count());
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);

  const QUICK = ['Diabetes', 'Thyroid', 'Vitamin', 'CBC', 'Fever', 'Lipid'];

  const load = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const [res, meta] = await Promise.all([
        searchTests({ q: query, limit: 60 }),
        getMeta().catch(() => ({ totalActive: null })),
      ]);
      setItems(res.items || []);
      setTotal(res.total || 0);
      if (meta?.totalActive != null) setTotalActive(meta.totalActive);
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
    load(qParam);
  }, [qParam, load]);

  const onSearch = (e) => {
    e.preventDefault();
    const next = q.trim();
    setParams(next ? { q: next } : {});
  };

  return (
    <div className="diag-page">
      <div className="diag-hero">
        <div className="container">
          <h1>Lab tests</h1>
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
                · <Link to="/checkout" style={{ color: '#fff', fontWeight: 800 }}>Cart ({cartCount})</Link>
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
              placeholder="Search by name or JHC code…"
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
              Showing {items.length} of {total.toLocaleString('en-IN')}
              {qParam ? ` for “${qParam}”` : ''}
            </p>
            <ul className="diag-list">
              {items.map((t) => (
                <li key={t.id} className="diag-card-wrap">
                  <button type="button" className="diag-card" onClick={() => setSelected(t)}>
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
                  </button>
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

      {selected && (
        <div className="diag-drawer-backdrop" onClick={() => setSelected(null)} role="presentation">
          <aside
            className="diag-drawer"
            role="dialog"
            aria-label={selected.name}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="diag-drawer-close" onClick={() => setSelected(null)}>
              ✕
            </button>
            <p className="diag-code">{selected.jhcCode}</p>
            <h2>{selected.name}</h2>
            <div className="diag-drawer-price">
              {selected.marketMrp != null && selected.marketMrp > selected.price && (
                <span className="diag-mrp">{formatInr(selected.marketMrp)}</span>
              )}
              <span className="diag-offer">{formatInr(selected.price)}</span>
            </div>
            <ul className="diag-drawer-meta">
              <li>Home collection: {selected.homeCollection ? 'Yes' : 'No'}</li>
              <li>Fasting: {selected.fastingRequired ? 'Required' : 'Not required'}</li>
              {selected.reportTime && <li>Report time: {selected.reportTime}</li>}
              {selected.category && <li>Category: {selected.category}</li>}
            </ul>
            {selected.preparation && (
              <p className="diag-prep">
                <strong>Preparation:</strong> {selected.preparation}
              </p>
            )}
            <button
              type="button"
              className="btn btn-accent btn-block"
              style={{ marginTop: 16 }}
              onClick={() => {
                addTest(selected);
                setAddedId(selected.id);
              }}
            >
              {addedId === selected.id ? 'Added to cart ✓' : 'Add to cart'}
            </button>
            <Link to="/checkout" className="btn btn-primary btn-block" style={{ marginTop: 10 }}>
              Go to checkout {cartCount > 0 ? `(${cartCount})` : ''}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
