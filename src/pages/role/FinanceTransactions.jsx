import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { id: 'TXN-001', type: 'Payment', from: 'Ravi Kumar', amount: '₹2,500', method: 'UPI', date: '2025-07-08', status: 'completed' },
  { id: 'TXN-002', type: 'Refund', from: 'Sita Devi', amount: '₹1,200', method: 'Bank Transfer', date: '2025-07-07', status: 'completed' },
  { id: 'TXN-003', type: 'Payment', from: 'Amit Singh', amount: '₹5,000', method: 'Card', date: '2025-07-07', status: 'pending' },
  { id: 'TXN-004', type: 'Corporate', from: 'Acme Corp', amount: '₹4,50,000', method: 'Invoice', date: '2025-07-06', status: 'completed' },
  { id: 'TXN-005', type: 'Payment', from: 'Priya', amount: '₹800', method: 'Cash', date: '2025-07-06', status: 'failed' },
];

export default function FinanceTransactions() {
  const [filter, setFilter] = useState('');
  const filtered = filter ? SAMPLE.filter(t => t.status === filter) : SAMPLE;
  const total = SAMPLE.filter(t => t.status === 'completed').reduce((s, t) => s + parseInt(t.amount.replace(/[₹,]/g, '')), 0);
  const t = useT();
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.financeTransactions.title', '💳 Transactions')}</h2>
      <div style={{ ...card, textAlign: 'center', marginBottom: 0, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <div style={{ fontSize: 11, color: '#64748b' }}>{t('role.financeTransactions.totalCompleted', 'Total Completed')}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#16a34a' }}>₹{total.toLocaleString()}</div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        {['', 'completed', 'pending', 'failed'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: filter === s ? '#15803d' : '#fff', color: filter === s ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11 }}>{s ? t('role.financeTransactions.filter' + s.charAt(0).toUpperCase() + s.slice(1), s) : t('role.financeTransactions.filterAll', 'All')}</button>
        ))}
      </div>
      {filtered.map((t, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{t.id}</span>
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>{t.type}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{t.from} · {t.method} · {t.date}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{t.amount}</div>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: t.status === 'completed' ? '#dcfce7' : t.status === 'pending' ? '#fef3c7' : '#fee2e2', color: t.status === 'completed' ? '#16a34a' : t.status === 'pending' ? '#d97706' : '#dc2626', fontWeight: 600, textTransform: 'capitalize' }}>{t.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}