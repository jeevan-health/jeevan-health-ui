import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CAMP_KEY = 'jh_vaccination_camps';

export default function VaccineCamps() {
  const [camps, setCamps] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', organizer: '', date: '', time: '', venue: '', city: '',
    vaccines: '', capacity: 50, description: '', contact: '',
  });

  useEffect(() => {
    try { setCamps(JSON.parse(localStorage.getItem(CAMP_KEY) || '[]')); } catch { setCamps([]); }
  }, []);

  const persist = (list) => {
    setCamps(list);
    localStorage.setItem(CAMP_KEY, JSON.stringify(list));
  };

  const registerCamp = () => {
    if (!form.name || !form.date || !form.venue) return;
    const camp = { ...form, id: 'camp-' + Date.now().toString(36), registered: 0, status: 'Upcoming' };
    persist([...camps, camp]);
    setForm({ name: '', organizer: '', date: '', time: '', venue: '', city: '', vaccines: '', capacity: 50, description: '', contact: '' });
    setShowForm(false);
  };

  const deleteCamp = (id) => {
    if (!confirm('Delete this camp?')) return;
    persist(camps.filter(c => c.id !== id));
  };

  const updateStatus = (id, status) => {
    persist(camps.map(c => c.id === id ? { ...c, status } : c));
  };

  const Field = ({ label, value, onChange, type = 'text', placeholder }) => (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
    </div>
  );

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #dc2626 0%, #dc2626cc 100%)', padding: '28px 0 32px' }}>
        <div className="container">
          <Link to="/vaccination" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>← Back to Vaccination</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>📍</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>Vaccination Camps</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '2px 0 0' }}>Organize and register for vaccination camps in your area</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)}
            style={{ marginTop: 12, padding: '10px 24px', borderRadius: 8, border: 'none', background: '#fff', color: '#dc2626', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ Organize Camp</button>
        </div>
      </div>

      <div className="page-section container" style={{ paddingTop: 20 }}>
        {showForm && (
          <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', marginBottom: 16, maxWidth: 600 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>Register a Vaccination Camp</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
              <Field label="Camp Name *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
              <Field label="Organizer" value={form.organizer} onChange={v => setForm(f => ({ ...f, organizer: v }))} />
              <Field label="Date *" type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />
              <Field label="Time" type="time" value={form.time} onChange={v => setForm(f => ({ ...f, time: v }))} />
              <Field label="Venue *" value={form.venue} onChange={v => setForm(f => ({ ...f, venue: v }))} placeholder="Auditorium, school, etc." />
              <Field label="City" value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} />
              <Field label="Vaccines Offered" value={form.vaccines} onChange={v => setForm(f => ({ ...f, vaccines: v }))} placeholder="e.g. Flu, COVID, Typhoid" />
              <Field label="Capacity" type="number" value={form.capacity} onChange={v => setForm(f => ({ ...f, capacity: Number(v) }))} />
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Additional details..."
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
              </div>
              <Field label="Contact Number" value={form.contact} onChange={v => setForm(f => ({ ...f, contact: v }))} placeholder="Phone number" />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={registerCamp} style={{ padding: '8px 24px', borderRadius: 6, border: 'none', background: '#dc2626', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Register Camp</button>
              <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Cancel</button>
            </div>
          </div>
        )}

        {camps.length === 0 && !showForm ? (
          <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>📍</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>No Vaccination Camps</h3>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Organize a camp or check back later for camps in your area.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {camps.slice().reverse().map(camp => (
              <div key={camp.id} style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 18 }}>📍</span>
                      <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#0f172a' }}>{camp.name}</h3>
                      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: camp.status === 'Completed' ? '#dcfce7' : camp.status === 'Ongoing' ? '#fef3c7' : '#dbeafe', color: camp.status === 'Completed' ? '#166534' : camp.status === 'Ongoing' ? '#92400e' : '#1e40af' }}>{camp.status || 'Upcoming'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#64748b', flexWrap: 'wrap' }}>
                      <span>📅 {camp.date}{camp.time ? ` · ${camp.time}` : ''}</span>
                      <span>📍 {camp.venue}{camp.city ? `, ${camp.city}` : ''}</span>
                      <span>👥 {camp.registered || 0} / {camp.capacity} registered</span>
                      {camp.vaccines && <span>💉 {camp.vaccines}</span>}
                    </div>
                    {camp.description && <p style={{ fontSize: 11, color: '#475569', margin: '6px 0 0', lineHeight: 1.4 }}>{camp.description}</p>}
                    {camp.organizer && <p style={{ fontSize: 10, color: '#94a3b8', margin: '4px 0 0' }}>By: {camp.organizer} {camp.contact ? `· ${camp.contact}` : ''}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
                    <button onClick={() => updateStatus(camp.id, camp.status === 'Upcoming' ? 'Ongoing' : camp.status === 'Ongoing' ? 'Completed' : 'Upcoming')}
                      style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: '#1866C9', color: '#fff', cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit' }}>
                      Mark {camp.status === 'Upcoming' ? 'Ongoing' : camp.status === 'Ongoing' ? 'Completed' : 'Upcoming'}
                    </button>
                    <button onClick={() => deleteCamp(camp.id)}
                      style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
