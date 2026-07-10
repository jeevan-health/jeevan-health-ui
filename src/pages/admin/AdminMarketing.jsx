import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
import useMarketingStore from '../../stores/marketingStore';

export default function AdminMarketing() {
  const t = useT();
  const { data, addCampaign, updateCampaign, deleteCampaign, updateChannel, reset } = useMarketingStore();
  const [tab, setTab] = useState('overview');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', channel: 'email', budget: '', startDate: '', endDate: '', status: 'planned' });

  const handleAdd = (e) => {
    e.preventDefault();
    addCampaign({ name: form.name, channel: form.channel, budget: +form.budget, spent: 0, sent: 0, opens: 0, clicks: 0, conversions: 0, startDate: form.startDate, endDate: form.endDate, status: form.status });
    setForm({ name: '', channel: 'email', budget: '', startDate: '', endDate: '', status: 'planned' });
    setShowAdd(false);
  };

  const channels = { email: '✉️', whatsapp: '💬', sms: '📱', linkedin: '💼', facebook: '📷', blog: '📝' };

  const renderTab = (label, key) => (
    <button onClick={() => setTab(key)} style={{ padding: '8px 16px', border: 'none', cursor: 'pointer', borderRadius: 4, background: tab === key ? '#6366f1' : '#e5e7eb', color: tab === key ? '#fff' : '#374151', fontWeight: tab === key ? 600 : 400, fontSize: 13 }}>{label}</button>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>📣 Digital Marketing</h2>
        <button onClick={reset} style={{ padding: '6px 14px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>Reset</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {renderTab('Overview', 'overview')}
        {renderTab('Campaigns', 'campaigns')}
        {renderTab('Channels', 'channels')}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 10, border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Total Spend (YTD)</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>₹{data.analytics.totalSpend.toLocaleString()}</div>
          </div>
          <div style={{ background: '#fff', padding: 20, borderRadius: 10, border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Monthly Spend</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>₹{data.analytics.monthlySpend.toLocaleString()}</div>
          </div>
          <div style={{ background: '#f0fdf4', padding: 20, borderRadius: 10, border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: 12, color: '#166534' }}>Total Conversions</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4, color: '#14532d' }}>{data.analytics.totalConversions.toLocaleString()}</div>
          </div>
          <div style={{ background: '#fff', padding: 20, borderRadius: 10, border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Cost / Conversion</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>₹{data.analytics.costPerConversion}</div>
          </div>
          <div style={{ background: '#f5f3ff', padding: 20, borderRadius: 10, border: '1px solid #ddd6fe' }}>
            <div style={{ fontSize: 12, color: '#5b21b6' }}>ROAS</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4, color: '#4c1d95' }}>{data.analytics.roas}x</div>
          </div>
          <div style={{ background: '#fff', padding: 20, borderRadius: 10, border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Active Campaigns</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{data.campaigns.filter(c => c.status === 'active').length}</div>
          </div>
        </div>
      )}

      {tab === 'campaigns' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, color: '#6b7280' }}>{data.campaigns.length} campaigns</div>
            <button onClick={() => setShowAdd(true)} style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>+ New Campaign</button>
          </div>
          {showAdd && (
            <form onSubmit={handleAdd} style={{ background: '#f9fafb', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid #e5e7eb', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Channel</label><select value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value })} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }}>{Object.entries(channels).map(([k, v]) => <option key={k} value={k}>{v} {k.charAt(0).toUpperCase() + k.slice(1)}</option>)}</select></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Budget (₹)</label><input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} required style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13, width: 100 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Start</label><input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>End</label><input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }}><option value="planned">Planned</option><option value="active">Active</option><option value="completed">Completed</option></select></div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="submit" style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Create</button>
                <button type="button" onClick={() => setShowAdd(false)} style={{ padding: '6px 14px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>{t('admin.marketing.cancel', 'Cancel')}</button>
              </div>
            </form>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Campaign</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Channel</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Budget</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Spent</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Sent</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Opens</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Clicks</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Conversions</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '10px 12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {data.campaigns.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: '10px 12px' }}>{channels[c.channel] || '📢'} {c.channel}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{c.budget.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{c.spent.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>{c.sent.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>{c.opens.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>{c.clicks.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>{c.conversions}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, background: c.status === 'active' ? '#dcfce7' : c.status === 'completed' ? '#e5e7eb' : '#fef9c3', color: c.status === 'active' ? '#166534' : c.status === 'completed' ? '#6b7280' : '#854d0e', fontSize: 11, fontWeight: 500 }}>{c.status}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <select value={c.status} onChange={e => updateCampaign(c.id, { status: e.target.value })} style={{ padding: '3px 6px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 11 }}>
                      <option value="planned">Planned</option><option value="active">Active</option><option value="completed">Completed</option>
                    </select>
                    <button onClick={() => deleteCampaign(c.id)} style={{ padding: '3px 8px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, marginLeft: 4 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'channels' && (
        <div>
          <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>{data.channels.length} marketing channels</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {data.channels.map(ch => (
              <div key={ch.name} style={{ background: '#fff', padding: 16, borderRadius: 10, border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 18 }}>{ch.icon} <span style={{ fontWeight: 600, fontSize: 14 }}>{ch.name}</span></div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                    {ch.subscribers ? `${ch.subscribers.toLocaleString()} subscribers` : `${ch.impressions.toLocaleString()} impressions/mo`}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Budget: ₹{ch.monthlyBudget?.toLocaleString()}/mo</div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12 }}>
                  <input type="checkbox" checked={ch.active} onChange={e => updateChannel(ch.name, { active: e.target.checked })} />
                  {ch.active ? 'Active' : 'Paused'}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}