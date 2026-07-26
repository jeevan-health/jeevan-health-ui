import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function Diagnostics() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';

  const message = useMemo(() => {
    if (q) return `Search for “${q}” will run against the live catalog once Phase 2 is wired.`;
    return 'Catalog search, filters, and Excel-driven tests land in Phase 2. Admin will upload your Excel; non-tech staff can re-upload anytime to update prices and names.';
  }, [q]);

  return (
    <div className="container" style={{ padding: '28px 16px 48px' }}>
      <h1 style={{ color: 'var(--text-dark)', fontSize: '1.5rem', marginBottom: 8 }}>Lab tests</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20, maxWidth: 560 }}>{message}</p>

      <div
        style={{
          background: '#fff',
          border: '1px dashed var(--border)',
          borderRadius: 20,
          padding: 32,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden>
          🔬
        </div>
        <h2 style={{ color: 'var(--text-dark)', fontSize: '1.15rem', marginBottom: 8 }}>
          Catalog coming online
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
          Your Excel has ~490 individual tests (JHC codes). We will import and enable admin Excel
          re-upload so catalog updates stay easy.
        </p>
        <Link to="/signup" className="btn btn-primary">
          Create account (Phase 1)
        </Link>
      </div>
    </div>
  );
}
