import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const NAV = [
  { path: '/doctor', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/doctor/appointments', label: 'Appointments', icon: '📋' },
  { path: '/doctor/patients', label: 'My Patients', icon: '👤' },
  { path: '/doctor/availability', label: 'Availability', icon: '⏰' },
];

export default function DoctorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  const isActive = (item) => item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🩺</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Doctor Portal</span>
        </div>
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {NAV.map(item => (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px',
              color: isActive(item) ? '#7c3aed' : '#475569',
              textDecoration: 'none', fontSize: 13,
              background: isActive(item) ? '#f5f3ff' : 'transparent',
              borderLeft: isActive(item) ? '3px solid #7c3aed' : '3px solid transparent',
              fontWeight: isActive(item) ? 600 : 400,
            }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', background: '#fafbfc' }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{user?.name || 'Doctor'}</div>
          <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#ef4444', width: '100%' }}>Logout</button>
        </div>
      </div>
      {/* Main */}
      <div style={{ flex: 1, padding: 24, overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}