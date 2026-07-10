import { useState, useMemo } from 'react';
import useCrmStore from '../../stores/crmStore';
import { useT } from '../../i18n/LanguageProvider';
import { getAllLeads, getLeadSources, getLeadCounts, dedupByPhone, convertToCrmCustomer } from '../../utils/leadIngestion';

export default function AdminCrm() {
  const t = useT();
  const { data, addCustomer, updateCustomer, deleteCustomer, addInteraction, addTask, updateTask, deleteTask, addPipelineStage, deletePipelineStage, updatePipelineStage, reset } = useCrmStore();
  const [tab, setTab] = useState('customers');
  const [search, setSearch] = useState('');
  const [showAddCust, setShowAddCust] = useState(false);
  const [selectedCust, setSelectedCust] = useState(null);
  const [custForm, setCustForm] = useState({ name: '', phone: '', email: '', source: 'website', tags: '', city: '', notes: '' });
  const [showNote, setShowNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showTodo, setShowTodo] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', dueDate: '', priority: 'medium' });
  const [showInteraction, setShowInteraction] = useState(false);
  const [leadSourceFilter, setLeadSourceFilter] = useState('all');
  const [refreshLeads, setRefreshLeads] = useState(0);
  const [intForm, setIntForm] = useState({ type: 'call', summary: '', status: 'completed', customerId: null });
  const [showPipelineStage, setShowPipelineStage] = useState(false);
  const [pipeForm, setPipeForm] = useState({ name: '', value: '0', color: '#e5e7eb' });
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = data.customers.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email?.toLowerCase().includes(q) || c.tags?.some(t => t.includes(q));
  });

  const todayTasks = data.tasks.filter(t => t.status === 'pending');
  const overdueTasks = todayTasks.filter(t => t.dueDate < new Date().toISOString().slice(0, 10));
  const upcomingTasks = todayTasks.filter(t => t.dueDate >= new Date().toISOString().slice(0, 10));

  const handleAddCust = (e) => {
    e.preventDefault();
    addCustomer({
      name: custForm.name, phone: custForm.phone, email: custForm.email, source: custForm.source, city: custForm.city,
      tags: custForm.tags.split(',').map(t => t.trim()).filter(Boolean), notes: custForm.notes,
    });
    setCustForm({ name: '', phone: '', email: '', source: 'website', tags: '', city: '', notes: '' });
    setShowAddCust(false);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    addTask({ title: taskForm.title, dueDate: taskForm.dueDate, priority: taskForm.priority, status: 'pending', assignedTo: 'Admin', customerId: selectedCust?.id || null });
    setTaskForm({ title: '', dueDate: '', priority: 'medium' });
    setShowTodo(false);
  };

  const handleAddInteraction = (e) => {
    e.preventDefault();
    if (!intForm.summary.trim()) return;
    addInteraction({ customerId: selectedCust?.id || intForm.customerId, type: intForm.type, summary: intForm.summary, staff: 'Admin', status: intForm.status });
    setIntForm({ type: 'call', summary: '', status: 'completed', customerId: null });
    setShowInteraction(false);
  };

  const handleAddPipeStage = (e) => {
    e.preventDefault();
    addPipelineStage({ name: pipeForm.name, count: 0, value: +pipeForm.value, color: pipeForm.color });
    setPipeForm({ name: '', value: '0', color: '#e5e7eb' });
    setShowPipelineStage(false);
  };

  const customerInteractions = selectedCust ? data.interactions.filter(i => i.customerId === selectedCust.id) : [];

  const statCard = (label, value, bg, border, color) => (
    <div style={{ background: bg || '#fff', padding: '16px 20px', borderRadius: 10, border: `1px solid ${border || '#e5e7eb'}` }}>
      <div style={{ fontSize: 12, color: color || '#6b7280' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: color || '#111827' }}>{value}</div>
    </div>
  );

  const TabBtn = ({ label, id }) => (
    <button onClick={() => setTab(id)} style={{ padding: '8px 18px', border: 'none', cursor: 'pointer', borderRadius: 6, background: tab === id ? '#6366f1' : '#f3f4f6', color: tab === id ? '#fff' : '#374151', fontWeight: tab === id ? 600 : 400, fontSize: 13 }}>{label}</button>
  );

  const activeCust = data.customers.filter(c => c.status === 'active').length;
  const leadCust = data.customers.filter(c => c.status === 'lead').length;
  const totalRev = data.customers.reduce((s, c) => s + c.totalSpent, 0);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>CRM</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowTodo(true)} style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>+ Add Task</button>
          <button onClick={() => setShowInteraction(true)} style={{ padding: '6px 14px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>+ Log Interaction</button>
          <button onClick={() => setRefreshLeads(n => n + 1)} style={{ padding: '6px 14px', background: '#f3e8ff', color: '#6b21a8', border: '1px solid #d8b4fe', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>⟳ Sync Leads</button>
          <button onClick={reset} style={{ padding: '6px 14px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>Reset</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12, marginBottom: 20 }}>
        {statCard('Total Customers', data.customers.length, '#eff6ff', '#bfdbfe', '#1e40af')}
        {statCard('Active', activeCust, '#f0fdf4', '#bbf7d0', '#166534')}
        {statCard('Leads', leadCust, '#fef9c3', '#fde68a', '#854d0e')}
        {statCard('Total Revenue', '₹' + totalRev.toLocaleString(), '#f5f3ff', '#ddd6fe', '#5b21b6')}
        {statCard('Conversion Rate', data.analytics.conversionRate + '%', '#ecfdf5', '#a7f3d0', '#065f46')}
        {statCard('Pending Tasks', todayTasks.length + overdueTasks.length, '#fef2f2', '#fecaca', '#991b1b')}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <TabBtn label="Customers" id="customers" />
        <TabBtn label="Lead Sources" id="leads" />
        <TabBtn label="Tasks" id="tasks" />
        <TabBtn label="Pipeline" id="pipeline" />
        <TabBtn label="All Interactions" id="interactions" />
      </div>

      {/* ===== CUSTOMERS TAB ===== */}
      {tab === 'customers' && (
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: selectedCust ? 1.4 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 10, flexWrap: 'wrap' }}>
              <input placeholder="Search name, phone, email, tags..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
                <option value="all">All Status</option>
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button onClick={() => setShowAddCust(true)} style={{ padding: '7px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap' }}>+ Add Customer</button>
            </div>

            {showAddCust && (
              <form onSubmit={handleAddCust} style={{ background: '#f9fafb', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid #e5e7eb', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Name*</label><input value={custForm.name} onChange={e => setCustForm({ ...custForm, name: e.target.value })} required style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
                <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Phone*</label><input value={custForm.phone} onChange={e => setCustForm({ ...custForm, phone: e.target.value })} required style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
                <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Email</label><input type="email" value={custForm.email} onChange={e => setCustForm({ ...custForm, email: e.target.value })} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
                <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Source</label><select value={custForm.source} onChange={e => setCustForm({ ...custForm, source: e.target.value })} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }}><option value="website">Website</option><option value="referral">Referral</option><option value="whatsapp">WhatsApp</option><option value="walkin">Walk-in</option><option value="call">Phone Call</option></select></div>
                <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>City</label><input value={custForm.city} onChange={e => setCustForm({ ...custForm, city: e.target.value })} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
                <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Tags (comma-sep)</label><input value={custForm.tags} onChange={e => setCustForm({ ...custForm, tags: e.target.value })} placeholder="regular, family" style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
                <div style={{ width: '100%' }}><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Notes</label><textarea value={custForm.notes} onChange={e => setCustForm({ ...custForm, notes: e.target.value })} rows={2} style={{ width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13, resize: 'vertical' }} /></div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button type="submit" style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Create</button>
                  <button type="button" onClick={() => setShowAddCust(false)} style={{ padding: '6px 14px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
                </div>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filtered.map(c => (
                <div key={c.id} onClick={() => setSelectedCust(c)} style={{ cursor: 'pointer', background: selectedCust?.id === c.id ? '#eef2ff' : '#fff', padding: '10px 14px', borderRadius: 8, border: selectedCust?.id === c.id ? '1px solid #6366f1' : '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{c.phone} {c.email && `| ${c.email}`}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 3, flexWrap: 'wrap' }}>
                      {c.tags?.map(t => <span key={t} style={{ padding: '1px 6px', background: '#e0e7ff', color: '#4338ca', borderRadius: 8, fontSize: 10 }}>{t}</span>)}
                      <span style={{ padding: '1px 6px', borderRadius: 8, background: c.status === 'active' ? '#dcfce7' : '#fef9c3', color: c.status === 'active' ? '#166534' : '#854d0e', fontSize: 10 }}>{c.status}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 600, color: '#059669' }}>₹{c.totalSpent.toLocaleString()}</div>
                    <div>{c.totalOrders} orders</div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>No customers match your search.</div>}
            </div>
          </div>

          {/* Customer Detail Panel */}
          {selectedCust && (
            <div style={{ flex: 1, background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', padding: 20, maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18 }}>{selectedCust.name}</h3>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{selectedCust.phone} {selectedCust.email ? `· ${selectedCust.email}` : ''}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{selectedCust.city} · {selectedCust.source} · Joined {new Date(selectedCust.createdAt).toLocaleDateString()}</div>
                </div>
                <button onClick={() => { const s = prompt('Change status (lead/active/inactive):', selectedCust.status); if (s && ['lead', 'active', 'inactive'].includes(s)) updateCustomer(selectedCust.id, { status: s }); }} style={{ padding: '4px 10px', border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer', fontSize: 11, background: '#fff' }}>{selectedCust.status}</button>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: '#f9fafb', borderRadius: 6 }}>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>Orders</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{selectedCust.totalOrders}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: '#f9fafb', borderRadius: 6 }}>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>Revenue</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#059669' }}>₹{selectedCust.totalSpent.toLocaleString()}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: '#f9fafb', borderRadius: 6 }}>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>Last Order</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedCust.lastOrder || '—'}</div>
                </div>
              </div>

              {selectedCust.tags?.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>TAGS</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {selectedCust.tags.map(t => <span key={t} style={{ padding: '2px 8px', background: '#e0e7ff', color: '#4338ca', borderRadius: 8, fontSize: 11 }}>{t}</span>)}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>NOTES</div>
                <div style={{ background: '#f9fafb', padding: 10, borderRadius: 6, fontSize: 13, minHeight: 30 }}>{selectedCust.notes || 'No notes'}</div>
                <button onClick={() => { const n = prompt('Update notes:', selectedCust.notes || ''); if (n !== null) updateCustomer(selectedCust.id, { notes: n }); }} style={{ marginTop: 4, padding: '3px 8px', background: '#e5e7eb', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>Edit Notes</button>
              </div>

              {/* Follow-up */}
              <div style={{ marginBottom: 12, background: '#fef9c3', padding: 10, borderRadius: 6, border: '1px solid #fde68a' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#854d0e', marginBottom: 4 }}>NEXT FOLLOW-UP</div>
                <div style={{ fontSize: 13 }}><strong>{selectedCust.nextFollowUp || 'Not set'}</strong> — {selectedCust.followUpNote || 'No note'}</div>
                <button onClick={() => { const d = prompt('Follow-up date (YYYY-MM-DD):', selectedCust.nextFollowUp || ''); if (d) { const n = prompt('Follow-up note:', selectedCust.followUpNote || ''); updateCustomer(selectedCust.id, { nextFollowUp: d, followUpNote: n || '' }); } }} style={{ marginTop: 4, padding: '3px 8px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>Update Follow-up</button>
              </div>

              {/* Interactions */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>RECENT INTERACTIONS ({customerInteractions.length})</div>
                {customerInteractions.length === 0 ? (
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>No interactions logged</div>
                ) : (
                  customerInteractions.slice(0, 5).map(i => (
                    <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: 12 }}>
                      <span>{i.type === 'call' ? '' : i.type === 'whatsapp' ? '' : ''} {i.summary}</span>
                      <span style={{ color: '#6b7280', fontSize: 11 }}>{new Date(i.date).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
                <button onClick={() => { setIntForm({ ...intForm, customerId: selectedCust.id }); setShowInteraction(true); }} style={{ marginTop: 6, padding: '3px 8px', background: '#059669', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>+ Log</button>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => deleteCustomer(selectedCust.id) || setSelectedCust(null)} style={{ padding: '6px 12px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Delete Customer</button>
                <button onClick={() => setSelectedCust(null)} style={{ padding: '6px 12px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Close</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== LEAD SOURCES TAB ===== */}
      {tab === 'leads' && (() => {
        const allLeads = getAllLeads();
        const leadCounts = getLeadCounts();
        const crmPhones = new Set(data.customers.map(c => c.phone?.replace(/\D/g, '')));
        const filtered = leadSourceFilter === 'all' ? allLeads : allLeads.filter(l => l.sourceKey === leadSourceFilter);
        const unconverted = l => !crmPhones.has(l.phone?.replace(/\D/g, ''));
        return (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              {Object.entries(leadCounts).map(([label, count]) => (
                <div key={label} style={{ flex: 1, minWidth: 120, background: '#fff', padding: '12px 16px', borderRadius: 8, border: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{count}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button onClick={() => setLeadSourceFilter('all')} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #d1d5db', background: leadSourceFilter === 'all' ? '#6366f1' : '#fff', color: leadSourceFilter === 'all' ? '#fff' : '#374151', cursor: 'pointer', fontSize: 11, fontWeight: 500 }}>All</button>
                {getLeadSources().map(s => (
                  <button key={s.key} onClick={() => setLeadSourceFilter(s.key)} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #d1d5db', background: leadSourceFilter === s.key ? '#6366f1' : '#fff', color: leadSourceFilter === s.key ? '#fff' : '#374151', cursor: 'pointer', fontSize: 11, fontWeight: 500 }}>{s.icon} {s.label}</button>
                ))}
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{filtered.length} leads · {filtered.filter(unconverted).length} unconverted</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {filtered.map((lead, i) => {
                const isConverted = !unconverted(lead);
                return (
                  <div key={lead.id || i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: isConverted ? '#f0fdf4' : '#fff' }}>
                    <span style={{ fontSize: 16 }}>{lead.sourceIcon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{lead.name}</div>
                      <div style={{ fontSize: 11, color: '#6b7280', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span>📞 {lead.phone}</span>
                        {lead.email && <span>✉️ {lead.email}</span>}
                        <span>🔖 {lead.sourceLabel}</span>
                        <span>📅 {new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{lead.query}</div>
                    </div>
                    <div style={{ whiteSpace: 'nowrap' }}>
                      {isConverted ? (
                        <span style={{ padding: '3px 8px', borderRadius: 8, background: '#dcfce7', color: '#166534', fontSize: 11, fontWeight: 500 }}>✓ In CRM</span>
                      ) : (
                        <button onClick={() => { addCustomer(convertToCrmCustomer(lead)); setRefreshLeads(n => n + 1); }} style={{ padding: '5px 12px', borderRadius: 6, background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 500 }}>
                          + Convert to Customer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>No leads from this source.</div>}
            </div>
          </div>
        );
      })()}

      {/* ===== TASKS TAB ===== */}
      {tab === 'tasks' && (
        <div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1, background: '#fef2f2', padding: '12px 16px', borderRadius: 8, border: '1px solid #fecaca' }}>
              <div style={{ fontSize: 12, color: '#991b1b' }}>Overdue</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#7f1d1d' }}>{overdueTasks.length}</div>
            </div>
            <div style={{ flex: 1, background: '#fef9c3', padding: '12px 16px', borderRadius: 8, border: '1px solid #fde68a' }}>
              <div style={{ fontSize: 12, color: '#854d0e' }}>Due Today</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#713f12' }}>{upcomingTasks.filter(t => t.dueDate === new Date().toISOString().slice(0, 10)).length}</div>
            </div>
            <div style={{ flex: 1, background: '#eff6ff', padding: '12px 16px', borderRadius: 8, border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: 12, color: '#1e40af' }}>Upcoming</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1e3a8a' }}>{upcomingTasks.length}</div>
            </div>
            <div style={{ flex: 1, background: '#f0fdf4', padding: '12px 16px', borderRadius: 8, border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: 12, color: '#166534' }}>Completed</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#14532d' }}>{data.tasks.filter(t => t.status === 'completed').length}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, color: '#6b7280' }}>{data.tasks.length} total tasks</div>
            <button onClick={() => setShowTodo(true)} style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>+ Add Task</button>
          </div>

          {showTodo && (
            <form onSubmit={handleAddTask} style={{ background: '#f9fafb', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid #e5e7eb', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 250 }}><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Task Title</label><input value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} required style={{ width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Due Date</label><input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} required style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Priority</label><select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="submit" style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Add</button>
                <button type="button" onClick={() => setShowTodo(false)} style={{ padding: '6px 14px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
              </div>
            </form>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Task</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Priority</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Due Date</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Assigned To</th>
                <th style={{ padding: '10px 12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {data.tasks.map(t => {
                const isOverdue = t.status === 'pending' && t.dueDate < new Date().toISOString().slice(0, 10);
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid #e5e7eb', background: isOverdue ? '#fef2f2' : '#fff' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{t.title}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 8, background: t.priority === 'high' ? '#fee2e2' : t.priority === 'medium' ? '#fef9c3' : '#e5e7eb', color: t.priority === 'high' ? '#991b1b' : t.priority === 'medium' ? '#854d0e' : '#6b7280', fontSize: 11 }}>{t.priority}</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: isOverdue ? '#dc2626' : '#374151', fontWeight: isOverdue ? 600 : 400 }}>{t.dueDate}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <select value={t.status} onChange={e => updateTask(t.id, { status: e.target.value })} style={{ padding: '3px 6px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 11 }}>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>{t.assignedTo}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <button onClick={() => deleteTask(t.id)} style={{ padding: '3px 8px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== PIPELINE TAB ===== */}
      {tab === 'pipeline' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={() => setShowPipelineStage(true)} style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>+ Add Stage</button>
          </div>
          {showPipelineStage && (
            <form onSubmit={handleAddPipeStage} style={{ background: '#f9fafb', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid #e5e7eb', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Stage Name</label><input value={pipeForm.name} onChange={e => setPipeForm({ ...pipeForm, name: e.target.value })} required style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Deal Value (₹)</label><input type="number" value={pipeForm.value} onChange={e => setPipeForm({ ...pipeForm, value: e.target.value })} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13, width: 100 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Color</label><input type="color" value={pipeForm.color} onChange={e => setPipeForm({ ...pipeForm, color: e.target.value })} style={{ padding: '2px', border: '1px solid #d1d5db', borderRadius: 4, width: 50, height: 32 }} /></div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="submit" style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Add</button>
                <button type="button" onClick={() => setShowPipelineStage(false)} style={{ padding: '6px 14px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
              </div>
            </form>
          )}
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12 }}>
            {data.pipelines.map((p, i) => (
              <div key={p.name} style={{ minWidth: 180, background: p.color, padding: 20, borderRadius: 10, border: '1px solid #d1d5db', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                  <button onClick={() => deletePipelineStage(p.name)} style={{ padding: '2px 6px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, color: '#9ca3af' }}>×</button>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{p.count}</div>
                <div style={{ fontSize: 14, color: '#059669', fontWeight: 600 }}>₹{p.value.toLocaleString()}</div>
                {i < data.pipelines.length - 1 && (
                  <div style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: '#d1d5db' }}>→</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, background: '#f9fafb', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb', display: 'flex', gap: 20 }}>
            <div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Total Pipeline Value</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>₹{data.pipelines.reduce((s, p) => s + p.value, 0).toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Total Deals</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{data.pipelines.reduce((s, p) => s + p.count, 0)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Avg Deal Value</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>₹{Math.round(data.pipelines.reduce((s, p) => s + p.value, 0) / Math.max(data.pipelines.reduce((s, p) => s + p.count, 0), 1)).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* ===== ALL INTERACTIONS TAB ===== */}
      {tab === 'interactions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={() => setShowInteraction(true)} style={{ padding: '6px 14px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>+ Log Interaction</button>
          </div>
          {showInteraction && (
            <form onSubmit={handleAddInteraction} style={{ background: '#f0fdf4', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid #bbf7d0', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Type</label><select value={intForm.type} onChange={e => setIntForm({ ...intForm, type: e.target.value })} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }}><option value="call">Call</option><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="meeting">Meeting</option><option value="other">Other</option></select></div>
              <div style={{ flex: 1, minWidth: 200 }}><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Summary</label><input value={intForm.summary} onChange={e => setIntForm({ ...intForm, summary: e.target.value })} required style={{ width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Status</label><select value={intForm.status} onChange={e => setIntForm({ ...intForm, status: e.target.value })} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }}><option value="completed">Completed</option><option value="sent">Sent</option><option value="scheduled">Scheduled</option></select></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Customer ID (optional)</label><input value={intForm.customerId || ''} onChange={e => setIntForm({ ...intForm, customerId: e.target.value || null })} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13, width: 120 }} /></div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="submit" style={{ padding: '6px 14px', background: '#059669', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Log</button>
                <button type="button" onClick={() => setShowInteraction(false)} style={{ padding: '6px 14px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
              </div>
            </form>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Summary</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Customer ID</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Staff</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.interactions.map(i => (
                <tr key={i.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 12px', color: '#6b7280', fontSize: 12 }}>{new Date(i.date).toLocaleDateString()} {new Date(i.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td style={{ padding: '10px 12px' }}>
                    {i.type === 'call' ? '' : i.type === 'whatsapp' ? '' : i.type === 'meeting' ? '' : ''} {i.type}
                  </td>
                  <td style={{ padding: '10px 12px' }}>{i.summary}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12, color: '#6b7280' }}>{i.customerId || '—'}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>{i.staff}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, background: i.status === 'completed' ? '#dcfce7' : i.status === 'sent' ? '#dbeafe' : '#fef9c3', color: i.status === 'completed' ? '#166534' : i.status === 'sent' ? '#1e40af' : '#854d0e', fontSize: 11 }}>{i.status}</span>
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