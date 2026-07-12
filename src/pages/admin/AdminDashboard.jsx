import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/LanguageProvider';
import * as adminService from '../../services/adminService';

const DEFAULT = {
  totalUsers: 0,
  totalDiagnosticOrders: 0,
  totalPharmacyOrders: 0,
  totalAppointments: 0,
  totalTests: 0,
  revenue: 0,
  revenueMonth: 0,
  revenueToday: 0,
  pendingOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  ordersToday: 0,
  appointmentsToday: 0,
  usersByRole: [],
  ordersByStatus: [],
  recentUsers: [],
  recentOrders: [],
};

const statusColor = {
  pending: '#f97316', confirmed: '#3b82f6', sample_collected: '#8b5cf6',
  processing: '#f59e0b', results_ready: '#22c55e', completed: '#10b981', cancelled: '#ef4444',
  preparing: '#a855f7', shipped: '#0ea5e9', delivered: '#10b981',
};

export default function AdminDashboard() {
  const t = useT();
  const [data, setData] = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: stats } = await adminService.getDashboardStats();
      setData({ ...DEFAULT, ...stats });
      setLastRefresh(new Date());
    } catch {
      setError(t('admin.dashboard.loadError', 'Could not load dashboard stats. Check API connection.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const ordersCount = (data.totalDiagnosticOrders || 0) + (data.totalPharmacyOrders || 0);

  // Merge status rows for display (sum by status name across types)
  const statusMap = {};
  (data.ordersByStatus || []).forEach(row => {
    const key = row.status || 'unknown';
    statusMap[key] = (statusMap[key] || 0) + (row.count || 0);
  });

  const cards = [
    { label: t('admin.dashboard.total_users', 'Total Users'), value: data.totalUsers, icon: '👥', color: '#3B82F6', to: '/admin/users' },
    { label: t('admin.dashboard.total_orders', 'Orders'), value: ordersCount, icon: '📋', color: '#10B981', to: '/admin/orders' },
    { label: t('admin.dashboard.revenue', 'Revenue (diag)'), value: `₹${Number(data.revenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: '#F59E0B', to: '/admin/orders' },
    { label: t('admin.dashboard.tests', 'Tests in catalog'), value: data.totalTests, icon: '🧪', color: '#8B5CF6', to: '/admin/test-master' },
    { label: t('admin.dashboard.pending', 'Pending / confirmed'), value: data.pendingOrders, icon: '⏳', color: '#F97316', to: '/admin/orders' },
    { label: t('admin.dashboard.completed', 'Completed / ready'), value: data.completedOrders, icon: '✅', color: '#22C55E', to: '/admin/orders' },
    { label: t('admin.dashboard.appointments', 'Appointments'), value: data.totalAppointments, icon: '🩺', color: '#0D9488', to: '/admin/bookings' },
    { label: t('admin.dashboard.orders_today', 'Orders today'), value: data.ordersToday, icon: '📅', color: '#EC4899', to: '/admin/orders' },
  ];

  const quickLinks = [
    { to: '/admin/orders', icon: '📋', label: t('admin.dashboard.ql.orders', 'Manage orders') },
    { to: '/admin/users', icon: '👥', label: t('admin.dashboard.ql.users', 'Users & roles') },
    { to: '/admin/test-master', icon: '🧪', label: t('admin.dashboard.ql.tests', 'Test master') },
    { to: '/admin/bookings', icon: '📅', label: t('admin.dashboard.ql.bookings', 'Appointments') },
    { to: '/admin/cms', icon: '🌐', label: t('admin.dashboard.ql.cms', 'Website CMS') },
    { to: '/admin/export', icon: '📤', label: t('admin.dashboard.ql.export', 'Export data') },
  ];

  const cardStyle = {
    background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0',
  };

  return (
    <div className="admin-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            {loading
              ? t('admin.dashboard.loading', 'Loading live stats…')
              : lastRefresh
                ? `${t('admin.dashboard.updated', 'Updated')} ${lastRefresh.toLocaleTimeString('en-IN')}`
                : ''}
          </div>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          style={{
            padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff',
            fontSize: 12, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit', minHeight: 40,
          }}
        >
          {loading ? t('admin.dashboard.refreshing', 'Refreshing…') : t('admin.dashboard.refresh', '↻ Refresh')}
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="admin-dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 148px), 1fr))', gap: 12, marginBottom: 20 }}>
        {cards.map(c => (
          <Link key={c.label} to={c.to} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ ...cardStyle, padding: '14px', height: '100%', transition: 'border-color 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {c.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{c.value}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 2, lineHeight: 1.3 }}>{c.label}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, marginBottom: 20 }}>
        {quickLinks.map(q => (
          <Link
            key={q.to}
            to={q.to}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 12px',
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
              textDecoration: 'none', color: '#0f172a', fontSize: 12, fontWeight: 600, minHeight: 44,
            }}
          >
            <span aria-hidden>{q.icon}</span> {q.label}
          </Link>
        ))}
      </div>

      {/* Revenue + status */}
      <div className="admin-dash-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px', color: '#0f172a' }}>
            {t('admin.dashboard.revenue.overview', 'Diagnostics revenue')}
          </h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>₹{Number(data.revenueMonth || 0).toLocaleString('en-IN')}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{t('admin.dashboard.this.month', 'This month')}</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>₹{Number(data.revenueToday || 0).toLocaleString('en-IN')}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{t('admin.dashboard.today', 'Today')}</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>₹{Number(data.revenue || 0).toLocaleString('en-IN')}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{t('admin.dashboard.all.time', 'All time')}</div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: '#94a3b8', margin: '12px 0 0' }}>
            {t('admin.dashboard.revenueNote', 'Excludes cancelled diagnostic orders. Pharmacy revenue not included yet.')}
          </p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px', color: '#0f172a' }}>
            {t('admin.dashboard.orders.status', 'Orders by status')}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.keys(statusMap).length === 0 ? (
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{t('admin.dashboard.noOrderStatus', 'No order status data yet.')}</p>
            ) : Object.entries(statusMap).map(([status, count]) => (
              <div key={status} style={{ padding: '8px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: statusColor[status] || '#0f172a' }}>{count}</div>
                <div style={{ fontSize: 10, color: '#64748b', textTransform: 'capitalize' }}>{status.replace(/_/g, ' ')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders + users */}
      <div className="admin-dash-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#0f172a' }}>{t('admin.dashboard.recentOrders', 'Recent diagnostic orders')}</h3>
            <Link to="/admin/orders" style={{ fontSize: 12, color: '#1866C9', fontWeight: 600, textDecoration: 'none' }}>{t('admin.dashboard.viewAll', 'View all →')}</Link>
          </div>
          {(data.recentOrders || []).length === 0 ? (
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{t('admin.dashboard.noRecentOrders', 'No orders yet.')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.recentOrders.map(o => (
                <Link
                  key={o.id}
                  to="/admin/orders"
                  style={{
                    display: 'flex', justifyContent: 'space-between', gap: 8, padding: '10px 0',
                    borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: 'inherit', fontSize: 12,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>#{o.id} · {o.user_name || 'Patient'}</div>
                    <div style={{ color: '#94a3b8', marginTop: 2 }}>
                      {o.created_at ? new Date(o.created_at).toLocaleString('en-IN') : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>₹{Number(o.total_amount || 0).toLocaleString('en-IN')}</div>
                    <div style={{ color: statusColor[o.status] || '#64748b', textTransform: 'capitalize', fontSize: 11 }}>
                      {(o.status || '').replace(/_/g, ' ')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#0f172a' }}>{t('admin.dashboard.recentUsers', 'Recent users')}</h3>
            <Link to="/admin/users" style={{ fontSize: 12, color: '#1866C9', fontWeight: 600, textDecoration: 'none' }}>{t('admin.dashboard.viewAll', 'View all →')}</Link>
          </div>
          {(data.recentUsers || []).length === 0 ? (
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{t('admin.dashboard.noRecentUsers', 'No users yet.')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.recentUsers.map(u => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{u.name || u.phone || 'User'}</div>
                    <div style={{ color: '#94a3b8', marginTop: 2 }}>{u.phone || u.email || '—'}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                      background: '#f1f5f9', color: '#475569', textTransform: 'capitalize',
                    }}>
                      {u.role || 'user'}
                    </span>
                    <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 10 }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Roles breakdown */}
      {(data.usersByRole || []).length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px', color: '#0f172a' }}>{t('admin.dashboard.usersByRole', 'Users by role')}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {data.usersByRole.map(r => (
              <div key={r.role} style={{ padding: '8px 12px', borderRadius: 8, background: '#EEF2FF', border: '1px solid #c7d2fe' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1866C9' }}>{r.count}</div>
                <div style={{ fontSize: 10, color: '#475569', textTransform: 'capitalize' }}>{r.role || 'user'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-dash-split { grid-template-columns: 1fr !important; gap: 12px !important; }
          .admin-dash-stats { gap: 8px !important; }
        }
      `}</style>
    </div>
  );
}
