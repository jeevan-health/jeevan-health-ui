import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { useT } from '../../i18n/LanguageProvider';

const NAV_GROUPS = [
  {
    id: 'core',
    title: 'Core',
    items: [
      { path: '/admin', label: 'admin.layout.dashboard', fallback: 'Dashboard', icon: '📊', exact: true },
      { path: '/admin/orders', label: 'admin.layout.orders', fallback: 'Orders', icon: '📋' },
      { path: '/admin/bookings', label: 'admin.layout.bookings', fallback: 'Bookings', icon: '📅' },
      { path: '/admin/users', label: 'admin.layout.users', fallback: 'Users', icon: '👥' },
      { path: '/admin/patients', label: 'admin.layout.patients', fallback: 'Patients', icon: '👤' },
      { path: '/admin/reports', label: 'admin.layout.reports', fallback: 'Reports', icon: '📄' },
    ],
  },
  {
    id: 'catalog',
    title: 'Catalog',
    items: [
      { path: '/admin/test-master', label: 'admin.layout.test_master', fallback: 'Test Master', icon: '🧪' },
      { path: '/admin/health-packages', label: 'admin.layout.health_packages', fallback: 'Health Packages', icon: '📦' },
      { path: '/admin/doctors', label: 'admin.layout.doctors', fallback: 'Doctors', icon: '🩺' },
      { path: '/admin/inventory', label: 'admin.layout.inventory', fallback: 'Inventory', icon: '📦' },
      { path: '/admin/coupons', label: 'admin.layout.coupons', fallback: 'Coupons', icon: '🏷️' },
    ],
  },
  {
    id: 'services',
    title: 'Home services',
    items: [
      { path: '/admin/collection', label: 'admin.layout.phlebotomists', fallback: 'Phlebotomists', icon: '🚑' },
      { path: '/admin/nursing-bookings', label: 'admin.layout.nursing_bookings', fallback: 'Nursing Bookings', icon: '👩‍⚕️' },
      { path: '/admin/nursing', label: 'admin.layout.nursing', fallback: 'Nursing Tools', icon: '🩹' },
      { path: '/admin/physio-bookings', label: 'admin.layout.physio_bookings', fallback: 'Physio Bookings', icon: '💪' },
      { path: '/admin/physiotherapy', label: 'admin.layout.physiotherapy', fallback: 'Physio Tools', icon: '🦴' },
      { path: '/admin/vaccination-bookings', label: 'admin.layout.vaccination_bookings', fallback: 'Vaccine Bookings', icon: '💉' },
      { path: '/admin/vaccination', label: 'admin.layout.vaccination', fallback: 'Vaccine Tools', icon: '🧪' },
    ],
  },
  {
    id: 'ops',
    title: 'Operations',
    items: [
      { path: '/admin/staff-onboarding', label: 'admin.layout.staff_onboarding', fallback: 'Staff Onboarding', icon: '📋' },
      { path: '/admin/doctor-onboarding', label: 'admin.layout.doctor_onboarding', fallback: 'Doctor Onboarding', icon: '🩺' },
      { path: '/admin/permissions', label: 'admin.layout.permissions', fallback: 'Permissions', icon: '🔐' },
      { path: '/admin/contacts', label: 'admin.layout.contacts', fallback: 'Contacts', icon: '✉️' },
      { path: '/admin/audit-log', label: 'admin.layout.audit_log', fallback: 'Audit Log', icon: '📋' },
      { path: '/admin/export', label: 'admin.layout.data_export', fallback: 'Data Export', icon: '📤' },
      { path: '/admin/sales', label: 'admin.layout.sales', fallback: 'Sales Dashboard', icon: '📈' },
    ],
  },
  {
    id: 'growth',
    title: 'Growth & content',
    items: [
      { path: '/admin/cms', label: 'admin.layout.cms', fallback: 'Website CMS', icon: '🌐' },
      { path: '/admin/seo', label: 'admin.layout.seo', fallback: 'SEO', icon: '🔍' },
      { path: '/admin/marketing', label: 'admin.layout.marketing', fallback: 'Marketing', icon: '📣' },
      { path: '/admin/crm', label: 'admin.layout.crm', fallback: 'CRM', icon: '🤝' },
      { path: '/admin/whatsapp', label: 'admin.layout.whatsapp', fallback: 'WhatsApp', icon: '💬' },
    ],
  },
];

const FLAT_NAV = NAV_GROUPS.flatMap(g => g.items);

