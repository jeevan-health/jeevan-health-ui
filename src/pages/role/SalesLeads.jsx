import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { name: 'TechCorp India', contact: 'Rahul Mehta', phone: '9876543001', source: 'Website', value: '₹50,000', status: 'hot', stage: 'proposal' },
  { name: 'GreenEarth NGO', contact: 'Anita Sharma', phone: '9876543002', source: 'Referral', value: '₹25,000', status: 'warm', stage: 'meeting' },
  { name: 'Phoenix Hospital', contact: 'Dr. Kumar', phone: '9876543003', source: 'Direct', value: '₹2,00,000', status: 'cold', stage: 'initial' },
  { name: 'StartupHub', contact: 'Vikram S', phone: '9876543004', source: 'LinkedIn', value: '₹35,000', status: 'warm', stage: 'negotiation' },
];

export default function SalesLeads() {
  const t = useT();
  const [filter, setFilter] = useState('');
  const filtered = filter ? SAMPLE.filter(l => l.status === filter) : SAMPLE;
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.sales.leads', '👥 Leads')}</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {['', 'hot', 'warm', 'cold'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: filter === s ? '#e11d48' : '#fff', color: filter === s ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 11 }}>{s || t('role.sales.all', 'All')}</button>
        ))}
      </div>
      {filtered.map((l, i) => {
        const borderColor = l.status === 'hot' ? '#dc2626' : l.status === 'warm' ? '#f97316' : '#94a3b8';
        const bgColor = l.status === 'hot' ? '#fee2e2' : l.status === 'warm' ? '#fff7ed' : '#f1f5f9';
        const textColor = l.status === 'hot' ? '#dc2626' : l.status === 'warm' ? '#f97316' : '#64748b';
        return (
        <div key={i} style={{ ...card, borderLeft: `4px solid ${borderColor}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{l.name}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{l.contact} · {l.phone} · {l.source}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{t('role.sales.value', 'Value:')} {l.value} {t('role.sales.stage', '· Stage:')} {l.stage}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: bgColor, color: textColor, fontWeight: 600, textTransform: 'capitalize' }}>{l.status}</span>
          </div>
        </div>
        );
      })}
    </div>
  );
}