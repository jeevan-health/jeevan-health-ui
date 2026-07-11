import { create } from 'zustand';
import useAuditStore from './auditStore';
import * as authService from '../services/authService';

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

function setTokens(accessToken, refreshToken) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('jh_token', accessToken);
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('jh_token');
}

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: !!(localStorage.getItem('jh_token') || localStorage.getItem('accessToken')),
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
    try {
      const { data } = await authService.sendOtp(phone, 'phone');
      localStorage.setItem('jh_user_phone', phone);
      set({ isLoading: false });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  verifyOtp: async (phone, otp) => {
    set({ isLoading: true });
    try {
      const { data } = await authService.verifyOtp(phone, otp);
      const { user, accessToken, refreshToken } = data;
      localStorage.setItem('jh_user', JSON.stringify(user));
      localStorage.setItem('jh_user_phone', phone);
      setTokens(accessToken, refreshToken);
      set({ user, isAuthenticated: true, isLoading: false });
      registerUser(user);
      useAuditStore.getState().log('login', `User verified OTP and logged in: ${user.name} (${phone})`, 'auth');
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  googleLogin: async (credential) => {
    set({ isLoading: true });
    try {
      const { data } = await authService.googleLogin(credential);
      const { user, accessToken, refreshToken } = data;
      localStorage.setItem('jh_user', JSON.stringify(user));
      setTokens(accessToken, refreshToken);
      set({ user, isAuthenticated: true, isLoading: false });
      registerUser(user);
      useAuditStore.getState().log('login', `User logged in via Google: ${user.name} (${user.email})`, 'auth');
      return true;
    } catch (err) {
      set({ isLoading: false });
      return false;
    }
  },

  fetchProfile: async () => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('jh_token');
      if (!token) return;
      const { data } = await authService.getProfile();
      const enriched = { ...data, role: data.role || ADMINS[data.phone] || ADMINS[data.email] || 'user' };
      localStorage.setItem('jh_user', JSON.stringify(enriched));
      set({ user: enriched, isAuthenticated: true });
    } catch {
      const stored = localStorage.getItem('jh_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const enriched = { ...parsed, role: parsed.role || ADMINS[parsed.phone] || 'user' };
          set({ user: enriched, isAuthenticated: true });
        } catch { /* noop */ }
      }
    }
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
    const u = get().user;
    useAuditStore.getState().log('logout', `User logged out: ${u?.name || u?.phone || 'unknown'}`, 'auth');
    clearTokens();
    localStorage.removeItem('jh_user');
    localStorage.removeItem('jh_user_phone');
    set({ user: null, isAuthenticated: false });
  },

  // Admin helpers
  getUsers: () => loadUsers(),

  updateUserRole: (userId, role) => {
    const users = loadUsers();
    const u = users.find(x => x.id === userId);
    if (u) { u.role = role; u.updatedAt = new Date().toISOString(); saveUsers(users); }
    useAuditStore.getState().log('update', `User role updated: ${u?.name || userId} → ${role}`, 'users');
  },

  deleteUser: (userId) => {
    const users = loadUsers();
    const u = users.find(x => x.id === userId);
    saveUsers(users.filter(u => u.id !== userId));
    useAuditStore.getState().log('delete', `User deleted: ${u?.name || u?.phone || userId}`, 'users');
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
    useAuditStore.getState().log('create', `User created: ${user.name} (${user.phone}) as ${user.role}`, 'users');
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
