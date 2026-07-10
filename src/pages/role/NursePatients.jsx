import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/LanguageProvider';
import useAuthStore from '../../stores/authStore';

const THEME = '#0891b2';

const containerStyle = { maxWidth: 800, margin: '0 auto' };
const headerStyle = { fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' };
const subheaderStyle = { fontSize: 12, color: '#64748b', margin: '0 0 16px' };
const searchInputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', outline: 'none' };
const searchInputFocus = { borderColor: THEME };
const pillRowStyle = { display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' };
const cardStyle = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16, transition: 'box-shadow 0.2s' };
const actionBtnStyle = { padding: '6px 14px', borderRadius: 6, border: 'none', fontSize: 12, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' };
const linkStyle = { padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' };

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', color: '#0891b2', bg: '#ecfeff', border: '#0891b2' },
  in_progress: { label: 'In Progress', color: '#F59E0B', bg: '#fffbeb', border: '#F59E0B' },
  completed: { label: 'Completed', color: '#22C55E', bg: '#f0fdf4', border: '#22C55E' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#fef2f2', border: '#EF4444' },
};

const SERVICE_ICONS = {
  'wound-care': '🩹', 'injections': '💉', 'elderly-care': '👴',
  'post-surgery': '🏥', 'mother-baby': '👶', 'bedside': '🛏️', 'rehab': '💪',
};

function getServiceIcon(service) {
  const s = (service || '').toLowerCase();
  for (const [key, icon] of Object.entries(SERVICE_ICONS)) {
    if (s.includes(key) || key.includes(s)) return icon;
  }
  return '🩺';
}

function formatDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return d; }
}

function formatTime(t) {
  if (!t) return '—';
  try {
    if (t.includes(':')) {
      const [h, m] = t.split(':').map(Number);
      const ampm = h >= 12 ? 'PM' : 'AM';
      return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
    }
    return t;
  } catch { return t; }
}

function loadBookings() { try { return JSON.parse(localStorage.getItem('jh_nursing_bookings') || '[]'); } catch { return []; } }

function loadOrders() { try { return JSON.parse(localStorage.getItem('jh_orders') || '[]'); } catch { return []; } }

export default function NursePatients() {
  const t = useT();
  const user = useAuthStore(s => s.user);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [bookings, setBookings] = useState(() => loadBookings());
  const [orders, setOrders] = useState(() => loadOrders());
  const [careNotes, setCareNotes] = useState({});

  useEffect(() => {
    const handleStorage = () => {
      setBookings(loadBookings());
      setOrders(loadOrders());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);

  const unifiedPatients = useMemo(() => {
    const map = {};
    const userName = user?.name || '';
    const userPhone = user?.phone || '';

    bookings.forEach(b => {
      if (b.nurseName !== userName && b.nursePhone !== userPhone) return;
      const id = b.id || 'bk-' + Math.random().toString(36).slice(2, 8);
      map[id] = {
        id,
        source: 'booking',
        patientName: b.patientName || b.name || t('role.nursePatients.unknown', 'Unknown'),
        phone: b.phone || b.patientPhone || '',
        address: b.address || b.patientAddress || '',
        service: b.service || b.serviceType || b.category || '',
        serviceCategory: b.category || b.serviceType || '',
        scheduledDate: b.date || b.scheduledDate || b.collectionDate || '',
        scheduledTime: b.time || b.scheduledTime || b.collectionTime || '',
        status: b.status || 'confirmed',
        notes: b.notes || b.medicalNotes || '',
        vitalSigns: b.vitalSigns || null,
        followUp: b.followUp || null,
        createdAt: b.createdAt || '',
        gender: b.gender || '',
        age: b.age || '',
      };
    });

    orders.forEach(o => {
      if (o.assignedNurse !== userName && o.nursePhone !== userPhone) return;
      const id = o.id || 'ord-' + Math.random().toString(36).slice(2, 8);
      if (!map[id]) {
        const pi = o.patientInfo || {};
        map[id] = {
          id,
          source: 'order',
          patientName: pi.name || o.bookedFor || t('role.nursePatients.unknown', 'Unknown'),
          phone: pi.phone || '',
          address: pi.address || o.collectionAddress || '',
          service: 'Diagnostics',
          serviceCategory: 'diagnostics',
          scheduledDate: o.collectionDate || '',
          scheduledTime: o.collectionTime || '',
          status: o.status || 'confirmed',
          notes: (o.notes || []).map(n => n.text).join('; ') || '',
          vitalSigns: null,
          followUp: null,
          createdAt: o.createdAt || '',
          gender: pi.gender || '',
          age: pi.age || '',
        };
      }
    });

    return Object.values(map);
  }, [bookings, orders, user, t]);

  const filtered = useMemo(() => {
    let list = unifiedPatients;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.patientName.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.service.toLowerCase().includes(q)
      );
    }
    if (statusFilter === 'today') {
      list = list.filter(p => p.scheduledDate === todayStr);
    } else if (statusFilter === 'active') {
      list = list.filter(p => p.status !== 'completed' && p.status !== 'cancelled');
    } else if (statusFilter === 'completed') {
      list = list.filter(p => p.status === 'completed' || p.status === 'cancelled');
    }
    return list;
  }, [unifiedPatients, search, statusFilter, todayStr]);

  function updateBookingStatus(patientId, newStatus) {
    const items = loadBookings();
    const idx = items.findIndex(b => b.id === patientId);
    if (idx >= 0) {
      items[idx].status = newStatus;
      localStorage.setItem('jh_nursing_bookings', JSON.stringify(items));
      setBookings(items);
      return;
    }
    const ords = loadOrders();
    const oidx = ords.findIndex(o => o.id === patientId);
    if (oidx >= 0) {
      ords[oidx].status = newStatus;
      localStorage.setItem('jh_orders', JSON.stringify(ords));
      setOrders(ords);
    }
  }

  function toggleExpand(id) {
    setExpandedId(prev => prev === id ? null : id);
  }

  function handleCareNoteChange(patientId, field, value) {
    setCareNotes(prev => ({
      ...prev,
      [patientId]: { ...(prev[patientId] || {}), [field]: value },
    }));
  }

  function saveCareNotes(patientId) {
    const note = careNotes[patientId];
    if (!note) return;
    const items = loadBookings();
    const idx = items.findIndex(b => b.id === patientId);
    if (idx >= 0) {
      items[idx].vitalSigns = note.vitalSigns || items[idx].vitalSigns || '';
      items[idx].serviceNotes = note.serviceNotes || items[idx].serviceNotes || '';
      items[idx].followUp = { needed: !!note.followUpNeeded, date: note.followUpDate || '' };
      localStorage.setItem('jh_nursing_bookings', JSON.stringify(items));
      setBookings(items);
      setCareNotes(prev => { const n = { ...prev }; delete n[patientId]; return n; });
    }
  }

  const pills = [
    { key: 'all', label: t('role.nursePatients.pillAll', 'All') },
    { key: 'today', label: t('role.nursePatients.pillToday', 'Today') },
    { key: 'active', label: t('role.nursePatients.pillActive', 'Active') },
    { key: 'completed', label: t('role.nursePatients.pillCompleted', 'Completed') },
  ];

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>{t('role.nursePatients.title', '👤 My Patients')}</h2>
      <p style={subheaderStyle}>{t('role.nursePatients.subtitle', 'Manage your assigned nursing and diagnostic patients')}</p>

      <div style={{ marginBottom: 12 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={searchInputStyle}
          onFocus={e => { e.target.style.borderColor = THEME; }}
          onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
          placeholder={t('role.nursePatients.searchPlaceholder', 'Search by patient name, phone, or service...')}
        />
      </div>

      <div style={pillRowStyle}>
        {pills.map(p => {
          const active = statusFilter === p.key;
          return (
            <button
              key={p.key}
              onClick={() => setStatusFilter(p.key)}
              style={{
                padding: '6px 16px', borderRadius: 20, border: active ? 'none' : '1px solid #e2e8f0',
                background: active ? THEME : '#fff', color: active ? '#fff' : '#64748b',
                cursor: 'pointer', fontSize: 12, fontWeight: active ? 600 : 400, fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {p.label}
              {p.key !== 'all' && (
                <span style={{ marginLeft: 4, opacity: 0.8 }}>
                  ({unifiedPatients.filter(px =>
                    p.key === 'today' ? px.scheduledDate === todayStr :
                    p.key === 'active' ? (px.status !== 'completed' && px.status !== 'cancelled') :
                    p.key === 'completed' ? (px.status === 'completed' || px.status === 'cancelled') : true
                  ).length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>🩺</div>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 4px' }}>
            {t('role.nursePatients.emptyTitle', 'No patients found')}
          </p>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
            {search || statusFilter !== 'all'
              ? t('role.nursePatients.emptyFilter', 'Try adjusting your search or filter')
              : t('role.nursePatients.emptyAssign', 'You have no assigned patients yet')}
          </p>
        </div>
      )}

      {filtered.map(p => {
        const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.confirmed;
        const isExpanded = expandedId === p.id;
        const isToday = p.scheduledDate === todayStr;

        return (
          <div
            key={p.id}
            style={{ ...cardStyle, borderLeft: `4px solid ${cfg.border}`, boxShadow: isExpanded ? '0 2px 12px rgba(0,0,0,0.06)' : 'none' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
                  {p.patientName}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {p.phone && <span>📞 {p.phone}</span>}
                  {p.gender && <span>· {p.gender}</span>}
                  {p.age && <span>· {p.age}y</span>}
                  {p.source === 'order' && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: '#f1f5f9', color: '#64748b' }}>Diagnostics</span>}
                </div>
                {p.address && (
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    📍 {p.address}
                  </div>
                )}
              </div>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: cfg.bg, color: cfg.color, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {t(`role.nursePatients.status.${p.status}`, cfg.label)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#475569', marginBottom: 6 }}>
              <span>{SERVICE_ICONS[p.serviceCategory] || getServiceIcon(p.service)} {p.service || t('role.nursePatients.generalCare', 'General Care')}</span>
              {p.scheduledDate && <span>· 📅 {formatDate(p.scheduledDate)}</span>}
              {p.scheduledTime && <span>· 🕐 {formatTime(p.scheduledTime)}</span>}
            </div>

            {p.notes && !isExpanded && (
              <div style={{ fontSize: 12, color: '#64748b', background: '#f8fafc', borderRadius: 6, padding: '6px 10px', marginBottom: 10 }}>
                📝 {p.notes.length > 80 ? p.notes.slice(0, 80) + '...' : p.notes}
              </div>
            )}

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
              {p.status === 'confirmed' && isToday && (
                <button
                  onClick={() => updateBookingStatus(p.id, 'in_progress')}
                  style={{ ...actionBtnStyle, background: THEME, color: '#fff' }}
                >
                  ▶ {t('role.nursePatients.startVisit', 'Start Visit')}
                </button>
              )}
              <button
                onClick={() => toggleExpand(p.id)}
                style={{ ...actionBtnStyle, background: '#f1f5f9', color: '#475569' }}
              >
                {isExpanded ? '▲ ' : '▼ '}
                {t('role.nursePatients.viewDetails', 'View Details')}
              </button>
              {p.phone && (
                <>
                  <a href={`tel:${p.phone}`} style={{ ...linkStyle, background: '#f0fdf4', color: '#16a34a' }}>
                    📞 {t('role.nursePatients.call', 'Call')}
                  </a>
                  <a
                    href={`https://wa.me/${p.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...linkStyle, background: '#f0fdf4', color: '#16a34a' }}
                  >
                    💬 {t('role.nursePatients.whatsapp', 'WhatsApp')}
                  </a>
                </>
              )}
              {(p.status === 'confirmed' || p.status === 'in_progress') && (
                <button
                  onClick={() => updateBookingStatus(p.id, 'completed')}
                  style={{ ...actionBtnStyle, background: '#f0fdf4', color: '#22C55E', border: '1px solid #22C55E' }}
                >
                  ✅ {t('role.nursePatients.markComplete', 'Mark Complete')}
                </button>
              )}
            </div>

            {isExpanded && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
                  {t('role.nursePatients.careNotes', '📋 Care Notes')}
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: '#475569', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    {t('role.nursePatients.vitalSigns', 'Vital Signs')}
                  </label>
                  <textarea
                    value={careNotes[p.id]?.vitalSigns || p.vitalSigns || ''}
                    onChange={e => handleCareNoteChange(p.id, 'vitalSigns', e.target.value)}
                    style={{ ...searchInputStyle, minHeight: 50, resize: 'vertical', fontFamily: 'inherit' }}
                    placeholder={t('role.nursePatients.vitalSignsPlaceholder', 'BP, Heart Rate, Temp, SpO2...')}
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: '#475569', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    {t('role.nursePatients.serviceNotes', 'Service Notes')}
                  </label>
                  <textarea
                    value={careNotes[p.id]?.serviceNotes || p.serviceNotes || ''}
                    onChange={e => handleCareNoteChange(p.id, 'serviceNotes', e.target.value)}
                    style={{ ...searchInputStyle, minHeight: 50, resize: 'vertical', fontFamily: 'inherit' }}
                    placeholder={t('role.nursePatients.serviceNotesPlaceholder', 'Observations, procedures performed, patient response...')}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={careNotes[p.id]?.followUpNeeded || false}
                      onChange={e => handleCareNoteChange(p.id, 'followUpNeeded', e.target.checked)}
                      style={{ accentColor: THEME }}
                    />
                    {t('role.nursePatients.followUpNeeded', 'Follow-up needed')}
                  </label>
                  <input
                    type="date"
                    value={careNotes[p.id]?.followUpDate || ''}
                    onChange={e => handleCareNoteChange(p.id, 'followUpDate', e.target.value)}
                    style={{ ...searchInputStyle, width: 'auto', padding: '4px 8px', fontSize: 11 }}
                  />
                </div>

                <button
                  onClick={() => saveCareNotes(p.id)}
                  style={{ ...actionBtnStyle, background: THEME, color: '#fff' }}
                >
                  {t('role.nursePatients.saveNotes', 'Save Care Notes')}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
