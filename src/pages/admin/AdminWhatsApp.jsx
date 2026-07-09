import { useState } from 'react';
import useWhatsAppStore from '../../stores/whatsappStore';

export default function AdminWhatsApp() {
  const { data, addTemplate, updateTemplate, deleteTemplate, sendMessage, reset } = useWhatsAppStore();
  const [tab, setTab] = useState('templates');
  const [showAddTmpl, setShowAddTmpl] = useState(false);
  const [tmplForm, setTmplForm] = useState({ name: '', label: '', category: 'utility', content: '' });
  const [showSend, setShowSend] = useState(false);
  const [sendForm, setSendForm] = useState({ to: '', template: '' });

  const handleAddTmpl = (e) => {
    e.preventDefault();
    addTemplate({ name: tmplForm.name, label: tmplForm.label, category: tmplForm.category, content: tmplForm.content, status: 'pending' });
    setTmplForm({ name: '', label: '', category: 'utility', content: '' });
    setShowAddTmpl(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage({ to: sendForm.to, template: sendForm.template, status: 'sent', delivered: false, read: false });
    setSendForm({ to: '', template: '' });
    setShowSend(false);
  };

  const renderTab = (label, key) => (
    <button onClick={() => setTab(key)} style={{ padding: '8px 16px', border: 'none', cursor: 'pointer', borderRadius: 4, background: tab === key ? '#6366f1' : '#e5e7eb', color: tab === key ? '#fff' : '#374151', fontWeight: tab === key ? 600 : 400, fontSize: 13 }}>{label}</button>
  );

  const statStyle = (bg, border, color) => ({ background: bg, padding: 20, borderRadius: 10, border: `1px solid ${border}` });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>💬 WhatsApp Manager</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowSend(true)} style={{ padding: '6px 14px', background: '#25d366', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>Send Message</button>
          <button onClick={reset} style={{ padding: '6px 14px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>Reset</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {renderTab('Templates', 'templates')}
        {renderTab('Sent Messages', 'messages')}
        {renderTab('Analytics', 'analytics')}
      </div>

      {showSend && (
        <form onSubmit={handleSend} style={{ background: '#f0fdf4', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid #bbf7d0', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Phone Number</label><input value={sendForm.to} onChange={e => setSendForm({ ...sendForm, to: e.target.value })} required placeholder="9876543210" style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
          <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Template</label><select value={sendForm.template} onChange={e => setSendForm({ ...sendForm, template: e.target.value })} required style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }}>
            <option value="">Select template</option>
            {data.templates.filter(t => t.status === 'approved').map(t => <option key={t.id} value={t.name}>{t.label}</option>)}
          </select></div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="submit" style={{ padding: '6px 14px', background: '#25d366', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Send</button>
            <button type="button" onClick={() => setShowSend(false)} style={{ padding: '6px 14px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
          </div>
        </form>
      )}

      {tab === 'templates' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, color: '#6b7280' }}>{data.templates.length} templates</div>
            <button onClick={() => setShowAddTmpl(true)} style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>+ New Template</button>
          </div>
          {showAddTmpl && (
            <form onSubmit={handleAddTmpl} style={{ background: '#f9fafb', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid #e5e7eb', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Template Name (snake_case)</label><input value={tmplForm.name} onChange={e => setTmplForm({ ...tmplForm, name: e.target.value })} required placeholder="order_confirmation" style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Display Label</label><input value={tmplForm.label} onChange={e => setTmplForm({ ...tmplForm, label: e.target.value })} required placeholder="Order Confirmation" style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Category</label><select value={tmplForm.category} onChange={e => setTmplForm({ ...tmplForm, category: e.target.value })} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }}><option value="utility">Utility</option><option value="marketing">Marketing</option></select></div>
              <div style={{ width: '100%' }}><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Template Content</label><textarea value={tmplForm.content} onChange={e => setTmplForm({ ...tmplForm, content: e.target.value })} required rows={3} style={{ width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13, resize: 'vertical' }} /></div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="submit" style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Create</button>
                <button type="button" onClick={() => setShowAddTmpl(false)} style={{ padding: '6px 14px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
              </div>
            </form>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Template</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Label</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Content</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '10px 12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {data.templates.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12 }}>{t.name}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{t.label}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12 }}>{t.category}</td>
                  <td style={{ padding: '10px 12px', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: '#6b7280' }} title={t.content}>{t.content}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, background: t.status === 'approved' ? '#dcfce7' : t.status === 'pending' ? '#fef9c3' : '#fee2e2', color: t.status === 'approved' ? '#166534' : t.status === 'pending' ? '#854d0e' : '#991b1b', fontSize: 11, fontWeight: 500 }}>{t.status}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <select value={t.status} onChange={e => updateTemplate(t.id, { status: e.target.value })} style={{ padding: '3px 6px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 11, marginRight: 4 }}>
                      <option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
                    </select>
                    <button onClick={() => deleteTemplate(t.id)} style={{ padding: '3px 8px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'messages' && (
        <div>
          <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>{data.messages.length} recent messages</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>To</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Template</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Sent At</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Delivered</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Read</th>
                <th style={{ padding: '10px 12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {data.messages.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{m.to}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12 }}>{m.template}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>{m.sentAt}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, background: m.status === 'sent' ? '#dbeafe' : '#fee2e2', color: m.status === 'sent' ? '#1e40af' : '#991b1b', fontSize: 11 }}>{m.status}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>{m.delivered ? '✅' : '❌'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>{m.read ? '👁️' : '—'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    {m.error && <span style={{ fontSize: 11, color: '#dc2626' }}>{m.error}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          <div style={statStyle('#eff6ff', '#bfdbfe', '#1e40af')}>
            <div style={{ fontSize: 12, color: '#1e40af' }}>Total Sent</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1e3a8a' }}>{data.analytics.totalSent.toLocaleString()}</div>
          </div>
          <div style={statStyle('#f0fdf4', '#bbf7d0', '#166534')}>
            <div style={{ fontSize: 12, color: '#166534' }}>Delivered</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#14532d' }}>{data.analytics.delivered.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: '#16a34a' }}>{data.analytics.totalSent ? Math.round(data.analytics.delivered / data.analytics.totalSent * 100) : 0}% rate</div>
          </div>
          <div style={statStyle('#f5f3ff', '#ddd6fe', '#5b21b6')}>
            <div style={{ fontSize: 12, color: '#5b21b6' }}>Read</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#4c1d95' }}>{data.analytics.read.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: '#7c3aed' }}>{data.analytics.delivered ? Math.round(data.analytics.read / data.analytics.delivered * 100) : 0}% read rate</div>
          </div>
          <div style={statStyle('#fef2f2', '#fecaca', '#991b1b')}>
            <div style={{ fontSize: 12, color: '#991b1b' }}>Failed</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#7f1d1d' }}>{data.analytics.failed.toLocaleString()}</div>
          </div>
          <div style={statStyle('#fefce8', '#fde68a', '#854d0e')}>
            <div style={{ fontSize: 12, color: '#854d0e' }}>Opt-outs</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#713f12' }}>{data.analytics.optOuts.toLocaleString()}</div>
          </div>
          <div style={statStyle('#ecfdf5', '#a7f3d0', '#065f46')}>
            <div style={{ fontSize: 12, color: '#065f46' }}>This Month</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#064e3b' }}>{data.analytics.monthlySent.toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
}