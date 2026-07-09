import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import usePermissionsStore from '../../stores/permissionsStore';

const ROLE_META = {
  phlebotomist: { icon: '🧪', title: 'Phlebotomist Portal', color: '#059669', nav: [
    { path: '/phlebotomist', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/phlebotomist/collections', label: 'My Collections', icon: '🧪' },
    { path: '/phlebotomist/routes', label: 'Routes', icon: '🗺️' },
    { path: '/phlebotomist/schedule', label: 'Schedule', icon: '📅' },
  ]},
  doctor: { icon: '👨‍⚕️', title: 'Doctor Portal', color: '#7c3aed', nav: [
    { path: '/doctor', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/doctor/appointments', label: 'Appointments', icon: '📋' },
    { path: '/doctor/patients', label: 'My Patients', icon: '👤' },
    { path: '/doctor/availability', label: 'Availability', icon: '⏰' },
  ]},
  nurse: { icon: '🧑‍⚕️', title: 'Nurse Portal', color: '#0891b2', nav: [
    { path: '/nurse', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/nurse/patients', label: 'My Patients', icon: '👤' },
    { path: '/nurse/schedule', label: 'Schedule', icon: '📅' },
  ]},
  caregiver: { icon: '👵', title: 'Caregiver Portal', color: '#d97706', nav: [
    { path: '/caregiver', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/caregiver/patients', label: 'My Patients', icon: '👤' },
  ]},
  physiotherapist: { icon: '🏃', title: 'Rehab Portal', color: '#16a34a', nav: [
    { path: '/physio', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/physio/patients', label: 'Patients', icon: '👤' },
    { path: '/physio/therapy', label: 'Therapy Plans', icon: '📋' },
  ]},
  radiologist: { icon: '🩻', title: 'Radiology Portal', color: '#6366f1', nav: [
    { path: '/radiology', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/radiology/assignments', label: 'Assignments', icon: '📋' },
    { path: '/radiology/reports', label: 'Reports', icon: '📄' },
  ]},
  pharmacy: { icon: '💊', title: 'Pharmacy Portal', color: '#db2777', nav: [
    { path: '/pharmacy', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/pharmacy/orders', label: 'Orders', icon: '📋' },
    { path: '/pharmacy/inventory', label: 'Inventory', icon: '📦' },
  ]},
  emergency: { icon: '🚑', title: 'Emergency Response', color: '#dc2626', nav: [
    { path: '/emergency', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/emergency/cases', label: 'Active Cases', icon: '🚨' },
  ]},
  dispatch: { icon: '📦', title: 'Dispatch Portal', color: '#f97316', nav: [
    { path: '/dispatch', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/dispatch/schedule', label: 'Schedule', icon: '📅' },
    { path: '/dispatch/staff', label: 'Staff', icon: '👥' },
  ]},
};

export default function RoleLayout({ role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const roles = usePermissionsStore(s => s.roles);
  const meta = ROLE_META[role] || { icon: '🔧', title: 'Portal', color: '#64748b', nav: [] };
  const roleConfig = roles[role] || {};

  const isActive = (item) => item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ width: 220, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>{meta.icon}</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{meta.title}</span>
        </div>
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {meta.nav.map(item => (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px',
              color: isActive(item) ? meta.color : '#475569',
              textDecoration: 'none', fontSize: 13,
              background: isActive(item) ? `${meta.color}10` : 'transparent',
              borderLeft: isActive(item) ? `3px solid ${meta.color}` : '3px solid transparent',
              fontWeight: isActive(item) ? 600 : 400,
            }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', background: '#fafbfc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>{meta.icon}</span>
            <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.3 }}>
              <strong style={{ color: '#0f172a', display: 'block' }}>{user?.name}</strong>
              {roleConfig.label || role}
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#ef4444', width: '100%' }}>Logout</button>
        </div>
      </div>
      <div style={{ flex: 1, padding: 24, overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}

export { ROLE_META };