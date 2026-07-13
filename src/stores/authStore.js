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

function setTokens(accessToken, refreshToken, userId) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('jh_token', accessToken);
  if (userId != null) localStorage.setItem('jh_auth_uid', String(userId));
}

function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('jh_token');
  localStorage.removeItem('jh_auth_uid');
}

/** Bound session user id — detects multi-tab login swaps */
function getSessionUserId() {
  return localStorage.getItem('jh_auth_uid');
}

function mapFamilyFromApi(m) {
  if (!m) return null;
  const relationMap = {
    spouse: 'Spouse', child: 'Child', parent: 'Parent', sibling: 'Sibling', other: 'Other',
  };
  const genderMap = { male: 'Male', female: 'Female', other: 'Other' };
  const rel = (m.relation || '').toLowerCase();
  const gen = (m.gender || '').toLowerCase();
  let age = m.age;
  if (age == null && m.dob) {
    try {
      const birth = new Date(m.dob);
      const today = new Date();
      age = today.getFullYear() - birth.getFullYear();
      const md = today.getMonth() - birth.getMonth();
      if (md < 0 || (md === 0 && today.getDate() < birth.getDate())) age -= 1;
    } catch { age = ''; }
  }
  return {
    id: m.id,
    name: m.name,
    relation: relationMap[rel] || m.relation || 'Other',
    gender: genderMap[gen] || m.gender || '',
    age: age ?? '',
    dob: m.dob || null,
    bloodGroup: m.bloodGroup || '--',
    lastCheckup: m.lastCheckup || 'N/A',
    abhaId: m.abhaId || '',
    address: m.address || {},
  };
}

function mapRelationToApi(relation) {
  const r = (relation || '').toLowerCase();
  if (['spouse', 'wife', 'husband'].includes(r)) return 'spouse';
  if (['child', 'son', 'daughter'].includes(r)) return 'child';
  if (['parent', 'father', 'mother'].includes(r)) return 'parent';
  if (r === 'sibling') return 'sibling';
  return 'other';
}

function mapGenderToApi(gender) {
  const g = (gender || '').toLowerCase();
  if (g === 'male' || g === 'm') return 'male';
  if (g === 'female' || g === 'f') return 'female';
  if (g) return 'other';
  return undefined;
}

