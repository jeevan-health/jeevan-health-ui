import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import usePermissionsStore from '../../stores/permissionsStore';
import { useT } from '../../i18n/LanguageProvider';

const ROLE_META = {
  phlebotomist: { icon: '🧪', title: 'Phlebotomist Portal', color: '#059669', nav: [
    { path: '/phlebotomist', label: 'Dashboard', short: 'Home', icon: '📊', exact: true },
    { path: '/phlebotomist/collections', label: 'My Collections', short: 'Jobs', icon: '🧪' },
    { path: '/phlebotomist/routes', label: 'Routes', short: 'Route', icon: '🗺️' },
    { path: '/phlebotomist/schedule', label: 'Schedule', short: 'Plan', icon: '📅' },
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

/** Field portals optimized for phones (bottom tabs). Desktop keeps sidebar. */
const FIELD_ROLES = new Set(['phlebotomist', 'nurse', 'caregiver', 'physiotherapist', 'emergency', 'dispatch']);

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return mobile;
}

export default function RoleLayout({ role }) {
  const t = useT();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const roles = usePermissionsStore(s => s.roles);
  const isMobile = useIsMobile(768);
  const meta = ROLE_META[role] || { icon: '🔧', title: t('role.portal', 'Portal'), color: '#64748b', nav: [] };
  const metaTitle = meta.title ? t(`role.${role}Title`, meta.title) : '';
  const roleConfig = roles[role] || {};
  const useBottomNav = isMobile && FIELD_ROLES.has(role);

  const isActive = (item) => item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const shortName = (user?.name || roleConfig.label || role || 'User').split(' ')[0];

  /* ── Mobile field portal: top bar + bottom tabs ── */
  if (useBottomNav) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: '#f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))',
      }}
      >
        {/* Top bar */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          padding: '10px 14px',
          paddingTop: 'max(10px, env(safe-area-inset-top, 0px))',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 1px 0 rgba(15,23,42,0.04)',
        }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `${meta.color}14`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}
          >
            {meta.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {metaTitle.replace(' Portal', '')}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {shortName}
            </div>
          </div>
          <button
            type="button"
            onClick={() => { logout(); navigate('/'); }}
            style={{
              padding: '8px 12px', borderRadius: 8, border: '1px solid #fecaca',
              background: '#fef2f2', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
              color: '#dc2626', fontWeight: 600, flexShrink: 0, minHeight: 36,
            }}
          >
            Logout
          </button>
        </header>

        {/* Content */}
        <main style={{
          flex: 1,
          padding: '12px 12px 20px',
          width: '100%',
          maxWidth: 720,
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
        >
          <Outlet />
        </main>

        {/* Bottom tab bar */}
        <nav style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          display: 'flex',
          background: '#fff',
          borderTop: '1px solid #e2e8f0',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          boxShadow: '0 -4px 16px rgba(15,23,42,0.06)',
        }}
        >
          {meta.nav.map((item) => {
            const active = isActive(item);
            const navKey = item.label.toLowerCase().replace(/\s+/g, '');
            const label = item.short || t(`role.nav.${role}.${navKey}`, item.label);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  padding: '8px 4px 6px',
                  minHeight: 56,
                  textDecoration: 'none',
                  color: active ? meta.color : '#64748b',
                  background: active ? `${meta.color}0c` : 'transparent',
                  fontWeight: active ? 700 : 500,
                  fontSize: 10,
                  lineHeight: 1.15,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
                <span style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {label}
                </span>
                {active && (
                  <span style={{
                    width: 16, height: 3, borderRadius: 2, background: meta.color, marginTop: 1,
                  }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  /* ── Desktop / non-field mobile: sidebar (drawer-like on narrow non-field) ── */
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', flexDirection: isMobile ? 'column' : 'row' }}>
      {isMobile && (
        <header style={{
          position: 'sticky', top: 0, zIndex: 40, background: '#fff',
          borderBottom: '1px solid #e2e8f0', padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
        >
          <span style={{ fontSize: 18 }}>{meta.icon}</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', flex: 1 }}>{metaTitle}</span>
          <button
            type="button"
            onClick={() => { logout(); navigate('/'); }}
            style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#ef4444' }}
          >
            Logout
          </button>
        </header>
      )}

      {!isMobile && (
        <div style={{ width: 220, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>{meta.icon}</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{metaTitle}</span>
          </div>
          <nav style={{ flex: 1, padding: '8px 0' }}>
            {meta.nav.map(item => {
              const navKey = item.label.toLowerCase().replace(/\s+/g, '');
              return (
                <Link key={item.path} to={item.path} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px',
                  color: isActive(item) ? meta.color : '#475569',
                  textDecoration: 'none', fontSize: 13,
                  background: isActive(item) ? `${meta.color}10` : 'transparent',
                  borderLeft: isActive(item) ? `3px solid ${meta.color}` : '3px solid transparent',
                  fontWeight: isActive(item) ? 600 : 400,
                }}
                >
                  <span>{item.icon}</span>
                  <span>{t(`role.nav.${role}.${navKey}`, item.label)}</span>
                </Link>
              );
            })}
          </nav>
          <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', background: '#fafbfc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 14 }}>{meta.icon}</span>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.3 }}>
                <strong style={{ color: '#0f172a', display: 'block' }}>{user?.name}</strong>
                {roleConfig.label || t(`role.label.${role}`, role)}
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#ef4444', width: '100%' }}>{t('role.logout', 'Logout')}</button>
          </div>
        </div>
      )}

      {isMobile && (
        <nav style={{
          display: 'flex', overflowX: 'auto', gap: 4, padding: '8px 10px',
          background: '#fff', borderBottom: '1px solid #e2e8f0',
          WebkitOverflowScrolling: 'touch',
        }}
        >
          {meta.nav.map((item) => {
            const active = isActive(item);
            const navKey = item.label.toLowerCase().replace(/\s+/g, '');
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 12px', borderRadius: 999,
                  textDecoration: 'none', fontSize: 12, fontWeight: active ? 700 : 500,
                  color: active ? '#fff' : '#475569',
                  background: active ? meta.color : '#f1f5f9',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{item.icon}</span>
                <span>{t(`role.nav.${role}.${navKey}`, item.label)}</span>
              </Link>
            );
          })}
        </nav>
      )}

      <div style={{ flex: 1, padding: isMobile ? 12 : 24, overflow: 'auto', width: '100%', boxSizing: 'border-box' }}>
        <Outlet />
      </div>
    </div>
  );
}

export { ROLE_META };
