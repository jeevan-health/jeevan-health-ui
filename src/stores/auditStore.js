import { create } from 'zustand';

const KEY = 'jh_audit_log';
const PAGE_SIZE = 50;

const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const save = (logs) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(logs));
  } catch (e) {
    // localStorage full — trim oldest entries
    const trimmed = logs.slice(-5000);
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  }
};

let _userCache = '';
const getUser = () => {
  try {
    if (!_userCache) {
      const raw = localStorage.getItem('jh_users');
      if (raw) {
        const users = JSON.parse(raw);
        const phone = localStorage.getItem('jh_user_phone') || '';
        const u = users.find(u => u.phone === phone);
        _userCache = u ? `${u.name || u.phone} (${u.role || 'user'})` : phone;
      } else {
        _userCache = 'unknown';
      }
    }
    return _userCache;
  } catch {
    return 'unknown';
  }
};

const useAuditStore = create((set, get) => ({
  logs: load(),

  log: (action, detail, module = 'general') => {
    const entry = {
      id: 'AUD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase(),
      action,
      detail: typeof detail === 'string' ? detail : JSON.stringify(detail),
      module,
      user: getUser(),
      timestamp: new Date().toISOString(),
    };
    const logs = [entry, ...get().logs].slice(0, 10000);
    save(logs);
    set({ logs });
    return entry;
  },

  getFiltered: ({ search, module, action, startDate, endDate, page = 0 } = {}) => {
    let filtered = get().logs;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(e =>
        (e.user + e.detail + e.action + e.module).toLowerCase().includes(q)
      );
    }
    if (module) filtered = filtered.filter(e => e.module === module);
    if (action) filtered = filtered.filter(e => e.action === action);
    if (startDate) filtered = filtered.filter(e => new Date(e.timestamp) >= new Date(startDate));
    if (endDate) filtered = filtered.filter(e => new Date(e.timestamp) <= new Date(endDate + 'T23:59:59'));
    const total = filtered.length;
    const start = page * PAGE_SIZE;
    return { entries: filtered.slice(start, start + PAGE_SIZE), total, page, pages: Math.ceil(total / PAGE_SIZE) };
  },

  clearLogs: () => {
    if (!window.confirm('Clear all audit logs?')) return;
    save([]);
    set({ logs: [] });
  },

  getModules: () => {
    const modules = new Set(get().logs.map(e => e.module));
    return [...modules].sort();
  },

  getActions: () => {
    const actions = new Set(get().logs.map(e => e.action));
    return [...actions].sort();
  },
}));

export { PAGE_SIZE };
export default useAuditStore;