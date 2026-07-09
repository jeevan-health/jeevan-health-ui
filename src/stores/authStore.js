import { create } from 'zustand';

const ADMINS = { '9999999999': 'super_admin' };

const loadUsers = () => { try { return JSON.parse(localStorage.getItem('jh_users') || '[]'); } catch { return []; } };
const saveUsers = (users) => localStorage.setItem('jh_users', JSON.stringify(users));

function registerUser(user) {
  const users = loadUsers();
  const idx = users.findIndex(u => u.id === user.id || u.phone === user.phone);
  if (idx >= 0) { users[idx] = { ...users[idx], ...user, updatedAt: new Date().toISOString() }; }
  else { users.unshift({ ...user, role: 'user', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); }
  saveUsers(users);
}

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('jh_token'),
  isLoading: false,
  family: [],
  addresses: [],

  setUser: (user) => {
    const enriched = { ...user, role: user.role || (ADMINS[user.phone] || ADMINS[user.email]) || 'user' };
    set({ user: enriched, isAuthenticated: true });
    registerUser(enriched);
  },

  login: async (phone) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 500));
    const user = { id: Date.now().toString(), phone, name: phone === '9999999999' ? 'Super Admin' : 'User', email: '', role: ADMINS[phone] || 'user' };
    localStorage.setItem('jh_token', 'mock-token');
    localStorage.setItem('jh_user', JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
    registerUser(user);
  },

  verifyOtp: async (phone, otp) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 500));
    const user = { id: Date.now().toString(), phone, name: phone === '9999999999' ? 'Super Admin' : 'User', email: '', role: ADMINS[phone] || 'user' };
    localStorage.setItem('jh_token', 'mock-token');
    localStorage.setItem('jh_user', JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
    registerUser(user);
    return true;
  },

  googleLogin: async () => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 1200));
    const user = {
      id: 'google_' + Date.now(),
      name: 'Ashwin Kumar',
      email: 'ashwin.kumar@gmail.com',
      phone: '+91 98765 43210',
      avatar: null,
      provider: 'google',
      role: 'user',
    };
    localStorage.setItem('jh_token', 'mock-token-google');
    localStorage.setItem('jh_user', JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
    registerUser(user);
    return true;
  },

  fetchProfile: async () => {
    try {
      const stored = localStorage.getItem('jh_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const enriched = { ...parsed, role: parsed.role || ADMINS[parsed.phone] || 'user' };
        set({ user: enriched, isAuthenticated: true });
      }
    } catch { /* noop */ }
  },

  addFamilyMember: (member) => {
    const fam = [...get().family, { ...member, id: Date.now().toString() }];
    set({ family: fam });
    localStorage.setItem('jh_family', JSON.stringify(fam));
  },

  addAddress: (addr) => {
    const addrs = [...get().addresses, { ...addr, id: Date.now().toString() }];
    set({ addresses: addrs });
    localStorage.setItem('jh_addresses', JSON.stringify(addrs));
  },

  logout: () => {
    localStorage.removeItem('jh_token');
    localStorage.removeItem('jh_user');
    set({ user: null, isAuthenticated: false });
  },

  // Admin helpers
  getUsers: () => loadUsers(),

  updateUserRole: (userId, role) => {
    const users = loadUsers();
    const u = users.find(x => x.id === userId);
    if (u) { u.role = role; u.updatedAt = new Date().toISOString(); saveUsers(users); }
  },

  deleteUser: (userId) => {
    saveUsers(loadUsers().filter(u => u.id !== userId));
  },

  addUser: (userData) => {
    const user = {
      id: 'USR-' + Date.now().toString(36).toUpperCase(),
      name: userData.name || '',
      phone: userData.phone || '',
      email: userData.email || '',
      role: userData.role || 'staff',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    registerUser(user);
    return user;
  },
}));

const stored = localStorage.getItem('jh_user');
if (stored) {
  try {
    const parsed = JSON.parse(stored);
    const enriched = { ...parsed, role: parsed.role || ADMINS[parsed.phone] || 'user' };
    useAuthStore.getState().setUser(enriched);
  } catch { /* noop */ }
}
const fam = localStorage.getItem('jh_family');
if (fam) {
  try { useAuthStore.getState().family = JSON.parse(fam); } catch { /* noop */ }
}
const addrs = localStorage.getItem('jh_addresses');
if (addrs) {
  try { useAuthStore.getState().addresses = JSON.parse(addrs); } catch { /* noop */ }
}

export default useAuthStore;
