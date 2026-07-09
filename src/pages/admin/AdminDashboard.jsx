import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAdminStore from '../../stores/adminStore';

export default function AdminDashboard() {
  const analytics = useAdminStore(s => s.analytics);
  const refreshAnalytics = useAdminStore(s => s.refreshAnalytics);

  useEffect(() => { refreshAnalytics(); }, []);

  const cards = [
    { label: 'Total Users', value: analytics.usersCount, icon: '👥', color: '#3B82F6' },
    { label: 'Total Orders', value: analytics.ordersCount, icon: '📋', color: '#10B981' },
    { label: 'Revenue', value: `₹${(analytics.revenue || 0).toLocaleString()}`, icon: '💰', color: '#F59E0B' },
    { label: 'Tests', value: analytics.testsCount, icon: '🧪', color: '#8B5CF6' },
    { label: 'Pending', value: analytics.pendingOrders, icon: '⏳', color: '#F97316' },
    { label: 'Completed', value: analytics.completedOrders, icon: '✅', color: '#22C55E' },
    { label: 'Cancelled', value: analytics.cancelledOrders, icon: '❌', color: '#EF4444' },
    { label: 'Revenue Today', value: `₹${(analytics.revenueToday || 0).toLocaleString()}`, icon: '📅', color: '#EC4899' },
  ];

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

      {/* Revenue + Status row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Revenue */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#0f172a' }}>Revenue Overview</h3>
          <div style={{ display: 'flex', gap: 24 }}>
            <div><div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>₹{(analytics.revenueMonth || 0).toLocaleString()}</div><div style={{ fontSize: 11, color: '#64748b' }}>This Month</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>₹{(analytics.revenueToday || 0).toLocaleString()}</div><div style={{ fontSize: 11, color: '#64748b' }}>Today</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>₹{(analytics.revenue || 0).toLocaleString()}</div><div style={{ fontSize: 11, color: '#64748b' }}>All Time</div></div>
          </div>
        </div>

        {/* Status distribution */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#0f172a' }}>Orders by Status</h3>
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

      {/* Top Tests */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#0f172a' }}>Top Selling Tests</h3>
        {analytics.topTests.length === 0 ? (
          <p style={{ fontSize: 13, color: '#94a3b8' }}>No orders yet. Orders will appear here once placed.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ borderBottom: '1px solid #e2e8f0' }}><th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: 600 }}>#</th><th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: 600 }}>Test</th><th style={{ textAlign: 'right', padding: '8px 12px', color: '#64748b', fontWeight: 600 }}>Orders</th></tr></thead>
            <tbody>
              {analytics.topTests.map((t, i) => (
                <tr key={t.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{i + 1}</td>
                  <td style={{ padding: '10px 12px', color: '#0f172a' }}>{t.name}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>{t.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/admin/orders" style={{ fontSize: 12, padding: '8px 16px', borderRadius: 8, background: '#0f172a', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>View All Orders</Link>
        <Link to="/admin/users" style={{ fontSize: 12, padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#334155', textDecoration: 'none', fontWeight: 600 }}>Manage Users</Link>
        <Link to="/admin/test-master" style={{ fontSize: 12, padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#334155', textDecoration: 'none', fontWeight: 600 }}>Manage Tests</Link>
      </div>
    </div>
  );
}
