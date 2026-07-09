import { useState, useEffect } from 'react';
import { getPhlebotomists, savePhlebotomist, deletePhlebotomist, getOrders } from '../../services/localOrderService';

const AREAS = ['All Areas', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'Gurgaon', 'Noida', 'Ghaziabad', 'Faridabad'];

const STATUS_OPTIONS = { available: '#22c55e', busy: '#f59e0b', offline: '#94a3b8' };

export default function AdminCollection() {
  const [phlebotomists, setPhlebotomists] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('collectors');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({ name: '', phone: '', email: '', areas: '', status: 'available' });

  const refresh = () => { setPhlebotomists(getPhlebotomists()); setOrders(getOrders()); };
  useEffect(() => { refresh(); }, []);

  const activeOrders = orders.filter(o => o.phlebotomist && o.status !== 'completed' && o.status !== 'cancelled');

  const handleSave = () => {
    if (!form.name || !form.phone) return;
    const data = {
      ...form,
      id: editing ? editing.id : 'PH-' + Date.now().toString(36).toUpperCase(),
      assignedJobs: editing ? editing.assignedJobs : 0,
    };
    savePhlebotomist(data);
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', phone: '', email: '', areas: '', status: 'available' });
    refresh();
  };

  const handleEdit = (p) => { setEditing(p); setForm({ name: p.name, phone: p.phone, email: p.email || '', areas: p.areas || '', status: p.status || 'available' }); setShowForm(true); };

  const handleDelete = (id) => { if (confirm('Delete this collector?')) { deletePhlebotomist(id); refresh(); } };

  const allAreas = [...new Set([...phlebotomists.flatMap(p => (p.areas || '').split(',').map(a => a.trim()).filter(Boolean)), 'Delhi', 'Gurgaon', 'Noida'])];

  const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <TabBtn active={tab === 'collectors'} onClick={() => setTab('collectors')}>Collectors ({phlebotomists.length})</TabBtn>
        <TabBtn active={tab === 'routes'} onClick={() => setTab('routes')}>Routes & Tracking</TabBtn>
        <TabBtn active={tab === 'areas'} onClick={() => setTab('areas')}>Service Areas</TabBtn>
      </div>

      {/* Collectors Tab */}
      {tab === 'collectors' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#64748b' }}>{phlebotomists.filter(p => p.status === 'available').length} available, {phlebotomists.filter(p => p.status === 'busy').length} busy, {phlebotomists.filter(p => p.status === 'offline').length} offline</div>
            <button onClick={() => { setEditing(null); setForm({ name: '', phone: '', email: '', areas: '', status: 'available' }); setShowForm(true); }}
              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              + Add Collector
            </button>
          </div>
          {phlebotomists.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>No collectors added yet</div>
          ) : (
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
              {phlebotomists.map(p => {
                const assigned = activeOrders.filter(o => o.phlebotomist?.name === p.name).length;
                return (
                  <div key={p.id} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#4338ca' }}>{p.name[0]}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>{p.phone}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => handleEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: 12 }}>Edit</button>
                        <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 12 }}>Del</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 12 }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: `${STATUS_OPTIONS[p.status] || '#94a3b8'}20`, color: STATUS_OPTIONS[p.status] || '#475569', fontSize: 11 }}>{p.status}</span>
                      <span style={{ color: '#64748b' }}>Jobs: {assigned}</span>
                      {p.email && <span style={{ color: '#64748b' }}>{p.email}</span>}
                    </div>
                    {p.areas && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>Areas: {p.areas}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Routes Tab */}
      {tab === 'routes' && (
        <div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>{activeOrders.length} active collections assigned</div>
          {phlebotomists.filter(p => p.status !== 'offline').length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>No active collectors</div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {phlebotomists.filter(p => p.status !== 'offline').map(p => {
                const assignedOrders = activeOrders.filter(o => o.phlebotomist?.name === p.name);
                return (
                  <div key={p.id} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#2563eb' }}>{p.name[0]}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{p.name}</div>
                          <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: `${STATUS_OPTIONS[p.status]}20`, color: STATUS_OPTIONS[p.status], marginLeft: 0 }}>{p.status}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{assignedOrders.length} routes</span>
                    </div>
                    {assignedOrders.length === 0 ? (
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>No assignments yet</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {assignedOrders.map(o => (
                          <div key={o.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 8, fontSize: 12 }}>
                            <span style={{ fontWeight: 600, color: '#0f172a', minWidth: 140 }}>{o.id}</span>
                            <span style={{ color: '#64748b', flex: 1 }}>{o.collectionAddress?.split(',').slice(0, 2).join(',') || '—'}</span>
                            <span style={{ color: '#3b82f6', fontWeight: 600 }}>{o.collectionDate} {o.collectionTime}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Areas Tab */}
      {tab === 'areas' && (
        <div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Service coverage areas</div>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {AREAS.filter(a => a !== 'All Areas').map(area => {
              const collectors = phlebotomists.filter(p => (p.areas || '').toLowerCase().includes(area.toLowerCase()));
              return (
                <div key={area} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', marginBottom: 8 }}>{area}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    {collectors.length > 0 ? (
                      collectors.map(c => (
                        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                          <span>{c.name}</span>
                          <span style={{ padding: '1px 6px', borderRadius: 10, fontSize: 10, fontWeight: 600, background: `${STATUS_OPTIONS[c.status]}20`, color: STATUS_OPTIONS[c.status] }}>{c.status}</span>
                        </div>
                      ))
                    ) : (
                      <span style={{ color: '#94a3b8' }}>No collectors assigned</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add/Edit Collector Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowForm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 400, maxWidth: '90vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{editing ? 'Edit Collector' : 'Add Collector'}</h4>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              <input placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
              <input placeholder="Email (optional)" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              <input placeholder="Service Areas (comma separated)" value={form.areas} onChange={e => setForm({ ...form, areas: e.target.value })} style={inputStyle} />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>
                {editing ? 'Update' : 'Add Collector'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: '8px 16px', borderRadius: 8, border: active ? 'none' : '1px solid #e2e8f0', background: active ? '#0f172a' : '#fff', color: active ? '#fff' : '#64748b', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: active ? 600 : 400 }}>
      {children}
    </button>
  );
}
