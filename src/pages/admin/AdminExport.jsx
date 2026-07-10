import { useState, useMemo } from 'react';
import { useT } from '../../i18n/LanguageProvider';
import useAdminStore from '../../stores/adminStore';
import useBookingsStore from '../../stores/bookingsStore';
import usePatientsStore from '../../stores/patientsStore';
import useDoctorsStore from '../../stores/doctorsStore';
import useInventoryStore from '../../stores/inventoryStore';
import useAuthStore from '../../stores/authStore';
import useAuditStore from '../../stores/auditStore';
import { getOrders } from '../../services/localOrderService';

const MODULES = [
  { id: 'orders', label: 'Orders', icon: '📋', color: '#0f172a', getter: () => getOrders(), cols: ['id', 'patientName', 'patientPhone', 'testName', 'totalAmount', 'status', 'createdAt', 'updatedAt'] },
  { id: 'bookings', label: 'Bookings', icon: '📅', color: '#7c3aed', getter: () => useBookingsStore.getState().bookings, cols: ['id', 'patientName', 'patientPhone', 'testName', 'date', 'time', 'status', 'createdAt'] },
  { id: 'patients', label: 'Patients', icon: '👤', color: '#0891b2', getter: () => usePatientsStore.getState().patients, cols: ['id', 'name', 'phone', 'email', 'gender', 'dob', 'bloodGroup', 'city', 'tags', 'createdAt'] },
  { id: 'doctors', label: 'Doctors', icon: '🩺', color: '#059669', getter: () => useDoctorsStore.getState().doctors, cols: ['id', 'name', 'phone', 'email', 'specializations', 'qualification', 'experience', 'fee', 'isActive', 'createdAt'] },
  { id: 'inventory', label: 'Inventory', icon: '📦', color: '#a16207', getter: () => useInventoryStore.getState().items, cols: ['id', 'name', 'category', 'sku', 'quantity', 'minStock', 'unit', 'costPerUnit', 'supplier', 'createdAt'] },
  { id: 'users', label: 'Users', icon: '👥', color: '#dc2626', getter: () => useAuthStore.getState().getUsers(), cols: ['id', 'name', 'phone', 'email', 'role', 'createdAt', 'updatedAt'] },
  { id: 'audit', label: 'Audit Log', icon: '📋', color: '#4f46e5', getter: () => useAuditStore.getState().logs, cols: ['id', 'action', 'detail', 'module', 'user', 'timestamp'] },
];

const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', background: '#fff' };
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

function toCSV(data, columns) {
  const header = columns.join(',');
  const rows = data.map(row => {
    return columns.map(col => {
      let val = row[col];
      if (Array.isArray(val)) val = val.join('; ');
      if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
      if (val === null || val === undefined) val = '';
      val = String(val).replace(/"/g, '""');
      if (val.includes(',') || val.includes('"') || val.includes('\n')) val = `"${val}"`;
      return val;
    }).join(',');
  });
  return '\uFEFF' + [header, ...rows].join('\n');
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toISOString().slice(0, 10);
}

export default function AdminExport() {
  const t = useT();
  const [selected, setSelected] = useState('orders');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');
  const [exported, setExported] = useState(false);

  const module = MODULES.find(m => m.id === selected);
  const allData = module?.getter() || [];
  const dateField = module?.cols.includes('createdAt') ? 'createdAt' : module?.cols.includes('timestamp') ? 'timestamp' : null;

  const filtered = useMemo(() => {
    let data = allData;
    if (startDate && dateField) data = data.filter(r => new Date(r[dateField]) >= new Date(startDate));
    if (endDate && dateField) data = data.filter(r => new Date(r[dateField]) <= new Date(endDate + 'T23:59:59'));
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(r => module.cols.some(c => String(r[c] || '').toLowerCase().includes(q)));
    }
    return data;
  }, [allData, startDate, endDate, search, module]);

  const handleExport = () => {
    const csv = toCSV(filtered, module.cols);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadCSV(csv, `jeevan-${module.id}-${dateStr}.csv`);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const stats = [
    { label: 'Total Records', value: allData.length, color: '#0f172a' },
    { label: 'Filtered', value: filtered.length, color: module?.color || '#64748b' },
    { label: 'Columns', value: module?.cols.length || 0, color: '#0891b2' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>📤 Data Export</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Export any module to CSV with date range filtering</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: 16 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, padding: 14, textAlign: 'center', marginBottom: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{(s.value || 0).toLocaleString()}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={selected} onChange={e => { setSelected(e.target.value); setExported(false); }} style={{ ...inputStyle, width: 160, fontSize: 12, fontWeight: 600 }}>
          {MODULES.map(m => <option key={m.id} value={m.id}>{m.icon} {m.label}</option>)}
        </select>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ ...inputStyle, width: 140, fontSize: 12 }} placeholder="From" />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ ...inputStyle, width: 140, fontSize: 12 }} placeholder="To" />
        <input value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 180, fontSize: 12 }} placeholder={`🔍 Filter ${module?.label}...`} />
        <div style={{ flex: 1 }} />
        <button onClick={handleExport} disabled={filtered.length === 0} style={{
          padding: '10px 24px', borderRadius: 8, border: 'none', background: filtered.length === 0 ? '#e2e8f0' : '#0f172a', color: filtered.length === 0 ? '#94a3b8' : '#fff', cursor: filtered.length === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ⬇ Export CSV {filtered.length > 0 ? `(${filtered.length.toLocaleString()} rows)` : ''}
        </button>
      </div>

      {exported && (
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 16px', marginBottom: 12, fontSize: 12, color: '#166534', fontWeight: 600 }}>
          ✓ CSV exported successfully! Check your downloads.
        </div>
      )}

      {/* Preview */}
      <div style={card}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>
          {module.icon} {module.label} — Preview ({filtered.length > 100 ? 'Showing first 100 of ' + filtered.length.toLocaleString() : filtered.length} rows)
        </h4>
        {filtered.length === 0 && (
          <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', padding: 20 }}>No data matches your filters.</p>
        )}
        {filtered.length > 0 && (
          <div style={{ overflowX: 'auto', fontSize: 11 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {module.cols.map(c => <th key={c} style={{ padding: '6px 8px', borderBottom: '2px solid #e2e8f0', color: '#0f172a', fontWeight: 700, textAlign: 'left', whiteSpace: 'nowrap', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 100).map((row, i) => (
                  <tr key={row.id || i}>
                    {module.cols.map(c => (
                      <td key={c} style={{ padding: '5px 8px', borderBottom: '1px solid #f1f5f9', color: '#475569', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {Array.isArray(row[c]) ? row[c].join('; ') : typeof row[c] === 'object' && row[c] !== null ? JSON.stringify(row[c]) : String(row[c] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}