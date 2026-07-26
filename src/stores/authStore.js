import { create } from 'zustand';
import * as authService from '../services/authService.js';

const TOKEN_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';
const USER_KEY = 'jh_user';
const LEGACY_TOKEN = 'jh_token';

function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession({ accessToken, refreshToken, user }) {
  if (accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(LEGACY_TOKEN, accessToken);
  }
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LEGACY_TOKEN);
}

const useAuthStore = create((set, get) => ({
  user: loadUser(),
  accessToken: localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN),
  refreshToken: localStorage.getItem(REFRESH_KEY),
  loading: false,
  error: null,

  isAuthenticated: () => Boolean(get().accessToken && get().user),

  setSession: (payload) => {
    const { accessToken, refreshToken, user } = payload;
    persistSession({ accessToken, refreshToken, user });
    set({
      accessToken,
      refreshToken,
      user,
      error: null,
    });
  },

  clearError: () => set({ error: null }),

  sendOtp: async ({ channel, destination }) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.sendOtp({ channel, destination });
      set({ loading: false });
      return data;
    } catch (e) {
      const msg = e?.response?.data?.error?.message || e.message || 'Failed to send OTP';
      set({ loading: false, error: msg });
      throw new Error(msg);
    }
  },

  verifyOtp: async ({ channel, destination, code, name }) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.verifyOtp({ channel, destination, code, name });
      get().setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
      set({ loading: false });
      return data;
    } catch (e) {
      const msg = e?.response?.data?.error?.message || e.message || 'Invalid OTP';
      set({ loading: false, error: msg });
      throw new Error(msg);
    }
  },

  loginWithGoogle: async (credential) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.googleLogin(credential);
      get().setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
      set({ loading: false });
      return data;
    } catch (e) {
      const msg = e?.response?.data?.error?.message || e.message || 'Google sign-in failed';
      set({ loading: false, error: msg });
      throw new Error(msg);
    }
  },

  refreshSession: async () => {
    const refreshToken = get().refreshToken || localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) throw new Error('No refresh token');
    const data = await authService.refreshTokens(refreshToken);
    get().setSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    });
    return data;
  },

  fetchMe: async () => {
    try {
      const user = await authService.fetchMe();
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ user });
      return user;
    } catch {
      get().logout();
      return null;
    }
  },

  logout: async () => {
    const refreshToken = get().refreshToken;
    clearSession();
    set({ user: null, accessToken: null, refreshToken: null, error: null });
    if (refreshToken) await authService.logout(refreshToken);
  },
}));

export default useAuthStore;
