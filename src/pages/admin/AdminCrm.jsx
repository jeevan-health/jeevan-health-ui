import { useState } from 'react';
import useCrmStore from '../../stores/crmStore';

export default function AdminCrm() {
  const { data, addCustomer, updateCustomer, deleteCustomer, addInteraction, updatePipeline } = useCrmStore();
  const [tab, setTab] = useState('customers');
  const [search, setSearch] = useState('');
  const [showAddCust, setShowAddCust] = useState(false);
  const [custForm, setCustForm] = useState({ name: '', phone: '', email: '', source: 'website', tags: '' });

  const filtered = data.customers.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email?.toLowerCase().includes(q);
  });

  const handleAddCust = (e) => {
    e.preventDefault();
    addCustomer({ name: custForm.name, phone: custForm.phone, email: custForm.email, source: custForm.source, tags: custForm.tags.split(',').map(t => t.trim()).filter(Boolean) });
    setCustForm({ name: '', phone: '', email: '', source: 'website', tags: '' });
    setShowAddCust(false);
  };

  const renderTab = (label, key) => (
    <button onClick={() => setTab(key)} style={{ padding: '8px 16px', border: 'none', cursor: 'pointer', borderRadius: 4, background: tab === key ? '#6366f1' : '#e5e7eb', color: tab === key ? '#fff' : '#374151', fontWeight: tab === key ? 600 : 400, fontSize: 13 }}>{label}</button>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 20 }}>🤝 CRM</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {renderTab('Customers', 'customers')}
        {renderTab('Pipeline', 'pipeline')}
        {renderTab('Interactions', 'interactions')}
      </div>

      {tab === 'customers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 10 }}>
            <input placeholder="Search by name, phone, email..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, maxWidth: 400, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }} />
            <div style={{ fontSize: 14, color: '#6b7280' }}>{filtered.length} customers</div>
            <button onClick={() => setShowAddCust(true)} style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>+ Add Customer</button>
          </div>
          {showAddCust && (
            <form onSubmit={handleAddCust} style={{ background: '#f9fafb', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid #e5e7eb', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Name</label><input value={custForm.name} onChange={e => setCustForm({ ...custForm, name: e.target.value })} required style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Phone</label><input value={custForm.phone} onChange={e => setCustForm({ ...custForm, phone: e.target.value })} required style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Email</label><input type="email" value={custForm.email} onChange={e => setCustForm({ ...custForm, email: e.target.value })} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Source</label><select value={custForm.source} onChange={e => setCustForm({ ...custForm, source: e.target.value })} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }}><option value="website">Website</option><option value="referral">Referral</option><option value="whatsapp">WhatsApp</option><option value="walkin">Walk-in</option><option value="call">Phone Call</option></select></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Tags (comma-separated)</label><input value={custForm.tags} onChange={e => setCustForm({ ...custForm, tags: e.target.value })} placeholder="regular, family" style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="submit" style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Add</button>
                <button type="button" onClick={() => setShowAddCust(false)} style={{ padding: '6px 14px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
              </div>
            </form>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Customer</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Phone</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Source</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Orders</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Spent</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Last Order</th>
                <th style={{ padding: '10px 12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{c.email}</div>
                    {c.tags?.map(t => <span key={t} style={{ display: 'inline-block', padding: '1px 6px', background: '#e0e7ff', color: '#4338ca', borderRadius: 8, fontSize: 10, marginRight: 2 }}>{t}</span>)}
                  </td>
                  <td style={{ padding: '10px 12px' }}>{c.phone}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12 }}>{c.source}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, background: c.status === 'active' ? '#dcfce7' : '#fef9c3', color: c.status === 'active' ? '#166534' : '#854d0e', fontSize: 11, fontWeight: 500 }}>{c.status}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>{c.totalOrders}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{c.totalSpent.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#6b7280', fontSize: 12 }}>{c.lastOrder || '—'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <select value={c.status} onChange={e => updateCustomer(c.id, { status: e.target.value })} style={{ padding: '3px 6px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 11, marginRight: 4 }}>
                      <option value="lead">Lead</option><option value="active">Active</option><option value="inactive">Inactive</option>
                    </select>
                    <button onClick={() => deleteCustomer(c.id)} style={{ padding: '3px 8px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'pipeline' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {data.pipelines.map(p => (
              <div key={p.name} style={{ background: '#fff', padding: 20, borderRadius: 10, border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{p.name}</div>
                <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0' }}>{p.count}</div>
                <div style={{ fontSize: 14, color: '#059669', fontWeight: 600 }}>₹{p.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, background: '#f9fafb', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Total Deal Value</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>₹{data.pipelines.reduce((s, p) => s + p.value, 0).toLocaleString()}</div>
          </div>
        </div>
      )}

      {tab === 'interactions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={() => {
              const type = prompt('Type (call/whatsapp/email):', 'call');
              if (!type) return;
              const summary = prompt('Summary:');
              if (!summary) return;
              addInteraction({ type, summary, staff: 'Admin' });
            }} style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>+ Log Interaction</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Summary</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Staff</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.interactions.map(i => (
                <tr key={i.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 12px', color: '#6b7280', fontSize: 12 }}>{i.date}</td>
                  <td style={{ padding: '10px 12px' }}>{i.type === 'call' ? '📞' : i.type === 'whatsapp' ? '💬' : '✉️'} {i.type}</td>
                  <td style={{ padding: '10px 12px' }}>{i.summary}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>{i.staff}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, background: i.status === 'completed' ? '#dcfce7' : i.status === 'sent' ? '#dbeafe' : '#fee2e2', color: i.status === 'completed' ? '#166534' : i.status === 'sent' ? '#1e40af' : '#991b1b', fontSize: 11 }}>{i.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}