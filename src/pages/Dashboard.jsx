import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const recentOrders = [
  { id: 1, test: 'Complete Blood Count (CBC)', status: 'Completed', date: '15 Jun 2026', report: true },
  { id: 2, test: 'HbA1c', status: 'Processing', date: '18 Jun 2026', report: false },
  { id: 3, test: 'Lipid Profile', status: 'Scheduled', date: '22 Jun 2026', report: false },
];

const savedReports = [
  { test: 'Complete Blood Count (CBC)', date: '15 Jun 2026', lab: 'Jeevan Diagnostics' },
  { test: 'Thyroid Profile', date: '02 May 2026', lab: 'Jeevan Diagnostics' },
];

export default function Dashboard() {
  const user = useAuthStore(s => s.user);
  const orders = useAuthStore(s => s.orders);

  return (
    <div className="page-section container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Welcome, {user?.name || 'Patient'} 👋</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Manage your health reports and test bookings</p>
        </div>
        <Link to="/diagnostics" className="btn btn-primary">Book New Test</Link>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🧪</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{orders.length || 0}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tests Booked</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>📄</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{savedReports.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Reports Available</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>💰</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>₹0</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Total Savings</div>
        </div>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Recent Orders</h2>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {recentOrders.map(o => (
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{o.test}</p>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{o.date}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`badge ${o.status === 'Completed' ? 'badge-green' : o.status === 'Processing' ? 'badge-primary' : 'badge-yellow'}`}>{o.status}</span>
              {o.report && <button className="btn btn-outline btn-sm">View Report</button>}
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 600, margin: '20px 0 8px' }}>Saved Reports</h2>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {savedReports.map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{r.test}</p>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{r.date} · {r.lab}</p>
            </div>
            <button className="btn btn-outline btn-sm">Download</button>
          </div>
        ))}
      </div>
    </div>
  );
}
