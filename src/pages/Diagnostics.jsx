import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './page-shell.css';

export default function Diagnostics() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';

  const message = useMemo(() => {
    if (q) {
      return `You searched for “${q}”. Live catalog search ships in the next phase — your Excel-driven tests will appear here.`;
    }
    return 'Browse and book from a live catalog next. Admins will upload your Excel list (JHC codes) anytime.';
  }, [q]);

  return (
    <div className="page-shell">
      <div className="page-shell-head">
        <h1>Lab tests</h1>
        <p>{message}</p>
      </div>

      <div className="empty-panel">
        <div className="empty-panel-icon" aria-hidden>
          🔬
        </div>
        <h2>Catalog coming online</h2>
        <p>
          We keep your real brand and booking flow production-ready. The test catalog and Excel
          upload are the next vertical slice.
        </p>
        <div className="empty-panel-actions">
          <Link to="/signup" className="btn btn-primary">
            Create account
          </Link>
          <Link to="/" className="btn btn-outline-dark">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
