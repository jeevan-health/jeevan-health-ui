import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import useAuthStore from '../stores/authStore';

const orders = [
  { id: 'ORD-1001', test: 'Complete Blood Count (CBC)', status: 'Completed', amount: 299, date: '15 Jun 2026', collection: '08:00 AM', reportUrl: '#' },
  { id: 'ORD-1002', test: 'HbA1c', status: 'Processing', amount: 599, date: '18 Jun 2026', collection: '07:30 AM' },
  { id: 'ORD-1003', test: 'Lipid Profile', status: 'Scheduled', amount: 449, date: '22 Jun 2026', collection: '09:00 AM' },
  { id: 'ORD-1004', test: 'Thyroid Profile + Vitamin B12', status: 'Completed', amount: 1099, date: '02 May 2026', collection: '08:30 AM', reportUrl: '#' },
  { id: 'ORD-1005', test: 'Full Body Checkup', status: 'Cancelled', amount: 2499, date: '28 Apr 2026' },
];

export default function MyTestOrders() {
  const t = useT();
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status.toLowerCase() === filter);

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'Completed').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    scheduled: orders.filter(o => o.status === 'Scheduled').length,
  };

  return (
    <div className="page-section container">
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{t('orders.title', 'My Orders')}</h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>{t('orders.subtitle', 'Track and manage your test bookings')}</p>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 700, textTransform: 'capitalize' }}>{v}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t(`orders.stat.${k}`, k.charAt(0).toUpperCase() + k.slice(1))}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'completed', 'processing', 'scheduled', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}>{t(`orders.filter.${f}`, f.charAt(0).toUpperCase() + f.slice(1))}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 && <p style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>{t('orders.noOrders', 'No orders found.')}</p>}
        {filtered.map(o => (
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{o.test}</p>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{o.id} · {o.date}</p>
              {o.collection && <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t('orders.collection', 'Collection:')} {o.collection}</p>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`badge ${o.status === 'Completed' ? 'badge-green' : o.status === 'Processing' ? 'badge-primary' : o.status === 'Scheduled' ? 'badge-yellow' : 'badge-red'}`}>{o.status}</span>
              <span style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>₹{o.amount}</span>
              {o.reportUrl && <button className="btn btn-outline btn-sm">{t('orders.view', 'View')}</button>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Link to="/diagnostics" className="btn btn-primary">{t('orders.bookAnother', 'Book Another Test')}</Link>
      </div>
    </div>
  );
}
