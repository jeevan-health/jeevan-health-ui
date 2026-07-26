import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="header-logo" aria-label="Jeevan HealthCare home">
          <img src="/logo.svg" alt="Jeevan HealthCare at Home" />
        </Link>

        <div className="header-search">
          <label className="sr-only" htmlFor="global-search">
            Search tests
          </label>
          <input
            id="global-search"
            type="search"
            placeholder="Search tests…"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const q = e.currentTarget.value.trim();
                navigate(q ? `/diagnostics?q=${encodeURIComponent(q)}` : '/diagnostics');
              }
            }}
          />
        </div>

        <div className="header-actions">
          <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
