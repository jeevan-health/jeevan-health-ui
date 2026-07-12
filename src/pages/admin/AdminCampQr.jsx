import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Legacy route — camps now own QR cards.
 * Redirects to Camps list.
 */
export default function AdminCampQr() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/admin/camps', { replace: true });
  }, [navigate]);

  return (
    <p style={{ fontSize: 13, color: '#64748b' }}>
      Camp QR lives under each camp now. Redirecting to{' '}
      <Link to="/admin/camps" style={{ color: '#1866C9' }}>Camps</Link>…
    </p>
  );
}