function useIsMobile(breakpoint = 900) {
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

export default function AdminLayout() {
  const t = useT();
  const isMobile = useIsMobile(900);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navQuery, setNavQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  // Close drawer on route change (mobile)
  useEffect(() => {
    setDrawerOpen(false);
    setNavQuery('');
  }, [location.pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    document.body.classList.toggle('admin-drawer-open', drawerOpen);
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('admin-drawer-open');
    };
  }, [drawerOpen, isMobile]);

  // Desktop: auto-expand sidebar when leaving mobile
  useEffect(() => {
    if (!isMobile) setDrawerOpen(false);
  }, [isMobile]);

  const getLabel = (item) => {
    try {
      return t(item.label, item.fallback);
    } catch {
      return item.fallback;
    }
  };

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const activeItem = FLAT_NAV.find(i => isActive(i)) || FLAT_NAV[0];
  const pageTitle = getLabel(activeItem);

  const filteredGroups = useMemo(() => {
    const q = navQuery.trim().toLowerCase();
    if (!q) return NAV_GROUPS;
    return NAV_GROUPS.map(g => ({
      ...g,
      items: g.items.filter(i =>
        getLabel(i).toLowerCase().includes(q) || i.path.includes(q) || (i.fallback || '').toLowerCase().includes(q)
      ),
    })).filter(g => g.items.length > 0);
  }, [navQuery, t]);

  const sidebarWidth = collapsed && !isMobile ? 72 : 260;
  const showSidebarLabels = isMobile || !collapsed;
  const sidebarVisible = isMobile ? drawerOpen : true;

  const renderNav = () => (
    <>
      {showSidebarLabels && (
        <div style={{ padding: '10px 12px 6px' }}>
          <input
            value={navQuery}
            onChange={e => setNavQuery(e.target.value)}
            placeholder={t('admin.layout.searchNav', 'Search menu…')}
            aria-label={t('admin.layout.searchNav', 'Search menu…')}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 10,
              border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', background: '#f8fafc',
              outline: 'none', minHeight: 42,
            }}
          />
        </div>
      )}
      <nav style={{ flex: 1, padding: '4px 0 12px', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {filteredGroups.map(group => (
          <div key={group.id} style={{ marginBottom: 8 }}>
            {showSidebarLabels && (
              <div style={{
                fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase',
                letterSpacing: 0.6, padding: '10px 16px 4px',
              }}>
                {t(`admin.layout.group.${group.id}`, group.title)}
              </div>
            )}
            {group.items.map(item => (
              <Link
                key={item.path}
                to={item.path}
                title={!showSidebarLabels ? getLabel(item) : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: showSidebarLabels ? '11px 16px' : '12px 0',
                  color: isActive(item) ? '#1866C9' : '#475569',
                  textDecoration: 'none', fontSize: 13,
                  background: isActive(item) ? '#EEF2FF' : 'transparent',
                  borderLeft: isActive(item) ? '3px solid #1866C9' : '3px solid transparent',
                  justifyContent: showSidebarLabels ? 'flex-start' : 'center',
                  fontWeight: isActive(item) ? 600 : 500,
                  minHeight: 44,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span style={{ fontSize: 16, width: 22, textAlign: 'center', flexShrink: 0 }} aria-hidden>{item.icon}</span>
                {showSidebarLabels && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{getLabel(item)}</span>}
              </Link>
            ))}
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <div style={{ padding: 16, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
            {t('admin.layout.noNavMatch', 'No menu items match')}
          </div>
        )}
      </nav>
    </>
  );

  const renderUserFooter = () => (
    <div style={{
      padding: showSidebarLabels ? '12px 14px' : '10px 8px',
      borderTop: '1px solid #f1f5f9', background: '#fafbfc', flexShrink: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: showSidebarLabels ? 10 : 0,
        justifyContent: showSidebarLabels ? 'flex-start' : 'center',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #0F5DA8, #1A7AD4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>
          {(user?.name || 'A')[0]}
        </div>
        {showSidebarLabels && (
          <div style={{ fontSize: 12, overflow: 'hidden', minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || t('admin.layout.adminName', 'Admin')}
            </div>
            <div style={{ color: '#94a3b8', fontSize: 10, textTransform: 'capitalize' }}>
              {user?.role || t('admin.layout.adminRole', 'admin')}
            </div>
          </div>
        )}
      </div>
      {showSidebarLabels && (
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={() => window.open('/', '_blank', 'noopener,noreferrer')}
            style={{
              flex: 1, padding: '10px 0', background: '#fff', border: '1px solid #e2e8f0',
              color: '#475569', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
              fontWeight: 600, minHeight: 40,
            }}
          >
            {t('admin.layout.site', 'Site')}
          </button>
          <button
            type="button"
            onClick={() => { logout(); navigate('/admin/login', { replace: true }); }}
            style={{
              flex: 1, padding: '10px 0', background: '#fff', border: '1px solid #fecaca',
              color: '#ef4444', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
              fontWeight: 600, minHeight: 40,
            }}
          >
            {t('admin.layout.logout', 'Logout')}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-shell" style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Mobile overlay */}
      {isMobile && (
        <div
          onClick={() => setDrawerOpen(false)}
          aria-hidden={!drawerOpen}
          style={{
            position: 'fixed', inset: 0, zIndex: 10040,
            background: 'rgba(15, 23, 42, 0.45)',
            opacity: drawerOpen ? 1 : 0,
            pointerEvents: drawerOpen ? 'auto' : 'none',
            transition: 'opacity 0.2s',
          }}
        />
      )}

      {/* Sidebar / drawer */}
      <aside
        className="admin-sidebar"
        style={{
          width: isMobile ? 300 : sidebarWidth,
          maxWidth: isMobile ? '86vw' : undefined,
          background: '#fff', color: '#334155',
          transition: isMobile ? 'transform 0.25s ease' : 'width 0.2s',
          display: 'flex', flexDirection: 'column',
          position: isMobile ? 'fixed' : 'sticky',
          top: 0, left: 0, height: '100vh', height: '100dvh',
          zIndex: isMobile ? 10050 : 20,
          overflow: 'hidden',
          borderRight: '1px solid #e2e8f0',
          boxShadow: isMobile && drawerOpen ? '4px 0 24px rgba(15,23,42,0.15)' : (isMobile ? 'none' : '0 1px 3px rgba(0,0,0,0.04)'),
          transform: isMobile ? (sidebarVisible ? 'translateX(0)' : 'translateX(-105%)') : 'none',
        }}
      >
        <div style={{
          padding: showSidebarLabels ? '12px 14px' : '12px 8px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', gap: 10,
          justifyContent: showSidebarLabels ? 'space-between' : 'center',
          background: 'linear-gradient(135deg, #0F5DA8, #1A7AD4)',
          flexShrink: 0, minHeight: 56,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {!isMobile && (
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? t('admin.layout.expand', 'Expand menu') : t('admin.layout.collapse', 'Collapse menu')}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, padding: '6px 8px', borderRadius: 8 }}
              >
                ☰
              </button>
            )}
            {showSidebarLabels && (
              <span style={{ fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: 0.3 }}>
                {t('admin.layout.brand', 'Jeevan Admin')}
              </span>
            )}
          </div>
          {isMobile && (
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label={t('admin.layout.closeMenu', 'Close menu')}
              style={{
                width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,0.35)',
                background: 'rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer', fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
              }}
            >
              ×
            </button>
          )}
        </div>

        {renderNav()}
        {renderUserFooter()}
      </aside>

      {/* Main */}
      <main className="admin-main" style={{ flex: 1, overflowX: 'hidden', padding: 0, minWidth: 0, width: '100%' }}>
        <div className="admin-topbar" style={{
          background: '#fff', borderBottom: '1px solid #e2e8f0',
          padding: isMobile ? '10px 12px' : '12px 24px',
          display: 'flex', alignItems: 'center', gap: 10,
          justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30,
          minHeight: 56,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
            {isMobile && (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label={t('admin.layout.openMenu', 'Open menu')}
                style={{
                  width: 40, height: 40, borderRadius: 10, border: '1px solid #e2e8f0',
                  background: '#f8fafc', cursor: 'pointer', fontSize: 18, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
                }}
              >
                ☰
              </button>
            )}
            <div style={{
              fontSize: isMobile ? 15 : 18, fontWeight: 700, color: '#0f172a',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {pageTitle || t('admin.layout.adminTitle', 'Admin')}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {isMobile && (
              <button
                type="button"
                onClick={() => { logout(); navigate('/admin/login', { replace: true }); }}
                style={{
                  padding: '8px 10px', borderRadius: 8, border: '1px solid #fecaca',
                  background: '#fff', color: '#ef4444', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', minHeight: 36,
                }}
              >
                {t('admin.layout.logout', 'Logout')}
              </button>
            )}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#1866C9', textDecoration: 'none', fontSize: isMobile ? 11 : 12, fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {isMobile ? t('admin.layout.siteShort', 'Site ↗') : t('admin.layout.preview_site', 'Preview site ↗')}
            </a>
          </div>
        </div>

        <div className="admin-content" style={{ padding: isMobile ? 12 : 24 }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        /* Hide patient floating theme FAB over admin on small screens if it ever shows */
        @media (max-width: 900px) {
          .admin-content table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; }
          .admin-content input, .admin-content select, .admin-content textarea, .admin-content button {
            max-width: 100%;
          }
        }
        @media (max-width: 600px) {
          .admin-content { padding-bottom: 24px !important; }
        }
      `}</style>
    </div>
  );
}
