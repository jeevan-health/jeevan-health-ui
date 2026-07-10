import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const SAMPLE = [
  { name: 'Summer Health Campaign', channel: 'Email + SMS', sent: 2500, opens: 850, clicks: 320, status: 'active', budget: '₹25,000' },
  { name: 'Doctor Referral Program', channel: 'WhatsApp', sent: 1200, opens: 780, clicks: 410, status: 'active', budget: '₹15,000' },
  { name: 'Corporate Wellness Drive', channel: 'LinkedIn', sent: 500, opens: 320, clicks: 180, status: 'completed', budget: '₹10,000' },
];

export default function SalesCampaigns() {
  const t = useT();
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.sales.campaigns', '📢 Campaigns')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{t('role.sales.campaignsDesc', 'Marketing campaigns and performance')}</p>
      {SAMPLE.map((c, i) => (
        <div key={i} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{c.name}</span>
              <div style={{ fontSize: 12, color: '#64748b' }}>{c.channel} · {t('role.sales.sent', 'Sent:')} {c.sent.toLocaleString()} · {t('role.sales.opens', 'Opens:')} {c.opens} · {t('role.sales.clicks', 'Clicks:')} {c.clicks}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{t('role.sales.budget', 'Budget:')} {c.budget}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: c.status === 'active' ? '#dcfce7' : '#f1f5f9', color: c.status === 'active' ? '#16a34a' : '#64748b', fontWeight: 600, textTransform: 'capitalize' }}>{c.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}