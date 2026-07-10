import { useState, useMemo } from 'react';
import { useT } from '../../i18n/LanguageProvider';
import useAuditStore, { PAGE_SIZE } from '../../stores/auditStore';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 12 };
const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff' };

const ACTION_COLORS = {
  login: { bg: '#dbeafe', text: '#1d4ed8' },
  logout: { bg: '#f1f5f9', text: '#64748b' },
  create: { bg: '#dcfce7', text: '#16a34a' },
  update: { bg: '#fef3c7', text: '#d97706' },
  delete: { bg: '#fee2e2', text: '#dc2626' },
  assign: { bg: '#ede9fe', text: '#7c3aed' },
  upload: { bg: '#e0f2fe', text: '#0284c7' },
  approve: { bg: '#f0fdf4', text: '#15803d' },
  refund: { bg: '#fff1f2', text: '#e11d48' },
  reschedule: { bg: '#f5f3ff', text: '#6d28d9' },
  status_change: { bg: '#fff7ed', text: '#f97316' },
  export: { bg: '#ecfdf5', text: '#059669' },
  permission: { bg: '#fdf2f8', text: '#db2777' },
};

const getActionColor = (action) => {
  for (const [key, val] of Object.entries(ACTION_COLORS)) {
    if (action.toLowerCase().includes(key)) return val;
  }
  return { bg: '#f1f5f9', text: '#64748b' };
};

const formatTime = (ts) => {
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

export default function AdminAuditLog() {
  const t = useT();
  const log = useAuditStore(s => s.log);
  const getFiltered = useAuditStore(s => s.getFiltered);
  const clearLogs = useAuditStore(s => s.clearLogs);
  const getModules = useAuditStore(s => s.getModules);
  const getActions = useAuditStore(s => s.getActions);
  const logs = useAuditStore(s => s.logs);

  const [search, setSearch] = useState('');
  const [module, setModule] = useState('');
  const [action, setAction] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);

  const modules = useMemo(getModules, [logs]);
  const actions = useMemo(getActions, [logs]);

  const result = useMemo(() => getFiltered({ search, module, action, startDate, endDate, page }), [search, module, action, startDate, endDate, page, logs]);

  const testLog = () => {
    const testActions = ['login', 'create', 'update', 'delete', 'assign', 'upload', 'approve', 'refund', 'reschedule', 'status_change', 'export', 'permission'];
    const testModules = ['orders', 'users', 'bookings', 'reports', 'inventory', 'cms', 'permissions', 'patients', 'doctors'];
    log(testActions[Math.floor(Math.random() * testActions.length)], 'Test entry from admin panel', testModules[Math.floor(Math.random() * testModules.length)]);
  };

  const todayCount = useMemo(() => logs.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length, [logs]);
  const uniqueUsers = useMemo(() => new Set(logs.map(e => e.user)).size, [logs]);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>📋 Audit Log</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>System-wide activity tracking</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={testLog} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#64748b' }}>+ Test Entry</button>
          <button onClick={clearLogs} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#ef4444' }}>Clear All</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 14, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{logs.length.toLocaleString()}</div><div style={{ fontSize: 11, color: '#64748b' }}>Total Entries</div></div>
        <div style={{ ...card, padding: 14, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 22, fontWeight: 800, color: '#2563eb' }}>{todayCount}</div><div style={{ fontSize: 11, color: '#64748b' }}>Today</div></div>
        <div style={{ ...card, padding: 14, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 22, fontWeight: 800, color: '#7c3aed' }}>{uniqueUsers}</div><div style={{ fontSize: 11, color: '#64748b' }}>Unique Users</div></div>
        <div style={{ ...card, padding: 14, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 22, fontWeight: 800, color: '#059669' }}>{modules.length}</div><div style={{ fontSize: 11, color: '#64748b' }}>Modules</div></div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} style={{ ...inputStyle, width: 180, fontSize: 12 }} placeholder="🔍 Search user, action..." />
        <select value={module} onChange={e => { setModule(e.target.value); setPage(0); }} style={{ ...inputStyle, width: 130, fontSize: 12 }}>
          <option value="">All Modules</option>
          {modules.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={action} onChange={e => { setAction(e.target.value); setPage(0); }} style={{ ...inputStyle, width: 130, fontSize: 12 }}>
          <option value="">All Actions</option>
          {actions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPage(0); }} style={{ ...inputStyle, width: 130, fontSize: 12 }} />
        <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPage(0); }} style={{ ...inputStyle, width: 130, fontSize: 12 }} />
        {(search || module || action || startDate || endDate) && (
          <button onClick={() => { setSearch(''); setModule(''); setAction(''); setStartDate(''); setEndDate(''); setPage(0); }} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#f1f5f9', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', color: '#64748b' }}>Clear</button>
        )}
        <div style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>{result.total} result{result.total !== 1 ? 's' : ''}</div>
      </div>

      {/* Timeline */}
      {result.entries.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 40 }}>No audit entries found.</p>}

      {result.entries.map((e, i) => {
        const colors = getActionColor(e.action);
        return (
          <div key={e.id || i} style={{ ...card, padding: 14, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.text, marginTop: 6, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{e.action}</span>
                  <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>· {e.module}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 6 }}>{e.id}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: colors.bg, color: colors.text, fontWeight: 600, textTransform: 'uppercase' }}>{e.action}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>{formatTime(e.timestamp)}</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{e.detail}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{e.user}</div>
            </div>
          </div>
        );
      })}

      {/* Pagination */}
      {result.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 16 }}>
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer', fontSize: 12, fontFamily: 'inherit', color: page === 0 ? '#cbd5e1' : '#64748b' }}>Prev</button>
          <span style={{ padding: '6px 12px', fontSize: 12, color: '#64748b' }}>Page {page + 1} of {result.pages}</span>
          <button disabled={page >= result.pages - 1} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: page >= result.pages - 1 ? 'not-allowed' : 'pointer', fontSize: 12, fontFamily: 'inherit', color: page >= result.pages - 1 ? '#cbd5e1' : '#64748b' }}>Next</button>
        </div>
      )}
    </div>
  );
}