function ageToDob(age) {
  if (age == null || age === '') return null;
  const n = parseInt(age, 10);
  if (isNaN(n) || n < 0 || n > 120) return null;
  const d = new Date();
  d.setFullYear(d.getFullYear() - n);
  return d.toISOString().slice(0, 10);
}

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: !!(localStorage.getItem('jh_token') || localStorage.getItem('accessToken')),
  isLoading: false,
  family: [],
  addresses: [],

  setUser: (user) => {
    const enriched = {
      ...user,
      role: user.role || (ADMINS[user.phone] || ADMINS[user.email]) || 'user',
      bloodGroup: user.bloodGroup || user.blood_group || user.bloodGroup || '',
      dob: user.dob || '',
      gender: user.gender || '',
    };
    if (enriched.id != null) localStorage.setItem('jh_auth_uid', String(enriched.id));
    set({ user: enriched, isAuthenticated: true });
    registerUser(enriched);
  },

  /** Send OTP — type: 'phone' | 'email' */
  login: async (identifier, type = 'phone') => {
    set({ isLoading: true });
    try {
      const { data } = await authService.sendOtp(identifier, type);
      if (type === 'phone') localStorage.setItem('jh_user_phone', data.identifier || identifier);
      if (type === 'email') localStorage.setItem('jh_user_email', data.identifier || identifier);
      set({ isLoading: false });
      return { ok: true, data };
    } catch (err) {
      set({ isLoading: false });
      return {
        ok: false,
        error: err?.response?.data?.error || err?.response?.data?.message || 'Failed to send OTP',
        retryAfter: err?.response?.data?.retryAfter,
      };
    }
  },

  /** Verify OTP for phone or email identifier */
  verifyOtp: async (identifier, otp, type) => {
    set({ isLoading: true });
    try {
      const { data } = await authService.verifyOtp(identifier, otp, type);
      const { user, accessToken, refreshToken } = data;
      localStorage.setItem('jh_user', JSON.stringify(user));
      if (user?.phone) localStorage.setItem('jh_user_phone', user.phone);
      if (user?.email) localStorage.setItem('jh_user_email', user.email);
      setTokens(accessToken, refreshToken, user?.id);
      localStorage.setItem('jh_user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
      registerUser(user);
      useAuditStore.getState().log(
        'login',
        `User verified OTP: ${user.name || user.phone || user.email}`,
        'auth'
      );
      get().fetchFamily();
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
      setTokens(accessToken, refreshToken, user?.id);
      set({ user, isAuthenticated: true, isLoading: false });
      registerUser(user);
      useAuditStore.getState().log('login', `User logged in via Google: ${user.name} (${user.email})`, 'auth');
      get().fetchFamily();
      return true;
    } catch {
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

      const addr = data.address;
      if (addr && typeof addr === 'object') {
        if (Array.isArray(addr.list)) {
          set({ addresses: addr.list });
        } else if (addr.addressLine || addr.line1 || addr.city) {
          set({ addresses: [{ id: 'primary', ...addr }] });
        }
      }
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

  updateProfile: async (updates) => {
    // Guard multi-tab: only update the session that owns this store user
    const sessionUid = getSessionUserId();
    const currentId = get().user?.id;
    if (sessionUid && currentId != null && String(sessionUid) !== String(currentId)) {
      const err = new Error('Session changed in another tab. Please refresh and try again.');
      err.code = 'SESSION_MISMATCH';
      throw err;
    }

    // Never send role / id from client body for elevation
    const payload = {
      name: updates.name,
      phone: updates.phone,
      email: updates.email,
      dob: updates.dob || null,
      gender: updates.gender,
      bloodGroup: updates.bloodGroup || updates.blood_group || null,
    };
    const { data } = await authService.updateProfile(payload);
    const enriched = {
      ...get().user,
      ...data,
      role: data.role || get().user?.role || 'user',
      bloodGroup: data.bloodGroup || data.blood_group || '',
    };
    if (enriched.id != null) localStorage.setItem('jh_auth_uid', String(enriched.id));
    localStorage.setItem('jh_user', JSON.stringify(enriched));
    set({ user: enriched });
    return enriched;
  },

  /** Sync auth when another tab logs in / out (shared localStorage). */
  hydrateFromStorage: () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('jh_token');
    if (!token) {
      set({ user: null, isAuthenticated: false, family: [], addresses: [] });
      return;
    }
    try {
      const stored = localStorage.getItem('jh_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const enriched = {
          ...parsed,
          role: parsed.role || ADMINS[parsed.phone] || ADMINS[parsed.email] || 'user',
        };
        if (parsed.id != null) localStorage.setItem('jh_auth_uid', String(parsed.id));
        set({ user: enriched, isAuthenticated: true });
      }
    } catch { /* ignore */ }
  },

  fetchFamily: async () => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('jh_token');
      if (!token) return;
      const { data } = await authService.getFamilyMembers();
      const list = (Array.isArray(data) ? data : []).map(mapFamilyFromApi).filter(Boolean);
      set({ family: list });
      localStorage.setItem('jh_family', JSON.stringify(list));
    } catch {
      const fam = localStorage.getItem('jh_family');
      if (fam) {
        try { set({ family: JSON.parse(fam) }); } catch { /* noop */ }
      }
    }
  },

  addFamilyMember: async (member) => {
    try {
      const payload = {
        name: member.name,
        relation: mapRelationToApi(member.relation),
        gender: mapGenderToApi(member.gender),
        dob: member.dob || ageToDob(member.age),
      };
      const { data } = await authService.addFamilyMember(payload);
      const mapped = mapFamilyFromApi(data);
      const fam = [...get().family, mapped];
      set({ family: fam });
      localStorage.setItem('jh_family', JSON.stringify(fam));
      return mapped;
    } catch {
      const fam = [...get().family, { ...member, id: Date.now().toString() }];
      set({ family: fam });
      localStorage.setItem('jh_family', JSON.stringify(fam));
      return fam[fam.length - 1];
    }
  },

  updateFamilyMember: async (id, updates) => {
    try {
      const payload = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.relation !== undefined) payload.relation = mapRelationToApi(updates.relation);
      if (updates.gender !== undefined) payload.gender = mapGenderToApi(updates.gender);
      if (updates.age !== undefined || updates.dob !== undefined) {
        payload.dob = updates.dob || ageToDob(updates.age);
      }
      const { data } = await authService.updateFamilyMember(id, payload);
      const mapped = mapFamilyFromApi(data);
      const fam = get().family.map(m => String(m.id) === String(id) ? mapped : m);
      set({ family: fam });
      localStorage.setItem('jh_family', JSON.stringify(fam));
      return mapped;
    } catch {
      const fam = get().family.map(m => String(m.id) === String(id) ? { ...m, ...updates } : m);
      set({ family: fam });
      localStorage.setItem('jh_family', JSON.stringify(fam));
    }
  },

  deleteFamilyMember: async (id) => {
    try {
      await authService.deleteFamilyMember(id);
    } catch { /* still remove locally */ }
    const fam = get().family.filter(m => String(m.id) !== String(id));
    set({ family: fam });
    localStorage.setItem('jh_family', JSON.stringify(fam));
  },

  addAddress: async (addr) => {
    const addrs = [...get().addresses, { ...addr, id: addr.id || Date.now().toString() }];
    set({ addresses: addrs });
    localStorage.setItem('jh_addresses', JSON.stringify(addrs));
    try {
      await authService.updateProfile({ address: { list: addrs } });
    } catch { /* offline ok */ }
  },

  logout: () => {
    const u = get().user;
    useAuditStore.getState().log('logout', `User logged out: ${u?.name || u?.phone || 'unknown'}`, 'auth');
    clearTokens();
    localStorage.removeItem('jh_user');
    localStorage.removeItem('jh_user_phone');
    set({ user: null, isAuthenticated: false, family: [], addresses: [] });
  },

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
    saveUsers(users.filter(x => x.id !== userId));
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
  try { useAuthStore.setState({ family: JSON.parse(fam) }); } catch { /* noop */ }
}
const addrs = localStorage.getItem('jh_addresses');
if (addrs) {
  try { useAuthStore.setState({ addresses: JSON.parse(addrs) }); } catch { /* noop */ }
}

// Multi-tab: when admin logs in tab A and patient in tab B, tokens are shared.
// Rehydrate (or clear) so UI never edits the wrong account silently.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (!e.key) return;
    if (['accessToken', 'jh_token', 'jh_user', 'refreshToken', 'jh_auth_uid'].includes(e.key)) {
      useAuthStore.getState().hydrateFromStorage();
      // Hard refresh if identity flipped mid-session on this tab
      const uid = localStorage.getItem('jh_auth_uid');
      const cur = useAuthStore.getState().user?.id;
      if (uid && cur != null && String(uid) !== String(cur)) {
        window.location.reload();
      }
      if (!localStorage.getItem('jh_token') && !localStorage.getItem('accessToken')) {
        // Logged out in another tab
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        } else if (window.location.pathname.startsWith('/dashboard')) {
          window.location.href = '/signup';
        }
      }
    }
  });
}

export default useAuthStore;
