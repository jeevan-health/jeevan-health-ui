import { useState, useMemo } from 'react';
import useBookingsStore from '../../stores/bookingsStore';

const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };
const sectionCard = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const STATUSES = [
  { value: 'scheduled', label: 'Scheduled', color: '#3b82f6' },
  { value: 'confirmed', label: 'Confirmed', color: '#22c55e' },
  { value: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { value: 'completed', label: 'Completed', color: '#16a34a' },
  { value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
  { value: 'no_show', label: 'No Show', color: '#64748b' },
];

const STATUS_MAP = Object.fromEntries(STATUSES.map(s => [s.value, s]));

function formatDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1]} ${+day}, ${y}`;
}

function todayStr() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }

export default function AdminBookings() {
  const bookings = useBookingsStore(s => s.bookings);
  const timeSlots = useBookingsStore(s => s.timeSlots);
  const addBooking = useBookingsStore(s => s.addBooking);
  const updateBooking = useBookingsStore(s => s.updateBooking);
  const deleteBooking = useBookingsStore(s => s.deleteBooking);

  const [view, setView] = useState('day');
  const [selDate, setSelDate] = useState(todayStr());
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ patientName: '', patientPhone: '', testName: '', doctorName: '', date: todayStr(), timeSlot: '', location: 'Home Collection', address: '', status: 'scheduled', notes: '' });
  const [showSlots, setShowSlots] = useState(false);

  const resetForm = () => setForm({ patientName: '', patientPhone: '', testName: '', doctorName: '', date: todayStr(), timeSlot: '', location: 'Home Collection', address: '', status: 'scheduled', notes: '' });

  const filtered = useMemo(() => {
    let b = bookings;
    if (view === 'day') b = b.filter(x => x.date === selDate);
    if (statusFilter) b = b.filter(x => x.status === statusFilter);
    if (search) { const q = search.toLowerCase(); b = b.filter(x => (x.patientName + x.testName + x.doctorName + x.patientPhone).toLowerCase().includes(q)); }
    return b.sort((a, b2) => (a.timeSlot || '').localeCompare(b2.timeSlot || ''));
  }, [bookings, view, selDate, statusFilter, search]);

  const dayStats = useMemo(() => {
    const d = bookings.filter(x => x.date === selDate);
    return { total: d.length, completed: d.filter(x => x.status === 'completed').length, cancelled: d.filter(x => x.status === 'cancelled' || x.status === 'no_show').length, scheduled: d.filter(x => x.status === 'scheduled' || x.status === 'confirmed').length };
  }, [bookings, selDate]);

  const handleSave = () => {
    if (!form.patientName || !form.date || !form.timeSlot) return;
    if (editingId) { updateBooking(editingId, form); setEditingId(null); }
    else addBooking(form);
    setShowAdd(false);
    resetForm();
  };

  const handleEdit = (b) => {
    setEditingId(b.id);
    setForm({ patientName: b.patientName, patientPhone: b.patientPhone || '', testName: b.testName || '', doctorName: b.doctorName || '', date: b.date, timeSlot: b.timeSlot, location: b.location || 'Home Collection', address: b.address || '', status: b.status, notes: b.notes || '' });
    setShowAdd(true);
  };

  const changeDate = (offset) => {
    const d = new Date(selDate);
    d.setDate(d.getDate() + offset);
    setSelDate(d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>📅 Bookings</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowSlots(true)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>⏰ Time Slots</button>
          <button onClick={() => { setEditingId(null); resetForm(); setShowAdd(true); }} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>+ New Booking</button>
        </div>
      </div>

      {/* Stats + Date Nav */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 120, ...sectionCard, padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{dayStats.total}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Total</div>
        </div>
        <div style={{ flex: 1, minWidth: 120, ...sectionCard, padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#3b82f6' }}>{dayStats.scheduled}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Active</div>
        </div>
        <div style={{ flex: 1, minWidth: 120, ...sectionCard, padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#22c55e' }}>{dayStats.completed}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Completed</div>
        </div>
        <div style={{ flex: 1, minWidth: 120, ...sectionCard, padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#ef4444' }}>{dayStats.cancelled}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Cancelled</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 8, padding: 3 }}>
          {['day', 'week', 'all'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: view === v ? '#fff' : 'transparent', color: view === v ? '#0f172a' : '#64748b', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: view === v ? 600 : 400, boxShadow: view === v ? '0 1px 2px rgba(0,0,0,0.06)' : 'none' }}>{v === 'day' ? 'Day' : v === 'week' ? 'Week' : 'All'}</button>
          ))}
        </div>
        {view !== 'all' && (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <button onClick={() => changeDate(-1)} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>←</button>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', minWidth: 130, textAlign: 'center' }}>{formatDate(selDate)}</span>
            <button onClick={() => changeDate(1)} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>→</button>
            <button onClick={() => setSelDate(todayStr())} style={{ marginLeft: 4, padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#64748b' }}>Today</button>
          </div>
        )}
        <input value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 200, fontSize: 12 }} placeholder="🔍 Search patient/test..." />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: 130, fontSize: 12 }}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Booking List */}
      {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, padding: 40 }}>No bookings found for this view.</p>}
      {filtered.map(b => {
        const st = STATUS_MAP[b.status] || STATUS_MAP['scheduled'];
        return (
          <div key={b.id} style={sectionCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1 }}>
                <div style={{ minWidth: 80, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>{b.timeSlot?.split(' – ')[0] || b.timeSlot}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{b.patientName}</span>
                    {b.patientPhone && <span style={{ fontSize: 11, color: '#94a3b8' }}>{b.patientPhone}</span>}
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: st.color, padding: '2px 8px', borderRadius: 4 }}>{st.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                    {b.testName && <span>🧪 {b.testName}</span>}
                    {b.doctorName && <span style={{ marginLeft: 12 }}>🩺 {b.doctorName}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{b.location}{b.address ? ` — ${b.address}` : ''}</div>
                  {b.notes && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontStyle: 'italic' }}>📝 {b.notes}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                <select value={b.status} onChange={e => updateBooking(b.id, { status: e.target.value })} style={{ fontSize: 11, padding: '3px 6px', borderRadius: 6, border: '1px solid #e2e8f0', fontFamily: 'inherit', background: '#fff' }}>
                  {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <button onClick={() => handleEdit(b)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#3b82f6' }}>Edit</button>
                <button onClick={() => { if (confirm('Delete booking?')) deleteBooking(b.id); }} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#ef4444' }}>Del</button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add/Edit Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => { setShowAdd(false); setEditingId(null); resetForm(); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 480, maxWidth: '90vw', maxHeight: '85vh', overflowY: 'auto' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{editingId ? 'Edit Booking' : 'New Booking'}</h4>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
              <input placeholder="Patient Name *" value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} style={inputStyle} />
              <input placeholder="Patient Phone" value={form.patientPhone} onChange={e => setForm({ ...form, patientPhone: e.target.value })} style={inputStyle} />
              <input placeholder="Test Name" value={form.testName} onChange={e => setForm({ ...form, testName: e.target.value })} style={inputStyle} />
              <input placeholder="Doctor Name (optional)" value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} style={inputStyle} />
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
              <select value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })} style={inputStyle}>
                <option value="">— Select time slot —</option>
                {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inputStyle}>
                <option value="Home Collection">Home Collection</option>
                <option value="Lab Visit">Lab Visit</option>
                <option value="Online Consultation">Online Consultation</option>
                <option value="Clinic Visit">Clinic Visit</option>
              </select>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <input placeholder="Collection/Visit Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ ...inputStyle, marginTop: 10 }} />
            <textarea rows={2} placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, resize: 'vertical', marginTop: 10 }} />
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAdd(false); setEditingId(null); resetForm(); }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>{editingId ? 'Update' : 'Create Booking'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Time Slots Modal */}
      {showSlots && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowSlots(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 400, maxWidth: '90vw' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>⏰ Time Slot Management</h4>
            {timeSlots.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                <input value={s} onChange={e => { const t = [...timeSlots]; t[i] = e.target.value; useBookingsStore.getState().setTimeSlots(t); }} style={inputStyle} />
                <button onClick={() => useBookingsStore.getState().removeTimeSlot(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14, padding: 4 }}>×</button>
              </div>
            ))}
            <button onClick={() => useBookingsStore.getState().addTimeSlot('')} style={{ marginTop: 4, padding: '4px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#64748b' }}>+ Add Slot</button>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSlots(false)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}