import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAdminStore from '../../stores/adminStore';
import { useT } from '../../i18n/LanguageProvider';

export default function AdminDashboard() {
  const t = useT();
  const analytics = useAdminStore(s => s.analytics);
  const refreshAnalytics = useAdminStore(s => s.refreshAnalytics);

  useEffect(() => { refreshAnalytics(); }, []);

  const cards = [
    { label: t('admin.dashboard.total_users', 'Total Users'), value: analytics.usersCount, icon: '👥', color: '#3B82F6' },
    { label: t('admin.dashboard.total_orders', 'Diagnostics Orders'), value: analytics.ordersCount, icon: '📋', color: '#10B981' },
    { label: t('admin.dashboard.revenue', 'Revenue'), value: `₹${(analytics.revenue || 0).toLocaleString()}`, icon: '💰', color: '#F59E0B' },
    { label: t('admin.dashboard.tests', 'Tests'), value: analytics.testsCount, icon: '🧪', color: '#8B5CF6' },
    { label: t('admin.dashboard.pending', 'Pending'), value: analytics.pendingOrders, icon: '⏳', color: '#F97316' },
    { label: t('admin.dashboard.completed', 'Completed'), value: analytics.completedOrders, icon: '✅', color: '#22C55E' },
    { label: t('admin.dashboard.physio', 'Physio Bookings'), value: analytics.physioBookings, icon: '🦴', color: '#0D9488' },
    { label: t('admin.dashboard.vaccine', 'Vaccine Bookings'), value: analytics.vaccBookings, icon: '💉', color: '#2563EB' },
    { label: t('admin.dashboard.revenue_today', 'Revenue Today'), value: `₹${(analytics.revenueToday || 0).toLocaleString()}`, icon: '📅', color: '#EC4899' },
  ];

  const sectionStyle = {
    background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0',
  };
  const tableHeadStyle = { textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: 600, fontSize: 12 };
  const tableCellStyle = { padding: '10px 12px', color: '#0f172a', fontSize: 13 };

  return (
    <div>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{c.value}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Diagnostics Revenue + Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div style={sectionStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#0f172a' }}>{t('admin.dashboard.revenue.overview', 'Revenue Overview')}</h3>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div><div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>₹{(analytics.revenueMonth || 0).toLocaleString()}</div><div style={{ fontSize: 11, color: '#64748b' }}>{t('admin.dashboard.this.month', 'This Month')}</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>₹{(analytics.revenueToday || 0).toLocaleString()}</div><div style={{ fontSize: 11, color: '#64748b' }}>{t('admin.dashboard.today', 'Today')}</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>₹{(analytics.revenue || 0).toLocaleString()}</div><div style={{ fontSize: 11, color: '#64748b' }}>{t('admin.dashboard.all.time', 'All Time')}</div></div>
          </div>
        </div>
        <div style={sectionStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#0f172a' }}>{t('admin.dashboard.orders.status', 'Orders by Status')}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {Object.entries(analytics.ordersByStatus || {}).map(([status, count]) => (
              <div key={status} style={{ padding: '8px 14px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{count}</div>
                <div style={{ fontSize: 10, color: '#64748b', textTransform: 'capitalize' }}>{status.replace(/_/g, ' ')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Physiotherapy Section */}
      <div style={{ ...sectionStyle, marginBottom: 24, borderLeft: '4px solid #0D9488' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 22 }}>🦴</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0f172a' }}>{t('admin.dashboard.physiotherapy', 'Physiotherapy')}</h3>
          <Link to="/admin/physiotherapy" style={{ marginLeft: 'auto', fontSize: 11, color: '#0D9488', fontWeight: 600, textDecoration: 'none' }}>{t('admin.dashboard.manage', 'Manage →')}</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F0FDFA', border: '1px solid #CCFBF1' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0D9488' }}>{analytics.physioBookings}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>{t('admin.dashboard.total.bookings', 'Total Bookings')}</div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F0FDFA', border: '1px solid #CCFBF1' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0D9488' }}>₹{(analytics.physioRevenue || 0).toLocaleString()}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>{t('admin.dashboard.revenue', 'Revenue')}</div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F0FDFA', border: '1px solid #CCFBF1' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0D9488' }}>{analytics.physioBookingsMonth}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>{t('admin.dashboard.this.month', 'This Month')}</div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F0FDFA', border: '1px solid #CCFBF1' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0D9488' }}>{analytics.physioBookingsToday}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>{t('admin.dashboard.today', 'Today')}</div>
          </div>
        </div>
        {analytics.physioTopConditions.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ borderBottom: '1px solid #e2e8f0' }}><th style={tableHeadStyle}>#</th><th style={tableHeadStyle}>{t('admin.dashboard.condition', 'Condition')}</th><th style={{ ...tableHeadStyle, textAlign: 'right' }}>{t('admin.dashboard.bookings', 'Bookings')}</th></tr></thead>
            <tbody>
              {analytics.physioTopConditions.map((c, i) => (
                <tr key={c.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{i + 1}</td>
                  <td style={tableCellStyle}>{c.name}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>{c.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ fontSize: 13, color: '#94a3b8' }}>{t('admin.dashboard.no.physio', 'No physiotherapy bookings yet.')}</p>
        )}
      </div>

      {/* Vaccination Section */}
      <div style={{ ...sectionStyle, marginBottom: 24, borderLeft: '4px solid #2563EB' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 22 }}>💉</span>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0f172a' }}>{t('admin.dashboard.vaccination', 'Vaccination')}</h3>
          <Link to="/admin/vaccination" style={{ marginLeft: 'auto', fontSize: 11, color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>{t('admin.dashboard.manage', 'Manage →')}</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>{analytics.vaccBookings}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>{t('admin.dashboard.total.bookings', 'Total Bookings')}</div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>₹{(analytics.vaccRevenue || 0).toLocaleString()}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>{t('admin.dashboard.revenue', 'Revenue')}</div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>{analytics.vaccBookingsMonth}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>{t('admin.dashboard.this.month', 'This Month')}</div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>{analytics.vaccBookingsToday}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>{t('admin.dashboard.today', 'Today')}</div>
          </div>
        </div>
        {analytics.vaccTopVaccines.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ borderBottom: '1px solid #e2e8f0' }}><th style={tableHeadStyle}>#</th><th style={tableHeadStyle}>{t('admin.dashboard.vaccine', 'Vaccine')}</th><th style={{ ...tableHeadStyle, textAlign: 'right' }}>{t('admin.dashboard.bookings', 'Bookings')}</th></tr></thead>
            <tbody>
              {analytics.vaccTopVaccines.map((v, i) => (
                <tr key={v.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{i + 1}</td>
                  <td style={tableCellStyle}>{v.name}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>{v.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ fontSize: 13, color: '#94a3b8' }}>{t('admin.dashboard.no.vaccine', 'No vaccination bookings yet.')}</p>
        )}
      </div>

      {/* Top Tests */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#0f172a' }}>{t('admin.dashboard.top.tests', 'Top Selling Tests')}</h3>
        {analytics.topTests.length === 0 ? (
          <p style={{ fontSize: 13, color: '#94a3b8' }}>{t('admin.dashboard.no.orders', 'No orders yet.')}</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ borderBottom: '1px solid #e2e8f0' }}><th style={tableHeadStyle}>#</th><th style={tableHeadStyle}>{t('admin.dashboard.test', 'Test')}</th><th style={{ ...tableHeadStyle, textAlign: 'right' }}>{t('admin.dashboard.orders', 'Orders')}</th></tr></thead>
            <tbody>
              {analytics.topTests.map((t, i) => (
                <tr key={t.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{i + 1}</td>
                  <td style={tableCellStyle}>{t.name}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>{t.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/admin/orders" style={{ fontSize: 12, padding: '8px 16px', borderRadius: 8, background: '#0f172a', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>{t('admin.dashboard.view.orders', 'View All Orders')}</Link>
        <Link to="/admin/users" style={{ fontSize: 12, padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#334155', textDecoration: 'none', fontWeight: 600 }}>{t('admin.dashboard.manage.users', 'Manage Users')}</Link>
        <Link to="/admin/test-master" style={{ fontSize: 12, padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#334155', textDecoration: 'none', fontWeight: 600 }}>{t('admin.dashboard.manage.tests', 'Manage Tests')}</Link>
        <Link to="/admin/physiotherapy" style={{ fontSize: 12, padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#334155', textDecoration: 'none', fontWeight: 600 }}>{t('admin.dashboard.manage.physio', 'Physiotherapy')}</Link>
        <Link to="/admin/vaccination" style={{ fontSize: 12, padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#334155', textDecoration: 'none', fontWeight: 600 }}>{t('admin.dashboard.manage.vaccine', 'Vaccination')}</Link>
      </div>
    </div>
  );
}
