import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';

export default function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="header-logo" aria-label="Jeevan HealthCare home">
          <img src="/logo.png" alt="Jeevan HealthCare at Home" width="180" height="48" />
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
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="btn btn-outline-dark"
                style={{ padding: '8px 12px', fontSize: 13 }}
              >
                {user.name?.split(' ')[0] || user.phone || 'Account'}
              </Link>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '8px 14px', fontSize: 13 }}
                onClick={() => logout()}
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
