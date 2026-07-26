import { Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import { getMeta } from '../../services/diagnosticsService.js';
import { useEffect, useState } from 'react';
import './admin-dashboard.css';

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const [totalActive, setTotalActive] = useState(null);

  useEffect(() => {
    getMeta()
      .then((m) => setTotalActive(m.totalActive))
      .catch(() => setTotalActive(null));
  }, []);

  return (
    <div className="admin-dash">
      <div className="container admin-dash-inner">
        <p className="admin-dash-eyebrow">Operations hub</p>
        <h1>Welcome{user?.name ? `, ${user.name}` : ''}</h1>
        <p className="admin-dash-lead">
          Manage catalog and ops tools. More modules unlock as each phase ships.
        </p>

        <div className="admin-dash-grid">
          <Link to="/admin/catalog" className="admin-dash-card">
            <span className="admin-dash-icon" aria-hidden>
              📋
            </span>
            <h2>Test catalog</h2>
            <p>
              Upload Excel, search tests, enable/disable rows.
              {totalActive != null ? (
                <>
                  <br />
                  <strong>{totalActive.toLocaleString('en-IN')}</strong> active tests
                </>
              ) : null}
            </p>
          </Link>

          <Link to="/admin/orders" className="admin-dash-card">
            <span className="admin-dash-icon" aria-hidden>
              🧾
            </span>
            <h2>Orders</h2>
            <p>Home collection bookings, status updates</p>
          </Link>

          <Link to="/admin/phlebo" className="admin-dash-card">
            <span className="admin-dash-icon" aria-hidden>
              💉
            </span>
            <h2>Phlebotomists</h2>
            <p>Hire applications, promote roster, enable login</p>
          </Link>

          <Link to="/admin/reports" className="admin-dash-card">
            <span className="admin-dash-icon" aria-hidden>
              📄
            </span>
            <h2>Lab reports</h2>
            <p>PDF upload &amp; email patient (Brevo)</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
