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
  corporate: { icon: '🧑‍💼', title: 'Corporate Portal', color: '#1e40af', nav: [
    { path: '/corporate', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/corporate/orders', label: 'Orders', icon: '📋' },
    { path: '/corporate/subscriptions', label: 'Subscriptions', icon: '📑' },
  ]},
  training_officer: { icon: '🎓', title: 'Training Portal', color: '#0d9488', nav: [
    { path: '/training', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/training/staff', label: 'Staff', icon: '👥' },
    { path: '/training/certifications', label: 'Certifications', icon: '📜' },
  ]},
  it_support: { icon: '🖥️', title: 'IT Support Portal', color: '#4f46e5', nav: [
    { path: '/it-support', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/it-support/system', label: 'System', icon: '⚙️' },
  ]},
  call_center: { icon: '☎️', title: 'Customer Care Portal', color: '#0ea5e9', nav: [
    { path: '/call-center', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/call-center/bookings', label: 'Bookings', icon: '📅' },
    { path: '/call-center/queries', label: 'Queries', icon: '❓' },
  ]},
  sales_marketing: { icon: '📢', title: 'Sales & Marketing Portal', color: '#e11d48', nav: [
    { path: '/sales', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/sales/campaigns', label: 'Campaigns', icon: '📢' },
    { path: '/sales/leads', label: 'Leads', icon: '👥' },
  ]},
  finance: { icon: '💳', title: 'Finance Portal', color: '#15803d', nav: [
    { path: '/finance', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/finance/transactions', label: 'Transactions', icon: '💳' },
    { path: '/finance/reports', label: 'Reports', icon: '📊' },
  ]},
  bi_analyst: { icon: '📊', title: 'Analytics Portal', color: '#6d28d9', nav: [
    { path: '/analytics', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/analytics/reports', label: 'Reports', icon: '📄' },
    { path: '/analytics/kpi', label: 'KPIs', icon: '📈' },
  ]},
  qa_compliance: { icon: '✅', title: 'QA & Compliance Portal', color: '#65a30d', nav: [
    { path: '/qa', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/qa/reviews', label: 'Reviews', icon: '🔍' },
    { path: '/qa/compliance', label: 'Compliance', icon: '✅' },
  ]},
  inventory: { icon: '📦', title: 'Inventory Portal', color: '#a16207', nav: [
    { path: '/inventory', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/inventory/stock', label: 'Stock', icon: '📦' },
    { path: '/inventory/orders', label: 'Orders', icon: '📋' },
  ]},
  telemedicine: { icon: '🌐', title: 'Telemedicine Portal', color: '#0284c7', nav: [
    { path: '/telemedicine', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/telemedicine/consultations', label: 'Consultations', icon: '🌐' },
    { path: '/telemedicine/patients', label: 'Patients', icon: '👤' },
  ]},
  legal: { icon: '⚖️', title: 'Legal Portal', color: '#4f46e5', nav: [
    { path: '/legal', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/legal/compliance', label: 'Compliance', icon: '✅' },
    { path: '/legal/audit', label: 'Audit Logs', icon: '📋' },
  ]},
  marketing_content: { icon: '🖋️', title: 'Content Portal', color: '#c026d3', nav: [
    { path: '/content', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/content/blog', label: 'Blog', icon: '📝' },
    { path: '/content/seo', label: 'SEO', icon: '🔍' },
  ]},
  emergency_coordinator: { icon: '🚨', title: 'Emergency Coordination', color: '#b91c1c', nav: [
    { path: '/emergency-coordinator', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/emergency-coordinator/cases', label: 'Cases', icon: '🚨' },
    { path: '/emergency-coordinator/staff', label: 'Staff', icon: '👥' },
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